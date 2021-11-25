import React from "react";

import Countdown from "../../../../components/common/Countdown";
import { Game3Context } from "../../../../contexts/game3/Game3ContextProvider";
import { PlayerContext } from "../../../../contexts/PlayerContextProvider";
import { CountdownContainer, Instructions, ScreenContainer } from "./Game3Styles.sc";

const PresentFinalPhotos: React.FunctionComponent = () => {
    const { presentFinalPhotos } = React.useContext(Game3Context);
    const { userId } = React.useContext(PlayerContext);
    const [countdownTime, setCountdownTime] = React.useState<number | undefined>(undefined);

    const playersTurn = presentFinalPhotos?.photographerId === userId;

    React.useEffect(() => {
        if (presentFinalPhotos?.countdownTime) {
            setCountdownTime(presentFinalPhotos.countdownTime);
        }
    }, [presentFinalPhotos, playersTurn]);

    return (
        <ScreenContainer>
            {countdownTime && (
                <CountdownContainer>
                    <Countdown time={countdownTime} size="small" keyValue={presentFinalPhotos?.photographerId} />
                </CountdownContainer>
            )}
            <Instructions>{playersTurn ? "It's your turn!" : 'Listen to the other players'}</Instructions>
        </ScreenContainer>
    );
};

export default PresentFinalPhotos;
