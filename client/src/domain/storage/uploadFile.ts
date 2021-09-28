import { FirebaseStorage, ref, uploadBytes } from '@firebase/storage';

export default function uploadFile(
    storage: FirebaseStorage,
    image: File,
    roomId: string,
    userId: string,
    challengeId: number
) {
    const storageRef = ref(storage, `${roomId}/${userId}${challengeId}.jpg`);

    uploadBytes(storageRef, image).then(snapshot => {
        // eslint-disable-next-line no-console
        console.log('Uploaded a blob or file!');
    });
}
