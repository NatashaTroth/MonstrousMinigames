import Compressor from 'compressorjs';

import { MessageTypesGame3 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';
import { RemoteStorage } from '../../../storage/RemoteStorage';
import { UploadProps } from '../components/TakePicture';

export default async function uploadFile(
    values: UploadProps,
    remoteStorage: RemoteStorage | undefined,
    roomId: string | undefined,
    userId: string,
    roundIdx: number,
    controllerSocket: Socket,
    uploadedImagesCount: number
) {
    if (!values.picture) return false;

    if (remoteStorage && roomId) {
        const path = `${roomId}/${roundIdx}/${userId}${uploadedImagesCount}.jpg`;

        try {
            new Compressor(values.picture, {
                quality: 0.5,
                success: async compressedResult => {
                    const imageUrl = await remoteStorage.uploadImage(path, compressedResult);

                    if (imageUrl) {
                        controllerSocket.emit({
                            type: MessageTypesGame3.photo,
                            photographerId: userId,
                            url: imageUrl,
                        });
                    } else {
                        controllerSocket.emit({
                            type: MessageTypesGame3.errorUploadingPhoto,
                            errorMsg: JSON.stringify(imageUrl),
                        });
                    }
                },
            });
        } catch (error) {
            controllerSocket.emit({
                type: MessageTypesGame3.errorUploadingPhoto,
                errorMsg: JSON.stringify(error),
            });
        }
    }
}

export async function deleteFiles(remoteStorage: RemoteStorage | undefined, roomId: string | undefined) {
    if (remoteStorage && roomId) {
        remoteStorage.deleteImages(`${roomId}/`);
    }
}
