import 'reflect-metadata';

import { PhotoStage } from '../../../../src/gameplay/gameThree/classes/PhotoStage';
import { PresentationStage } from '../../../../src/gameplay/gameThree/classes/PresentationStage';
import { SinglePhotoStage } from '../../../../src/gameplay/gameThree/classes/SinglePhotoStage';
import {
    SinglePhotoVotingStage
} from '../../../../src/gameplay/gameThree/classes/SinglePhotoVotingStage';
import { Stage } from '../../../../src/gameplay/gameThree/classes/Stage';
import { VotingStage } from '../../../../src/gameplay/gameThree/classes/VotingStage';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import {
    IMessagePhoto, IMessagePhotoVote, PlayerNameId
} from '../../../../src/gameplay/gameThree/interfaces';
import { IMessage } from '../../../../src/interfaces/messages';
import { mockPhotoUrl, roomId, users } from '../../mockData';

let stage: Stage;

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

describe('Photo Stage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        stage = new SinglePhotoStage(roomId, players);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should return when not photo message', async () => {
        const spy = jest.spyOn(PhotoStage.prototype as any, 'addPhoto');
        stage.handleInput(votingMessage);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle input if photo message', async () => {
        const spy = jest.spyOn(PhotoStage.prototype as any, 'addPhoto');
        stage.handleInput(photoMessage);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('Voting Stage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        stage = new SinglePhotoVotingStage(roomId, players, []);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should return when not voting message', async () => {
        const spy = jest.spyOn(VotingStage.prototype as any, 'addVote');
        stage.handleInput(photoMessage);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle input if voting message', async () => {
        const spy = jest.spyOn(VotingStage.prototype as any, 'addVote');
        stage.handleInput(votingMessage);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('Presentation Stage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        stage = new PresentationStage(roomId, players, []);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.runAllTimers();
    });

    it('should return when not presentation message', async () => {
        const spy = jest.spyOn(PresentationStage.prototype as any, 'handleNewPresentationRound');
        stage.handleInput(photoMessage);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle input if presentation message', async () => {
        const spy = jest.spyOn(PresentationStage.prototype as any, 'handleNewPresentationRound');
        stage.handleInput(finishPresentingMessage);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
