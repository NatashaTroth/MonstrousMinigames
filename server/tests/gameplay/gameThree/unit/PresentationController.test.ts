import 'reflect-metadata';

import {
    PresentationController
} from '../../../../src/gameplay/gameThree/classes/PresentationController';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { PlayerNameId } from '../../../../src/gameplay/gameThree/interfaces';
import { users } from '../../mockData';

jest.mock('../../../../src/gameplay/gameThree/classes/StageController');

let presentationController: PresentationController;
const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name, isActive: true };
});

// const playerIds = users.map(user => user.id)

const urls = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8', 'url9'];

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

    it('should not return duplicate urls when not exceeded number of photos (less players)', async () => {
        const receivedUrls = [];
        let i = 0;
        while (i < urls.length / InitialParameters.NUMBER_FINAL_PHOTOS - 1) {
            receivedUrls.push(...presentationController.getNextPhotoUrls());
            i++;
        }

        expect(new Set(receivedUrls).size).toBe(receivedUrls.length);
    });

    it('should not return duplicate urls when not exceeded number of photos (exact number of players)', async () => {
        const receivedUrls = [];
        let i = 0;
        while (i < urls.length / InitialParameters.NUMBER_FINAL_PHOTOS) {
            receivedUrls.push(...presentationController.getNextPhotoUrls());
            i++;
        }

        expect(new Set(receivedUrls).size).toBe(receivedUrls.length);
    });

    it('should return duplicate urls when exceeded number of photos', async () => {
        const receivedUrls = [];
        let i = 0;
        while (i < urls.length / InitialParameters.NUMBER_FINAL_PHOTOS + 2) {
            receivedUrls.push(...presentationController.getNextPhotoUrls());
            i++;
        }

        expect(new Set(receivedUrls).size).toBeLessThan(receivedUrls.length);
    });

    // it('should not return a user id when all players have presented', async () => {
    //     while (presentationController.isAnotherPresenterAvailable()) {
    //         presentationController.nextPresenter();
    //     }
    //     expect(presentationController.nextPresenter()).toBe(undefined);
    // });
});
