import * as React from 'react';

import lobbyMusic from '../assets/audio/Lobby_Sound.wav';

// import print from '../domain/phaser/printMethod';

export const defaultValue = {
    permission: false,
    playing: false,
    setPlaying: () => {
        // do nothing
    },
    gameAudioPlaying: false,
    setGameAudioPlaying: () => {
        // do nothing
    },
    audio: new Audio(lobbyMusic),
    setPermissionGranted: () => {
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
    mute: () => {
        //do nothing
    },
    unMute: () => {
        //do nothing
    },
};
interface IAudioContext {
    permission: boolean;
    playing: boolean;
    gameAudioPlaying: boolean;
    audio: HTMLAudioElement;
    volume: number;
    setPermissionGranted: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
    setPlaying: (p: boolean) => void;
    setGameAudioPlaying: (p: boolean) => void;
    setVolume: (v: number) => void;
    setAudioVolume: (v: number) => void;
    pauseLobbyMusicNoMute: (p: boolean) => void;
    mute: () => void;
    unMute: () => void;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [permission, setPermissionGranted] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [gameAudioPlaying, setGameAudioPlaying] = React.useState<boolean>(false);
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
        if (initialVolume > 0) {
            setPlaying(true);
            playMusic();
        } else {
            setPlaying(false);
        }
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
        try {
            await audio.play();
            audio.loop = true;
            setPlaying(true);
            if (volume === 0) unMuteVolumeEverywhere();
        } catch (e) {
            // setPermissionGranted(false);
            setPlaying(false);
        }
    };

    const pauseMusic = () => {
        audio.pause();
        setPlaying(false);
        if (volume > 0) muteVolumeEverywhere();
    };

    const content = {
        permission,
        setPermissionGranted: (p: boolean) => {
            setPermissionGranted(p);
        },
        playing,
        setPlaying,
        audio,
        setAudio,
        gameAudioPlaying,
        setGameAudioPlaying,
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
        setVolume,
        setAudioVolume: (v: number) => {
            // eslint-disable-next-line no-console
            // console.log('setting AUDIo volume ', v);
            // changeVolume(v);
            // setVolume(v); //TODO change - laggy when change volume
            // localStorage.setItem('audioVolume', v.toString());
            // print('setting AUDIo volume ');
            updateVolumeEverywhere(v);
        },
        mute: () => {
            if (volume > 0) muteVolumeEverywhere();
        },
        unMute: () => {
            if (volume === 0) unMuteVolumeEverywhere();
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
