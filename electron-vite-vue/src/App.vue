<script setup lang="ts">
import Login from './pages/Login.vue'
import RockSniffer, { SongData } from './scripts/rocksniffer'

const rockSniffer = RockSniffer.instance
rockSniffer.on('songChange', (songData: SongData) => {
    console.log(`song change: ${songData.title}`)
})
rockSniffer.start()
</script>

<template>
<div id='content'>
<!-- <Login /> -->
<router-view />
</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

body {
    margin: 0;
    width: 100%;
    height: 100%;
}

#content {
    width: 800px;
    margin: auto;
    margin-top: 2rem;
}
</style>
