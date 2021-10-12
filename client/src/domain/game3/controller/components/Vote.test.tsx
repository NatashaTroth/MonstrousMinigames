/* eslint-disable simple-import-sort/imports */
import "jest-styled-components";
import { cleanup } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount, shallow } from "enzyme";
import React from "react";

import theme from "../../../../styles/theme";
import Vote from "./Vote";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Vote', () => {
    it('renders instruction', () => {
        const givenText = 'Choose the picture you like the most';
        const container = shallow(
            <ThemeProvider theme={theme}>
                <Vote />
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.text() === givenText)).toBeTruthy();
    });

    it('renders as much buttons as images', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Vote />
            </ThemeProvider>
        );

        expect(container.find('button')).toHaveLength(3);
    });
});
