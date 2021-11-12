import { ObstacleTypes } from "./constants";

export enum Routes {
    // Routes for router
    credits = '/credits',
    settings = '/settings',
    controllerTutorial = '/controller/:id/tutorial',
    controllerChooseCharacter = '/controller/:id/choose-character',
    controllerLobby = '/controller/:id/lobby',
    controllerGame1 = '/controller/:id/game1',
    controllerGame2 = '/controller/:id/game2',
    controllerGame3 = '/controller/:id/game3',
    controllerTreeStump = `/controller/:id/treestump`,
    controllerSpider = `/controller/:id/spider`,
    controllerTrash = `/controller/:id/trash`,
    controllerStone = `/controller/:id/stone`,
    controllerPlayerDead = '/controller/:id/dead',
    controllerPlayerStunned = '/controller/:id/stunned',
    controllerPlayerFinished = '/controller/:id/finished',
    controllerWindmill = '/controller/:id/windmill',
    controllerVote = '/controller/:id/vote',
    controllerPresent = '/controller/:id/present',

    screenLobby = '/screen/:id/lobby',
    screenLeaderboard = '/screen/:id/leaderboard',
    screenChooseGame = '/screen/:id/choose-game',
    screenGetReady = '/screen/:id/get-ready',
    screenGame1 = '/screen/:id/game1',
    screenGame2 = '/screen/:id/game2',
    screenGame3 = '/screen/:id/game3',
    screenFinished = '/screen/:id/finished',
    // Route pieces for history
    home = '/:id?',
    controller = '/controller',
    screen = '/screen',
    leaderboard = '/leaderboard',
    lobby = '/lobby',
    treeStump = '/treestump',
    spider = '/spider',
    trash = '/trash',
    stone = '/stone',
    tutorial = '/tutorial',
    game1 = '/game1',
    game2 = '/game2',
    game3 = '/game3',
    dead = '/dead',
    finished = '/finished',
    chooseGame = '/choose-game',
    getReady = '/get-ready',
    stunned = '/stunned',
    chooseCharacter = '/choose-character',
    windmill = '/windmill',
    vote = '/vote',
    present = '/present',
}

export const controllerChooseCharacterRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.chooseCharacter}`;

export const controllerLobbyRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.lobby}`;

export const controllerPlayerDeadRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.dead}`;

export const controllerFinishedRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.finished}`;

export const controllerTutorialRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.tutorial}`;

export const controllerGame1Route = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.game1}`;

export const controllerGame2Route = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.game2}`;

export const controllerGame3Route = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.game3}`;

export const controllerVoteRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.vote}`;

export const controllerPresentRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.present}`;

export const controllerPlayerStunnedRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.stunned}`;

export const controllerObstacleRoute = (roomId: undefined | string, obstacle: ObstacleTypes) => {
    switch (obstacle) {
        case ObstacleTypes.treeStump:
            return `${Routes.controller}/${roomId}${Routes.treeStump}`;
        case ObstacleTypes.spider:
            return `${Routes.controller}/${roomId}${Routes.spider}`;
        case ObstacleTypes.trash:
            return `${Routes.controller}/${roomId}${Routes.trash}`;
        case ObstacleTypes.stone:
            return `${Routes.controller}/${roomId}${Routes.stone}`;
    }
};

export const controllerWindmillRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.windmill}`;

export const screenGetReadyRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.getReady}`;

export const screenChooseGameRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.chooseGame}`;

export const screenFinishedRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.finished}`;

export const screenLobbyRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.lobby}`;

export const screenLeaderboardRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.leaderboard}`;

export const screenGame1Route = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.game1}`;

export const screenGame2Route = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.game2}`;

export const screenGame3Route = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.game3}`;

export const screenGame3Vote = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.game3}`;
