import { TouchApp } from '@material-ui/icons'
import styled, { keyframes } from 'styled-components'

import { grey, lightBlue, orange } from '../../../utils/colors'

const slide = keyframes`
    0% { 
        transform: translateX(0);
          opacity: 1;
    }
    16% {
        transform: translateX(280px); 
          opacity: 1;
    }
    33%{
       transform: translateX(0px);
         opacity: 1;  
    }
    49%{
       transform: translateX(280px);  
         opacity: 1;
    }
    66%{
       transform: translateX(0px);  
         opacity: 1;
    }
    82%{
       transform: translateX(280px);  
       opacity: 1;
    }
    100% { 
        transform: translateX(0);
        opacity: 0;  
    }
`

export const ObstacleContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${lightBlue};
    display: flex;
    align-items: center;
    flex-direction: column;
`

export const ObstacleItem = styled.div`
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
    margin-bottom: 20px;
`

export const TouchContainer = styled.div`
    width: 80%;
    position: absolute;
    height: 50px;
    display: flex;
    align-items: center;
`

export const Line = styled.div`
    width: 100%;
    position: absolute;
    border-top: 5px dashed red;
`

export const ObstacleContent = styled.div`
    margin-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`

export const StyledTouchAppIcon = styled(TouchApp)`
    && {
        margin-top: 20px;
        z-index: 2;
        width: 50px;
        height: 50px;
        color: ${grey};
        animation-duration: 6s;
        animation-iteration-count: 1;
        transform-origin: bottom;
        animation-name: ${slide};
        opacity: 0;
    }
`
