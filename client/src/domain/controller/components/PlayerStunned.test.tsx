/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import { defaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import theme from '../../../styles/theme';
import { characters } from '../../../utils/characters';
import PlayerStunned from './PlayerStunned';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Character Stunned', () => {
    it('renders the stunned image', () => {
        const character = characters[0];
        const container = mount(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...defaultValue, character }}>
                    <PlayerStunned />
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        expect(container.find('img').prop('src')).toEqual(character.stunned);
    });
});
