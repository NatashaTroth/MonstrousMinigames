import { FirebaseStorage, ref, uploadBytes } from '@firebase/storage';

export default async function uploadFile(
    storage: FirebaseStorage,
    image: File,
    roomId: string,
    userId: string,
    challengeId: number
) {
    const storageRef = ref(storage, `${roomId}/${challengeId}/${userId}.jpg`);
    await uploadBytes(storageRef, image);

    return true;
}
