import { GameState, Obstacles, TouchEvent } from '../../utils/constants';

describe('test GAMESTATE enum', () => {
    it('GAMESTATE.created should return CREATED', async () => {
        expect(GameState.created).toBe('CREATED');
    });

    it('GAMESTATE.started should return STARTED', async () => {
        expect(GameState.started).toBe('STARTED');
    });

    it('GAMESTATE.stopped should return STOPPED', async () => {
        expect(GameState.stopped).toBe('STOPPED');
    });

    it('GAMESTATE.finished should return FINISHED', async () => {
        expect(GameState.finished).toBe('FINISHED');
    });

    it('GAMESTATE should have length of 4', async () => {
        expect(Object.keys(GameState).length).toBe(4);
    });
});

describe('test OBSTACLES enum', () => {
    it('OBSTACLES.treeStump should return TREE-STUMP', async () => {
        expect(Obstacles.treeStump).toBe('TREE-STUMP');
    });

    it('OBSTACLES.spider should return SPIDER', async () => {
        expect(Obstacles.spider).toBe('SPIDER');
    });

    it('OBSTACLES should have length of 2', async () => {
        expect(Object.keys(Obstacles).length).toBe(2);
    });
});

describe('test TOUCHEVENT enum', () => {
    it('TOUCHEVENT.panLeft should return panLeft', async () => {
        expect(TouchEvent.panLeft).toBe('panleft');
    });

    it('TOUCHEVENT.panRight should return panRight', async () => {
        expect(TouchEvent.panRight).toBe('panright');
    });

    it('OBSTACLES should have length of 2', async () => {
        expect(Object.keys(TouchEvent).length).toBe(2);
    });
});
