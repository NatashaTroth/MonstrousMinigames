import styled from 'styled-components';

import { secondary } from '../../utils/colors';

export const LoadingContainer = styled.div`
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
    background: ${secondary};
    padding: 20px;
    border-radius: 20px;

    .MuiCircularProgress-colorPrimary {
        color: black;
    }
`;
