import Hammer from 'hammerjs';
import * as React from 'react';
import { useHistory } from 'react-router';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import wood from '../../../images/wood.png';
import { Obstacles } from '../../../utils/constants';
import LinearProgressBar from '../../common/LinearProgressBar';
import { ObstacleContainer, ObstacleContent, ObstacleInstructions } from './ObstaclStyles.sc';
import {
    Line, ObstacleItem, StyledObstacleImage, StyledTouchAppIcon, TouchContainer
} from './TreeTrunk.sc';

const MAX = 5000;
const Treshold = 0;
let distance = 0;
let send = true;
interface IClickObstacle {
    setObstacle: (value: undefined | Obstacles) => void;
}

export function resetObstacle() {
    distance = 0;
    send = true;
}

const TreeTrunk: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [progress, setProgress] = React.useState(0);
    const [initialized, setInitialize] = React.useState(false);
    const history = useHistory();
    const { showInstructions, setShowInstructions } = React.useContext(GameContext);

    React.useEffect(() => {
        let touchEvent: null | string = null;
        let touchContainer;
        let currentDistance = 0;
        let hammertime: HammerManager;

        if (!touchContainer) {
            touchContainer = document.getElementById('touchContainer');
        }

        if (touchContainer && !initialized) {
            setInitialize(true);
            distance = 0;
            const hammertime = touchContainer && new Hammer(touchContainer);

            hammertime?.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

            if (distance <= MAX + Treshold) {
                hammertime?.on('panup pandown', e => {
                    handleTouchEvent({ event: e.type, eventDistance: e.distance });
                });
            }
        }

        function handleTouchEvent({ event, eventDistance }: { event: string; eventDistance: number }) {
            if (distance >= MAX + Treshold && send) {
                send = false;
                solveObstacle();
                return;
            }
            if (!touchEvent) {
                touchEvent = event;
                distance += eventDistance;
            } else {
                if (event !== touchEvent) {
                    if (eventDistance > currentDistance) {
                        currentDistance = eventDistance;
                    } else {
                        distance += currentDistance;
                    }

                    setProgress(distance);
                    touchEvent = event;
                }
            }
        }

        const solveObstacle = (): void => {
            distance = 0;
            currentDistance = 0;
            touchEvent = null;
            send = true;

            controllerSocket?.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
            setShowInstructions(false);
            setTimeout(() => setObstacle(undefined), 100);
        };

        return () => {
            hammertime?.off('panup pandown', () => {
                // do nothing
            });
        };
    }, [controllerSocket, history, initialized, obstacle, progress, setObstacle, setShowInstructions]);

    return (
        <ObstacleContainer>
            <ObstacleInstructions>Saw along the line to cut it!</ObstacleInstructions>
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
