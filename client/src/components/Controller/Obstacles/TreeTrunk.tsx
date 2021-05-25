import Hammer from 'hammerjs';
import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import wood from '../../../images/wood.png';
import { Obstacles } from '../../../utils/constants';
import { particlesConfig } from '../../../utils/particlesConfig';
import Button from '../../common/Button';
import { SkipButton } from '../../common/SkipButton.sc';
import { ObstacleContent } from './ObstaclStyles.sc';
import {
    Line,
    ObstacleItem,
    StyledObstacleImage,
    StyledParticles,
    StyledTouchAppIcon,
    TouchContainer,
    TreeTrunkContainer,
} from './TreeTrunk.sc';

const MAX = 30;
let sec = 0;
let stoptime = true;
interface IClickObstacle {
    setObstacle: (value: undefined | Obstacles) => void;
}

function resetObstacle() {
    sec = 0;
    stoptime = true;
}

const TreeTrunk: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const [initialized, setInitialize] = React.useState(false);
    const [hammerTime, setHammerTime] = React.useState<HammerManager | undefined>();
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);

    const [particles, setParticles] = React.useState(false);

    React.useEffect(() => {
        resetObstacle();
        let touchContainer;

        if (!touchContainer) {
            touchContainer = document.getElementById('touchContainer');
        }

        if (touchContainer && !initialized) {
            setInitialize(true);
            const hammertime = touchContainer && new Hammer(touchContainer);
            setHammerTime(hammertime);
        }

        setTimeout(() => {
            if (sec === 0) {
                setSkip(true);
            }
        }, 5000);
    }, [initialized]);

    if (hammerTime) {
        hammerTime.get('pan').set({ threshold: 0 });

        hammerTime.on('panstart', e => {
            handleStartTimer();
        });

        hammerTime.on('panend pancancel', e => {
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

            setTimeout(() => timerCycle(), 100);
        }
    }

    const solveObstacle = () => {
        controllerSocket?.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
        setShowInstructions(false);
        setObstacle(roomId, undefined);
        resetObstacle();
    };

    return (
        <TreeTrunkContainer>
            <ObstacleContent>
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <TouchContainer id="touchContainer">
                    {skip && (
                        <SkipButton>
                            <Button onClick={solveObstacle}>Skip</Button>
                        </SkipButton>
                    )}
                    <Line />
                    {showInstructions && <StyledTouchAppIcon />}
                </TouchContainer>
                {particles && <StyledParticles params={particlesConfig} />}
            </ObstacleContent>
        </TreeTrunkContainer>
    );
};

export default TreeTrunk;
