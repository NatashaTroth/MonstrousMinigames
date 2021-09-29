import * as React from 'react';

import Button from '../common/Button';
import { Container, Text } from './NoPermissions.sc';

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
