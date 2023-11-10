import { Body, Controller, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	// Logout endpoint
	@Patch('logout')
	logout() {
		// return this.authService.logout(dto);
	}
}
