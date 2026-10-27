export class Error {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export type Result<T> =
    | { success: true; value: T }
    | { success: false; error: Error };

export function ok<T>(value: T): Result<T> {
    return { success: true, value };
}

export function err(message: string): Result<never> {
    return { success: false, error: new Error(message) };
}

export function mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
    if (result.success) {
        return ok(fn(result.value));
    } else {
        return err(result.error.message);
    }
}
