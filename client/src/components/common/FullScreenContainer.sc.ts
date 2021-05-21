import styled from 'styled-components';

import forest from '../../images/backgroundDesktop.svg';

export const StyledFullScreenContainer = styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
