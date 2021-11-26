import 'reflect-metadata';

import { Photos } from '../../../../src/gameplay/gameThree/classes/Photos';
import { mockPhotoUrl, users } from '../../mockData';

let photos: Photos;

const maxNumberPhotos = 2;

describe('Get photos', () => {
    beforeEach(() => {
        photos = new Photos(maxNumberPhotos);
    });

    it('should return an empty array when no photos have been added', () => {
        expect(photos.getPhotos().length).toBe(0);
    });

    it('should return an added url', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getPhotos().find(photo => photo.photographerId === users[0].id)!.urls.length).toBe(1);
    });

    it('should return multiple added urls', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getPhotos().find(photo => photo.photographerId === users[0].id)!.urls.length).toBe(2);
    });

    it('should not exceed max number of photos per user', () => {
        for (let i = 0; i <= maxNumberPhotos; i++) {
            photos.addPhoto(users[0].id, mockPhotoUrl);
        }
        expect(photos.getPhotos().find(photo => photo.photographerId === users[0].id)!.urls.length).toBe(2);
    });
});

describe('Get photos urls', () => {
    beforeEach(() => {
        photos = new Photos(maxNumberPhotos);
    });

    it('should return an empty array when no photos have been added', () => {
        expect(photos.getPhotosUrls().length).toBe(0);
    });

    it('should return an added url', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getPhotosUrls().length).toBe(1);
    });

    it('should return multiple added urls', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getPhotosUrls().length).toBe(2);
    });
});

describe('Have Photos from all Users', () => {
    beforeEach(() => {
        photos = new Photos(maxNumberPhotos);
    });

    it('should return false when no photos have been received', () => {
        expect(photos.havePhotosFromAllUsers(users.map(user => user.id))).toBeFalsy();
    });

    it('should return false when not all photos have been received', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.havePhotosFromAllUsers(users.map(user => user.id))).toBeFalsy();
    });

    it('should return truthy when photos have been received', () => {
        users.forEach(user => {
            for (let i = 0; i < maxNumberPhotos; i++) {
                photos.addPhoto(user.id, mockPhotoUrl);
            }
        });
        expect(photos.havePhotosFromAllUsers(users.map(user => user.id))).toBeTruthy();
    });
});

describe('Have Photos from all Users', () => {
    beforeEach(() => {
        photos = new Photos(maxNumberPhotos);
    });

    it('should return 0 when no photos have been received', () => {
        expect(photos.getNumberPhotos(users[0].id)).toBe(0);
    });

    it('should return 1 when a photo has been received', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getNumberPhotos(users[0].id)).toBe(1);
    });

    it('should return 2 when a photo has been received', () => {
        photos.addPhoto(users[0].id, mockPhotoUrl);
        photos.addPhoto(users[0].id, mockPhotoUrl);
        expect(photos.getNumberPhotos(users[0].id)).toBe(2);
    });

    it('should not exceed max number of photos', () => {
        for (let i = 0; i <= maxNumberPhotos; i++) {
            photos.addPhoto(users[0].id, mockPhotoUrl);
        }
        expect(photos.getNumberPhotos(users[0].id)).toBe(2);
    });
});
