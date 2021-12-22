import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';

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
import {
    GameHistory,
    GameHistoryHeadline,
    LeaderboardGrid,
    LeaderboardRow,
    LeaderboardWrapper,
} from './Leaderboard.sc';
import { TabPanel } from './TabPanel';

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const Leaderboard: React.FunctionComponent = () => {
    const { leaderboardState } = React.useContext(GameContext);

    const userPoints = leaderboardState?.userPoints ?? [];
    const gameHistory = leaderboardState?.gameHistory ?? [];

    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <FullScreenContainer>
            <ContentContainer>
                <ContentBase>
                    <Headline>Leaderboard</Headline>

                    <LeaderboardWrapper>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Points" {...a11yProps(0)} />
                                <Tab label="Game History" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <LeaderboardGrid container>
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
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                {gameHistory.map((gamePlayed, index) => (
                                    <GameHistory key={index}>
                                        <GameHistoryHeadline>{gamePlayed.game}</GameHistoryHeadline>
                                        <LeaderboardGrid container>
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
                                            {gamePlayed.playerRanks.map((playerRank, playerIdx) => (
                                                <LeaderboardRow key={playerIdx} index={playerIdx}>
                                                    <Grid item xs>
                                                        {playerRank.rank}
                                                    </Grid>
                                                    <Grid item xs>
                                                        {playerRank.name}
                                                    </Grid>
                                                    <Grid item xs>
                                                        {playerRank.points}
                                                    </Grid>
                                                </LeaderboardRow>
                                            ))}
                                        </LeaderboardGrid>
                                    </GameHistory>
                                ))}
                            </TabPanel>
                        </SwipeableViews>
                    </LeaderboardWrapper>
                </ContentBase>
            </ContentContainer>
            <BackButtonContainer>
                <Button onClick={history.goBack}>Back</Button>
            </BackButtonContainer>
        </FullScreenContainer>
    );
};

export default Leaderboard;
