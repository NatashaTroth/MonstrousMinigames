import { localStorage } from '../../storage/LocalStorage';
import { sessionStorage } from '../../storage/SessionStorage';
import { UserInitMessage } from '../../typeGuards/userInit';
import { persistUser } from '../../user/persistUser';

interface HandleUserInit {
    data: UserInitMessage;
    dependencies: {
        setPlayerAdmin: (val: boolean) => void;
        setPlayerNumber: (val: number) => void;
    };
}

export function handleUserInitMessage(props: HandleUserInit) {
    const { data, dependencies } = props;
    const { setPlayerAdmin, setPlayerNumber } = dependencies;

    persistUser(data, {
        setPlayerAdmin,
        setPlayerNumber,
        sessionStorage,
        localStorage,
    });
}
