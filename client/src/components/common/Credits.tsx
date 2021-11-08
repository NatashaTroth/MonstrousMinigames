import * as React from 'react';

import history from '../../domain/history/history';
import Button from './Button';
import { TextContainer } from './Credits.sc';
import {
    BackButtonContainer,
    ContentBase,
    ContentContainer,
    FullScreenContainer,
    Headline,
} from './FullScreenStyles.sc';

const Credits: React.FunctionComponent = () => (
    <FullScreenContainer>
        <ContentContainer>
            <ContentBase>
                <Headline>Credits</Headline>
                <TextContainer>
                    This project was developed as part of the MultiMediaTechnology Master's degree programme at the
                    University of Applied Sciences Salzburg. The students Natasha Troth, Robin Fellinger, Leon
                    Spiegelmayr and Magdalena Maislinger are responsible for the technical implementation. All game
                    elements and the design for the user interface were created by MultiMediaArt student Kerstin
                    Schaumberger. The music and sound elements were created by the MultiMediaArt artist Tobias Türk.
                </TextContainer>
            </ContentBase>
        </ContentContainer>
        <BackButtonContainer>
            <Button onClick={history.goBack}>Back</Button>
        </BackButtonContainer>
    </FullScreenContainer>
);

export default Credits;
