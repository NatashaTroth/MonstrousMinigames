import { orange } from '../../utils/colors'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import camp from '../../images/camp.svg'

const borderWidth = 5
const boxShadowDepth = 8
const fontSize = 1
const horizontalPadding = 16
const verticalPadding = 8

export const ConnectScreenContainer = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${camp});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`
export const StyledInput = styled.input`
    color: black;
    border: none;
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    cursor: pointer;
    font-weight: 700;
    font-size: calc(${fontSize} * 1rem);

    &::placeholder {
        color: lightgray;
    }

    &:focus,
    &:active {
        outline: none;
    }
`
export const FormContainer = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
`

export const StyledLabel = styled.label`
    margin: 0px 30px 30px 30px;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    font-size: calc(${fontSize} * 1rem);
    text-align: left;
    color: black;
    border: calc(${borderWidth} * 1px) solid ${orange};
    background: white;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 #888;
    cursor: pointer;
    font-size: calc(${fontSize} * 1rem);
    outline: transparent;
    padding: calc(${verticalPadding} * 1px) calc(${horizontalPadding} * 1px);
    position: relative;
    border-radius: 4px;
`

export const ImpressumLink = styled(Link)`
    text-decoration: none;
    border: 2px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    font-size: 12px;
    flex-direction: column;
    text-align: center;
    box-shadow: 4px 4px 0 #888;
    border-radius: 4px;
    width: 30%;
    margin-bottom: 20px;
`
