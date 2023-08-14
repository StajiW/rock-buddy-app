<script setup lang='ts'>
const props = defineProps({ label: String, modelValue: String })
const emit = defineEmits([ 'update:modelValue' ])


</script>

<template>
<div class='TextInput'>
    <div class='Label'>{{ label }}</div>
    <input
        :value='modelValue'
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</div>

</template>

<style scoped>
.TextInput {
    /* display: flex; */
    width: 100%;
    margin-bottom: 1rem;

    /* justify-content: space-between; */
}

.Label {
    /* margin-right: .5rem; */
    /* margin-top: .25rem; */
    margin-bottom: .5rem;
}

input {
    display: inline-block;
    /* flex-grow: 1; */
    /* max-width: 70%; */
    width: 100%;
    padding: .25rem;

    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    color: #222222;

    background-color: #DDDDDD;

    outline: none !important;
    border: none !important;
    border-radius: .25rem;
}
</style>