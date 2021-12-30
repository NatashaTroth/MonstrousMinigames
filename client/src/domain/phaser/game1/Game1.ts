import MainScene from '../../game1/screen/components/MainScene';
import { Socket } from '../../socket/Socket';

export class Game1 {
    private game: Phaser.Game;

    private static instance: Game1;
    public static SCENE_NAME = 'MainScene';

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

    public static getInstance(parent: string, newInstance = false): Game1 {
        if (!Game1.instance || newInstance) {
            Game1.instance = new Game1(parent);
        }

        return Game1.instance;
    }

    startScene(roomId: string | undefined, socket: Socket | undefined, screenAdmin: boolean) {
        if (!this.game.scene.getScene(Game1.SCENE_NAME)) this.game.scene.add(Game1.SCENE_NAME, new MainScene(), false);

        this.game.scene.start(Game1.SCENE_NAME, { roomId, socket, screenAdmin });
    }
}
