import { getRandomInt } from '../../helperFunctions/getRandomInt';
import { words } from '../constants/randomWords';

export class RandomWordGenerator {
    private randomWords: string[];
    private wordList = words;

    constructor() {
        this.randomWords = [];
    }

    generateRandomWords(numberWords: number) {
        for (let i = 0; i < numberWords; i++) {
            const word = this.generateWord();
            this.randomWords.push(word);
        }

        return [...this.randomWords];
    }

    getCurrentRandomWords() {
        return [...this.randomWords];
    }

    private generateWord() {
        let word = '';
        do {
            const randomIndex = getRandomInt(0, this.wordList.length);
            word = this.wordList[randomIndex];
        } while (this.randomWords.includes(word));

        return word;
    }
}
