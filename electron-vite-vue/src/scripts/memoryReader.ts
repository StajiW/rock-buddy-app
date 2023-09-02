// import * as memoryjs from 'memoryjs'

// export default class MemoryReader {
//     private static _instance: MemoryReader
//     private handle?: number

//     public static get instance(): MemoryReader {
//         if (this._instance === undefined) this._instance = new MemoryReader()
        
//         return this._instance
//     }

//     openRocksmithProcess(callback: () => any): void {
//         const process = memoryjs.openProcess('Rocksmith2014.exe')
//         console.log(process)
//     }
// }