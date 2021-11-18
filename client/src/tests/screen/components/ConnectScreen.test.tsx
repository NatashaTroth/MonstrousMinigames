import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ConnectScreen } from '../../../components/screen/ConnectScreen';
import { defaultValue as screenDefaultValue, ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);
describe('Screen ConnectScreen', () => {
    const socket = new InMemorySocketFake();
    const ConnectScreenComponent = (
        <ThemeProvider theme={theme}>
            <ScreenSocketContext.Provider value={{ ...screenDefaultValue, screenSocket: socket }}>
                <ConnectScreen />
            </ScreenSocketContext.Provider>
        </ThemeProvider>
    );

    // TODO
    xit('renders given button labels', () => {
        const buttonLabels = ['Create New Room', 'Join Room', 'About', 'Credits', 'Settings'];
        const container = shallow(ConnectScreenComponent);
        buttonLabels.forEach(label => {
            expect(container.find(label)).toBeTruthy();
        });
    });
});
