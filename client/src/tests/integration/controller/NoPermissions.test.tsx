// eslint-disable-next-line simple-import-sort/imports
import "jest-styled-components";
import { cleanup, fireEvent, render } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure } from "enzyme";
import { ThemeProvider } from "styled-components";
import React from "react";

import { NoPermissions } from "../../../components/controller/NoPermissions";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('NoPermissions', () => {
    it('handed getMicrophonePermission should be called', () => {
        const getMicrophonePermissions = jest.fn();
        const getMotionPermissions = jest.fn();
        const setSkipped = jest.fn();

        const { container } = render(
            <ThemeProvider theme={theme}>
                <NoPermissions
                    getMicrophonePermission={getMicrophonePermissions}
                    getMotionPermission={getMotionPermissions}
                    setSkipped={setSkipped}
                />
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(getMicrophonePermissions).toHaveBeenCalledTimes(1);
        }
    });

    it('handed getMotionPermission should be called', () => {
        const getMicrophonePermissions = jest.fn();
        const getMotionPermissions = jest.fn();
        const setSkipped = jest.fn();

        const { container } = render(
            <ThemeProvider theme={theme}>
                <NoPermissions
                    getMicrophonePermission={getMicrophonePermissions}
                    getMotionPermission={getMotionPermissions}
                    setSkipped={setSkipped}
                />
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(getMotionPermissions).toHaveBeenCalledTimes(1);
        }
    });
});
