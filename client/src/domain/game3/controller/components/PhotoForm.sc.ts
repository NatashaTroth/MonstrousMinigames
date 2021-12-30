import { Button as MuiButton } from '@material-ui/core';
import styled, { keyframes } from 'styled-components';

import theme from '../../../../styles/theme';

export const glowing = keyframes`{
  0% { background-color: ${theme.palette.primary.main}; box-shadow: 0 0 3px  ${theme.palette.primary.dark}; transform: scale(1);  }
  50% { background-color: ${theme.palette.secondary.light}; box-shadow: 0 0 40px  ${theme.palette.secondary.dark}; transform: scale(1.2); }
  100% { background-color:  ${theme.palette.primary.main}; box-shadow: 0 0 3px  ${theme.palette.primary.dark}; transform: scale(1); }
}`;

export const StyledButton = styled(MuiButton)`
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    animation: ${glowing} 1500ms infinite;
`;

export const StyledImg = styled.img`
    display: flex;
    width: 40%;
    margin-bottom: 20px;
`;

export const UploadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
`;

export const StyledLabel = styled.label`
    p {
        font-weight: 700;
    }

    input[type='file'] {
        position: absolute;
        top: -1000px;
    }
`;
