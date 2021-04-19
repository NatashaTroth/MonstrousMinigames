export default class DisconnectedUserError extends Error {
    userId: string;
    constructor(message: string, userId: string) {
        super(message);
        this.name = 'DisconnectedUserError';
        Error.captureStackTrace(this, DisconnectedUserError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, DisconnectedUserError.prototype);
    }
}
