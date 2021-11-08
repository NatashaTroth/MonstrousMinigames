
import { MessageTypesGame3 } from "../../../../utils/constants";
import { Socket } from "../../../socket/Socket";


export default async function sendVote(
    userId: string,
    photographerId: string,
    controllerSocket: Socket
): Promise<boolean> {
    if (!photographerId || photographerId.length < 1) return false;
    return controllerSocket.emit({
        type: MessageTypesGame3.photoVote,
        voterId: userId,
        photographerId: photographerId,
    }).then(() => true)
        .catch(() => false);


}
