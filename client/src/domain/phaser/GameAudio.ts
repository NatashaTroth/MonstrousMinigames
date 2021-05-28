export class GameAudio {
    backgroundMusicStart: Phaser.Sound.BaseSound;
    backgroundMusicLoop: Phaser.Sound.BaseSound;
    currentMusic?: Phaser.Sound.BaseSound;
    sound: Phaser.Sound.HTML5AudioSoundManager | Phaser.Sound.NoAudioSoundManager | Phaser.Sound.WebAudioSoundManager;

    constructor(
        sound:
            | Phaser.Sound.HTML5AudioSoundManager
            | Phaser.Sound.NoAudioSoundManager
            | Phaser.Sound.WebAudioSoundManager
    ) {
        const oldVolumeFromLocalStorage = localStorage.getItem('audioVolume');
        let initialVolume = 0.2;
        if (oldVolumeFromLocalStorage !== null && oldVolumeFromLocalStorage !== undefined) {
            initialVolume = Number(oldVolumeFromLocalStorage);
        }
        this.sound = sound;
        this.backgroundMusicStart = this.sound.add('backgroundMusicStart', {
            volume: initialVolume,
        });
        this.currentMusic = this.backgroundMusicStart;
        this.backgroundMusicLoop = this.sound.add('backgroundMusicLoop', {
            volume: initialVolume,
            //TODO -  should be the same volume as lobby music
        });
    }

    initAudio() {
        this.backgroundMusicStart.play({ loop: false });
        this.backgroundMusicStart.once('complete', () => {
            this.backgroundMusicLoop.play({ loop: true });
            this.currentMusic = this.backgroundMusicLoop;
        });
    }

    stopMusic() {
        this.backgroundMusicStart?.stop();
        this.backgroundMusicLoop?.stop();
    }

    pause() {
        this.currentMusic?.pause();
    }

    resume() {
        this.currentMusic?.resume();
        // this.backgroundMusicStart.once('complete', () => {
        //     this.backgroundMusicLoop.play({ loop: true });
        //     this.currentMusic = this.backgroundMusicLoop;
        // });
    }
}
