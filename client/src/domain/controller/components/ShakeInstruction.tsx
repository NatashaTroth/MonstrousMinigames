import * as React from 'react';

import FullScreenContainer from '../../../components/common/FullScreenContainer';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import pebble from '../../../images/obstacles/stone/pebble.svg';
import arrow from '../../../images/ui/arrow_blue.svg';
import shakeIt from '../../../images/ui/shakeIt.svg';
import { ObstacleTypes } from '../../../utils/constants';
import { controllerObstacleRoute } from '../../../utils/routes';
import history from '../../history/history';
import { Storage } from '../../storage/Storage';
import {
    Arrow,
    Container,
    Countdown,
    PebbleButton,
    PebbleContainer,
    PebbleInstructions,
    ShakeIt,
    StyledPebbleImage,
} from './ShakeInstruction.sc';

interface ShakeInstructionProps {
    sessionStorage: Storage;
}

const ShakeInstruction: React.FunctionComponent<ShakeInstructionProps> = ({ sessionStorage }) => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
    );
    const { hasStone, setHasStone } = React.useContext(PlayerContext);
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (counter !== null && counter !== undefined) {
            if (counter > 0) {
                setTimeout(() => setCounter(counter - 1), 1000);
            } else {
                sessionStorage.removeItem('countdownTime');
                setCounter(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    function handleThrowPebble() {
        setHasStone(false);
        history.push(`${controllerObstacleRoute(roomId, ObstacleTypes.stone)}?choosePlayer=true`);
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
                    </>
                )}
            </Container>
        </FullScreenContainer>
    );
};

export default ShakeInstruction;
