export type Coordinates = { x: number; y: number };

/**
 * all business classes (eg. player) should not depend on phaser itself but an interface which can be mocked
 * see InMemoryPlayerRenderer as an example. During testing the InMemoryPlayerRenderer is being used and
 * in the actual code the PhaserPlayerRenderer is called.
 */

export interface PlayerRenderer {
    renderChasers(chasersPositionX: number, chasersPositionY: number): void;
    renderPlayer(
        coordinates: Coordinates,
        monsterName: string,
        animationName: string,
        username?: string,
        background?: string
    ): void;
    renderObstacles(posX: number, posY: number, obstacleScale: number, obstacleType: string, depth: number): void;
    renderCave(posX: number, posY: number): void;
    renderFireworks(posX: number, posY: number): void;
    movePlayerForward(newXPosition: number): void;
    destroyObstacle(): void;
    destroyChaser(): void;
    addAttentionIcon(): void;
    destroyAttentionIcon(): void;
    startRunningAnimation(animationName: string): void;
    stopRunningAnimation(): void;
    destroyPlayer(): void;
    destroyObstacles(): void;
    destroyCave(): void;
    stunPlayer(): void;
    unStunPlayer(): void;
    updatePlayerNamePosition(newX: number): void;
}
