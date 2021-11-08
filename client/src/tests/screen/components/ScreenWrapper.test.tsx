import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';

import ScreenWrapper from '../../../components/screen/ScreenWrapper';

afterEach(cleanup);

describe('ScreenWrapper', () => {
    it('renders given children', () => {
        const givenText = 'Game1';
        const { container } = render(
            <ScreenWrapper>
                <div>{givenText}</div>
            </ScreenWrapper>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
