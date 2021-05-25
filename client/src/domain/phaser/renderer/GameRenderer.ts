export interface GameRenderer {
    renderBackground(windowWidth: number, windowHeight: number, trackLength: number): void;
    renderPauseButton(): void;
    pauseGame(): void;
    resumeGame(): void;
}
