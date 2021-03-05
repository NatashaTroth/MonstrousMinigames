import { ENDPOINT } from './config'

describe('test config of api endpoint', () => {
    it('ENDPOINT should return Production URL', async () => {
        expect(ENDPOINT).toBe('https://monstrous-minigames.herokuapp.com/')
    })
})
