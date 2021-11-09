import * as React from 'react';
import styled from 'styled-components';

import forest from '../../images/ui/forest_mobile.svg';
import Button from '../common/Button';

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

const Container = styled.div`
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

const Text = styled.div`
    margin-bottom: 20px;
`;
