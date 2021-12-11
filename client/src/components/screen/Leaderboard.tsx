import { darken, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';

import { GameContext } from '../../contexts/GameContextProvider';
import { LeaderboardState } from '../../contexts/ScreenSocketContextProvider';
import history from '../../domain/history/history';
import Button from '../common/Button';
import {
    BackButtonContainer, ContentBase, ContentContainer, FullScreenContainer, Headline
} from '../common/FullScreenStyles.sc';
import { LeaderboardGrid, LeaderboardRow } from './Leaderboard.sc';
import { TabPanel } from './TabPanel';

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // backgroundColor: theme.palette.background.paper,
        width: 750,
    },
}));

const Leaderboard: React.FunctionComponent = () => {
    const { leaderboardState } = React.useContext(GameContext); //connectedUsers
    const leaderboardStateMock: LeaderboardState = JSON.parse(
        ' {"roomId":"xxx","gameHistory":[{"game":"The Great Monster Escape","playerRanks":[{"id":"1","name":"Harry","rank":1,"finished":true,"isActive":true, "points":5},{"id":"2","name":"Ron","rank":2,"finished":true,"isActive":true, "points":4},{"id":"3","name":"James","rank":3,"finished":true,"isActive":true, "points":3},{"id":"4","name":"Luna","rank":4,"finished":true,"isActive":true, "points":2}]}],"userPoints":[{"userId":"1","name":"Harry","points":5,"rank":1},{"userId":"2","name":"Ron","points":3,"rank":2},{"userId":"3","name":"James","points":2,"rank":3},{"userId":"4","name":"Luna","points":1,"rank":4}]}'
    );

    // const users =
    //     connectedUsers?.map(user => {
    //         const points = leaderboardState?.userPoints.find(userPointsElement => user.id === userPointsElement.userId);
    //         return { ...user, rank: points?.rank || '-', points: points?.points || 0 };
    //     }) || [];
    const userPoints = leaderboardStateMock?.userPoints || [];
    const gameHistory = leaderboardStateMock?.gameHistory || [];
    const classes = useStyles();

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

                    <div className={classes.root}>
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
                                {/* HEEEREHEEEREHEEEREHEEEREHEEEREHEEEREHEEEREHEEERE */}
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
                                    <div key={index}>
                                        {gamePlayed.game}
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
                                    </div>
                                ))}
                            </TabPanel>
                        </SwipeableViews>
                    </div>
                </ContentBase>
            </ContentContainer>
            <BackButtonContainer>
                <Button onClick={history.goBack}>Back</Button>
            </BackButtonContainer>
        </FullScreenContainer>
    );
};

export default Leaderboard;
