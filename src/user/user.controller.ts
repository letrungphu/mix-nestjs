import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { errorResponse, successResponse } from 'src/common/helpers/response';
import { Public } from 'src/common/decorator/decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('register')
  register(@Body() body: { user_name: string, password: string, email: string, role: string }) {
    const { user_name, password, email, role } = body;
    return this.userService.registerUser(user_name, password, email, role);
  }

  @Post('getMe')
  getMe(@Body() body: { user_name: string }) {
    const { user_name } = body;
    return this.userService.getMe({user_name});
  }

  @Get('getAllUser')
  async getAllUser() {
    return this.userService.getAllUsers();
  }

  @Post('getProfile')
  async getUserByUsername(@Body('id') id: number) {
    return this.userService.getMe(id);
  }

  @Public()
  @Post('logOut')
  async logOut() {
    return {
      statusCode: 200,
      message: 'Success'
    }
  }

  @Post('getUserCondition')
  async getUserCondition(@Body() body: { id: string, email: string }) {
    const { id, email } = body;
    const user1 = await this.userService.getUserCondition1({ id, email });
    const user2 = await this.userService.getUserCondition2({ id, email });
    const responseData = {
      user1: user1,
      user2: user2
    }

    const hasError = typeof user1 === 'object' && 'statusCode' in user1 && user1.statusCode !== 200 ||
      typeof user2 === 'object' && 'statusCode' in user2 && user2.statusCode !== 200;

    if (hasError) {
      return {
        statusCode: 100,
        message: 'Failed',
        data: responseData
      };
    }

    return successResponse(responseData);
  }

  @Post('getDailyAttendance')
  async getDailyAttendance(@Body() body: { name: string, work_date: string }) {
    const { name, work_date } = body;

    const listNamee = await this.userService.getNameDailyAttendance({ name, work_date });
    const listDeptt = await this.userService.getDeptDailyAttendance({ name, work_date });


    const responseData = {
      listName: listNamee,
      listDept: listDeptt
    }

    // const hasError = listNamee?.statusCode && listNamee.statusCode !== 200 ||
    //   listDeptt?.statusCode && listDeptt.statusCode !== 200;


    // if (hasError) {
    //   return {
    //     statusCode: 100,
    //     message: 'Failed',
    //     data: responseData
    //   };
    // }

    const isListNameError = listNamee?.statusCode && listNamee.statusCode !== 200;
    const isListDeptError = listDeptt?.statusCode && listDeptt.statusCode !== 200;

    if (isListNameError || isListDeptError) {
      return {
        statusCode: 100,
        message: 'Failed',
        data: []
      };
    }

    return successResponse(responseData);
  }
}
