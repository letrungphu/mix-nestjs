import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mysql: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  oracle: {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SID}`,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  },
  type: process.env.DB_TYPE || 'mysql',
}));