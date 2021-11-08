export default class UserHasNoStones extends Error {
    userId: string;
    constructor(message = 'Cannot perform this action, since the user does not have any stones.', userId = '') {
        super(message);
        this.name = 'UserHasNoStones';
        Error.captureStackTrace(this, UserHasNoStones);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, UserHasNoStones.prototype);
    }
}
