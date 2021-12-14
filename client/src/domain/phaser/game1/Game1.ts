import MainScene from '../../game1/screen/components/MainScene';

export class Game1 {
    private static instance: Game1;
    public game: Phaser.Game;

    private constructor() {
        this.game = new Phaser.Game({
            parent: 'game-root',
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

        this.game.scene.add('MainScene', MainScene, false);
    }

    public static getInstance(): Game1 {
        if (!Game1.instance) {
            Game1.instance = new Game1();
        }

        return Game1.instance;
    }
}
