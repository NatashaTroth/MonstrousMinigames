import { ObstacleTypes } from './constants';
import {
    controllerChooseCharacterRoute,
    controllerFinishedRoute,
    controllerGame1Route,
    controllerLobbyRoute,
    controllerObstacleRoute,
    controllerPlayerDeadRoute,
    controllerPlayerStunnedRoute,
    controllerStoneRoute,
    Routes,
    screenChooseGameRoute,
    screenFinishedRoute,
    screenGame1Route,
    screenGameIntroRoute,
    screenGetReadyRoute,
    screenLobbyRoute,
} from './routes';

describe('test routing functions', () => {
    const roomId = 'ABCD';

    it('controllerChooseCharacterRoute should return /controller/${roomId}/choose-character', () => {
        expect(controllerChooseCharacterRoute(roomId)).toBe(`/controller/${roomId}/choose-character`);
    });

    it('controllerLobbyRoute should return /controller/${roomId}/lobby', () => {
        expect(controllerLobbyRoute(roomId)).toBe(`/controller/${roomId}/lobby`);
    });

    it('controllerStoneRoute should return /controller/${roomId}/stone', () => {
        expect(controllerStoneRoute(roomId)).toBe(`/controller/${roomId}/stone`);
    });

    it('controllerPlayerDeadRoute should return /controller/${roomId}/dead', () => {
        expect(controllerPlayerDeadRoute(roomId)).toBe(`/controller/${roomId}/dead`);
    });

    it('controllerFinishedRoute should return /controller/${roomId}/finished', () => {
        expect(controllerFinishedRoute(roomId)).toBe(`/controller/${roomId}/finished`);
    });

    it('controllerGame1Route should return /controller/${roomId}/game1', () => {
        expect(controllerGame1Route(roomId)).toBe(`/controller/${roomId}/game1`);
    });

    it('controllerPlayerStunnedRoute should return /controller/${roomId}/stunned', () => {
        expect(controllerPlayerStunnedRoute(roomId)).toBe(`/controller/${roomId}/stunned`);
    });

    it('controllerObstacleRoute should return /controller/${roomId}/treestump', () => {
        expect(controllerObstacleRoute(roomId, ObstacleTypes.treeStump)).toBe(`/controller/${roomId}/treestump`);
    });

    it('controllerObstacleRoute should return /controller/${roomId}/spider', () => {
        expect(controllerObstacleRoute(roomId, ObstacleTypes.spider)).toBe(`/controller/${roomId}/spider`);
    });

    it('controllerObstacleRoute should return /controller/${roomId}/trash', () => {
        expect(controllerObstacleRoute(roomId, ObstacleTypes.trash)).toBe(`/controller/${roomId}/trash`);
    });

    it('screenGameIntroRoute should return /screen/${roomId}/game-intro', () => {
        expect(screenGameIntroRoute(roomId)).toBe(`/screen/${roomId}/game-intro`);
    });

    it('screenGetReadyRoute should return /screen/${roomId}/get-ready', () => {
        expect(screenGetReadyRoute(roomId)).toBe(`/screen/${roomId}/get-ready`);
    });

    it('screenChooseGameRoute should return /screen/${roomId}/choose-game', () => {
        expect(screenChooseGameRoute(roomId)).toBe(`/screen/${roomId}/choose-game`);
    });

    it('screenFinishedRoute should return /screen/${roomId}/finished`', () => {
        expect(screenFinishedRoute(roomId)).toBe(`/screen/${roomId}/finished`);
    });

    it('screenLobbyRoute should return /screen/${roomId}/lobby', () => {
        expect(screenLobbyRoute(roomId)).toBe(`/screen/${roomId}/lobby`);
    });

    it('screenGame1Route should return /screen/${roomId}/game1', () => {
        expect(screenGame1Route(roomId)).toBe(`/screen/${roomId}/game1`);
    });
});

