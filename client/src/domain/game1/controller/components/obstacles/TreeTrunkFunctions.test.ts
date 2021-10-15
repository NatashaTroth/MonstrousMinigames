/* eslint-disable simple-import-sort/imports */
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { Orientation } from './TreeTrunk';
import { handleTouchEnd, handleTouchStart, setTranslate } from './TreeTrunkFunctions';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('handleTouchEnd', () => {
    const props = {
        e: {
            changedTouches: [
                {
                    clientY: 100,
                    clientX: 100,
                },
            ],
            touches: [
                {
                    clientY: 100,
                    clientX: 100,
                },
            ],
            preventDefault: () => {
                // do nothing
            },
        },
        touchStart: {
            clientY: 1,
            clientX: 2,
        },
        coordinates: {
            top: 0,
            left: 0,
            bottom: 500,
            right: 500,
        },
        distance: 5,
        orientation: 'vertical' as Orientation,
        progress: 0,
        solveObstacle: jest.fn(),
        setProgress: jest.fn(),
        setOrientation: jest.fn(),
        setFailed: jest.fn(),
        orientationOptions: ['vertical', 'horizontal'] as Orientation[],
        trunksToFinish: 5,
        setTouchStart: jest.fn(),
        setParticles: jest.fn(),
    };

    it('if handleTouchEnd is called, touchStart should be set to undefined', () => {
        const setTouchStart = jest.fn();

        handleTouchEnd({ ...props, setTouchStart });

        expect(setTouchStart).toHaveBeenCalledWith(undefined);
    });

    it('if handleTouchEnd is called and all trunks are solved, solveObstacle should be called', () => {
        const solveObstacle = jest.fn();

        handleTouchEnd({ ...props, solveObstacle, progress: 4 });

        expect(solveObstacle).toHaveBeenCalledTimes(1);
    });

    it('if handleTouchEnd is called and not all trunks are solved, setProgress should be called', () => {
        const setProgress = jest.fn();

        handleTouchEnd({ ...props, setProgress, progress: 1 });

        expect(setProgress).toHaveBeenCalledTimes(1);
    });

    it('if handleTouchEnd is called and touch was not in container boundaries, setFailed should be called', () => {
        const setFailed = jest.fn();

        handleTouchEnd({
            ...props,
            setFailed,
            e: {
                ...props.e,
                changedTouches: [
                    {
                        clientY: 0,
                        clientX: 0,
                    },
                ],
            },
        });

        expect(setFailed).toHaveBeenCalledWith(true);
    });

    it('if touchStart is undefined, setFailed should not be called', () => {
        const setFailed = jest.fn();

        handleTouchEnd({
            ...props,
            touchStart: undefined,
            setFailed,
            e: {
                ...props.e,
                changedTouches: [
                    {
                        clientY: 0,
                        clientX: 0,
                    },
                ],
            },
        });

        expect(setFailed).toHaveBeenCalledTimes(0);
    });
});

describe('setTranslate', () => {
    it('transform should be set with handed positions', () => {
        const xPos = 10;
        const yPos = 20;
        const mockElement = document.createElement('div');

        setTranslate(xPos, yPos, mockElement);

        expect(mockElement.style.transform).toBe(`translate3d(${xPos}px, ${yPos}px, 0)`);
    });
});

describe('handleTouchStart', () => {
    const props = {
        e: {
            changedTouches: [
                {
                    clientY: 100,
                    clientX: 100,
                },
            ],
            touches: [
                {
                    clientY: 100,
                    clientX: 100,
                },
            ],
            preventDefault: () => {
                // do nothing
            },
        },
        yOffset: 5,
        xOffset: 0,
        tolerance: 0,
        setCoordinates: jest.fn(),
        setFailed: jest.fn(),
        setTouchStart: jest.fn(),
        setParticles: jest.fn(),
    };

    it('if handleTouchStart is called, touchStart should be set to undefined', () => {
        const setTouchStart = jest.fn();

        handleTouchStart({ ...props, setTouchStart });

        expect(setTouchStart).toHaveBeenCalledWith(props.e.touches[0]);
    });

    it('if touchContainer exists, setCoordinates should be called', () => {
        const setCoordinates = jest.fn();

        const touchContainer = document.createElement('div');
        touchContainer.setAttribute('id', 'touchContainer');
        document.body.appendChild(touchContainer);

        handleTouchStart({ ...props, setCoordinates });

        expect(setCoordinates).toHaveBeenCalledTimes(1);
    });
});
