import MainScene from '../../components/Screen/MainScene';
import { createPlayer } from './createPlayer';
import { GameData } from './gameInterfaces';

export function handleStartGame(gameStateData: GameData, PhaserInstance: MainScene) {
    PhaserInstance.trackLength = gameStateData.trackLength;

    for (let i = 0; i < gameStateData.playersState.length; i++) {
        createPlayer(i, gameStateData, PhaserInstance);

        // this.players[i].playerText?.setBackgroundColor('#000000');
        // this.setGoal(i);
    }
}
