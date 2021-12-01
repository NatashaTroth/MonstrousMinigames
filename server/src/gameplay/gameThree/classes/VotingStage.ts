import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import { IMessagePhotoVote, PlayerNameId } from '../interfaces';
import { Stage } from './Stage';
import { Votes } from './Votes';

export abstract class VotingStage extends Stage {
    protected votes: Votes;

    constructor(
        roomId: string,
        players: PlayerNameId[],
        private photographerIds: string[],
        private pointsPerVote = 1,
        private onlyAddPointIfTookPhoto = true
    ) {
        super(roomId, players, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.votes = new Votes();
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO_VOTE) return;

        this.addVote(message as IMessagePhotoVote);
    }
    private addVote(data: IMessagePhotoVote) {
        if (
            this.players.find(player => player.id === data.voterId) &&
            this.players.find(player => player.id === data.photographerId)
        )
            this.votes.addVote(data.voterId, data.photographerId);
        if (this.votes.haveVotesFromAllUsers(this.players.map(player => player.id))) {
            this.emitStageChangeEvent();
        }
    }
    abstract switchToNextStage(): Stage;

    protected countdownOver() {
        this.emitStageChangeEvent();
    }

    updatePlayerPoints(): undefined | Map<string, number> {
        this.setPointPerReceivedVote();
        return this.playerPoints.getAllPlayerPoints();
    }

    private setPointPerReceivedVote() {
        this.votes.getAllVotes().forEach(votesPerPlayer => {
            // console.log('Allowed vote ', this.photographerIsAllowedPoint(votesPerPlayer.photographerId));
            if (this.photographerIsAllowedPoint(votesPerPlayer.photographerId))
                this.playerPoints.addPointsToPlayer(
                    votesPerPlayer.photographerId,
                    votesPerPlayer.votes * this.pointsPerVote
                );
        });
    }

    private photographerIsAllowedPoint(photographerId: string) {
        // only add point to photographers that voted and that took a photo (applicable - not applicable in final round, since a point is added for every photo taken)

        const voterIds = this.votes.getVoterIds();
        const voted = voterIds.includes(photographerId);
        return this.onlyAddPointIfTookPhoto ? voted && this.photographerIds.includes(photographerId) : voted;
    }
}
