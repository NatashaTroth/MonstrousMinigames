import { designDevelopment, GameState, localDevelopment, ObstacleTypes } from '../../utils/constants';

describe('test GAMESTATE enum', () => {
    it('GAMESTATE.created should return CREATED', () => {
        expect(GameState.created).toBe('CREATED');
    });

    it('GAMESTATE.started should return STARTED', () => {
        expect(GameState.started).toBe('STARTED');
    });

    it('GAMESTATE.stopped should return STOPPED', () => {
        expect(GameState.stopped).toBe('STOPPED');
    });

    it('GAMESTATE.finished should return FINISHED', () => {
        expect(GameState.finished).toBe('FINISHED');
    });

    it('GAMESTATE should have length of 4', () => {
        expect(Object.keys(GameState).length).toBe(4);
    });
});

describe('test OBSTACLES enum', () => {
    it('ObstacleTypes.treeStump should return TREE_STUMP', () => {
        expect(ObstacleTypes.treeStump).toBe('TREE_STUMP');
    });

    it('ObstacleTypes.spider should return SPIDER', () => {
        expect(ObstacleTypes.spider).toBe('SPIDER');
    });

    it('ObstacleTypes.stone should return STONE', () => {
        expect(ObstacleTypes.stone).toBe('STONE');
    });

    it('ObstacleTypes.trash should return TRASH', () => {
        expect(ObstacleTypes.trash).toBe('TRASH');
    });

    it('ObstacleTypes should have length of 4', () => {
        expect(Object.keys(ObstacleTypes).length).toBe(4);
    });
});

describe('local development', () => {
    it('localDevelopment should return false', () => {
        expect(localDevelopment).toBe(false);
    });
    it('designDevelopment should return false', () => {
        expect(designDevelopment).toBe(false);
    });
});
