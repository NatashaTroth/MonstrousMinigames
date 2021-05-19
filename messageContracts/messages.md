# Messages



## Server → Controller

### userInit

-   sent to single controller
    -   on initial connection
    -   on game reset
-   contains user information for this specific controller

example:

```json
{
    "type": "userInit",
    "userId": "xx_xxx",
    "roomId": "XXXX",
    "name": "John",
    "isAdmin": true,
    "number": 1
}
```
* * *

## Server → Controllers & Screens

### connectedUsers

-   contains array of connected users
-   on new controller/screen join: sent to screens
-   on controller disconnect: sent to controllers & screens
-   on game reset: sent to controllers & screens

example:

```json
{
    type:"connectedUsers",
    users: [
            {
                id: "xx_xxx";
                roomId: "XXXX";
                socketId: "xx_xxx";
                name: "John";
                timestamp: 1621423660;
                active: true;
                number: 1;
            },
            {
                id: "xx_xxx";
                roomId: "XXXX";
                socketId: "xx_xxx";
                name: "John";
                timestamp: 1621423662;
                active: true;
                number: 2;
            },

    ]
}
```
### gameHasReset

-   on game reset caused by 'backToLobby' message
-   sent to all controllers & screens in the room

example:

```json
{
    type:"gameHasReset"
}
```

### gameHasStopped

-   on 'GameHasStopped' game event
-   sent to all controllers & screens in the room

example:

```json
{
    type:"gameHasStopped"
}
```

### gameHasTimedOut

-   on 'GameHasTimedOut' game event
-   sent to all controllers & screens in the room
-   contains 'GameHasFinished' data

example:

```json
{
    type:"gameHasTimedOut",
    data: {
        roomId: "XXXX",
        gameState: GameState,
        trackLength: 3000,
        numberOfObstacles: 3,
        playerRanks: Array<PlayerRank>,
    }
}
```
### gameHasFinished

-   on 'GameHasFinished' game event
-   sent to all controllers & screens in the room
-   contains 'GameHasFinished' data

example:

```json
{
    type:"gameHasFinished",
    data: {
        roomId: "XXXX",
        gameState: GameState,
        trackLength: 3000,
        numberOfObstacles: 3,
        playerRanks: Array<PlayerRank>,
    }
}
```
### gameHasPaused

-   on 'GameHasPaused' game event
-   sent to all controllers & screens in the room
-   contains 'GameStateHasChanged' data

example:

```json
{
    type:"gameHasPaused",
    data: {
        roomId: "XXXX"
    }
}
```

### gameHasResumed

-   on 'GameHasResumed' game event
-   sent to all controllers & screens in the room
-   contains 'GameStateHasChanged' data

example:

```json
{
    type:"gameHasResumed",
    data: {
        roomId: "XXXX"
    }
}
```

* * *
## Server → Controller || Screen

### error

-   on error
-   sent to individual controller or screen
-   communicates different kinds of errors

example:

```json
{
    type: "error",
    name: "ErrorName",
    msg:  "Invalid action!"
}
```


* * *
## Controller → Server

### backToLobby

-   resets game (if the user is admin)
    -   invokes 'gameHasReset' message

example:

```json
{
    type: "backToLobby"
}
```
* * *

## Screen → Server

### pauseResume

-   toggles between pause and resume
    -   pauses the game if the game is running
    -   resumes the game if the game is paused

example:

```json
{
    type: "pauseResume"
}
```

### stopGame

-   stops the game

example:

```json
{
    type: "stopGame"
}
```