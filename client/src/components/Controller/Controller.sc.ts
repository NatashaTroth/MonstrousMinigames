import styled from 'styled-components'
import camp from '../../images/camp.svg'

export const ControllerContainer = styled.div`
    background-color: #bfeff0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const StartScreen = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url(${camp});
    display: flex;
    justify-content: center;
`
