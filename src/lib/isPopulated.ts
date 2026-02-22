export function isPopulated<T>(obj: any): obj is T {
    return obj && typeof obj === 'object' && '_id' in obj;
}