import { formatMs } from '../../utils/formatMs'

describe('test formatMS function', () => {
    it('should format number', () => {
        expect(formatMs(5000)).toBe('00:05.000')
    })
})
