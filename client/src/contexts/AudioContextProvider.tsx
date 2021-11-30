import * as React from "react";

import campfireSoundsFile from "../assets/audio/Campfire_Loop.wav";
import lobbyMusicFile from "../assets/audio/LobbySound2_Loop.wav";
import owlSoundsFile from "../assets/audio/Owl_Loop.wav";
import finishedMusicFile from "../assets/audio/WinnerSound.wav";
import woodSoundsFile from "../assets/audio/WoodSounds_Loop.wav";

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
    campfireSounds: new Audio(campfireSoundsFile),
    owlSounds: new Audio(owlSoundsFile),
    woodSounds: new Audio(woodSoundsFile),
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
    musicIsPlaying: false,
};
interface AudioContextProps {
    audioPermission: boolean;
    playing: boolean;
    gameAudioPlaying: boolean;
    lobbyMusic: HTMLAudioElement;
    finishedMusic: HTMLAudioElement;
    playFinishedMusic: (p: boolean) => void;
    initialPlayFinishedMusic: (p: boolean) => void;
    pauseFinishedMusic: (p: boolean) => void;
    setPlaying: (p: boolean) => void;
    setGameAudioPlaying: (p: boolean) => void;
    pauseLobbyMusicNoMute: (p: boolean) => void;
    musicIsPlaying: boolean;
}

export const AudioContext = React.createContext<AudioContextProps>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [audioPermission] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [gameAudioPlaying, setGameAudioPlaying] = React.useState<boolean>(false);
    const [lobbyMusic, setLobbyMusic] = React.useState<HTMLAudioElement>(new Audio(lobbyMusicFile));
    const [finishedMusic, setFinishedMusic] = React.useState<HTMLAudioElement>(new Audio(finishedMusicFile));
    const [campfireSounds] = React.useState<HTMLAudioElement>(new Audio(campfireSoundsFile));
    const [owlSounds] = React.useState<HTMLAudioElement>(new Audio(owlSoundsFile));
    const [owlSoundsTimeout, setOwlSoundsTimeout] = React.useState<ReturnType<typeof setTimeout>>(
        setTimeout(() => {
            /*do nothing*/
        }, 0)
    );
    const [woodSounds] = React.useState<HTMLAudioElement>(new Audio(woodSoundsFile));
    const [lobbyMusicAndSfx] = React.useState<HTMLAudioElement[]>([lobbyMusic, campfireSounds, woodSounds]);
    const [allAudio] = React.useState<HTMLAudioElement[]>([...lobbyMusicAndSfx, finishedMusic, owlSounds]);

    const playLobbyMusic = async () => {
        try {
            await playLobbyMusicAndSfx();
        } catch (e) {
            setPlaying(false);
        }
    };

    const playLobbyMusicAndSfx = async () => {
        lobbyMusicAndSfx.forEach(async audio => {
            await audio.play();
            audio.loop = true;
        });
        clearTimeout(owlSoundsTimeout);
        const timeout = setTimeout(playOwlSounds, getTimeForNextOwlSound());
        setOwlSoundsTimeout(timeout);

        setPlaying(true);
    };
    const playOwlSounds = async () => {
        await owlSounds.play();
        clearTimeout(owlSoundsTimeout);
        const timeout = setTimeout(playOwlSounds, getTimeForNextOwlSound());
        setOwlSoundsTimeout(timeout);
    };

    const getTimeForNextOwlSound = () => {
        return Math.random() * 30000;
    };

    const pauseLobbyMusic = async () => {
        pauseLobbyMusicAndSfx();
    };

    const pauseLobbyMusicAndSfx = () => {
        lobbyMusicAndSfx.forEach(audio => {
            audio.pause();
        });
        owlSounds.pause();
        clearTimeout(owlSoundsTimeout);
        setPlaying(false);
    };

    const playFinishedMusic = async () => {
        try {
            await finishedMusic.play();
            setPlaying(true);
        } catch (e) {
            setPlaying(false);
        }
    };

    const pauseFinishedMusic = () => {
        finishedMusic.pause();
        setPlaying(false);
    };

    const content = {
        audioPermission: audioPermission,
        playing,
        setPlaying,
        lobbyMusic: lobbyMusic,
        finishedMusic: finishedMusic,
        setLobbyMusic,
        setFinishedMusic,
        gameAudioPlaying,
        setGameAudioPlaying,
        playLobbyMusic: (p: boolean) => {
            if (p && !playing) {
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
                // lobbyMusic.pause();
                pauseLobbyMusicAndSfx();
                setPlaying(false);
            }
        },

        musicIsPlaying: (playing || gameAudioPlaying) && audioPermission,
        playFinishedMusic: () => {
            playFinishedMusic();
        },
        pauseFinishedMusic: () => {
            pauseFinishedMusic();
        },
        initialPlayFinishedMusic: (p: boolean) => {
            //
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
