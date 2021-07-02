import { defaultAvailableCharacters } from '../../../utils/characters';
import { ConnectedUsersMessage, IUser } from '../../typeGuards/connectedUsers';

interface HandleConnectedUsersMessage {
    data: ConnectedUsersMessage;
    dependencies: {
        setAvailableCharacters: (val: number[]) => void;
        setConnectedUsers: (val: IUser[]) => void;
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
