# Messages

## Server → Controller

### userInit

- sent to single controller
  - on initial connection
  - on game reset
- contains user information for this specific controller

example:

```json
{
  "type": "userInit",
  "userId": "xx_xxx",
  "roomId": "XXXX",
  "name": "John",
  "isAdmin": true,
  "number": 1,
  "ready": false
}
```

### game1/playerFinished

- on 'PlayerHasFinished' game event
- sent to the individual controller
  - when the player reached the goal
- sends the player rank

example:

```json
{
  "type": "game1/playerFinished",
  "rank": 1
}
```

### game1/obstacle

- on 'ObstacleReached' game event
- sent to the individual controller
  - when the player reaches an obstacle
- sends the obstacle type and id

example:

```json
{
  "type": "game1/obstacle",
  "obstacleId": 1,
  "obstacleType": "TREE_STUMP"
}
```

### game1/playerDied

- on 'PlayerIsDead' game event
- sent to the individual controller
  - when the player died
- sends the player rank

example:

```json
{
  "type": "game1/playerDied",
  "rank": 1
}
```

### game1/playerStunned

- on 'PlayerIsStunned' game event
- sent to the individual controller
  - when the player is stunned by a rock
- sends the player rank

example:

```json
{
  "type": "game1/playerStunned",
  "rank": 1
}
```

### game2/guessHint

- send the hint for the result of the guess
- sent to the individual controller

example:

```json
{
    "type": "game2/guessResult",
    "hint": "way too high",
    "
}
```

### game2/remainingKills

- send the remaining kills 
- sent to the individual controller

example:

```json
{
    "type": "game2/remainingKills",
    "remainingKills": 2,
    "
}
```

---

## Server → Screen

### screenAdmin

- notifies the admin screen about its status
- is being sent on admin change

example:

```json
{
  "type": "screenAdmin",
  "isAdmin": true
}
```

### playerHasDisconnected

- notifies the screen about player disconnecting

example:

```json
{
  "type": "playerHasDisconnected",
  "userId": "XXXxxXX"
}
```

### playerHasReconnected

- notifies the screen about player reconnecting

example:

```json
{
  "type": "playerHasReconnected",
  "userId": "XXXxxXX"
}
```

### game1/gameState

- sent periodically to all screens in the room

example:

```json
{
    "type": "game1/gameState",
    "gameState": "STARTED",
    "roomId": "XXXX",
    "playersState": [
        {
            "id": "xx_xxx",
            "name": "John",
            "positionX": 10,
            "obstacles": Array<Obstacle>,
            "atObstacle": false,
            "finished": false,
            "finishedTimeMs": 0,
            "rank": 1,
            "isActive": true,
        },
        .
        .
        .
    ],
    "trackLength": 3000,
    "numberOfObstacles": 3
```

### screenState

- sends the current state of the admin screen
  example:

```json
{
    "type": "screenState",
    "state": "choose-game",
    // "game": "game2"
    .
    .
}
```

### game2/playerRanks

- sent player ranks in result phase

example:

```json
{
    "type": "game2/playerRanks",
    "roomId": "XXXX",
    "playerRanks": [
        {
        "id": 'tmc-p0K5N_TXFGtDZma_M',
        "name": 'Robin',
        "rank": 1,
        "isActive": true,
        "points": 3,
        "previousRank": 0
        },
        .
        .
        .
    ],
    "trackLength": 3000,
    "numberOfObstacles": 3
```

---

## Server → Controllers & Screens

### connectedUsers

- contains array of connected users
- contains character numbers
- on new controller/screen join: sent to screens
- on new controller join: sent to controllers/screens
- on 'selectCharacter': sent to controllers/screens
- on controller disconnect: sent to controllers & screens
- on game reset: sent to controllers & screens

example:

```json
{
  "type": "connectedUsers",
  "users": [
    {
      "id": "xx_xxx",
      "roomId": "XXXX",
      "socketId": "xx_xxx",
      "name": "John",
      "timestamp": 1621423660,
      "active": true,
      "number": 1
    },
    {
      "id": "xx_xxx",
      "roomId": "XXXX",
      "socketId": "xx_xxx",
      "name": "John",
      "timestamp": 1621423662,
      "active": true,
      "number": 2
    }
  ]
}
```

### game2/phaseHasChanged

- send the current round and phase

example:

```json
{
  "type": "game2/phaseHasChanged",
  "round": 1,
  "phase": "results"
}
```

