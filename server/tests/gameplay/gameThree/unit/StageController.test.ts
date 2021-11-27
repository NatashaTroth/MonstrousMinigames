import 'reflect-metadata';

import { FinalPhotosStage } from '../../../../src/gameplay/gameThree/classes/FinalPhotosStage';
import {
    FinalPhotosVotingStage
} from '../../../../src/gameplay/gameThree/classes/FinalPhotoVotingStage';
import { PresentationStage } from '../../../../src/gameplay/gameThree/classes/PresentationStage';
import { SinglePhotoStage } from '../../../../src/gameplay/gameThree/classes/SinglePhotoStage';
import { StageController } from '../../../../src/gameplay/gameThree/classes/StageController';
import StageEventEmitter from '../../../../src/gameplay/gameThree/classes/StageEventEmitter';
import {
    ViewingResultsStage
} from '../../../../src/gameplay/gameThree/classes/ViewingResultsStage';
import { VotingStage } from '../../../../src/gameplay/gameThree/classes/VotingStage';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import {
    IMessagePhoto, IMessagePhotoVote, PlayerNameId
} from '../../../../src/gameplay/gameThree/interfaces';
import { IMessage } from '../../../../src/interfaces/messages';
import { mockPhotoUrl, roomId, users } from '../../mockData';

let stageController: StageController;
const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name };
});
const photoMessage: IMessagePhoto = {
    type: GameThreeMessageTypes.PHOTO,
    url: mockPhotoUrl,
    photographerId: users[0].id,
};
const votingMessage: IMessagePhotoVote = {
    type: GameThreeMessageTypes.PHOTO_VOTE,
    voterId: users[0].id,
    photographerId: users[1].id,
};
const finishPresentingMessage: IMessage = {
    type: GameThreeMessageTypes.FINISHED_PRESENTING,
};

describe('Stage order after countdown', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should start with taking single photo stage', async () => {
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to voting stage after taking photo', async () => {
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        expect(stageController.currentStage!).toBeInstanceOf(VotingStage);
    });

    it('should switch to viewing results stage after voting', async () => {
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should switch to taking single photo stage after not final viewing results stage', async () => {
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to taking final photos stage after final viewing results stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosStage);
    });

    it('should switch to presentation stage taking final photos stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should stay on the presentation stage after a presentation', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should switch to final voting stage after all presentations', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosVotingStage);
    });

    it('should switch to no stage after final voting stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        expect(stageController.currentStage!).toBe(null);
    });
});

let stageEventEmitter: StageEventEmitter;

describe('Stage change events', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        stageEventEmitter = StageEventEmitter.getInstance();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit stage change event after taking photo', async () => {
        let eventCalledTimes = 0;
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        expect(stageController.currentStage!).toBeInstanceOf(VotingStage);

        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after voting', async () => {
        let eventCalledTimes = 0;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after not final viewing results stage', async () => {
        let eventCalledTimes = 0;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after final viewing results stage', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after taking final photos stage', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        expect(eventCalledTimes).toBe(1);
    });

    it('should not emit stage change event after a single presentation', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        expect(eventCalledTimes).toBe(0);
    });

    it('should emit stage change event  after all presentations', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after final voting stage', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalledTimes).toBe(1);
    });
});

describe('Stage order after input', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should switch to voting stage after taking all photo', async () => {
        users.forEach(user => {
            const msg = { ...photoMessage, photographerId: user.id };
            stageController.handleInput(msg);
        });
        expect(stageController.currentStage!).toBeInstanceOf(VotingStage);
    });

    it('should switch to viewing results stage after receiving all votes', async () => {
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        users.forEach((user, idx) => {
            const msg = { ...votingMessage, voterId: user.id, photographerId: users[(idx + 1) % users.length].id };
            stageController.handleInput(msg);
        });
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should switch to presentation stage taking final photos stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        users.forEach(user => {
            const msg = { ...photoMessage, photographerId: user.id };
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                stageController.handleInput(msg);
            }
        });
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should stay on the presentation stage after finishing a presentation', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        stageController.handleInput(finishPresentingMessage);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should switch to final voting stage after finishing all presentations', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.handleInput(finishPresentingMessage);
        });
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosVotingStage);
    });

    it('should switch to no stage after final voting stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        users.forEach((user, idx) => {
            const msg = { ...votingMessage, voterId: user.id, photographerId: users[(idx + 1) % users.length].id };
            stageController.handleInput(msg);
        });

        expect(stageController.currentStage!).toBe(null);
    });
});

describe('Player Points', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should return player points (1 each per vote)', () => {
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        users.forEach((user, idx) => {
            const msg = { ...votingMessage, voterId: user.id, photographerId: users[(idx + 1) % users.length].id };
            stageController.handleInput(msg);
        });
        const points = stageController.getPlayerPoints();
        expect(points.get(users[0].id)).toBe(1);
        expect(points.get(users[1].id)).toBe(1);
        expect(points.get(users[2].id)).toBe(1);
        expect(points.get(users[3].id)).toBe(1);
    });
});
