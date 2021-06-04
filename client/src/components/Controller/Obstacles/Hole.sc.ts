import styled from 'styled-components';

import hole from '../../../images/hole.svg';
import leaf from '../../../images/leaf.svg';
import pebble from '../../../images/pebble.svg';
import { secondary } from '../../../utils/colors';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .drop-active {
        border-color: #aaa;
    }

    .drop-target {
        background-color: ${secondary};
        border-color: #fff;
        border-style: solid;
    }
`;

export const Draggable = styled.div`
    width: 70px;
    height: 70px;
    touch-action: none;
    transform: translate(0px, 0px);
    transition: background-color 0.3s;
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
    margin: 10px auto 30px;
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
