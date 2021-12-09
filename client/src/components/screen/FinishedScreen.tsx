/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import { GameNames } from '../../config/games';
import { MyAudioContext, Sound } from '../../contexts/AudioContextProvider';
import { FirebaseContext } from '../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/screen/ScreenSocketContextProvider';
import { handleResetGame } from '../../domain/commonGameState/screen/handleResetGame';
import { formatMs } from '../../utils/formatMs';
import Button from '../common/Button';
import { FullScreenContainer } from '../common/FullScreenStyles.sc';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { Label } from '../common/Label.sc';
import { Headline, LeaderBoardRow, RankTable, UnfinishedUserRow } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks, screenAdmin, resetGame, chosenGame, roomId } = React.useContext(GameContext);
    const { resetGame3 } = React.useContext(Game3Context);
    const { changeSound } = React.useContext(MyAudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { deleteImages } = React.useContext(FirebaseContext);

    const deadPlayers = playerRanks?.filter(playerRank => playerRank.dead) || [];
    const sortedPlayerRanks = playerRanks?.filter(playerRank => !playerRank.dead).sort((a, b) => a.rank! - b.rank!);

    const handleBackToLobby = () => {
        handleResetGame(screenSocket, { resetGame, resetGame3 }, true);
    };

    React.useEffect(() => {
        changeSound(Sound.finished);

        if (chosenGame === GameNames.game3 && screenAdmin) {
            deleteImages(roomId);
        }
    }, []);

    return (
        <FullScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                {sortedPlayerRanks?.map((player, index) => (
                    <LeaderBoardRow key={`LeaderBoardRow${index}`}>
                        <Instruction variant="dark">
                            <InstructionText>
                                #{player.rank} {player.name}
                            </InstructionText>
                        </Instruction>

                        {player.totalTimeInMs && (
                            <>
                                <Instruction variant="light">
                                    <InstructionText>{formatMs(player.totalTimeInMs)}</InstructionText>
                                </Instruction>

                                {index === 0 ? (
                                    <Instruction variant="secondary">
                                        <InstructionText>{`${formatMs(player.totalTimeInMs)}`} </InstructionText>
                                    </Instruction>
                                ) : (
                                    <Instruction variant="primary">
                                        <InstructionText>
                                            {`+${formatMs(
                                                player.totalTimeInMs! - sortedPlayerRanks[0].totalTimeInMs!
                                            )}`}{' '}
                                        </InstructionText>
                                    </Instruction>
                                )}
                            </>
                        )}
                        {player.points && (
                            <Instruction variant="light">
                                <InstructionText>{player.points}</InstructionText>
                            </Instruction>
                        )}
                    </LeaderBoardRow>
                ))}
                {deadPlayers?.length > 0 && (
                    <>
                        <Label>Dead Players:</Label>
                        {deadPlayers.map((player, index) => (
                            <UnfinishedUserRow key={`UnfinishedLeaderBoardRow${index}`}>
                                <InstructionContainer>
                                    <Instruction variant="dark">
                                        <InstructionText>{player.name}</InstructionText>
                                    </Instruction>
                                </InstructionContainer>
                            </UnfinishedUserRow>
                        ))}
                    </>
                )}
            </RankTable>
            {screenSocket && screenAdmin && <Button onClick={handleBackToLobby}>Back to Lobby</Button>}
        </FullScreenContainer>
    );
};
