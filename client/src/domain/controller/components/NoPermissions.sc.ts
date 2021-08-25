import styled from 'styled-components';

import forest from '../../../images/ui/forest_mobile.svg';

export const Container = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 700;
`;

export const Text = styled.div`
    margin-bottom: 20px;
`;
