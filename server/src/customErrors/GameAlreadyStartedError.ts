export default class GameAlreadyStartedError extends Error {
    constructor(message = 'Cannot join a running game.') {
        super(message);
        this.name = 'GameAlreadyStartedError';
        //for typescript
        Object.setPrototypeOf(this, GameAlreadyStartedError.prototype);
    }
}
