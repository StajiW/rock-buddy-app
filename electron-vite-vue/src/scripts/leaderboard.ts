import Account from './account'
import { AuthError } from './errors'
import { SongData } from './rocksniffer'
import { getHost } from './util'

export type Score = {
    userId: number,
    username: string,
    last_played: string,
    play_count: number,
    streak: number,
    mastery: number,
    verified: boolean
}

export default class Leaderboard {
    private static _instance: Leaderboard
    private account: Account = Account.instance

    public static get instance(): Leaderboard {
        if (this._instance === undefined) this._instance = new Leaderboard()
        
        return this._instance
    }

    public async getScores(songData: SongData, arrangementName: string): Promise<Score[]> {
        if (!this.account.loggedIn) throw new AuthError('User not logged in')

        const host = getHost()
        const res = await fetch(host + '/api/data/get_scores_las.php', {
            method: 'POST',
            body: JSON.stringify({
                auth_data: this.account.authData,
                song_key: songData.key,
                psarc_hash: songData.psarcHash,
                arrangement: arrangementName.toLowerCase(),
                version: '1.1.10'
            })
        })

        const json = await res.json()

        if (res.status === 400 || (Array.isArray(json) && json.length === 0)) {
            return []
        }

        return json
    }
}