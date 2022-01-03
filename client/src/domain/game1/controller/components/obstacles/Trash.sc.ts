import styled, { css } from 'styled-components';

import { SkipButton } from '../../../../../components/controller/SkipButton.sc';
import foodCan from '../../../../../images/obstacles/trash/foodCan.svg';
import paperCan from '../../../../../images/obstacles/trash/paperCan.svg';
import plasticCan from '../../../../../images/obstacles/trash/plasticCan.svg';
import { TrashType } from '../../../../../utils/constants';

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
        background-color: ${({ theme }) => theme.palette.secondary.main};
        border-color: #fff;
        border-style: solid;
    }

    .invisible {
        display: none;
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

export const StyledImage = styled.img`
    width: 100%;
    height: 100%;
`;

interface DropZoneProps {
    variant: TrashType;
}
export const DropZone = styled.div<DropZoneProps>`
    border: dashed 4px transparent;
    border-radius: 4px;
    margin-bottom: 30%;
    padding: 10px;
    width: 80%;
    transition: background-color 0.3s;
    height: 100px;

    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${({ variant }) => {
        switch (variant) {
            case TrashType.Paper:
                return paperCan;
            case TrashType.Food:
                return foodCan;
            case TrashType.Plastic:
                return plasticCan;
        }
    }});

    display: flex;
    align-items: flex-end;
    justify-content: center;
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
    const topMargin = 140;
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

export const StyledSkipButton = styled(SkipButton)`
    && {
        position: absolute;
        top: 45%;
    }
`;
