import { Typography } from "@material-ui/core";
import React from "react";

import { Game3Context } from "../../../../contexts/game3/Game3ContextProvider";
import { PlayerContext } from "../../../../contexts/PlayerContextProvider";

const PresentFinalPhotos: React.FunctionComponent = () => {
    const { presentFinalPhotos } = React.useContext(Game3Context);
    const { userId } = React.useContext(PlayerContext);

    const playersTurn = presentFinalPhotos?.photographerId === userId;
    return <Typography>{playersTurn ? "It's your turn!" : 'Listen to the other players'}</Typography>;
};

export default PresentFinalPhotos;
