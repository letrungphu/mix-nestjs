import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // 👉 Nếu data có total (pagination hoặc custom)
                if (data && typeof data === 'object' && 'total' in data && 'rows' in data) {
                    return {
                        statusCode: 200,
                        message: getMessage(200),
                        total: data.total, // ✅ đưa ra ngoài
                        data: data.rows.map((item: any) =>
                            convertKeyToLowerCase(item),
                        ),
                    };
                }

                // 👉 Nếu data là array bình thường → tự tính total
                if (Array.isArray(data)) {
                    return {
                        statusCode: 200,
                        message: getMessage(200),
                        total: data.length, // ✅ tự tính
                        data: data.map((item) =>
                            convertKeyToLowerCase(item),
                        ),
                    };
                }

                // 👉 object thường
                if (typeof data === 'object' && data !== null) {
                    return {
                        statusCode: 200,
                        message: getMessage(200),
                        total: 1,
                        data: [convertKeyToLowerCase(data)],
                    };
                }

                return {
                    statusCode: 200,
                    message: getMessage(200),
                    total: 0,
                    data: [],
                };
            }),
        );
    }
}


const STATUS_MESSAGES: Record<number, string> = {
    200: 'Success',
};

function getMessage(code: number) {
    return STATUS_MESSAGES[code] || 'Unknown';
}

function convertKeyToLowerCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeyToLowerCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key.toLowerCase(),
                convertKeyToLowerCase(value),
            ]),
        );
    }
    return obj;
}