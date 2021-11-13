import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { VotingResultsPhotographerMapper } from '../interfaces';
import { Stage, VotingInput } from './Stage';

export class VotingStage implements Stage {
    //TODO make URL type
    private votes: Map<string, number>;
    private voterIds: string[]; //voters

    constructor() {
        this.votes = new Map<string, number>(); //key = photographerId, value = number of votes
        this.voterIds = [];
    }

    entry() {
        //TODO
    }

    handleInput(data: VotingInput) {
        if (!this.voterIds.includes(data.voterId)) {
            this.voterIds.push(data.voterId);
            this.addVoteToVotesMap(data.photographerId);
        }
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

    private getAllVotes(): VotingResultsPhotographerMapper[] {
        const votesArray: VotingResultsPhotographerMapper[] = [];
        this.votes.forEach((value, key) => votesArray.push({ photographerId: key, votes: value }));
        return votesArray;
    }

    hasVoted(voterId: string) {
        return this.voterIds.includes(voterId);
    }
}
