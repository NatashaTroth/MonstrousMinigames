import { GamePhases } from '../../contexts/game2/Game2ContextProvider';
import { PhaseChangedMessage, phaseChangedTypeGuard } from '../../domain/typeGuards/game2/phaseChanged';
import { MessageTypesGame2 } from '../../utils/constants';

describe('phaseChanged TypeGuard', () => {
    it('when type is phaseChanged, it should return true', () => {
        const data: PhaseChangedMessage = {
            type: MessageTypesGame2.phaseChanged,
            roomId: 'AKES',
            round: 1,
            phase: GamePhases.guessing,
        };

        expect(phaseChangedTypeGuard(data)).toEqual(true);
    });
});
