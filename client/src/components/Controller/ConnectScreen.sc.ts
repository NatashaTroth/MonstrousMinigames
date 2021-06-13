import styled from 'styled-components';

import forest from '../../images/ui/forest_mobile.svg';
import { primary } from '../../utils/colors';
import { Label } from '../common/Label.sc';

const fontSize = 1;

export const ConnectScreenContainer = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;
export const StyledInput = styled.input`
    color: black;
    border: none;
    background: ${primary};
    cursor: pointer;
    font-weight: 700;
    font-size: calc(${fontSize} * 1rem);
    margin-bottom: 30px;
    margin-top: 10px;
    width: 70%;

    height: 50px;
    padding: 5px 20px;
    border-radius: 10px;
    font-size: 20px;

    &::placeholder {
        color: grey;
    }

    &:focus,
    &:active {
        outline: none;
    }
`;
export const FormContainer = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

export const InputLabel = styled(Label)`
    && {
        margin-bottom: 0;
    }
`;
