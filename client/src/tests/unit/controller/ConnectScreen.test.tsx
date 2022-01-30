// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { ConnectScreen, IFrameContent } from '../../../components/controller/ConnectScreen';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('ConnectScreen', () => {
    it('renders an iframe', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(container.find('iframe')).toBeTruthy();
    });
});

describe('IFrameContent', () => {
    it('renders two inputs if no room code is in pathname', () => {
        const formState = { name: '', roomId: '' };
        const container = mount(
            <ThemeProvider theme={theme}>
                <IFrameContent roomId={null} setFormState={jest.fn()} formState={formState} />
            </ThemeProvider>
        );

        expect(container.find('input')).toHaveLength(2);
    });
});
