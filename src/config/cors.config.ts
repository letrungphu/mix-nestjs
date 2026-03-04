import { ConfigService, registerAs } from '@nestjs/config';
import { Injectable } from "@nestjs/common";

export default registerAs('cors', () => ({
    enable: process.env.ENABLE_CORS === 'true',
    origins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
        : [],
}));

// @Injectable()
// export class AppConfig {
//     constructor(private ConfigService: ConfigService) { }

//     get enableCors(): boolean {
//         return this.ConfigService.get<boolean>('ENABLE_CORS', false);
//     }

//     get allowedOrigins(): string[] {
//         return this.ConfigService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];
//     }
// }