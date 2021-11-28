/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { dragMoveListener } from '../../../domain/game1/controller/components/obstacles/Draggable';

configure({ adapter: new Adapter() });

afterEach(cleanup);

// TODO
describe('dragMoveListener function', () => {
    it('renders LinearProgressBar', () => {
        const getAttribute = jest.fn();
        const setAttribute = jest.fn();
        const event = {
            target: {
                style: {
                    transform: '',
                },
                getAttribute,
                setAttribute,
            },
            dx: 10,
            dy: 10,
        };
        dragMoveListener(event);

        expect(getAttribute).toHaveBeenCalledTimes(2);
    });
});
