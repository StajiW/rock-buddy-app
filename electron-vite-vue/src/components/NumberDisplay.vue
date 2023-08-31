<script setup lang='ts'>
import { watch, ref, Ref, onMounted, reactive, onUpdated } from 'vue'

const props = defineProps({
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
const SCROLL_DURATION = 200

enum Animation {
    Up,
    Down,
    None
}

type Character = {
    digits: [string, string, string]    // 0 is above, 1 is shown, 2 is below
    animation: Animation
}

let characters = reactive<Character[]>([])

watch(() => props.str, (newStr, oldStr) => {
    for (let i = 0; i < newStr.length; i++) {
        const oldIndex = CHARACTERS.indexOf(oldStr[i])
        const newIndex = CHARACTERS.indexOf(newStr[i])

        if (newIndex === oldIndex) continue
        if (newIndex < oldIndex) {
            characters[i].digits[0] = newStr[i]
            characters[i].animation = Animation.Down

            setTimeout(() => {
                characters[i].digits[1] = newStr[i]
                characters[i].animation = Animation.None
            }, SCROLL_DURATION - 20)
        }
        else {
            characters[i].digits[2] = newStr[i]
            characters[i].animation = Animation.Up

            setTimeout(() => {
                characters[i].digits[1] = newStr[i]
                characters[i].animation = Animation.None
            }, SCROLL_DURATION - 20)
        }
    }
})

onMounted(() => {
    characters = reactive(Array(props.stringLength).fill(undefined).map(_ => { return {
        digits: ['0', '0', '0'],
        animation: Animation.None
    }}))
})
</script>

<template>
<div class='NumberDisplay'>
    <div class='Character' v-for='character in characters' :class='Animation[character.animation]' >
        <div class='Digit' v-for='digit in character.digits'>{{ digit }}</div>    
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

    /* border: 1px solid black; */
}

.Character {
    position: relative;
    display: inline-block;
    top: -100%;
}

.Character.Up {
    animation: Up 200ms;
}

@keyframes Up {
    from { top: -100% }
    to { top: -200% }
}

.Character.Down {
    animation: Down 200ms;
}

@keyframes Down {
    from { top: -100% }
    to { top: 0% }
}

.Digit {
    height: 1rem;
    line-height: 100%;
}
</style>