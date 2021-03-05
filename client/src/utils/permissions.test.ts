import { ClickRequestDeviceMotion } from './permissions'

describe('test ClickRequestDeviceMotion function', () => {
    it('ClickRequestDeviceMotion should return true', async () => {
        expect(await ClickRequestDeviceMotion()).toBe(true)
    })
})
