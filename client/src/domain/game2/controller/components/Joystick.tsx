import { Container } from '@material-ui/core';
import * as React from 'react';
import { Joystick } from 'react-joystick-component';

import Button from '../../../../components/common/Button';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { Instruction } from '../../../../components/common/Instruction.sc';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { Countdown } from '../../../game1/controller/components/ShakeInstruction.sc';
import { Storage } from '../../../storage/Storage';
import { JoystickContainer, KillSheepButtonContainer } from './Joystick.sc';

interface ShakeInstructionProps {
    sessionStorage: Storage;
}

const ShakeInstruction: React.FunctionComponent<ShakeInstructionProps> = ({ sessionStorage }) => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
    );

    const { roomId } = React.useContext(GameContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

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
            <Container>
                {counter ? (
                    <Countdown>{counter}</Countdown>
                ) : (
                    <>
                        <Instruction>Use the Joystick to Move</Instruction>
                        <JoystickContainer>
                            <Joystick size={100} baseColor="grey" stickColor="white"></Joystick>
                        </JoystickContainer>
                        <KillSheepButtonContainer>
                            <Button>Kill Sheep</Button>
                        </KillSheepButtonContainer>
                    </>
                )}
            </Container>
        </FullScreenContainer>
    );
};

export default ShakeInstruction;
