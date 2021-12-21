/* eslint-disable no-console */
import MainScene from '../../game1/screen/components/MainScene';
import { Socket } from '../../socket/Socket';

export class Game1 {
    private game: Phaser.Game;
    private scene?: Phaser.Scene;
    private static instance: Game1;
    private sceneInstanceCounter = 0;
    public static SCENE_NAME = 'MainScene';

    private constructor(parent: string) {
        console.log('creating new scene');
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

        // this.addScene();
        // this.game.scene.add(this.getSceneName(), new MainScene(), false);
    }

    public static getInstance(parent: string, newInstance = false): Game1 {
        // console.log('-------------**********-----------');
        // console.log(Game1.instance);
        if (!Game1.instance || newInstance) {
            Game1.instance = new Game1(parent);
        }
        // else {
        //     Game1.instance.restartScene();
        // }
        // else if (addScene) {
        //     Game1.instance.removeScene();
        // }
        // if (addScene) Game1.instance.addScene();

        return Game1.instance;
    }

    getSceneName() {
        // return `${this.SCENE_NAME}${this.sceneInstanceCounter}`;
        return Game1.SCENE_NAME;
    }

    addScene() {
        // console.log('ADDING SCENE');
        // this.sceneInstanceCounter++;
        // console.log(this.getSceneName());
        this.scene = this.game.scene.add(this.getSceneName(), new MainScene(), false);
    }

    restartScene() {
        console.log('Restarting SCENE');
        const scene = this.game.scene.getScene(this.getSceneName());
        scene.scene.stop();
        scene.scene.start();
        // scene.scene.launch();
        // this.scene?.scene.launch();
        // this.scene!.scene.restart();
        // this.sceneInstanceCounter++;
        // console.log(this.getSceneName());
        // this.game?.scene.add(this.getSceneName(), new MainScene(), false);
    }

    startScene(roomId: string | undefined, socket: Socket | undefined, screenAdmin: boolean) {
        if (!this.game.scene.getScene(this.getSceneName())) {
            this.addScene();
            // this.game.scene.start(this.getSceneName(), { roomId, socket, screenAdmin });
        }
        // else {
        //     const scene = this.game.scene.getScene(this.getSceneName());
        //     scene.scene.stop();
        //     scene.scene.restart({ roomId, socket, screenAdmin });
        // }
        this.game.scene.start(this.getSceneName(), { roomId, socket, screenAdmin });
    }

    // removeScene() {
    //     console.log('REMOVE SCENE');

    //     this.game?.scene.remove(this.getSceneName());
    // }

    destroy() {
        this.game?.destroy(true, false);

        // this.game = null;
    }
}
