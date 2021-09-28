import * as React from 'react';

import Button from '../../../../../components/common/Button';
import { ControllerSocketContext } from '../../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../../contexts/PlayerContextProvider';
import { MessageTypes } from '../../../../../utils/constants';
import { Navigator } from '../../../../navigator/Navigator';
import { currentCount, getAudioInput, resetCurrentCount } from './getAudioInput';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer, ObstacleContent, ObstacleInstructions } from './ObstacleStyles.sc';
import { StyledNet, StyledSkipButton, StyledSpider } from './Spider.sc';

interface SpiderProps {
    navigator: Navigator;
}

const Spider: React.FunctionComponent<SpiderProps> = ({ navigator }) => {
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
            controllerSocket.emit({ type: MessageTypes.obstacleSolved, obstacleId: obstacle.id });
            setObstacle(roomId, undefined);
            clearTimeout(handleSkip);
        }
    };

    React.useEffect(() => {
        let mounted = true;
        resetCurrentCount();
        initializeSkip();

        getAudioInput(
            MAX,
            {
                solveObstacle: () => {
                    if (mounted) {
                        solveObstacle();
                    }
                },
                setProgress,
            },
            navigator
        );

        return () => {
            mounted = false;
            clearTimeout(handleSkip);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ObstacleContainer>
            <LinearProgressBar MAX={MAX} progress={progress} />
            <ObstacleInstructions>Blow into the microphone to get rid of the spider</ObstacleInstructions>
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
