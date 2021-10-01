import * as React from 'react';


export const defaultValue = {
    playerFinished: false,
    setPlayerFinished: () => {
        // do nothing
    },
};

interface Game2ContextProps {
    playerFinished: boolean;
}

export const Game2Context = React.createContext<Game2ContextProps>(defaultValue);

const Game2ContextProvider: React.FunctionComponent = ({ children }) => {
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false);

    const reroute = true;

    const content = {
        playerFinished,
        setPlayerFinished,
    };
    return <Game2Context.Provider value={content}>{children}</Game2Context.Provider>;
};

export default Game2ContextProvider;
