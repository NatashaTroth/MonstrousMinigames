// eslint-disable-next-line simple-import-sort/imports
import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import windmill from '../../../images/ui/pinwheel.svg';
import windmillWood from '../../../images/ui/pinwheel2.svg';
import { MessageTypes } from '../../../utils/constants';
import LinearProgressBar from './obstacles/LinearProgressBar';
import { ObstacleContainer } from './obstacles/ObstaclStyles.sc';
import { ProgressBarContainer, TouchContainer, WindmillImage, WindmillWood } from './Windmill.sc';

const Windmill: React.FunctionComponent = () => {
    const MAX = 5;
    const [distance, setDistance] = React.useState(0);
    const [rounds, setRounds] = React.useState(0);

    const { controllerSocket } = React.useContext(ControllerSocketContext);

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
                        // eslint-disable-next-line no-console
                        console.log('reset to 0');
                        lastAngle = 0;
                    }
                }

                box.style.transform = `rotate(${angle}deg)`;
            });
        }
    }, []);

    if (distance >= 350) {
        if (rounds + 1 === MAX) {
            controllerSocket.emit({ type: MessageTypes.pushChasers });
        }
        setRounds(rounds + 1);
        setDistance(0);
    }

    return (
        <ObstacleContainer>
            <ProgressBarContainer>
                <LinearProgressBar MAX={MAX} progress={rounds} key={`progressbar${rounds}`} />
            </ProgressBarContainer>
            <TouchContainer id={`touchContainer`}>
                <WindmillImage id="box" src={windmill} />
                <WindmillWood src={windmillWood} />
            </TouchContainer>
        </ObstacleContainer>
    );
};

export default Windmill;
