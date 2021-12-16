import * as React from 'react';

import { Instructions, ScreenContainer } from '../../../game3/controller/components/Game3Styles.sc';
import GuessInput from './GuessInput';

const Guess: React.FunctionComponent = () => {
    //const { ... } = React.useContext(Game2Context);

    return (
        <ScreenContainer>
            <Instructions>How many sheep are on the meadow?</Instructions>
            <GuessInput />
        </ScreenContainer>
    );
};

export default Guess;
