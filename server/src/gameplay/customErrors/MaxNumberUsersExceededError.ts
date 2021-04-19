export default class MaxNumberUsersExceededError extends Error {
    maxNumberOfUsers: number;
    constructor(message: string, maxNumberUsers: number) {
        super(message);
        this.name = 'MaxNumberUsersExceededError';
        Error.captureStackTrace(this, MaxNumberUsersExceededError);
        this.maxNumberOfUsers = maxNumberUsers;

        //for typescript
        Object.setPrototypeOf(this, MaxNumberUsersExceededError.prototype);
    }
}
