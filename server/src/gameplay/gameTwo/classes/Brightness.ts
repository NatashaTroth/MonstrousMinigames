import Parameters from "../constants/Parameters";

export default class Brightness {
    public value: number;
    private interval: NodeJS.Timer | null;

    constructor() {
        this.value = 100;
        this.interval = null;
    }
    private update(): void {
        this.value -= Parameters.BRIGHTNESS_STEP;
        if (this.interval && this.value >= 0) {
            this.stop();
        }
    }

    start(): void {
        setTimeout(() => {
            this.interval = setInterval(() => this.update(), Parameters.BRIGHTNESS_INTERVAL);

        }, Parameters.BRIGHTNESS_TIMEOUT);
    }


    stop(): boolean {
        if (this.interval) {
            clearInterval(this.interval)
            return true;
        }
        return false;
    }
}
