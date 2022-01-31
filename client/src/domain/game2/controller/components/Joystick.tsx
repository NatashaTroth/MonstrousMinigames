import { Container } from '@material-ui/core';
import * as React from 'react';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

import Button from '../../../../components/common/Button';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { MessageTypesGame2 } from '../../../../utils/constants';
import { Countdown } from '../../../game1/controller/components/ShakeInstruction.sc';
import { Socket } from '../../../socket/Socket';
import { Storage } from '../../../storage/Storage';
import { Instructions, Round } from './Game2Styles.sc';
import { JoystickContainer, KillSheepButtonContainer } from './Joystick.sc';

interface JoyStickProps {
    sessionStorage: Storage;
}

const JoyStick: React.FunctionComponent<JoyStickProps> = ({ sessionStorage }) => {
    const [counter, setCounter] = React.useState(
        sessionStorage.getItem('countdownTime') ? Number(sessionStorage.getItem('countdownTime')) / 1000 : null
    );

    const { setGuessHint, remainingKills, roundIdx } = React.useContext(Game2Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);

    let direction: string | undefined = 'C';
    React.useEffect(() => setGuessHint(''));
    React.useEffect(() => {
        let mounted = true;

        if (counter !== null && counter !== undefined && mounted) {
            if (counter > 0) {
                setTimeout(() => setCounter(counter - 1), 1000);
            } else {
                sessionStorage.removeItem('countdownTime');
                setCounter(null);
            }
        }

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    function handleMove(event: IJoystickUpdateEvent) {
        if (event.x && event.y) {
            const newDirection = getDirectionforPos(event.x, event.y);
            if (direction != newDirection) {
                direction = newDirection;
                controllerSocket.emit({
                    type: MessageTypesGame2.movePlayer,
                    userId: userId,
                    direction: direction,
                });
            }
        }
    }

    return (
        <FullScreenContainer>
            <Container>
                {counter ? (
                    <Countdown>{counter}</Countdown>
                ) : (
                    <>
                        <Round>Round {roundIdx}</Round>
                        <Instructions>Use the Joystick to Move</Instructions>
                        <JoystickContainer>
                            <Joystick
                                size={100}
                                baseColor="grey"
                                stickColor="white"
                                move={e => handleMove(e)}
                                stop={() => handleStop(userId, controllerSocket)}
                            ></Joystick>
                        </JoystickContainer>
                        <Instructions>Remaining decoys: {remainingKills}</Instructions>
                        <KillSheepButtonContainer>
                            <Button
                                onClick={() => emitKillMessage(userId, controllerSocket)}
                                disabled={remainingKills === 0}
                            >
                                Steal Sheep
                            </Button>
                        </KillSheepButtonContainer>
                    </>
                )}
            </Container>
        </FullScreenContainer>
    );
};

export default JoyStick;

enum Direction {
    C = 'C',
    N = 'N',
    S = 'S',
    W = 'W',
    E = 'E',
    NE = 'NE',
    NW = 'NW',
    SE = 'SE',
    SW = 'SW',
}

export function getDirectionforPos(x: number, y: number) {
    if (Math.abs(x) < 20 && Math.abs(y) < 20) {
        return Direction.C;
    }

    if (y >= 20) {
        if (-35 <= x) {
            return x <= 35 ? Direction.N : Direction.NE;
        }
        return Direction.NW;
    }

    if (y <= -20) {
        if (-35 <= x) {
            return x <= 35 ? Direction.S : Direction.SE;
        }
        return Direction.SW;
    }
    if (x >= 20) {
        return Direction.E;
    }

    if (x <= -20) {
        return Direction.W;
    }
}

export function emitKillMessage(userId: string, controllerSocket: Socket) {
    controllerSocket.emit({
        type: MessageTypesGame2.chooseSheep,
        userId,
    });
}

export function handleStop(userId: string, controllerSocket: Socket) {
    controllerSocket.emit({
        type: MessageTypesGame2.movePlayer,
        userId: userId,
        direction: Direction.C,
    });
}
