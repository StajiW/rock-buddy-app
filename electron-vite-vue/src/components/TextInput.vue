<script setup lang='ts'>
const props = defineProps({ label: String, modelValue: String, type: String })
const emit = defineEmits([ 'update:modelValue' ])
</script>

<template>
<div class='TextInput'>
    <div class='Label'>{{ label }}</div>
    <input
        :type='props.type || "text"'
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
    box-sizing: border-box;

    font-family: 'Roboto Mono', monospace;
    font-size: 1rem;
    color: var(--dark-gray);

    /* background-color: var(--light-gray); */

    outline: none;
    border: 1px solid var(--dark-gray) !important;
    border-radius: .25rem;
}

input:focus {
    outline: 1px dashed var(--dark-gray);
    outline-offset: .25rem;
}
</style>