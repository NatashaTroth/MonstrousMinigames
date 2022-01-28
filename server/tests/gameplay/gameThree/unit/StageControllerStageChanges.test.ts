import 'reflect-metadata';

import { FinalPhotosStage } from '../../../../src/gameplay/gameThree/classes/FinalPhotosStage';
import {
    FinalPhotosVotingStage
} from '../../../../src/gameplay/gameThree/classes/FinalPhotoVotingStage';
import { PresentationStage } from '../../../../src/gameplay/gameThree/classes/PresentationStage';
import { SinglePhotoStage } from '../../../../src/gameplay/gameThree/classes/SinglePhotoStage';
import {
    SinglePhotoVotingStage
} from '../../../../src/gameplay/gameThree/classes/SinglePhotoVotingStage';
import { StageController } from '../../../../src/gameplay/gameThree/classes/StageController';
import StageEventEmitter from '../../../../src/gameplay/gameThree/classes/StageEventEmitter';
import {
    ViewingResultsStage
} from '../../../../src/gameplay/gameThree/classes/ViewingResultsStage';
import { VotingStage } from '../../../../src/gameplay/gameThree/classes/VotingStage';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { roomId, users } from '../../mockData';
import {
    finishPresentingMessage, photoMessage, players, receiveMultiplePhotos, votingMessage
} from '../gameThreeMockData';

let stageController: StageController;
let stageEventEmitter: StageEventEmitter;

describe('Stage order after countdown', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
        stageEventEmitter = StageEventEmitter.getInstance();
    });

    afterEach(() => {
        stageEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should start with taking single photo stage', async () => {
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to voting stage after taking photo', async () => {
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoVotingStage);
    });

    it('should switch to new round (single photo stage) if no photos were sent', async () => {
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to new round (single photo stage) if only one photo was sent', async () => {
        stageController.handleInput(photoMessage);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to viewing results stage after voting', async () => {
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should switch to taking single photo stage after not final viewing results stage', async () => {
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should switch to taking final photos stage after final viewing results stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosStage);
    });

    it('should switch to null stage (finish game) after taking final photos stage if no photos were received', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBe(null);
    });

    it('should switch to presentation stage taking final photos stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should stay on the presentation stage after a presentation', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should switch to final voting stage after all presentations', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosVotingStage);
    });

    it('should switch to no stage after final voting stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        expect(stageController.currentStage!).toBe(null);
    });

    it('should end game when roundIdx is higher than number of rounds', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS;
        stageController.handleNewRound();

        expect(stageController.currentStage!).toBe(null);
    });

    it('should emit game finished when roundIdx is higher than number of rounds', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS;

        let eventCalled = false;
        stageEventEmitter.on(StageEventEmitter.GAME_FINISHED, () => {
            eventCalled = true;
        });

        stageController.handleNewRound();

        expect(eventCalled).toBeTruthy();
    });
});

describe('Stage order before countdown over', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should not switch to voting stage after taking photo if countdown is not over', async () => {
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME - 1
        );
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoStage);
    });

    it('should not switch to viewing results stage after voting if countdown is not over', async () => {
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE - 1);
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoVotingStage);
    });

    it('should not switch to taking single photo stage after not final viewing results stage if countdown is not over', async () => {
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS - 1);
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should not switch to taking final photos stage after final viewing results stage if countdown is not over', async () => {
        receiveMultiplePhotos(stageController);
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS - 1);
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should not switch to presentation stage taking final photos stage if countdown is not over', async () => {
        receiveMultiplePhotos(stageController);
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME - 1
        );
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosStage);
    });

    it('should not stay on the presentation stage after a presentation if countdown is not over', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS - 1);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should not switch to final voting stage after all presentations if countdown is not over', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users
            .filter(user => user.id !== users[0].id)
            .forEach(() => {
                stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
            });
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS - 1);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should not switch to no stage after final voting stage if countdown is not over', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE - 1);
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosVotingStage);
    });
});

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
        receiveMultiplePhotos(stageController);
        let eventCalledTimes = 0;
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(stageController.currentStage!).toBeInstanceOf(SinglePhotoVotingStage);

        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after voting', async () => {
        receiveMultiplePhotos(stageController);
        let eventCalledTimes = 0;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after not final viewing results stage', async () => {
        receiveMultiplePhotos(stageController);
        let eventCalledTimes = 0;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(eventCalledTimes).toBe(1);
    });

    it('should emit stage change event after final viewing results stage', async () => {
        receiveMultiplePhotos(stageController);
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(eventCalledTimes).toBe(1);
    });

    it('should not emit stage change event after a single presentation', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, () => {
            eventCalledTimes++;
        });
        stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        expect(eventCalledTimes).toBe(0);
    });

    it('should emit stage change event  after all presentations', async () => {
        let eventCalledTimes = 0;
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach((user, idx) => {
            const msg = { ...votingMessage, voterId: user.id, photographerId: users[(idx + 1) % users.length].id };
            stageController.handleInput(msg);
        });
        expect(stageController.currentStage!).toBeInstanceOf(ViewingResultsStage);
    });

    it('should switch to presentation stage taking final photos stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.handleInput(finishPresentingMessage);
        expect(stageController.currentStage!).toBeInstanceOf(PresentationStage);
    });

    it('should switch to final voting stage after finishing all presentations', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => {
            stageController.handleInput(finishPresentingMessage);
        });
        expect(stageController.currentStage!).toBeInstanceOf(FinalPhotosVotingStage);
    });

    it('should switch to no stage after final voting stage', async () => {
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveMultiplePhotos(stageController);
        stageController.update(
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
