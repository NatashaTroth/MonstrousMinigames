import * as React from 'react';

import Countdown from '../../../../components/common/Countdown';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import uploadFile from '../gameState/handleFiles';
import { CountdownContainer, Instructions, ScreenContainer } from './Game3Styles.sc';
import PhotoForm from './PhotoForm';

export interface UploadProps {
    picture: File | undefined;
}

const TakePicture: React.FunctionComponent = () => {
    const { storage } = React.useContext(FirebaseContext);
    const { roomId, countdownTime } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const { roundIdx, topicMessage, finalRoundCountdownTime } = React.useContext(Game3Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const [uploadedImagesCount, setUploadedImagesCount] = React.useState(0);
    const [displayCountdown, setDisplayCountdown] = React.useState(true);
    const [preview, setPreview] = React.useState<undefined | string>();

    const upload = async (values: UploadProps) => {
        uploadFile(values, storage, roomId, userId, roundIdx, controllerSocket, uploadedImagesCount);
        setUploadedImagesCount(uploadedImagesCount + 1);
        setPreview(undefined);
    };

    const finalRound = roundIdx === 3;

    const timeToDisplay = finalRoundCountdownTime
        ? finalRoundCountdownTime
        : topicMessage
        ? topicMessage.countdownTime
        : 0;

    return (
        <ScreenContainer>
            {!displayCountdown && topicMessage?.countdownTime && topicMessage?.countdownTime > 0 && (
                <CountdownContainer>
                    <Countdown time={timeToDisplay} size="small" />
                </CountdownContainer>
            )}
            <Instructions>{finalRound ? 'Final Round' : `Round ${roundIdx}`}</Instructions>
            {displayCountdown ? (
                <>
                    <Countdown time={countdownTime} onComplete={() => setDisplayCountdown(false)} />
                </>
            ) : (
                <>
                    {uploadedImagesCount < 1 || (finalRound && uploadedImagesCount < 3) ? (
                        <>
                            {finalRound && <Instructions>{uploadedImagesCount}/3 pictures uploaded</Instructions>}
                            <PhotoForm upload={upload} preview={preview} setPreview={setPreview} />
                        </>
                    ) : (
                        <Instructions>
                            {finalRound ? 'Pictures have' : 'Picture has'} been submitted. Waiting for the other
                            players...
                        </Instructions>
                    )}
                </>
            )}
        </ScreenContainer>
    );
};

export default TakePicture;
