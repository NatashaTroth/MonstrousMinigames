import { Grid } from '@material-ui/core';
import React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import Button from '../common/Button';
import {
    BackButtonContainer, ContentBase, ContentContainer, FullScreenContainer, Headline
} from '../common/FullScreenStyles.sc';
import { LeaderboardGrid, LeaderboardRow } from './Leaderboard.sc';

const Leaderboard: React.FunctionComponent = () => {
    const { leaderboardState } = React.useContext(GameContext); //connectedUsers

    // const users =
    //     connectedUsers?.map(user => {
    //         const points = leaderboardState?.userPoints.find(userPointsElement => user.id === userPointsElement.userId);
    //         return { ...user, rank: points?.rank || '-', points: points?.points || 0 };
    //     }) || [];
    const userPoints = leaderboardState?.userPoints || [];

    return (
        <FullScreenContainer>
            <ContentContainer>
                <ContentBase>
                    <Headline>Leaderboard</Headline>
                    <LeaderboardGrid container spacing={2}>
                        <LeaderboardRow header>
                            <Grid item xs>
                                Rank
                            </Grid>
                            <Grid item xs>
                                Name
                            </Grid>
                            <Grid item xs>
                                Points
                            </Grid>
                        </LeaderboardRow>
                        {userPoints.map((user, index) => (
                            <LeaderboardRow key={user.userId} index={index}>
                                <Grid item xs>
                                    {user.rank}
                                </Grid>
                                <Grid item xs>
                                    {user.name}
                                </Grid>
                                <Grid item xs>
                                    {user.points}
                                </Grid>
                            </LeaderboardRow>
                        ))}
                    </LeaderboardGrid>
                </ContentBase>
            </ContentContainer>
            <BackButtonContainer>
                <Button onClick={history.goBack}>Back</Button>
            </BackButtonContainer>
        </FullScreenContainer>
    );
};

export default Leaderboard;
