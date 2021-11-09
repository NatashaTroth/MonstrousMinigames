import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';

import { generateQRCode } from '../../utils/generateQRCode';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('generateQRCode function', () => {
    it('should add canvas to element', () => {
        const elementId = 'qrCode';
        const container = mount(<div id={elementId} />);
        generateQRCode(`http://www.google.com`, elementId);
        expect(container.find('canvas')).toBeTruthy();
    });
});
