import * as React from "react";

import { GameNames } from "../../config/games";
import { MyAudioContext, Sound } from "../../contexts/AudioContextProvider";
import { FirebaseContext } from "../../contexts/FirebaseContextProvider";
import { GameContext } from "../../contexts/GameContextProvider";
import { ScreenSocketContext } from "../../contexts/screen/ScreenSocketContextProvider";
import { handleResetGame } from "../../domain/commonGameState/screen/handleResetGame";
import { formatMs } from "../../utils/formatMs";
import Button from "../common/Button";
import { FullScreenContainer, OrangeContainerBase } from "../common/FullScreenStyles.sc";
import { InstructionText } from "../common/Instruction.sc";
import {
    ButtonContainer, ContentContainer, Header, HeaderRow, HeaderText, Headline, LeaderBoardRow,
    RankTable, StyledInstruction, StyledLabel, StyledTypography, UnfinishedUserRow
} from "./FinishedScreen.sc";

export const FinishedScreen: React.FunctionComponent = () => {
    const { screenAdmin, roomId, playerRanks, chosenGame } = React.useContext(GameContext);
    const { changeSound } = React.useContext(MyAudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { deleteImages } = React.useContext(FirebaseContext);

    const deadPlayers = playerRanks?.filter(playerRank => playerRank.dead) || [];
    const sortedPlayerRanks = playerRanks?.filter(playerRank => !playerRank.dead).sort((a, b) => a.rank! - b.rank!);

    const handleBackToLobby = () => {
        handleResetGame(screenSocket);
    };

    React.useEffect(() => {
        changeSound(Sound.finished);

        if (chosenGame === GameNames.game3 && screenAdmin) {
            deleteImages(roomId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FullScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                <OrangeContainerBase>
                    <ContentContainer>
                        <HeaderRow>
                            <Header chosenGame={chosenGame}>
                                <HeaderText>Rank & Name</HeaderText>
                            </Header>
                            {chosenGame === GameNames.game1 && (
                                <>
                                    <Header chosenGame={chosenGame}>
                                        <HeaderText>Total Time</HeaderText>
                                    </Header>

                                    <Header chosenGame={chosenGame}>
                                        <HeaderText>Difference</HeaderText>
                                    </Header>
                                </>
                            )}
                            {chosenGame === GameNames.game2 && (
                                <Header chosenGame={chosenGame}>
                                    <HeaderText>Average Error</HeaderText>
                                </Header>
                            )}
                            {chosenGame === GameNames.game3 && (
                                <Header chosenGame={chosenGame}>
                                    <HeaderText>Game Points</HeaderText>
                                </Header>
                            )}

                            <Header chosenGame={chosenGame}>
                                <HeaderText>Leaderboard Points</HeaderText>
                            </Header>
                        </HeaderRow>
                        {sortedPlayerRanks?.map((player, index) => (
                            <LeaderBoardRow key={`LeaderBoardRow${index}`}>
                                <StyledInstruction variant="dark" chosenGame={chosenGame}>
                                    <InstructionText>
                                        #{player.rank} {player.name}
                                    </InstructionText>
                                </StyledInstruction>

                                {player.totalTimeInMs && (
                                    <>
                                        <StyledInstruction variant="light" chosenGame={chosenGame}>
                                            <InstructionText>{formatMs(player.totalTimeInMs)}</InstructionText>
                                        </StyledInstruction>

                                        {index === 0 ? (
                                            <StyledInstruction variant="secondary" chosenGame={chosenGame} />
                                        ) : (
                                            <StyledInstruction variant="secondary" chosenGame={chosenGame}>
                                                <InstructionText>
                                                    {`+${formatMs(
                                                        player.totalTimeInMs! - sortedPlayerRanks[0].totalTimeInMs!
                                                    )}`}{' '}
                                                </InstructionText>
                                            </StyledInstruction>
                                        )}
                                    </>
                                )}
                                {chosenGame === GameNames.game2 && (
                                    <StyledInstruction variant="light" chosenGame={chosenGame}>
                                        <InstructionText>
                                            {player.difference ? player.difference.toFixed(2) : ''}
                                        </InstructionText>
                                    </StyledInstruction>
                                )}
                                {chosenGame === GameNames.game3 && (
                                    <StyledInstruction variant="light" chosenGame={chosenGame}>
                                        <InstructionText>{player.votes}</InstructionText>
                                    </StyledInstruction>
                                )}

                                <StyledInstruction variant="light" chosenGame={chosenGame}>
                                    <InstructionText>{player.points}</InstructionText>
                                </StyledInstruction>
                            </LeaderBoardRow>
                        ))}
                        {deadPlayers?.length > 0 && (
                            <>
                                <StyledLabel>Dead Players:</StyledLabel>
                                {deadPlayers.map((player, index) => (
                                    <UnfinishedUserRow key={`UnfinishedLeaderBoardRow${index}`}>
                                        <StyledTypography>{player.name}</StyledTypography>
                                    </UnfinishedUserRow>
                                ))}
                            </>
                        )}
                    </ContentContainer>
                </OrangeContainerBase>
            </RankTable>
            {screenSocket && screenAdmin && (
                <ButtonContainer>
                    <Button onClick={handleBackToLobby}>Back to Lobby</Button>
                </ButtonContainer>
            )}
        </FullScreenContainer>
    );
};
