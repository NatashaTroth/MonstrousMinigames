/* eslint-disable simple-import-sort/imports */
import "jest-styled-components";
import { cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import Carousel from "react-multi-carousel";

import ChooseCharacter from "../../../components/controller/ChooseCharacter";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Choose Character', () => {
    it('renders as a carousel', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ChooseCharacter />
            </ThemeProvider>
        );

        expect(container.find(Carousel)).toBeTruthy();
    });
});
