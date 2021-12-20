import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { deleteObject, listAll } from 'firebase/storage';

export interface RemoteStorage {
    uploadImage: (path: string, picture: File) => Promise<string>;
    deleteImages: (path: string) => Promise<void>;
}

export class RemoteStorageAdapter implements RemoteStorage {
    storage: FirebaseStorage;

    constructor(storage: FirebaseStorage) {
        this.storage = storage;
    }

    async uploadImage(path: string, picture: File) {
        const storageRef = ref(this.storage, path);
        const uploadedImage = await uploadBytes(storageRef, picture);
        return await getDownloadURL(uploadedImage.ref);
    }

    async deleteImages(path: string) {
        deleteFolderContents(path, this.storage);
    }
}

function deleteFolderContents(path: string, storage: FirebaseStorage) {
    const storageRef = ref(storage, path);
    listAll(storageRef)
        .then(dir => {
            dir.items.forEach(fileRef => {
                deleteFile(storageRef.fullPath, fileRef.name, storage);
            });
            dir.prefixes.forEach(folderRef => {
                deleteFolderContents(folderRef.fullPath, storage);
            });
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
}

function deleteFile(pathToFile: string, fileName: string, storage: FirebaseStorage) {
    const childRef = ref(storage, `${pathToFile}/${fileName}`);

    // Delete the file
    deleteObject(childRef).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
    });
}

export class FakeRemoteStorage implements RemoteStorage {
    async uploadImage(path: string, picture: File): Promise<string> {
        return new Promise(resolve => {
            resolve('path');
        });
    }

    async deleteImages(path: string): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    }
}
