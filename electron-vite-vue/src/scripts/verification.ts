import { GameData } from './rocksniffer'

const PAUSE_THRESHOLD = 500

export default class ScoreVerifier {
    verified: boolean = true
    playTimer: number = 0
    isMaybePaused: boolean = false
    isPaused: boolean = false
    pauseTimer: number = 0
    pauseTime?: number
    lastPauseTime?: number
    previousGameData?: GameData
    lastVerificationTime?: Date

    verify(gameData: GameData) {
        const currentTime = new Date()
        const timeDelta = this.lastVerificationTime ? (currentTime.getTime() - this.lastVerificationTime.getTime()) : 0
        this.lastVerificationTime = currentTime
        
        if (gameData.songTimer === this.previousGameData?.songTimer) {
            this.pauseTimer += timeDelta
        }
        else {
            this.playTimer += timeDelta
        }

        console.log(gameData.songTimer - this.playTimer / 1000, gameData.songTimer, this.playTimer / 1000)

        this.previousGameData = gameData
    }
}