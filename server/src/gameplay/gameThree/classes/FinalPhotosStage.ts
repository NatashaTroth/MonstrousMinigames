import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PresentationStage } from './PresentationStage';

export class FinalPhotosStage extends PhotoStage {
    constructor(roomId: string, players: PlayerNameId[]) {
        super({
            roomId,
            players: players,
            countdownTime: InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS,
            maxNumberPhotos: InitialParameters.NUMBER_FINAL_PHOTOS,
        });
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS
        );
    }

    switchToNextStage() {
        const photoUrls: string[] = this.getPhotosUrls();

        if (photoUrls.length === 0) {
            return null;
        }

        return new PresentationStage(this.roomId, this.players, photoUrls);
    }

    updatePlayerPoints(): undefined | Map<string, number> {
        this.setPointPerReceivedPhoto();
        return this.playerPoints.getAllPlayerPoints();
    }

    private setPointPerReceivedPhoto() {
        this.players.forEach(player => {
            this.playerPoints.addPointsToPlayer(player.id, this.photos.getNumberPhotos(player.id));
        });
    }
}
