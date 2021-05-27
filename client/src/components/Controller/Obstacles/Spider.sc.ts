import styled, { keyframes } from 'styled-components';

import { ReactComponent as NetImage } from '../../../images/net.svg';
import { ReactComponent as SpiderImage } from '../../../images/spider.svg';
import { SkipButton } from '../../common/SkipButton.sc';

const slideIn = keyframes`
    0% {
        transform: translateY(-600px);
    }

    33% {
        transform: translateY(60px);
    }

    66% {
        transform: translateY(-60px);
    }

    100% {
        transform: translateY(0);
    }
`;

interface Spider {
    strokeWidth: number;
}

export const StyledSpider = styled(SpiderImage)<Spider>`
    width: 80%;
    height: 100%;
    position: absolute;

    animation-duration: 2s;
    animation-iteration-count: 1;
    animation-name: ${slideIn};
    transform-origin: top;
    transition: 1s;
    animation-timing-function: ease;

    .st0 {
        stroke-width: ${({ strokeWidth }) => strokeWidth}px;
    }
`;

export const StyledNet = styled(NetImage)`
    position: absolute;
    top: 100px;
    z-index: -1;

    .net0 {
        stroke-width: 5px;
        stroke: white;
    }
`;

export const StyledSkipButton = styled(SkipButton)`
    && {
        position: absolute;
        top: 45%;
    }
`;
