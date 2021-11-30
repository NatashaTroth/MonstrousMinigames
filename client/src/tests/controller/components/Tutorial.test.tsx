import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import { createMemoryHistory } from "history";
import React from "react";
import { ThemeProvider } from "styled-components";

import Tutorial, {
    handleTutorialFinished, selectAcutalTutorial
} from "../../../components/controller/Tutorial";
import { GameNames } from "../../../config/games";
import { defaultValue, GameContext } from "../../../contexts/GameContextProvider";
import TreeTrunk from "../../../domain/game1/controller/components/obstacles/TreeTrunk";
import theme from "../../../styles/theme";
import { ObstacleTypes } from "../../../utils/constants";
import { controllerLobbyRoute } from "../../../utils/routes";

configure({ adapter: new Adapter() });

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

describe('Tutorial', () => {
    const history = createMemoryHistory();

    it('should render TreeTrunk', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, chosenGame: GameNames.game1 }}>
                    <Tutorial history={history} />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(TreeTrunk).length).toBe(1);
    });
});

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
