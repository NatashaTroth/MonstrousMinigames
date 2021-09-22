export default class ObstacleNotSkippable extends Error {
    userId: string;
    obstacleId: number;
    constructor(message = 'Cannot perform this action, since the obstacle is not skippable.', userId = '', obstacleId = 0) {
        super(message);
        this.name = 'ObstacleNotSkippable';
        Error.captureStackTrace(this, ObstacleNotSkippable);
        this.userId = userId;
        this.obstacleId = obstacleId;

        //for typescript
        Object.setPrototypeOf(this, ObstacleNotSkippable.prototype);
    }
}
