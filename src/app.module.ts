import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ExcelModule } from './excel/excel.module';
import databaseConfig from './config/database.config';
import { redisStore } from 'cache-manager-ioredis-yet';
import corsConfig from './config/cors.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, corsConfig],
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.USE_REDIS === 'true') {
          return {
            store: await redisStore({
              socket: {
                host: 'localhost',
                port: 6379,
              },
              ttl: 60,
            }),
          };
        }

        // fallback về in-memory cache
        return {
          ttl: 60,
        };
      },
    }),
    UserModule,
    AuthModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
