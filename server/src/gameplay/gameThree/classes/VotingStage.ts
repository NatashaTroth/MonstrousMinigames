import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import { IMessagePhotoVote, PhotoPhotographerMapper, PlayerNameId } from '../interfaces';
import { Stage } from './Stage';
import { Votes } from './Votes';

export abstract class VotingStage extends Stage {
    //TODO make URL type
    protected votes: Votes;

    constructor(roomId: string, players: PlayerNameId[], photoUrls: PhotoPhotographerMapper[]) {
        super(roomId, players, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.votes = new Votes();
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO_VOTE) return;
        const data = message as IMessagePhotoVote;
        this.votes.addVote(data.voterId, data.photographerId);
        if (this.votes.haveVotesFromAllUsers(this.players)) {
            this.emitStageChangeEvent();
        }
    }

    abstract switchToNextStage(): Stage;

    // switchToNextStage() {
    //     // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
    //     // this.updatePlayerPointsFromVotes();

    //     // const photoUrls: PhotoPhotographerMapper[] = this.getPhotos() as PhotoPhotographerMapper[];
    //     // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);

    //     return new ViewingResultsStage(this.roomId, this.players, this.votes.getAllVotes()); //TODO
    // }

    protected countdownOver() {
        this.emitStageChangeEvent();
    }

    updatePlayerPoints(): undefined | Map<string, number> {
        this.setPointPerReceivedVote();
        return this.playerPoints.getAllPlayerPoints();
    }

    private setPointPerReceivedVote() {
        const voterIds = this.votes.getVoterIds();
        this.votes.getAllVotes().forEach(votesPerPlayer => {
            // only add votes for users that voted
            if (voterIds.includes(votesPerPlayer.photographerId))
                this.playerPoints.addPointsToPlayer(votesPerPlayer.photographerId, votesPerPlayer.votes);
        });
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
