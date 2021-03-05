import { GAMESTATE } from './constants'

describe('test Gamestate enum', () => {
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
})
