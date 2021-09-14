import * as React from 'react';

import FullScreenContainer from '../../../components/common/FullScreenContainer';
import shakeIt from '../../../images/ui/shakeIt.svg';
import { Storage } from '../../storage/Storage';
import { Container, Countdown, ShakeIt } from './ShakeInstruction.sc';

interface ShakeInstructionProps {
    sessionStorage: Storage;
}

const ShakeInstruction: React.FunctionComponent<ShakeInstructionProps> = ({ sessionStorage }) => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
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
        <FullScreenContainer>
            <Container>{counter ? <Countdown>{counter}</Countdown> : <ShakeIt src={shakeIt} />}</Container>
        </FullScreenContainer>
    );
};

export default ShakeInstruction;
