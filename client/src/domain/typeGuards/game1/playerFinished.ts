import { MessageTypesGame1 } from "../../../utils/constants";
import { MessageData } from "../MessageData";

export interface PlayerFinishedMessage {
    type: MessageTypesGame1.playerFinished;
    rank: number;
    userId: string;
}

export const playerFinishedTypeGuard = (data: MessageData): data is PlayerFinishedMessage =>
    (data as PlayerFinishedMessage).type === MessageTypesGame1.playerFinished;
