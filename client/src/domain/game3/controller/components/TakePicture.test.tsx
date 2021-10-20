/* eslint-disable simple-import-sort/imports */
import "jest-styled-components";
import { cleanup } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount, shallow } from "enzyme";
import React from "react";

import theme from "../../../../styles/theme";
import TakePicture from "./TakePicture";
import Vote from "./Vote";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('TakePicture', () => {
    it('renders a form', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <TakePicture />
            </ThemeProvider>
        );

        expect(container.find('form')).toHaveLength(1);
    });
});
