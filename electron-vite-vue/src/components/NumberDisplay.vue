<script setup lang='ts'>
defineProps({
    str: {
        type: String,
        required: true
    },
    stringLength: {
        type: Number,
        required: true
    }
})

const CHARACTERS = ' 0123456789.%'
</script>

<template>
<div class='NumberDisplay'>
    <div class='Character'
    v-for='i in stringLength'
    :style="{ top: `${-100 * (CHARACTERS.indexOf(str[i - 1]))}%` }">
        <div class='Digit' v-for='j in CHARACTERS'>{{ j }}</div>    
    </div>
</div>
</template>

<style scoped>
.NumberDisplay {
    display: inline-block;

    height: 1rem;

    /* Not sure why but this fixes alignment regardless of font size */
    margin-bottom: -.25rem;

    font-size: 1rem;

    overflow: hidden;
}

.Character {
    position: relative;
    display: inline-block;

    transform: top;
    transition-duration: .3s;
}

.Digit {
    height: 1rem;
    line-height: 100%;
}
</style>