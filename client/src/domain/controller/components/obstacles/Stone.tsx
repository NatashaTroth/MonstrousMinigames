/* eslint-disable simple-import-sort/imports */
import * as React from "react";

import Button from "../../../../components/common/Button";
import { StyledParticles } from "../../../../components/common/Particles.sc";
import { SkipButton } from "../../../../components/common/SkipButton.sc";
import { stoneParticlesConfig } from "../../../../config/particlesConfig";
import { ControllerSocketContext } from "../../../../contexts/ControllerSocketContextProvider";
import { GameContext } from "../../../../contexts/GameContextProvider";
import { PlayerContext } from "../../../../contexts/PlayerContextProvider";
import pebble from "../../../../images/obstacles/stone/pebble.svg";
import stone from "../../../../images/obstacles/stone/stone.svg";
import { MessageTypes } from "../../../../utils/constants";
import { controllerGame1Route } from "../../../../utils/routes";
import history from "../../../history/history";
import {
    PebbleContainer, PlayerButtonContainer, Ray1, Ray10, Ray2, Ray3, Ray4, Ray5, Ray6, Ray7, Ray8,
    Ray9, RayBox, StoneContainer, StyledPebbleImage, StyledStone, StyledStoneImage,
    StyledTypography, Sun, UserButtons
} from "./Stone.sc";

const Stone: React.FunctionComponent = () => {
    const searchParams = new URLSearchParams(history.location.search);
    const limit = 10;
    const [counter, setCounter] = React.useState(searchParams.get('choosePlayer') ? limit + 1 : 0);
    const [particles, setParticles] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<string | undefined>();
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId, obstacle, setObstacle, hasStone, setHasStone } = React.useContext(PlayerContext);
    const { connectedUsers, roomId } = React.useContext(GameContext);

    function handleTouch() {
        if (counter <= limit) {
            setParticles(true);
            setCounter(counter + 1);
        }
    }

    function handleThrow(receivingUserId: string) {
        controllerSocket.emit({
            type: MessageTypes.stunPlayer,
            userId,
            receivingUserId,
            usingCollectedStone: searchParams.get('choosePlayer') ? true : false,
        });

        history.push(controllerGame1Route(roomId));
    }

    function handleSkip() {
        if (obstacle) {
            controllerSocket.emit({
                type: MessageTypes.obstacleSkipped,
                obstacleId: obstacle.id,
            });
            setObstacle(roomId, undefined);
        }
    }

    function handleCollectStone() {
        controllerSocket.emit({
            type: MessageTypes.obstacleSolved,
            obstacleId: obstacle?.id,
        });
        setHasStone(true);
        history.push(controllerGame1Route(roomId));
    }

    return (
        <>
            <StoneContainer pebble={counter > limit}>
                {counter <= limit ? (
                    <>
                        <StyledTypography>
                            Tap on this rock several times to get a stone. Throw it at a fellow player to freeze their
                            movement for a few seconds.
                        </StyledTypography>
                        <StyledStone onTouchStart={handleTouch}>
                            <StyledStoneImage src={stone} />
                            {particles && <StyledParticles params={stoneParticlesConfig} />}
                        </StyledStone>
                        {obstacle?.skippable && <Button onClick={handleSkip}>Skip</Button>}
                        <SkipButton>
                            <Button onClick={handleSkip}>Skip</Button>
                        </SkipButton>
                    </>
                ) : (
                    <>
                        <PebbleContainer>
                            <StyledPebbleImage src={pebble} />
                            <Sun>
                                <RayBox>
                                    <Ray1 />
                                    <Ray2 />
                                    <Ray3 />
                                    <Ray4 />
                                    <Ray5 />
                                    <Ray6 />
                                    <Ray7 />
                                    <Ray8 />
                                    <Ray9 />
                                    <Ray10 />
                                </RayBox>
                            </Sun>
                        </PebbleContainer>
                        <UserButtons>
                            <div>
                                {connectedUsers?.map(
                                    (user, key) =>
                                        user.id !== userId && (
                                            <PlayerButtonContainer
                                                key={key}
                                                characterNumber={user.characterNumber}
                                                onClick={() => setSelectedUser(user.id)}
                                                selected={selectedUser === user.id}
                                            >
                                                {user.name}
                                            </PlayerButtonContainer>
                                        )
                                )}
                                {
                                    <Button
                                        disabled={!selectedUser}
                                        onClick={() => {
                                            if (selectedUser) {
                                                handleThrow(selectedUser);
                                            }
                                        }}
                                        variant="secondary"
                                        size="large"
                                    >
                                        Throw Stone
                                    </Button>
                                }
                            </div>
                            {!hasStone && (
                                <Button onClick={handleCollectStone} size="small">
                                    Collect Stone
                                </Button>
                            )}
                        </UserButtons>
                    </>
                )}
            </StoneContainer>
        </>
    );
};

export default Stone;
