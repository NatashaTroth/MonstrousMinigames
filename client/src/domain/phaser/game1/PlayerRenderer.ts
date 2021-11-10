import { Character } from '../gameInterfaces';

export interface PlayerRenderer {
    renderBackground: (
        windowWidth: number,
        windowHeight: number,
        screenMeasurement: number,
        index: number,
        laneHeight: number,
        y: number
    ) => void;
    renderFireworks: (screenMeasurement: number, y: number, laneHeight: number) => void;
    destroyAttentionIcon: () => void;
    destroyWarningIcon: () => void;
    renderAttentionIcon: () => void;
    renderWarningIcon: () => void;
    handleSkippedObstacle: () => void;
    destroyChaser: () => void;
    destroyObstacles: () => void;
    destroyObstacle: () => void;
    destroyCave: () => void;
    handlePlayerDead: () => void;
    stunPlayer: (playerName: string) => void;
    stopAnimation: () => void;
    destroyPlayer: () => void;
    movePlayerForward: (screenMeasurement: number) => void;
    renderPlayer: (
        index: number,
        screenCoordinates: { x: number; y: number },
        character: Character,
        username: string
    ) => void;
    renderObstacles: (
        posX: number,
        obstaclePosY: number,
        obstacleScale: number,
        obstacleType: string,
        obstacleDepth: number
    ) => void;
    renderChasers: (screenMeasurement: number, y: number) => void;
    renderCave: (screenMeasurement: number, y: number) => void;
    startAnimation: (animationName: string) => void;
    renderWind: () => void;
}
