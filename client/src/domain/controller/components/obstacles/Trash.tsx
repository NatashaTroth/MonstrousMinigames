/* eslint-disable react-hooks/exhaustive-deps */

import interact from 'interactjs';
import * as React from 'react';

import Button from '../../../../components/common/Button';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import food from '../../../../images/obstacles/trash/food.svg';
import paper from '../../../../images/obstacles/trash/paper.svg';
import plastic from '../../../../images/obstacles/trash/plastic.svg';
import { dragMoveListener, initializeInteractListeners, itemCounter } from './Draggable';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer } from './ObstaclStyles.sc';
import { Container, Draggable, DropZone, StyledImage, StyledSkipButton } from './Trash.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

let MAX = 0;

export type TrashType = 'paper' | 'food' | 'plastic';

const Trash: React.FunctionComponent = () => {
    const [skip, setSkip] = React.useState(false);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const [randomArray, setRandomArray] = React.useState<number[]>([]);
    const [actualItem, setActualItem] = React.useState<TrashType | undefined>();
    const [progress, setProgress] = React.useState(0);

    const items: TrashType[] = ['paper', 'food', 'plastic'];

    let handleSkip: ReturnType<typeof setTimeout>;

    const solveObstacle = () => {
        controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle?.id });
        setObstacle(roomId, undefined);
        interact('.dropzone').unset();
        interact('.drag-drop').unset();
        clearTimeout(handleSkip);
    };

    React.useEffect(() => {
        let mounted = true;
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;

        const actualItem = Math.floor(Math.random() * 3);
        setActualItem(items[actualItem]);

        const generatedRandomArray = [
            ...Array.from({ length: 2 }, () => Math.floor(Math.random() * 3)),
            ...Array(3).fill(actualItem),
        ].sort(() => 0.5 - Math.random());

        setRandomArray(generatedRandomArray);

        const counter = generatedRandomArray.filter(item => item === actualItem).length;
        MAX = counter;

        initializeSkip();

        initializeInteractListeners(
            items[actualItem],
            counter,
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
                <LinearProgressBar MAX={MAX} progress={progress} />
                <Container>
                    {randomArray.map((item, index) => {
                        switch (items[item]) {
                            case 'paper':
                                return (
                                    <Draggable index={index} key={`draggable${index}`} id="paper" className="drag-drop">
                                        <StyledImage src={paper} />
                                    </Draggable>
                                );
                            case 'food':
                                return (
                                    <Draggable index={index} key={`draggable${index}`} id="food" className="drag-drop">
                                        <StyledImage src={food} />
                                    </Draggable>
                                );
                            case 'plastic':
                                return (
                                    <Draggable
                                        index={index}
                                        key={`draggable${index}`}
                                        id="plastic"
                                        className="drag-drop"
                                    >
                                        <StyledImage src={plastic} />
                                    </Draggable>
                                );
                        }
                    })}

                    {actualItem && <DropZone className="dropzone" variant={actualItem} />}
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
