import Brightness from "../../../../src/gameplay/gameTwo/classes/Brightness";
import Parameters from "../../../../src/gameplay/gameTwo/constants/Parameters";

let brightness: Brightness;
describe('Brightness Tests', () => {
    beforeEach(() => {
        brightness = new Brightness();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should have an initial value of 100', () => {
        expect(brightness.value).toEqual(100);
    });

    it('stop should return false if there is no interval set', () => {
        expect(brightness.stop()).toBeFalsy();
    });

    it('stop should return true if the interval is cleared', () => {
        jest.useFakeTimers()
        brightness.start();
        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 10)
        expect(brightness.stop()).toBeTruthy();
    });

    it('value should be smaller 100 after interval started', () => {
        jest.useFakeTimers();
        brightness.start();
        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 10);
        expect(brightness.value).toBeLessThan(100);
    });

    it('value should stay the same after interval is stopped', () => {
        jest.useFakeTimers()
        brightness.start();
        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 10);
        brightness.stop();
        const value = brightness.value;
        jest.advanceTimersByTime(1000)

        expect(brightness.value).toEqual(value);
    });

    it('value should should be 100 again after next start', () => {
        jest.useFakeTimers();
        brightness.start();
        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 10);
        brightness.stop();
        jest.advanceTimersByTime(100);
        brightness.start();

        expect(brightness.value).toEqual(100);
    });

    it('should not have a timeout after resuming', () => {
        jest.useFakeTimers();
        brightness.start();
        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 10);
        brightness.stop();
        const value = brightness.value;
        jest.advanceTimersByTime(100);
        brightness.start(false);
        jest.advanceTimersByTime(100);

        expect(brightness.value).toBeLessThan(value);
    });

    it('value should should be 0 again at the end', () => {
        jest.useFakeTimers();
        brightness.start();

        jest.advanceTimersByTime(Parameters.BRIGHTNESS_TIMEOUT + 100000);

        expect(brightness.value).toEqual(0);
    });
});