import styled from 'styled-components';

import camp from './images/ui/background.png';

export const AppContainer = styled.div`
    text-align: center;
    height: ${window.innerHeight}px;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${camp});
    background-size: cover;
`;
