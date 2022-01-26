// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { GameToScreenMapper } from '../../domain/phaser/game2/GameToScreenMapper';

afterEach(cleanup);

//gameWidth: number, private windowWidth: number, private gameHeight: number, windowHeight: number
describe('GameToScreenMapper Game2', () => {
    const gameWidth = 500;
    const windowWidth = 600;
    const gameHeight = 300;
    const windowHeight = 350;
    const screenPercentageOfGameWidth = (1 / gameWidth) * (windowWidth * (1 - 0.05));

    it('mapGameXMeasurementToScreen', () => {
        const mapper = new GameToScreenMapper(gameWidth, windowWidth, gameHeight, windowHeight);
        const xMeasurement = 200 * screenPercentageOfGameWidth + (windowWidth * 0.05) / 3;
        expect(mapper.mapGameXMeasurementToScreen(200)).toEqual(xMeasurement);
    });

    it('mapGameYMeasurementToScreen', () => {
        const mapper = new GameToScreenMapper(gameWidth, windowWidth, gameHeight, windowHeight);
        const yMeasurement = 200 * screenPercentageOfGameWidth + mapper.getScreenYOffset();
        //return value * this.screenPercentageOfGameWidth + this.getScreenYOffset();
        // expected: 200 * 1.14 + screenYOffset
        expect(mapper.mapGameYMeasurementToScreen(200)).toEqual(yMeasurement);
    });

    it('getScreenYOffset', () => {
        const mapper = new GameToScreenMapper(gameWidth, windowWidth, gameHeight, windowHeight);
        const offset = window.innerHeight - mapper.getMappedGameHeight() - mapper.heightPadding;
        expect(mapper.getScreenYOffset()).toEqual(offset);
    });

    it('getMappedGameHeight', () => {
        const mapper = new GameToScreenMapper(gameWidth, windowWidth, gameHeight, windowHeight);
        const mappedHeight = mapper.mapGameXMeasurementToScreen(300);
        expect(mapper.getMappedGameHeight()).toEqual(mappedHeight);
    });
});
