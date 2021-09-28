/* eslint-disable react-hooks/exhaustive-deps */
import interact from 'interactjs';
import * as React from 'react';

import Button from '../../../../../components/common/Button';
import { ControllerSocketContext } from '../../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../../contexts/PlayerContextProvider';
import food from '../../../../../images/obstacles/trash/food.svg';
import paper from '../../../../../images/obstacles/trash/paper.svg';
import plastic from '../../../../../images/obstacles/trash/plastic.svg';
import { MessageTypes, TrashType } from '../../../../../utils/constants';
import { dragMoveListener, initializeInteractListeners, itemCounter } from './Draggable';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer, ObstacleInstructions } from './ObstacleStyles.sc';
import { Container, Draggable, DropZone, StyledImage, StyledSkipButton } from './Trash.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

const Trash: React.FunctionComponent = () => {
    const [skip, setSkip] = React.useState(false);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const [randomArray, setRandomArray] = React.useState<TrashType[]>([]);
    const [progress, setProgress] = React.useState(0);

    const items: TrashType[] = [TrashType.Paper, TrashType.Food, TrashType.Plastic];

    let handleSkip: ReturnType<typeof setTimeout>;

    const solveObstacle = () => {
        controllerSocket.emit({ type: MessageTypes.obstacleSolved, obstacleId: obstacle?.id });
        setObstacle(roomId, undefined);
        interact('.dropzone').unset();
        interact('.drag-drop').unset();
        clearTimeout(handleSkip);
    };

    React.useEffect(() => {
        let mounted = true;
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;
        const remainingTypes = items.filter(item => item !== obstacle?.trashType);

        const generatedRandomArray = [
            ...Array.from(
                { length: 5 - (obstacle?.numberTrashItems || 0) },
                () => remainingTypes[Math.floor(Math.random() * 2)]
            ),
            ...Array(obstacle?.numberTrashItems).fill(obstacle?.trashType),
        ].sort(() => 0.5 - Math.random());

        setRandomArray(generatedRandomArray);

        initializeSkip();

        initializeInteractListeners(
            obstacle!.trashType!,
            obstacle!.numberTrashItems!,
            () => {
                if (mounted) {
                    solveObstacle();
                }
            },
            p => {
                if (mounted) {
                    setProgress(p);
                }
            }
        );

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

    return (
        <>
            <ObstacleContainer>
                <LinearProgressBar MAX={obstacle?.numberTrashItems} progress={progress} />
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

                    {obstacle?.trashType && <DropZone className="dropzone" variant={obstacle.trashType} />}
                </Container>
                {skip && (
                    <StyledSkipButton>
                        <Button onClick={solveObstacle}>Skip</Button>
                    </StyledSkipButton>
                )}
            </ObstacleContainer>
        </>
    );
};

export default Trash;
