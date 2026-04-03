import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/helpers/response.interceptor';
import { HttpExceptionFilter } from './common/helpers/response.error_sql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);


  const enableCors = configService.get<boolean>('cors.enable', false);
  const origins = configService.get<string[]>('cors.origins');

  if (enableCors) {
    app.enableCors({
      origin: origins,
      credentials: true, // Cho phép gửi cookie
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    console.log(`✅ CORS enabled for: ${(origins ?? []).join(', ')}`);
  } else {
    console.log('🚫 CORS disabled');
  }

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // await app.listen(process.env.PORT ?? 4000);
  await app.listen(8080);
}

bootstrap();
