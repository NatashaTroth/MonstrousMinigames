import * as React from 'react';

import Button from '../../../../components/common/Button';
import { FullScreenContainer } from '../../../../components/common/FullScreenStyles.sc';
import { inputStyles } from '../../../../components/controller/ConnectScreen.sc';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { MessageTypesGame2 } from '../../../../utils/constants';
import { FormContainer, Instructions } from './Game2Styles.sc';

const Guess: React.FunctionComponent = () => {
    const [submitted, setSubmitted] = React.useState(false);
    const [guess, setGuess] = React.useState<undefined | string>('');
    const { userId } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);

        controllerSocket?.emit({
            type: MessageTypesGame2.guess,
            userId,
            guess,
        });
    }

    return (
        <FullScreenContainer>
            <FormContainer>
                <Instructions>How many sheeps are on the meadow?</Instructions>
                <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                    <input
                        type="number"
                        value={guess}
                        pattern="[0-9]*"
                        onChange={(e: { target: { value: string } }) => setGuess(e.target.value)}
                        style={{ ...inputStyles }}
                    />
                    {submitted ? (
                        <Instructions>Waiting for others...</Instructions>
                    ) : (
                        <Button type="submit" disabled={!guess}>
                            Submit
                        </Button>
                    )}
                </form>
            </FormContainer>
        </FullScreenContainer>
    );
};

export default Guess;
