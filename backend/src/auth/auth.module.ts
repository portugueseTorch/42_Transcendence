import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [JwtModule.register({}), HttpModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
