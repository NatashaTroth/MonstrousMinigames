import { MessageSocket } from './MessageSocket';
import { Socket } from './Socket';

export type MessageHandler = <Message, Dependencies>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeGuard: (val: any) => val is Message,
    action: (data: Message, dependencies: Dependencies, roomId?: string) => void
) => (dependencies: Dependencies) => (socket: Socket, roomId?: string) => void;

const messageHandler: MessageHandler = (typeGuard, action) => {
    return dependencies => {
        return (socket, roomId) => {
            const messageSocket = new MessageSocket(typeGuard, socket);
            messageSocket.listen(message => action(message, dependencies, roomId));
        };
    };
};

export default messageHandler;
