import * as React from 'react';

import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import Button from '../common/Button';
import {
    ConnectScreenContainer,
    FormContainer,
    ImpressumLink,
    StyledForm,
    StyledInput,
    StyledLabel,
} from './ConnectScreen.sc';

interface IFormState {
    roomId: string;
}
export const ConnectScreen: React.FunctionComponent = () => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ roomId: '' });
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);
    let audioContext: any; //TODO change

    React.useEffect(() => {
        // const AudioContext = window.AudioContext;
        //  audioContext = new AudioContext();
    }, []);

    async function handleCreateNewRoom() {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}create-room`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        handleSocketConnection(data.roomId);
        /* eslint no-console: "warn" */
        console.log('hiiiii');
        audioContext.resume();
    }

    return (
        <ConnectScreenContainer>
            <FormContainer>
                <Button
                    type="button"
                    name="new"
                    text="Create new Room"
                    disabled={Boolean(formState?.roomId)}
                    onClick={handleCreateNewRoom}
                />
                <StyledForm
                    onSubmit={e => {
                        e.preventDefault();
                        handleSocketConnection(formState?.roomId || '');
                    }}
                >
                    <StyledLabel>
                        Join existing Room
                        <StyledInput
                            type="text"
                            name="roomId"
                            value={formState?.roomId}
                            onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                            placeholder="Insert a room code"
                        />
                    </StyledLabel>
                    <Button type="submit" name="join" text="Connect" disabled={!formState?.roomId} />
                </StyledForm>
            </FormContainer>

            <ImpressumLink to="/impressum">Impressum</ImpressumLink>
        </ConnectScreenContainer>
    );
};
