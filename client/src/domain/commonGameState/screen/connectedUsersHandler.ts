import messageHandler from '../../socket/messageHandler';
import { connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';

interface Dependencies {
    setConnectedUsers: (users: User[]) => void;
}

export const connectedUsersHandler = messageHandler(connectedUsersTypeGuard, (message, dependencies: Dependencies) => {
    if (message.users) {
        dependencies.setConnectedUsers(message.users);
    }
});
