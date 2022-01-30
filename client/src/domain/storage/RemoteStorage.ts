import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { deleteObject, listAll } from 'firebase/storage';

export interface RemoteStorage {
    uploadImage: (path: string, picture: File | Blob) => Promise<string>;
    deleteImages: (path: string) => Promise<void>;
}

export class RemoteStorageAdapter implements RemoteStorage {
    storage: FirebaseStorage;

    constructor(storage: FirebaseStorage) {
        this.storage = storage;
    }

    async uploadImage(path: string, picture: File | Blob) {
        const storageRef = ref(this.storage, path);
        const uploadedImage = await uploadBytes(storageRef, picture);
        return await getDownloadURL(uploadedImage.ref);
    }

    async deleteImages(path: string) {
        await deleteFolderContents(path, this.storage);
    }
}

async function deleteFolderContents(path: string, storage: FirebaseStorage) {
    const storageRef = ref(storage, path);
    try {
        const dir = await listAll(storageRef);
        await Promise.all(
            dir.items.map(fileRef => {
                return deleteFile(storageRef.fullPath, fileRef.name, storage);
            })
        );
        await Promise.all(
            dir.prefixes.map(folderRef => {
                return deleteFolderContents(folderRef.fullPath, storage);
            })
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

async function deleteFile(pathToFile: string, fileName: string, storage: FirebaseStorage) {
    const childRef = ref(storage, `${pathToFile}/${fileName}`);

    // Delete the file
    await deleteObject(childRef).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
    });
}
