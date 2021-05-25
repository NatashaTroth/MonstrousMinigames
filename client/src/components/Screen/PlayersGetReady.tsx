import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import franz from '../../images/franz.png';
import noah from '../../images/noah.png';
import steffi from '../../images/steffi.png';
import susi from '../../images/susi.png';
import Button from '../common/Button';
import { getUserArray } from './Lobby';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUserName,
    ConnectedUsers,
    Content,
    GetReadyBackground,
    GetReadyContainer,
} from './PlayersGetReady.sc';

const PlayersGetReady: React.FC = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext);
    const characters = [franz, noah, susi, steffi];

    return (
        <GetReadyContainer>
            <GetReadyBackground>
                <Content>
                    <ConnectedUsers>
                        {getUserArray(connectedUsers || []).map((user, index) => (
                            <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                <ConnectedUserCharacter number={user.number} free={user.free}>
                                    {!user.free && (
                                        <CharacterContainer>
                                            <Character src={characters[index]} />
                                        </CharacterContainer>
                                    )}

                                    {`Player ${user.number}`}
                                </ConnectedUserCharacter>
                                <ConnectedUserName number={user.number} free={user.free}>
                                    {user.name.toUpperCase()}
                                </ConnectedUserName>
                            </ConnectedUserContainer>
                        ))}
                    </ConnectedUsers>
                    <Button>Start</Button>
                </Content>
            </GetReadyBackground>
        </GetReadyContainer>
    );
};

export default PlayersGetReady;
