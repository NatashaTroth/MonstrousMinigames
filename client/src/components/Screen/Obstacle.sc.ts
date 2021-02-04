import styled from 'styled-components'

interface IObstacleProps {
    posX: number
    player: number
}
export const StyledObstacle = styled.div<IObstacleProps>`
    height: 50px;
    width: 50px;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    left: ${({ posX }) => posX + 70}px;
    top: ${({ player }) => 160 + player * 200}px;
`

export const StyledObstacleImage = styled.img`
    width: 100%;
`
