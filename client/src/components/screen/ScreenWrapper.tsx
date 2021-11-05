import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';

import AudioContextProvider from '../../contexts/AudioContextProvider';

const ScreenWrapper: React.FunctionComponent = ({ children }) => {
    return <>{isMobileOnly ? children : <AudioContextProvider>{children}</AudioContextProvider>}</>;
};

export default ScreenWrapper;
