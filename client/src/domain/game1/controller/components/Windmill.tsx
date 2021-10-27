// eslint-disable-next-line simple-import-sort/imports
import * as React from 'react';

import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import windmill from '../../../../images/ui/pinwheel.svg';
import windmillWood from '../../../../images/ui/pinwheel2.svg';
import { MessageTypesGame1 } from '../../../../utils/constants';
import { controllerPlayerDeadRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import LinearProgressBar from './obstacles/LinearProgressBar';
import { ObstacleContainer, ObstacleInstructions } from './obstacles/ObstacleStyles.sc';
import { ProgressBarContainer, TouchContainer, WindmillImage, WindmillWood } from './Windmill.sc';

const Windmill: React.FunctionComponent = () => {
    const MAX = 5;
    const [distance, setDistance] = React.useState(0);
    const [rounds, setRounds] = React.useState(0);

    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        const box = document.getElementById('box');
        let lastAngle = 0;

        if (box) {
            const boxBoundingRect = box.getBoundingClientRect();
            const boxCenter = {
                x: boxBoundingRect.left + boxBoundingRect.width / 2,
                y: boxBoundingRect.top + boxBoundingRect.height / 2,
            };

            const touchContainer = document.getElementById('touchContainer');
            touchContainer?.addEventListener('touchmove', e => {
                e.preventDefault();
                const touches = e.touches[0];
                const angle = Math.atan2(touches.pageX - boxCenter.x, -(touches.pageY - boxCenter.y)) * (180 / Math.PI);

                if (lastAngle != 0 || angle > 0) {
                    if (angle < 0) {
                        lastAngle += 360 - Math.abs(angle) - lastAngle;
                        setDistance(lastAngle);
                    } else {
                        lastAngle += angle - lastAngle;
                        setDistance(lastAngle);
                    }

                    if (lastAngle >= 350 && angle < 10) {
                        lastAngle = 0;
                    }
                }

                box.style.transform = `rotate(${angle}deg)`;
            });
        }
    }, []);

    if (distance >= 350) {
        if (rounds + 1 === MAX) {
            controllerSocket.emit({ type: MessageTypesGame1.pushChasers });
            history.push(controllerPlayerDeadRoute(roomId));
        }
        setRounds(rounds + 1);
        setDistance(0);
    }

    return (
        <ObstacleContainer>
            <ProgressBarContainer>
                <LinearProgressBar MAX={MAX} progress={rounds} key={`progressbar${rounds}`} />
            </ProgressBarContainer>
            <ObstacleInstructions>Rotate the windmill clockwise to speed up the mosquitos</ObstacleInstructions>
            <TouchContainer id={`touchContainer`}>
                <WindmillImage id="box" src={windmill} />
                <WindmillWood src={windmillWood} />
            </TouchContainer>
        </ObstacleContainer>
    );
};

export default Windmill;
