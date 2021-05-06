import { IObstacle } from '../../../contexts/PlayerContextProvider';

export let currentCount = 0;

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

export function resetCurrentCount() {
    currentCount = 0;
}

export async function getAudioInput(
    MAX: number,
    dependencies: { solveObstacle: (obstacle?: IObstacle) => void; setProgress: (val: number) => void }
) {
    let stream: MediaStream | null = null;
    const w = window as WindowProps;
    const { setProgress, solveObstacle } = dependencies;
    currentCount = 0;
    let send = false;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const AudioContext = window.AudioContext || w.webkitAudioContext;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();

        if (stream) {
            const microphone = audioContext.createMediaStreamSource(stream);
            const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.addEventListener('audioprocess', () => {
                if (currentCount < MAX) {
                    handleInput(analyser, { setProgress });
                } else if (currentCount >= MAX && !send) {
                    send = true;
                    javascriptNode.removeEventListener('audioprocess', () => {
                        // do nothing
                    });

                    stream!.getTracks().forEach(track => track.stop());
                    solveObstacle();
                }
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('getUserMedia not supported');
    }
}

function handleInput(analyser: AnalyserNode, dependencies: { setProgress: (val: number) => void }) {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    const length = array.length;
    for (let i = 0; i < length; i++) {
        values += array[i];
    }

    const average = values / length;

    if (average > 50) {
        currentCount += 0.5;
        dependencies.setProgress(currentCount);
    }
}
