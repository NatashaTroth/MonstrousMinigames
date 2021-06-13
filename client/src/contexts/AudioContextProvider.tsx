import * as React from 'react';

import lobbyMusicFile from '../assets/audio/LobbySound2_Loop.wav';
import finishedMusicFile from '../assets/audio/WinnerSound.wav';
import print from '../domain/phaser/printMethod';

export const defaultValue = {
    audioPermission: false,
    playing: false,
    setPlaying: () => {
        // do nothing
    },
    gameAudioPlaying: false,
    setGameAudioPlaying: () => {
        // do nothing
    },
    setAudioPermissionGranted: () => {
        // do nothing
    },
    lobbyMusic: new Audio(lobbyMusicFile),
    playLobbyMusic: () => {
        //do nothing
    },
    initialPlayLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusic: () => {
        //do nothing
    },
    finishedMusic: new Audio(finishedMusicFile),
    playFinishedMusic: () => {
        //do nothing
    },
    initialPlayFinishedMusic: () => {
        //do nothing
    },
    pauseFinishedMusic: () => {
        //do nothing
    },
    pauseLobbyMusicNoMute: () => {
        //do nothing
    },
    volume: 0,
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
    playing: boolean;
    gameAudioPlaying: boolean;
    lobbyMusic: HTMLAudioElement;
    finishedMusic: HTMLAudioElement;
    volume: number;
    setAudioPermissionGranted: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    initialPlayLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
    playFinishedMusic: (p: boolean) => void;
    initialPlayFinishedMusic: (p: boolean) => void;
    pauseFinishedMusic: (p: boolean) => void;
    setPlaying: (p: boolean) => void;
    setGameAudioPlaying: (p: boolean) => void;
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
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [gameAudioPlaying, setGameAudioPlaying] = React.useState<boolean>(false);
    const [lobbyMusic, setLobbyMusic] = React.useState<HTMLAudioElement>(new Audio(lobbyMusicFile));
    const [finishedMusic, setFinishedMusic] = React.useState<HTMLAudioElement>(new Audio(finishedMusicFile));
    const [volume, setVolume] = React.useState<number>(
        localStorage.getItem('audioVolume') ? Number(localStorage.getItem('audioVolume')) : 0.2
    );
    const [initialAudioSet, setInitialAudioSet] = React.useState<boolean>(false); //to make sure the audio from localstorage is used - even if useEffect is not called until after play is called

    React.useEffect(() => {
        // setInitialAudio();
    }, []);

    const setInitialAudio = () => {
        if (!initialAudioSet) {
            setInitialAudioSet(true);
            print('set initial audio');
            print(initialAudioSet);

            const initialVolume = localStorage.getItem('audioVolume')
                ? Number(localStorage.getItem('audioVolume'))
                : 0.2;

            changeVolume(initialVolume);
            return initialVolume;
        }
        return volume;
    };

    const changeVolume = (value: number) => {
        lobbyMusic.volume = value;
        finishedMusic.volume = value;
        setVolume(value);
    };

    const updateVolumeEverywhere = (value: number) => {
        changeVolume(value); //TODO change - laggy when change volume
        localStorage.setItem('audioVolume', value.toString());
    };

    const muteVolumeEverywhere = () => {
        changeVolume(0);
        localStorage.setItem('audioVolume', '0');
        localStorage.setItem('audioVolumeBefore', volume.toString());
    };

    const unMuteVolumeEverywhere = () => {
        print('un muting volume');
        const newVolume = Number(localStorage.getItem('audioVolumeBefore'));
        changeVolume(newVolume);
        localStorage.setItem('audioVolume', newVolume.toString());
    };

    const playLobbyMusic = async () => {
        try {
            print('actually playing');
            print(volume);
            await lobbyMusic.play();
            lobbyMusic.loop = true;
            setPlaying(true);
            if (volume === 0) unMuteVolumeEverywhere();
        } catch (e) {
            print('catch');
            setPlaying(false);
        }
    };

    const pauseLobbyMusic = () => {
        lobbyMusic.pause();
        setPlaying(false);
        if (volume > 0) muteVolumeEverywhere();
    };

    const playFinishedMusic = async () => {
        try {
            await finishedMusic.play();
            setPlaying(true);

            if (volume === 0) unMuteVolumeEverywhere();
        } catch (e) {
            setPlaying(false);
        }
    };

    const pauseFinishedMusic = () => {
        finishedMusic.pause();
        setPlaying(false);
        if (volume > 0) muteVolumeEverywhere();
    };

    const content = {
        audioPermission: audioPermission,
        setAudioPermissionGranted: (p: boolean) => {
            setAudioPermissionGranted(p);
            setInitialAudio();
        },
        playing,
        setPlaying,
        lobbyMusic: lobbyMusic,
        finishedMusic: finishedMusic,
        setLobbyMusic,
        setFinishedMusic,
        gameAudioPlaying,
        setGameAudioPlaying,
        playLobbyMusic: (p: boolean) => {
            setInitialAudio();
            if (p && !playing) {
                playLobbyMusic();
            }
        },
        initialPlayLobbyMusic: (p: boolean) => {
            //because audio context too slow updating
            const initialVolume = setInitialAudio();
            if (initialVolume > 0 && p) {
                print('HERE');
                print(volume);
                playLobbyMusic();
            }
        },
        pauseLobbyMusic: (p: boolean) => {
            if (p && playing) {
                pauseLobbyMusic();
            }
        },

        pauseLobbyMusicNoMute: (p: boolean) => {
            if (p) {
                lobbyMusic.pause();
                setPlaying(false);
            }
        },
        volume,
        setVolume,
        setAudioVolume: (v: number) => {
            // changeVolume(v);
            // setVolume(v); //TODO change - laggy when change volume
            // localStorage.setItem('audioVolume', v.toString());
            updateVolumeEverywhere(v);
        },
        mute: () => {
            if (volume > 0) muteVolumeEverywhere();
        },
        unMute: () => {
            if (volume === 0) unMuteVolumeEverywhere();
        },
        musicIsPlaying: (playing || gameAudioPlaying) && audioPermission && volume > 0,
        playFinishedMusic: () => {
            playFinishedMusic();
        },
        pauseFinishedMusic: () => {
            pauseFinishedMusic();
        },
        initialPlayFinishedMusic: (p: boolean) => {
            //because audio context too slow updating
            const initialVolume = setInitialAudio();
            if (initialVolume > 0 && p) {
                playFinishedMusic();
            }
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
