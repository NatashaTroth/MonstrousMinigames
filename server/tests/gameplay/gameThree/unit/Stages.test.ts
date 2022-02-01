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
    return { id: user.id, name: user.name, isActive: true };
});

describe('Stages without next stage', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should return null as the next stage when call switchToNextStage on ViewingResultsStage ', () => {
        const viewingResultsStage = new ViewingResultsStage(roomId, players);
        expect(viewingResultsStage.switchToNextStage()).toBe(null);
    });

    it('should return null as the next stage when call switchToNextStage on ViewingResultsStage ', () => {
        const finalPhotosVotingStage = new FinalPhotosVotingStage(roomId, players);
        expect(finalPhotosVotingStage.switchToNextStage()).toBe(null);
    });
});
