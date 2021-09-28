import { designDevelopment, ObstacleTypes } from '../../../utils/constants';
import { depthDictionary } from '../../../utils/depthDictionary';
import MainScene from '../components/game1/MainScene';
import { AnimationName } from './enums';
import { Character, GameData } from './gameInterfaces';
import { GameToScreenMapper } from './GameToScreenMapper';
import { Coordinates } from './gameTypes';
import { PhaserPlayerRenderer } from './renderer/PhaserPlayerRenderer';

/**
 * This is the main player class where all the business functionality should be implemented (eg. what happens when a
 * player moves forward). This class should not depend on phaser itself (as phaser is hard to test), but should depend
 * on the replaceable interface (PlayerRenderer) which can be mocked. With the mocked interface in combination with
 * the InMemoryPlayerRenderer, testing this class should be pretty straight forward.
 */
export class Player {
    username: string;
    userId: string;
    playerRunning: boolean;
    playerAtObstacle: boolean;
    playerCountSameDistance: number;
    dead: boolean;
    finished: boolean;
    stunned: boolean;
    renderer: PhaserPlayerRenderer;

    constructor(
        scene: MainScene,
        private laneHeightsPerNumberPlayers: number[],
        private laneHeight: number,
        private index: number,
        public coordinates: Coordinates,
        private gameStateData: GameData,
        private character: Character,
        private numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper
    ) {
        this.username = gameStateData.playersState[index].name;
        this.userId = gameStateData.playersState[index].id;
        this.playerRunning = false;
        this.playerAtObstacle = false;
        this.playerCountSameDistance = 0;
        this.dead = false;
        this.finished = false;
        this.stunned = false;

        this.renderer = new PhaserPlayerRenderer(scene, this.numberPlayers, this.laneHeightsPerNumberPlayers);

        this.renderer.renderBackground(
            window.innerWidth,
            window.innerHeight,
            this.gameToScreenMapper.mapGameMeasurementToScreen(gameStateData.trackLength),
            this.index,
            this.laneHeight,
            this.coordinates.y
        );
        this.setPlayer();
        this.setObstacles();
        this.setCave(gameStateData.trackLength);
        this.setChasers(gameStateData.chasersPositionX);

        if (designDevelopment) {
            this.renderer.renderFireworks(
                this.gameToScreenMapper.mapGameMeasurementToScreen(gameStateData.trackLength),
                this.coordinates.y,
                this.laneHeight
            );

            this.arrivedAtObstacle();

            setInterval(() => {
                this.playerAtObstacle = false;
                this.renderer.destroyAttentionIcon();

                setTimeout(() => this.arrivedAtObstacle(), 1000);
            }, 5000);

            // this.renderer.renderAttentionIcon();
            // // test animation
            // this.handlePlayerStunned();

            // setInterval(() => {
            //     this.stunned = false;
            //     this.handlePlayerStunned();
            // }, 4000);
            // this.startRunning();
            // setTimeout(() => this.handlePlayerStunned(), 3000);
            // setTimeout(() => {
            //     this.handlePlayerUnStunned();
            //     this.startRunning();
            // }, 6000);
        }
    }

    moveForward(newXPosition: number, trackLength: number) {
        if (this.finished) return;

        if (newXPosition == this.coordinates.x && this.playerRunning) {
            this.stopRunning();
        } else {
            if (!this.playerRunning) {
                this.startRunning();
            }
        }

        this.coordinates.x = newXPosition;
        this.renderer.movePlayerForward(this.gameToScreenMapper.mapGameMeasurementToScreen(newXPosition));
    }

    checkAtObstacle(isAtObstacle: boolean) {
        if (this.finished) return;
        if (this.justArrivedAtObstacle(isAtObstacle)) {
            this.arrivedAtObstacle();
        } else if (this.finishedObstacle(isAtObstacle)) {
            this.finishObstacle();
        }
    }

    handleApproachingObstacle() {
        //TODO ASH show warning
    }

    handleObstacleSkipped() {
        //TODO ASH destroy warning
        this.renderer.handleSkippedObstacle();
    }

    handlePlayerDead() {
        this.destroyPlayer();
        this.renderer.destroyChaser();
        this.renderer.destroyObstacles();
        this.renderer.destroyCave();
        this.renderer.destroyAttentionIcon();
        this.renderer.handlePlayerDead();
        this.dead = true;
    }

    handlePlayerFinished() {
        this.renderer.renderFireworks(
            this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
            this.coordinates.y - window.innerHeight / 8 + 50,
            this.laneHeight
        );
        this.destroyPlayer();
    }

    handlePlayerStunned() {
        if (!this.stunned) {
            this.renderer.stunPlayer(this.character.animations.get(AnimationName.Stunned)!.name);
            this.stunned = true;
        }
    }

    handlePlayerUnStunned() {
        this.renderer.stopAnimation();
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
        this.renderer.renderAttentionIcon();
    }

    private finishObstacle(): void {
        this.playerAtObstacle = false;
        this.startRunning();
        this.renderer.destroyObstacle();
        this.renderer.destroyAttentionIcon();
    }

    private setPlayer() {
        const screenCoordinates = {
            x: this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
            y: this.coordinates.y,
        };

        this.renderer.renderPlayer(this.index, screenCoordinates, this.character, this.username);
    }

    private setObstacles() {
        const obstaclesArray = this.gameStateData.playersState[this.index].obstacles;

        obstaclesArray.forEach((obstacle, index) => {
            const posX = this.gameToScreenMapper.mapGameMeasurementToScreen(obstacle.positionX) + 75;
            let obstaclePosY = this.coordinates.y; //+ 30;
            let obstacleScale = 0.5 / this.numberPlayers;
            let obstacleDepth = depthDictionary.obstacle - index;

            switch (obstacle.type) {
                case ObstacleTypes.treeStump:
                    obstacleScale = 0.7 / this.numberPlayers;
                    break;
                case ObstacleTypes.spider:
                    obstacleScale = 0.7 / this.numberPlayers;
                    break;
                case ObstacleTypes.trash:
                    obstacleScale = 0.7 / this.numberPlayers;
                    obstaclePosY += 10;
                    break;
                case ObstacleTypes.stone:
                    obstacleScale = 0.75 / this.numberPlayers;
                    obstaclePosY += 16 / this.numberPlayers;
                    obstacleDepth = depthDictionary.stoneObstacle - index;
                    break;
            }

            this.renderer.renderObstacles(
                posX,
                obstaclePosY,
                obstacleScale,
                obstacle.type.toLowerCase(),
                obstacleDepth
            );
        });
    }

    setChasers(chasersPositionX: number) {
        if (!this.dead) {
            this.renderer.renderChasers(
                this.gameToScreenMapper.mapGameMeasurementToScreen(chasersPositionX),
                this.coordinates.y
            );
        }
    }

    setCave(posX: number) {
        this.renderer.renderCave(this.gameToScreenMapper.mapGameMeasurementToScreen(posX), this.coordinates.y);
    }

    startRunning() {
        const animationName = this.character.animations.get(AnimationName.Running)?.name;
        if (animationName) this.renderer.startAnimation(animationName);
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopAnimation();
        this.playerRunning = false;
    }
}
