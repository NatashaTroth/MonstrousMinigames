export class GameAudio {
    backgroundMusicStart: Phaser.Sound.BaseSound;
    backgroundMusicLoop: Phaser.Sound.BaseSound;
    sound: Phaser.Sound.HTML5AudioSoundManager | Phaser.Sound.NoAudioSoundManager | Phaser.Sound.WebAudioSoundManager;

    constructor(
        sound:
            | Phaser.Sound.HTML5AudioSoundManager
            | Phaser.Sound.NoAudioSoundManager
            | Phaser.Sound.WebAudioSoundManager
    ) {
        this.sound = sound;
        // // eslint-disable-next-line no-console
        // console.log(this.sound);
        this.backgroundMusicStart = this.sound.add('backgroundMusicStart', {
            volume: 0.2,
        });

        this.backgroundMusicLoop = this.sound.add('backgroundMusicLoop', {
            volume: 0.2,
        });
    }

    initAudio() {
        this.backgroundMusicStart.play({ loop: false });
        this.backgroundMusicStart.once('complete', () => {
            this.backgroundMusicLoop.play({ loop: true });
        });
    }

    stopMusic() {
        this.backgroundMusicStart?.stop();
        this.backgroundMusicLoop?.stop();
    }
}
