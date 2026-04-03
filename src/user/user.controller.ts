import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { errorResponse, successResponse } from 'src/common/helpers/response';
import { Public } from 'src/common/decorator/decorator';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { buildCacheKey } from 'src/common/helpers/redis_cache_key';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  // Nếu Postman gửi JSON có chữ data thì dùng thế này
  // @Public()
  // @Post('register')
  // register(@Body() body: { data:{ user_name: string, password: string, email: string, role: string }}) {
  //   const { user_name, password, email, role } = body.data;
  //   return this.userService.registerUser(user_name, password, email, role);
  // }

  // Nếu Postman gửi JSON ko chữ data thì dùng thế này
  @Public()
  @Post('register')
  register(@Body() body: { email: string, password: string, user_name: string, role: string, birthday: string }) {
    const { email, password, user_name, role, birthday } = body;
    return this.userService.registerUser(email, password, user_name, role, birthday);
  }

  @Post('getMe')
  getMe(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.getMe( email );
  }

  // @UseGuards(AuthGuard)
  @Post('updateProfile')
  updateProfile(@Body() body: { data: { user_name: string, birthday: string, email: string } }) {
    const { user_name, birthday, email } = body.data;
    return this.userService.updateProfile(user_name, birthday, email);
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

  // @Post('getDataProduction')
  // async getDataProduction(@Body() body: { work_date: string}) {
  //   const {work_date} = body;

  //   const listProduction = await this.userService.getDataProduction({work_date});

  //   const isListDataLoadPlanError = listProduction?.statusCode && listProduction.statusCode !== 200;

  //   if (isListDataLoadPlanError) {
  //     return {
  //       statusCode: 100,
  //       message: 'Failed',
  //       data: []
  //     };
  //   }
  //   return successResponse(listProduction);
  // }

  @Post('getDataProduction')
  async getDataProduction(@Body() body: { work_date: string }) {
    const { work_date } = body;

    // const cacheKey = `production:${work_date}`;
    const cacheKey = buildCacheKey('production-list', { work_date });
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(">>> get from Redis Cache");
      // return successResponse(cachedData);
      return cachedData;
    }

    const listProduction = await this.userService.getDataProduction({ work_date });

    const isListDataLoadPlanError = listProduction?.statusCode && listProduction.statusCode !== 200;

    if (isListDataLoadPlanError) {
      return {
        statusCode: 100,
        message: 'Failed',
        data: []
      };
    }

    // Lưu vào Redis cache cho lần sau
    await this.cacheManager.set(cacheKey, listProduction, { ttl: 60 * 5 } as any); // cache 5 phút

    // return successResponse(listProduction);
    return listProduction;
  }

}
