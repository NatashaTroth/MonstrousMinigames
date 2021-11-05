import * as React from 'react';

import Game1ContextProvider from '../../contexts/game1/Game1ContextProvider';
import Game3ContextProvider from '../../contexts/game3/Game3ContextProvider';

const GameWrapper: React.FunctionComponent = ({ children }) => {
    return (
        <Game1ContextProvider>
            <Game3ContextProvider>{children}</Game3ContextProvider>
        </Game1ContextProvider>
    );
};

export default GameWrapper;
