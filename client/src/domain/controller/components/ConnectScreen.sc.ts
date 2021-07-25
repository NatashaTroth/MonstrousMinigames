import styled from 'styled-components';

import theme from '../../../styles/theme';
import forest from '../../images/ui/forest_mobile.svg';

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

    iframe {
        border: 0;
        display: flex;
        width: 80%;
        height: 400px;
    }
`;

export const inputStyles = {
    color: 'black',
    border: 'none',
    background: theme.palette.primary.main,
    cursor: 'pointer',
    fontWeight: 700,
    marginBottom: '30px',
    marginTop: '10px',
    display: 'flex',
    height: '50px',
    padding: '5px 20px',
    borderRadius: '10px',
    fontSize: '20px',
    '::placeholder': {
        color: 'grey',
    },

    ':focus': {
        outline: 'none',
    },
    ':active': {
        outline: 'none',
    },
};

export const LabelStyles = {
    color: theme.palette.primary.main,
    fontSize: '24px',
    fontWeight: 700,
    fontStyle: 'italic',
    marginBottom: 0,
    fontFamily: 'Arial',
};

export const wrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
} as React.CSSProperties;

export const FormContainer = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
`;
