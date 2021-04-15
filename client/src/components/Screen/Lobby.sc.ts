import { Typography } from '@material-ui/core'
import styled from 'styled-components'

import { lightBlue, lobbyChoiceBackground, orange } from '../../utils/colors'

export const LobbyContainer = styled.div`
    background-color: ${lightBlue};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: space-evenly;
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
    font-size: 15px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    margin-bottom: 10px;
`

export const GameChoiceContainer = styled.div`
    display: flex;
    justify-content: center;
    flex: 1 1 0px;
    margin: 5em;
    padding: 2.5em;
    background-color: ${lobbyChoiceBackground};
`

export const ListOfGames = styled.div`
    flex-grow: 1;
    max-width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`
export const ImagesContainer = styled.div`
    flex-grow: 1;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-end;
`

export const InstructionsImg = styled.img`
    width: 100%;
`

export const Instructions = styled.p`
    color: white;
    text-align: left;
`
export const UserListItem = styled.div`
    display: flex;
`
export const AdminIcon = styled.div`
    margin-right: 20px;
`

export const UpperSectionItem = styled.div`
    flex-basis: 33%;
`

export const UpperSection = styled.div`
    display: flex;
    justify-content: space-around;
`

export const StyledTypography = styled(Typography)`
    && {
        font-weight: 700;
    }
`
