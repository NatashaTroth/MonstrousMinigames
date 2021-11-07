export default class InvalidUrlError extends Error {
    userId: string;
    constructor(message = 'The received value for the URL is not valid.', userId = '') {
        super(message);
        this.name = 'InvalidUrlError';
        Error.captureStackTrace(this, InvalidUrlError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, InvalidUrlError.prototype);
    }
}
