import styled from 'styled-components'

import { orange } from '../../utils/colors'

export const FinishedScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const FinishedScreenText = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 100%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
`
