/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { createMemoryHistory } from 'history';

import { chooseCharacterClick } from '../../../components/controller/ChooseCharacter';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('chooseCharacterClick', () => {
    const props = {
        controllerSocket: new FakeInMemorySocket(),
        setCharacter: jest.fn(),
        roomId: 'EDFS',
        actualCharacter: 0,
        history: createMemoryHistory(),
        characterIndex: -1,
    };

    it('should emit new character number to socket', () => {
        const controllerSocket = new FakeInMemorySocket();

        chooseCharacterClick({ ...props, controllerSocket });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypes.selectCharacter,
                characterNumber: props.actualCharacter,
            },
        ]);
    });
});
