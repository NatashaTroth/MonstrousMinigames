import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import Logo from '../common/Logo';
import {
    Code,
    HeadContainer,
    HeadContainerLeft,
    HeadContainerRight,
    Headline,
    RoomCodeContainer,
} from './LobbyHeader.sc';

const LobbyHeader: React.FC = () => {
    const { roomId } = React.useContext(GameContext);
    return (
        <HeadContainer>
            <HeadContainerLeft>
                <RoomCodeContainer>
                    <Headline>Room Code:</Headline>
                    <Code>{roomId}</Code>
                </RoomCodeContainer>
            </HeadContainerLeft>
            <HeadContainerRight>
                <Logo />
            </HeadContainerRight>
        </HeadContainer>
    );
};
export default LobbyHeader;
