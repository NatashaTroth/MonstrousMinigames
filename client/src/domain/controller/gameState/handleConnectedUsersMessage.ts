import { defaultAvailableCharacters } from '../../../config/characters';
import { ConnectedUsersMessage, User } from '../../typeGuards/connectedUsers';

interface HandleConnectedUsersMessage {
    data: ConnectedUsersMessage;
    dependencies: {
        setAvailableCharacters: (val: number[]) => void;
        setConnectedUsers: (val: User[]) => void;
    };
}

export const handleConnectedUsersMessage = (props: HandleConnectedUsersMessage) => {
    const { data, dependencies } = props;

    const usedCharacters = data.users?.map(user => user.characterNumber) || [];
    const availableCharacters = defaultAvailableCharacters.filter(character => !usedCharacters.includes(character));
    dependencies.setAvailableCharacters(availableCharacters);
    if (data) {
        dependencies.setConnectedUsers(data.users || []);
    }
};
