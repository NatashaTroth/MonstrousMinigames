import * as React from "react";

import Button from "../../../../../components/common/Button";
import { StyledParticles } from "../../../../../components/common/Particles.sc";
import { ComponentToTest } from "../../../../../components/controller/Tutorial";
import { treeParticlesConfig } from "../../../../../config/particlesConfig";
import {
    ControllerSocketContext
} from "../../../../../contexts/controller/ControllerSocketContextProvider";
import { Game1Context, Obstacle } from "../../../../../contexts/game1/Game1ContextProvider";
import { GameContext } from "../../../../../contexts/GameContextProvider";
import wood from "../../../../../images/obstacles/wood/wood.svg";
import { MessageTypesGame1 } from "../../../../../utils/constants";
import { Socket } from "../../../../socket/Socket";
import LinearProgressBar from "./LinearProgressBar";
import { ObstacleContainer, ObstacleContent, ObstacleInstructions } from "./ObstacleStyles.sc";
import {
    DragItem, Line, ObstacleItem, ProgressBarContainer, StyledObstacleImage, StyledSkipButton,
    StyledTouchAppIcon, TouchContainer
} from "./TreeTrunk.sc";
import { handleTouchEnd, handleTouchStart, newTrunk, setTranslate } from "./TreeTrunkFunctions";

export type Orientation = 'vertical' | 'horizontal';

export interface Coordinates {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface TouchStart {
    clientX: number;
    clientY: number;
}

interface TreeTrunkProps {
    tutorial?: boolean;
    handleTutorialFinished?: (val: ComponentToTest) => void;
}

const TreeTrunk: React.FunctionComponent<TreeTrunkProps> = ({
    tutorial = false,
    handleTutorialFinished = () => {
        // do nothing
    },
}) => {
    const orientationOptions: Orientation[] = ['vertical', 'horizontal'];
    const tolerance = 10;
    const distance = 80;
    const trunksToFinish = 5;

    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { obstacle, setObstacle } = React.useContext(Game1Context);
    const [skip, setSkip] = React.useState(false);
    const { showInstructions, setShowInstructions, roomId } = React.useContext(GameContext);
    const [progress, setProgress] = React.useState(0);
    const [particles, setParticles] = React.useState(false);
    const [orientation, setOrientation] = React.useState(
        orientationOptions[Math.floor(Math.random() * orientationOptions.length)]
    );
    const [coordinates, setCoordinates] = React.useState<Coordinates>({ top: 0, right: 0, bottom: 0, left: 0 });
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
            setSkip(true);
        }, 10000);

        newTrunk(orientationOptions, setOrientation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const touchContainer = document.getElementById(`touchContainer`);

        touchContainer?.addEventListener('touchstart', onTouchStart, { passive: false });
        touchContainer?.addEventListener('touchmove', drag, { passive: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drag = (e: any) => {
        e.preventDefault();
        const dragItem = document.getElementById('dragItem');

        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem!);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTouchStart = (e: any) => {
        const { newInitialX, newInitialY } = handleTouchStart({
            e,
            tolerance,
            setTouchStart,
            setCoordinates,
            setFailed,
            setParticles,
            xOffset,
            yOffset,
        });

        initialX = newInitialX;
        initialY = newInitialY;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTouchEnd = (e: any) => {
        handleTouchEnd({
            e,
            touchStart,
            coordinates,
            distance,
            setFailed,
            setOrientation,
            setParticles,
            setProgress,
            setTouchStart,
            progress,
            orientation,
            orientationOptions,
            solveObstacle: () =>
                solveObstacle({
                    controllerSocket,
                    obstacle,
                    roomId,
                    setObstacle,
                    setShowInstructions,
                }),
            trunksToFinish,
            tutorial,
            handleTutorialFinished,
        });
    };

    return (
        <ObstacleContainer>
            <ProgressBarContainer>
                <LinearProgressBar MAX={trunksToFinish} progress={progress} key={`progressbar${progress}`} />
            </ProgressBarContainer>
            <ObstacleInstructions>Remove the tree trunk by cutting it along the line</ObstacleInstructions>
            <ObstacleContent>
                <ObstacleItem orientation={orientation}>
                    <StyledObstacleImage src={wood} key={`trunk${progress}`} id="wood" />
                </ObstacleItem>
                <TouchContainer
                    id={`touchContainer`}
                    onTouchEnd={onTouchEnd}
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
                    <Button
                        onClick={() =>
                            solveObstacle({
                                controllerSocket,
                                obstacle,
                                roomId,
                                setObstacle,
                                setShowInstructions,
                            })
                        }
                    >
                        Skip
                    </Button>
                </StyledSkipButton>
            )}
        </ObstacleContainer>
    );
};

export default TreeTrunk;

interface SolveObstacle {
    controllerSocket: Socket;
    obstacle: Obstacle | undefined;
    roomId: string | undefined;
    setShowInstructions: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: Obstacle | undefined) => void;
}

export const solveObstacle = (props: SolveObstacle) => {
    const { controllerSocket, obstacle, roomId, setObstacle, setShowInstructions } = props;

    controllerSocket?.emit({ type: MessageTypesGame1.obstacleSolved, obstacleId: obstacle!.id });
    setShowInstructions(false);
    setObstacle(roomId, undefined);
};
