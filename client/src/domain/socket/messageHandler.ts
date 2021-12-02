import { MessageSocket } from './MessageSocket';
import { Socket } from './Socket';

type MessageHandler = <Message>(
    typeGuard: (val: any) => val is Message,
    action: (data: Message) => void
) => (socket: Socket) => void;

const messageHandler: MessageHandler = (typeGuard, action) => {
    return socket => {
        const messageSocket = new MessageSocket(typeGuard, socket);
        messageSocket.listen(message => action(message));
    };
};

export default messageHandler;
