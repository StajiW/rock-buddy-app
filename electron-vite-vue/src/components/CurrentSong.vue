<script setup lang='ts'>
import RockSniffer, { SongData } from '../scripts/rocksniffer'
import { ref } from 'vue'

const rockSniffer = RockSniffer.instance

let title = ref('')
let artist = ref('')
let album: string
let year: number
let albumCover: string

rockSniffer.on('songChange', (songData: SongData) => {
    title.value = songData.title
    artist.value = songData.artist
    album = songData.album
    year = songData.year
    albumCover = songData.albumCover
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

    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .5);

    border-radius: .25rem;
}

#albumCover {
    width: 10rem;
    height: 10rem;
    margin-right: 1rem;

    /* box-shadow: 0 0 1rem rgba(0, 0, 0, .5); */

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
    font-size: 3rem;
}

#artist {
    font-size: 1.5rem;
}

#album {
    font-size: 1rem;
}
</style>