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
    async signIn(@Body() body: { user_name: string, password: string }) {
        const { user_name, password } = body;
        return this.authService.signIn(user_name, password);
    }

    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @Post('register')
    // register(@Body() body: { user_name, password, email, role }) {
    //     const { user_name, password, email, role } = body;
    //     return this.authService.register(user_name, password, email, role);
    // }

    // @UseGuards(AuthGuard)
    @Public()
    @Get('profile')
    getProfile(@Request() req) {
        return 'OKE';
    }
}
