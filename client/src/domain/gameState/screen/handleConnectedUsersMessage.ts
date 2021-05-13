import { ConnectedUsersMessage, IUser } from '../../typeGuards/connectedUsers';

interface HandleConnectedUsers {
    data: ConnectedUsersMessage;
    dependencies: {
        setConnectedUsers: (users: IUser[]) => void;
    };
}

export function handleConnectedUsersMessage(props: HandleConnectedUsers) {
    const { data, dependencies } = props;
    const { setConnectedUsers } = dependencies;

    if (data.users) {
        setConnectedUsers(data.users);
    }
}
