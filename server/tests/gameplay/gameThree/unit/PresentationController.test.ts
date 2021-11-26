import 'reflect-metadata';

import {
    PresentationController
} from '../../../../src/gameplay/gameThree/classes/PresentationController';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { PlayerNameId } from '../../../../src/gameplay/gameThree/interfaces';
import { users } from '../../mockData';

let presentationController: PresentationController;
const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name };
});

// const playerIds = users.map(user => user.id)

const urls = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8'];

describe('Next presenter', () => {
    beforeEach(() => {
        presentationController = new PresentationController(players, urls);
    });

    it('should return a user id', async () => {
        expect(players.includes(presentationController.nextPresenter())).toBeTruthy();
    });

    it('should not return a user id when all players have presented', async () => {
        while (presentationController.isAnotherPresenterAvailable()) {
            presentationController.nextPresenter();
        }
        expect(presentationController.nextPresenter()).toBe(undefined);
    });
});

describe('Get next photo urls', () => {
    beforeEach(() => {
        presentationController = new PresentationController(players, urls);
    });

    it('should return correct number of urls', async () => {
        expect(presentationController.getNextPhotoUrls().length).toBe(InitialParameters.NUMBER_FINAL_PHOTOS);
    });

    it('should return urls from the urls input list', async () => {
        expect(urls).toEqual(expect.arrayContaining(presentationController.getNextPhotoUrls()));
    });

    // it('should not return a user id when all players have presented', async () => {
    //     while (presentationController.isAnotherPresenterAvailable()) {
    //         presentationController.nextPresenter();
    //     }
    //     expect(presentationController.nextPresenter()).toBe(undefined);
    // });
});
