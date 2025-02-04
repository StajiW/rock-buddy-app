import ElectronStore from 'electron-store'
import { NotFoundError } from './errors'

export default class Store {
    private static _instance: Store
    private electronStore: ElectronStore

    constructor() {
        this.electronStore = new ElectronStore()
    }

    public static get instance(): Store {
        if (this._instance === undefined) this._instance = new Store()
        
        return this._instance
    }

    public get(property: string): string {
        const val = this.electronStore.get(property, null) as (string | null)

        if (val === null) throw new NotFoundError(`property "${property}" not found in Store`)

        return val
    }

    public set(property: string, value: string): void {
        this.electronStore.set(property, value)
    }
}