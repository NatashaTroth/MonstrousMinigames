export function moveLanesToCenter(windowHeight: number, newHeight: number, index: number, numberPlayers: number) {
    return (windowHeight - newHeight * numberPlayers) / 2 + newHeight * (index + 1);
}
