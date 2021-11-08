import { Character } from '../../game1/screen/phaser/gameInterfaces';
import { PlayerRenderer } from './PlayerRenderer';

export class InMemoryPlayerRenderer implements PlayerRenderer {
    constructor(
        private scene: any,
        private numberPlayers: number,
        private laneHeightsPerNumberPlayers: number[],
        public mocks: {
            mockRenderBackground?: (
                a: number,
                b: number,
                c: number,
                d: number,
                e: number,
                f: number
            ) => {
                // do nothing
            };
            mockRenderFireworks?: (
                a: number,
                b: number,
                c: number
            ) => {
                // do nothing
            };
            mockDestroyCave?: () => {
                // do nothing
            };
            mockDestroyChaser?: () => {
                // do nothing
            };
            mockDestroyObstacles?: () => {
                // do nothing
            };
            mockDestroyAttentionIcon?: () => {
                // do nothing
            };
            mockRenderAttentionIcon?: () => {
                // do nothing
            };
            mockDestroyWarningIcon?: () => {
                // do nothing
            };
            mockRenderWarningIcon?: () => {
                // do nothing
            };
            mockHandleSkippedObstacle?: () => {
                // do nothing
            };
            mockDestroyObstacle?: () => {
                // do nothing
            };
            mockHandlePlayerDead?: () => {
                // do nothing
            };
            mockStopAnimation?: () => {
                // do nothing
            };
            mockDestroyPlayer?: () => {
                // do nothing
            };
            mockStunPlayer?: (
                a: string
            ) => {
                // do nothing
            };
            mockRenderWind?: () => {
                // do nothing
            };
            mockStartAnimation?: (
                a: string
            ) => {
                // do nothing
            };
            mockRenderCave?: (
                a: number,
                b: number
            ) => {
                // do nothing
            };
            mockRenderChasers?: (
                a: number,
                b: number
            ) => {
                // do nothing
            };
            mockMovePlayerForward?: (
                a: number
            ) => {
                // do nothing
            };
            mockRenderPlayer?: (
                a: number,
                b: { x: number; y: number },
                c: Character,
                d: string
            ) => {
                // do nothing
            };
            mockRenderObstacles?: (
                a: number,
                b: number,
                c: number,
                d: string,
                e: number
            ) => {
                // do nothing
            };
        }
    ) {}

    renderBackground(
        windowWidth: number,
        windowHeight: number,
        screenMeasurement: number,
        index: number,
        laneHeight: number,
        y: number
    ) {
        this.mocks.mockRenderBackground?.(windowWidth, windowHeight, screenMeasurement, index, laneHeight, y);
    }

    renderFireworks(screenMeasurement: number, laneHeight: number, y: number) {
        this.mocks.mockRenderFireworks?.(screenMeasurement, laneHeight, y);
    }

    destroyCave() {
        this.mocks.mockDestroyCave?.();
    }

    destroyChaser() {
        this.mocks.mockDestroyChaser?.();
    }

    destroyObstacles() {
        this.mocks.mockDestroyObstacles?.();
    }

    destroyObstacle() {
        this.mocks.mockDestroyObstacle?.();
    }

    destroyAttentionIcon() {
        this.mocks.mockDestroyAttentionIcon?.();
    }

    renderAttentionIcon() {
        this.mocks.mockRenderAttentionIcon?.();
    }

    destroyWarningIcon() {
        this.mocks.mockDestroyWarningIcon?.();
    }

    renderWarningIcon() {
        this.mocks.mockRenderWarningIcon?.();
    }

    handleSkippedObstacle() {
        this.mocks.mockHandleSkippedObstacle?.();
    }

    handlePlayerDead() {
        this.mocks.mockHandlePlayerDead?.();
    }

    stopAnimation() {
        this.mocks.mockStopAnimation?.();
    }

    destroyPlayer() {
        this.mocks.mockDestroyPlayer?.();
    }

    stunPlayer(playerNumber: string) {
        this.mocks.mockStunPlayer?.(playerNumber);
    }

    movePlayerForward(screenMeasurement: number) {
        this.mocks.mockMovePlayerForward?.(screenMeasurement);
    }

    renderPlayer(index: number, screenCoordinates: { x: number; y: number }, character: Character, username: string) {
        this.mocks.mockRenderPlayer?.(index, screenCoordinates, character, username);
    }

    renderObstacles(
        posX: number,
        obstaclePosY: number,
        obstacleScale: number,
        obstacleType: string,
        obstacleDepth: number
    ) {
        this.mocks.mockRenderObstacles?.(posX, obstaclePosY, obstacleScale, obstacleType, obstacleDepth);
    }

    renderChasers(screenMeasurement: number, y: number) {
        this.mocks.mockRenderChasers?.(screenMeasurement, y);
    }

    renderCave(screenMeasurement: number, y: number) {
        this.mocks.mockRenderCave?.(screenMeasurement, y);
    }

    startAnimation(animationName: string) {
        this.mocks.mockStartAnimation?.(animationName);
    }

    renderWind() {
        this.mocks.mockRenderWind?.();
    }
}
