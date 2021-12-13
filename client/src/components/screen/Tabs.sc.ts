import { Tabs } from '@material-ui/core';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
    && {
        background-color: ${({ theme }) => theme.palette.primary.main};
    }
`;
