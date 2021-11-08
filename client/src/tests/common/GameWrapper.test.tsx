import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';

import GameWrapper from './GameWrapper';

afterEach(cleanup);

describe('GameWrapper', () => {
    it('renders given children', () => {
        const givenText = 'Game1';
        const { container } = render(
            <GameWrapper>
                <div>{givenText}</div>
            </GameWrapper>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
