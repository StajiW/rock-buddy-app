const args = process.argv.slice(2)
const host = 'https://rock-buddy.com'

export function getHost(): string {
    return host
}

export function alert(message: string): void {
    window.alert(message)
}