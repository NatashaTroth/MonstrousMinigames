import { GameThreeEventMessage } from './GameThreeEventMessages';

export interface NamespaceAdapter {
    to: (roomId: string) => NamespaceAdapter;
    emit: (messageName: string, message: GameThreeEventMessage) => void;
}
