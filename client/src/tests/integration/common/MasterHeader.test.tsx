// eslint-disable-next-line simple-import-sort/imports
import "jest-styled-components";
import { cleanup } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import { ThemeProvider } from "styled-components";
import React from "react";

import MasterHeader from "../../../components/common/MasterHeader";
import { defaultValue, MyAudioContext } from "../../../contexts/AudioContextProvider";
import history from "../../../domain/history/history";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('MasterHeader', () => {
    it('redirects to settings when settings icon is clicked', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <MyAudioContext.Provider value={{ ...defaultValue, isPlaying: false }}>
                    <MasterHeader history={history} />
                </MyAudioContext.Provider>
            </ThemeProvider>
        );

        container.find('button').first().simulate('click');

        expect(history.location).toHaveProperty('pathname', `/settings`);
    });
});
