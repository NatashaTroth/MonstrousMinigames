interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

export const handlePermission = (permission: boolean) => {
    // if (!permission) {
    //     const w = window as WindowProps;
    //     const AudioContext = window.AudioContext || w.webkitAudioContext || false;
    //     if (AudioContext) {
    //         new AudioContext().resume();
    //         return true;
    //     }
    // }
    return false;
};
