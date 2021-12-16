import { Container } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

import Button from '../../../../components/common/Button';

const GuessInput: React.FunctionComponent = () => {
    const [submitted, setSubmitted] = useState(false);

    //const { roomId } = React.useContext(GameContext);
    //const { userId } = React.useContext(PlayerContext);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        // TODO: submit guess
    }

    return (
        <Container>
            <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                <input type="number" pattern="[0-9]*" />
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
