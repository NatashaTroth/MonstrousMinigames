import styled from 'styled-components';

import { orange } from '../../utils/colors';

const borderWidth = 5;
const boxShadowDepth = 8;
const fontSize = 1;
const horizontalPadding = 16;
const verticalPadding = 8;

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
`;
export const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
    align-items: center;

    button:first-of-type {
        margin-bottom: 50px;
    }
`;

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
`;

export const CloseButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;

export const DialogContent = styled.div`
    padding: 0 30px 30px 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;
