import 'jest-styled-components';

import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import IconButton from '../common/IconButton';

afterEach(cleanup);
describe('IconButton', () => {
    it('when the button is clicked, it the onClick handler', () => {
        const onClick = jest.fn();
        const { container } = render(<IconButton onClick={onClick}>Test</IconButton>);
        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });
});
