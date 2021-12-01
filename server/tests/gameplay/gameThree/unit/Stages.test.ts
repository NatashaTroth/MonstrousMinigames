import 'reflect-metadata';

import {
    FinalPhotosVotingStage
} from '../../../../src/gameplay/gameThree/classes/FinalPhotoVotingStage';
import {
    ViewingResultsStage
} from '../../../../src/gameplay/gameThree/classes/ViewingResultsStage';
import { PlayerNameId } from '../../../../src/gameplay/gameThree/interfaces';
import { roomId, users } from '../../mockData';

const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name };
});

describe('Stage order after countdown', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });
    it.todo('');

    // it('should create a new SinglePhotoStage object', () => {
    //     const spy = jest.spyOn(Stage.prototype as any, 'constructor').mockImplementation(() => {
    //         Promise.resolve();
    //     });
    //     const singlePhotoStage = new SinglePhotoStage(roomId, players);
    //     // expect().toBeInstanceOf(SinglePhotoStage);
    //     // gameThree.createNewGame(users);
    //     // expect(spy).toHaveBeenCalledTimes(1);
    // });
});

describe('Stages without next stage', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should return itsself as the next stage when call switchToNextStage on ViewingResultsStage ', () => {
        const viewingResultsStage = new ViewingResultsStage(roomId, players);
        expect(viewingResultsStage.switchToNextStage()).toBe(viewingResultsStage);
    });

    it('should return itsself as the next stage when call switchToNextStage on ViewingResultsStage ', () => {
        const finalPhotosVotingStage = new FinalPhotosVotingStage(roomId, players);
        expect(finalPhotosVotingStage.switchToNextStage()).toBe(finalPhotosVotingStage);
    });
});
