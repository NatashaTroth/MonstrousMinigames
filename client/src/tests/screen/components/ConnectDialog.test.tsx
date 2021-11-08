import { cleanup } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import ConnectDialog from "../../../components/screen/ConnectDialog";
import { defaultValue, ScreenSocketContext } from "../../../contexts/ScreenSocketContextProvider";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });
afterEach(cleanup);
describe('Screen ConnectScreen', () => {
    it('when connect button is clicked, handleSocketConnection function should be called', () => {
        const handleSocketConnectionFunction = jest.fn();
        const wrapper = mount(
            <ThemeProvider theme={theme}>
                <Router>
                    <ScreenSocketContext.Provider
                        value={{ ...defaultValue, handleSocketConnection: handleSocketConnectionFunction }}
                    >
                        <ConnectDialog
                            open={true}
                            handleClose={() => {
                                //do nothing
                            }}
                        />
                    </ScreenSocketContext.Provider>
                </Router>
            </ThemeProvider>
        );
        const input = wrapper.find('input');
        const form = wrapper.find('form');

        input.simulate('focus');
        input.simulate('change', { target: { value: 'RoomCode' } });
        input.simulate('keyDown', {
            which: 27,
            target: {
                blur() {
                    input.simulate('blur');
                },
            },
        });
        form.simulate('submit');

        expect(handleSocketConnectionFunction).toHaveBeenCalledTimes(1);
    });
});
