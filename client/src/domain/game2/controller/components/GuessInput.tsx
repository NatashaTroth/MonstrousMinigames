import { Container } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

import Button from '../../../../components/common/Button';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { MessageTypesGame2 } from '../../../../utils/constants';

const GuessInput: React.FunctionComponent = () => {
    const [submitted, setSubmitted] = useState(false);

    //const { roomId } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    let userGuess = 0;

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        userGuess = +e.currentTarget.value;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        controllerSocket?.emit({
            type: MessageTypesGame2.guess,
            userId: userId,
            guess: userGuess,
        });
    }

    return (
        <Container>
            <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                <input
                    type="number"
                    pattern="[0-9]*"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
                ></input>
                <br />
                <br />
                {submitted ? (
                    <Button type="submit" disabled>
                        Waiting for others...
                    </Button>
                ) : (
                    <Button type="submit">Submit</Button>
                )}
            </form>
        </Container>
    );
};

export default GuessInput;
