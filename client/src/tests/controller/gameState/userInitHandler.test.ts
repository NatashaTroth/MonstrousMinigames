import { userInitHandler } from "../../../domain/commonGameState/controller/userInitHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { UserInitMessage } from "../../../domain/typeGuards/userInit";
import { MessageTypes } from "../../../utils/constants";

it('when UserInitMessage was written, handed persistUser is executed', async () => {
    const roomId = 'ABDE';
    const message: UserInitMessage = {
        name: 'Mock',
        type: MessageTypes.userInit,
        userId: '1',
        roomId,
        isAdmin: true,
        number: 1,
        ready: true,
    };

    const persistUser = jest.fn();

    const dependencies = {
        setPlayerNumber: jest.fn(),
        setName: jest.fn(),
        setUserId: jest.fn(),
        setReady: jest.fn(),
        persistUser,
    };

    const userInitHandlerWithDependencies = userInitHandler(dependencies);

    const socket = new InMemorySocketFake();

    userInitHandlerWithDependencies(socket);

    await socket.emit(message);

    expect(persistUser).toHaveBeenCalledTimes(1);
});
