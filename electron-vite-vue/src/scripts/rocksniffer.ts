import { NotFoundError } from './errors'

const REQUIRED_SNIFFER_VERSION: string = 'v0.4.1-buddy'
const SNIFFER_HOST = 'http://localhost:9002'
const REFRESH_RATE = 200
const SNORT_RATE = 10000
const PAUSE_THRESHOLD = 500

export type ProgressData = {
    inLaS: boolean,
    verified: boolean,
    progressTimer: number,
    pauseTimer: number,
    maybePaused: boolean,
    isPaused: boolean,
    pauseTime: number,
    lastPauseTime: number,
    ending: boolean
}

export type ScoreData = {
    notesHit: number,
    accuracy: number,
    streak: number,
    highestStreak: number,
    // songTimer: number
}

export type SongData = {
    key: string,
    psarcHash: string,
    title: string,
    artist: string,
    album: string,
    year: number,
    albumCover: string,
    // totalNotes: number,
    length: number
}

export default class RockSniffer {
    private static _instance: RockSniffer
    private callbacks: { [ key: string ]: (...args: any[]) => any } = {}
    private sniffInterval?: number
    private songData?: SongData
    private scoreData?: ScoreData

    public static get instance(): RockSniffer {
        if (this._instance === undefined) this._instance = new RockSniffer()
        
        return this._instance
    }

    public on(trigger: string, callback: (...args: any[]) => any) {
        this.callbacks[trigger] = callback
    }

    public start(): void {
        setInterval(() => this.sniff(), REFRESH_RATE)
    }

    public stop(): void {
        if (this.sniffInterval === undefined) return
        clearInterval(this.sniffInterval)
    }

    private async sniff(): Promise<void> {
        const res = await fetch(SNIFFER_HOST)
        const json = await res.json()
        const memoryReadout = json.memoryReadout
        const songDetails = json.songDetails

        console.log(memoryReadout.gameStage, memoryReadout.mode)

        if (songDetails.songID !== undefined && songDetails.songID !== this.songData?.key) {
            this.songData = this.getSongData(songDetails)
            if (this.callbacks.songChange !== undefined) {
                this.callbacks.songChange(this.songData)
            }
        }
        if (memoryReadout.songTimer > 0) {
            this.scoreData = this.getScoreData(memoryReadout)
            if (this.callbacks.scoreUpdate !== undefined) {
                this.callbacks.scoreUpdate(this.scoreData)
            }
        }
    }

    private getScoreData(memoryReadout: any): ScoreData {
        return {
            notesHit: memoryReadout.noteData.TotalNotesHit,
            accuracy: memoryReadout.noteData.Accuracy,
            streak: memoryReadout.noteData.CurrentHitStreak,
            highestStreak: memoryReadout.noteData.HighestHitStreak
        }
    }

    private getSongData(songDetails: any): SongData {
        return {
            key: songDetails.songID,
            psarcHash: songDetails.psarcFileHash,
            title: songDetails.songName,
            artist: songDetails.artistName,
            album: songDetails.albumName,
            year: songDetails.albumYear,
            albumCover: songDetails.albumArt,
            length: songDetails.songLength
        }
    }

    private getProgressData(memoryReadout: any): ProgressData {
        return {
            inLaS: memoryReadout.gameStage === 'las_game',
            
        }
    }
}