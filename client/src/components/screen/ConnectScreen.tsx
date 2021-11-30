/* eslint-disable react-hooks/exhaustive-deps */
import { AccordionDetails, AccordionSummary, useMediaQuery } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as React from "react";

import { ScreenSocketContext } from "../../contexts/ScreenSocketContextProvider";
import history from "../../domain/history/history";
import { localBackend, localDevelopment } from "../../utils/constants";
import { Routes, screenFinishedRoute } from "../../utils/routes";
import Button from "../common/Button";
import LoadingComponent from "../common/LoadingComponent";
import Logo from "../common/Logo";
import ConnectDialog from "./ConnectDialog";
import {
    ConnectScreenContainer, InstructionContainer, LeftButtonContainer, LeftContainer,
    RightContainer, SettingButtonSection, StyledAccordion, StyledHeadline, StyledText
} from "./ConnectScreen.sc";
import GettingStartedDialog from "./GettingStarted";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');

export const ConnectScreen: React.FunctionComponent = () => {
    const [joinDialogOpen, setJoinDialogOpen] = React.useState(false);
    const [gettingStartedDialogOpen, setGettingStartedDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);
    const displayInstruction = useMediaQuery('(min-width:860px)');

    async function handleJoinRoom() {
        setJoinDialogOpen(true);
    }

    async function handleGettingStarted() {
        history.push(screenFinishedRoute('ADSD'));
        setGettingStartedDialogOpen(true);
    }

    return (
        <ConnectScreenContainer>
            {loading && <LoadingComponent />}
            <ConnectDialog open={joinDialogOpen} handleClose={() => setJoinDialogOpen(false)} />
            <GettingStartedDialog
                open={gettingStartedDialogOpen}
                handleClose={() => setGettingStartedDialogOpen(false)}
            />
            <LeftContainer>
                <LeftButtonContainer>
                    <div>
                        <Button
                            type="button"
                            id="new-room"
                            name="new"
                            onClick={() =>
                                handleCreateNewRoom({
                                    setLoading,
                                    handleSocketConnection,
                                    fetch,
                                })
                            }
                            title="Create new room"
                        >
                            Create New Room
                        </Button>

                        <Button
                            type="button"
                            id="join"
                            name="join"
                            onClick={handleJoinRoom}
                            title="Join an already existing room"
                        >
                            Join Room
                        </Button>

                        <Button type="button" name="tutorial" onClick={handleGettingStarted}>
                            About
                        </Button>
                    </div>

                    <SettingButtonSection>
                        <Button type="button" name="credits" onClick={() => history.push(Routes.credits)}>
                            Credits
                        </Button>
                        <Button type="button" name="settings" onClick={() => history.push(Routes.settings)}>
                            Settings
                        </Button>
                    </SettingButtonSection>
                </LeftButtonContainer>
            </LeftContainer>
            <RightContainer>
                <Logo />

                {displayInstruction && (
                    <InstructionContainer>
                        <StyledAccordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <StyledHeadline>Welcome to Monstrous Mini Games!</StyledHeadline>
                            </AccordionSummary>
                            <AccordionDetails>
                                <StyledText>
                                    Exciting mini games are waiting for you to play together with your friends, no
                                    matter if you are sitting together in a room or are far away from each other. This
                                    screen serves as the game board and each player needs a smartphone to use as their
                                    controller. Each player gets their own monster that can be controlled through their
                                    mobile phone. Once you have created or joined a room, you can connect your mobile
                                    phone via the QR code.
                                </StyledText>
                            </AccordionDetails>
                        </StyledAccordion>
                    </InstructionContainer>
                )}
            </RightContainer>
        </ConnectScreenContainer>
    );
};

interface HandleCreateNewRoomProps {
    setLoading: (val: boolean) => void;
    handleSocketConnection: (roomId: string, route: string) => void;
    fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
}

export async function handleCreateNewRoom({ setLoading, handleSocketConnection, fetch }: HandleCreateNewRoomProps) {
    setLoading(true);
    const response = await fetch(`${localDevelopment ? localBackend : process.env.REACT_APP_BACKEND_URL}create-room`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response) {
        setLoading(false);
    }

    const data = await response.json();

    handleSocketConnection(data.roomId, 'lobby');
}
