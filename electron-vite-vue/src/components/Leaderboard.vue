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
let noScores = ref(false)

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

    if (res.status === 400) {
        noScores.value = true
        return
    }

    const json = await res.json()

    noScores.value = false
    scores.value = json
})
</script>

<template>
<div id='leaderboard'>
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

    <div id='noScores' v-if='noScores'>No scores for this path have been recorded yet :(</div>
    <div id='scores' v-else>
        <div class='Score First'>
            <div class='Placement'>1</div>
            <div>{{  scores[0].username  }} <div id='crown' /></div>
            <div class='Gap' />
            <div>{{ Math.round(scores[0].mastery * 10000) / 100 }}%</div>
        </div>

        <div id='secondaryInfo'>
            <div class='Streak'>Streak: {{ scores[0].streak }}</div>
            <div class='PlayCount'>Play Count: {{ scores[0].play_count || 'unknown' }}</div>
            <div class='LastPlayed'>Last Played: {{ scores[0].last_played || 'unknown' }}</div>
        </div>

        <div class='Score' v-for='(score, i) in scores.slice(1)'>
            <div class='Placement'>{{ i + 2 }}</div>
            <div class='Username'>{{  score.username  }}</div>
            <div class='Gap' />
            <div class='Mastery'>{{ (Math.round(score.mastery * 10000) / 100).toFixed(2) }}%</div>
            <!-- <div class='Streak'>{{ score.streak }} streak</div>
            <div class='Gap' />
            <div class='PlayCount'>{{ score.play_count }} plays</div>
            <div class='LastPlayed'>{{ score.last_played }}</div> -->
        </div>
    </div>
</div>
</template>

<style scoped>
#leaderboard {
    padding: 1rem;

    color: white;
    background-color: var(--dark-gray);
    border-radius: .25rem;
}

#topRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    width: 100%;
    margin-bottom: 1rem;
    /* padding-bottom: 1rem; */

    /* border-bottom: 1px dashed white; */
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

    color: white;

    background-color: var(--dark-gray);

    border-radius: .25rem;
}

.Score {
    display: flex;
    justify-content: space-between;

    width: 100%;
}

.Score > {
    flex-grow: 1;
}

.Score .Gap {
    flex-grow: 1;
}

.Score .Username {
    width: 10rem;
}

.Score.First {
    font-size: 2rem;
}

.Score.First .Username {
    flex-grow: 1;
}

/* .Score .Mastery {
    width: 5rem;
} */

.Score .LastPlayed {
    width: 8rem;
    text-align: right;
}

#crown {
    display: inline-block;

    width: 2rem;
    height: 2rem;

    transform: translateY(.25rem);

    background-image: url(../assets/crown.svg);
    background-size: cover;

    filter: invert(1);
}

.Placement {
    min-width: 1.5rem;
    margin-right: 1rem;
}

#secondaryInfo {
    display: flex;
    justify-content: space-between;

    margin-bottom: 1rem;
}

#secondaryInfo .Streak {
    margin-left: 2.5rem;
}
</style>