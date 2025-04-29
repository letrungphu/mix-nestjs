import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserMapper } from './user.mapper';

@Module({
  imports:[ConfigModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports:[UserService],
})
export class UserModule {}
