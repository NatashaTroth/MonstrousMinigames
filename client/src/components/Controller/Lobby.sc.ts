import { Typography } from '@material-ui/core'
import styled from 'styled-components'

import { orange } from '../../utils/colors'

export const LobbyScreenContainer = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`
export const Instruction = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 80%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
`

export const AdminInstructions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 20px;
`

export const StyledTypography = styled(Typography)`
    && {
        font-weight: 700;
        margin-top: 20px;
        margin-bottom: 50px;
    }
`
