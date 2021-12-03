import { defaultAvailableCharacters } from "../../../config/characters";
import messageHandler from "../../socket/messageHandler";
import { connectedUsersTypeGuard, User } from "../../typeGuards/connectedUsers";

interface Dependencies {
    setAvailableCharacters: (val: number[]) => void;
    setConnectedUsers: (val: User[]) => void;
}
export const connectedUsersHandler = messageHandler(connectedUsersTypeGuard, (message, dependencies: Dependencies) => {
    const usedCharacters = message.users?.map(user => user.characterNumber) || [];
    const availableCharacters = defaultAvailableCharacters.filter(character => !usedCharacters.includes(character));

    dependencies.setAvailableCharacters(availableCharacters);
    dependencies.setConnectedUsers(message.users || []);
});
