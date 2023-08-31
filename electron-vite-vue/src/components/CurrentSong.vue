<script setup lang='ts'>
import RockSniffer, { SongData } from '../scripts/rocksniffer'
import { onMounted, ref } from 'vue'

const rockSniffer = RockSniffer.instance

let title = ref('')
let artist = ref('')
let album = ref('')
let year = ref(0)
let albumCover = ref('')

rockSniffer.on('songChange', (songData: SongData) => {
    title.value = songData.title
    artist.value = songData.artist
    album.value = songData.album
    year.value = songData.year
    albumCover.value = songData.albumCover
})

onMounted(() => {
    const songData = rockSniffer.getSongData()
    title.value = songData.title
    artist.value = songData.artist
    album.value = songData.album
    year.value = songData.year
    albumCover.value = songData.albumCover
})
</script>

<template>
<div id='currentSong'>
    <img id='albumCover' :src='`data:image/png;base64,${albumCover}`'/>
    <div id='infoContainer'>
        <div id='info'>
            <div id='title'>{{ title }}</div>
            <div id='artist'>{{ artist }}</div>
            <div id='album'>{{ album }} ({{ year }})</div>
        </div>
    </div>
</div>
</template>

<style scoped>
#currentSong {
    display: flex;

    justify-content: space-between;

    padding: 1rem;

    background-color: var(--dark-gray);
    color: white;
    /* box-shadow: 0 0 1rem rgba(0, 0, 0, .5); */

    border-radius: .25rem;
}

#albumCover {
    width: 10rem;
    height: 10rem;
    margin-right: 1rem;

    border: 2px solid white;
    border-radius: .25rem;
}

#infoContainer {
    position: relative;
    flex-grow: 1;
}

#info {
    position: absolute;
    bottom: 0;
    width: 100%;
}

#title {
    font-size: 2rem;
}

#artist {
    font-size: 1.5rem;
}

#album {
    font-size: 1rem;
}
</style>