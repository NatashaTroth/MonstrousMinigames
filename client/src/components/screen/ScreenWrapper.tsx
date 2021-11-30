import * as React from "react";
import { isMobileOnly } from "react-device-detect";
import { AudioPlayerProvider } from "react-use-audio-player";

import AudioContext2Provider from "../../contexts/AudioContext2Provider";

const ScreenWrapper: React.FunctionComponent = ({ children }) => {
    return (
        <>
            {isMobileOnly ? (
                children
            ) : (
                <AudioPlayerProvider>
                    <AudioContext2Provider>{children}</AudioContext2Provider>
                </AudioPlayerProvider>
            )}
        </>
    );
};

export default ScreenWrapper;
