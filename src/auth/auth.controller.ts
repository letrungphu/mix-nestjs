import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/common/decorator/decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async logIn(@Body() body: { email: string, password: string }) {
        const { email, password } = body;
        return this.authService.logIn(email, password);
    }

    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @Post('register')
    // register(@Body() body: { email, user_name, password, role, birthday }) {
    //     const { email, user_name, password, role, birthday } = body;
    //     console.log(">>>>>");
    //     return this.authService.register(email, user_name, password, role, birthday);
    // }

    // @UseGuards(AuthGuard)
    @Public()
    @Get('profile')
    getProfile(@Request() req) {
        return 'OKE';
    }
}
