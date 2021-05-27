import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import Button from '../../common/Button';
import { currentCount, getAudioInput, resetCurrentCount } from './getAudioInput';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import { StyledNet, StyledSkipButton, StyledSpider } from './Spider.sc';

const Spider: React.FunctionComponent = () => {
    const [progress, setProgress] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);

    const MAX = 15;
    let handleSkip: ReturnType<typeof setTimeout>;

    function initializeSkip() {
        handleSkip = setTimeout(() => {
            if (currentCount === 0) {
                setSkip(true);
            }
        }, 10000);
    }

    const solveObstacle = () => {
        if (obstacle) {
            controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle.id });
            setObstacle(roomId, undefined);
            clearTimeout(handleSkip);
        }
    };

    React.useEffect(() => {
        resetCurrentCount();
        initializeSkip();

        getAudioInput(MAX, { solveObstacle, setProgress });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ObstacleContainer>
            <ObstacleContent>
                <StyledNet />
                <StyledSpider
                    className={[
                        (progress > 0 && progress < 14 && 'swing') || '',
                        'eyeRoll',
                        ((progress >= 14 || skip) && 'fallOff') || '',
                    ].join(' ')}
                    strokeWidth={skip ? 0 : (MAX - progress) / 2}
                />
            </ObstacleContent>
            {skip && (
                <StyledSkipButton>
                    <Button onClick={solveObstacle}>Skip</Button>
                </StyledSkipButton>
            )}
        </ObstacleContainer>
    );
};

export default Spider;
