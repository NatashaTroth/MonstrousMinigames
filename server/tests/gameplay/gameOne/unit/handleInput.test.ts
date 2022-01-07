import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { GameOneMsgType } from '../../../../src/gameplay/gameOne/enums';
import GameOnePlayer from '../../../../src/gameplay/gameOne/GameOnePlayer';
import { IMessageStunPlayer } from '../../../../src/gameplay/gameOne/interfaces/messageStunPlayer';
import { leaderboard, mockMessage, roomId } from '../../mockData';

let gameOne: GameOne;

describe('Handle Input Method', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.gameState = GameState.Started;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it.todo('Not sure need these');

    // it('should call the runForward method when the Message is of type MOVE', async () => {
    //     const spy = jest.spyOn(GameOnePlayer as any, 'runForward').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message = { ...mockMessage };
    //     message.type = GameOneMsgType.MOVE;
    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should call the playerHasCompletedObstacle method when the Message is of type OBSTACLE_SOLVED', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'playerHasCompletedObstacle').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message = { ...mockMessage };

    //     message.type = GameOneMsgType.OBSTACLE_SOLVED;
    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should call the playerWantsToSolveObstacle method when the Message is of type SOLVE_OBSTACLE', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'playerWantsToSolveObstacle').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message = { ...mockMessage };

    //     message.type = GameOneMsgType.SOLVE_OBSTACLE;
    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should call the stunPlayer method when the Message is of type STUN_PLAYER', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'stunPlayer').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message: IMessageStunPlayer = { type: GameOneMsgType.STUN_PLAYER, receivingUserId: '1' };

    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should call not the stunPlayer method when the Message is of type STUN_PLAYER and no receivingUserId is given', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'stunPlayer').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message = { type: GameOneMsgType.STUN_PLAYER };

    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(0);
    // });

    // it('should call not the stunPlayer method when the Message is of type STUN_PLAYER and the user id is the receiving', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'stunPlayer').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message: IMessageStunPlayer = { type: GameOneMsgType.STUN_PLAYER, receivingUserId: '1', userId: '1' };

    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(0);
    // });

    // it('should call the pushChasers method when the Message is of type CHASERS_WERE_PUSHED', async () => {
    //     const spy = jest.spyOn(GameOne.prototype as any, 'pushChasers').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const message = { ...mockMessage };

    //     message.type = GameOneMsgType.CHASERS_WERE_PUSHED;
    //     gameOne.receiveInput(message);
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should output the message to the console if none of the above message types', async () => {
    //     console.info = jest.fn();
    //     gameOne.receiveInput({ type: 'WRONG' });
    //     expect(console.info).toHaveBeenCalledTimes(1);
    // });
});
