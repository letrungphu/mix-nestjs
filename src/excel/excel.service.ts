import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { ExcelQuery } from './excel.query';
import { errorResponse } from 'src/common/helpers/response';

@Injectable()
export class ExcelService {
  private mysqlPool: mysql.Pool;

  constructor(private config: ConfigService) { }

  async onModuleInit() {
    // MySQL pool (đồng bộ)
    const mysqlConfig = this.config.get('database').mysql;
    this.mysqlPool = mysql.createPool({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      port: mysqlConfig.port,
    });
  }

  async importExcel(arrData, general) {
    try {
      const sql = ExcelQuery.importExcel(arrData, general);
      const [rows] = await this.mysqlPool.query<mysql.ResultSetHeader>(sql);
      if (rows.affectedRows > 0) {
        return {
          statusCode: 200,
          message: 'Success',
          data: []
        }
      }else{
        return {
          statusCode: 100,
          message: 'Failed',
          data: []
        }
      }
    } catch (error) {
      return errorResponse(error.errorNum || 500);
    }
  }
}
