export default class CannotStartEmptyGameError extends Error {
    constructor(message = 'The game cannot start because there are no players connected.') {
        super(message);
        this.name = 'CannotStartEmptyGameError';
        //for typescript
        Object.setPrototypeOf(this, CannotStartEmptyGameError.prototype);
    }
}
