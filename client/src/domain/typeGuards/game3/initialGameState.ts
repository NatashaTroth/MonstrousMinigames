import { MessageTypesGame3 } from "../../../utils/constants";
import { MessageDataGame3 } from "./MessageDataGame3";

export interface InitialGameStateMessage {
    type: MessageTypesGame3.initialGameState;
}

export const initialGameStateTypeGuard = (data: MessageDataGame3): data is InitialGameStateMessage =>
    (data as InitialGameStateMessage).type === MessageTypesGame3.initialGameState;
