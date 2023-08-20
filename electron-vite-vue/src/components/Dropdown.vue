<script setup lang='ts'>
const props = defineProps({ options: Array<String>, selected: String })
const emit = defineEmits([ 'select' ])
</script>

<template>
<div class='Dropdown'>
    <div class='Icon' />
    <div class='Options'>
        <div class='Option' v-for='option in options'>
            {{ option }}
        </div>
    </div>
</div>

</template>

<style scoped>
.Dropdown {
    z-index: 1000;
}

.Dropdown:hover .Options {
    width: 7.1rem;
    height: 6.1rem;
    opacity: 1;
}

.Icon {
    position: absolute;

    width: 1.5rem;
    height: 1.5rem;

    background-image: url(../assets/dots.svg);
    background-size: cover;
    background-color: white;
    border-radius: 50%;
}

.Options {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    overflow: hidden;
    background-color: var(--dark-gray);
    border-radius: .75rem;
    border: 2px solid white;
    opacity: 0;

    transition-property: opacity, width, height;
    transition-duration: .3s;
}

.Option {
    display: block;
    color: white;
    padding: .5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: fit-content;
}
</style>