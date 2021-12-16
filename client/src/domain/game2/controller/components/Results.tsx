import * as React from 'react';

import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { Instructions, ScreenContainer } from '../../../game3/controller/components/Game3Styles.sc';

const Guess: React.FunctionComponent = () => {
    //const { ... } = React.useContext(Game2Context);
    //const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { playerRank } = React.useContext(PlayerContext);

    //TODO: return actual rank
    return (
        <ScreenContainer>
            <Instructions>Current rank: {playerRank}</Instructions>
        </ScreenContainer>
    );
};

export default Guess;
