import { defaultAvailableCharacters } from "../../../config/characters";
import { ConnectedUsersMessage, User } from "../../typeGuards/connectedUsers";

interface Dependencies {
    setAvailableCharacters: (val: number[]) => void;
    setConnectedUsers: (val: User[]) => void;
}

export const handleConnectedUsersMessage = (dependencies: Dependencies) => {
    return (data: ConnectedUsersMessage) => {
        const usedCharacters = data.users?.map(user => user.characterNumber) || [];
        const availableCharacters = defaultAvailableCharacters.filter(character => !usedCharacters.includes(character));

        dependencies.setAvailableCharacters(availableCharacters);
        dependencies.setConnectedUsers(data.users || []);
    };
};
