import * as React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { Instructions, ScreenContainer } from '../../../game3/controller/components/Game3Styles.sc';

const Guess: React.FunctionComponent = () => {
    //const { ... } = React.useContext(Game2Context);
    //const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { guessHint } = React.useContext(Game2Context);

    // eslint-disable-next-line no-console
    console.log(guessHint);

    return (
        <ScreenContainer>
            <Instructions>
                {guessHint == '' ? "Don't forget to enter a guess" : `Your last guess was ${guessHint}`}
            </Instructions>
        </ScreenContainer>
    );
};

export default Guess;
