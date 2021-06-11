import { handleAudioPermission } from './handlePermission';

interface AudioDependencies {
    lobbyMusicPlaying: boolean;
    audioPermission: boolean;
    pauseLobbyMusic: (permission: boolean) => void;
    playLobbyMusic: (permission: boolean) => void;
    setAudioPermissionGranted: (permission: boolean) => void;
}

export async function handleAudio({
    lobbyMusicPlaying,
    audioPermission,
    pauseLobbyMusic,
    playLobbyMusic,
    setAudioPermissionGranted,
}: AudioDependencies) {
    handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    if (lobbyMusicPlaying) {
        pauseLobbyMusic(audioPermission);
    } else {
        playLobbyMusic(audioPermission);
    }
}
