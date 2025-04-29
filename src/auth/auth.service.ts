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

    async signIn(user_name: string, pass: string): Promise<any> {
        const user = await this.userService.getMe(user_name);

        if (!user[0]) {
            throw new UnauthorizedException('Wrong user or pass');
        }

        const isPasswordValid = await bcrypt.compare(pass, user[0].password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload = { sub: user[0]?.user_name, email: user[0]?.email };
        // return successResponse({
        //     user:user[0],
        //     access_token: await this.jwtService.signAsync(payload),
        // });
        return {
            access_token: await this.jwtService.signAsync(payload),
            statusCode: 200,
            message: 'Success',
            data: user[0],
        }
        // access_token: await this.jwtService.signAsync(payload),
    }

    // async register(user_name: string, password: string, email: string, role: string): Promise<any> {
    //     const saltOrRounds = 10;
    //     const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    //     const result = await this.userService.registerUser({ user_name, password: hashedPassword, email, role });
    //     console.log('result; ', result);

    //     return result;
    // }
}
