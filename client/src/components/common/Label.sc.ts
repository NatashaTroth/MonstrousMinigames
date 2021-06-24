import styled from 'styled-components';

export const Label = styled.div`
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 30px;
`;

export const AdminLabel = styled(Label)`
    margin-bottom: 0;
`;
