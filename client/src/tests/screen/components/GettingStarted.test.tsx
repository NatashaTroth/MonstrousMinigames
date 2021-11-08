import { cleanup } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import React from "react";
import { ThemeProvider } from "styled-components";

import GettingStartedDialog from "../../../components/screen/GettingStarted";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });
afterEach(cleanup);

describe('GettingStarted', () => {
    it('renders given headline text', () => {
        const givenText = 'Welcome to Monstrous Mini Games!';
        const container = mount(
            <ThemeProvider theme={theme}>
                <GettingStartedDialog handleClose={jest.fn()} open={true} />
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.text() === givenText)).toBeTruthy();
    });
});
