import * as React from "react";
import styled from "styled-components";

import history from "../../domain/history/history";
import Button from "../common/Button";
import { StyledFullScreenContainer } from "./FullScreenContainer.sc";

interface NoPermissionProps {
    getMotionPermission: () => void;
    getMicrophonePermission: () => void;
    setSkipped: (val: boolean) => void;
}

export const NoPermissions: React.FunctionComponent<NoPermissionProps> = ({
    getMotionPermission,
    getMicrophonePermission,
    setSkipped,
}) => {
    function askForPermissions() {
        getMicrophonePermission();
        getMotionPermission();
    }

    return (
        <Container>
            <Text>You need to give permission to this site</Text>
            <Button onClick={askForPermissions}>Allow</Button>
            <StyledButton onClick={() => setSkipped(true)}>Skip</StyledButton>
        </Container>
    );
};

const Container = styled(StyledFullScreenContainer)`
    color: white;
    font-weight: 700;
`;

const Text = styled.div`
    margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    && {
        margin-top: 20px;
    }
`;
