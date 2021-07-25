import { ConnectedUsersMessage, User } from '../../typeGuards/connectedUsers';

interface HandleConnectedUsers {
    data: ConnectedUsersMessage;
    dependencies: {
        setConnectedUsers: (users: User[]) => void;
    };
}

export function handleConnectedUsersMessage(props: HandleConnectedUsers) {
    const { data, dependencies } = props;
    const { setConnectedUsers } = dependencies;

    if (data.users) {
        setConnectedUsers(data.users);
    }
}
