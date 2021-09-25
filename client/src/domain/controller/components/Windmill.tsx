import * as React from 'react';
import styled from 'styled-components';

import windmill from '../../../images/ui/pinwheel.svg';
import windmillWood from '../../../images/ui/pinwheel2.svg';
import { ObstacleContainer } from './obstacles/ObstaclStyles.sc';

const WindmillImage = styled.img`
    display: flex;
    width: 60%;
    z-index: 2;
`;

const WindmillWood = styled.img`
    position: absolute;
    top: 50%;
    width: 8%;
`;

const TouchContainer = styled.div`
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Windmill: React.FunctionComponent = () => {
    React.useEffect(() => {
        const box = document.getElementById('box');

        // TODO remove
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.userSelect = 'none';

        if (box) {
            const boxBoundingRect = box.getBoundingClientRect();
            const boxCenter = {
                x: boxBoundingRect.left + boxBoundingRect.width / 2,
                y: boxBoundingRect.top + boxBoundingRect.height / 2,
            };

            const touchContainer = document.getElementById('touchContainer');
            touchContainer?.addEventListener('touchmove', e => {
                // eslint-disable-next-line no-console
                const touches = e.touches[0];
                const angle = Math.atan2(touches.pageX - boxCenter.x, -(touches.pageY - boxCenter.y)) * (180 / Math.PI);
                box.style.transform = `rotate(${angle}deg)`;
            });
        }
    }, []);

    return (
        <ObstacleContainer>
            <TouchContainer id={`touchContainer`}>
                <WindmillImage id="box" src={windmill} />
                <WindmillWood src={windmillWood} />
            </TouchContainer>
        </ObstacleContainer>
    );
};

export default Windmill;
