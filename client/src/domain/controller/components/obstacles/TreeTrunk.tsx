import Hammer from 'hammerjs';
import * as React from 'react';

import Button from '../../../../components/common/Button';
import { StyledParticles } from '../../../../components/common/Particles.sc';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { Obstacles } from '../../../../utils/constants';
import { treeParticlesConfig } from '../../../../utils/particlesConfig';
import wood from '../../../images/obstacles/wood/wood.svg';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import {
    Line,
    ObstacleItem,
    ProgressBarContainer,
    StyledObstacleImage,
    StyledSkipButton,
    StyledTouchAppIcon,
    TouchContainer,
} from './TreeTrunk.sc';

const MAX = 30;
let sec = 0;
let stoptime = true;
interface ClickObstacleProps {
    setObstacle: (value: undefined | Obstacles) => void;
}

function resetObstacle() {
    sec = 0;
    stoptime = true;
}

const TreeTrunk: React.FunctionComponent<ClickObstacleProps> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);
    const [progress, setProgress] = React.useState(0);
    const [particles, setParticles] = React.useState(false);

    React.useEffect(() => {
        resetObstacle();
        let touchContainer;
        let hammertime;

        if (!touchContainer) {
            touchContainer = document.getElementById('touchContainer');
            hammertime = touchContainer && new Hammer(touchContainer);
        }

        setTimeout(() => {
            if (sec === 0) {
                setSkip(true);
            }
        }, 10000);

        if (hammertime) {
            hammertime.get('pan').set({ threshold: 0 });

            hammertime.on('panstart', e => {
                handleStartTimer();
            });

            hammertime.on('panend pancancel', e => {
                handleStopTimer();
            });
        }

        function handleStartTimer() {
            if (stoptime) {
                stoptime = false;
                setParticles(true);
                timerCycle();
            }
        }

        function handleStopTimer() {
            if (!stoptime) {
                stoptime = true;
                setParticles(false);
            }
        }

        function timerCycle() {
            if (!stoptime) {
                if (sec >= MAX) {
                    solveObstacle();
                }
                sec += 1;
                setProgress(sec);

                setTimeout(() => timerCycle(), 100);
            }
        }
    }, []);

    const solveObstacle = () => {
        controllerSocket?.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
        setShowInstructions(false);
        setObstacle(roomId, undefined);
        resetObstacle();
    };

    return (
        <>
            <ObstacleContainer>
                <ProgressBarContainer>
                    <LinearProgressBar MAX={MAX} progress={progress} />
                </ProgressBarContainer>
                <ObstacleContent>
                    <ObstacleItem>
                        <StyledObstacleImage src={wood} />
                    </ObstacleItem>
                    <TouchContainer id="touchContainer">
                        {skip && (
                            <StyledSkipButton>
                                <Button onClick={solveObstacle}>Skip</Button>
                            </StyledSkipButton>
                        )}
                        <Line />
                        {showInstructions && <StyledTouchAppIcon />}
                    </TouchContainer>
                    {particles && <StyledParticles params={treeParticlesConfig} />}
                </ObstacleContent>
            </ObstacleContainer>
        </>
    );
};

export default TreeTrunk;
