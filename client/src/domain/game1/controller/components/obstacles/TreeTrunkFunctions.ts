import { ComponentToTest } from "../../../../../components/controller/Tutorial";
import { ObstacleTypes } from "../../../../../utils/constants";
import { Coordinates, Orientation, TouchStart } from "./TreeTrunk";

export const isInContainer = (touches: TouchStart, coordinates: Coordinates) =>
    touches.clientX >= coordinates.left &&
    touches.clientX <= coordinates.right &&
    touches.clientY >= coordinates.top &&
    touches.clientY <= coordinates.bottom;

export function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    el.style.opacity = '1';
}

export function newTrunk(orientationOptions: Orientation[], setOrientation: (orientation: Orientation) => void) {
    const newOrientation = orientationOptions[Math.floor(Math.random() * orientationOptions.length)];
    setOrientation(newOrientation);
}

interface TouchEvent {
    changedTouches: Array<{
        clientX: number;
        clientY: number;
    }>;
    touches: Array<{
        clientX: number;
        clientY: number;
    }>;
    preventDefault: () => void;
}

interface HandleTouchEvent {
    e: TouchEvent;
    setFailed: (val: boolean) => void;
}

interface HandleTouchEnd extends HandleTouchEvent {
    touchStart: TouchStart | undefined;
    coordinates: Coordinates;
    distance: number;
    orientation: 'vertical' | 'horizontal';
    progress: number;
    orientationOptions: Orientation[];
    trunksToFinish: number;
    tutorial: boolean;
    solveObstacle: () => void;
    setProgress: (val: number) => void;
    setOrientation: (orientation: Orientation) => void;
    setTouchStart: (val: undefined | TouchStart) => void;
    setParticles: (val: boolean) => void;
    handleTutorialFinished: (val: ComponentToTest) => void;
}

export function handleTouchEnd(props: HandleTouchEnd) {
    const {
        e,
        touchStart,
        coordinates,
        distance,
        orientation,
        progress,
        solveObstacle,
        setProgress,
        setOrientation,
        setFailed,
        orientationOptions,
        trunksToFinish,
        setTouchStart,
        setParticles,
        tutorial,
        handleTutorialFinished,
    } = props;

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
                if (tutorial) {
                    handleTutorialFinished(ObstacleTypes.spider);
                } else {
                    solveObstacle();
                }
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
}

interface HandleTouchStart extends HandleTouchEvent {
    yOffset: number;
    tolerance: number;
    xOffset: number;
    setCoordinates: (val: Coordinates) => void;
    setTouchStart: (val: undefined | TouchStart) => void;
    setParticles: (val: boolean) => void;
}

export function handleTouchStart(props: HandleTouchStart) {
    const { e, setCoordinates, setFailed, setTouchStart, setParticles, tolerance, xOffset, yOffset } = props;

    e.preventDefault();
    setFailed(false);
    const touchContainer = document.getElementById('touchContainer');

    const newInitialX = e.touches[0].clientX - xOffset;
    const newInitialY = e.touches[0].clientY - yOffset;

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

    return { newInitialX, newInitialY };
}
