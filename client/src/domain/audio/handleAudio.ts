interface AudioDependencies {
    playing: boolean;
    audioPermission: boolean;
    pauseLobbyMusic: (permission: boolean) => void;
    playLobbyMusic: (permission: boolean) => void;
}

// TODO rename
export async function handleAudio({ playing, audioPermission, pauseLobbyMusic, playLobbyMusic }: AudioDependencies) {
    if (playing) {
        pauseLobbyMusic(audioPermission);
        return;
    }

    playLobbyMusic(audioPermission);
}
