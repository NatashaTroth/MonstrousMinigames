export function mapServerPosToWindowPos(position: number, trackLength: number) {
    return (position * (window.innerWidth - 200)) / trackLength;
}
