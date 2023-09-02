<script setup lang='ts'>
import { onMounted, ref, Ref, TransitionGroup, reactive } from 'vue'
import RockSniffer, { GameData, ScoreData } from '../scripts/rocksniffer'
import Leaderboard from '../scripts/leaderboard'
import NumberDisplay from './NumberDisplay.vue'
import { Score } from '../scripts/leaderboard'

const rockSniffer = RockSniffer.instance
const leaderboard = Leaderboard.instance
let scoreData: Ref<ScoreData | undefined> = ref()
let scores: Score[]

// Durr
const USERNAME = 'Staji'
const USER_ID = 13

rockSniffer.on('update', (newScoreData: ScoreData) => {
    scoreData.value = newScoreData
    if (scores === undefined) return
    const score = scores.find(score => score.username === USERNAME)!
    score.mastery = newScoreData.accuracy / 100
    score.streak = newScoreData.streak
    scores.sort(sortScores)
})

onMounted(async () => {
    if (!rockSniffer.inSong) return

    const songData = rockSniffer.getSongData()

    const verifiedScores = (await leaderboard.getScores(songData, songData.currentArrangement!.name)).filter((score) => {
        return score.verified && score.username !== USERNAME
    })

    verifiedScores.push({
        userId: USER_ID,
        username: USERNAME,
        streak: 0,
        last_played: '',
        play_count: 0,
        mastery: 1,
        verified: true
    })

    verifiedScores.sort(sortScores)

    scores = reactive(verifiedScores)
})

function sortScores(a: Score, b: Score) {
    if (a.mastery !== b.mastery) return b.mastery - a.mastery
    return b.streak - a.streak
}

function getScoresOffset(): number {
    const offset = scores.findIndex((score) => score.username === USERNAME) - 2
    if (offset < 0) return 0
    if (offset > scores.length - 1) return scores.length - 1
    return offset
}
</script>

<template>
<!-- This code suuuucks -->
<div id='inGame' v-if='scoreData'>
    <div id='topBar'>
        <div id='accuracy'>
            {{ (scoreData?.accuracy === 100) ? '100%' : `${scoreData.accuracy.toFixed(2)}%`.padStart(6, '0') }}
        </div>
        <div id='middle'>
            <div id='currentStreak'>Streak &nbsp;&nbsp;&nbsp;<NumberDisplay :str="scoreData.streak.toString().padEnd(5, ' ')" :stringLength='5' /></div>
            <div id='notesHit'>Notes Hit <NumberDisplay :str="scoreData.notesHit.toString().padEnd(5, ' ')" :stringLength='5' /></div>
        </div>
        <div id='right'>
            <div id='highestStreak'><NumberDisplay :str="scoreData.highestStreak.toString().padStart(5, ' ')" :stringLength='5' /> Highest</div>
            <div id='notesMissed'><NumberDisplay :str="scoreData.notesMissed.toString().padStart(5, ' ')" :stringLength='5' /> &nbsp;Missed</div>
        </div>
    </div>
    <!-- <div id='leaderboard' v-if='scores?.length > 1'>
        <div id='scores' :style='{ top: `-${getScoresOffset() * 1.25 + 0.5}rem` }'>
            <TransitionGroup name='scores'>
                <div class='Score' v-for='(score, i) in scores' :key='score.username'>
                    <div class='Placement'>{{ i + 1 }}</div>
                    <div class='Username'>{{ score.username }}</div>
                    <div class='Gap' />
                    <div class='Streak'>{{ score.streak }}</div>
                    <div class='Accuracy'>{{ (Math.round(score.mastery * 10000) / 100).toFixed(2) }}%</div>
                </div>
            </TransitionGroup>
        </div>
    </div> -->
    <div>paused1 {{ scoreData.paused1 ? 'true' : 'false' }}</div>
    <div>paused2 {{ scoreData.paused2 ? 'true' : 'false' }}</div>
    <div>paused3 {{ scoreData.paused3 ? 'true' : 'false' }}</div>
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

    /* border-left: 2px solid white; */
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

.scores-move {
  transition: all .3s;
}

#leaderboard {
    position: relative;

    /* width: 100%; */
    height: 4rem;
    padding: .5rem;

    overflow: hidden;
}

#scores {
    position: relative;

    transform: top;
    transition-duration: .3s;
}

.Score {
    height: 1.25rem;
    display: flex;
}

.Placement {
    width: 1.5rem;
}

.Gap {
    flex-grow: 1;
}

.Accuracy {
    width: 5rem;
    text-align: right;
}
</style>