describe('test Routes enum', () => {
    it('Routes.credits should return /credits', () => {
        expect(Routes.credits).toBe('/credits');
    });

    it('Routes.settings should return /settings', () => {
        expect(Routes.settings).toBe('/settings');
    });

    it('Routes.controllerChooseCharacter should return /controller/:id/choose-character', () => {
        expect(Routes.controllerChooseCharacter).toBe('/controller/:id/choose-character');
    });

    it('Routes.controllerLobby should return /controller/:id/lobby', () => {
        expect(Routes.controllerLobby).toBe('/controller/:id/lobby');
    });

    it('Routes.controllerGame1 should return /controller/:id/game1', () => {
        expect(Routes.controllerGame1).toBe('/controller/:id/game1');
    });

    it('Routes.controllerTreeStump should return /controller/:id/treestump', () => {
        expect(Routes.controllerTreeStump).toBe('/controller/:id/treestump');
    });

    it('Routes.controllerSpider should return /controller/:id/spider', () => {
        expect(Routes.controllerSpider).toBe('/controller/:id/spider');
    });

    it('Routes.controllerTrash should return /controller/:id/trash', () => {
        expect(Routes.controllerTrash).toBe('/controller/:id/trash');
    });

    it('Routes.controllerStone should return /controller/:id/stone', () => {
        expect(Routes.controllerStone).toBe('/controller/:id/stone');
    });

    it('Routes.controllerPlayerDead should return /controller/:id/dead', () => {
        expect(Routes.controllerPlayerDead).toBe('/controller/:id/dead');
    });

    it('Routes.controllerPlayerStunned should return /controller/:id/stunned', () => {
        expect(Routes.controllerPlayerStunned).toBe('/controller/:id/stunned');
    });

    it('Routes.controllerPlayerFinished should return /controller/:id/finished', () => {
        expect(Routes.controllerPlayerFinished).toBe('/controller/:id/finished');
    });

    it('Routes.screenLobby should return /screen/:id/lobby', () => {
        expect(Routes.screenLobby).toBe('/screen/:id/lobby');
    });

    it('Routes.screenChooseGame should return /screen/:id/choose-game', () => {
        expect(Routes.screenChooseGame).toBe('/screen/:id/choose-game');
    });

    it('Routes.screenGameIntro should return /screen/:id/game-intro', () => {
        expect(Routes.screenGameIntro).toBe('/screen/:id/game-intro');
    });

    it('Routes.screenGetReady should return /screen/:id/get-ready', () => {
        expect(Routes.screenGetReady).toBe('/screen/:id/get-ready');
    });

    it('Routes.screenGame1 should return /screen/:id/game1', () => {
        expect(Routes.screenGame1).toBe('/screen/:id/game1');
    });

    it('Routes.screenFinished should return /screen/:id/finished', () => {
        expect(Routes.screenFinished).toBe('/screen/:id/finished');
    });

    it('Routes.home should return /:id?', () => {
        expect(Routes.home).toBe('/:id?');
    });

    it('Routes.controller should return /controller', () => {
        expect(Routes.controller).toBe('/controller');
    });

    it('Routes.screen should return /screen', () => {
        expect(Routes.screen).toBe('/screen');
    });

    it('Routes.lobby should return /lobby', () => {
        expect(Routes.lobby).toBe('/lobby');
    });

    it('Routes.treeStump should return /treestump', () => {
        expect(Routes.treeStump).toBe('/treestump');
    });

    it('Routes.spider should return /spider', () => {
        expect(Routes.spider).toBe('/spider');
    });

    it('Routes.trash should return /trash', () => {
        expect(Routes.trash).toBe('/trash');
    });

    it('Routes.stone should return /stone', () => {
        expect(Routes.stone).toBe('/stone');
    });

    it('Routes.game1 should return /game1', () => {
        expect(Routes.game1).toBe('/game1');
    });

    it('Routes.dead should return /dead', () => {
        expect(Routes.dead).toBe('/dead');
    });

    it('Routes.finished should return /finished', () => {
        expect(Routes.finished).toBe('/finished');
    });

    it('Routes.gameIntro should return /game-intro', () => {
        expect(Routes.gameIntro).toBe('/game-intro');
    });

    it('Routes.chooseGame should return /choose-game', () => {
        expect(Routes.chooseGame).toBe('/choose-game');
    });

    it('Routes.getReady should return /get-ready', () => {
        expect(Routes.getReady).toBe('/get-ready');
    });

    it('Routes.stunned should return /stunned', () => {
        expect(Routes.stunned).toBe('/stunned');
    });

    it('Routes.chooseCharacter should return /choose-character', () => {
        expect(Routes.chooseCharacter).toBe('/choose-character');
    });
});
