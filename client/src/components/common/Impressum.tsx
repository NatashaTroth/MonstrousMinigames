import * as React from 'react'

import { Headline, HomeLink, ImpressumContainer } from './Impressum.sc'

const Impressum: React.FunctionComponent = () => {
    return (
        <ImpressumContainer>
            <Headline>Impressum</Headline>
            <p>
                The graphics for the tree trunks were created by macrovecto and downloaded from freepiks.com.{' '}
                <a href="https://de.freepik.com/vektoren-kostenlos/holzwerkstoff-und-fertigprodukte-mit-baumstamm-aeste-planken-kuechenutensilien-transparent-gesetzt_6804311.htm#page=1&query=Baumstamm&position=8">
                    Link to the source
                </a>
            </p>
            <HomeLink to="/">Back</HomeLink>
        </ImpressumContainer>
    )
}

export default Impressum
