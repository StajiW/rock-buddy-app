<script setup lang='ts'>
import { Ref, onMounted, ref } from 'vue'
import RockSniffer, { SongData, ArrangementData } from '../scripts/rocksniffer'
import Account from '../scripts/account'
import { getHost } from '../scripts/util'
import { ArrangementType } from '../scripts/rocksniffer'
import { UnexpectedError } from '../scripts/errors'
import Leaderboard, { Score } from '../scripts/leaderboard'



const rockSniffer = RockSniffer.instance
const account = Account.instance
const leaderboard = Leaderboard.instance

let arrangements: Ref<ArrangementData[]> = ref([])
let arrangement: Ref<ArrangementData | undefined> = ref()
let songData: SongData
let scores: Ref<Score[]> = ref([])
let loadingScores = ref(true)
let noScores = ref(false)
let timeout: number | undefined = undefined

onMounted(() => changeSong(rockSniffer.getSongData()))
rockSniffer.on('songChange', (newSongData: SongData) => changeSong(newSongData))

function changeSong(newSongData: SongData) {
    songData = newSongData
    arrangements.value = songData.arrangements
    arrangement.value = songData.arrangements[0] // This should pick by last selection / preference

    if (timeout !== undefined) clearTimeout(timeout)

    // window.setTimeout because setTimeout on it's own doesn't return a number
    loadingScores.value = true

    timeout = window.setTimeout(() => {
        updateScores()
    }, 2000)
}

async function updateScores() {
    if (arrangement.value === undefined) throw new UnexpectedError('arrangement undefined')

    const newScores = await leaderboard.getScores(songData, arrangement.value.name)

    loadingScores.value = false

    if (newScores.length === 0) {
        noScores.value = true
        return
    }
    
    noScores.value = false
    scores.value = newScores
}

function selectArrangementType(arrangementType: ArrangementType) {
    const chosenArrangement = arrangements.value.find(x => x.type === arrangementType)
    if (chosenArrangement === undefined) return
    selectArrangement(chosenArrangement)
}

function selectArrangement(chosenArrangement: ArrangementData) {
    arrangement.value = chosenArrangement
    updateScores()
}
</script>

<template>
    
<div id='leaderboard'>
    <div id='topRow' v-if='arrangement'>
        <div id='arrangementTypes'>
            <!-- I hate how this looks there's probably a way to make small component functions -->
            <button class='ArrangmentType' id='lead'
            :class='{ Selected: arrangement.type === ArrangementType.Lead }'
            :disabled='!arrangements.some(x => x.type === ArrangementType.Lead)'
            @click='selectArrangementType(ArrangementType.Lead)'>L</button>

            <button class='ArrangmentType' id='rhythm'
            :class='{ Selected: arrangement.type === ArrangementType.Rhythm }'
            :disabled='!arrangements.some(x => x.type === ArrangementType.Rhythm)'
            @click='selectArrangementType(ArrangementType.Rhythm)'>R</button>

            <button class='ArrangmentType' id='bass'
            :class='{ Selected: arrangement.type === ArrangementType.Bass }'
            :disabled='!arrangements.some(x => x.type === ArrangementType.Bass)'
            @click='selectArrangementType(ArrangementType.Bass)'>B</button>
        </div>
        <div id='arrangements'>
            <!-- v-if='arrangements.filter(x => x.type === arrangement?.type).length > 1' -->
            <button class='Arrangement'
            v-for='a in arrangements.filter(x => x.type === arrangement?.type)'
            :class='{ Selected: arrangement.name === a.name }'
            @click='selectArrangement(a)'>{{ a.name }}</button>
        </div>
    </div>

    <div id='loadingScores' v-if='loadingScores'>Loading scores<span class='Ellipsis' /></div>
    <div id='noScores' v-else-if='noScores'>No scores for this path have been recorded yet :(</div>
    <div id='scores' v-else>
        <div class='Score First'>
            <div class='Placement'>1</div>
            <div>{{  scores[0].username  }} <div id='crown' /></div>
            <div class='Gap' />
            <div>{{ (Math.round(scores[0].mastery * 10000) / 100).toFixed(2) }}%</div>
        </div>

        <div id='secondaryInfo'>
            <div class='Streak'>Streak: {{ scores[0].streak }}</div>
            <div class='PlayCount'>Play Count: {{ scores[0].play_count || 'unknown' }}</div>
            <div class='LastPlayed'>Last Played: {{ scores[0].last_played || 'unknown' }}</div>
        </div>

        <div id='lowerScores' v-if='scores.length > 1'>
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

.ArrangmentType {
    position: relative;
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

.ArrangmentType.Selected {
    outline: 2px solid white;
}

.ArrangmentType#lead {
    background-color: var(--color-orange);
}

.ArrangmentType#rhythm {
    background-color: var(--color-green);
}

.ArrangmentType#bass {
    background-color: var(--color-blue);
}

.ArrangmentType:disabled {
    opacity: .5;

    pointer-events: none;
}

.Dropdown {
    position: absolute;
    top: 1.4rem;
    left: 1.4rem;
}

.Arrangement {
    margin-left: 1rem;

    background: none;

    outline-color: white;
    outline-offset: 0;
}

.Arrangement.Selected {
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
}

#secondaryInfo .Streak {
    margin-left: 2.5rem;
}

#lowerScores {
    margin-top: 1rem;
}
</style>