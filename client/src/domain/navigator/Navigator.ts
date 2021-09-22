export interface UserMediaProps {
    audio: boolean;
}

export interface Navigator {
    mediaDevices?:
        | {
              getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null>;
          }
        | undefined;
}
