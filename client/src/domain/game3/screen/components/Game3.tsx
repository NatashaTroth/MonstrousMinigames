/* eslint-disable react-hooks/exhaustive-deps */
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import theme from '../../../../styles/theme';
import { StyledImg, TimeWrapper } from './Game.sc';

const Game3: React.FunctionComponent = () => {
    const [images, setImages] = React.useState<string[]>([]);
    const { roomId } = React.useContext(GameContext);
    const { challengeId } = React.useContext(Game3Context);

    const { storage } = React.useContext(FirebaseContext);

    async function listAllFiles() {
        if (storage) {
            const imageUrls: string[] = [];
            const imageReferences = await listAll(ref(storage, `${roomId}/${challengeId}`));
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
            <CountdownCircleTimer
                isPlaying
                duration={10}
                colors={[
                    [theme.palette.primary.main, 0.5],
                    [theme.palette.secondary.main, 0.5],
                ]}
            >
                {({ remainingTime }) => <TimeWrapper>{remainingTime}</TimeWrapper>}
            </CountdownCircleTimer>

            {images.map((image, index) => (
                <StyledImg key={`image${index}`} src={image} />
            ))}
        </FullScreenContainer>
    );
};
export default Game3;
