import * as React from 'react';

import Game1ContextProvider from '../../contexts/game1/Game1ContextProvider';

const GameWrapper: React.FunctionComponent = ({ children }) => {
    return <Game1ContextProvider>{children}</Game1ContextProvider>;
};

export default GameWrapper;
