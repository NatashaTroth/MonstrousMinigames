import interact from 'interactjs';
import * as React from 'react';

import { ObstacleContainer } from './ObstaclStyles.sc';
import { Rotation } from './Whole.sc';

const Whole: React.FunctionComponent = () => {
    let angle = 0;

    interact('#rotate-area').gesturable({
        listeners: {
            move(event) {
                const arrow = document.getElementById('arrow');

                angle += event.da;

                if (arrow) {
                    arrow.style.transform = `rotate(${angle}deg)`;
                }
            },
        },
    });

    return (
        <ObstacleContainer>
            <Rotation id="rotate-area">
                <div id="angle-info">0°</div>
                <svg id="arrow" viewBox="0 0 100 100">
                    <polygon points="50,0 75,25 62.5,25 62.5,100 37.5,100 37.5,25 25,25" fill="#29e"></polygon>
                </svg>
            </Rotation>
        </ObstacleContainer>
    );
};

export default Whole;
