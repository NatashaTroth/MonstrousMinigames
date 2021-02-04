import styled from 'styled-components'

interface IObstacleProps {
    posX: number
    player: number
}
export const StyledObstacle = styled.div<IObstacleProps>`
    background-color: #795548;
    height: 50px;
    width: 50px;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    left: ${({ posX }) => posX + 40}px;
    top: ${({ player }) => 140 + player * 200}px;
`
