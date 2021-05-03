import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import LinearProgressBar from '../../common/LinearProgressBar';
import { ObstacleContainer, ObstacleContent, ObstacleInstructions } from './ObstaclStyles.sc';
import { StyledNet, StyledSpider } from './Spider.sc';

let currentCount = 0;

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}
const Spider: React.FunctionComponent = () => {
    const [progress, setProgress] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const MAX = 20;

    React.useEffect(() => {
        getAudioInput();

        const solveObstacle = () => {
            currentCount = 0;

            controllerSocket?.emit('message', { type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
            setObstacle(undefined);
        };

        async function getAudioInput() {
            let stream: MediaStream | null = null;
            const w = window as WindowProps;

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
                            handleInput(analyser);
                        } else {
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
    }, [controllerSocket, obstacle, setObstacle]);

    function handleInput(analyser: AnalyserNode) {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (let i = 0; i < length; i++) {
            values += array[i];
        }

        const average = values / length;

        if (average > 60) {
            currentCount += 0.5;
            values = 0;
            setProgress(currentCount);
        }
    }

    return (
        <ObstacleContainer>
            <ObstacleInstructions>Blow into the microphone to scare away the spider!</ObstacleInstructions>
            <LinearProgressBar progress={progress} MAX={MAX} />
            <ObstacleContent>
                <StyledNet />
                <StyledSpider className={[(progress > 0 && 'swing') || '', 'eyeRoll'].join(' ')} />
            </ObstacleContent>
        </ObstacleContainer>
    );
};

export default Spider;
