import styled from 'styled-components';

export const StyledImage = styled.img`
    width: 100px;
    height: 100px;
`;

interface ImageContainerProps {
    x: number;
}
export const ImageContainer = styled.div<ImageContainerProps>`
    position: absolute;
    left: ${({ x }) => x}px;
`;
