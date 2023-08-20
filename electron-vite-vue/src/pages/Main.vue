<script setup lang='ts'>
import CurrentSong from '../components/CurrentSong.vue'
import InGame from '../components/InGame.vue'
import Leaderboard from '../components/Leaderboard.vue'
</script>

<template>
<CurrentSong />
<InGame />
<Leaderboard />
</template>

<style scoped>
#currentSong {
    margin-bottom: 1rem;
}
</style>