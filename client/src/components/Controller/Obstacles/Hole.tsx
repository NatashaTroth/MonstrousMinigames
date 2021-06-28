/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import Button from '../../common/Button';
import { dragMoveListener, initializeInteractListeners, stoneCounter } from './Draggable';
import { Container, DraggableLeaf, DraggableStone, DropZone, StyledSkipButton } from './Hole.sc';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer } from './ObstaclStyles.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

const Hole: React.FunctionComponent = () => {
    const [skip, setSkip] = React.useState(false);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId } = React.useContext(GameContext);
    const [stonesAndLeafs, setStonesAndLeafs] = React.useState<string[]>([]);
    const [progress, setProgress] = React.useState(0);

    let handleSkip: ReturnType<typeof setTimeout>;

    const solveObstacle = () => {
        controllerSocket.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle?.id });
        setObstacle(roomId, undefined);
        clearTimeout(handleSkip);
    };

    React.useEffect(() => {
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;
        setStonesAndLeafs(['stone', 'stone', 'stone', 'leaf', 'leaf'].sort(() => 0.5 - Math.random()));
        initializeSkip();

        initializeInteractListeners(() => solveObstacle(), setProgress);
    }, []);

    function initializeSkip() {
        handleSkip = setTimeout(() => {
            if (stoneCounter === 0) {
                setSkip(true);
            }
        }, 10000);
    }

    return (
        <ObstacleContainer>
            <LinearProgressBar MAX={3} progress={progress} />
            <Container>
                {stonesAndLeafs.map((item, index) =>
                    item === 'stone' ? (
                        <DraggableStone index={index} key={`draggable${index}`} id="stone" className="drag-drop" />
                    ) : (
                        <DraggableLeaf index={index} key={`draggable${index}`} id="leaf" className="drag-drop" />
                    )
                )}

                <DropZone className="dropzone" />
            </Container>
            {skip && (
                <StyledSkipButton>
                    <Button onClick={solveObstacle}>Skip</Button>
                </StyledSkipButton>
            )}
        </ObstacleContainer>
    );
};

export default Hole;
