import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import Button from '../../common/Button';
import { currentCount, getAudioInput, resetCurrentCount } from './getAudioInput';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import { StyledNet, StyledSkipButton, StyledSpider } from './Spider.sc';

const Spider: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const MAX = 15;

    const solveObstacle = () => {
        if (obstacle) {
            controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle.id });
            setObstacle(roomId, undefined);
        }
    };

    React.useEffect(() => {
        resetCurrentCount();

        getAudioInput(MAX, { solveObstacle });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!skip) {
            setTimeout(() => {
                if (currentCount === 0) {
                    setSkip(true);
                }
            }, 10000);
        }
    }, [skip]);

    return (
        <ObstacleContainer>
            <ObstacleContent>
                <StyledNet />
                <StyledSpider
                    className={[
                        (currentCount > 0 && currentCount < 12 && 'swing') || '',
                        'eyeRoll',
                        ((currentCount >= 12 || skip) && 'fallOff') || '',
                    ].join(' ')}
                    strokeWidth={skip ? 0 : (MAX - currentCount) / 2}
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
