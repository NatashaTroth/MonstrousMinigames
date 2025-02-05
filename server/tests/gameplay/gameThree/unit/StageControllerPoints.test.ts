import 'reflect-metadata';

import { StageController } from '../../../../src/gameplay/gameThree/classes/StageController';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import { IMessagePhotoVote } from '../../../../src/gameplay/gameThree/interfaces';
import { roomId, users } from '../../mockData';
import { photoMessage, players, votingMessage } from '../gameThreeMockData';

let stageController: StageController;

describe('Initialise', () => {
    beforeEach(async () => {
        stageController = new StageController(roomId, players);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should start with 0 points per player', async () => {
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());

        expect(userPoints).toEqual(expect.arrayContaining(users.map(() => 0)));
    });
});

describe('Single Photo & Voting', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        stageController = new StageController(roomId, players);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should receive a point for a vote', async () => {
        receiveAllPhotos(stageController);
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        // vote only adds point if receiver also voted
        const msg2: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: photographerId,
            photographerId: voterId,
        };
        stageController.handleInput(msg2);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([1, 1, 0, 0]); //order of elements is checked as well
    });

    it('should not receive a point for a vote if photographerId did not vote', async () => {
        receiveAllPhotos(stageController);
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints[0]).toEqual(0);
    });

    it('should not receive a point if photographerId did not take a photo', async () => {
        receiveAllPhotos(stageController, [users[0].id]);
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        // vote only adds point if receiver also voted
        const msg2: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId: photographerId,
            photographerId: voterId,
        };
        stageController.handleInput(msg2);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([0, 1, 0, 0]); //order of elements is checked as well
    });

    it('should return player points (1 each per vote)', () => {
        receiveAllPhotos(stageController);
        users.forEach((user, idx) => {
            const msg = {
                type: votingMessage.type,
                voterId: user.id,
                photographerId: users[(idx + 1) % users.length].id,
            };
            stageController.handleInput(msg);
        });
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([1, 1, 1, 1]); //order of elements is checked as well
    });

    it('should return all vote points to only player who took a photo (if only one photo)', () => {
        stageController.handleInput(photoMessage);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([users.length, 0, 0, 0]); //order of elements is checked as well
    });
});

describe('Point per Final Photo', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        stageController = new StageController(roomId, players);
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should receive a point for a received photo', async () => {
        stageController.handleInput(photoMessage);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([1, 0, 0, 0]); //order of elements is checked as well
    });

    it('should receive a point per received photo', async () => {
        stageController.handleInput(photoMessage);
        stageController.handleInput(photoMessage);
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([2, 0, 0, 0]); //order of elements is checked as well
    });

    it('should receive max number of points as max number of final photos', async () => {
        for (let i = 0; i <= InitialParameters.NUMBER_FINAL_PHOTOS + 1; i++) {
            stageController.handleInput(photoMessage);
        }

        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([InitialParameters.NUMBER_FINAL_PHOTOS, 0, 0, 0]); //order of elements is checked as well
    });
});

describe('Final Voting Points', () => {
    const pointsPerUserForReceivedPhotos = 1; // one point per player for a received photo (to pass no photos check in FinalPhotoStage switchStage())

    beforeEach(async () => {
        jest.useFakeTimers();
        stageController = new StageController(roomId, players);
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        receiveAllPhotos(stageController); // one point per player for a received photo (to pass no photos check in FinalPhotoStage switchStage())
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should receive three points for a vote', async () => {
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        // vote only adds point if receiver also voted
        const msg2: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: photographerId,
            photographerId: voterId,
        };
        stageController.handleInput(msg2);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        const pointsPerVote = InitialParameters.POINTS_PER_VOTE_FINAL_ROUND;
        expect(userPoints).toEqual([
            pointsPerVote + pointsPerUserForReceivedPhotos,
            pointsPerVote + pointsPerUserForReceivedPhotos,
            0 + pointsPerUserForReceivedPhotos,
            0 + pointsPerUserForReceivedPhotos,
        ]); //order of elements is checked as well
    });

    it('should not receive points for a vote if photographerId did not vote', async () => {
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints[0]).toEqual(0 + pointsPerUserForReceivedPhotos);
    });

    it('should receive 3 points per vote if photographerId did not take a photo', async () => {
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        // vote only adds point if receiver also voted
        const msg2: IMessagePhotoVote = {
            type: votingMessage.type,
            voterId: photographerId,
            photographerId: voterId,
        };
        stageController.handleInput(msg2);

        //Because not all votes received
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        const pointsPerVote = InitialParameters.POINTS_PER_VOTE_FINAL_ROUND;
        expect(userPoints).toEqual([
            pointsPerVote + pointsPerUserForReceivedPhotos,
            pointsPerVote + pointsPerUserForReceivedPhotos,
            0 + pointsPerUserForReceivedPhotos,
            0 + pointsPerUserForReceivedPhotos,
        ]); //order of elements is checked as well
    });

    it('should return player points (final vote points (3) each per vote)', () => {
        users.forEach((user, idx) => {
            const msg = {
                type: votingMessage.type,
                voterId: user.id,
                photographerId: users[(idx + 1) % users.length].id,
            };
            stageController.handleInput(msg);
        });
        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        const pointsPerVote = InitialParameters.POINTS_PER_VOTE_FINAL_ROUND;
        expect(userPoints).toEqual([
            pointsPerVote + pointsPerUserForReceivedPhotos,
            pointsPerVote + pointsPerUserForReceivedPhotos,
            pointsPerVote + pointsPerUserForReceivedPhotos,
            pointsPerVote + pointsPerUserForReceivedPhotos,
        ]); //order of elements is checked as well
    });
});

