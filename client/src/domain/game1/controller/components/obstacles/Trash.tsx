/* eslint-disable react-hooks/exhaustive-deps */
import interact from "interactjs";
import * as React from "react";

import Button from "../../../../../components/common/Button";
import { ComponentToTest } from "../../../../../components/controller/Tutorial";
import { ControllerSocketContext } from "../../../../../contexts/ControllerSocketContextProvider";
import { Game1Context, Obstacle } from "../../../../../contexts/game1/Game1ContextProvider";
import { GameContext } from "../../../../../contexts/GameContextProvider";
import food from "../../../../../images/obstacles/trash/food.svg";
import paper from "../../../../../images/obstacles/trash/paper.svg";
import plastic from "../../../../../images/obstacles/trash/plastic.svg";
import { MessageTypesGame1, ObstacleTypes, TrashType } from "../../../../../utils/constants";
import { Socket } from "../../../../socket/Socket";
import { dragMoveListener, initializeInteractListeners, itemCounter } from "./Draggable";
import LinearProgressBar from "./LinearProgressBar";
import { ObstacleContainer, ObstacleInstructions } from "./ObstacleStyles.sc";
import { Container, Draggable, DropZone, StyledImage, StyledSkipButton } from "./Trash.sc";

const tutorialObstacle = {
    id: 1,
    type: ObstacleTypes.trash,
    trashType: TrashType.Plastic,
    numberTrashItems: 3,
};
interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

interface TrashProps {
    tutorial?: boolean;
    handleTutorialFinished?: (val: ComponentToTest) => void;
}

const Trash: React.FunctionComponent<TrashProps> = ({ tutorial = false, handleTutorialFinished }) => {
    const [skip, setSkip] = React.useState(false);
    const { obstacle, setObstacle } = React.useContext(Game1Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const [randomArray, setRandomArray] = React.useState<TrashType[]>([]);
    const [progress, setProgress] = React.useState(0);

    let handleSkip: ReturnType<typeof setTimeout>;

    const obstacleToUse = tutorial ? tutorialObstacle : obstacle;

    React.useEffect(() => {
        let mounted = true;
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;

        if (obstacleToUse && obstacleToUse.trashType && obstacleToUse.numberTrashItems) {
            setRandomArray(generateRandomArray(obstacleToUse));

            initializeSkip();

            initializeInteractListeners(
                obstacleToUse.trashType!,
                obstacleToUse.numberTrashItems!,
                () => {
                    if (mounted) {
                        if (tutorial) {
                            handleTutorialFinished?.(ObstacleTypes.stone);
                        } else {
                            solveObstacle({
                                controllerSocket,
                                obstacle: obstacleToUse,
                                setObstacle,
                                roomId,
                                clearTimeout,
                                handleSkip,
                            });
                        }
                    }
                },
                p => {
                    if (mounted) {
                        setProgress(p);
                    }
                }
            );
        }

        return () => {
            mounted = false;
        };
    }, []);

    function initializeSkip() {
        handleSkip = setTimeout(() => {
            if (itemCounter === 0) {
                setSkip(true);
            }
        }, 10000);
    }

    const handleSolveObstacle = () => {
        solveObstacle({
            controllerSocket,
            obstacle: obstacleToUse,
            setObstacle,
            roomId,
            clearTimeout,
            handleSkip,
        });
    };

    return (
        <>
            <ObstacleContainer>
                <LinearProgressBar MAX={obstacleToUse?.numberTrashItems} progress={progress} />
                <ObstacleInstructions>
                    Put the right trash in the garbage can to get the forest clean again
                </ObstacleInstructions>
                <Container>
                    {randomArray.map((item, index) => {
                        switch (item) {
                            case TrashType.Paper:
                                return (
                                    <Draggable
                                        index={index}
                                        key={`draggable${index}`}
                                        id={TrashType.Paper}
                                        className="drag-drop"
                                    >
                                        <StyledImage src={paper} />
                                    </Draggable>
                                );
                            case TrashType.Food:
                                return (
                                    <Draggable
                                        index={index}
                                        key={`draggable${index}`}
                                        id={TrashType.Food}
                                        className="drag-drop"
                                    >
                                        <StyledImage src={food} />
                                    </Draggable>
                                );
                            case TrashType.Plastic:
                                return (
                                    <Draggable
                                        index={index}
                                        key={`draggable${index}`}
                                        id={TrashType.Plastic}
                                        className="drag-drop"
                                    >
                                        <StyledImage src={plastic} />
                                    </Draggable>
                                );
                        }
                    })}
                    {obstacleToUse?.trashType && <DropZone className="dropzone" variant={obstacleToUse.trashType} />}
                </Container>
                {skip && (
                    <StyledSkipButton>
                        <Button onClick={handleSolveObstacle}>Skip</Button>
                    </StyledSkipButton>
                )}
            </ObstacleContainer>
        </>
    );
};

export default Trash;

export function generateRandomArray(obstacle: Obstacle) {
    const items: TrashType[] = [TrashType.Paper, TrashType.Food, TrashType.Plastic];

    const remainingTypes = items.filter(item => item !== obstacle.trashType);

    return [
        ...Array.from(
            { length: 5 - (obstacle.numberTrashItems || 0) },
            () => remainingTypes[Math.floor(Math.random() * 2)]
        ),
        ...Array(obstacle.numberTrashItems).fill(obstacle.trashType),
    ].sort(() => 0.5 - Math.random());
}

interface SolveObstacle {
    controllerSocket: Socket;
    obstacle: Obstacle | undefined;
    roomId: string | undefined;
    setObstacle: (roomId: string | undefined, obstacle: Obstacle | undefined) => void;
    clearTimeout: (val: ReturnType<typeof setTimeout>) => void;
    handleSkip: ReturnType<typeof setTimeout>;
}
export const solveObstacle = (props: SolveObstacle) => {
    const { controllerSocket, obstacle, setObstacle, roomId, clearTimeout, handleSkip } = props;

    controllerSocket.emit({ type: MessageTypesGame1.obstacleSolved, obstacleId: obstacle?.id });
    setObstacle(roomId, undefined);
    interact('.dropzone').unset();
    interact('.drag-drop').unset();
    clearTimeout(handleSkip);
};
