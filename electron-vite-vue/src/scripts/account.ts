import { NotFoundError, BadResponseError, UnexpectedError } from './errors'
import { getHost } from './util'
import Store from '../scripts/store'

const store = Store.instance

export default class Account {
    private static _instance: Account
    private _loggedIn: boolean = false
    private _authData?: object
    // private username?: string

    constructor() {
        try {
            this._authData = JSON.parse(store.get('AUTH_DATA'))
        } catch (error) {
            if (!(error instanceof NotFoundError)) throw error
        }
    }

    public static get instance() {
        if (this._instance === undefined) this._instance = new Account()
        
        return this._instance
    }

    public get loggedIn(): boolean {
        return this._loggedIn
    }

    public get authData(): object {
        if (this._authData === undefined) throw new UnexpectedError('authData is undefined')
        return this._authData
    }

    public async authDataIsValid(): Promise<boolean> {
        try {
            if (this._authData === undefined) return false

            const host = getHost()
            const res = await fetch(host + '/api/data/get_scores_las.php', {
                method: 'POST',
                body: JSON.stringify({
                    auth_data: this._authData,
                    song_key: 'DragThro',
                    psarc_hash: 'nTmKTZj+6aeOBcGTFA2aiA==',
                    arrangement: 'lead',
                    version: '1.1.10'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) throw new BadResponseError('user auth check failed')

            this._loggedIn = true
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public async logInWithCredentials(usernameOrEmail: string, password: string): Promise<void> {
        const host = getHost()
        const response = await fetch(host + '/api/auth/login.php', {
            method: 'POST',
            body: JSON.stringify({
                username_or_email: usernameOrEmail,
                password: password,
                version: '1.1.10'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // TODO: Add message for unconfirmed email address
        if (response.status === 400) throw new BadResponseError('Wrong username or password')
    
        const json = await response.json()
    
        await store.set('AUTH_DATA', JSON.stringify(json))
    }
}