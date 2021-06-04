import * as React from 'react';

import { dragMoveListener, initializeInteractListeners } from './Draggable';
import { Container, DraggableLeaf, DraggableStone, DropZone } from './Hole.sc';
import { ObstacleContainer } from './ObstaclStyles.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

const Hole: React.FunctionComponent = () => {
    React.useEffect(() => {
        const w = window as WindowProps;
        // this function is used later in the resizing and gesture demos
        w.dragMoveListener = dragMoveListener;

        initializeInteractListeners();
    }, []);

    const stonesAndLeafs = ['stone', 'stone', 'stone', 'leaf', 'leaf'].sort((a, b) => 0.5 - Math.random());

    return (
        <ObstacleContainer>
            <Container>
                {stonesAndLeafs.map((item, index) =>
                    item === 'stone' ? (
                        <DraggableStone key={`draggable${index}`} id="stone" className="drag-drop" />
                    ) : (
                        <DraggableLeaf key={`draggable${index}`} id="leaf" className="drag-drop" />
                    )
                )}

                <DropZone className="dropzone" />
            </Container>
        </ObstacleContainer>
    );
};

export default Hole;
