import InitialParameters from "../constants/InitialParameters";
import { RandomWordGenerator } from "./RandomWordGenerator";

export class PhotoTopics {
    private _topics: string[];
    private randomWordGenerator = new RandomWordGenerator();

    private static instance: PhotoTopics;

    private constructor(numberRounds: number, numberSuggestionsFinalPhotos: number) {
        this._topics = this.randomWordGenerator.generateRandomWords(numberRounds - 1 + numberSuggestionsFinalPhotos);
    }

    public static getInstance(
        numberRounds = InitialParameters.NUMBER_ROUNDS,
        numberSuggestionsFinalPhotos = InitialParameters.NUMBER_SUGGESTIONS,
        newInstance = false
    ): PhotoTopics {
        if (!PhotoTopics.instance || newInstance) {
            PhotoTopics.instance = new PhotoTopics(numberRounds, numberSuggestionsFinalPhotos);
        }

        return PhotoTopics.instance;
    }

    public static createNewPhotoTopicsInstance(
        numberRounds = InitialParameters.NUMBER_ROUNDS,
        numberSuggestionsFinalPhotos = InitialParameters.NUMBER_SUGGESTIONS
    ) {
        PhotoTopics.instance = new PhotoTopics(numberRounds, numberSuggestionsFinalPhotos);
    }

    // constructor(numberRounds = InitialParameters.NUMBER_ROUNDS) {
    //     this._topics = this.randomWordGenerator.generateRandomWords(numberRounds - 1);
    // }

    nextTopic() {
        return this._topics.shift();
    }

    nextNTopics(n: number) {
        let counter = 0;
        const topics: string[] = [];
        while (this._topics.length > 0 && counter < n) {
            topics.push(this._topics.shift()!);
            counter++;
        }
        return topics;
        // return this.randomWordGenerator.generateRandomWords(n);
    }

    // isAnotherTopicAvailable() {
    //     return this._topics.length > 0;
    // }
}
