import * as mysql from 'mysql2/promise';
import * as oracle from 'oracledb';
import * as path from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
    mysqlPool: mysql.Pool;
    oraclePool: oracle.Pool;

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

    getMysql() {
        return this.mysqlPool;
    }

    getOracle() {
        return this.oraclePool;
    }
}