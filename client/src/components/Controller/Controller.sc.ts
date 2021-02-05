import { lightBlue } from './../../utils/colors'
import styled, { css } from 'styled-components'

interface IControllerContainerProps {
    disabled?: boolean
}
export const ControllerContainer = styled.div<IControllerContainerProps>`
    background-color: ${lightBlue};
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ disabled }) =>
        disabled &&
        css`
            pointer-events: none;
        `}
`
