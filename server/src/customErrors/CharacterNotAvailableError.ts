export default class CharacterNotAvailableError extends Error {
    constructor(message = 'The selected character is not available.') {
        super(message);
        this.name = 'CharacterNotAvailableError';
        //for typescript
        Object.setPrototypeOf(this, CharacterNotAvailableError.prototype);
    }
}
