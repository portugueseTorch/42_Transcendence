import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private httpService: HttpService) {}

	/***** EMAIL AUTHENTICATION *****/
	/*** SIGNUP ***/
	async emailSignup(dto: AuthDto) {
		// Hash password
		dto.password = await argon.hash(dto.password);

		// If no username was provided, generate a random one
		if (dto.username === '')
			dto.username = await this.getRandomName();

		try {
			// Create and add user to db
			const new_user = await this.prisma.user.create({
				data: {
					...dto,
					status: 'offline'
				}
			});

			// Remove password from user object and return it
			delete new_user.password;
			return new_user;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new ForbiddenException('Email or username already in use');
			throw error;
		}
	}

	/*** LOGIN ***/
	async emailLogin(dto: AuthDto) {
		// Find user by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		// If the user doesn't exist, throw
		if (!user)
			throw new ForbiddenException('User does not exist');

		// Check if provided password matches that of current user
		const passwordMatches = await argon.verify(user.password, dto.password);

		// If it doesn't, throw
		if (!passwordMatches)
			throw new ForbiddenException('Invalid password');

		// Update user status
		if (user.status == 'offline') {
			await this.prisma.user.update({
				where: { email: dto.email },
				data: { status: 'online' }
			});
		}

		// Return user
		return this.signToken(user.id, user.email);
	}

	/*** LOGOUT ***/
	async logout(dto: AuthDto) {
		await this.prisma.user.update({
			where: {
				email: dto.email,
			},
			data: {
				status: 'offline',
			}
		});
		return { msg: 'Successfully logged out' };
	}

	async signToken(userId: number, email: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');
		const access_token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret,
		});
		return { access_token };
	}

	/*** USING RANDOM NAME GENERATOR API ***/
	private async getRandomName(): Promise<string> {
		const { data } = await firstValueFrom(
			this.httpService.get('https://randomuser.me/api/').pipe(
			  catchError(() => {
				throw new ForbiddenException('Missing username');
			  }),
			),
		);
		const username = data.results[0]?.login?.username;
		return username;
	}
}
