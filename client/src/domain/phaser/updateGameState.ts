import MainScene from '../../components/Screen/MainScene';
import { PlayersState } from './gameInterfaces';
import { moveForward } from './moveForward';

export function updateGameState(playerData: PlayersState[], PhaserInstance: MainScene) {
    for (let i = 0; i < PhaserInstance.players.length; i++) {
        if (PhaserInstance.players[i].phaserObject !== undefined && playerData !== undefined) {
            moveForward(PhaserInstance.players[i].phaserObject, playerData[i].positionX, i, PhaserInstance);

            //TODO
            PhaserInstance.checkAtObstacle(i, playerData[i].atObstacle, playerData[i].positionX);
            // this.checkFinished(i, playerData[i].finished);
        }
    }
}
