import * as React from 'react';

import Button from '../../../../components/common/Button';
import { StyledParticles } from '../../../../components/common/Particles.sc';
import { treeParticlesConfig } from '../../../../config/particlesConfig';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import wood from '../../../../images/obstacles/wood/wood.svg';
import LinearProgressBar from './LinearProgressBar';
import { ObstacleContainer, ObstacleContent } from './ObstaclStyles.sc';
import {
    Line,
    ObstacleItem,
    ProgressBarContainer,
    StyledObstacleImage,
    StyledSkipButton,
    StyledTouchAppIcon,
    TouchContainer,
} from './TreeTrunk.sc';

export type Orientation = 'vertical' | 'horizontal';

const TreeTrunk: React.FunctionComponent = () => {
    const orientationOptions: Orientation[] = ['vertical', 'horizontal'];
    const tolerance = 10;
    const distance = 150;

    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(PlayerContext);
    const [skip, setSkip] = React.useState(false);
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);
    const [progress, setProgress] = React.useState(0);
    const [particles, setParticles] = React.useState(false);
    const [orientation] = React.useState(orientationOptions[Math.floor(Math.random() * orientationOptions.length)]);
    const [coordinates, setCoordinates] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });

    React.useEffect(() => {
        const touchContainer = document.getElementById('touchContainer');

        setTimeout(() => {
            if (progress === 0) {
                setSkip(true);
            }
        }, 10000);

        if (touchContainer) {
            const element = touchContainer.getBoundingClientRect();

            setCoordinates({
                top: element.top + tolerance,
                right: element.right + tolerance,
                bottom: element.bottom + tolerance,
                left: element.left + tolerance,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const solveObstacle = () => {
        controllerSocket?.emit({ type: 'game1/obstacleSolved', obstacleId: obstacle!.id });
        setShowInstructions(false);
        setObstacle(roomId, undefined);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTouch = (e: any) => {
        if (
            e.touches[0].clientX >= coordinates.left &&
            e.touches[0].clientX <= coordinates.right &&
            e.touches[0].clientY >= coordinates.top &&
            e.touches[0].clientY <= coordinates.bottom
        ) {
            setProgress(progress + 1);

            if (progress === distance) {
                solveObstacle();
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTouchStart = (e: any) => {
        e.preventDefault();
        setParticles(true);
    };

    return (
        <ObstacleContainer>
            <ProgressBarContainer>
                <LinearProgressBar MAX={distance} progress={progress} />
            </ProgressBarContainer>
            <ObstacleContent>
                <ObstacleItem orientation={orientation}>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <TouchContainer
                    id="touchContainer"
                    onTouchEnd={() => setParticles(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouch}
                    orientation={orientation}
                >
                    {skip && (
                        <StyledSkipButton>
                            <Button onClick={solveObstacle}>Skip</Button>
                        </StyledSkipButton>
                    )}
                    <Line orientation={orientation} />
                    {showInstructions && <StyledTouchAppIcon orientation={orientation} />}
                </TouchContainer>
                {particles && <StyledParticles params={treeParticlesConfig} />}
            </ObstacleContent>
        </ObstacleContainer>
    );
};

export default TreeTrunk;
