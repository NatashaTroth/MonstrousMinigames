import interact from 'interactjs';
import React from 'react';

import { FullScreenContainer } from '../../../../components/common/FullScreenStyles.sc';
import { GameContext } from '../../../../contexts/GameContextProvider';
import sheep from '../../../../images/characters/singleSheep.png';
import decoy from '../../../../images/characters/spritesheets/sheep/sheep_decoy.png';
import { controllerGame2Route } from '../../../../utils/routes';
import history from '../../../history/history';
import { dragMoveListener, initializeInteractListeners } from './Draggable';
import { Container, Draggable, DropZone, DropZoneVariant, Instructions, StyledImage } from './StealSheep.sc';

interface WindowProps extends Window {
    dragMoveListener?: unknown;
}

const StealSheep: React.FunctionComponent = () => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        let mounted = true;
        const w = window as WindowProps;
        w.dragMoveListener = dragMoveListener;

        initializeInteractListeners(() => {
            if (mounted) {
                interact('.meadow').unset();
                interact('.bag').unset();
                interact('.drag-drop').unset();
                history.push(controllerGame2Route(roomId));
            }
        });

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FullScreenContainer>
            <Instructions>Exchange the sheep for the decoy</Instructions>

            <Container>
                <Draggable index="sheep" key="draggableSheep" id="sheep" className="drag-drop">
                    <StyledImage src={sheep} />
                </Draggable>
                <Draggable index="decoy" key="draggableDecoy" id="decoy" className="drag-drop">
                    <StyledImage src={decoy} />
                </Draggable>
                <DropZone className="meadow" variant={DropZoneVariant.meadow} />
                <DropZone className="bag" variant={DropZoneVariant.bag} />
            </Container>
        </FullScreenContainer>
    );
};

export default StealSheep;
