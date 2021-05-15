import MainScene from '../../components/Screen/MainScene';

export class PauseButton {
    paused: boolean;
    pauseButton: Phaser.GameObjects.Text;
    phaserInstance: MainScene;
    // phaserGameObjectFactory: Phaser.GameObjects.GameObjectFactory

    constructor(phaserInstance: MainScene) {
        this.paused = false;
        this.phaserInstance = phaserInstance;
        // this.phaserGameObjectFactory = phaserGameObjectFactory

        this.pauseButton = this.phaserInstance.add.text(window.innerWidth / 2, window.innerHeight - 50, 'Pause');
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => this.handlePauseResumeButton());
    }

    handlePauseResumeButton() {
        //TODO connect to backend
        if (this.paused) {
            //TODO emit to server. this.resumeGame is then called by handle message when resume event comes in
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    pauseGame() {
        // this.socket?.emit({ type: MessageTypes.pauseResume }); //TODO
        this.pauseButton?.setText('Resume');

        for (let i = 0; i < this.phaserInstance.players.length; i++) {
            // this.stopRunningAnimation(players[i], i);
            this.phaserInstance.players[i].phaserObject.anims.pause();
        }

        this.paused = true;
    }

    resumeGame() {
        for (let i = 0; i < this.phaserInstance.players.length; i++) {
            // players[i].anims.play(animations[i])
            if (!this.paused) {
                this.phaserInstance.players[i].phaserObject.anims.play(this.phaserInstance.players[i].animationName);
                // this.startRunningAnimation(players[i], i);
            }
        }
        this.pauseButton?.setText('Pause');
        this.paused = false;
    }
}
