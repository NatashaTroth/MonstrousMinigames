import { GameThreeEventMessage } from './interfaces/GameThreeEventMessages';

export interface NamespaceAdapter {
    to: (roomId: string) => NamespaceAdapter;
    emit: (messageName: string, message: GameThreeEventMessage) => void;
}
