export interface GameRenderer {
    renderBackground(windowWidth: number, windowHeight: number, trackLength: number): void;
    renderPauseButton(): void;
    renderCountdown(text: string): void;
    destroyCountdown(): void;
    pauseGame(): void;
    resumeGame(): void;
    handleLanePlayerDead(idx: number): void;
}
