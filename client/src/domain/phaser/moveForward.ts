import MainScene from '../../components/Screen/MainScene';
import { mapServerPosToWindowPos } from './mapServerPosToWindowPos';

export function moveForward(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    toX: number,
    playerIndex: number,
    PhaserInstance: MainScene
) {
    toX = mapServerPosToWindowPos(toX, PhaserInstance.trackLength);
    if (toX == player.x) {
        PhaserInstance.players[playerIndex].playerCountSameDistance++; // if idle for more than a second - means actually stopped, otherwise could just be waiting for new
    } else {
        PhaserInstance.players[playerIndex].playerCountSameDistance = 0;
        if (!PhaserInstance.players[playerIndex].playerRunning) {
            PhaserInstance.startRunningAnimation(player, playerIndex);
        }
    }

    if (
        PhaserInstance.players[playerIndex].playerRunning &&
        PhaserInstance.players[playerIndex].playerCountSameDistance > 100
    ) {
        //TODO HANDLE
        // PhaserInstance.stopRunningAnimation(player, playerIndex);
        // PhaserInstance.playerCountSameDistance[playerIndex] = 0;
    }

    if (!PhaserInstance.paused) {
        player.x = toX;
    }

    // PhaserInstance.playerText[playerIndex]?.x = toX; //- 100;
    // PhaserInstance.test++;

    // if (PhaserInstance.test == 100) {
    //     PhaserInstance.test = 0;
    //     // eslint-disable-next-line no-console
    //     console.log(`${player.x}   ${PhaserInstance.playerText[playerIndex].x}`);
    // }
}
