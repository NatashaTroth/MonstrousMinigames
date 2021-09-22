import { Navigator, UserMediaProps } from './Navigator';

export class NavigatorAdapter implements Navigator {
    public mediaDevices?: {
        getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null>;
    };

    constructor() {
        this.mediaDevices = global.navigator.mediaDevices;
    }
}

export const navigator = new NavigatorAdapter();
