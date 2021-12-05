import Parameters from "../constants/Parameters";

export default class Brightness {
    public brightness: number;
    constructor() {
        this.brightness = 100;
    }
    update(): void {
        this.brightness -= Parameters.BRIGHTNESS_STEP;
    }
}
