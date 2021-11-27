import 'reflect-metadata';

// import { GameThree } from '../../../../src/gameplay';
// import { FinalPhotosStage } from '../../../../src/gameplay/gameThree/classes/FinalPhotosStage';
// import {
//     FinalPhotosVotingStage
// } from '../../../../src/gameplay/gameThree/classes/FinalPhotoVotingStage';
// import { PresentationStage } from '../../../../src/gameplay/gameThree/classes/PresentationStage';
// import { SinglePhotoStage } from '../../../../src/gameplay/gameThree/classes/SinglePhotoStage';
// import {
//     SinglePhotoVotingStage
// } from '../../../../src/gameplay/gameThree/classes/SinglePhotoVotingStage';
import { StageController } from '../../../../src/gameplay/gameThree/classes/StageController';
// import StageEventEmitter from '../../../../src/gameplay/gameThree/classes/StageEventEmitter';
// import {
//     ViewingResultsStage
// } from '../../../../src/gameplay/gameThree/classes/ViewingResultsStage';
// import { VotingStage } from '../../../../src/gameplay/gameThree/classes/VotingStage';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import {
    IMessagePhoto, IMessagePhotoVote, PlayerNameId
} from '../../../../src/gameplay/gameThree/interfaces';
// import { IMessage } from '../../../../src/interfaces/messages';
import { advanceCountdown } from '../../gameHelperFunctions';
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
// const votingMessage: IMessagePhotoVote = {
//     type: GameThreeMessageTypes.PHOTO_VOTE,
//     voterId: users[0].id,
//     photographerId: users[1].id,
// };
// const finishPresentingMessage: IMessage = {
//     type: GameThreeMessageTypes.FINISHED_PRESENTING,
// };

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

describe('Voting', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        stageController = new StageController(roomId, players);
        advanceCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
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

        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([1, 1, 0, 0]); //order of elements is checked as well
    });

    it('should not receive a point for a vote if photographerId did not vote', async () => {
        receiveAllPhotos(stageController);
        const voterId = users[0].id;
        const photographerId = users[1].id;
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId,
            photographerId,
        };
        stageController.handleInput(msg);

        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints[0]).toEqual(0);
    });

    it('should not receive a point if photographerId did not take a photo', async () => {
        receiveAllPhotos(stageController, [users[0].id]);
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

        stageController.update(InitialParameters.COUNTDOWN_TIME_VOTE);

        const userPoints = getPlayerPointsArray(stageController.getPlayerPoints());
        expect(userPoints).toEqual([0, 1, 0, 0]); //order of elements is checked as well
    });
});

// describe('Player Points', () => {
//     beforeEach(async () => {
//         stageController = new StageController(roomId, players);
//         jest.useFakeTimers();
//     });

//     afterEach(() => {
//         jest.runAllTimers();
//         jest.clearAllMocks();
//     });

//     it('should return player points (1 each per vote)', () => {
//         stageController.update(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
//         users.forEach((user, idx) => {
//             const msg = { ...votingMessage, voterId: user.id, photographerId: users[(idx + 1) % users.length].id };
//             stageController.handleInput(msg);
//         });
//         const points = stageController.getPlayerPoints();
//         expect(points.get(users[0].id)).toBe(1);
//         expect(points.get(users[1].id)).toBe(1);
//         expect(points.get(users[2].id)).toBe(1);
//         expect(points.get(users[3].id)).toBe(1);
//     });
// });

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
