import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { handleCreateNewRoom } from '../../../components/screen/ConnectScreen';

configure({ adapter: new Adapter() });

export const buildSuccessfulFetch = (response: unknown) =>
    jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(response),
    });

export const buildFailingFetch = (error: unknown) => jest.fn().mockRejectedValue(error);

afterEach(cleanup);

describe('handleCreateNewRoom', () => {
    it('handleCreateNewRoom ', async () => {
        const roomId = 'AFSA';
        const data = {
            roomId,
        };
        const fetch = buildSuccessfulFetch(data);
        const setLoading = jest.fn();
        const handleSocketConnection = jest.fn();

        await handleCreateNewRoom({
            fetch,
            setLoading,
            handleSocketConnection,
        });

        expect(handleSocketConnection).toHaveBeenCalledTimes(1);
    });
});
