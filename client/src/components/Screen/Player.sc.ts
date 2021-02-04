import styled from 'styled-components'

interface IContainerProps {
    top: number
}

export const Container = styled.div<IContainerProps>`
    top: ${({ top }) => 380 + top * 200}px;
    left: 20px;
    position: absolute;
`
export const PlayerCharacter = styled.img`
    width: 80px;
    height: auto;
`
