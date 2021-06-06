import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleResetGame } from '../../domain/gameState/screen/handleResetGame';
import { formatMs } from '../../utils/formatMs';
import Button from '../common/Button';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { Label } from '../common/Label.sc';
import { FinishedScreenContainer, Headline, LeaderBoardRow, RankTable, UnfinishedUserRow } from './FinishedScreen.sc';
export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks, hasTimedOut, screenAdmin, resetGame } = React.useContext(GameContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    const unfinishedPlayers = playerRanks?.filter(playerRank => !playerRank.rank) || [];
    const sortedPlayerRanks = playerRanks?.filter(playerRank => playerRank.rank).sort((a, b) => a.rank! - b.rank!);
    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>{hasTimedOut ? 'Game has timed out!' : 'Finished!'}</Headline>
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
                {unfinishedPlayers?.length > 0 && (
                    <>
                        <Label>Unfinished Players:</Label>
                        {unfinishedPlayers.map((player, index) => (
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
            {screenSocket && (
                <Button onClick={() => handleResetGame(screenSocket, { resetGame }, true)}>Back to Lobby</Button>
            )}
            {screenAdmin && <Button>Back to Lobby</Button>}
        </FinishedScreenContainer>
    );
};
