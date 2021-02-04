import styled from 'styled-components'

const color = '#e98f23'

export const ObstacleContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: #bfeff0;
    display: flex;
    align-items: center;
    flex-direction: column;
`

export const ObstacleItem = styled.div`
    border-radius: 50%;
    width: 80%;
`
export const StyledObstacleImage = styled.img`
    width: 100%;
`
export const ObstacleInstructions = styled.div`
    border: 5px solid ${color};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${color};
    font-weight: 700;
    display: flex;
    width: 80%;
    font-size: 20px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    margin-top: 50px;
`
