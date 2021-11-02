import * as React from 'react';

import Button from '../../../../components/common/Button';
import { ScreenContainer } from './Game3Styles.sc';
import { ButtonContainer, VoteInstructions } from './Vote.sc';

const Vote: React.FunctionComponent = () => {
    const pictures = [1, 2, 3];

    function handleVote(picture: number) {
        // TODO
        // eslint-disable-next-line
        console.log(picture)
    }

    return (
        <ScreenContainer>
            <VoteInstructions>Choose the picture you like the most</VoteInstructions>
            {pictures.map((picture, index) => (
                <ButtonContainer key={`button${index}`}>
                    <Button onClick={() => handleVote(picture)}>{picture}</Button>
                </ButtonContainer>
            ))}
        </ScreenContainer>
    );
};

export default Vote;
