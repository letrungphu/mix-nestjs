import * as crypto from 'crypto';

/**
 * Tạo cache key duy nhất từ API path + query params
 * @param prefix Tên API or prefix riêng Ex: production-list
 * @param params Object chứa query params
 */

export function buildCacheKey(prefix: string, params: Record<string, any> = {}): string {
    // Sort key để tránh case: {a:1,b:2} và {b:2,a:1} -> Cùng key
    const sortedKeys = Object.keys(params).sort();
    const sortedParams: Record<string, any> = {};
    sortedKeys.forEach(key => {
        sortedParams[key] = params[key];
    });

    // Serialize thành JSON
    const paramString = JSON.stringify(sortedParams);

    // Tạo hash từ paramString để tranh key quá dài
    const hash = crypto.createHash('md5').update(paramString).digest('hex');

    return `${prefix}:${hash}`;
}