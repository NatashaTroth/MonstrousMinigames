import { GameNames } from "../../config/games";
import messageHandler from "../socket/messageHandler";
import { gameSetTypeGuard } from "../typeGuards/gameSet";

interface Dependencies {
    setChosenGame: (val: GameNames) => void;
}

export const gameSetHandler = messageHandler(gameSetTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setChosenGame(message.game);
});
