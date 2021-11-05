import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        status: {
            checked: string;
        };
        colors: {
            grey: string;
            lightgrey: string;
            progressBarGreen: string;
            progressBarLightGreen: string;
            progressBarExtremeLightGreen: string;
            qRCodeBackground: string;
            notReady: string;
            playerName: string;
            disabled: string;
            disabledShadow: string;
            readyButton: string;
            darkGreen: string;
            characterColors: string[];
        };
        boxShadowDepth: number;
    }
    interface ThemeOptions {
        status?: {
            checked?: string;
        };
        colors?: {
            grey?: string;
            lightgrey?: string;
            progressBarGreen?: string;
            progressBarLightGreen?: string;
            progressBarExtremeLightGreen?: string;
            qRCodeBackground?: string;
            notReady?: string;
            playerName?: string;
            disabled?: string;
            disabledShadow?: string;
            readyButton?: string;
            darkGreen?: string;
            characterColors?: string[];
        };
        boxShadowDepth?: number;
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#a7bdb1',
            dark: '#8c9d99',
        },
        secondary: {
            main: '#d2a44f',
            dark: '#7e5e34',
            light: '#ffc862',
        },
    },
    status: {
        checked: 'black',
    },
    colors: {
        grey: '#9c9c9c',
        lightgrey: '#e6e6e6',
        progressBarGreen: '#5c9402',
        progressBarLightGreen: '#6aac02',
        progressBarExtremeLightGreen: '#86d509',
        qRCodeBackground: '#5d3d83',
        notReady: '#8c9d99',
        playerName: '#ffe199',
        disabled: '#b9b8b8',
        disabledShadow: '#9a9a9a',
        readyButton: '#1c2a2b',
        darkGreen: '#0e1a18',
        characterColors: ['#1e8fe2', '#69a04e', '#b53cd4', '#b97d35'],
    },
    boxShadowDepth: 7,
});

export default theme;
