import { getDownloadURL, listAll, ref } from 'firebase/storage';
import * as React from 'react';

import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { StyledImg } from './Game.sc';

const Game3: React.FunctionComponent = () => {
    const [images, setImages] = React.useState<string[]>([]);
    const { roomId } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const { storage } = React.useContext(FirebaseContext);

    async function listAllFiles() {
        if (storage) {
            const imageUrls: string[] = [];
            const imageReferences = await listAll(ref(storage, `ABCD`));
            const promises = imageReferences.items.map(async imgRef => {
                const url = await getDownloadURL(imgRef);
                imageUrls.push(url);
            });

            await Promise.all(promises);
            setImages(Array.from(new Set(imageUrls)));
        }
    }

    React.useEffect(() => {
        listAllFiles();
    }, [storage]);

    return (
        <FullScreenContainer>
            {images.map((image, index) => (
                <StyledImg key={`image${index}`} src={image} />
            ))}
        </FullScreenContainer>
    );
};
export default Game3;
