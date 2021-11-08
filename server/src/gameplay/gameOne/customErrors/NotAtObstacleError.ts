export default class NotAtObstacleError extends Error {
    userId: string;
    constructor(message = 'Cannot perform this action, since user is not at an obstacle.', userId = '') {
        super(message);
        this.name = 'NotAtObstacleError';
        Error.captureStackTrace(this, NotAtObstacleError);
        this.userId = userId;

        //for typescript
        Object.setPrototypeOf(this, NotAtObstacleError.prototype);
    }
}
