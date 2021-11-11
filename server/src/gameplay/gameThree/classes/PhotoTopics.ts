import InitialParameters from '../constants/InitialParameters';
import { RandomWordGenerator } from './RandomWordGenerator';

export class PhotoTopics {
    private _topics: string[];
    private randomWordGenerator = new RandomWordGenerator();

    constructor(numberRounds = InitialParameters.NUMBER_ROUNDS) {
        this._topics = this.randomWordGenerator.generateRandomWords(numberRounds - 1);
    }

    nextTopic() {
        return this._topics.shift();
    }

    isAnotherTopicAvailable() {
        return this._topics.length > 0;
    }

    public get topics(): string[] {
        return [...this._topics];
    }
}
