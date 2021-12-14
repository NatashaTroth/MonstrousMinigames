import { depthDictionary } from "../../../config/depthDictionary";
import {
    designDevelopment, localDevelopment, ObstacleTypes, stunnedAnimation
} from "../../../utils/constants";
import MainScene from "../../game1/screen/components/MainScene";
import { AnimationNameGame1 } from "../enums/AnimationName";
import { Character, GameData } from "../gameInterfaces";
import { Coordinates } from "../gameTypes";
import { DomainPlayer } from "./DomainPlayer";
import { GameToScreenMapper } from "./GameToScreenMapper";
import { PlayerRenderer } from "./PlayerRenderer";

/**
 * This is the main player class where all the business functionality should be implemented (eg. what happens when a
 * player moves forward). This class should not depend on phaser itself (as phaser is hard to test), but should depend
 * on the replaceable interface (PlayerRenderer) which can be mocked. With the mocked interface in combination with
 * the InMemoryPlayerRenderer, testing this class should be pretty straight forward.
 */

export class Player {
    player: DomainPlayer;
    renderer: PlayerRenderer;
    windowWidth: number;
    windowHeight: number;

    constructor(
        scene: MainScene,
        private laneHeight: number,
        private index: number,
        public coordinates: Coordinates,
        private gameStateData: GameData,
        private character: Character,
        private numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper,
        public playerRenderer: PlayerRenderer
    ) {
        this.windowWidth = scene.windowWidth;
        this.windowHeight = scene.windowHeight;

        this.player = new DomainPlayer(gameStateData.playersState[index].id, gameStateData.playersState[index].name);

        this.renderer = playerRenderer;

        this.renderer.renderBackground(
            this.windowWidth,
            this.windowHeight,
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
                this.player.finishedObstacle();
                this.renderer.destroyAttentionIcon();

                setTimeout(() => this.arrivedAtObstacle(), 1000);
            }, 5000);
        }

        if (localDevelopment && stunnedAnimation) {
            setInterval(() => {
                this.player.unstun();
                this.handlePlayerStunned();
                this.player.unstun();
                setTimeout(() => {
                    this.handlePlayerUnStunned();
                    this.startRunning();
                }, 10000);
            }, 10000);
        }
    }

    moveForward(newXPosition: number) {
        if (this.player.isFinished) return;

        if (newXPosition == this.coordinates.x && this.player.isMoving) {
            this.stopRunning();
        } else {
            if (!this.player.isMoving) {
                this.startRunning();
            }
        }

        this.coordinates.x = newXPosition;
        this.renderer.movePlayerForward(this.gameToScreenMapper.mapGameMeasurementToScreen(newXPosition));
    }

    checkAtObstacle(isAtObstacle: boolean) {
        if (this.player.isFinished) return;
        if (this.justArrivedAtObstacle(isAtObstacle)) {
            this.arrivedAtObstacle();
        } else if (this.finishedObstacle(isAtObstacle)) {
            this.finishObstacle();
        }
    }

    handleApproachingObstacle() {
        this.renderer.renderWarningIcon();
    }

    handleObstacleSkipped() {
        this.destroyWarningIcon();
        this.renderer.handleSkippedObstacle();
    }

    destroyWarningIcon() {
        this.renderer.destroyWarningIcon();
    }

    handlePlayerDead() {
        this.destroyPlayer();
        this.renderer.destroyChaser();
        this.renderer.destroyObstacles();
        this.renderer.destroyCave();
        this.renderer.destroyAttentionIcon();
        this.renderer.handlePlayerDead();
        this.player.died();
    }

    handlePlayerFinished() {
        this.renderer.renderFireworks(
            this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
            this.coordinates.y - this.windowHeight / 8 + 50,
            this.laneHeight
        );
        this.destroyPlayer();
    }

    handlePlayerStunned() {
        if (!this.player.isStunned) {
            this.renderer.stunPlayer(this.character.animations.get(AnimationNameGame1.Stunned)!.name);
            this.player.stun();
        }
    }

    handlePlayerUnStunned() {
        this.renderer.stopAnimation();
        this.player.unstun();
    }

    handleReset() {
        this.renderer.destroyEverything();
        // this.character.animations.delete(AnimationNameGame1.Running);
    }

    private destroyPlayer() {
        this.renderer.destroyPlayer();
        this.player.finished();
    }

    private justArrivedAtObstacle(isAtObstacle: boolean) {
        return isAtObstacle && !this.player.isAtObstacle;
    }

    private finishedObstacle(isAtObstacle: boolean) {
        return !isAtObstacle && this.player.isAtObstacle;
    }

    private arrivedAtObstacle(): void {
        this.stopRunning();
        this.player.isAtObstacle = true;
        this.renderer.renderAttentionIcon();
    }

    private finishObstacle(): void {
        this.player.finishedObstacle();
        this.startRunning();
        this.renderer.destroyObstacle();
        this.renderer.destroyAttentionIcon();
    }

    private setPlayer() {
        const screenCoordinates = {
            x: this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
            y: this.coordinates.y,
        };

        this.renderer.renderPlayer(this.index, screenCoordinates, this.character, this.player.name);
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
        if (!this.player.isDead) {
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
        const animationName = this.character.animations.get(AnimationNameGame1.Running)?.name;
        this.renderer?.startAnimation(animationName);
        this.player.startMoving();
    }

    stopRunning() {
        this.renderer.stopAnimation();
        this.player.stopMoving();
    }
}
