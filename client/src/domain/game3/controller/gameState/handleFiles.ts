import Compressor from 'compressorjs';

import { MessageTypesGame3 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';
import { RemoteStorage } from '../../../storage/RemoteStorage';
import { UploadProps } from '../components/TakePicture';

interface Dependencies {
    remoteStorage: RemoteStorage | undefined;
    roomId: string | undefined;
    userId: string;
    roundIdx: number;
    controllerSocket: Socket;
    setUploadedImagesCount: (val: number) => void;
    setLoading: (val: boolean) => void;
}

export const uploadFile = (dependencies: Dependencies) => async (values: UploadProps, uploadedImagesCount: number) => {
    if (!values.picture) return false;

    const {
        remoteStorage,
        roomId,
        roundIdx,
        userId,
        controllerSocket,
        setUploadedImagesCount,
        setLoading,
    } = dependencies;
    setLoading(true);

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

                        setUploadedImagesCount(uploadedImagesCount + 1);
                    } else {
                        controllerSocket.emit({
                            type: MessageTypesGame3.errorUploadingPhoto,
                            errorMsg: JSON.stringify(imageUrl),
                        });
                    }

                    setLoading(false);
                },
                error: error => {
                    controllerSocket.emit({
                        type: MessageTypesGame3.errorUploadingPhoto,
                        errorMsg: JSON.stringify(error),
                    });

                    setLoading(false);
                },
            });
        } catch (error) {
            controllerSocket.emit({
                type: MessageTypesGame3.errorUploadingPhoto,
                errorMsg: JSON.stringify(error),
            });

            setLoading(false);
        }
    } else {
        setLoading(false);
    }
};

export async function deleteFiles(remoteStorage: RemoteStorage | undefined, roomId: string | undefined) {
    if (remoteStorage && roomId) {
        remoteStorage.deleteImages(`${roomId}/`);
    }
}
