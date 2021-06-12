import { localDevelopment, Obstacles } from '../../utils/constants';
import { depthDictionary } from '../../utils/depthDictionary';
import { GameData } from './gameInterfaces';
import { Coordinates, PlayerRenderer } from './renderer/PlayerRenderer';

/**
 * This is the main player class where all the business functionality should be implemented (eg. what happens when a
 * player moves forward). This class should not depend on phaser itself (as phaser is hard to test), but should depend
 * on the replaceable interface (PlayerRenderer) which can be mocked. With the mocked interface in combination with
 * the InMemoryPlayerRenderer, testing this class should be pretty straight forward.
 */
export class Player {
    plusX = 40;
    plusY = 110;
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
        private renderer: PlayerRenderer, // TODO MAKE PRIVATE
        private index: number,
        private coordinates: Coordinates,
        private gameStateData: GameData,
        private monsterName: string
    ) {
        this.coordinates = {
            x: this.coordinates.x + this.plusX * this.index,
            y: (index * window.innerHeight) / 4 + this.plusY,
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
    }

    moveForward(x: number, trackLength: number) {
        if (this.finished) return;
        const newXPosition = x;
        if (newXPosition == this.coordinates.x && this.playerRunning) {
            if (localDevelopment) {
                // so that running animation works in local development
                this.playerCountSameDistance++;
            } else {
                this.stopRunning();
            }
        } else {
            if (!this.playerRunning) {
                this.startRunning();
                if (localDevelopment) {
                    // so that running animation works in local development
                    this.playerCountSameDistance = 0;
                }
            }
        }

        //TODO delete
        if (localDevelopment) {
            // so that running animation works in local development
            if (this.playerRunning && this.playerCountSameDistance > 50) {
                this.stopRunning();
                this.playerCountSameDistance = 0;
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
        this.dead = true;
    }

    handlePlayerFinished() {
        this.renderer.renderFireworks(this.coordinates.x, this.coordinates.y - window.innerHeight / 8);
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

    // checkFinished(isFinished: boolean) {
    //     if (isFinished) {
    //         // this.stopRunning();
    //         this.renderer.destroyPlayer();
    //         //TODO winning animation
    //         return true;
    //     }
    //     return false;
    // }

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
        // eslint-disable-next-line no-console
        // console.log('at obstacle: ', this.coordinates.x);
    }

    private finishObstacle(): void {
        this.playerAtObstacle = false;
        this.startRunning();
        this.renderer.destroyObstacle();
        this.renderer.destroyAttentionIcon();
    }

    private renderPlayer() {
        this.renderer.renderPlayer(this.coordinates, this.monsterName, this.animationName);

        // TODO render player name
        // this.renderer.renderText(
        //     { x: this.coordinates.x, y: this.coordinates.y - 100 },
        //     'TODO', // data.data.playersState[i].name, // TODO,
        //     '#000000'
        // );
    }

    private setObstacles() {
        const obstaclesArray = this.gameStateData.playersState[this.index].obstacles;

        obstaclesArray.forEach((obstacle, index) => {
            let posX = obstacle.positionX + 75;
            // const posX = mapServerPosToWindowPos(obstacle.positionX, this.gameStateData.trackLength) + 75;
            let obstaclePosY = this.coordinates.y + 30;
            let obstacleScale = 0.3;

            switch (obstacle.type) {
                case Obstacles.treeStump:
                    obstaclePosY = this.coordinates.y + 45;
                    obstacleScale = 0.4;
                    break;
                case Obstacles.spider:
                    obstaclePosY = this.coordinates.y + 25;
                    obstacleScale = 0.2;
                    break;
                case Obstacles.hole:
                    obstaclePosY = this.coordinates.y + 75;
                    obstacleScale = 0.1;
                    posX += 40;

                    break;
                case Obstacles.stone:
                    obstaclePosY = this.coordinates.y + 25;
                    obstacleScale = 0.2;
                    break;
            }
            // eslint-disable-next-line no-console
            // console.log('obstacle position: ', posX);
            this.renderer.renderObstacles(
                posX,
                obstaclePosY,
                obstacleScale,
                obstacle.type.toLowerCase(),
                depthDictionary.obstacle - index
            );
        });
    }

    setChasers(chasersPositionX: number) {
        if (!this.dead) {
            const chasersPositionY = this.coordinates.y + 30;

            //TODO CHANGE FOR WIDTH OF SCREEN
            // this.renderer.renderChasers(
            //     chasersPositionX, chasersPositionY
            // );
            this.renderer.renderChasers(chasersPositionX, chasersPositionY);
        }
    }

    setGoal(posX: number) {
        this.renderer.renderGoal(posX, this.coordinates.y);
    }

    //TODO
    // setGoal(playerIndex: number) {
    //     const goal = this.physics.add.sprite(this.trackLength, this.getYPosition(playerIndex), 'goal');
    //     goal.setScale(0.1, 0.1);
    //     goals.push(goal);
    // }

    startRunning() {
        this.renderer.startRunningAnimation(this.animationName);
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopRunningAnimation();
        this.playerRunning = false;
    }
}
