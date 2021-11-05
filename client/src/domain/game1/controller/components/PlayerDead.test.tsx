/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import { characters } from '../../../../config/characters';
import { defaultValue, PlayerContext } from '../../../../contexts/PlayerContextProvider';
import theme from '../../../../styles/theme';
import PlayerDead from './PlayerDead';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Character Dead', () => {
    it('renders the dead image', () => {
        const character = characters[0];
        const container = mount(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...defaultValue, character }}>
                    <PlayerDead />
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        expect(container.find('img').prop('src')).toEqual(character.ghost);
    });
});
