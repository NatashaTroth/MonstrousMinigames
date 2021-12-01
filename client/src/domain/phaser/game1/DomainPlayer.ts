export class DomainPlayer {
    isMoving = false;
    name: string;
    id: string;
    isAtObstacle = false;
    isDead = false;
    isStunned = false;
    isFinished = false;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    startMoving() {
        this.isMoving = true;
    }

    stopMoving() {
        this.isMoving = false;
    }

    arrivedAtObstacle() {
        this.isAtObstacle = true;
    }

    finishedObstacle() {
        this.isAtObstacle = false;
    }

    died() {
        this.isDead = true;
    }

    stun() {
        this.isStunned = true;
    }

    unstun() {
        this.isStunned = false;
    }

    finished() {
        this.isFinished = true;
    }
}
