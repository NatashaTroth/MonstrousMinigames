import Hammer from 'hammerjs';
import * as React from 'react';
import { useHistory } from 'react-router';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import wood from '../../../images/wood.png';
import { Obstacles } from '../../../utils/constants';
import LinearProgressBar from '../../common/LinearProgressBar';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import { Line, ObstacleItem, StyledObstacleImage, StyledTouchAppIcon, TouchContainer } from './TreeTrunk.sc';

const MAX = 30;
let sec = 0;
let stoptime = true;
interface IClickObstacle {
    setObstacle: (value: undefined | Obstacles) => void;
}

export function resetObstacle() {
    sec = 0;
    stoptime = true;
}

const TreeTrunk: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [progress, setProgress] = React.useState(0);
    const [initialized, setInitialize] = React.useState(false);
    const [hammerTime, setHammerTime] = React.useState<HammerManager | undefined>();
    const history = useHistory();
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        let touchContainer;

        if (!touchContainer) {
            touchContainer = document.getElementById('touchContainer');
        }

        if (touchContainer && !initialized) {
            setInitialize(true);
            const hammertime = touchContainer && new Hammer(touchContainer);
            setHammerTime(hammertime);
        }
    }, [controllerSocket, history, initialized, obstacle, progress, roomId, setObstacle, setShowInstructions]);

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
            timerCycle();
        }
    }

    function handleStopTimer() {
        if (!stoptime) {
            stoptime = true;
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

    const solveObstacle = (): void => {
        controllerSocket?.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
        setShowInstructions(false);
        setTimeout(() => setObstacle(roomId, undefined), 100);
    };

    return (
        <ObstacleContainer>
            <LinearProgressBar progress={progress} MAX={MAX} />
            <ObstacleContent>
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <TouchContainer id="touchContainer">
                    <Line />
                    {showInstructions && <StyledTouchAppIcon />}
                </TouchContainer>
            </ObstacleContent>
        </ObstacleContainer>
    );
};

export default TreeTrunk;
