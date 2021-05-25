import * as React from 'react';

import history from '../../domain/history/history';
import Button from './Button';
import { BackButtonContainer, Content, ContentContainer, Headline, SettingsContainer } from './Settings.sc';

const Settings: React.FunctionComponent = () => {
    const roomId = sessionStorage.getItem('roomId');
    return (
        <SettingsContainer>
            <ContentContainer>
                <Content>
                    <Headline>Settings</Headline>
                </Content>
                <BackButtonContainer>
                    <Button onClick={() => history.push(`/${roomId}`)}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </SettingsContainer>
    );
};

export default Settings;
