// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { Settings, VolumeOff, VolumeUp } from '@material-ui/icons';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import MasterHeader from '../../../components/common/MasterHeader';
import { defaultValue, MyAudioContext } from '../../../contexts/AudioContextProvider';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('MasterHeader', () => {
    it('renders an Settings Icon', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <MasterHeader history={history} />
            </ThemeProvider>
        );

        expect(container.find(Settings)).toBeTruthy();
    });

    it('renders an Volume Up Icon when music is playing', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <MyAudioContext.Provider value={{ ...defaultValue, isPlaying: true }}>
                    <MasterHeader history={history} />
                </MyAudioContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(VolumeUp)).toBeTruthy();
    });

    it('renders an Volume Off Icon when music is playing', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <MyAudioContext.Provider value={{ ...defaultValue, isPlaying: false }}>
                    <MasterHeader history={history} />
                </MyAudioContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(VolumeOff)).toBeTruthy();
    });
});
