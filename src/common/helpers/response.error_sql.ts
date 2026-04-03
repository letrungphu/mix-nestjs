import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;

    // 👉 NestJS error
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }

    // 👉 MySQL error
    else if (exception?.code === 'ER_DUP_ENTRY') {
      statusCode = 409;
    } else if (exception?.code === 'ER_BAD_FIELD_ERROR') {
      statusCode = 400;
    } else if (exception?.code === 'ER_NO_SUCH_TABLE') {
      statusCode = 404;
    }

    // 👉 Oracle error
    else if (exception?.errorNum === 904) {
      statusCode = 904;
    } else if (exception?.errorNum === 903) {
      statusCode = 903;
    } else if (exception?.errorNum === 933) {
      statusCode = 933;
    } else if (exception?.errorNum === 942) {
      statusCode = 942;
    } else if (exception?.errorNum === 1017) {
      statusCode = 1017;
    }

    console.error(exception);

    response.status(200).json({
      statusCode,
      message: getMessage(statusCode),
      data: [],
    });
  }
}

// ===== helper =====
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',

  904: 'Invalid Identifier (Unknown Column) in Oracle',
  903: 'Invalid Table Name in Oracle',
  933: 'SQL command not properly ended in Oracle',
  942: 'Table or View does not exist in Oracle',
  1017: 'Invalid Username/Password in Oracle',
};

function getMessage(code: number) {
  return STATUS_MESSAGES[code] || 'Unknown Error';
}