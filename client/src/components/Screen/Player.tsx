import * as React from 'react'
import { Container, PlayerCharacter, PlayerName } from './Player.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import oliver from '../../images/oliver.png'
import monster from '../../images/monster.png'
import monster2 from '../../images/monster2.png'
import unicorn from '../../images/unicorn.png'
import { GAMESTATE, OBSTACLES } from '../../utils/constants'
import Obstacle from './Obstacle'

interface IObstacle {
    positionX: number
    type: OBSTACLES
}

interface IPlayerState {
    atObstacle: boolean
    finished: boolean
    id: string
    name: string
    obstacles: IObstacle[]
    positionX: number
    rank: number
}
interface IGameState {
    data?: {
        gameState: GAMESTATE
        numberOfObstacles: number
        roomId: string
        trackLength: number
        playersState: IPlayerState[]
    }
    type: 'game1/gameState' | 'game1/hasStarted'
}

const windowWidth = window.innerWidth - 100

const Player: React.FunctionComponent = () => {
    const { screenSocket } = React.useContext(SocketContext)
    const [players, setPlayers] = React.useState<undefined | IPlayerState[]>()
    const [trackLength, setTrackLength] = React.useState<undefined | number>()
    const monsters = [oliver, monster, monster2, unicorn]

    screenSocket?.on('message', (message: IGameState) => {
        if (message && message.data) {
            setTrackLength(message.data.trackLength)
            setPlayers(message.data.playersState)
        }
    })

    players?.forEach(player => {
        movePlayer(player.id, player.positionX, trackLength || 1)
    })

    return (
        <>
            {players?.map((player, playerIndex) => (
                <div key={'container' + player.id}>
                    <Container id={player.id} key={player.id} top={playerIndex}>
                        <PlayerName>{player.name}</PlayerName>
                        <PlayerCharacter src={monsters[playerIndex]} />
                    </Container>
                    {player.obstacles.map((obstacle, index) => (
                        <Obstacle
                            key={'obstacle' + index + 'player' + player.id}
                            player={playerIndex}
                            posX={(obstacle.positionX * windowWidth) / (trackLength || 1)}
                        />
                    ))}
                </div>
            ))}
        </>
    )
}

export default Player

export interface IMovePlayer {
    setObstacle: (val: boolean) => void
    obstacleRemoved: boolean
    obstacle: boolean
}

function movePlayer(playerId: string, positionX: number, trackLength: number) {
    const d = document.getElementById(playerId)

    if (d) {
        d.style.left = (positionX * windowWidth) / (trackLength || 1) + 'px'
    }
}
