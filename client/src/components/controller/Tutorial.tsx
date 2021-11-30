import { History } from "history";
import React from "react";

import { GameNames } from "../../config/games";
import { GameContext } from "../../contexts/GameContextProvider";
import Spider from "../../domain/game1/controller/components/obstacles/Spider";
import Stone from "../../domain/game1/controller/components/obstacles/Stone";
import Trash from "../../domain/game1/controller/components/obstacles/Trash";
import TreeTrunk from "../../domain/game1/controller/components/obstacles/TreeTrunk";
import Windmill from "../../domain/game1/controller/components/Windmill";
import { navigator } from "../../domain/navigator/NavigatorAdapter";
import { ObstacleTypes } from "../../utils/constants";
import { controllerLobbyRoute } from "../../utils/routes";

export type ComponentToTest = ObstacleTypes | 'windmill' | 'finished';

interface TutorialProps {
    history: History;
}

const Tutorial: React.FunctionComponent<TutorialProps> = ({ history }) => {
    const { chosenGame, roomId } = React.useContext(GameContext);
    const [componentToTest, setComponentToTest] = React.useState<ComponentToTest>(ObstacleTypes.treeStump);

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.userSelect = 'none';
    }, []);

    return selectAcutalTutorial({
        chosenGame,
        handleTutorialFinished: (nextComponent: ComponentToTest) =>
            handleTutorialFinished(nextComponent, history, roomId, setComponentToTest),
        componentToTest,
        history,
    });
};

export default Tutorial;

export function handleTutorialFinished(
    nextComponent: ComponentToTest,
    history: History,
    roomId: string | undefined,
    setComponentToTest: (val: ComponentToTest) => void
) {
    if (nextComponent === 'finished') {
        history.push(controllerLobbyRoute(roomId));
        return;
    }

    setComponentToTest(nextComponent);
}

interface SelectAcutalTutorialProps {
    chosenGame: GameNames | undefined;
    handleTutorialFinished: (nextComponent: ComponentToTest) => void;
    componentToTest: ComponentToTest;
    history: History;
}

export function selectAcutalTutorial({
    chosenGame,
    handleTutorialFinished,
    componentToTest,
    history,
}: SelectAcutalTutorialProps) {
    switch (chosenGame) {
        case GameNames.game1:
            return componentToTest === ObstacleTypes.treeStump ? (
                <TreeTrunk tutorial handleTutorialFinished={handleTutorialFinished} />
            ) : componentToTest === ObstacleTypes.spider ? (
                <Spider tutorial handleTutorialFinished={handleTutorialFinished} navigator={navigator} />
            ) : componentToTest === ObstacleTypes.trash ? (
                <Trash tutorial handleTutorialFinished={handleTutorialFinished} />
            ) : componentToTest === ObstacleTypes.stone ? (
                <Stone tutorial handleTutorialFinished={handleTutorialFinished} history={history} />
            ) : componentToTest === 'windmill' ? (
                <Windmill tutorial handleTutorialFinished={handleTutorialFinished} />
            ) : (
                <div>Finished</div>
            );
        default:
            return null;
    }
}
