import { handleResume, handleStartGame } from '../../../domain/game1/screen/components/MainScene';
import { PhaserGame } from '../../../domain/phaser/PhaserGame';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleResume', () => {
    it('handleResume should emit pauseResume to socket', () => {
        const socket = new FakeInMemorySocket();

        handleResume(socket, PhaserGame.SCENE_NAME_GAME_1);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.pauseResume }]);
    });
});

describe('handleStartGame', () => {
    it('handleStartGame should emit startGame to socket', () => {
        const socket = new FakeInMemorySocket();
        const roomId = 'ADFS';

        handleStartGame(socket, roomId);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypes.startGame,
                roomId,
            },
        ]);
    });
});
