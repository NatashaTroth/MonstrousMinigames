import { handleAudioPermission } from './handlePermission';

interface AudioDependencies {
    playing: boolean;
    permission: boolean;
    pauseLobbyMusic: (permission: boolean) => void;
    playLobbyMusic: (permission: boolean) => void;
    setPermissionGranted: (permission: boolean) => void;
}

export async function handleAudio({
    playing,
    permission,
    pauseLobbyMusic,
    playLobbyMusic,
    setPermissionGranted,
}: AudioDependencies) {
    handleAudioPermission(permission, { setPermissionGranted });
    if (playing) {
        pauseLobbyMusic(permission);
    } else {
        playLobbyMusic(permission);
    }
}
