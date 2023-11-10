import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// Signup endpoint
	@Post('signup')
	googleSignup(@Body() dto: AuthDto) {
		return this.authService.emailSignup(dto);
	}

	// Login endpoint
	@Post('login')
	googleLogin(@Body() dto: AuthDto) {
		return this.authService.emailLogin(dto);
	}
}
