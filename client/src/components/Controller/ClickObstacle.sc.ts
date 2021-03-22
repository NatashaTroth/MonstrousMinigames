import styled from 'styled-components'

import { lightBlue, orange } from '../../utils/colors'

export const ObstacleContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${lightBlue};
    display: flex;
    align-items: center;
    flex-direction: column;
`

export const ObstacleItem = styled.div`
    width: 100%;
    transform: rotate(80deg);
`
export const StyledObstacleImage = styled.img`
    width: 100%;
`
export const ObstacleInstructions = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 80%;
    font-size: 20px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    margin-top: 50px;
    margin-bottom: 50px;
`

export const Line = styled.div`
    width: 80%;
    position: absolute;
    border-top: 5px dashed red;
`

export const TouchContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
