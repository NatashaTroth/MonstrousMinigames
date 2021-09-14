// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../../styles/theme';
import { NoPermissions } from './NoPermissions';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('NoPermissions', () => {
    it('does render "You need to give permission to this site"', () => {
        const getPermissions = jest.fn();
        const givenText = 'You need to give permission to this site';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <NoPermissions getMicrophonePermission={getPermissions} getMotionPermission={getPermissions} />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('handed getMicrophonePermission should be called', () => {
        const getMicrophonePermissions = jest.fn();
        const getMotionPermissions = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <NoPermissions
                    getMicrophonePermission={getMicrophonePermissions}
                    getMotionPermission={getMotionPermissions}
                />
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(getMicrophonePermissions).toHaveBeenCalledTimes(1);
        }
    });

    it('handed getMotionPermission should be called', () => {
        const getMicrophonePermissions = jest.fn();
        const getMotionPermissions = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <NoPermissions
                    getMicrophonePermission={getMicrophonePermissions}
                    getMotionPermission={getMotionPermissions}
                />
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(getMotionPermissions).toHaveBeenCalledTimes(1);
        }
    });
});
