// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import { GameToScreenMapper } from '../../../domain/phaser/game1/GameToScreenMapper';

afterEach(cleanup);

describe('GameToScreenMapper Game1', () => {
    it('result of mapGameMeasurementToScreen should be 25 * value', () => {
        const mapper = new GameToScreenMapper(10, 500);

        expect(mapper.mapGameMeasurementToScreen(200)).toEqual(200 * 25);
    });
});
