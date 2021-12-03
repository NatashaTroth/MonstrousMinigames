import { MessageSocket } from "./MessageSocket";
import { Socket } from "./Socket";

export type MessageHandler = <Message, Dependencies>(
    typeGuard: (val: any) => val is Message,
    action: (data: Message, dependencies: Dependencies) => void
) => (dependencies: Dependencies) => (socket: Socket) => void;

const messageHandler: MessageHandler = (typeGuard, action) => {
    return dependencies => {
        return socket => {
            const messageSocket = new MessageSocket(typeGuard, socket);
            messageSocket.listen(message => action(message, dependencies));
        };
    };
};

export default messageHandler;
