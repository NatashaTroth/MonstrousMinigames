import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { lightBlue, orange } from '../../utils/colors';

export const CreditsContainer = styled.div`
    background-color: ${lightBlue};
    width: 100%;
    height: 100%;
`;
export const Headline = styled.div`
    font-weight: 700;
    font-size: 25px;
    padding-top: 20px;
`;
export const HomeLink = styled(Link)`
    text-decoration: none;
    border: 2px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    font-size: 12px;
    flex-direction: column;
    text-align: center;
    box-shadow: 4px 4px 0 #888;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 5px;
`;
