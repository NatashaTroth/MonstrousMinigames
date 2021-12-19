import * as React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { Instructions, ScreenContainer } from '../../../game3/controller/components/Game3Styles.sc';

const Guess: React.FunctionComponent = () => {
    //const { ... } = React.useContext(Game2Context);
    //const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { playerRanks } = React.useContext(Game2Context);

    const rankList = playerRanks.map(element => (
        <tr key={element.rank}>
            <td>
                <Instructions>{element.name}</Instructions>
            </td>
            <td>
                <Instructions>{element.rank}</Instructions>
            </td>
        </tr>
    ));

    //TODO: return actual rank
    return (
        <ScreenContainer>
            <table>
                <tr>
                    <th>
                        <Instructions>Name</Instructions>
                    </th>
                    <th>
                        <Instructions>Rank</Instructions>
                    </th>
                </tr>
                {rankList}
            </table>
        </ScreenContainer>
    );
};

export default Guess;
