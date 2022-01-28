import { Difficulty } from '../gameplay/enums';

export interface IMessage {
    type: string;
    roomId?: string;
    userId?: string;
    characterNumber?: string;
    state?: string;
    direction?: string;
    game?: string;
    guess?: number;
    difficulty?: Difficulty;
}
