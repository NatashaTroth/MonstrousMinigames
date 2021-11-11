import { GameOneEventMessage } from './GameOneEventMessages';

export interface NamespaceAdapter {
    to: (roomId: string) => NamespaceAdapter;
    emit: (messageName: string, message: GameOneEventMessage) => void;
}
