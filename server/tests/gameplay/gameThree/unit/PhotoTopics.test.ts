import 'reflect-metadata';

import { PhotoTopics } from '../../../../src/gameplay/gameThree/classes/PhotoTopics';

let photoTopics: PhotoTopics;
const numberRounds = 3;
const numberSuggestionsFinalPhotos = 5;

describe('Next Topic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return first topic on first call', async () => {
        photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);
        const randomWord = 'Hello';
        photoTopics['_topics'] = [randomWord];

        expect(photoTopics.nextTopic()).toBe(randomWord);
    });

    it('should return second when called twice topic', async () => {
        photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);
        const randomWord = 'Hello';
        const randomWord2 = 'Test';
        photoTopics['_topics'] = [randomWord, randomWord2];
        photoTopics.nextTopic();
        expect(photoTopics.nextTopic()).toBe(randomWord2);
    });

    // it('should return undefined when all rounds are over', async () => {
    //     photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);
    //     for (let i = 0; i < numberRounds; i++) {
    //         photoTopics.nextTopic();
    //     }
    //     expect(photoTopics.nextTopic()).toBe(undefined);
    // });

    it('should return n topics', async () => {
        const n = 5;
        photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);

        expect(photoTopics.nextNTopics(n).length).toBe(n);
    });
});

// describe('isAnotherTopicAvailable', () => {
//     beforeEach(() => {
//         photoTopics = PhotoTopics.getInstance(numberRounds, numberSuggestionsFinalPhotos, true);
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should have another topic available when initiated', async () => {
//         expect(photoTopics.isAnotherTopicAvailable()).toBeTruthy();
//     });

//     it('should not have another topic available when all rounds are over', async () => {
//         for (let i = 0; i < numberRounds; i++) {
//             photoTopics.nextTopic();
//         }
//         expect(photoTopics.isAnotherTopicAvailable()).toBeFalsy();
//     });
// });
