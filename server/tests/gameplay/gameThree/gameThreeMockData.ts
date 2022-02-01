import { GameThree } from '../../../src/gameplay';
import { StageController } from '../../../src/gameplay/gameThree/classes/StageController';
import { GameThreeMessageTypes } from '../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import {
    IMessagePhoto, IMessagePhotoVote, PlayerNameId
} from '../../../src/gameplay/gameThree/interfaces';
import { IMessage } from '../../../src/interfaces/messages';
import { mockPhotoUrl, users } from '../mockData';

export const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name, isActive: true };
});
export const photoMessage: IMessagePhoto = {
    type: GameThreeMessageTypes.PHOTO,
    url: mockPhotoUrl,
    photographerId: users[0].id,
};
export const votingMessage: IMessagePhotoVote = {
    type: GameThreeMessageTypes.PHOTO_VOTE,
    voterId: users[0].id,
    photographerId: users[1].id,
};
export const finishPresentingMessage: IMessage = {
    type: GameThreeMessageTypes.FINISHED_PRESENTING,
};

export function receiveMultiplePhotos(controller: StageController | GameThree) {
    controller.handleInput(photoMessage);
    controller.handleInput({ ...photoMessage, photographerId: users[1].id } as IMessage);
}
export function receiveSinglePhoto(controller: StageController | GameThree) {
    controller.handleInput(photoMessage);
}
