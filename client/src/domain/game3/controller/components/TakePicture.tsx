import * as React from 'react';

import Countdown from '../../../../components/common/Countdown';
import LoadingComponent from '../../../../components/common/LoadingComponent';
import { ControllerSocketContext } from '../../../../contexts/controller/ControllerSocketContextProvider';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { uploadFile } from '../gameState/handleFiles';
import { CountdownContainer, Instructions, ScreenContainer } from './Game3Styles.sc';
import PhotoForm from './PhotoForm';
import { RandomWord } from './TakePicture.sc';

export interface UploadProps {
    picture: File | Blob | undefined;
}

const TakePicture: React.FunctionComponent = () => {
    const { storage } = React.useContext(FirebaseContext);
    const { roomId, countdownTime } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const { roundIdx, topicMessage, finalRoundCountdownTime, finalRoundPhotoTopics } = React.useContext(Game3Context);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const [uploadedImagesCount, setUploadedImagesCount] = React.useState(0);
    const [displayCountdown, setDisplayCountdown] = React.useState(true);
    const [preview, setPreview] = React.useState<undefined | string>();
    const [loading, setLoading] = React.useState(false);

    const uploadWithDependencies = uploadFile({
        remoteStorage: storage,
        roomId,
        userId,
        roundIdx,
        controllerSocket,
        setUploadedImagesCount,
        setLoading,
    });

    React.useEffect(() => {
        setPreview(undefined);
    }, [uploadedImagesCount, loading]);

    const upload = async (values: UploadProps) => {
        uploadWithDependencies(values, uploadedImagesCount);
    };

    React.useEffect(() => {
        setUploadedImagesCount(0);
        setDisplayCountdown(true);
    }, [roundIdx]);

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
            {!displayCountdown && !finalRound && <RandomWord>{topicMessage?.topic}</RandomWord>}
            {!displayCountdown && finalRound && <RandomWord>{finalRoundPhotoTopics.join(', ')}</RandomWord>}
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
                            {loading ? (
                                <LoadingComponent />
                            ) : (
                                <PhotoForm upload={upload} preview={preview} setPreview={setPreview} />
                            )}
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
