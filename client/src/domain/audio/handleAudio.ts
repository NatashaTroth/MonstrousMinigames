interface AudioDependencies {
    playing: boolean;
    permission: boolean;
    pauseLobbyMusic: (permission: boolean) => void;
    playLobbyMusic: (permission: boolean) => void;
}

export async function handleAudio(dependencies: AudioDependencies) {
    if (dependencies.playing) {
        dependencies.pauseLobbyMusic(dependencies.permission);
    } else {
        dependencies.playLobbyMusic(dependencies.permission);
    }
}
