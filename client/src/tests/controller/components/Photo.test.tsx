import { queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Photo from '../../../domain/game3/screen/components/Photo';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

describe('Photo', () => {
    const url = 'url';
    const id = 24534;
    const votingResult = 3;

    it('should render image with given src', () => {
        const url = 'url';
        const container = mount(
            <ThemeProvider theme={theme}>
                <Photo url={url} />
            </ThemeProvider>
        );

        expect(container.find('img').prop('src')).toEqual(url);
    });

    it('renders given id', () => {
        const givenText = `${id}`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Photo url={url} id={id} />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders votingResults', () => {
        const givenText = `+ ${votingResult}`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Photo url={url} id={id} votingResult={votingResult} />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
