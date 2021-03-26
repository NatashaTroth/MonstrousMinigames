export function formatMs(ms: number) {
    return new Date(ms).toISOString().slice(11, -1)
}