describe('Full run through all stages', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        stageController = new StageController(roomId, players);
        stageController['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        receiveAllPhotos(stageController);
        firstTwoPlayersGetVote(stageController); // expect points to be: [1,1,0,0]
        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);
        stageController.update(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // user 0 sends 0 photos, user 1: max nr photos, user 2: max nr photos + 2 photos, user 3: 0 photos
        sendMultiplePhotos(stageController); // expect points to be: [1, maxNumberPhotos + 1, maxNumberPhotos,0]
        stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => {
            stageController.update(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        });
        everyOneGetsVote(stageController); // expect points to be: [1 + finalVotePoints, maxNumberPhotos + 1 + finalVotePoints, maxNumberPhotos + finalVotePoints, finalVotePoints]
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should have the correct final points', () => {
        expect(getPlayerPointsArray(stageController.getPlayerPoints())).toEqual([
            1 + InitialParameters.POINTS_PER_VOTE_FINAL_ROUND,
            InitialParameters.NUMBER_FINAL_PHOTOS + 1 + InitialParameters.POINTS_PER_VOTE_FINAL_ROUND,
            InitialParameters.NUMBER_FINAL_PHOTOS + InitialParameters.POINTS_PER_VOTE_FINAL_ROUND,
            InitialParameters.POINTS_PER_VOTE_FINAL_ROUND,
        ]);
    });

    function firstTwoPlayersGetVote(stageController: StageController) {
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        // vote only adds point if receiver also voted
        const msg2: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: photographerId,
            photographerId: voterId,
        };
        stageController.handleInput(msg2);
    }

    function sendMultiplePhotos(stageController: StageController) {
        // user 0 sends 0 photos, user 1: max nr photos, user 2: max nr photos + 2 photos, user 3: 0 photos
        const photoMessageForUser = { ...photoMessage };

        // user 1:
        photoMessageForUser.photographerId = users[1].id;
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            stageController.handleInput(photoMessageForUser);
        }

        // user 2:
        photoMessageForUser.photographerId = users[2].id;
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS + 2; i++) {
            stageController.handleInput(photoMessageForUser);
        }
    }

    function everyOneGetsVote(stageController: StageController) {
        users.forEach((user, idx) => {
            const msg = {
                type: votingMessage.type,
                voterId: user.id,
                photographerId: users[(idx + 1) % users.length].id,
            };
            stageController.handleInput(msg);
        });
    }
});

//************ Helper Functions *************

function getPlayerPointsArray(playerPoints: Map<string, number>) {
    const userPoints: number[] = [];
    users.forEach(user => {
        if (playerPoints.has(user.id)) {
            userPoints.push(playerPoints.get(user.id)!);
        }
    });
    return userPoints;
}

function receiveAllPhotos(stageController: StageController, exceptIds: string[] = []) {
    users
        .filter(user => !exceptIds.includes(user.id))
        .forEach(user => {
            const newMessage = { ...photoMessage, photographerId: user.id };
            stageController.handleInput(newMessage);
        });

    //make sure skip to next stage
    if (exceptIds.length > 0) stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
}
