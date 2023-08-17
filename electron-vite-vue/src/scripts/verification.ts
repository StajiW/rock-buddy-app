import { GameData } from './rocksniffer'

// const PAUSE_THRESHOLD = 500
const MAX_TIME_OFFSET = 0.4

export default class ScoreVerifier {
    verified: boolean = true
    playTimer: number = 0
    paused: boolean = false
    lastPauseTime?: number
    previousGameData?: GameData
    lastVerificationTime?: number

    constructor(initialPlayTimer: number) {
        this.playTimer = initialPlayTimer
    }

    public verify(gameData: GameData): void {
        const currentTime = new Date().getTime() / 1000
        const timeDelta = this.lastVerificationTime ? (currentTime - this.lastVerificationTime) : 0
        this.lastVerificationTime = currentTime
        
        if (this.isPaused(gameData)) {
            if (!this.paused) this.pause(gameData)
        }
        else if (this.paused) this.unpause(gameData, timeDelta)

        if (!this.paused) this.playTimer += timeDelta

        if (Math.abs(this.playTimer - gameData.songTimer) > MAX_TIME_OFFSET && !gameData.ending) this.unverify()

        this.previousGameData = gameData
    }

    private unverify() {
        if (!this.verified) return
        this.verified = false
        console.log('UNVERIFIED')
    }

    private pause(gameData: GameData): void {
        if (this.lastPauseTime !== undefined) {
            if (gameData.songTimer - this.lastPauseTime < 600) this.unverify()
        }
        this.paused = true
        this.lastPauseTime = gameData.songTimer
    }

    private unpause(gameData: GameData, timeDelta: number): void {
        this.paused = false
        this.playTimer = gameData.songTimer - timeDelta
    }

    private isPaused(gameData: GameData): boolean {
        return gameData.songTimer === this.previousGameData?.songTimer && !gameData.ending
    }
}