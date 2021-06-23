import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import shakeIt from '../../images/ui/shakeIt.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { Container, Countdown, DialogContent, ShakeIt, StyledDialog } from './ShakeInstruction.sc';

const ShakeInstruction: React.FunctionComponent = () => {
    const { hasPaused } = React.useContext(GameContext);
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 - 1 : null
    );

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

    return (
        <>
            <StyledDialog open={hasPaused}>
                <DialogContent>
                    <h3>Game has paused</h3>
                </DialogContent>
            </StyledDialog>
            <FullScreenContainer>
                <Container>{counter ? <Countdown>{counter}</Countdown> : <ShakeIt src={shakeIt} />}</Container>
            </FullScreenContainer>
        </>
    );
};

export default ShakeInstruction;
