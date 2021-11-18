import * as React from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import { StyledFullScreenContainer } from './FullScreenContainer.sc';

interface NoPermissionProps {
    getMotionPermission: () => void;
    getMicrophonePermission: () => void;
}

export const NoPermissions: React.FunctionComponent<NoPermissionProps> = ({
    getMotionPermission,
    getMicrophonePermission,
}) => {
    function askForPermissions() {
        getMicrophonePermission();
        getMotionPermission();
    }

    return (
        <Container>
            <Text>You need to give permission to this site</Text>
            <Button onClick={askForPermissions}>Allow</Button>
        </Container>
    );
};

const Container = styled(StyledFullScreenContainer)`
    color: white;
    font-size: 700;
`;

const Text = styled.div`
    margin-bottom: 20px;
`;
