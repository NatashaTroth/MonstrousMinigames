import { MessageTypesGame3 } from "../../../utils/constants";
import { MessageDataGame3 } from "./MessageDataGame3";

export interface FinalRoundCountdownMessage {
    type: MessageTypesGame3.finalRoundCountdown;
    roomId: string;
    countdownTime: number;
}

export const finalRoundCountdownTypeGuard = (data: MessageDataGame3): data is FinalRoundCountdownMessage => {
    return (data as FinalRoundCountdownMessage).type === MessageTypesGame3.finalRoundCountdown;
};
