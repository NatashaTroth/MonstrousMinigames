import styled from 'styled-components'
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation'

const color = '#aadd22'

export const StyledShakeInstruction = styled.div`
    border: 5px solid ${color};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${color};
    font-weight: 700;
    display: flex;
    width: 100%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
`
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const StyledRotationIcon = styled(ScreenRotationIcon)`
    && {
        width: 100px;
        margin-top: -40px;
        height: 100px;
        margin-bottom: 20px;
        color: #90ba20;
    }
`
