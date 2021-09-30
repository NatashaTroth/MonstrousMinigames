/* eslint-disable react-hooks/exhaustive-deps */
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import theme from '../../../../styles/theme';
import {
    Frame,
    ImageContainer,
    InstructionContainer,
    LoadingMessage,
    PictureInstruction,
    RandomWord,
    ScreenContainer,
    StyledImg,
    TimeWrapper,
} from './Game.sc';

const Game3: React.FunctionComponent = () => {
    const [images, setImages] = React.useState<string[]>([]);
    const { roomId } = React.useContext(GameContext);
    const { challengeId } = React.useContext(Game3Context);
    const [timeIsUp, setTimeIsUp] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { storage } = React.useContext(FirebaseContext);

    async function listAllFiles() {
        if (storage) {
            setLoading(true);
            const imageUrls: string[] = [];
            const imageReferences = await listAll(ref(storage, `${roomId}/${challengeId}`));
            const promises = imageReferences.items.map(async imgRef => {
                const url = await getDownloadURL(imgRef);
                imageUrls.push(url);
            });

            await Promise.all(promises);
            setImages(Array.from(new Set(imageUrls)));
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (timeIsUp) {
            listAllFiles();
        }
    }, [timeIsUp]);

    const randomWord = 'tree'.toUpperCase();

    return (
        <ScreenContainer>
            <InstructionContainer>
                {timeIsUp ? (
                    <>
                        <PictureInstruction>
                            Vote on your smartphone for the picture that looks most like
                        </PictureInstruction>
                        <RandomWord>{randomWord}</RandomWord>
                    </>
                ) : (
                    <>
                        <PictureInstruction>Take a picture that represents the word</PictureInstruction>
                        <RandomWord>{randomWord}</RandomWord>
                    </>
                )}
            </InstructionContainer>
            {!timeIsUp && (
                <CountdownCircleTimer
                    isPlaying
                    duration={10}
                    colors={[
                        [theme.palette.primary.main, 0.5],
                        [theme.palette.secondary.main, 0.5],
                    ]}
                    onComplete={() => {
                        setTimeIsUp(true);
                    }}
                >
                    {({ remainingTime }) => <TimeWrapper>{remainingTime}</TimeWrapper>}
                </CountdownCircleTimer>
            )}
            {loading && <LoadingMessage>Loading images...</LoadingMessage>}
            {timeIsUp && !loading && (
                <ImageContainer>
                    {images.map((image, index) => (
                        <Frame key={`image${index}`}>
                            <StyledImg src={image} />
                        </Frame>
                    ))}
                </ImageContainer>
            )}
        </ScreenContainer>
    );
};
export default Game3;
