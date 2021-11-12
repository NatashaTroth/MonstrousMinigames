import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { deleteObject, listAll } from "firebase/storage";

import { MessageTypesGame3 } from "../../../../utils/constants";
import { Socket } from "../../../socket/Socket";
import { UploadProps } from "../components/TakePicture";

export default async function uploadFile(
    values: UploadProps,
    storage: FirebaseStorage | undefined,
    roomId: string | undefined,
    userId: string,
    roundIdx: number,
    controllerSocket: Socket,
    uploadedImagesCount: number
) {
    if (!values.picture) return false;

    if (storage && roomId) {
        const storageRef = ref(storage, `${roomId}/${roundIdx}/${userId}${uploadedImagesCount}.jpg`);
        const uploadedImage = await uploadBytes(storageRef, values.picture);
        const imageUrl = await getDownloadURL(uploadedImage.ref);

        if (imageUrl) {
            controllerSocket.emit({
                type: MessageTypesGame3.photo,
                userId,
                url: imageUrl,
            });
        }
    }
}

export async function deleteFiles(storage: FirebaseStorage | undefined, roomId: string | undefined) {
    if (storage && roomId) {
        const path = `${roomId}/`;
        deleteFolderContents(path, storage);
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
        deleteObject(childRef)
            .then(() => {
                // File deleted successfully
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }
}
