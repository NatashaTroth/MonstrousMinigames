import * as firebase from '@firebase/app';
import { render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';

import FirebaseContextProvider from '../../contexts/FirebaseContextProvider';

configure({ adapter: new Adapter() });

// jest.mock('firebase/app');

describe('FirebaseContextProvider', () => {
    // beforeEach(() => {
    //     firebase. = jest.fn();
    // });

    xit('initializeApp from firebase should be called once', () => {
        render(<FirebaseContextProvider />);

        expect(firebase.initializeApp).toHaveBeenCalledTimes(1);
    });
});

// describe('FirebaseContextProvider', () => {
//     it('FirebaseContext should create a firebase storage which is used to upload photos', async () => {
//         const roomId = 'ABCD';
//         const userId = '1';
//         const controllerSocket = new InMemorySocketFake();
//         global.URL.createObjectURL = jest.fn();

//         jest.spyOn(firebaseStorage, 'ref').mockImplementation(
//             (storageOrRef: any, path?: string | undefined) =>
//                 (({
//                     test: 'Hello',
//                 } as any) as firebaseStorage.StorageReference)
//         );

//         // jest.mock('@firebase/storage', () => {
//         //     return jest.fn().mockReturnValue({
//         //         getStorage: () => {
//         //             // any
//         //         },
//         //         ref: () => 'reference',
//         //     });
//         // });

//         // jest.spyOn(firebaseStorage, 'uploadBytes').mockReturnValue(
//         //     new Promise(resolve =>
//         //         resolve({
//         //             ref: ('reference' as unknown) as StorageReference,
//         //             metadata: {
//         //                 name: 'image',
//         //             } as FullMetadata,
//         //         } as UploadResult)
//         //     )
//         // );
//         // jest.spyOn(firebaseStorage, 'getDownloadURL').mockReturnValue(new Promise(resolve => resolve('downloadUrl')));

//         const container = render(
//             <ThemeProvider theme={theme}>
//                 <ControllerSocketContext.Provider value={{ ...controllerSocketDefaultValue, controllerSocket }}>
//                     <GameContext.Provider value={{ ...defaultValue, roomId }}>
//                         <Game3Context.Provider value={{ ...game3DefaultValue, roundIdx: 1 }}>
//                             <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
//                                 <FirebaseContextProvider>
//                                     <TakePicture />
//                                 </FirebaseContextProvider>
//                             </PlayerContext.Provider>
//                         </Game3Context.Provider>
//                     </GameContext.Provider>
//                 </ControllerSocketContext.Provider>
//             </ThemeProvider>
//         );

//         act(() => {
//             jest.setTimeout(4000);
//         });

//         await waitFor(() => {
//             const imageUpload = container.getByTestId('image-upload');
//             const submitButton = container.getByText('Upload');

//             fireEvent.change(imageUpload, { target: { files: ['file.jpg'] } });
//             fireEvent.click(submitButton);

//             expect(controllerSocket.emitedVals).toEqual([
//                 expect.objectContaining({
//                     type: MessageTypesGame3.photo,
//                     userId,
//                 }),
//             ]);
//         });
//     });
// });
