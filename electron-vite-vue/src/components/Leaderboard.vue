<script setup lang='ts'>
import { ref } from 'vue'
import RockSniffer from '../scripts/rocksniffer'
import Account from '../scripts/account'
import { getHost } from '../scripts/util'

const rockSniffer = RockSniffer.instance
const account = Account.instance

rockSniffer.on('songChange', async (songData) => {
    if (!account.loggedIn) return

    const host = getHost()
    const res = await fetch(host + '/api/data/get_scores_las.php', {
        method: 'POST',
        
    // auth_data: authData,
    // song_key: rocksnifferData['songDetails']['songID'],
    // psarc_hash: rocksnifferData['songDetails']['psarcFileHash'],
    // arrangement: this._path
})

// async function getLearnASongScores() {
//     const authData = JSON.parse(window.sessionStorage.getItem('auth_data') as any)

//     const host = await window.api.getHost()
//     const response = await post(host + '/api/data/get_scores_las.php', {
//         auth_data: authData,
//         song_key: rocksnifferData['songDetails']['songID'],
//         psarc_hash: rocksnifferData['songDetails']['psarcFileHash'],
//         arrangement: this._path
//     })

//     if ('error' in response) {
//         window.api.error(response['error'])
//         return null
//     }

//     return response
// }

let path = ref('lead')
let gamemode = ref('LaS')
</script>

<template>
<div id='topRow'>
    <div id='paths'>
        <button class='Path' id='lead'
        :class="{ Selected: path === 'lead' }"
        @click="path = 'lead'">L</button>

        <button class='Path' id='rhythm'
        :class="{ Selected: path === 'rhythm' }"
        @click="path = 'rhythm'">R</button>

        <button class='Path' id='bass'
        :class="{ Selected: path === 'bass' }"
        @click="path = 'bass'">B</button>
    </div>
    <div id='gamemodes'>
        <button class='Gamemode'
        :class="{ Selected: gamemode === 'LaS' }"
        @click="gamemode = 'LaS'">Learn a Song</button>

        <button class='Gamemode'
        :class="{ Selected: gamemode === 'SA' }"
        @click="gamemode = 'SA'">Score Attack</button>
    </div>
</div>

<div id='leaderBoard'>

</div>
</template>

<style scoped>
#topRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    width: 100%;
    margin-bottom: 1rem;
    padding: 1rem;

    background-color: var(--dark-gray);
    border-radius: .25rem;
}

.Path {
    width: 2.25rem;
    height: 2.25rem;

    margin-right: 1rem;
    padding: 0;

    font-size: 1rem;
    text-align: center;
    line-height: 0;

    border-radius: 50%;

    outline-color: white;
    outline-offset: .25rem;
}

.Path.Selected {
    outline: 2px solid white;
}

.Path#lead {
    background-color: var(--color-orange);
}

.Path#rhythm {
    background-color: var(--color-green);
}

.Path#bass {
    background-color: var(--color-blue);
}

.Gamemode {
    margin-left: 1rem;

    background: none;

    outline-color: white;
    outline-offset: 0;
}

.Gamemode.Selected {
    outline: 2px solid white;
}
</style>