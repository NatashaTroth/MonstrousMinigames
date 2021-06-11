import * as React from 'react';

import lobbyMusicFile from '../assets/audio/LobbySound2_Loop.wav';
import finishedMusicFile from '../assets/audio/WinnerSound.wav';

// import print from '../domain/phaser/printMethod';

export const defaultValue = {
    audioPermission: false,
    lobbyMusicPlaying: false,
    setLobbyMusicPlaying: () => {
        // do nothing
    },
    gameAudioPlaying: false,
    setGameAudioPlaying: () => {
        // do nothing
    },
    // finishedMusicPlaying: false,
    // setFinishedMusicPlaying: () => {
    //     // do nothing
    // },
    setAudioPermissionGranted: () => {
        // do nothing
    },
    lobbyMusic: new Audio(lobbyMusicFile),
    playLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusic: () => {
        //do nothing
    },
    finishedMusic: new Audio(finishedMusicFile),
    playFinishedMusic: () => {
        //do nothing
    },
    pauseFinishedMusic: () => {
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
    musicIsPlaying: false,
};
interface IAudioContext {
    audioPermission: boolean;
    lobbyMusicPlaying: boolean;
    gameAudioPlaying: boolean;
    // finishedMusicPlaying: boolean;
    lobbyMusic: HTMLAudioElement;
    finishedMusic: HTMLAudioElement;
    volume: number;
    setAudioPermissionGranted: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
    playFinishedMusic: (p: boolean) => void;
    pauseFinishedMusic: (p: boolean) => void;
    setLobbyMusicPlaying: (p: boolean) => void;
    setGameAudioPlaying: (p: boolean) => void;
    // setFinishedMusicPlaying: (p: boolean) => void;
    setVolume: (v: number) => void;
    setAudioVolume: (v: number) => void;
    pauseLobbyMusicNoMute: (p: boolean) => void;
    mute: () => void;
    unMute: () => void;
    musicIsPlaying: boolean;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [audioPermission, setAudioPermissionGranted] = React.useState<boolean>(false);
    const [lobbyMusicPlaying, setLobbyMusicPlaying] = React.useState<boolean>(false);
    const [gameAudioPlaying, setGameAudioPlaying] = React.useState<boolean>(false);
    // const [finishedMusicPlaying, setFinishedMusicPlaying] = React.useState<boolean>(false);
    const [lobbyMusic, setLobbyMusic] = React.useState<HTMLAudioElement>(new Audio(lobbyMusicFile));
    const [finishedMusic, setFinishedMusic] = React.useState<HTMLAudioElement>(new Audio(finishedMusicFile));
    const [volume, setVolume] = React.useState<number>(0.2);

    React.useEffect(() => {
        const initialVolume = localStorage.getItem('audioVolume') ? Number(localStorage.getItem('audioVolume')) : 0.2;
        // lobbyMusic.volume = initialVolume;
        // finishedMusic.volume = initialVolume;
        changeVolume(initialVolume);
        setVolume(initialVolume);

        // //Todo change
        // if (initialVolume > 0) {
        //     setLobbyMusicPlaying(true);
        //     playLobbyMusic();
        // } else {
        //     setLobbyMusicPlaying(false);
        // }
    }, []);

    const changeVolume = (value: number) => {
        lobbyMusic.volume = value;
        finishedMusic.volume = value;
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

    const playLobbyMusic = async () => {
        try {
            await lobbyMusic.play();
            lobbyMusic.loop = true;
            setLobbyMusicPlaying(true);
            if (volume === 0) unMuteVolumeEverywhere();
        } catch (e) {
            // setPermissionGranted(false);
            setLobbyMusicPlaying(false);
        }
    };

    const pauseLobbyMusic = () => {
        lobbyMusic.pause();
        setLobbyMusicPlaying(false);
        if (volume > 0) muteVolumeEverywhere();
    };

    const playFinishedMusic = async () => {
        try {
            await finishedMusic.play();
            setLobbyMusicPlaying(true);
            if (volume === 0) unMuteVolumeEverywhere();
        } catch (e) {
            // setPermissionGranted(false);
            setLobbyMusicPlaying(false);
        }
    };

    const pauseFinishedMusic = () => {
        finishedMusic.pause();
        setLobbyMusicPlaying(false);
        if (volume > 0) muteVolumeEverywhere();
    };

    const content = {
        audioPermission: audioPermission,
        setAudioPermissionGranted: (p: boolean) => {
            setAudioPermissionGranted(p);
        },
        lobbyMusicPlaying: lobbyMusicPlaying,
        setLobbyMusicPlaying: setLobbyMusicPlaying,
        lobbyMusic: lobbyMusic,
        finishedMusic: finishedMusic,
        setAudio: setLobbyMusic,
        gameAudioPlaying,
        setGameAudioPlaying,
        // finishedMusicPlaying,
        // setFinishedMusicPlaying,
        playLobbyMusic: (p: boolean) => {
            if (p && !lobbyMusicPlaying) {
                playLobbyMusic();
            }
        },
        pauseLobbyMusic: (p: boolean) => {
            if (p && lobbyMusicPlaying) {
                pauseLobbyMusic();
            }
        },

        //TODO
        // playFinishedMusic: (p: boolean) => {
        //     if (p && !finishedMusicPlaying) {

        //     }
        // },
        // pauseFinishedMusic: (p: boolean) => {
        //     if (p && finishedMusicPlaying) {
        //         pauseMusic();
        //     }
        // },
        pauseLobbyMusicNoMute: (p: boolean) => {
            if (p) {
                lobbyMusic.pause();
                setLobbyMusicPlaying(false);
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
        musicIsPlaying: (lobbyMusicPlaying || gameAudioPlaying) && audioPermission && volume > 0,
        playFinishedMusic: () => {
            playFinishedMusic();
        },
        pauseFinishedMusic: () => {
            pauseFinishedMusic();
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
