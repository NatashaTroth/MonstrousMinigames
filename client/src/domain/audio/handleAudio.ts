import { handleAudioPermission } from './handlePermission';

interface AudioDependencies {
    playing: boolean;
    audioPermission: boolean;
    pauseLobbyMusic: (permission: boolean) => void;
    playLobbyMusic: (permission: boolean) => void;
    setAudioPermissionGranted: (permission: boolean) => void;
}

// TODO rename
export async function handleAudio({
    playing,
    audioPermission,
    pauseLobbyMusic,
    playLobbyMusic,
    setAudioPermissionGranted,
}: AudioDependencies) {
    handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    if (playing) {
        pauseLobbyMusic(audioPermission);
        return;
    }

    playLobbyMusic(audioPermission);
}
