import * as React from "react";
import { isMobileOnly } from "react-device-detect";

import AudioContext2Provider from "../../contexts/AudioContext2Provider";

const ScreenWrapper: React.FunctionComponent = ({ children }) => {
    return <>{isMobileOnly ? children : <AudioContext2Provider>{children}</AudioContext2Provider>}</>;
};

export default ScreenWrapper;
