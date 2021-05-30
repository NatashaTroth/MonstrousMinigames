interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

export const handlePermission = (permission: boolean) => {
    if (!permission) {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext || false;
        if (AudioContext) {
            //TODO fix laggy audio
            new AudioContext().resume();
            return true;
        }
    }
    return false;
};

interface PermissionDependencies {
    setPermissionGranted: (permission: boolean) => void;
}

export const handleAudioPermission = (permission: boolean, dependencies: PermissionDependencies) => {
    if (handlePermission(permission)) {
        dependencies.setPermissionGranted(true);
    }
};
