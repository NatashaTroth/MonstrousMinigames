import * as colors from './colors';

export const sharedTextStyleProperties = {
    fontFamily: 'Roboto, Arial',
};

export const loadingTextStyleProperties = {
    ...sharedTextStyleProperties,
    align: 'center',
};

export const countdownTextStyleProperties = {
    ...sharedTextStyleProperties,
    color: colors.orange,
    stroke: colors.orange,
    strokeThickness: 15,
    align: 'center',
    shadow: {
        offsetX: 10,
        offsetY: 10,
        color: colors.black,
        blur: 0,
        stroke: false,
        fill: false,
    },
};
