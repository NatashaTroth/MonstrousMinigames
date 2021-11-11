import InitialParameters from '../constants/InitialParameters';
import { RandomWordGenerator } from './RandomWordGenerator';

export class PhotoTopics {
    private topics: string[];
    private randomWordGenerator = new RandomWordGenerator();

    constructor(numberRounds = InitialParameters.NUMBER_ROUNDS) {
        this.topics = this.randomWordGenerator.generateRandomWords(numberRounds - 1);
    }

    nextTopic() {
        return this.topics.shift();
    }

    isAnotherTopicAvailable() {
        return this.topics.length > 0;
    }
}
