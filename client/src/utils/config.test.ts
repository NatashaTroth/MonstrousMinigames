import { ENDPOINT, PRODUCTION, STAGING } from './config'

describe('test config of endpoints', () => {
    it('ENDPOINT should return Production Backend URL', async () => {
        expect(ENDPOINT).toBe('https://monstrous-minigames.herokuapp.com/')
    })

    it('STAGING should return Staging Frontend URL', async () => {
        expect(STAGING).toBe('https://staging-monsters.web.app/')
    })

    it('PRODUCTION should return Production Frontend URL', async () => {
        expect(PRODUCTION).toBe('https://monsters-6baec.web.app/')
    })
})
