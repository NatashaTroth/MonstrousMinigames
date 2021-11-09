/* eslint-disable react-hooks/exhaustive-deps */
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import * as React from 'react';

import Countdown from '../../../../components/common/Countdown';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import {
    Frame,
    ImageContainer,
    InstructionContainer,
    LoadingMessage,
    PictureInstruction,
    RandomWord,
    ScreenContainer,
    StyledImg,
} from './Game.sc';

const Game3: React.FunctionComponent = () => {
    const [images, setImages] = React.useState<string[]>([]);
    const { roomId, countdownTime } = React.useContext(GameContext);
    const { setTimeIsUp, timeIsUp, roundIdx } = React.useContext(Game3Context);
    const [loading, setLoading] = React.useState(false);
    const [displayStartingCountdown, setDisplayStartingCountdown] = React.useState(roundIdx === 1 ? true : false);

    const { topicMessage } = React.useContext(Game3Context);

    const { storage } = React.useContext(FirebaseContext);

    async function listAllFiles() {
        if (storage) {
            setLoading(true);
            const imageUrls: string[] = [];
            const imageReferences = await listAll(ref(storage, `${roomId}/${roundIdx}`));
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

    return (
        <ScreenContainer>
            {displayStartingCountdown ? (
                <Countdown
                    time={countdownTime}
                    onComplete={() => {
                        setDisplayStartingCountdown(false);
                    }}
                />
            ) : (
                <>
                    <InstructionContainer>
                        {timeIsUp ? (
                            <>
                                <PictureInstruction>
                                    Vote on your smartphone for the picture that looks most like
                                </PictureInstruction>
                                <RandomWord>{topicMessage.topic}</RandomWord>
                            </>
                        ) : (
                            <>
                                <PictureInstruction>Round {roundIdx}</PictureInstruction>
                                <PictureInstruction>Take a picture that represents the word</PictureInstruction>
                                <RandomWord>{topicMessage.topic}</RandomWord>
                            </>
                        )}
                    </InstructionContainer>
                    {!timeIsUp && topicMessage.countdownTime > 0 && (
                        <Countdown
                            time={topicMessage.countdownTime}
                            onComplete={() => {
                                setTimeIsUp(true);
                            }}
                        />
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
                </>
            )}
        </ScreenContainer>
    );
};
export default Game3;
