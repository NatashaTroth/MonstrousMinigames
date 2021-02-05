import { lightBlue, orange } from './../../utils/colors'
import styled from 'styled-components'

export const LobbyContainer = styled.div`
    background-color: ${lightBlue};
    height: 100%;
    width: 100%;
    align-items: center;
    display: flex;
    flex-direction: column;
`

export const Headline = styled.div`
    font-size: 40px;
    font-weight: 700;
    padding-top: 30px;
    padding-bottom: 30px;
`

export const JoinedUsersView = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

export const Subline = styled.div`
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 20px;
`
export const JoinedUser = styled.div`
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
    margin-bottom: 10px;
`
