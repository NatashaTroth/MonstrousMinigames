import styled, { keyframes } from 'styled-components'

import forest from '../../images/forest.png'
import { orange } from '../../utils/colors'

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    40% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}`

export const Container = styled.div`
    width: 100%;
    position: absolute;
    height: 100%;
    background-size: cover;
    background-repeat-y: repeat;
    top: 0;
    background-position: bottom;
    background-image: url(${forest});
`

export const ContainerTimer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

export const CountdownRenderer = styled.p`
    font-size: 8em;
    font-weight: 900;
    color: ${orange};
`

export const Go = styled.p`
    font-size: 200px;
    font-weight: 900;
    color: ${orange};
    -webkit-animation: fadeInOut 6s;
    animation: ${fadeOut} 2s;
    opacity: 0;
    position: absolute;
    left: calc(50% - 140px);
    top: 18%;
`
