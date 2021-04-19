export default class MaxNumberUsersExceededError extends Error {
    maxNumberOfUsers: number;
    constructor(
        message = 'Cannot perform this action, since max number of users was exceeded.',
        maxNumberUsers: number
    ) {
        super(message);
        this.name = 'MaxNumberUsersExceededError';
        Error.captureStackTrace(this, MaxNumberUsersExceededError);
        this.maxNumberOfUsers = maxNumberUsers;

        //for typescript
        Object.setPrototypeOf(this, MaxNumberUsersExceededError.prototype);
    }
}
