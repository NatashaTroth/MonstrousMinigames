export type Coordinates = { x: number; y: number };

/**
 * all business classes (eg. player) should not depend on phaser itself but an interface which can be mocked
 * see InMemoryPlayerRenderer as an example. During testing the InMemoryPlayerRenderer is being used and
 * in the actual code the PhaserPlayerRenderer is called.
 */

export interface PlayerRenderer {
    renderChasers(chasersPositionX: number, chasersPositionY: number): void;
    // renderText(coordinates: Coordinates, text: string, background?: string): void;

    renderPlayer(coordinates: Coordinates, playerName: string, background?: string): void;
    renderObstacles(posX: number, posY: number, obstacleScale: number, obstacleType: string, depth: number): void;
    renderGoal(posX: number, posY: number): void;
    renderFireworks(posX: number, posY: number): void;
    movePlayerForward(newXPosition: number): void;
    destroyObstacle(): void;
    destroyChaser(): void;
    addAttentionIcon(): void;
    destroyAttentionIcon(): void;
    startRunningAnimation(animationName: string): void;
    stopRunningAnimation(): void;
    destroyPlayer(): void;
    stunPlayer(): void;
    unStunPlayer(): void;
}
