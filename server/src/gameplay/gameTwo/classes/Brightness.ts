import Parameters from "../constants/Parameters";

export default class Brightness {
    public value: number;
    private interval: NodeJS.Timer | null;

    constructor() {
        this.value = 100;
        this.interval = null;
    }
    protected update(): void {
        this.value -= Parameters.BRIGHTNESS_STEP;
        if (this.value <= 0) {
            this.value = 0;
            this.stop();
        }
    }

    start(): void {
        this.resetValue();
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

    resetValue(): void {
        this.value = 100;
    }
}
