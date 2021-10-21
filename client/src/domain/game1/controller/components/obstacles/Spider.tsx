import * as React from 'react';

import Button from '../../../../../components/common/Button';
import { ControllerSocketContext } from '../../../../../contexts/ControllerSocketContextProvider';
import { Game1Context, Obstacle } from '../../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../../contexts/GameContextProvider';
import { MessageTypesGame1 } from '../../../../../utils/constants';
import { Navigator } from '../../../../navigator/Navigator';
import { Socket } from '../../../../socket/Socket';
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
    const { obstacle, setObstacle } = React.useContext(Game1Context);
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

    React.useEffect(() => {
        let mounted = true;
        resetCurrentCount();
        initializeSkip();

        getAudioInput(
            MAX,
            {
                solveObstacle: () => {
                    if (mounted) {
                        solveObstacle({
                            obstacle,
                            controllerSocket,
                            setObstacle,
                            clearTimeout,
                            roomId,
                            handleSkip,
                        });
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

    const handleSolveObstacle = () => {
        solveObstacle({
            obstacle,
            controllerSocket,
            setObstacle,
            clearTimeout,
            roomId,
            handleSkip,
        });
    };

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
                    <Button onClick={handleSolveObstacle}>Skip</Button>
                </StyledSkipButton>
            )}
        </ObstacleContainer>
    );
};

export default Spider;

interface SolveObstacle {
    obstacle: Obstacle | undefined;
    controllerSocket: Socket;
    setObstacle: (roomId: string | undefined, val: Obstacle | undefined) => void;
    clearTimeout: (val: ReturnType<typeof setTimeout>) => void;
    roomId: string | undefined;
    handleSkip: ReturnType<typeof setTimeout>;
}
export const solveObstacle = (props: SolveObstacle) => {
    const { obstacle, setObstacle, controllerSocket, roomId, clearTimeout, handleSkip } = props;

    if (obstacle) {
        controllerSocket.emit({ type: MessageTypesGame1.obstacleSolved, obstacleId: obstacle.id });
        setObstacle(roomId, undefined);
        clearTimeout(handleSkip);
    }
};
