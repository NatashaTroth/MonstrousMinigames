import * as React from 'react';

import lobbyMusic from '../assets/audio/Lobby_Sound.wav';
import GameEventEmitter from '../domain/phaser/GameEventEmitter';
import { GameEventTypes } from '../domain/phaser/GameEventTypes';

// import print from '../domain/phaser/printMethod';

const gameEventEmitter = GameEventEmitter.getInstance();

export const defaultValue = {
    permission: false,
    playing: false,
    audio: new Audio(lobbyMusic),
    setPermissionGranted: () => {
        // do nothing
    },
    setPermissionGrantedAndPlay: () => {
        // do nothing
    },
    playLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusicNoMute: () => {
        //do nothing
    },
    volume: 0.2,
    setVolume: () => {
        //do nothing
    },
    setAudioVolume: () => {
        //do nothing
    },
};
interface IAudioContext {
    permission: boolean;
    playing: boolean;
    audio: HTMLAudioElement;
    volume: number;
    setPermissionGranted: (val: boolean) => void;
    setPermissionGrantedAndPlay: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
    setVolume: (v: number) => void;
    setAudioVolume: (v: number) => void;
    pauseLobbyMusicNoMute: (p: boolean) => void;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [permission, setPermissionGranted] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [audio, setAudio] = React.useState<HTMLAudioElement>(new Audio(lobbyMusic));
    const [volume, setVolume] = React.useState<number>(0.2);

    React.useEffect(() => {
        const oldVolumeFromLocalStorage = localStorage.getItem('audioVolume');
        let initialVolume = 0.2;
        if (oldVolumeFromLocalStorage !== null && oldVolumeFromLocalStorage !== undefined) {
            initialVolume = Number(oldVolumeFromLocalStorage);
        }
        audio.volume = initialVolume;
        setVolume(initialVolume);

        gameEventEmitter.on(GameEventTypes.PauseAudio, () => {
            // print('pause audio event received context');
            setPlaying(false);
        });

        gameEventEmitter.on(GameEventTypes.PlayAudio, () => {
            // print('play audio event received context');

            setPlaying(true);
        });
    }, []);

    const changeVolume = (value: number) => {
        audio.volume = value;
    };

    const updateVolumeEverywhere = (value: number) => {
        changeVolume(value);
        setVolume(value); //TODO change - laggy when change volume
        localStorage.setItem('audioVolume', value.toString());
    };

    const muteVolumeEverywhere = () => {
        localStorage.setItem('audioVolumeBefore', volume.toString());
        changeVolume(0);
        setVolume(0);
        localStorage.setItem('audioVolume', '0');
    };

    const unMuteVolumeEverywhere = () => {
        const newVolume = Number(localStorage.getItem('audioVolumeBefore'));
        changeVolume(newVolume);
        setVolume(newVolume);
        localStorage.setItem('audioVolume', newVolume.toString());
    };

    const playMusic = async () => {
        // print('PLAY');
        try {
            await audio.play();
            // audio.volume = 0.2;
            audio.loop = true;
            setPlaying(true);
            if (volume == 0) unMuteVolumeEverywhere();
        } catch (e) {
            // print('IN CATCH');
            // print(JSON.stringify(e));
            // setPermissionGranted(false);
            setPlaying(false);
        }
        // print(playing);
        // print('played music ');
    };

    const pauseMusic = () => {
        // print('pause music');

        audio.pause();
        setPlaying(false);
        // print(playing);
        if (volume > 0) muteVolumeEverywhere();
    };

    const content = {
        permission,
        setPermissionGranted: (p: boolean) => {
            setPermissionGranted(p);
        },
        setPermissionGrantedAndPlay: (p: boolean) => {
            setPermissionGranted(p);
            // print('HERE1');

            //start playing here - permission doesn't update quick enough
            if (p && !playing) {
                playMusic();
            }
            // else if (p && playing) {
            //     pauseMusic();
            // }
        },
        playing,
        audio,
        setAudio,
        playLobbyMusic: (p: boolean) => {
            if (p && !playing) {
                playMusic();
            }
        },
        pauseLobbyMusic: (p: boolean) => {
            if (p && playing) {
                pauseMusic();
            }
        },
        pauseLobbyMusicNoMute: (p: boolean) => {
            if (p) {
                audio.pause();
                setPlaying(false);
            }
        },
        volume,
        setVolume: (v: number) => {
            setVolume(v);
        },
        setAudioVolume: (v: number) => {
            // eslint-disable-next-line no-console
            // console.log('setting AUDIo volume ', v);
            // changeVolume(v);
            // setVolume(v); //TODO change - laggy when change volume
            // localStorage.setItem('audioVolume', v.toString());
            // print('setting AUDIo volume ');
            updateVolumeEverywhere(v);
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
