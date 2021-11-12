import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
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

    sendNextTopicToClient(roomId: string) {
        if (this.isAnotherTopicAvailable()) {
            GameThreeEventEmitter.emitNewTopic(roomId, this.nextTopic()!, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        }
    }

    public get topics(): string[] {
        return [...this._topics];
    }
}
