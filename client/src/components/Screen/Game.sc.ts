import styled from 'styled-components'
import forest from '../../images/forest.png'

export const Container = styled.div`
    width: 100%;
    position: absolute;
    height: 100%;
    background-size: cover;
    background-repeat-y: repeat;
    top: 0;
    background-position: bottom;
    background-image: url(${forest});
`
