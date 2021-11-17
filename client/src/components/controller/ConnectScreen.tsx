import { History } from 'history';
import * as React from 'react';
import Frame from 'react-frame-component';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import Button from '../common/Button';
import { ConnectScreenContainer, FormContainer, inputStyles, LabelStyles, wrapperStyles } from './ConnectScreen.sc';

interface FormStateProps {
    name: string;
    roomId: string;
}

interface ConnectScreen {
    history: History;
}

export const ConnectScreen: React.FunctionComponent<ConnectScreen> = ({ history }) => {
    const { location } = history;
    const roomId = checkRoomCode(location.pathname.slice(1));
    const [formState, setFormState] = React.useState<FormStateProps>({
        name: localStorage.getItem('name') || '',
        roomId: roomId || '',
    });
    const { handleSocketConnection } = React.useContext(ControllerSocketContext);

    React.useEffect(() => {
        if (roomId) {
            sessionStorage.setItem('roomId', roomId);
        }
    }, [roomId]);

    return (
        <ConnectScreenContainer>
            <FormContainer
                onSubmit={e => {
                    e.preventDefault();

                    const frame = document.getElementsByTagName('iframe')[0];
                    if (frame) {
                        frame.parentNode?.removeChild(frame);
                    }

                    handleSocketConnection(formState.roomId.toUpperCase(), formState?.name);
                }}
            >
                <Frame>
                    <IFrameContent roomId={roomId} formState={formState} setFormState={setFormState} />
                </Frame>

                <Button type="submit" disabled={!formState?.name || formState.roomId === ''}>
                    Enter
                </Button>
            </FormContainer>
        </ConnectScreenContainer>
    );
};

export function checkRoomCode(roomId: string) {
    if (roomId.length !== 4) {
        return null;
    } else if (!roomId.match('^[a-zA-Z]+$')) {
        return null;
    }

    return roomId;
}

interface IFrameContentProps {
    roomId: string | null;
    formState: FormStateProps;
    setFormState: (val: FormStateProps) => void;
}

export const IFrameContent: React.FunctionComponent<IFrameContentProps> = ({ roomId, formState, setFormState }) => (
    <div
        style={{
            ...wrapperStyles,
        }}
    >
        <label style={{ ...LabelStyles }}>Enter your name:</label>
        <input
            type="text"
            name="name"
            value={formState?.name}
            onChange={e => setFormState({ ...formState, name: e.target.value })}
            placeholder="James P."
            required
            maxLength={10}
            style={{ ...inputStyles }}
        />
        {!roomId && (
            <>
                <label style={{ ...LabelStyles }}>Enter the roomCode:</label>
                <input
                    type="text"
                    name="roomId"
                    value={formState?.roomId}
                    onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                    placeholder="ABCD"
                    required
                    maxLength={4}
                    style={{ ...inputStyles }}
                />
            </>
        )}
    </div>
);
