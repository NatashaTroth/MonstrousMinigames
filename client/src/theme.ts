import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        status: {
            checked: string;
        };
    }
    interface ThemeOptions {
        status?: {
            checked?: string;
        };
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#a7bdb1',
        },
        secondary: {
            main: '#d2a44f',
        },
    },
    status: {
        checked: 'black',
    },
});

export default theme;
