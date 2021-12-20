import { GameTwoEventMessage } from './GameTwoEventMessages';

export interface NamespaceAdapter {
    to: (roomId: string) => NamespaceAdapter;
    emit: (messageName: string, message: GameTwoEventMessage) => void;
}
