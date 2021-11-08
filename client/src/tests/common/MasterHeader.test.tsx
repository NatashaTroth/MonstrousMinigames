// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { Settings, VolumeOff, VolumeUp } from '@material-ui/icons';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { AudioContext, defaultValue } from '../../contexts/AudioContextProvider';
import history from '../../domain/history/history';
import theme from '../../styles/theme';
import MasterHeader from './MasterHeader';

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
                <AudioContext.Provider value={{ ...defaultValue, musicIsPlaying: true }}>
                    <MasterHeader history={history} />
                </AudioContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(VolumeUp)).toBeTruthy();
    });

    it('renders an Volume Off Icon when music is playing', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <AudioContext.Provider value={{ ...defaultValue, musicIsPlaying: false }}>
                    <MasterHeader history={history} />
                </AudioContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(VolumeOff)).toBeTruthy();
    });

    it('redirects to settings when settings icon is clicked', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <AudioContext.Provider value={{ ...defaultValue, musicIsPlaying: false }}>
                    <MasterHeader history={history} />
                </AudioContext.Provider>
            </ThemeProvider>
        );

        container.find('button').first().simulate('click');

        expect(history.location).toHaveProperty('pathname', `/settings`);
    });

    it('redirects to settings when settings icon is clicked', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <AudioContext.Provider value={{ ...defaultValue, musicIsPlaying: false }}></AudioContext.Provider>
                <MasterHeader history={history} />
            </ThemeProvider>
        );

        container.find('button').first().simulate('click');

        expect(history.location).toHaveProperty('pathname', `/settings`);
    });
});
