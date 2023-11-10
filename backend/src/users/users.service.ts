import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	/*** LOGOUT ***/
	async logout() {
		// try {
		// 	await this.prisma.user.update({
		// 		where: {
		// 			email: dto.email,
		// 		},
		// 		data: {
		// 			status: 'offline',
		// 		}
		// 	});
		// 	return { msg: 'Successfully logged out' };
		// } catch(error) {
		// 	if (error instanceof PrismaClientKnownRequestError)
		// 		throw new ForbiddenException('Client does not exist');
		// 	throw error;
		// }
		return { msg: 'Successfully logged out' };
	}
}
