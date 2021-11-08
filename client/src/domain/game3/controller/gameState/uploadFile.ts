import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from "@firebase/storage";

import { MessageTypesGame3 } from "../../../../utils/constants";
import { Socket } from "../../../socket/Socket";
import { UploadProps } from "../components/TakePicture";

export default async function uploadFile(
    values: UploadProps,
    storage: FirebaseStorage | undefined,
    roomId: string | undefined,
    userId: string,
    challengeId: number,
    controllerSocket: Socket
) {
    if (!values.picture) return false;

    if (storage && roomId) {
        const storageRef = ref(storage, `${roomId}/${challengeId}/${userId}.jpg`);
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
