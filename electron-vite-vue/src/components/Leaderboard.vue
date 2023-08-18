<script setup lang='ts'>
import { Ref, ref } from 'vue'
import RockSniffer, { SongData } from '../scripts/rocksniffer'
import Account from '../scripts/account'
import { getHost } from '../scripts/util'

type Score = {
    userId: number,
    username: string,
    last_played: string,
    play_count: number,
    streak: number,
    mastery: number,
    verified: boolean
}

const rockSniffer = RockSniffer.instance
const account = Account.instance

let path = ref('lead')
let gamemode = ref('LaS')
let scores: Ref<Score[]> = ref([])

rockSniffer.on('songChange', async (songData: SongData) => {
    if (!account.loggedIn) return

    const host = getHost()
    const res = await fetch(host + '/api/data/get_scores_las.php', {
        method: 'POST',
        body: JSON.stringify({
            auth_data: account.authData,
            song_key: songData.key,
            psarc_hash: songData.psarcHash,
            arrangement: path.value,
            version: '1.1.10'
        })
    })

    const json = await res.json()

    console.log(json)

    scores.value = json
})
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

<table id='scores'>
    <tr class='Score' v-for='(score, i) in scores'>
        <td class='Placement'>{{ i + 1 }}</td>
        <td class='Username'>{{ score.username }}</td>
        <td class='Mastery'>{{ Math.round(score.mastery * 10000) / 100 }}%</td>
        <td class='Streak'>{{ score.streak }}</td>
        <td class='PlayCount'>{{ score.play_count }}</td>
        <td class='LastPlayer'>{{ score.last_played }}</td>
    </tr>
</table>
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

#scores {
    width: 100%;
    padding: 1rem;

    color: white;

    background-color: var(--dark-gray);

    border-radius: .25rem;
}

.Score {
    width: 100%;
}

.Placement {
    min-width: 1.5rem;
    margin-right: 1rem;
}
</style>