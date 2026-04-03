import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as oracle from 'oracledb';
import { UserQuery } from './user.query';
import { successResponse, errorResponse } from 'src/common/helpers/response';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {

  constructor(private db: DatabaseService) { }

  async getAllUsers() {
    const sql = UserQuery.getAllUser();
    try {
      // const [rows] = await this.mysqlPool.query(sql);
      const [rows] = await this.db.getMysql().query(sql);
      return successResponse(rows);
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }

    // return (rows as UserRow[]).map(UserMapper.toUserDTO);
  }

  async registerUser(email, password, user_name, role, birthday) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const sql = UserQuery.resgisterUser(email, hashedPassword, user_name, role, birthday);
    try {
      const [register] = await this.db.getMysql().query<mysql.ResultSetHeader>(sql);

      if (register.affectedRows > 0) {
        const profile = UserQuery.getMe(email);

        const [resultProfile] = await this.db.getMysql().query(profile);

        return {
          statusCode: 200,
          message: 'Success',
          data: resultProfile[0],
        }
      }
    } catch (error) {
      return errorResponse(error.errNum || 500);
    }
  }

  async getMe(email: any) {
    const sql = UserQuery.getMe(email);
    try {
      const [rows] = await this.db.getMysql().query(sql);
      return rows;
    } catch (error: any) {
      throw error;
      // return errorResponse(error.errorNum || 500);
    }
  }

  async updateProfile(user_name: any, birthday: any, email: any) {
    const sql = UserQuery.updateProfile(user_name, birthday, email);
    console.log("sql: ", sql);
    try {
      const [rows] = await this.db.getMysql().query<mysql.ResultSetHeader>(sql);
      if (rows.affectedRows > 0) {
        return {
          statusCode: 200,
          message: 'Success',
        }
      }
    } catch (error: any) {
      return errorResponse(error.errNum || 500);
    }
  }

  // async signIn(user_name: any) {
  //   const sql = UserQuery.getMe(user_name);
  //   try {
  //     const [rows] = await this.mysqlPool.query(sql);
  //     return rows;
  //   } catch (error) {
  //     return errorResponse(error.errorNum || 500);
  //   }
  // }

  async getUserCondition1({ id, email }) {
    const sql = UserQuery.getUserCondition1(id, email);
    try {
      const [rows] = await this.db.getMysql().query(sql);
      return rows;
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
  }

  async getUserCondition2({ id, email }) {
    const sql = UserQuery.getUserCondition2(id, email);
    try {
      const [rows] = await this.db.getMysql().query(sql);
      return rows;
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
  }


  async getNameDailyAttendance({ name, work_date }) {
    const sql = UserQuery.getNameDailyAttendance(name, work_date);
    let connection;
    try {
      connection = await this.db.getOracle().getConnection();
      const result = await connection.execute(sql, [], { outFormat: oracle.OUT_FORMAT_OBJECT });

      const rows = result.rows ?? [];
      return rows
    } catch (err) {
      return errorResponse(err.errorNum || 500);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection: ', err);
          return err;
        }
      }
    }
  }

  async getDeptDailyAttendance({ name, work_date }) {
    const sql = UserQuery.getDeptDailyAttendance(name, work_date);
    let connection;
    try {
      connection = await this.db.getOracle().getConnection();
      const result = await connection.execute(sql, [], { outFormat: oracle.OUT_FORMAT_OBJECT });
      const rows = result.rows ?? [];

      return rows
    } catch (err) {
      return errorResponse(err.errorNum || 500);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection: ', err);
          return err;
        }
      }
    }
  }

  async getDataProduction({ work_date }) {
    const sql = UserQuery.getDataProduction(work_date);

    let connection;
    try {
      connection = await this.db.getOracle().getConnection();
      const result = await connection.execute(sql, [], { outFormat: oracle.OUT_FORMAT_OBJECT });

      const rows = result.rows ?? [];

      return rows;
    } catch (err) {
      return errorResponse(err.errNum || 500);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection: ', err);
          return err;
        }
      }
    }
  }



}
