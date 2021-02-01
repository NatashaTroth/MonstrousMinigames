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

export const ObstacleButton = styled.button`
    border: none;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: blueviolet;
    color: white;
    font-weight: 700;
`
