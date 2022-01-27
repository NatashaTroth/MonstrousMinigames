import * as React from 'react';
import styled from 'styled-components';

import { FullScreenContainer } from '../../../../components/common/FullScreenStyles.sc';
import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { Instructions } from '../../../game3/controller/components/Game3Styles.sc';

const Results: React.FunctionComponent = () => {
    const { guessHint } = React.useContext(Game2Context);

    return (
        <FullScreenContainer>
            <Container>
                <Instructions>
                    {guessHint === '' ? "Don't forget to enter a guess" : `Your last guess was ${guessHint}`}
                </Instructions>
            </Container>
        </FullScreenContainer>
    );
};

export default Results;

const Container = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;
