import * as React from 'react';

import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import pebble from '../../../../images/obstacles/stone/pebble.svg';
import stone from '../../../../images/obstacles/stone/stone.svg';
import arrow from '../../../../images/ui/arrow_blue.svg';
import shakeIt from '../../../../images/ui/shakeIt.svg';
import { MessageTypesGame1, ObstacleTypes } from '../../../../utils/constants';
import { controllerObstacleRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { Storage } from '../../../storage/Storage';
import { ObstacleInstructions } from './obstacles/ObstacleStyles.sc';
import {
    Arrow,
    Container,
    Countdown,
    PebbleButton,
    PebbleContainer,
    PebbleInstructions,
    ShakeIt,
    StoneButton,
    StyledPebbleImage,
} from './ShakeInstruction.sc';

interface ShakeInstructionProps {
    sessionStorage: Storage;
}

const ShakeInstruction: React.FunctionComponent<ShakeInstructionProps> = ({ sessionStorage }) => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
    );
    const [solveStoneClicked, setSolveStoneClicked] = React.useState(false);
    const { hasStone, setHasStone, earlySolvableObstacle } = React.useContext(Game1Context);
    const { roomId } = React.useContext(GameContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    React.useEffect(() => {
        if (counter !== null && counter !== undefined) {
            if (counter > 0) {
                setTimeout(() => setCounter(counter - 1), 1000);
                return;
            }

            sessionStorage.removeItem('countdownTime');
            setCounter(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    function handleThrowPebble() {
        setHasStone(false);
        history.push(`${controllerObstacleRoute(roomId, ObstacleTypes.stone)}?choosePlayer=true`);
    }

    function handleSolveStone() {
        setSolveStoneClicked(true);
        if (earlySolvableObstacle) {
            controllerSocket.emit({ type: MessageTypesGame1.solveObstacle, obstacleId: earlySolvableObstacle.id });
        }
    }

    return (
        <FullScreenContainer>
            <Container>
                {counter ? (
                    <Countdown>{counter}</Countdown>
                ) : (
                    <>
                        <ShakeIt src={shakeIt} />
                        {hasStone && (
                            <PebbleContainer>
                                <PebbleInstructions>Click to use collected stone</PebbleInstructions>
                                <Arrow src={arrow} />
                                <PebbleButton onClick={handleThrowPebble}>
                                    <StyledPebbleImage src={pebble} />
                                </PebbleButton>
                            </PebbleContainer>
                        )}
                        {!hasStone && earlySolvableObstacle && !solveStoneClicked && (
                            <PebbleContainer>
                                <PebbleInstructions>Click to solve obstacle</PebbleInstructions>
                                <Arrow src={arrow} />
                                <StoneButton onClick={handleSolveStone}>
                                    <StyledPebbleImage src={stone} />
                                </StoneButton>
                            </PebbleContainer>
                        )}
                        {solveStoneClicked && (
                            <ObstacleInstructions>
                                Your character will stop at the stone to solve it
                            </ObstacleInstructions>
                        )}
                    </>
                )}
            </Container>
        </FullScreenContainer>
    );
};

export default ShakeInstruction;
