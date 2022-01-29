import 'reflect-metadata';

import { PhotoTopics } from '../../../../src/gameplay/gameThree/classes/PhotoTopics';

let photoTopics: PhotoTopics;
const numberRounds = 3;
const numberSuggestionsFinalPhotos = 5;

describe('Next Topic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a topic (string', async () => {
        photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);
        const nextTopic = photoTopics.nextTopic();
        expect(typeof nextTopic).toBe('string');
        expect(nextTopic?.length).toBeGreaterThan(0);
    });

    it('should return n topics', async () => {
        const n = 5;
        photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);

        expect(photoTopics.nextNTopics(n).length).toBe(n);
    });
});
