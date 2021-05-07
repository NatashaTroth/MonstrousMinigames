export enum GameState {
    Initialised = 'INITIALISED',
    Created = 'CREATED',
    Started = 'STARTED',
    Paused = 'PAUSED',
    Stopped = 'STOPPED',
    Finished = 'FINISHED',
}

/*
Initialised: Game class has been initialised
Created: Game created, but hasn't started yet (wait until countdown finishes)
Started: Game has started (players are playing the game)
Paused: Game has been paused
Stopped: Game was stopped/cancelled without being finished (irregular stop)
Finished: All players finished the game, the game is now over (regular stop)
*/
