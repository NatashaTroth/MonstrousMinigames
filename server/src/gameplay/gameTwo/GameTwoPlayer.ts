import Player from "../Player";
import InitialParameters from "./constants/InitialParameters";
import { Direction } from "./enums/Direction";
import { Guess } from "./interfaces";

class GameTwoPlayer extends Player {
    public direction: string;
    public speed: number;
    public guesses: Guess[];
    constructor(
        public id: string,
        name: string,
        public posX: number,
        public posY: number,
        public killsLeft: number,
        public characterNumber: number
    ) {
        super(id, name, characterNumber);
        this.direction = 'C';
        this.speed = InitialParameters.SPEED;
        this.guesses = [];
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.direction !== Direction.STOP) {
            switch (this.direction) {
                case Direction.UP:
                    if (this.posY > 0) {
                        this.posY -= this.speed;
                    }
                    break;
                case Direction.RIGHT:
                    if (this.posX < InitialParameters.LENGTH_X) {
                        this.posX += this.speed;
                    }
                    break;
                case Direction.DOWN:
                    if (this.posY < InitialParameters.LENGTH_Y) {
                        this.posY += this.speed;
                    }
                    break;
                case Direction.LEFT:
                    if (this.posX > 0) {
                        this.posX -= this.speed;
                    }
                    break;
            }
        }
    }

    public addGuess(round: number, guess: number, actualNumber: number) {
        if (!this.getGuessForRound(round)) {
            const difference = Math.abs(guess - actualNumber);
            this.guesses.push({ round: round, guess: guess, actualNumber: actualNumber, difference: difference });
            return true;
        } else {
            return false;
        }
    }

    public getGuessForRound(round: number) {
        const guessForRound = this.guesses.filter(guess => {
            return guess.round === round;
        })[0];
        if (!guessForRound) {
            return false;
        }
        return guessForRound.guess;
    }

    public setDirection(direction: string) {
        this.direction = direction;
    }
    public setKillsLeft(killsLeft: number) {
        this.killsLeft = killsLeft;
    }
}
export default GameTwoPlayer;
