import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import e from 'express';

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

  // await app.listen(process.env.PORT ?? 4000);
  await app.listen(8080);
}

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);

//   // 1. Lấy config ĐÚNG CÁCH
//   const enableCors = configService.get<boolean>('CORS_ENABLE', true); // default true
//   const origins = configService.get<string[]>('CORS_ORIGINS', [
//     'http://localhost:3000', 
//     'http://127.0.0.1:3000'
//   ]);

//   console.log('🔍 CORS Config:', { enableCors, origins });

//   // 2. ENABLE CORS TRƯỚC KHI LISTEN
//   if (enableCors) {
//     app.enableCors({
//       origin: origins,
//       // origin: 'http://localhost:3000',
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//     });
//     // console.log(`✅ CORS enabled for: ${origins.join(', ')}`);
//     // console.log(`✅ CORS enabled for: ${(origins ?? []).join(', ')}`);
//   } else {
//     console.log('🚫 CORS disabled');
//   }

//   // 3. START SERVER SAU CÙNG
//   const port = process.env.PORT ?? 4000;
//   await app.listen(port);
//   console.log(`🚀 Application is running on: http://localhost:${port}`);
// }

bootstrap();
