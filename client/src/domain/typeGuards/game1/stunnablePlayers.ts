import { MessageTypesGame1 } from "../../../utils/constants";
import { MessageData } from "../MessageData";

export interface StunnablePlayersMessage {
    type: MessageTypesGame1.stunnablePlayers;
    roomId: string;
    stunnablePlayers: string[];
}

export const stunnablePlayersTypeGuard = (data: MessageData): data is StunnablePlayersMessage =>
    (data as StunnablePlayersMessage).type === MessageTypesGame1.stunnablePlayers;
