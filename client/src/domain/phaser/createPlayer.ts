import { characters } from '../../components/Screen/GameAssets';
import MainScene from '../../components/Screen/MainScene';
import { GameData } from './gameInterfaces';
import { handleSetObstacles } from './handleSetObstacles';

export function createPlayer(index: number, gameStateData: GameData, PhaserInstance: MainScene) {
    const character = characters[index];
    const posX = PhaserInstance.posX + PhaserInstance.plusX * index;
    const posY = PhaserInstance.posY + PhaserInstance.plusY * index;

    const player = PhaserInstance.physics.add
        .sprite(posX, posY, character.name)
        .setDepth(50)
        .setBounce(0.2)
        .setCollideWorldBounds(true)
        .setScale(0.15, 0.15)
        .setCollideWorldBounds(true);

    PhaserInstance.players.push({
        name: gameStateData.playersState[index].name,
        animationName: `${character.name}Walk`,
        phaserObject: player,
        playerRunning: false,
        playerAtObstacle: false,
        playerObstacles: handleSetObstacles({
            obstaclesDetails: gameStateData.playersState[index].obstacles,
            posY,
            physics: PhaserInstance.physics,
            trackLength: PhaserInstance.trackLength,
            dependencies: {
                mapServerXToWindowX: PhaserInstance.mapServerXToWindowX,
            },
        }),
        playerCountSameDistance: 0,
        playerAttention: null, //TODO change
        playerText: PhaserInstance.add
            .text(
                posX, //+ 50
                posY - 100,
                character.name,
                { font: '16px Arial', align: 'center', fixedWidth: 150 }
            )
            .setDepth(50),
    });

    PhaserInstance.anims.create({
        key: `${character.name}Walk`,
        frames: PhaserInstance.anims.generateFrameNumbers(character.name, { start: 12, end: 15 }),
        frameRate: 6,
        repeat: -1,
    });

    // return players,
}
