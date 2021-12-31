import React from 'react';

import Button from '../../../../components/common/Button';
import Countdown from '../../../../components/common/Countdown';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { MessageTypesGame3 } from '../../../../utils/constants';
import { CountdownContainer, Instructions, ScreenContainer } from './Game3Styles.sc';

const PresentFinalPhotos: React.FunctionComponent = () => {
    const { presentFinalPhotos } = React.useContext(Game3Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);
    const [countdownTime, setCountdownTime] = React.useState<number | undefined>(undefined);

    const playersTurn = presentFinalPhotos?.photographerId === userId;

    const handleContinue = () => {
        controllerSocket?.emit({
            type: MessageTypesGame3.finishedPresenting,
        });
    };

    React.useEffect(() => {
        if (presentFinalPhotos?.countdownTime) {
            setCountdownTime(presentFinalPhotos.countdownTime);
        }
    }, [presentFinalPhotos, playersTurn]);

    return (
        <ScreenContainer>
            {countdownTime && (
                <CountdownContainer>
                    <Countdown time={countdownTime} size="small" keyValue={presentFinalPhotos!.photographerId} />
                </CountdownContainer>
            )}
            <Instructions>
                {playersTurn
                    ? "It's your turn! Tell a short story about the photos on the screen"
                    : 'Listen to the other players'}
            </Instructions>
            {playersTurn && <Button onClick={handleContinue}>Next One</Button>}
        </ScreenContainer>
    );
};

export default PresentFinalPhotos;
