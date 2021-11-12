import validator from 'validator';

import InitialParameters from '../constants/InitialParameters';
import { InvalidUrlError } from '../customErrors';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhoto } from '../interfaces';
import { Countdown } from './Countdown';
import { PhotoStage } from './PhotoStage';

export class StageController {
    stage = GameThreeGameState.BeforeStart; //TODO make private
    private gameThree: GameThree;
    private _roundIdx = -1;
    numberRounds = InitialParameters.NUMBER_ROUNDS;
    private photoStage?: PhotoStage;
    private countdown: Countdown;

    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
        this.countdown = new Countdown(this); //TODO remove argument
    }

    updateStage(stage: GameThreeGameState) {
        this.stage = stage;

        switch (stage) {
            case GameThreeGameState.TakingPhoto:
                this.photoStage = new PhotoStage();
                break;
        }
    }

    handleNewRound() {
        this._roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.gameThree.roomId, this.roundIdx);
        if (!this.isFinalRound() && this.gameThree.photoTopics!.isAnotherTopicAvailable()) {
            this.gameThree.sendPhotoTopic();
        } else {
            this.gameThree.sendTakeFinalPhotosCountdown();
        }
    }

    handleNextStage() {
        switch (this.stage) {
            case GameThreeGameState.TakingPhoto:
                this.switchToVotingStage();

                break;
            case GameThreeGameState.Voting:
                this.gameThree.handleFinishedVoting();
                break;
            case GameThreeGameState.ViewingResults:
                this.handleNewRound();
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.gameThree.handleFinishedTakingFinalPhotos();
                break;
            case GameThreeGameState.PresentingFinalPhotos:
                this.gameThree.handlePresentingRoundFinished();
                break;
            case GameThreeGameState.FinalVoting:
                this.gameThree.handleFinishedFinalVoting();
                break;
        }
    }

    public get roundIdx(): number {
        return this._roundIdx;
    }

    private isFinalRound() {
        return this._roundIdx >= this.numberRounds;
    }

    // ********** new ************

    handleReceivedPhoto(message: IMessagePhoto) {
        if (!validator.isURL(message.url))
            throw new InvalidUrlError('The received value for the URL is not valid.', message.userId);

        switch (this.stage) {
            case GameThreeGameState.TakingPhoto:
                this.photoStage!.addPhoto(message.userId, message.url);
                if (this.photoStage!.havePhotosFromAllUsers(Array.from(this.gameThree.players.keys()))) {
                    this.switchToVotingStage();
                }
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.gameThree.handleReceivedFinalPhoto(message);
                break;
        }
    }

    private switchToVotingStage() {
        this.photoStage!.sendPhotosToScreen(this.gameThree.roomId, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);
        this.updateStage(GameThreeGameState.Voting);
    }
}
