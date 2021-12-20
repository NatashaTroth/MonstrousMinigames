import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import * as React from 'react';

import { firebaseConfig } from '../config/firebaseConfig';
import { deleteFiles } from '../domain/game3/controller/gameState/handleFiles';
import { RemoteStorage, RemoteStorageAdapter } from '../domain/storage/RemoteStorage';

export const defaultValue = {
    storage: undefined,
    deleteImages: () => {
        // do nothing
    },
};

interface FirebaseContextProps {
    storage: RemoteStorage | undefined;
    deleteImages: (roomId: string | undefined) => void;
}

export const FirebaseContext = React.createContext<FirebaseContextProps>(defaultValue);

const FirebaseContextProvider: React.FunctionComponent = ({ children }) => {
    const [storage, setStorage] = React.useState<RemoteStorage | undefined>();

    React.useEffect(() => {
        const firebaseApp = initializeApp(firebaseConfig);
        const firebaseStorage = getStorage(firebaseApp);
        setStorage(new RemoteStorageAdapter(firebaseStorage));
    }, []);

    const content = {
        storage,
        deleteImages: (roomId: string | undefined) => deleteFiles(storage, roomId),
    };
    return <FirebaseContext.Provider value={content}>{children}</FirebaseContext.Provider>;
};

export default FirebaseContextProvider;
