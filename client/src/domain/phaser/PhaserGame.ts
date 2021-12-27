import MainSceneGame1 from '../game1/screen/components/MainScene';
import { Socket } from '../socket/Socket';

export class PhaserGame {
    private game: Phaser.Game;

    private static instance: PhaserGame;
    public static SCENE_NAME_GAME_1 = 'MainSceneGame1';

    private constructor(parent: string) {
        this.game = new Phaser.Game({
            parent,
            type: Phaser.WEBGL,
            width: '100%',
            height: '100%',
            backgroundColor: '#000b18',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
        });
    }

    public static getInstance(parent: string, newInstance = false): PhaserGame {
        if (!PhaserGame.instance || newInstance) {
            PhaserGame.instance = new PhaserGame(parent);
        }

        return PhaserGame.instance;
    }

    startGame1Scene(roomId: string | undefined, socket: Socket | undefined, screenAdmin: boolean) {
        if (!this.game.scene.getScene(PhaserGame.SCENE_NAME_GAME_1))
            this.game.scene.add(PhaserGame.SCENE_NAME_GAME_1, new MainSceneGame1(), false);

        this.game.scene.start(PhaserGame.SCENE_NAME_GAME_1, { roomId, socket, screenAdmin });
    }
}