### gameHasStarted

- on 'GameHasStarted' game event
- sent to all controllers & screens in the room
- contains countdown time

example:

```json
{
    "type":"gameHasStarted",
    "roomId":"ABCD"
    "countdownTime": 3,
    "game": "game1"
}
```

### gameHasReset

- on game reset caused by 'backToLobby' message
- sent to all controllers & screens in the room

example:

```json
{
  "type": "gameHasReset"
}
```

### gameHasStopped

- on 'GameHasStopped' game event
- sent to all controllers & screens in the room

example:

```json
{
  "type": "gameHasStopped"
}
```

### gameHasTimedOut

- on 'GameHasTimedOut' game event
- sent to all controllers & screens in the room
- contains 'GameHasFinished' data

example:

```json
{
    "type":"gameHasTimedOut",
    "data": {
        "roomId": "XXXX",
        "gameState": GameState,
        "trackLength": 3000,
        "numberOfObstacles": 3,
        "playerRanks": Array<PlayerRank>,
    }
}
```

### gameHasFinished

- on 'GameHasFinished' game event
- sent to all controllers & screens in the room
- contains 'GameHasFinished' data

example:

```json
{
    "type":"gameHasFinished",
    "data": {
        "roomId": "XXXX",
        "gameState": GameState,
        "trackLength": 3000,
        "numberOfObstacles": 3,
        "playerRanks": Array<PlayerRank>,
    }
}
```

### gameHasPaused

- on 'GameHasPaused' game event
- sent to all controllers & screens in the room
- contains 'GameStateHasChanged' data

example:

```json
{
  "type": "gameHasPaused",
  "data": {
    "roomId": "XXXX"
  }
}
```

### gameHasResumed

- on 'GameHasResumed' game event
- sent to all controllers & screens in the room
- contains 'GameStateHasChanged' data

example:

```json
{
  "type": "gameHasResumed",
  "data": {
    "roomId": "XXXX"
  }
}
```

---

## Server → Controller || Screen

### error

- on error
- sent to individual controller or screen
- communicates different kinds of errors

example:

```json
{
  "type": "error",
  "name": "ErrorName",
  "msg": "Invalid action!"
}
```

---

## Controller → Server

### selectCharacter

- player selects a character (color)
- characterNumber starts at 0

example:

```json
{
  "type": "selectCharacter",
  "characterNumber": 0
}
```

### userReady

- toggle ready state of player

example:

```json
{
  "type": "userReady"
}
```

### gameSet

- send the chosen game

example:

```json
{
    "type": "gameSet",
    "game": "game1'
}
```

### game1/runForward

- player on this controller moves forward

example:

```json
{
  "type": "game1/runForward"
}
```

### game1/obstacleSolved

- tells the game server that the player on this controller solved an obstacle

example:

```json
{
  "type": "game1/obstacleSolved"
}
```

### game1/stunPlayer

- stuns player with given receivingUserId

example:

```json
{
  "type": "game1/stunPlayer",
  "userId": "XXxXX",
  "receivingUserId": "XXxXX"
}
```

### game2/move

- send the move direction
- directions: N,E,S,W,C

example:

```json
{
  "type": "game2/move",
  "userId": "XXxXX",
  "direction": "S",
}
```

### game2/kill

- send the kill event

example:

```json
{
  "type": "game2/kill",
  "userId": "XXxXX"
}
```

### game2/guess

- send the guess of a user

example:

```json
{
  "type": "game2/guess",
  "userId": "XXxXX",
  "guess": 38
}
```

---

## Screen → Server

### pauseResume

- toggles between pause and resume
  - pauses the game if the game is running
  - resumes the game if the game is paused

example:

```json
{
  "type": "pauseResume"
}
```

### stopGame

- stops the game

example:

```json
{
  "type": "stopGame"
}
```

### backToLobby

- resets game (if the screen is admin)
  - invokes 'gameHasReset' message

example:

```json
{
  "type": "backToLobby"
}
```

### startGame

- starts the game (if the screen is admin)

example:

```json
{
  "type": "startGame"
}
```

### sendScreenState

- sends the current state of the admin screen

example:

```json
{
  "type": "sendScreenState",
  "state": "choose-game"
}
```

### chooseGame

- send the game chosen by admin

example:

```json
{
    "type": "chooseGame",
    "game": "game1'
}
```
