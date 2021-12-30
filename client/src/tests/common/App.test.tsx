import 'jest-styled-components';

import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';

import App from '../../App';
import { ConnectScreen } from '../../components/screen/ConnectScreen';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('App', () => {
    it('should render Connect Screen by default', () => {
        const container = mount(<App />);

        expect(container.find(ConnectScreen).length).toBe(1);
    });
});
