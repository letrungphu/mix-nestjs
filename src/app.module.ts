import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ExcelModule } from './excel/excel.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    AuthModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
