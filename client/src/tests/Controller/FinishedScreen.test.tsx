import { cleanup } from '@testing-library/react';
import React from 'react';
import Client from 'socket.io-client';

import { InMemorySocketFake } from '../../utils/socket/InMemorySocketFake';

afterEach(cleanup);

describe('InMemorySocket', () => {
    it('when data was written, registered callback is called', () => {
        const socket = new InMemorySocketFake();

        const callback = jest.fn();
        socket.listen(callback);
        socket.emit('data');
        expect(callback).toHaveBeenLastCalledWith('data');
    });
});
// describe('Screen FinishedScreen', () => {
//     let io: Server, serverSocket: Socket, clientSocket: SocketIOClient.Socket;

//     beforeAll(done => {
//         const httpServer = createServer();
//         io = new Server(httpServer);
//         httpServer.listen(() => {
//             const port = (httpServer.address() as AddressInfo).port;
//             clientSocket = Client(`http://localhost:${port}`);
//             io.on('connection', socket => {
//                 serverSocket = socket;
//             });
//             clientSocket.on('connect', done);
//         });
//     });

//     afterAll(() => {
//         io.close();
//         clientSocket.close();
//     });

//     test('should work', done => {
//         clientSocket.on('hello', (arg: any) => {
//             expect(arg).toBe('world');
//             done();
//         });
//         serverSocket.emit('hello', 'world');
//     });

//     it('when player reaches the goal, it renders text "Finished!"', () => {
//         const givenText = 'Finished!';
//         const { container } = render(
//             <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
//                 <FinishedScreen />
//             </PlayerContext.Provider>
//         );
//         expect(queryByText(container, givenText)).toBeTruthy();
//     });

//     it('when game has timed out and the player don`t reaches the goal, it renders text "Game has timed out"', () => {
//         const givenText = 'Game has timed out';
//         const { container } = render(
//             <GameContext.Provider value={{ ...gameContextDefaultValue, hasTimedOut: true }}>
//                 <PlayerContext.Provider value={{ ...defaultValue, playerRank: undefined }}>
//                     <FinishedScreen />
//                 </PlayerContext.Provider>
//             </GameContext.Provider>
//         );
//         expect(queryByText(container, givenText)).toBeTruthy();
//     });

//     it('if user is admin, a button is rendered', () => {
//         const { container } = render(
//             <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
//                 <FinishedScreen />
//             </PlayerContext.Provider>
//         );

//         expect(container.querySelectorAll('button')).toHaveProperty('length', 1);
//     });

//     it('if user is admin, a button is rendered with the given text', () => {
//         const givenText = 'Back to Lobby';
//         const { container } = render(
//             <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
//                 <FinishedScreen />
//             </PlayerContext.Provider>
//         );

//         expect(queryByText(container, givenText)).toBeTruthy();
//     });

//     it('if user is not admin, no button is rendered', () => {
//         const { container } = render(
//             <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: false }}>
//                 <FinishedScreen />
//             </PlayerContext.Provider>
//         );

//         expect(container.querySelectorAll('button')).toHaveProperty('length', 0);
//     });

//     it('user rank is rendered', () => {
//         const givenText = '#1';
//         const { container } = render(
//             <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
//                 <FinishedScreen />
//             </PlayerContext.Provider>
//         );

//         expect(queryByText(container, givenText)).toBeTruthy();
//     });

//     it('when connect back to lobby is clicked, resetPlayer function should be called', () => {
//         const onClick = jest.fn();
//         const { container } = render(
//             <Router>
//                 <PlayerContext.Provider value={{ ...defaultValue, resetPlayer: onClick }}>
//                     <FinishedScreenContainer />
//                 </PlayerContext.Provider>
//             </Router>
//         );

//         const button = container.querySelector('button');

//         if (button) {
//             fireEvent.click(button);
//             expect(onClick).toHaveBeenCalledTimes(1);
//         }
//     });

//     it('when connect back to lobby is clicked, resetGame function should be called', () => {
//         const onClick = jest.fn();
//         const { container } = render(
//             <Router>
//                 <GameContext.Provider value={{ ...gameContextDefaultValue, resetGame: onClick }}>
//                     <FinishedScreenContainer />
//                 </GameContext.Provider>
//             </Router>
//         );

//         const button = container.querySelector('button');

//         if (button) {
//             fireEvent.click(button);
//             expect(onClick).toHaveBeenCalledTimes(1);
//         }
//     });
// });
