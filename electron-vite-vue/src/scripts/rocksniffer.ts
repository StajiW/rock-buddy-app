import { ipcRenderer } from 'electron'
import { NotFoundError, UnexpectedError } from './errors'
import ScoreVerifier from './verification'

const REQUIRED_SNIFFER_VERSION: string = 'v0.4.1-buddy'
const SNIFFER_HOST = 'http://localhost:9002'
const REFRESH_RATE = 200
const ENDING_THRESHOLD = 0.1

const STAGES_IN_SONG = ['las_game', 'nonstopplaygame', 'sa_game']

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

export enum ArrangementType {
    Lead,
    Rhythm,
    Bass
}

export type ArrangementData = {
    name: string,
    type: ArrangementType,
    totalNotes: number
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
    arrangements: ArrangementData[]
}

export default class RockSniffer {
    private static _instance: RockSniffer
    private callbacks: { [ key: string ]: ((...args: any[]) => any)[] } = {}
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

    public on(id: string, callback: (...args: any[]) => any) {
        this.callbacks[id] ? this.callbacks[id].push(callback) : this.callbacks[id] = [callback]
    }

    private callback(id: string, ...args: any[]): void {
        if (this.callbacks[id] === undefined) return

        for (let c of this.callbacks[id]) c(...args)
    }

    public async startProcess(callback: () => any): Promise<void> {
        try {
            await ipcRenderer.invoke('launch-rocksniffer')
            callback()
        } catch (error) {
            // TODO: Make it do something when RockSniffer doesn't load properly
            console.error(error)
        }
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

        if (memoryReadout === null) return
        if (songDetails === null) return

        this.updateGameData(memoryReadout)

        if (songDetails.songID !== undefined && songDetails.songID !== this.songData?.key) {
            this.updateSongData(songDetails)
            this.callback('songChange', this.songData)
        }

        if (this.isInSong()) {
            if (!this.inSong) this.startSong()
        }
        else if (this.inSong) this.endSong()

        if (this.inSong) {
            this.updateScoreData(memoryReadout)
            this.callback('gameUpdate', this.scoreData)


            if (this.verifier === undefined) throw new UnexpectedError('Score verifier not instantiated')
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
            length: songDetails.songLength,
            arrangements: this.getArrangementData(songDetails)
        }
    }

    private getArrangementData(songDetails: any): ArrangementData[] {
        const arrangements: ArrangementData[] = songDetails.arrangements.map((arrangement: any) => {
            let name = ''

            if (arrangement.isAlternateArrangement) {
                if (arrangement.isBonusArrangement) name += 'Bonus '
                else                                name += 'Alternate '                 
            }

            name += arrangement.type

            return {
                name: name,
                type: ArrangementType[arrangement.type],
                totalNotes: arrangement.totalNotes
            }
        })

        this.addDuplicatePathNameNumbers(arrangements)
        this.sortArrangements(arrangements)

        return arrangements
    }

    private addDuplicatePathNameNumbers(arrangements: ArrangementData[]): void {
        const uniquePathNames: string[] = [...new Set(arrangements.map(x => x.name))]

        for (let pathName of uniquePathNames) {     // Not sure if this would put arrangement 1 - 2 in the right order
            const arrangementsWithPathName = arrangements.filter(x => x.name === pathName)
            if (arrangementsWithPathName.length <= 1) continue

            for (let i = 0; i < arrangementsWithPathName.length; i++) {
                arrangementsWithPathName[i].name += ` ${i + 1}`
            }
        }
    }

    private sortArrangements(arrangements: ArrangementData[]): void {
        arrangements.sort((a, b) => {
            if (a.type !== b.type) return (a.type - b.type)     // If type is not the same, pick the lower one (Lead over Rhythm over Bass)
            if (ArrangementType[a.type] === a.name) return -1   // If the name is the same as the type (like "Lead") pick that one
            if (ArrangementType[b.type] === b.name) return 1    // Or that one
            return a.name.localeCompare(b.name)                 // Otherwise just sort alphabetically
        })
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
            ending: this.songData ? this.songData.length - memoryReadout.songTimer < ENDING_THRESHOLD : false,
            songTimer: memoryReadout.songTimer,
            mode: memoryReadout.mode
        }
    }

    private isInSong(): boolean {
        if (this.gameData === undefined) throw new UnexpectedError('GameData undefined')
        return this.gameData.songTimer > 0 && STAGES_IN_SONG.includes(this.gameData.stage)
    }

    private startSong(): void {
        if (this.gameData === undefined) throw new UnexpectedError('GameData undefined')
        this.inSong = true
        this.verifier = new ScoreVerifier(this.gameData.songTimer)
    }

    private endSong(): void {
        this.inSong = false
        this.verifier = undefined
    }
}