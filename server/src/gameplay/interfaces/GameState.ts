export enum GameState {
    Initialised = 'INITIALISED',
    Created = 'CREATED',
    Started = 'STARTED',
    Stopped = 'STOPPED',
    Finished = 'FINISHED',
}

/*
Created: Game created, but hasn't started yet
Started: Game has started (players are playing the game)
Stopped: Game was stopped/cancelled without being finished (irregular stop)
Finished: All players finished the game, the game is now over (regular stop)
*/
