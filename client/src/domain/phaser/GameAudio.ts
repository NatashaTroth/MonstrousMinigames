import GameEventEmitter from './GameEventEmitter';

export class GameAudio {
    backgroundMusicLoop: Phaser.Sound.BaseSound;
    currentMusic?: Phaser.Sound.BaseSound;
    sound: Phaser.Sound.HTML5AudioSoundManager | Phaser.Sound.NoAudioSoundManager | Phaser.Sound.WebAudioSoundManager;
    startWithMusic: boolean;

    constructor(
        sound:
            | Phaser.Sound.HTML5AudioSoundManager
            | Phaser.Sound.NoAudioSoundManager
            | Phaser.Sound.WebAudioSoundManager
    ) {
        const oldVolumeFromLocalStorage = localStorage.getItem('audioVolume');
        const playing = localStorage.getItem('playingMusic');

        this.startWithMusic = playing === 'true' ? true : false;

        const initialVolume = oldVolumeFromLocalStorage ? Number(oldVolumeFromLocalStorage) : 0.2;

        this.sound = sound;

        this.backgroundMusicLoop = this.sound.add('backgroundMusicLoop', {
            volume: initialVolume,
        });

        this.currentMusic = this.backgroundMusicLoop;
    }

    initAudio() {
        this.backgroundMusicLoop.play({ loop: true });

        if (!this.startWithMusic) {
            this.pause();
            GameEventEmitter.emitPauseAudioEvent();
        } else {
            GameEventEmitter.emitPlayAudioEvent(); //so playing is true
        }
    }

    stopMusic() {
        this.backgroundMusicLoop?.stop();
    }

    pause() {
        this.currentMusic?.pause();
    }

    resume() {
        this.currentMusic?.resume();
    }
}
