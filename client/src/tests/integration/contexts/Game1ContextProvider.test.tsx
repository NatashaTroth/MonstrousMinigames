import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import React from 'react';

import Game1ContextProvider from '../../../contexts/game1/Game1ContextProvider';
import ShakeInstruction from '../../../domain/game1/controller/components/ShakeInstruction';
import { LocalStorageFake } from '../storage/LocalFakeStorage';

configure({ adapter: new Adapter() });
describe('Game1ContextProvider', () => {
    it('should provide default value for hasStone to ShakeInstructions', async () => {
        const container = shallow(
            <Game1ContextProvider>
                <ShakeInstruction sessionStorage={new LocalStorageFake()} />
            </Game1ContextProvider>
        );

        expect(container.findWhere(node => node.text() === 'Click to use collected stone')).toHaveLength(0);
    });
});
