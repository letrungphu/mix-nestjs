const STATUS_MESSAGES: Record<number, string> = {
    100: 'Failed',
    200: 'Success',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',

    904: 'Invalid Identifier(Unknow Column) in Oracle',
    903: 'Invalid Table Name in Oracle',
    933: 'SQL command not properly ended in oracle',
    942: 'Table or View does not exist in Oracle',
    1017: 'Invalid Username/Password in Oracle',
};


export function successResponse(data: any = {}) {
    let formatData;
    if (Array.isArray(data)) {
        formatData = data.map(item => convertKeyToLowerCase(item));
    } else if (typeof data === 'object' && data !== null) {
        formatData = {};
        for (const key in data) {
            const value = data[key];
            if (Array.isArray(value)) {
                formatData[key] = value.map(item => convertKeyToLowerCase(item));
            } else {
                formatData[key] = value;
            }
        }
    } else {
        formatData = [];
    }
    return {
        statusCode: 200,
        message: getMessage(200),
        data: formatData,
    };
}

export function errorResponse(errorCode: number = 500, error?: any) {
    if (error) {
        console.error(error);
    }
    return {
        statusCode: errorCode,
        message: getMessage(errorCode),
        data: [],
    };
}

// export function errorResponse(errorCode: number = 500) {
//     return {
//         statusCode: errorCode,
//         message: getMessage(errorCode),
//         data: [],
//     };
// }

function getMessage(statusCode: number): string {
    return STATUS_MESSAGES[statusCode] || 'Unknown Error';
}

function convertKeyToLowerCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeyToLowerCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key.toLowerCase(),
                convertKeyToLowerCase(value)
            ])
        );
    }
    return obj;
}

// function convertKeyToLowerCase(obj: Record<string, any>): Record<string, any> {
//     return Object.fromEntries(
//         Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
//     );
// }
