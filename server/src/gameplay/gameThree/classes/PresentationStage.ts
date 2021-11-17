import { shuffleArray } from '../../../helpers/shuffleArray';
import { IMessage } from '../../../interfaces/messages';

export class PresentationStage {
    private playerPresentOrder: string[] = [];

    constructor(playerIds: string[]) {
        this.playerPresentOrder = shuffleArray(playerIds);

        //TODO
        // this.playerPresentOrder = shuffleArray(
        //     // players.filter(player => player.finalRoundInfo.received).map(player => player.id)
        // );
    }

    entry() {
        //TODO
    }

    //TODO change not undefined
    handleInput(message: IMessage) {
        //TODO change stage
    }

    nextPresenter() {
        const presenter = this.playerPresentOrder.shift();
        if (presenter) return presenter!;
        throw new Error('No presenter left'); //TODO handle
    }

    isAnotherPresenterAvailable() {
        return this.playerPresentOrder.length > 0;
    }
}
