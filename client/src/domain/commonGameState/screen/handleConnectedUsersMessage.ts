import { ConnectedUsersMessage, User } from '../../typeGuards/connectedUsers';

interface Dependencies {
    setConnectedUsers: (users: User[]) => void;
}

export function handleConnectedUsersMessage(dependencies: Dependencies) {
    return (data: ConnectedUsersMessage) => {
        if (data.users) {
            dependencies.setConnectedUsers(data.users);
        }
    };
}
