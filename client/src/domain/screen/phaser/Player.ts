import { Obstacles } from '../../../utils/constants';
import { depthDictionary } from '../../../utils/depthDictionary';
import { GameData } from './gameInterfaces';
import { Coordinates, PlayerRenderer } from './renderer/PlayerRenderer';

/**
 * This is the main player class where all the business functionality should be implemented (eg. what happens when a
 * player moves forward). This class should not depend on phaser itself (as phaser is hard to test), but should depend
 * on the replaceable interface (PlayerRenderer) which can be mocked. With the mocked interface in combination with
 * the InMemoryPlayerRenderer, testing this class should be pretty straight forward.
 */
export class Player {
    username: string;
    animationName: string;
    playerRunning: boolean;
    playerAtObstacle: boolean;
    playerAttention: null | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; //TODO change
    playerCountSameDistance: number;
    dead: boolean;
    finished: boolean;
    stunned: boolean;

    constructor(
        public renderer: PlayerRenderer, // TODO MAKE PRIVATE
        private index: number,
        private coordinates: Coordinates,
        private gameStateData: GameData,
        private monsterName: string,
        private numberPlayers: number
    ) {
        this.coordinates = {
            x: this.coordinates.x,
            y: this.coordinates.y,
        };

        this.animationName = `${monsterName}Walk`;
        this.username = gameStateData.playersState[index].name;
        this.playerRunning = false;
        this.playerAtObstacle = false;
        this.playerCountSameDistance = 0;
        this.playerAttention = null;
        this.dead = false;
        this.finished = false;
        this.stunned = false;

        this.renderPlayer();
        this.setObstacles();
        this.setGoal(gameStateData.trackLength);
        this.renderBackground(gameStateData.trackLength);
        // this.renderer.renderFireworks(500, 100);
        // this.renderer.renderFireworks(this.coordinates.x + 500, this.coordinates.y - window.innerHeight / 8 + 50);
    }

    moveForward(x: number, trackLength: number) {
        if (this.finished) return;
        const newXPosition = x;
        if (newXPosition == this.coordinates.x && this.playerRunning) {
            this.stopRunning();
        } else {
            if (!this.playerRunning) {
                this.startRunning();
            }
        }

        this.coordinates.x = newXPosition;
        this.renderer.movePlayerForward(newXPosition);
    }

    checkAtObstacle(isAtObstacle: boolean) {
        if (this.finished) return;
        if (this.justArrivedAtObstacle(isAtObstacle)) {
            this.arrivedAtObstacle();
        } else if (this.finishedObstacle(isAtObstacle)) {
            this.finishObstacle();
        }
    }

    handlePlayerDead() {
        this.destroyPlayer();
        this.renderer.destroyChaser();
        this.renderer.destroyObstacles();
        this.renderer.destroyCave();
        this.renderer.destroyAttentionIcon();
        this.dead = true;
    }

    handlePlayerFinished() {
        this.renderer.renderFireworks(this.coordinates.x, this.coordinates.y - window.innerHeight / 8 + 50);
        this.destroyPlayer();
    }

    handlePlayerStunned() {
        this.renderer.stunPlayer();
        this.stunned = true;
    }

    handlePlayerUnStunned() {
        this.renderer.unStunPlayer();

        this.stunned = false;
    }

    private destroyPlayer() {
        this.renderer.destroyPlayer();
        this.finished = true;
    }

    private justArrivedAtObstacle(isAtObstacle: boolean) {
        return isAtObstacle && !this.playerAtObstacle;
    }

    private finishedObstacle(isAtObstacle: boolean) {
        return !isAtObstacle && this.playerAtObstacle;
    }

    private arrivedAtObstacle(): void {
        this.stopRunning();
        this.playerAtObstacle = true;
        this.renderer.addAttentionIcon();
    }

    private finishObstacle(): void {
        this.playerAtObstacle = false;
        this.startRunning();
        this.renderer.destroyObstacle();
        this.renderer.destroyAttentionIcon();
    }

    private renderPlayer() {
        // eslint-disable-next-line no-console
        // console.log(this.username);
        this.renderer.renderPlayer(
            this.index,
            this.coordinates,
            this.monsterName,
            this.animationName,
            this.numberPlayers,
            this.username
        );

        // TODO render player name
        // this.renderer.renderText(
        //     { x: this.coordinates.x, y: this.coordinates.y - 100 },
        //     'TODO', // data.data.playersState[i].name, // TODO,
        //     '#000000'
        // );
    }

    private renderBackground(trackLength: number) {
        this.renderer.renderBackground(
            window.innerWidth,
            window.innerHeight,
            trackLength,
            this.numberPlayers,
            this.index
        );
    }

    private setObstacles() {
        const obstaclesArray = this.gameStateData.playersState[this.index].obstacles;

        obstaclesArray.forEach((obstacle, index) => {
            const posX = obstacle.positionX + 75;
            let obstaclePosY = this.coordinates.y; //+ 30;
            let obstacleScale = 0.5 / this.numberPlayers;

            switch (obstacle.type) {
                case Obstacles.treeStump:
                    // obstaclePosY = this.coordinates.y + window.innerHeight / 9;
                    obstacleScale = 0.9 / this.numberPlayers;
                    break;
                case Obstacles.spider:
                    // obstaclePosY = this.coordinates.y + window.innerHeight / 15;
                    obstacleScale = 0.6 / this.numberPlayers;
                    break;
                case Obstacles.trash:
                    // obstaclePosY = this.coordinates.y + window.innerHeight / 7;
                    obstacleScale = 0.6 / this.numberPlayers;
                    // posX += 40;
                    obstaclePosY += 10;

                    break;
                case Obstacles.stone:
                    // obstaclePosY = this.coordinates.y + window.innerHeight / 10;
                    obstacleScale = 0.6 / this.numberPlayers;
                    break;
            }

            this.renderer.renderObstacles(
                posX,
                obstaclePosY,
                obstacleScale,
                obstacle.type.toLowerCase(),
                depthDictionary.obstacle - index,
                this.numberPlayers
            );
        });
    }

    setChasers(chasersPositionX: number) {
        if (!this.dead) {
            const chasersPositionY = this.coordinates.y + 50;
            this.renderer.renderChasers(chasersPositionX, chasersPositionY);
        }
    }

    setGoal(posX: number) {
        this.renderer.renderCave(posX, this.coordinates.y, this.numberPlayers);
    }

    startRunning() {
        this.renderer.startRunningAnimation(this.animationName);
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopRunningAnimation();
        this.playerRunning = false;
    }
}
