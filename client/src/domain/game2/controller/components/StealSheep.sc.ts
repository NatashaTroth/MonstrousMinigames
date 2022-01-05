import styled, { css } from 'styled-components';

import bag from '../../../../images/ui/bag.svg';
import meadow from '../../../../images/ui/grass.png';
import { ObstacleInstructions } from '../../../game1/controller/components/obstacles/ObstacleStyles.sc';

interface Draggable {
    index: 'sheep' | 'decoy';
}

export const Draggable = styled.div<Draggable>`
    width: 100px;
    height: auto;
    touch-action: none;
    transform: translate(0px, 0px);
    transition: background-color 0.3s;
    position: absolute;
    left: ${window.innerWidth * 0.5 - 50}px;

    ${({ index }) =>
        index === 'sheep'
            ? css`
                  top: ${window.innerHeight * 0.25 - 45}px;
              `
            : css`
                  top: ${window.innerHeight * 0.75 - 45}px;
              `};
`;

export enum DropZoneVariant {
    meadow = 'meadow',
    bag = 'bag',
}

interface DropZoneProps {
    variant: DropZoneVariant;
}

export const Instructions = styled(ObstacleInstructions)`
    margin-top: 30px;
`;

export const DropZone = styled.div<DropZoneProps>`
    border: dashed 4px transparent;
    border-radius: 4px;
    padding: 10px;
    width: 80%;
    transition: background-color 0.3s;
    height: 120px;

    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${({ variant }) => {
        switch (variant) {
            case DropZoneVariant.meadow:
                return meadow;
            case DropZoneVariant.bag:
                return bag;
        }
    }});

    ${({ variant }) =>
        variant === 'bag' &&
        css`
            background-size: contain;
            height: 200px;
        `}

    display: flex;
    align-items: flex-end;
    justify-content: center;
`;

export const StyledImage = styled.img`
    width: 100%;
    height: 100%;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-around;

    .drop-active {
        border-color: #aaa;
    }

    .drop-target {
        background-color: ${({ theme }) => theme.palette.secondary.main};
        border-color: #fff;
        border-style: solid;
    }
`;
