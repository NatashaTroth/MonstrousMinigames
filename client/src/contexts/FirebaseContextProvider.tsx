import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import * as React from "react";

import { firebaseConfig } from "../config/firebaseConfig";

export const defaultValue = {
    storage: undefined,
};

interface FirebaseContextProps {
    storage: FirebaseStorage | undefined;
}

export const FirebaseContext = React.createContext<FirebaseContextProps>(defaultValue);

const FirebaseContextProvider: React.FunctionComponent = ({ children }) => {
    const [storage, setStorage] = React.useState<FirebaseStorage | undefined>();

    React.useEffect(() => {
        // eslint-disable-next-line
        console.log(storage)
        const firebaseApp = initializeApp(firebaseConfig);

        setStorage(getStorage(firebaseApp));
    }, []);

    const content = {
        storage,
    };
    return <FirebaseContext.Provider value={content}>{children}</FirebaseContext.Provider>;
};

export default FirebaseContextProvider;
