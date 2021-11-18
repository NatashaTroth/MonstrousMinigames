import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhotoVote, UrlPhotographerMapper } from '../interfaces';
import { Stage } from './Stage';
import { ViewingResultsStage } from './ViewingResultsStage';
import { Votes } from './Votes';

export class VotingStage extends Stage {
    //TODO make URL type
    private votes: Votes;

    constructor(roomId: string, userIds: string[], photoUrls: UrlPhotographerMapper[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.votes = new Votes();
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO_VOTE) return;
        const data = message as IMessagePhotoVote;
        this.votes.addVote(data.voterId, data.photographerId);
        if (this.votes.haveVotesFromAllUsers(this.userIds)) {
            this.emitStageChangeEvent();
        }
    }

    switchToNextStage() {
        // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // this.updatePlayerPointsFromVotes();

        // const photoUrls: UrlPhotographerMapper[] = this.getPhotos() as UrlPhotographerMapper[];
        // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);

        return new ViewingResultsStage(this.roomId, this.userIds, this.votes.getAllVotes()); //TODO
    }

    // haveVotesFromAllUsers(voterIds: string[]) {
    //     return voterIds.every(voterId => this.voterIds.includes(voterId));
    // }

    // getNumberVotes(photographerId: string) {
    //     return this.votes.get(photographerId) || 0;
    // }

    // sendPhotoVotingResultsToScreen(roomId: string, countdownTime: number) {
    //     const votingResults = this.getAllVotes();
    //     GameThreeEventEmitter.emitPhotoVotingResults(roomId, votingResults, countdownTime);
    // }

    // private getAllVotes(): VotesPhotographerMapper[] {
    //     const votesArray: VotesPhotographerMapper[] = [];
    //     this.votes.forEach((value, key) => votesArray.push({ photographerId: key, votes: value }));
    //     return votesArray;
    // }

    // hasVoted(voterId: string) {
    //     return this.voterIds.includes(voterId);
    // }
}
