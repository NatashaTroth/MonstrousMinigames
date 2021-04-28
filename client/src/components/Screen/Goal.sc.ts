import styled from 'styled-components';

export const StyledImage = styled.img`
    width: 100px;
    height: 100px;
`;

interface IImageContainerProps {
    x: number;
}
export const ImageContainer = styled.div<IImageContainerProps>`
    position: absolute;
    left: ${({ x }) => x}px;
`;
