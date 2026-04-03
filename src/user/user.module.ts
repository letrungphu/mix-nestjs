import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserMapper } from './user.mapper';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[ConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports:[UserService],
})
export class UserModule {}
