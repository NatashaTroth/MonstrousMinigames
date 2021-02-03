import * as React from 'react'

import Player from './Player'
import { Container } from './Screen.sc'

const Screen: React.FunctionComponent = () => {
    // const { socket } = React.useContext(SocketContext)

    // socket?.on('response', (data: IObstacles) => {
    //     // eslint-disable-next-line no-console
    //     console.log('Got all obstacles')
    //     if (data.type === 'game1/allObstacles') {
    //         drawObstacles()
    //     }
    // })

    return (
        <Container>
            <Player />
        </Container>
    )
}

export default Screen
