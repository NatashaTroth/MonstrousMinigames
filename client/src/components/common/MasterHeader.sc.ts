import styled from 'styled-components';

export const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
`;

export const InnerContainer = styled.div`
    padding: 10px;

    button:not(:last-child) {
        margin-right: 20px;
    }
`;
