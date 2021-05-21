import { GameData, UserData } from './';

export interface SocketMessage {
    type?: string;
    users?: UserData[];
    data?: GameData;
    msg?: string;
}
