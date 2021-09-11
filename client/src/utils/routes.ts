import { ObstacleTypes } from './constants';

export enum Routes {
    // Routes for router
    credits = '/credits',
    settings = '/settings',
    controllerChooseCharacter = '/controller/:id/choose-character',
    controllerLobby = '/controller/:id/lobby',
    controllerGame1 = '/controller/:id/game1',
    controllerTreeStump = `/controller/:id/treestump`,
    controllerSpider = `/controller/:id/spider`,
    controllerTrash = `/controller/:id/trash`,
    controllerStone = `/controller/:id/stone`,
    controllerPlayerDead = '/controller/:id/dead',
    controllerPlayerStunned = '/controller/:id/stunned',
    controllerPlayerFinished = '/controller/:id/finished',
    screenLobby = '/screen/:id/lobby',
    screenChooseGame = '/screen/:id/choose-game',
    screenGameIntro = '/screen/:id/game-intro',
    screenGetReady = '/screen/:id/get-ready',
    screenGame1 = '/screen/:id/game1',
    screenFinished = '/screen/:id/finished',
    // Route pieces for history
    home = '/:id?',
    controller = '/controller',
    screen = '/screen',
    lobby = '/lobby',
    treeStump = '/treestump',
    spider = '/spider',
    trash = '/trash',
    stone = '/stone',
    game1 = '/game1',
    dead = '/dead',
    finished = '/finished',
    gameIntro = '/game-intro',
    chooseGame = '/choose-game',
    getReady = '/get-ready',
    stunned = '/stunned',
    chooseCharacter = '/choose-character',
}

export const controllerChooseCharacterRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.chooseCharacter}`;

export const controllerLobbyRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.lobby}`;

export const controllerPlayerDeadRoute = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.dead}`;

export const controllerFinishedRoute = (roomId: undefined | string) =>
    `${Routes.controller}/${roomId}${Routes.finished}`;

export const controllerGame1Route = (roomId: undefined | string) => `${Routes.controller}/${roomId}${Routes.game1}`;

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

export const screenGameIntroRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.gameIntro}`;

export const screenGetReadyRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.getReady}`;

export const screenChooseGameRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.chooseGame}`;

export const screenFinishedRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.finished}`;

export const screenLobbyRoute = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.lobby}`;

export const screenGame1Route = (roomId: undefined | string) => `${Routes.screen}/${roomId}${Routes.game1}`;
