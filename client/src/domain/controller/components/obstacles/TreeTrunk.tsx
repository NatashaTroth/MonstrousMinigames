import * as React from 'react';

import Button from '../../../../components/common/Button';
import { StyledParticles } from '../../../../components/common/Particles.sc';
import { treeParticlesConfig } from '../../../../config/particlesConfig';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import wood from '../../../../images/obstacles/wood/wood.svg';
import { MessageTypes } from '../../../../utils/constants';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import {
    DragItem,
    Line,
    ObstacleItem,
    ProgressBarContainer,
    StyledObstacleImage,
    StyledSkipButton,
    StyledTouchAppIcon,
    TouchContainer,
} from './TreeTrunk.sc';

export type Orientation = 'vertical' | 'horizontal';

interface Coordinates {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface TouchStart {
    clientX: number;
    clientY: number;
}

const TreeTrunk: React.FunctionComponent = () => {
    const orientationOptions: Orientation[] = ['vertical', 'horizontal'];
    const tolerance = 10;
    const distance = 80;
    const trunksToFinish = 5;

    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);
    const [progress, setProgress] = React.useState(0);
    const [particles, setParticles] = React.useState(false);
    const [orientation, setOrientation] = React.useState(
        orientationOptions[Math.floor(Math.random() * orientationOptions.length)]
    );
    const [coordinates, setCoordinates] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });
    const [touchStart, setTouchStart] = React.useState<undefined | TouchStart>();
    const [failed, setFailed] = React.useState(false);

    let currentX;
    let currentY;
    let initialX: number;
    let initialY: number;
    let xOffset = orientation === 'vertical' ? 0 : 20;
    let yOffset = orientation === 'horizontal' ? 0 : 20;

    React.useEffect(() => {
        setTimeout(() => {
            if (progress === 0) {
                setSkip(true);
            }
        }, 10000);

        newTrunk(orientationOptions, setOrientation);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const touchContainer = document.getElementById(`touchContainer`);
        touchContainer?.addEventListener('touchstart', handleTouchStart, { passive: false });
        touchContainer?.addEventListener('touchmove', drag, { passive: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress]);

    const solveObstacle = () => {
        controllerSocket?.emit({ type: MessageTypes.obstacleSolved, obstacleId: obstacle!.id });
        setShowInstructions(false);
        setObstacle(roomId, undefined);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function drag(e: any) {
        e.preventDefault();
        const dragItem = document.getElementById('dragItem');

        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem!);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleTouchStart(e: any) {
        e.preventDefault();
        setFailed(false);
        const touchContainer = document.getElementById('touchContainer');

        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;

        if (touchContainer) {
            const element = touchContainer.getBoundingClientRect();

            setCoordinates({
                top: element.top - tolerance,
                right: element.right + tolerance,
                bottom: element.bottom + tolerance,
                left: element.left - tolerance,
            });
        }

        setTouchStart(e.touches[0]);
        setParticles(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTouchEnd = (e: any) => {
        e.preventDefault();
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;

        if (touchStart) {
            if (
                isInContainer(touchStart, coordinates) &&
                ((orientation === 'vertical' && endY >= touchStart.clientY + distance) ||
                    (orientation === 'horizontal' && endX >= touchStart.clientX + distance))
            ) {
                if (trunksToFinish - 1 === progress) {
                    solveObstacle();
                } else {
                    setProgress(progress + 1);
                    newTrunk(orientationOptions, setOrientation);
                }
            } else {
                setFailed(true);
            }
        }

        setTouchStart(undefined);
        setParticles(false);
    };

    return (
        <ObstacleContainer>
            <ProgressBarContainer>
                <LinearProgressBar MAX={trunksToFinish} progress={progress} key={`progressbar${progress}`} />
            </ProgressBarContainer>
            <ObstacleContent>
                <ObstacleItem orientation={orientation}>
                    <StyledObstacleImage src={wood} key={`trunk${progress}`} id="wood" />
                </ObstacleItem>
                <TouchContainer
                    id={`touchContainer`}
                    onTouchEnd={handleTouchEnd}
                    orientation={orientation}
                    key={`touchContainer${progress}`}
                >
                    <DragItem id="dragItem" orientation={orientation} failed={failed}></DragItem>
                    <Line orientation={orientation} />
                    {showInstructions && <StyledTouchAppIcon orientation={orientation} />}
                </TouchContainer>
                {particles && <StyledParticles params={treeParticlesConfig} />}
            </ObstacleContent>
            {skip && (
                <StyledSkipButton>
                    <Button onClick={solveObstacle}>Skip</Button>
                </StyledSkipButton>
            )}
        </ObstacleContainer>
    );
};

export default TreeTrunk;

const isInContainer = (touches: TouchStart, coordinates: Coordinates) => {
    return (
        touches.clientX >= coordinates.left &&
        touches.clientX <= coordinates.right &&
        touches.clientY >= coordinates.top &&
        touches.clientY <= coordinates.bottom
    );
};

function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    el.style.opacity = '1';
}

function newTrunk(orientationOptions: Orientation[], setOrientation: (orientation: Orientation) => void) {
    const newOrientation = orientationOptions[Math.floor(Math.random() * orientationOptions.length)];
    setOrientation(newOrientation);
}
