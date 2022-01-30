import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { createMemoryHistory } from 'history';

import { handleTutorialFinished, selectAcutalTutorial } from '../../../components/controller/Tutorial';
import { GameNames } from '../../../config/games';
import { ObstacleTypes } from '../../../utils/constants';
import { controllerLobbyRoute } from '../../../utils/routes';

configure({ adapter: new Adapter() });

describe('handleTutorialFinished', () => {
    const history = createMemoryHistory();

    it('should call handed setComponentToTest', () => {
        const nextComponent = ObstacleTypes.treeStump;
        const roomId = 'ADFS';
        const setComponentToTest = jest.fn();
        handleTutorialFinished(nextComponent, history, roomId, setComponentToTest);

        expect(setComponentToTest).toHaveBeenCalledTimes(1);
    });

    it('should reroute to controllerLobbyRoute if tutorial is finished', () => {
        const nextComponent = 'finished';
        const roomId = 'ADFS';
        const setComponentToTest = jest.fn();
        handleTutorialFinished(nextComponent, history, roomId, setComponentToTest);

        expect(history.location).toHaveProperty('pathname', controllerLobbyRoute(roomId));
    });
});

describe('selectAcutalTutorial', () => {
    const handleTutorialFinished = jest.fn();
    const componentToTest = ObstacleTypes.treeStump;
    const history = createMemoryHistory();

    it('should return null if no game was chosen', () => {
        const chosenGame = undefined;
        const result = selectAcutalTutorial({ chosenGame, componentToTest, handleTutorialFinished, history });
        expect(result).toEqual(null);
    });

    it('should return null if chosen game is not game1', () => {
        const chosenGame = GameNames.game3;
        const result = selectAcutalTutorial({ chosenGame, componentToTest, handleTutorialFinished, history });
        expect(result).toEqual(null);
    });
});
