import Parameters from "../constants/Parameters";

export default class Brightness {
    public value: number;
    private interval: NodeJS.Timer | null;

    constructor() {
        this.value = 100;
        this.interval = null;
    }
    private update(): void {
        console.debug(this.value)
        this.value -= Parameters.BRIGHTNESS_STEP;
        if (this.value <= Parameters.BRIGHTNESS_MINIMUM + 1) {
            this.value = Parameters.BRIGHTNESS_MINIMUM;
            this.stop();
        }
    }

    start(reset = true): void {
        console.debug(Parameters.BRIGHTNESS_STEP);
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
            clearInterval(this.interval)
            return true;
        }
        return false;
    }

    private resetValue(): void {
        this.value = 100;
    }
}
