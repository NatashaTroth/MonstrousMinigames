import React from 'react';

import { GameNames } from '../../../../config/games';
import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { Socket } from '../../../socket/Socket';
import { sendMovement } from './sendMovement';

export function sendMovementToController(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    playerFinished: boolean,
    controllerSocket: Socket,
    hasPaused: boolean,
    sendMovement: (socket: Socket, hasPaused: boolean) => void,
    chosenGame: GameNames | undefined
) {
    event.preventDefault();
    if (playerFinished || chosenGame === GameNames.game2) return;

    if (event?.acceleration?.x && (event?.acceleration?.x < -2 || event?.acceleration?.x > 2)) {
        sendMovement(controllerSocket, hasPaused);
    }
}

export const useMovementListener = (socket: Socket, permission: boolean) => {
    const { playerFinished } = React.useContext(Game1Context);
    const { hasPaused, chosenGame } = React.useContext(GameContext);

    React.useEffect(() => {
        if (permission) {
            window.addEventListener('devicemotion', e =>
                sendMovementToController(e, playerFinished, socket, hasPaused, sendMovement, chosenGame)
            );
        }

        return () => {
            window.removeEventListener('devicemotion', e =>
                sendMovementToController(e, playerFinished, socket, hasPaused, sendMovement, chosenGame)
            );
        };
    }, [permission, hasPaused, playerFinished, socket, chosenGame]);
};
