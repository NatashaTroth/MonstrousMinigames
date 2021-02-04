import styled from 'styled-components'
import { orange } from '../../utils/colors'

const borderWidth = 5
const boxShadowDepth = 8
const fontSize = 1
const horizontalPadding = 16
const verticalPadding = 8
let clip = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'

export const Container = styled.div``

export const StyledButton = styled.button`
    color: black;
    font-size: 3;
    border: calc(${borderWidth} * 1px) solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 #888;
    cursor: pointer;
    font-size: calc(${fontSize} * 1rem);
    font-weight: bold;
    outline: transparent;
    padding: calc(${verticalPadding} * 1px) calc(${horizontalPadding} * 1px);
    position: relative;
    transition: box-shadow 0.15s ease;
    border-radius: 4px;

    &:hover {
        box-shadow: calc(${boxShadowDepth} / 2 * 1px) calc(${boxShadowDepth} / 2 * 1px) 0 #888;
    }

    &:active {
        box-shadow: 0 0 0 #888;
    }

    &:disabled {
        color: lightgray;
        border-color: lightgray;
    }

    span {
        -webkit-clip-path: ${clip};
        bottom: calc(${borderWidth} * -1px);
        clip-path: ${clip};
        left: calc(${borderWidth} * -1px);
        position: absolute;
        right: calc(${borderWidth} * -1px);
        top: calc(${borderWidth} * -1px);
        z-index: 1;
    }

    span:nth-of-type(1):hover,
    span:nth-of-type(2):hover,
    button span:nth-of-type(3):hover,
    button span:nth-of-type(4):hover {
        z-index: 2;
    }
    span:nth-of-type(1):hover ~ b:nth-of-type(1),
    span:nth-of-type(2):hover ~ b:nth-of-type(2),
    span:nth-of-type(3):hover ~ b:nth-of-type(3),
    span:nth-of-type(4):hover ~ b:nth-of-type(4) {
        ${(clip = 'inset(0 0 0 0)')}
    }
    button span:nth-of-type(1) {
        ${(clip = 'polygon(0 0, 100% 0, 50% 50%, 50% 50%)')}
    }
`
