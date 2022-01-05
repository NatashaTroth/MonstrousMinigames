import { Container } from '@material-ui/core';
import * as React from 'react';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

import Button from '../../../../components/common/Button';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { MessageTypesGame2 } from '../../../../utils/constants';
import { controllerStealSheepRoute } from '../../../../utils/routes';
import { Countdown } from '../../../game1/controller/components/ShakeInstruction.sc';
import history from '../../../history/history';
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

    const { remainingKills, roundIdx } = React.useContext(Game2Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);
    const { roomId } = React.useContext(GameContext);

    let direction: string | undefined = 'C';

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

    function emitKillMessage() {
        controllerSocket.emit({
            type: MessageTypesGame2.killSheep,
            userId,
        });

        history.push(controllerStealSheepRoute(roomId));
    }

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

    function handleStop() {
        controllerSocket.emit({
            type: MessageTypesGame2.movePlayer,
            userId: userId,
            direction: 'C',
        });
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
                                stop={() => handleStop()}
                            ></Joystick>
                        </JoystickContainer>
                        <Instructions>Remaining kills: {remainingKills}</Instructions>
                        <KillSheepButtonContainer>
                            <Button onClick={emitKillMessage} disabled={remainingKills === 0}>
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

function getDirectionforPos(x: number, y: number) {
    if (Math.abs(x) < 20 && Math.abs(y) < 20) {
        return 'C';
    } else if (y >= 20) {
        if (-35 <= x) {
            if (x <= 35) {
                return 'N';
            }
            return 'NE';
        }
        return 'NW';
    } else if (y <= -20) {
        if (-35 <= x) {
            if (x <= 35) {
                return 'S';
            }
            return 'SE';
        }
        return 'SW';
    } else if (x >= 20) {
        return 'E';
    } else if (x <= -20) {
        return 'W';
    }
    return 'C';
}
