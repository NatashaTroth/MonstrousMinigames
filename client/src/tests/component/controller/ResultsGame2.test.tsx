// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import Results from '../../../domain/game2/controller/components/Results';
import theme from '../../../styles/theme';
import { LocalStorageFake } from '../../integration/storage/LocalFakeStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Results', () => {
    const sessionStorage = new LocalStorageFake();
    const hint = 'almost correct';
    sessionStorage.setItem('guessHint', hint);

    it('reminds user to enter a guess', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Results />
            </ThemeProvider>
        );

        expect(queryByText(container, "Don't forget to enter a guess")).toBeTruthy();
    });
});
