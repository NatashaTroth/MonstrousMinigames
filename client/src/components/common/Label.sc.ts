import styled from 'styled-components';

import { primary } from '../../utils/colors';

export const Label = styled.div`
    color: ${primary};
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 30px;
`;

export const AdminLabel = styled(Label)`
    margin-bottom: 0;
`;
