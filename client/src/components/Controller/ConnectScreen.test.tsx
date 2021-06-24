import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from '../../theme';
import { ConnectScreen } from './ConnectScreen';

afterEach(cleanup);
configure({ adapter: new Adapter() });
describe('Controller ConnectScreen', () => {
    const history = createMemoryHistory({ initialEntries: ['/ABCD'] });

    it('renders one iframe html tag', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <ConnectScreen history={history} />
                </Router>
            </ThemeProvider>
        );
        expect(container.querySelectorAll('iframe')).toHaveProperty('length', 1);
    });

    it('should render Enter button', () => {
        const givenText = 'Enter';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <ConnectScreen history={history} />
                </Router>
            </ThemeProvider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
