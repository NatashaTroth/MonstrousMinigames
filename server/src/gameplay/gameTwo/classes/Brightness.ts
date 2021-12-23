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
        if (this.value <= Parameters.BRIGHTNESS_MINIMUM) {
            this.value = Parameters.BRIGHTNESS_MINIMUM;
            this.stop();
        }
    }

    start(reset = true): void {
        if (reset) {
            this.resetValue();
            setTimeout(() => {
                this.interval = setInterval(() => this.update(), Parameters.BRIGHTNESS_INTERVAL);

            }, Parameters.BRIGHTNESS_TIMEOUT);
        } else {
            this.interval = setInterval(() => this.update(), Parameters.BRIGHTNESS_INTERVAL);
        }
    }

    stop(): boolean {
        if (this.interval) {
            clearInterval(this.interval);
            return true;
        }
        return false;
    }

    private resetValue(): void {
        this.value = 100;
    }
}
