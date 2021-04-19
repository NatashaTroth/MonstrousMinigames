export default class DisconnectedUserError extends Error {
    userId: string;
    constructor(message = 'Cannot perform this action, since this user was disconnected.', userId: string) {
        super(message);
        this.name = 'DisconnectedUserError';
        Error.captureStackTrace(this, DisconnectedUserError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, DisconnectedUserError.prototype);
    }
}
