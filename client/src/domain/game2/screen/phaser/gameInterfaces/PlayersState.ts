export interface PlayersState {
    dead: boolean;
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    id: string;
    isActive: boolean;
    name: string;
    positionX: number;
    rank: number;
    characterNumber: number;
    stunned: boolean;
}
