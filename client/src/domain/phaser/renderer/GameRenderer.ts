export interface GameRenderer {
    renderBackground(windowWidth: number, windowHeight: number): void;
    renderPauseButton(): void;
    pauseGame(): void;
    resumeGame(): void;
}
