import 'jest-styled-components';

import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { SkipButton } from '../../../components/controller/SkipButton.sc';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('SkipButton', () => {
    it('skip button should have z-index 2', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <SkipButton />
            </ThemeProvider>
        );

        expect(container.find('div')).toHaveStyleRule('z-index', '2');
    });
});
