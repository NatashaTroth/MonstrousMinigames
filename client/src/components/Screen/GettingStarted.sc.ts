import styled from 'styled-components';

import { secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 8;
const fontSize = 1;

export const StyledInput = styled.input`
    color: black;
    border: none;
    background: #bde5dd;
    cursor: pointer;
    font-weight: 700;
    font-size: calc(${fontSize} * 1rem);
    margin: 30px 0;
    height: 50px;
    width: 100%;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 20px;

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

export const InputLabel = styled.label`
    color: white;
    font-size: 24px;
    font-weight: 500;
`;

export const InputContainer = styled.div`
    text-align: center;
    padding: 0 30px 30px 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

export const DialogContent = styled.div`
    padding: 40px 100px;
    background-color: ${secondary};
    border-radius: 10px;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${secondaryShadow};
`;
