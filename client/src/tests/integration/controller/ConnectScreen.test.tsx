// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { createMemoryHistory } from 'history';
import React from 'react';

import { ConnectScreen } from '../../../components/controller/ConnectScreen';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('ConnectScreen', () => {
    it('roomId from history should be persisted to storage', () => {
        const history = createMemoryHistory();
        const roomId = 'ABCD';
        history.push(`/${roomId}`);

        mount(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(global.sessionStorage.getItem('roomId')).toBe(roomId);
    });
});
