import * as React from 'react';

import history from '../../domain/history/history';
import Button from './Button';
import { BackButtonContainer, Content, ContentContainer, CreditsContainer, Headline } from './Credits.sc';

const Credits: React.FunctionComponent = () => {
    return (
        <CreditsContainer>
            <ContentContainer>
                <Content>
                    <Headline>Credits</Headline>
                    <p>Nothing to see here</p>
                </Content>
                <BackButtonContainer>
                    <Button onClick={history.goBack}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </CreditsContainer>
    );
};

export default Credits;
