<script setup lang='ts'>
import { Ref, ref } from 'vue'
import CurrentSong from '../components/CurrentSong.vue'
import InGame from '../components/InGame.vue'
import Leaderboard from '../components/Leaderboard.vue'
import RockSniffer, { SnifferState } from '../scripts/rocksniffer'
import NumberDisplay from '../components/NumberDisplay.vue'

const rockSniffer = RockSniffer.instance

const snifferState: Ref<SnifferState> = ref(rockSniffer.state)
const number: Ref<string> = ref('0000')

rockSniffer.on('stateChange', (state: SnifferState) => {
    snifferState.value = state
})

setInterval(() => {
    number.value = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
}, 2000)
</script>

<template>
<div id='waiting' v-if='snifferState === SnifferState.WaitingForSniffer'>Waiting for Rocksniffer to launch<span class='Ellipsis' /></div>
<div id='waiting' v-if='snifferState === SnifferState.WaitingForRocksmith'>Waiting for Rocksmith to launch<span class='Ellipsis' /></div>
<div id='waiting' v-if='snifferState === SnifferState.WaitingForSongData'>Please navigate to a song in Rocksmith<span class='Ellipsis' /></div>
<div id='panels' v-if='snifferState === SnifferState.InMenu || snifferState === SnifferState.InSong'>
    <CurrentSong />
    <InGame      v-if='snifferState === SnifferState.InSong'/>
    <Leaderboard v-if='snifferState === SnifferState.InMenu'/>
</div>
<!-- <NumberDisplay :str='number' :string-length='4' /> -->
</template>

<style scoped>
.NumberDisplay {
    height: 3rem;
    font-size: 3rem;
}

.NumberDisplay:deep(.Digit) {
    height: 3rem;
}

#currentSong {
    margin-bottom: 1rem;
}

#waiting {
    padding: 1rem;

    color: white;
    background-color: var(--dark-gray);
    border-radius: .25rem;
}
</style>