import styled from 'styled-components'

export const Player = styled.div`
    background-color: red;
    position: absolute;
    left: 0;
    top: 0;
`

interface IContainerProps {
    inVisible: boolean
}
export const Container = styled.div<IContainerProps>`
    visibility: ${({ inVisible }) => (inVisible ? 'hidden' : 'visible')};
`
