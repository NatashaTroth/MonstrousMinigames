export default class WrongUserIdError extends Error {
    userId: string;
    constructor(message: string, userId: string) {
        super(message);
        this.name = 'WrongUserIdError';
        Error.captureStackTrace(this, WrongUserIdError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, WrongUserIdError.prototype);
    }
}
