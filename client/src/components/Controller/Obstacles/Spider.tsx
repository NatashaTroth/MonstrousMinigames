import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import Button from '../../common/Button';
import LinearProgressBar from '../../common/LinearProgressBar';
import { SkipButton } from '../../common/SkipButton.sc';
import { getAudioInput, resetCurrentCount } from './getAudioInput';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import { StyledNet, StyledSpider } from './Spider.sc';

const Spider: React.FunctionComponent = () => {
    const [progress, setProgress] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const MAX = 15;

    const solveObstacle = React.useCallback(() => {
        if (obstacle) {
            controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle.id });
            setObstacle(roomId, undefined);
        }
    }, [controllerSocket, obstacle, roomId, setObstacle]);

    React.useEffect(() => {
        if (obstacle) {
            resetCurrentCount();
            getAudioInput(MAX, { solveObstacle, setProgress });
        }

        setTimeout(() => {
            if (progress === 0) {
                setSkip(true);
            }
        }, 5000);
    }, [controllerSocket, obstacle, progress, roomId, setObstacle, solveObstacle]);

    return (
        <ObstacleContainer>
            <LinearProgressBar progress={progress} MAX={MAX} />
            <ObstacleContent>
                <StyledNet />
                <StyledSpider className={[(progress > 0 && 'swing') || '', 'eyeRoll'].join(' ')} />
            </ObstacleContent>
            {skip && (
                <SkipButton>
                    <Button onClick={solveObstacle}>Skip</Button>
                </SkipButton>
            )}
        </ObstacleContainer>
    );
};

export default Spider;
