import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { errorResponse, successResponse } from 'src/common/helpers/response';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private jwtService: JwtService
    ) { }

    async logIn(emaill: string, pass: string): Promise<any> {
        const email = await this.userService.getMe(emaill);

        if (!email[0]) {
            throw new UnauthorizedException('Wrong user or pass');
        }

        const isPasswordValid = await bcrypt.compare(pass, email[0].password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload = { sub: email[0]?.email, user: email[0]?.user_name };

        return {
            access_token: await this.jwtService.signAsync(payload),
            statusCode: 200,
            message: 'Success',
            data: email[0],
        }
        // access_token: await this.jwtService.signAsync(payload),
    }

    // async register(email: string, user_name: string, password: string, role: string, birthday: string): Promise<any> {
    //     const saltOrRounds = 10;
    //     const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    //     const result = await this.userService.registerUser(email, user_name, password, role, birthday);
    //     console.log('result; ', result);

    //     return result;
    // }
}
