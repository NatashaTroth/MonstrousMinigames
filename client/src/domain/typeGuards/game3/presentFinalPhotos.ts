import { MessageTypesGame3 } from "../../../utils/constants";
import { MessageDataGame3 } from "./MessageDataGame3";

export interface PresentFinalPhotosMessage {
    type: MessageTypesGame3.presentFinalPhotos;
    roomId: string;
    photographerId: string;
    photoUrls: string[];
    countdownTime: number;
}

export const presentFinalPhotosTypeGuard = (data: MessageDataGame3): data is PresentFinalPhotosMessage => {
    return (data as PresentFinalPhotosMessage).type === MessageTypesGame3.presentFinalPhotos;
};
