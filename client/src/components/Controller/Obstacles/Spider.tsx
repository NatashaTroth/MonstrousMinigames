import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import LinearProgressBar from '../../common/LinearProgressBar';
import { getAudioInput, resetCurrentCount } from './getAudioInput';
import { ObstacleContainer, ObstacleContent, ObstacleInstructions } from './ObstaclStyles.sc';
import { StyledNet, StyledSpider } from './Spider.sc';

const Spider: React.FunctionComponent = () => {
    const [progress, setProgress] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const MAX = 20;

    React.useEffect(() => {
        const solveObstacle = () => {
            if (obstacle) {
                controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle.id });
                setObstacle(roomId, undefined);
            }
        };

        if (obstacle) {
            resetCurrentCount();
            getAudioInput(MAX, { solveObstacle, setProgress });
        }
    }, [controllerSocket, obstacle, roomId, setObstacle]);

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
