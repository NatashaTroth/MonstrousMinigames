import { Grid } from '@material-ui/core';
import React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import Button from '../common/Button';
import {
    BackButtonContainer,
    ContentBase,
    ContentContainer,
    FullScreenContainer,
    Headline,
} from '../common/FullScreenStyles.sc';
import { LeaderboardGrid, LeaderboardRow } from './Leaderboard.sc';

const Leaderboard: React.FunctionComponent = () => {
    const { connectedUsers } = React.useContext(GameContext);

    // TODO use data from server
    const users = connectedUsers?.map(user => ({ ...user, rank: 1, points: 0 })).sort((a, b) => a.rank - b.rank) || [];

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
                        {users.map((user, index) => (
                            <LeaderboardRow key={user.id} index={index}>
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
