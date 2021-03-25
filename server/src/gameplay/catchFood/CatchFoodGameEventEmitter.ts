// export class old{
//   eventEmitter :
//   public static EventEmitterInstance: EventEmitter = new EventEmitter();
//   private constructor(){
//     this.eventEmitter = require('events');

//   }
// }

// const myEmitter = new MyEmitter();
// myEmitter.on('event', (a, b) => {
//   setImmediate(() => {
//     console.log('this happens asynchronously');
//   });
// });
// myEmitter.emit('event', 'a', 'b');



import GameEventEmitter from '../../classes/GameEventEmitter';
import { GameEventTypes } from '../interfaces';
import {
    GameHasFinished, GameHasStarted, GameHasStopped, ObstacleReachedInfo, PlayerHasFinished
} from './interfaces/GameEvents';

export default class CatchFoodGameEventEmitter extends GameEventEmitter {
    private static CatchFoodGameEventEmitter: CatchFoodGameEventEmitter = new CatchFoodGameEventEmitter()
    private constructor() {
        super()
    }

    public static getInstance(): CatchFoodGameEventEmitter {
        return this.CatchFoodGameEventEmitter
    }

    public static emitGameHasStartedEvent(data: GameHasStarted) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasStarted, data)
    }

    public static emitObstacleReachedEvent(data: ObstacleReachedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.ObstacleReached, data)
    }

    public static emitPlayerHasFinishedEvent(data: PlayerHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasFinished, data)
    }

    public static emitGameHasFinishedEvent(data: GameHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasFinished, data)
    }

    public static emitGameHasStoppedEvent(data: GameHasStopped) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasStopped)
    }

    public static emitGameHasTimedOutEvent(data: GameHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasTimedOut, data)
    }
}
