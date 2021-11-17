import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhotoVote, VotesPhotographerMapper } from '../interfaces';
import { SinglePhotoStage } from './SinglePhotoStage';
import { Stage } from './Stage';

export class VotingStage extends Stage {
    //TODO make URL type
    private votes: Map<string, number>;
    private voterIds: string[]; //voters

    constructor(roomId: string, userIds: string[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.votes = new Map<string, number>(); //key = photographerId, value = number of votes
        this.voterIds = [];
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO_VOTE) return;
        const data = message as IMessagePhotoVote;
        if (!this.voterIds.includes(data.voterId)) {
            this.voterIds.push(data.voterId);
            this.addVoteToVotesMap(data.photographerId);
        }
    }

    switchToNextStage() {
        // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // this.updatePlayerPointsFromVotes();

        // const photoUrls: UrlPhotographerMapper[] = this.getPhotos() as UrlPhotographerMapper[];
        // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        // return new VotingStage(this.roomId, this.userIds);

        return new SinglePhotoStage(this.roomId, this.userIds); //TODO
    }

    private addVoteToVotesMap(photographerId: string) {
        if (this.votes.has(photographerId)) {
            this.votes.set(photographerId, this.votes.get(photographerId)! + 1);
        } else {
            this.votes.set(photographerId, 1);
        }
    }

    haveVotesFromAllUsers(voterIds: string[]) {
        return voterIds.every(voterId => this.voterIds.includes(voterId));
    }

    getNumberVotes(photographerId: string) {
        return this.votes.get(photographerId) || 0;
    }

    sendPhotoVotingResultsToScreen(roomId: string, countdownTime: number) {
        const votingResults = this.getAllVotes();
        GameThreeEventEmitter.emitPhotoVotingResults(roomId, votingResults, countdownTime);
    }

    private getAllVotes(): VotesPhotographerMapper[] {
        const votesArray: VotesPhotographerMapper[] = [];
        this.votes.forEach((value, key) => votesArray.push({ photographerId: key, votes: value }));
        return votesArray;
    }

    hasVoted(voterId: string) {
        return this.voterIds.includes(voterId);
    }
}
