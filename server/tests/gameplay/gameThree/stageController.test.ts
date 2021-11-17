import 'reflect-metadata';

import { GameThree } from '../../../src/gameplay';
import {
    Countdown, SinglePhotoStage, StageController
} from '../../../src/gameplay/gameThree/classes';
import StageEventEmitter from '../../../src/gameplay/gameThree/classes/StageEventEmitter';
import InitialParameters from '../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeMessageTypes } from '../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import { IMessagePhoto } from '../../../src/gameplay/gameThree/interfaces';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { leaderboard, mockPhotoUrl, roomId, users } from '../mockData';

let stageController: StageController;

const message: IMessagePhoto = {
    type: GameThreeMessageTypes.PHOTO,
    photographerId: users[0].id,
    url: mockPhotoUrl,
};
let stageEventEmitter: StageEventEmitter;

describe('First stage', () => {
    beforeEach(() => {
        const gameThree = new GameThree(roomId, leaderboard);
        stageController = new StageController(roomId, gameThree.players);
        stageEventEmitter = StageEventEmitter.getInstance();
    });

    // it('should initiate SinglePhotoStage', async () => {
    //     const spy = jest.spyOn(SinglePhotoStage.prototype as any, 'constructor');
    //     stageController.handleNewRound();
    //     expect(spy).toHaveBeenCalled();
    // });

    it('should start round with take photo countdown', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'initiateCountdown');
        stageController.handleNewRound();
        expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    });

    it('should end the stage when all photos received', async () => {
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
