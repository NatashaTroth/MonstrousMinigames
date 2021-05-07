import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { handleResetGame } from '../../domain/gameState/handleResetGame';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank, isPlayerAdmin, resetPlayer } = React.useContext(PlayerContext);
    const { resetGame, hasTimedOut } = React.useContext(GameContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                {(playerRank || hasTimedOut) && (
                    <FinishedScreenText>
                        {playerRank ? (
                            <>
                                #{playerRank}
                                <span>Finished!</span>
                            </>
                        ) : (
                            'Game has timed out'
                        )}
                    </FinishedScreenText>
                )}
                {/* TODO check if all players are finished */}
                {isPlayerAdmin && (
                    <Button
                        onClick={() => handleResetGame(controllerSocket, { resetPlayer, resetGame }, true)}
                        text="Back to Lobby"
                    />
                )}
            </FinishedScreenContainer>
        </FullScreenContainer>
    );
};
