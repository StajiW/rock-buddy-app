<script setup lang="ts">
import RockSniffer, { SongData } from './scripts/rocksniffer'
import Account from './scripts/account'
import { onMounted } from 'vue'

const rockSniffer = RockSniffer.instance
const account = Account.instance

onMounted(() => {
    if (!account.authDataIsValid()) {
        window.location.href = '/login'
    }

    rockSniffer.on('songChange', (songData: SongData) => {
        console.log(songData)
    })
    rockSniffer.start()
})



</script>

<template>
<div id='content'>
<router-view />
</div>
</template>

<style>
body {
    margin: 0;
    width: 100%;
    height: 100%;

    /* background-color: black; */
}

#content {
    width: 800px;
    margin: auto;
    margin-top: 2rem;
}
</style>
