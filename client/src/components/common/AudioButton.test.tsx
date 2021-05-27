import 'jest-styled-components';

import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import audioIcon from '../../images/audio.svg';
import audioMutedIcon from '../../images/audioMuted.svg';
import AudioButton from './AudioButton';

afterEach(cleanup);
describe('AudioButton', () => {
    //TODO
    it('renders an image', () => {
        const { container } = render(<AudioButton playing={true} permission={true} volume={0.2}></AudioButton>);
        expect(container.querySelectorAll('img')).toHaveProperty('length', 1);
    });
    it('renders an audio image when playing is true', () => {
        const { container } = render(<AudioButton playing={true} permission={true} volume={0.2}></AudioButton>);
        const src = container.querySelector('img')?.src;
        expect(src).toEqual(expect.stringContaining(audioIcon.split('"')[1]));
    });
    it('renders an audioMuted image when playing is false', () => {
        const { container } = render(<AudioButton playing={false} permission={true} volume={0.2}></AudioButton>);
        const src = container.querySelector('img')?.src;
        expect(src).toEqual(expect.stringContaining(audioMutedIcon.split('"')[1]));
    });
    it('renders an audio image when permission is true', () => {
        const { container } = render(<AudioButton playing={true} permission={true} volume={0.2}></AudioButton>);
        const src = container.querySelector('img')?.src;
        expect(src).toEqual(expect.stringContaining(audioIcon.split('"')[1]));
    });
    it('renders an audioMuted image when permission is false', () => {
        const { container } = render(<AudioButton playing={true} permission={false} volume={0.2}></AudioButton>);
        const src = container.querySelector('img')?.src;
        expect(src).toEqual(expect.stringContaining(audioMutedIcon.split('"')[1]));
    });
    it('renders an audioMuted image when volume is 0', () => {
        const { container } = render(<AudioButton playing={true} permission={true} volume={0}></AudioButton>);
        const src = container.querySelector('img')?.src;
        expect(src).toEqual(expect.stringContaining(audioMutedIcon.split('"')[1]));
    });
    // it('when disabled prop is given, a disabled button is rendered', () => {
    //     const givenText = 'A Button';
    //     const { getByText } = render(
    //         <AudioButton playing={true} permission={true} disabled>
    //             {givenText}
    //         </AudioButton>
    //     );
    //     expect(getByText(/A Button/i).closest('button')?.disabled).toBeTruthy();
    // });
    it('when the button is clicked, it the onClick handler', () => {
        const onClick = jest.fn();
        const { container } = render(
            <AudioButton playing={true} permission={true} onClick={onClick} volume={0.2}></AudioButton>
        );
        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });
});
