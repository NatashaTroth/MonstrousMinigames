import { GameState } from '../interfaces';

export default class WrongGameStateError extends Error {
    requiredGameStates: Array<GameState>;
    constructor(
        message = 'Cannot perform this action, as it is not available with the current gamestate.',
        requiredGameStates: Array<GameState>
    ) {
        super(message);
        this.name = 'WrongGameStateError';
        Error.captureStackTrace(this, WrongGameStateError);
        this.requiredGameStates = requiredGameStates;

        //for typescript
        Object.setPrototypeOf(this, WrongGameStateError.prototype);
    }
}
