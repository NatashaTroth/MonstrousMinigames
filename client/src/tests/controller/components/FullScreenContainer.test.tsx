import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';

import FullScreenContainer from '../../../components/common/FullScreenContainer';

afterEach(cleanup);
describe('FullScreenContainer', () => {
    it('renders given children', () => {
        const givenText = 'Fullscreen';
        const { container } = render(
            <FullScreenContainer>
                <div>{givenText}</div>
            </FullScreenContainer>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
