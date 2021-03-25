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

import EventEmitter from 'events';

export default class GameEventEmitter extends EventEmitter {
    // private static EventEmitterInstance: GameEventEmitter = new GameEventEmitter()
    // private constructor() {
    //     super()
    // }

    // public static getInstance(): GameEventEmitter {
    //     return this.EventEmitterInstance
    // }
    constructor() {
        super();
    }

    // public static emitGameHasStartedEvent(data: GameHasStarted) {
    //     this.EventEmitterInstance.emit(GameEventTypes.GameHasStarted, data)
    // }

    // public static emitObstacleReachedEvent(data: Obstacle) {
    //     this.EventEmitterInstance.emit(GameEventTypes.ObstacleReached, data)
    // }

    // public static emitGameHasFinishedEvent(data: GameHasFinished) {
    //     this.EventEmitterInstance.emit(GameEventTypes.GameHasFinished, data)
    // }

    // public static emitGameHasStoppedEvent(data: GameHasFinished) {
    //     this.EventEmitterInstance.emit(GameEventTypes.GameHasStopped, data)
    // }

    // public static emitGameHasTimedOutEvent(data: GameHasFinished) {
    //     this.EventEmitterInstance.emit(GameEventTypes.GameHasTimedOut, data)
    // }
}
