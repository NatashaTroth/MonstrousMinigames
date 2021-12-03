import messageHandler from "../../socket/messageHandler";
import { UserInitMessage, userInitTypeGuard } from "../../typeGuards/userInit";

interface Dependencies {
    persistUser: (data: UserInitMessage) => void;
    setPlayerNumber: (val: number) => void;
    setName: (val: string) => void;
    setUserId: (val: string) => void;
    setReady: (val: boolean) => void;
}

export const userInitHandler = messageHandler(userInitTypeGuard, (message, dependencies: Dependencies) => {
    const { setPlayerNumber, setName, setUserId, setReady, persistUser } = dependencies;

    setName(message.name);
    setPlayerNumber(message.number);
    setUserId(message.userId);
    setReady(message.ready);

    persistUser(message);
});
