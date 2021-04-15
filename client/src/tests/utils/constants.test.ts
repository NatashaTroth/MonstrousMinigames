import { GAMESTATE, OBSTACLES, TOUCHEVENT } from '../../utils/constants'

describe('test GAMESTATE enum', () => {
    it('GAMESTATE.created should return CREATED', async () => {
        expect(GAMESTATE.created).toBe('CREATED')
    })

    it('GAMESTATE.started should return STARTED', async () => {
        expect(GAMESTATE.started).toBe('STARTED')
    })

    it('GAMESTATE.stopped should return STOPPED', async () => {
        expect(GAMESTATE.stopped).toBe('STOPPED')
    })

    it('GAMESTATE.finished should return FINISHED', async () => {
        expect(GAMESTATE.finished).toBe('FINISHED')
    })

    it('GAMESTATE should have length of 4', async () => {
        expect(Object.keys(GAMESTATE).length).toBe(4)
    })
})

describe('test OBSTACLES enum', () => {
    it('OBSTACLES.treeStump should return TREE-STUMP', async () => {
        expect(OBSTACLES.treeStump).toBe('TREE-STUMP')
    })

    it('OBSTACLES should have length of 1', async () => {
        expect(Object.keys(OBSTACLES).length).toBe(1)
    })
})

describe('test TOUCHEVENT enum', () => {
    it('TOUCHEVENT.panLeft should return panLeft', async () => {
        expect(TOUCHEVENT.panLeft).toBe('panleft')
    })

    it('TOUCHEVENT.panRight should return panRight', async () => {
        expect(TOUCHEVENT.panRight).toBe('panright')
    })

    it('OBSTACLES should have length of 2', async () => {
        expect(Object.keys(TOUCHEVENT).length).toBe(2)
    })
})
