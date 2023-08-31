<script setup lang='ts'>
import { onMounted, ref, Ref } from 'vue'
import RockSniffer, { ScoreData, SnifferState } from '../scripts/rocksniffer'
import NumberDisplay from './NumberDisplay.vue'
import { Score } from '../scripts/leaderboard'

const rockSniffer = RockSniffer.instance
let scoreData: Ref<ScoreData | undefined> = ref()
let scores: Ref<Score[]> = ref([])

rockSniffer.on('update', (newScoreData: ScoreData) => {
    scoreData.value = newScoreData
})

onMounted(() => {
    if (!rockSniffer.inSong) return
    const songData = rockSniffer.getSongData()
    console.log(songData)
})
</script>

<template>
<!-- This code suuuucks -->
<div id='inGame' v-if='scoreData'>
    <div id='topBar'>
        <div id='accuracy'>
            <NumberDisplay :str="(scoreData?.accuracy === 100) ? '100%' : `${scoreData.accuracy.toFixed(2)}%`.padStart(6, '0')" :stringLength='6' />
        </div>
        <div id='middle'>
            <div id='currentStreak'>Streak &nbsp;&nbsp;&nbsp;<NumberDisplay :str="scoreData.streak.toString().padStart(5, ' ')" :stringLength='5' /></div>
            <div id='notesHit'>Notes Hit <NumberDisplay :str="scoreData.notesHit.toString().padStart(5, ' ')" :stringLength='5' /></div>
        </div>
        <div id='right'>
            <div id='highestStreak'><NumberDisplay :str="scoreData.highestStreak.toString().padStart(5, ' ')" :stringLength='5' /> Highest</div>
            <div id='notesMissed'><NumberDisplay :str="scoreData.notesMissed.toString().padStart(5, ' ')" :stringLength='5' /> &nbsp;Missed</div>
        </div>
    </div>
    <!-- <div id='bottomBar'>

    </div> -->
</div>
</template>

<style scoped>
#inGame {
    width: 100%;
    box-sizing: border-box;

    margin-bottom: 1rem;
    padding: 1rem;

    color: white;

    background-color: var(--dark-gray);

    border-radius: .25rem;
}

#topBar {
    /* margin-bottom: 1rem; */
}

#accuracy {
    display: inline-block;
    width: 40%;
    font-size: 4rem;
}

#middle, #right {
    display: inline-block;
    width: 30%;
    font-size: 1.5rem;
}

#right {
    box-sizing: border-box;
    text-align: right;

    border-left: 2px solid white;
}

#currentStreak, #highestStreak {
    border-bottom: 1px solid white;
}

#accuracy .NumberDisplay {
    height: 4rem;
    font-size: 4rem;
}

#accuracy .NumberDisplay:deep(.Digit) {
    height: 4rem;
}

.NumberDisplay {
    height: 1.5rem;
    font-size: 1.5rem;
}

.NumberDisplay:deep(.Digit) {
    height: 1.5rem;
}
</style>