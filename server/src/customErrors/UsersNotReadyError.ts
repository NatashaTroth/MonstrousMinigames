export default class UsersNotReadyError extends Error {
    constructor(message = 'The game cannot start because some players are not ready.') {
        super(message);
        this.name = 'UsersNotReadyError';
        //for typescript
        Object.setPrototypeOf(this, UsersNotReadyError.prototype);
    }
}
