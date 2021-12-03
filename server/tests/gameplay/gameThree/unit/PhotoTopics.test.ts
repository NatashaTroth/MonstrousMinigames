import 'reflect-metadata';

import { PhotoTopics } from '../../../../src/gameplay/gameThree/classes/PhotoTopics';

let photoTopics: PhotoTopics;
const numberRounds = 3;

describe('Next Topic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return first topic on first call', async () => {
        photoTopics = new PhotoTopics(numberRounds);
        const randomWord = 'Hello';
        photoTopics['_topics'] = [randomWord];

        expect(photoTopics.nextTopic()).toBe(randomWord);
    });

    it('should return second when called twice topic', async () => {
        photoTopics = new PhotoTopics(numberRounds);
        const randomWord = 'Hello';
        const randomWord2 = 'Test';
        photoTopics['_topics'] = [randomWord, randomWord2];
        photoTopics.nextTopic();
        expect(photoTopics.nextTopic()).toBe(randomWord2);
    });

    it('should return undefined when all rounds are over', async () => {
        photoTopics = new PhotoTopics(numberRounds);
        for (let i = 0; i < numberRounds; i++) {
            photoTopics.nextTopic();
        }
        expect(photoTopics.nextTopic()).toBe(undefined);
    });
});

describe('isAnotherTopicAvailable', () => {
    beforeEach(() => {
        photoTopics = new PhotoTopics(numberRounds);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have another topic available when initiated', async () => {
        expect(photoTopics.isAnotherTopicAvailable()).toBeTruthy();
    });

    it('should not have another topic available when all rounds are over', async () => {
        for (let i = 0; i < numberRounds; i++) {
            photoTopics.nextTopic();
        }
        expect(photoTopics.isAnotherTopicAvailable()).toBeFalsy();
    });
});
