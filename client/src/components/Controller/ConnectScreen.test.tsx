import { cleanup } from '@testing-library/react'

afterEach(cleanup)

// TODO Thomas fragen wie man Pfad zu Background Image resolved
describe('Controller ConnectScreen', () => {
    it('renders two intput html tags', () => {
        // const { container } = render(<Router><ConnectScreen /></Router>)
        // expect(container.querySelectorAll('input')).toHaveProperty('length', 2)
    })

    it('should render impressum link', () => {
        // const givenText = 'Impressum'
        // const { container } = render(<Router><ConnectScreen /></Router>)
        // expect(queryByText(container, givenText)).toBeTruthy()
    })
})
