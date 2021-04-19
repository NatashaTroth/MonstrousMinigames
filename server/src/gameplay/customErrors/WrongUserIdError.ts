export default class WrongUserIdError extends Error {
    userId: string;
    constructor(message = 'Cannot perform this action, since this user does not exist.', userId: string) {
        super(message);
        this.name = 'WrongUserIdError';
        Error.captureStackTrace(this, WrongUserIdError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, WrongUserIdError.prototype);
    }
}
