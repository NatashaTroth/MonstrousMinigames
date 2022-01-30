import { VotesPhotographerMapper } from '../interfaces';

export class Votes {
    private votes: Map<string, number>;
    private voterIds: string[]; //voters

    constructor() {
        this.votes = new Map<string, number>(); //key = photographerId, value = number of votes
        this.voterIds = [];
    }

    addVote(voterId: string, photographerId: string) {
        if (!this.hasVoted(voterId) && voterId !== photographerId) {
            this.voterIds.push(voterId);
            this.addVoteToVotesMap(photographerId);
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

    // sendPhotoVotingResultsToScreen(roomId: string, countdownTime: number) {
    //     const votingResults = this.getAllVotes();
    //     GameThreeEventEmitter.emitPhotoVotingResults(roomId, votingResults, countdownTime);
    // }

    getAllVotes(): VotesPhotographerMapper[] {
        const votesArray: VotesPhotographerMapper[] = [];
        this.votes.forEach((value, key) => votesArray.push({ photographerId: key, votes: value }));
        return votesArray;
    }

    hasVoted(voterId: string) {
        return this.voterIds.includes(voterId);
    }

    getVoterIds(): string[] {
        return this.voterIds;
    }
}
