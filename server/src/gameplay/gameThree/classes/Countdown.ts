export class Countdown {
    private static instance: Countdown;

    private constructor() {
        //do nothing
    }

    public static getInstance(newInstance = false): Countdown {
        if (!Countdown.instance || newInstance) {
            Countdown.instance = new Countdown();
        }

        return Countdown.instance;
    }

    public countdownTimeLeft = 0;
    public countdownRunning = false;

    initiateCountdown(time: number) {
        this.countdownTimeLeft = time;
        this.countdownRunning = true;
    }

    reduceCountdown(time: number) {
        this.countdownTimeLeft -= time;
    }

    resetCountdown() {
        this.countdownTimeLeft = 0;
        this.countdownRunning = false;
    }
    countdownOver() {
        return this.countdownTimeLeft <= 0;
    }

    update(timeElapsedSinceLastFrame: number) {
        if (this.countdownRunning) {
            this.reduceCountdown(timeElapsedSinceLastFrame);

            if (this.countdownOver()) {
                this.resetCountdown();
            }
        }
    }
}
