import { GameState, localDevelopment, Obstacles } from './constants';

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
    it('OBSTACLES.treeStump should return TreeStump', () => {
        expect(Obstacles.treeStump).toBe('TreeStump');
    });

    it('OBSTACLES.spider should return Spider', () => {
        expect(Obstacles.spider).toBe('Spider');
    });

    it('OBSTACLES.stone should return Stone', () => {
        expect(Obstacles.stone).toBe('Stone');
    });

    it('OBSTACLES.hole should return Hole', () => {
        expect(Obstacles.hole).toBe('Hole');
    });

    it('OBSTACLES should have length of 4', () => {
        expect(Object.keys(Obstacles).length).toBe(4);
    });
});

describe('local development', () => {
    it('localDevelopment should return false', () => {
        expect(localDevelopment).toBe(false);
    });
});
