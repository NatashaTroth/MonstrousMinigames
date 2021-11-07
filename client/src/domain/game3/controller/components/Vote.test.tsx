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
    it('renders the heading', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Vote />
            </ThemeProvider>
        );

        expect(container.find('p')).toHaveLength(1);
    });
    // TODO: test the ui after a statechange has happened
});
