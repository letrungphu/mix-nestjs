import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as oracle from 'oracledb';
import { UserQuery } from './user.query';
import { UserMapper } from './user.mapper';
import { ConfigService } from '@nestjs/config';
import UserRow from './UserRow';
import { successResponse, errorResponse } from 'src/common/helpers/response';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
// import * from '../../instantclient_11_2'


@Injectable()
export class UserService {
  private mysqlPool: mysql.Pool;
  private oraclePool: oracle.Pool;

  constructor(private config: ConfigService) { }

  async onModuleInit() {
    try {
      const oracleClientDir = path.join(__dirname, '../../instantclient_11_2'); 
      console.log('>>> ', oracleClientDir);
      oracle.initOracleClient({
        // libDir: 'D:\\instantclient_11_2', // Đường dẫn đến Instant Client 11g
        libDir: oracleClientDir
      });
    } catch (err) {
      console.error('⚠️ Lỗi khởi tạo Oracle Client:', err);
      throw err;
    }

    // MySQL pool (đồng bộ)
    const mysqlConfig = this.config.get('database').mysql;
    this.mysqlPool = mysql.createPool({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      port: mysqlConfig.port,
    });

    // Oracle pool (bất đồng bộ)
    const oracleConfig = this.config.get('database').oracle;
    this.oraclePool = await oracle.createPool({
      user: oracleConfig.user,
      password: oracleConfig.password,
      connectString: oracleConfig.connectString, // ví dụ: "10.101.1.200:1552/hsvDSH"
    });

    console.log('✅ MySQL & Oracle pool initialized');
  }

  async getAllUsers() {
    const sql = UserQuery.getAllUser();
    try {
      const [rows] = await this.mysqlPool.query(sql);
      return successResponse(rows);
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
    
    // return (rows as UserRow[]).map(UserMapper.toUserDTO);
  }

  async registerUser( user_name, password, email, role ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const sql = UserQuery.resgisterUser(user_name, hashedPassword, email, role);
    try {
      const [register] = await this.mysqlPool.query<mysql.ResultSetHeader>(sql);
      if (register.affectedRows > 0) {
        const profile = UserQuery.getMe(user_name);

        const [resultProfile] = await this.mysqlPool.query(profile);

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

  async getMe(user_name: any) {
    const sql = UserQuery.getMe(user_name);
    try {
      const [rows] = await this.mysqlPool.query(sql);
      return rows;
    } catch (error) {
      return errorResponse(error.errorNum || 500);
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
      const [rows] = await this.mysqlPool.query(sql);
      return rows;
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
  }

  async getUserCondition2({ id, email }) {
    const sql = UserQuery.getUserCondition2(id, email);
    try {
      const [rows] = await this.mysqlPool.query(sql);
      return rows;
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
  }


  async getNameDailyAttendance({ name, work_date }) {
    const sql = UserQuery.getNameDailyAttendance(name, work_date);
    let connection;
    try {
      connection = await this.oraclePool.getConnection();
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
      connection = await this.oraclePool.getConnection();
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



}
