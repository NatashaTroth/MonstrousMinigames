export interface User {
    id: string;
    roomId: string;
    name: string;
    timestamp: number;
}
export interface Room {
    id: string;
    users: Array<User>;
    timestamp: number;
}

export interface ScreenInfo {
    id: string;
    phaserGameReady?: boolean;
}
