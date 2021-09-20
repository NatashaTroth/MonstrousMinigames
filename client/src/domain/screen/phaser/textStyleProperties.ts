export const sharedTextStyleProperties = {
    fontFamily: 'Roboto, Arial',
};

export const loadingTextStyleProperties = {
    ...sharedTextStyleProperties,
    align: 'center',
};

export const countdownTextStyleProperties = {
    ...sharedTextStyleProperties,
    color: '#d2a44f',
    stroke: '#d2a44f',
    strokeThickness: 15,
    align: 'center',
    shadow: {
        offsetX: 10,
        offsetY: 10,
        color: '#000',
        blur: 0,
        stroke: false,
        fill: false,
    },
};
