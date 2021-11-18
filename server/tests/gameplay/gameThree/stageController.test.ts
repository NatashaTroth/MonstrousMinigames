import 'reflect-metadata';

import { GameThree } from '../../../src/gameplay';
import { StageController } from '../../../src/gameplay/gameThree/classes/StageController';
import StageEventEmitter from '../../../src/gameplay/gameThree/classes/StageEventEmitter';
import { GameThreeMessageTypes } from '../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import { IMessagePhoto } from '../../../src/gameplay/gameThree/interfaces';
import { leaderboard, mockPhotoUrl, roomId, users } from '../mockData';

let stageController: StageController;

const message: IMessagePhoto = {
    type: GameThreeMessageTypes.PHOTO,
    photographerId: users[0].id,
    url: mockPhotoUrl,
};
let stageEventEmitter: StageEventEmitter;
let gameThree: GameThree;
describe('First stage', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        stageEventEmitter = StageEventEmitter.getInstance();
    });

    // it('should initiate SinglePhotoStage', async () => {
    //     const spy = jest.spyOn(SinglePhotoStage.prototype as any, 'constructor');
    //     stageController.handleNewRound();
    //     expect(spy).toHaveBeenCalled();
    // });

    // fit('should start round with take photo countdown', async () => {
    //     const spy = jest.spyOn(Countdown.prototype as any, 'initiateCountdown');
    //     // stageController.handleNewRound();
    //     expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    // });

    it('should end the stage when all photos received', async () => {
        stageController = new StageController(roomId, gameThree.players);

        let eventCalled = false;
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalled = true;
        });

        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            stageController.handleInput(newMessage);
        });

        expect(eventCalled).toBeTruthy();
    });
});
