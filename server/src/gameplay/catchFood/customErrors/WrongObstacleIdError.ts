export default class WrongObstacleIdError extends Error {
    userId: string;
    obstacleId: number;
    constructor(message = 'Cannot perform this action, since no obstacle id is wrong.', userId = '', obstacleId = 0) {
        super(message);
        this.name = 'WrongObstacleIdError';
        Error.captureStackTrace(this, WrongObstacleIdError);
        this.userId = userId;
        this.obstacleId = obstacleId;

        //for typescript
        Object.setPrototypeOf(this, WrongObstacleIdError.prototype);
    }
}
