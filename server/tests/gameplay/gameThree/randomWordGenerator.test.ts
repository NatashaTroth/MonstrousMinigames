import 'reflect-metadata';

import { RandomWordGenerator } from '../../../src/gameplay/gameThree/classes/RandomWordGenerator';

let randomWordsGenerator: RandomWordGenerator;
// const uniqueWords = ['hat', 'car', 'bus', 'blue', 'cat', 'dog'];
const duplicateWords = ['car', 'bus', 'hat', 'hat', 'hat', 'hat'];

describe('Stun player tests', () => {
    beforeEach(() => {
        randomWordsGenerator = new RandomWordGenerator();
    });

    it('should return three strings', async () => {
        randomWordsGenerator['wordList'] = duplicateWords;
        const numberWords = 3;
        const randomWords = randomWordsGenerator.generateRandomWords(numberWords);
        expect(randomWords.length).toBe(numberWords);
    });

    it('should return three strings that are different', async () => {
        randomWordsGenerator['wordList'] = duplicateWords;
        const randomWords = randomWordsGenerator.generateRandomWords(3);
        expect(randomWords).toContain('car');
        expect(randomWords).toContain('hat');
        expect(randomWords).toContain('bus');
    });
});
