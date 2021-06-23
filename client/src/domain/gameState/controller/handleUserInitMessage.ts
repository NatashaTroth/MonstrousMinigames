import { localStorage } from '../../storage/LocalStorage';
import { sessionStorage } from '../../storage/SessionStorage';
import { UserInitMessage } from '../../typeGuards/userInit';
import { persistUser } from '../../user/persistUser';

interface HandleUserInit {
    data: UserInitMessage;
    dependencies: {
        setPlayerNumber: (val: number) => void;
        setName: (val: string) => void;
        setUserId: (val: string) => void;
    };
}

export function handleUserInitMessage(props: HandleUserInit) {
    const { data, dependencies } = props;
    const { setPlayerNumber, setName, setUserId } = dependencies;

    persistUser(data, {
        setPlayerNumber,
        sessionStorage,
        localStorage,
        setName,
        setUserId,
    });
}
