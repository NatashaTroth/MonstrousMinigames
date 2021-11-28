import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import * as React from "react";

import { firebaseConfig } from "../config/firebaseConfig";
import { deleteFiles } from "../domain/game3/controller/gameState/handleFiles";

export const defaultValue = {
    storage: undefined,
    deleteImages: () => {
        // do nothing
    },
};

interface FirebaseContextProps {
    storage: FirebaseStorage | undefined;
    deleteImages: (roomId: string | undefined) => void;
}

export const FirebaseContext = React.createContext<FirebaseContextProps>(defaultValue);

const FirebaseContextProvider: React.FunctionComponent = ({ children }) => {
    const [storage, setStorage] = React.useState<FirebaseStorage | undefined>();

    React.useEffect(() => {
        const firebaseApp = initializeApp(firebaseConfig);

        setStorage(getStorage(firebaseApp));
    }, []);

    const content = {
        storage,
        deleteImages: (roomId: string | undefined) => deleteFiles(storage, roomId),
    };
    return <FirebaseContext.Provider value={content}>{children}</FirebaseContext.Provider>;
};

export default FirebaseContextProvider;
