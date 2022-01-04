import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { NotAtObstacleError, WrongObstacleIdError } from './customErrors';
import UserHasNoStones from './customErrors/UserHasNoStones';
import { ObstacleType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
import { Obstacle, PlayerState } from './interfaces';
import { ObstacleReachedInfoController } from './interfaces/GameEvents';

class GameOnePlayer extends Player implements PlayerState {
    static readonly EVT_UNSTUNNED = 'unstunned';

    finishedTimeMs = 0;
    atObstacle = false;
    stonesCarrying = 0;
    dead = false;
    stunned = false;
    stunnedSeconds = 0;
    chaserPushesUsed = 0;
    countRunsPerFrame = 0;
    maxRunsPerFrame = 2;
    stunnedTime = InitialParameters.STUNNED_TIME;
    maxNumberOfChaserPushes = InitialParameters.MAX_NUMBER_CHASER_PUSHES;

    constructor(
        id: string,
        name: string,
        public positionX: number,
        public obstacles: Obstacle[],
        public characterNumber: number,
        private trackLength: number,
        private roomId: string
    ) {
        super(id, name, characterNumber);
    }

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        if (this.stunned) {
            this.stunnedSeconds -= timeElapsedSinceLastFrame;
            if (this.stunnedSeconds <= 0) {
                this.stunned = false;
                this.emit(GameOnePlayer.EVT_UNSTUNNED, this);
            }
        }

        this.countRunsPerFrame = 0;
    }

    runForward(speed: number): void {
        verifyUserIsActive(this.id, this.isActive);

        if (this.playerIsNotAllowedToRun()) return;

        this.positionX += speed;
        this.countRunsPerFrame++;

        if (this.playerHasReachedObstacle()) this.handlePlayerReachedObstacle();
        if (this.playerIsApproachingSolvableObstacle()) this.handlePlayerApproachingSolvableObstacle();
        // if (this.playerHasPassedGoal()) this.playerHasFinishedGame();
    }

    verifyUserIsAtObstacle() {
        const solvableObstacleInReach = this.playerIsApproachingSolvableObstacle();

        if (
            this.atObstacle &&
            !solvableObstacleInReach
            // ||
            // player?.positionX !== player?.obstacles?.[0]?.positionX
        ) {
            throw new NotAtObstacleError(`User is not at an obstacle`, this.id);
        }
    }

    playerHasPassedGoal(): boolean {
        return this.positionX >= this.trackLength && this.obstacles.length === 0;
    }

    handlePlayerFinishedGame(finishedTimeMs: number, rank: number): void {
        this.updatePlayerStateFinished(finishedTimeMs);
        this.rank = rank; //this.rankSuccessfulUser(this.finishedTimeMs);
        this.positionX = this.trackLength;

        GameOneEventEmitter.emitPlayerHasFinishedEvent(this.roomId, this.id, this.rank);
    }

    updateRank(rank: number) {
        this.rank = rank;
    }

    updatePlayerStateFinished(finishedTimeMs = Date.now()) {
        this.finished = true;
        this.finishedTimeMs = finishedTimeMs;
    }

    stun() {
        if (this.playerIsNotAllowedToRun()) return;
        if (this.stunned || this.atObstacle) return;
        this.stunned = true;
        this.stunnedSeconds = this.stunnedTime;

        GameOneEventEmitter.emitPlayerIsStunned(this.roomId, this.id);
    }

    playerWantsToSolveObstacle(obstacleId: number): void {
        const obstacle = this.obstacles.find(obstacle => obstacle.id === obstacleId);
        if (!obstacle) return;
        obstacle.solvable = false;
        GameOneEventEmitter.emitPlayerWantsToSolveObstacle({ roomId: this.roomId, userId: this.id });
    }

    obstacleCompleted(obstacleId: number) {
        this.verifyUserIsAtObstacle();

        if (this.obstacles[0].id === obstacleId) {
            this.atObstacle = false;

            if (this.obstacles[0].type === ObstacleType.Stone) {
                this.stonesCarrying++;
            }

            this.obstacles.shift();
        } else {
            throw new WrongObstacleIdError(`${obstacleId} is not the id for the next obstacle.`, this.id, obstacleId);
        }
    }

    maxNumberPushChasersExceeded() {
        return this.chaserPushesUsed >= this.maxNumberOfChaserPushes;
    }

    pushChasers() {
        this.chaserPushesUsed++;
        if (this.maxNumberPushChasersExceeded()) {
            GameOneEventEmitter.emitPlayerHasExceededMaxNumberChaserPushes(this.roomId, this.id);
        }
    }

    throwStone() {
        if (this.stonesCarrying < 1) {
            throw new UserHasNoStones(undefined, this.id);
        }
        this.stonesCarrying--;
    }

    handlePlayerCaught() {
        this.dead = true;
        this.updatePlayerStateFinished();
        GameOneEventEmitter.emitPlayerIsDead(this.roomId, this.id, this.rank);
    }

    //********************

    private playerIsNotAllowedToRun() {
        return (
            this.finished ||
            this.dead ||
            this.atObstacle ||
            this.countRunsPerFrame >= this.maxRunsPerFrame ||
            this.stunned
        );
    }

    private playerHasReachedObstacle(): boolean {
        return (
            (this.obstacles?.length || 0) > 0 &&
            !!this.positionX &&
            !!this.obstacles?.[0]?.positionX &&
            this.positionX >= this.obstacles[0].positionX
        );
    }

    private handlePlayerApproachingSolvableObstacle(): void {
        console.log('handlePlayerApproachingSolvableObstacle');
        // when already carrying a stone, no action is required
        if (this.obstacles[0].type === ObstacleType.Stone && this.stonesCarrying > 0) {
            return;
        }

        if (!this.obstacles[0].sentApproachingMessage) {
            this.obstacles[0].sentApproachingMessage = true;
            GameOneEventEmitter.emitApproachingSolvableObstacleEventOnce({
                roomId: this.roomId,
                userId: this.id,
                obstacleType: this.obstacles[0].type,
                obstacleId: this.obstacles[0].id,
                distance: this.obstacles[0].positionX - this.positionX,
            });
        }

        GameOneEventEmitter.emitApproachingSolvableObstacleEvent({
            roomId: this.roomId,
            userId: this.id,
            obstacleType: this.obstacles[0].type,
            obstacleId: this.obstacles[0].id,
            distance: this.obstacles[0].positionX - this.positionX,
        });
    }

    private handlePlayerReachedObstacle(): void {
        //reset sentApproachingMessage for next optional obstacle
        this.obstacles[0].sentApproachingMessage = false;
        // when already carrying a stone or not opt in automatically skip the stone obstacle
        if ((this.obstacles[0].type === ObstacleType.Stone && this.stonesCarrying > 0) || this.obstacles[0].solvable) {
            this.obstacles.shift();
            GameOneEventEmitter.emitObstacleSkippedEvent({
                roomId: this.roomId,
                userId: this.id,
            });
            return;
        }

        // block player from running when obstacle is reached
        this.atObstacle = true;

        //set position x to obstacle position (in case ran past)
        this.positionX = this.obstacles[0].positionX;
        const obstacleDetails: ObstacleReachedInfoController = {
            obstacleType: this.obstacles[0].type,
            obstacleId: this.obstacles[0].id,
        };
        if (this.obstacles[0].type === ObstacleType.Trash) {
            obstacleDetails.trashType = this.obstacles[0].trashType;
            obstacleDetails.numberTrashItems = this.obstacles[0].numberTrashItems;
        }

        GameOneEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId: this.id,
            ...obstacleDetails,
        });
    }

    private playerIsApproachingSolvableObstacle(): boolean {
        return (
            !this.atObstacle &&
            (this.obstacles.length || 0) > 0 &&
            (this.positionX || 0) >=
                (this.obstacles[0].positionX || 0) - InitialParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE &&
            this.obstacles[0].solvable
        );
    }
}

export default GameOnePlayer;
