import 'reflect-metadata';

import {
    RandomWordGenerator
} from '../../../../src/gameplay/gameThree/classes/RandomWordGenerator';

let randomWordsGenerator: RandomWordGenerator;
const duplicateWords = ['car', 'bus', 'hat', 'hat', 'hat', 'hat'];

describe('Generate 3 random unique strings', () => {
    beforeEach(() => {
        randomWordsGenerator = new RandomWordGenerator(duplicateWords);
    });

    it('should return three strings', async () => {
        const numberWords = 3;
        const randomWords = randomWordsGenerator.generateRandomWords(numberWords);
        expect(randomWords.length).toBe(numberWords);
    });

    it('should return three strings that are different', async () => {
        const randomWords = randomWordsGenerator.generateRandomWords(3);
        expect(randomWords).toContain('car');
        expect(randomWords).toContain('hat');
        expect(randomWords).toContain('bus');
    });
});

describe('Get Current Random Words', () => {
    beforeEach(() => {
        randomWordsGenerator = new RandomWordGenerator();
    });

    it('should return three strings', async () => {
        const initialRandomWords = randomWordsGenerator.generateRandomWords(3);
        const randomWords = randomWordsGenerator.getCurrentRandomWords();
        expect(initialRandomWords).toEqual(expect.arrayContaining(randomWords));
    });
});
