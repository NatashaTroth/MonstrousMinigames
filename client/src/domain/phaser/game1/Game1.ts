import MainScene from "../../game1/screen/components/MainScene";

export class Game1 {
    public game: Phaser.Game;

    constructor(parent: string) {
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

        this.game.scene.add('MainScene', new MainScene(), false);
    }
}
