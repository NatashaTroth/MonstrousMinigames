import * as React from 'react';

import Button from '../../../../components/common/Button';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import uploadFile from '../../../storage/uploadFile';

const TakePicture: React.FunctionComponent = () => {
    const [image, setImage] = React.useState<File | undefined>();
    const { storage } = React.useContext(FirebaseContext);
    const { roomId } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const challengeId = 1;

    const upload = () => {
        if (!image) return;

        if (storage && roomId) {
            uploadFile(storage, image, roomId, userId, challengeId);
        }
    };

    return (
        <FullScreenContainer>
            <input
                type="file"
                accept="image/*"
                capture="camera"
                onChange={(e: { target: { files: FileList | null } }) => {
                    setImage(e.target.files?.[0]);
                }}
            />
            <Button onClick={upload}>Upload</Button>
        </FullScreenContainer>
    );
};

export default TakePicture;
