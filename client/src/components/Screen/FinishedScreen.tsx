import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import { handleResetGame } from '../../domain/gameState/screen/handleResetGame';
import { formatMs } from '../../utils/formatMs';
import Button from '../common/Button';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { Label } from '../common/Label.sc';
import { FinishedScreenContainer, Headline, LeaderBoardRow, RankTable, UnfinishedUserRow } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks, screenAdmin, resetGame } = React.useContext(GameContext);
    const { audioPermission, setAudioPermissionGranted, initialPlayFinishedMusic } = React.useContext(AudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    const deadPlayers = playerRanks?.filter(playerRank => playerRank.dead) || [];
    const sortedPlayerRanks = playerRanks?.filter(playerRank => !playerRank.dead).sort((a, b) => a.rank! - b.rank!);

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayFinishedMusic(true);
    }, []);

    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                {sortedPlayerRanks?.map((player, index) => (
                    <LeaderBoardRow key={`LeaderBoardRow${index}`}>
                        <Instruction variant="dark">
                            <InstructionText>
                                #{player.rank} {player.name}
                            </InstructionText>
                        </Instruction>

                        <Instruction variant="light">
                            <InstructionText>{formatMs(player.totalTimeInMs!)}</InstructionText>
                        </Instruction>

                        {index === 0 ? (
                            <Instruction variant="secondary">
                                <InstructionText>{`${formatMs(player.totalTimeInMs!)}`} </InstructionText>
                            </Instruction>
                        ) : (
                            <Instruction variant="primary">
                                <InstructionText>
                                    {`+${formatMs(player.totalTimeInMs! - sortedPlayerRanks[0].totalTimeInMs!)}`}{' '}
                                </InstructionText>
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
            {screenSocket && screenAdmin && (
                <Button onClick={() => handleResetGame(screenSocket, { resetGame }, true)}>Back to Lobby</Button>
            )}
        </FinishedScreenContainer>
    );
};
