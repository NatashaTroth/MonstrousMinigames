import * as React from 'react';

import history from '../../domain/history/history';
import Button from './Button';
import {
    BackButtonContainer, Content, ContentContainer, CreditsContainer, Headline
} from './Credits.sc';

const Credits: React.FunctionComponent = () => {
    const roomId = sessionStorage.getItem('roomId');
    return (
        <CreditsContainer>
            <ContentContainer>
                <Content>
                    <Headline>Credits</Headline>
                    <p>
                        The graphics for the tree trunks were created by macrovecto and downloaded from freepiks.com.{' '}
                        <a href="https://de.freepik.com/vektoren-kostenlos/holzwerkstoff-und-fertigprodukte-mit-baumstamm-aeste-planken-kuechenutensilien-transparent-gesetzt_6804311.htm#page=1&query=Baumstamm&position=8">
                            Link to the source
                        </a>
                        <div>
                            Mute and Unmute icons made by{' '}
                            <a href="https://www.flaticon.com/authors/google" title="Google">
                                Google
                            </a>{' '}
                            from{' '}
                            <a href="https://www.flaticon.com/" title="Flaticon">
                                www.flaticon.com
                            </a>
                        </div>
                    </p>
                </Content>
                <BackButtonContainer>
                    <Button onClick={() => history.push(`/${roomId}`)}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </CreditsContainer>
    );
};

export default Credits;
