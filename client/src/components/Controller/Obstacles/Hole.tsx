import * as React from 'react';

import { dragMoveListener, initializeInteractListeners } from './Draggable';
import { Container, DraggableLeaf, DraggableStone, DropZone } from './Hole.sc';
import { ObstacleContainer } from './ObstaclStyles.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

const Hole: React.FunctionComponent = () => {
    const [solved, setSolved] = React.useState(false);

    React.useEffect(() => {
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;

        initializeInteractListeners(() => setSolved(true));
    }, []);

    const stonesAndLeafs = ['stone', 'stone', 'stone', 'leaf', 'leaf'].sort((a, b) => 0.5 - Math.random());

    return (
        <ObstacleContainer>
            {solved ? (
                'Solved'
            ) : (
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
            )}
        </ObstacleContainer>
    );
};

export default Hole;
