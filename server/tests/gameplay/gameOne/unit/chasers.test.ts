import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { leaderboard, roomId, users } from '../../mockData';
import { clearTimersAndIntervals } from '../gameOneHelperFunctions';

let gameOne: GameOne;
const InitialGameParameters = getInitialParams();

describe('Chasers', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('starts chasers at initial positionX', async () => {
        gameOne = new GameOne(roomId, leaderboard);
        expect(gameOne.chasersPositionX).toBe(InitialGameParameters.CHASERS_POSITION_X);
    });

    it('moves the chasers after time passes', async () => {
        gameOne['updateChasersPosition'](100);
        expect(gameOne.chasersPositionX).toBeGreaterThan(InitialGameParameters.CHASERS_POSITION_X);
    });

    it('should call handlePlayerCaught when checkIfPlayersCaught is called and a player is caught', async () => {
        const handlePlayerCaughtSpy = jest.spyOn(GameOne.prototype as any, 'handlePlayerCaught');
        gameOne.players.get(users[0].id)!.positionX = 0;
        gameOne.chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
        gameOne['checkIfPlayersCaught']();
        expect(handlePlayerCaughtSpy).toBeCalledWith(gameOne.players.get(users[0].id));
    });

    it('should call handlePlayerCaught once when checkIfPlayersCaught for all caught players', async () => {
        const handlePlayerCaughtSpy = jest.spyOn(GameOne.prototype as any, 'handlePlayerCaught');

        users.forEach(user => {
            gameOne.players.get(user.id)!.positionX = 0;
        });

        gameOne.chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
        gameOne['checkIfPlayersCaught']();
        expect(handlePlayerCaughtSpy).toHaveBeenCalledTimes(users.length);
    });

    it('should not call handlePlayerCaught when checkIfPlayersCaught is called and no players were caught', async () => {
        const handlePlayerCaughtSpy = jest.spyOn(GameOne.prototype as any, 'handlePlayerCaught');
        gameOne.chasersPositionX = 0;
        gameOne['checkIfPlayersCaught']();
        expect(handlePlayerCaughtSpy).not.toBeCalled();
    });

    it('sets player to dead when on the same pos as a chaser', async () => {
        gameOne.players.get('1')!.positionX = InitialGameParameters.CHASERS_POSITION_X;
        gameOne['updateChasersPosition'](100);
        expect(gameOne.players.get('1')!.dead).toBeTruthy();
    });

    it('sets player to dead when the chaser has passed the player', async () => {
        gameOne.players.get('1')!.positionX = 0;
        gameOne['updateChasersPosition'](100);
        expect(gameOne.players.get('1')!.dead).toBeTruthy();
    });
});

describe('Push Chasers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
        gameOne.players.get(users[0].id)!.finished = true;
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
    });

    it('should not push chasers when pushing user has not finished', async () => {
        const initialChasersPositionX = gameOne.chasersPositionX;
        gameOne['pushChasers'](users[1].id);
        expect(gameOne.chasersPositionX).toBe(initialChasersPositionX);
    });

    it('should push chasers forward when pushChasers is called', async () => {
        const initialChasersPositionX = gameOne.chasersPositionX;
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.chasersPositionX).toBeGreaterThan(initialChasersPositionX);
    });

    it('should push chasers forward chasers push amount', async () => {
        const initialChasersPositionX = gameOne.chasersPositionX;
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.chasersPositionX).toBe(initialChasersPositionX + InitialGameParameters.CHASER_PUSH_AMOUNT);
    });

    it('should increase chaser speed when pushChasers is called', async () => {
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.chasersSpeed).toBe(InitialGameParameters.CHASERS_PUSH_SPEED);
    });

    it('should return chaser speed to normal when pushChasers time has run out', async () => {
        gameOne['pushChasers'](users[0].id);
        clearTimersAndIntervals(gameOne);
        expect(gameOne.chasersSpeed).toBe(InitialGameParameters.CHASERS_SPEED);
    });

    it('should check if chaser has passed a player when pushed', async () => {
        gameOne.players.get(users[1].id)!.positionX = InitialGameParameters.CHASERS_POSITION_X;
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.players.get(users[1].id)!.dead).toBeTruthy();
    });

    it('should increase pushing users chaserPushesUsed number', async () => {
        const initialChaserPushesUsed = gameOne.players.get(users[0].id)!.chaserPushesUsed;
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.players.get(users[0].id)!.chaserPushesUsed).toBe(initialChaserPushesUsed + 1);
    });

    it('should not push chasers when pushing user has exceeded max number of pushes', async () => {
        const initialChasersPositionX = gameOne.chasersPositionX;
        gameOne.players.get(users[0].id)!.chaserPushesUsed = InitialGameParameters.MAX_NUMBER_CHASER_PUSHES;
        gameOne['pushChasers'](users[0].id);
        expect(gameOne.chasersPositionX).toBe(initialChasersPositionX);
    });
});
