import { MessageTypes } from "../../../utils/constants";
import { Socket } from "../../socket/Socket";

export function handleResetGame(
    socket: Socket | undefined,
    dependencies: {
        resetGame: () => void;
        resetGame3: () => void;
    },
    sendMessage?: boolean
) {
    if (sendMessage) {
        socket?.emit({ type: MessageTypes.backToLobby });
    }

    dependencies.resetGame();
    dependencies.resetGame3();
}
