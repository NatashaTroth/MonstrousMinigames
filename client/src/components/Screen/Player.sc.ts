import styled from 'styled-components'

import { orange } from '../../utils/colors'

interface IContainerProps {
    top: number
}

export const Container = styled.div<IContainerProps>`
    top: ${({ top }) => 50 + top * 200}px;
    left: 20px;
    position: absolute;
    transition: left 0.4s;
    display: flex;
    color: white;
    flex-direction: column;
`
export const PlayerCharacter = styled.img`
    width: 80px;
    height: auto;
`

export const PlayerName = styled.div`
    border: 2px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 100%;
    font-size: 10px;
    flex-direction: column;
    text-align: center;
    box-shadow: 4px 4px 0 #888;
    border-radius: 4px;
    margin-bottom: 5px;
`
