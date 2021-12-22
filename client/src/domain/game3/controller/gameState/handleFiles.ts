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
        const imageUrl = await remoteStorage.uploadImage(
            `${roomId}/${roundIdx}/${userId}${uploadedImagesCount}.jpg`,
            values.picture
        );

        if (imageUrl) {
            controllerSocket.emit({
                type: MessageTypesGame3.photo,
                photographerId: userId,
                url: imageUrl,
            });
        }
    }
}

export async function deleteFiles(remoteStorage: RemoteStorage | undefined, roomId: string | undefined) {
    if (remoteStorage && roomId) {
        remoteStorage.deleteImages(`${roomId}/`);
    }
}
