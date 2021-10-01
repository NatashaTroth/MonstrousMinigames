import { FirebaseStorage, ref, uploadBytes } from '@firebase/storage';
import { getDownloadURL } from 'firebase/storage';

export default async function uploadFile(
    storage: FirebaseStorage,
    image: File,
    roomId: string,
    userId: string,
    challengeId: number
) {
    const storageRef = ref(storage, `${roomId}/${challengeId}/${userId}.jpg`);
    const uploadedImage = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(uploadedImage.ref);

    return imageUrl;
}
