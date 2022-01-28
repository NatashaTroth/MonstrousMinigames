import { Game, GameNames } from '../../../config/games';
import { MessageTypes } from '../../../utils/constants';
import { screenGetReadyRoute } from '../../../utils/routes';
import history from '../../history/history';
import { Socket } from '../../socket/Socket';

export function handleStartGameClick(
    setChosenGame: (game: GameNames) => void,
    selectedGame: Game,
    roomId: string | undefined,
    screenAdmin: boolean,
    screenSocket: Socket | undefined,
    difficulty: number
) {
    setChosenGame(selectedGame.id);
    if (screenAdmin) {
        localStorage.setItem('game', selectedGame.id);
        screenSocket?.emit({
            type: MessageTypes.chooseGame,
            game: selectedGame.id,
            difficulty,
        });
    }
    history.push(screenGetReadyRoute(roomId));
}
