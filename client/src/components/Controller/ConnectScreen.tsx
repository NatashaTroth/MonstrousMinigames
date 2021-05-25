import { History } from 'history';
import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { sendMovement } from '../../domain/gameState/controller/sendMovement';
import Button from '../common/Button';
import { Label } from '../common/Label.sc';
import { ConnectInstructions, ConnectScreenContainer, FormContainer, StyledInput } from './ConnectScreen.sc';

interface IFormState {
    name: string;
    roomId: string;
}

interface ConnectScreen {
    history: History;
}
export const ConnectScreen: React.FunctionComponent<ConnectScreen> = ({ history }) => {
    const { location } = history;
    const roomId = location.pathname.slice(1);
    const [formState, setFormState] = React.useState<IFormState>({
        name: localStorage.getItem('name') || '',
        roomId: roomId || '',
    });
    const { controllerSocket, handleSocketConnection } = React.useContext(ControllerSocketContext);
    const { playerFinished, permission } = React.useContext(PlayerContext);
    const { hasPaused } = React.useContext(GameContext);

    React.useEffect(() => {
        if (roomId) {
            sessionStorage.setItem('roomId', roomId);
        }
    }, [roomId]);

    if (permission) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                event.preventDefault();
                if (
                    event?.acceleration?.x &&
                    (event.acceleration.x < -2 || event.acceleration.x > 2) &&
                    !playerFinished
                ) {
                    sendMovement(controllerSocket, hasPaused);
                }
            }
        );
    }

    return (
        <ConnectScreenContainer>
            {roomId ? (
                <>
                    <FormContainer
                        onSubmit={e => {
                            e.preventDefault();
                            handleSocketConnection(formState.roomId.toUpperCase(), formState?.name);
                        }}
                    >
                        <Label>Enter your name:</Label>
                        <StyledInput
                            type="text"
                            name="name"
                            value={formState?.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                            placeholder="Insert your name"
                            required
                            maxLength={10}
                        />
                        <Button type="submit" disabled={!formState?.name}>
                            Enter
                        </Button>
                    </FormContainer>
                </>
            ) : (
                <ConnectInstructions>
                    <Label>Please connect device via QR Code</Label>
                </ConnectInstructions>
            )}
        </ConnectScreenContainer>
    );
};
