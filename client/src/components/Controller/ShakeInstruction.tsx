import * as React from 'react';

import shakeIt from '../../images/ui/shakeIt.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { Container, Countdown, ShakeIt } from './ShakeInstruction.sc';

const ShakeInstruction: React.FunctionComponent = () => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
    );

    React.useEffect(() => {
        if (counter !== null && counter !== undefined) {
            if (counter > 0) {
                setTimeout(() => setCounter(counter - 1), 1000);
                // setTimeout(() => setCounter(counter - 1), 1000); //TODO use instead when backend and phaser have been fixed/changed
            } else {
                sessionStorage.removeItem('countdownTime');
                setCounter(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
        <>
            <FullScreenContainer>
                <Container>{counter ? <Countdown>{counter}</Countdown> : <ShakeIt src={shakeIt} />}</Container>
            </FullScreenContainer>
        </>
    );
};

export default ShakeInstruction;
