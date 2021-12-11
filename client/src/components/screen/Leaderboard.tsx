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

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

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
        ' {"roomId":"xxx","gameHistory":[{"game":"The Great Monster Escape","playerRanks":[{"id":"1","name":"Harry","rank":1,"finished":true,"isActive":true},{"id":"2","name":"Ron","rank":2,"finished":true,"isActive":true},{"id":"3","name":"James","rank":3,"finished":true,"isActive":true},{"id":"4","name":"Luna","rank":4,"finished":true,"isActive":true}]}],"userPoints":[{"userId":"1","name":"Harry","points":5,"rank":0},{"userId":"2","name":"Ron","points":3,"rank":0},{"userId":"3","name":"James","points":2,"rank":0},{"userId":"4","name":"Luna","points":1,"rank":0}]}'
    );

    // const users =
    //     connectedUsers?.map(user => {
    //         const points = leaderboardState?.userPoints.find(userPointsElement => user.id === userPointsElement.userId);
    //         return { ...user, rank: points?.rank || '-', points: points?.points || 0 };
    //     }) || [];
    const userPoints = leaderboardStateMock?.userPoints || [];
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
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            // indicatorColor={darken(theme.palette.secondary.main, 0.2)}
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            TabIndicatorProps={{ style: { background: darken(theme.palette.secondary.main, 0.2) } }}
                            // inkBarStyle={{ background: 'black' }}
                            // inkBarStyle={{ style: { background: darken(theme.palette.secondary.main, 0.2) } }}
                        >
                            <Tab label="Points" {...a11yProps(0)} />
                            <Tab label="GameHistory" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <div className={classes.root}>
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
                        </div>
                        {/* <TabPanel value={value} index={1} dir={theme.direction}>
                            Item Two
                        </TabPanel> */}
                    </SwipeableViews>
                </ContentBase>
            </ContentContainer>
            <BackButtonContainer>
                <Button onClick={history.goBack}>Back</Button>
            </BackButtonContainer>
        </FullScreenContainer>
    );
};

export default Leaderboard;
