import { NotFoundError, UnexpectedError } from './errors'
import ScoreVerifier from './verification'

const REQUIRED_SNIFFER_VERSION: string = 'v0.4.1-buddy'
const SNIFFER_HOST = 'http://localhost:9002'
const REFRESH_RATE = 200

export type GameData = {
    stage: string,
    ending: boolean,
    songTimer: number,
    mode: number
}

export type ScoreData = {
    notesHit: number,
    accuracy: number,
    streak: number,
    highestStreak: number
}

export type SongData = {
    key: string,
    psarcHash: string,
    title: string,
    artist: string,
    album: string,
    year: number,
    albumCover: string,
    length: number,
    // totalNotes: number
}

export default class RockSniffer {
    private static _instance: RockSniffer
    private callbacks: { [ key: string ]: (...args: any[]) => any } = {}
    private sniffInterval?: number
    private songData?: SongData
    private scoreData?: ScoreData
    private gameData?: GameData
    private verifier?: ScoreVerifier
    private inSong: boolean = false

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
        // console.log(this.inSong)
        const res = await fetch(SNIFFER_HOST)
        const json = await res.json()
        const memoryReadout = json.memoryReadout
        const songDetails = json.songDetails

        if (songDetails.songID !== undefined && songDetails.songID !== this.songData?.key) {
            this.updateSongData(songDetails)
            if (this.callbacks.songChange !== undefined) {
                this.callbacks.songChange(this.songData)
            }
        }
        if (memoryReadout.songTimer > 0) {
            if (!this.inSong) this.startSong()

            this.updateScoreData(memoryReadout)
            if (this.callbacks.gameUpdate !== undefined) {
                this.callbacks.gameUpdate(this.scoreData)
            }
        }
        else if (this.inSong) this.endSong()

        this.updateGameData(memoryReadout)

        if (this.inSong) {
            if (this.verifier === undefined) throw new UnexpectedError('Score verifier not instanciated')
            if (this.gameData === undefined) throw new UnexpectedError('GameData undefined')
            this.verifier.verify(this.gameData)
        }
    }
    
    private updateSongData(songDetails: any): void {
        this.songData = {
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

    private updateScoreData(memoryReadout: any): void {
        this.scoreData = {
            notesHit: memoryReadout.noteData.TotalNotesHit,
            accuracy: memoryReadout.noteData.Accuracy,
            streak: memoryReadout.noteData.CurrentHitStreak,
            highestStreak: memoryReadout.noteData.HighestHitStreak
        }
    }

    private updateGameData(memoryReadout: any): void {
        this.gameData = {
            stage: memoryReadout.gameStage,
            ending: false,
            songTimer: memoryReadout.songTimer,
            mode: memoryReadout.mode
        }
    }

    private startSong(): void {
        this.inSong = true
        this.verifier = new ScoreVerifier()
    }

    private endSong(): void {
        this.inSong = false
        this.verifier = undefined
    }

    // private updateProgressData(memoryReadout: any, delta: number): void {
    //     if (this.progressData === undefined) throw new UnexpectedError('ProgressData undefined')

    //     this.progressData.progressTimer += delta
        
    //     if (memoryReadout.songTimer === this.songTimer) {
    //         this.progressData.maybePaused = true
    //     }
    // }

    // private songStart(memoryReadout: any): void {
    //     this.progressData = {
    //         inLaS: memoryReadout.gameStage === 'las_game',
    //         verified: true,
    //         progressTimer: 0,
    //         pauseTimer: 0,
    //         maybePaused: false,
    //         isPaused: false,
    //         pauseTime: 0,
    //         lastPauseTime: 0,
    //         ending: false,
    //         songTimer: memoryReadout.songTimer
    //     }

    //     this.progressData.verified = this.progressIsValid()
    // }

    // private progressIsValid(): boolean {
    //     return true
    // }
}