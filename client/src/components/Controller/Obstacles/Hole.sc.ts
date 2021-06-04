import styled, { css } from 'styled-components';

import hole from '../../../images/hole.svg';
import leaf from '../../../images/leaf.svg';
import pebble from '../../../images/pebble.svg';
import { secondary } from '../../../utils/colors';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-end;

    .drop-active {
        border-color: #aaa;
    }

    .drop-target {
        background-color: ${secondary};
        border-color: #fff;
        border-style: solid;
    }
`;

interface Draggable {
    index: number;
}

export const Draggable = styled.div<Draggable>`
    width: 70px;
    height: 70px;
    touch-action: none;
    transform: translate(0px, 0px);
    transition: background-color 0.3s;
    position: absolute;

    ${({ index }) => getDraggableTopPosition(index)};
    ${({ index }) => getDraggableLeftPosition(index)};
`;

export const DraggableStone = styled(Draggable)`
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${pebble});
`;

export const DraggableLeaf = styled(Draggable)`
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${leaf});
`;

export const DropZone = styled.div`
    border: dashed 4px transparent;
    border-radius: 4px;
    margin-bottom: 200px;
    padding: 10px;
    width: 80%;
    transition: background-color 0.3s;
    height: 80px;

    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${hole});
`;

export const StyledHoleImage = styled.img`
    width: 80%;
`;

function getDraggableLeftPosition(index: number) {
    switch (index) {
        case 0:
        case 3:
            return css`
                left: ${window.innerWidth * 0.25 - 35}px;
            `;
        case 1:
        case 4:
            return css`
                left: ${window.innerWidth * 0.75 - 35}px;
            `;
        default:
            return css`
                left: ${window.innerWidth * 0.5 - 35}px;
            `;
    }
}

function getDraggableTopPosition(index: number) {
    const topMargin = 20;
    switch (index) {
        case 0:
        case 1:
            return css`
                top: ${topMargin}px;
            `;
        case 3:
        case 4:
            return css`
                top: ${250 * 0.66 + topMargin}px;
            `;
        default:
            return css`
                top: ${250 * 0.33 + topMargin}px;
            `;
    }
}
