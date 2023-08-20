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
    width: 100%;
    margin-bottom: 1rem;
}

.Label {
    margin-bottom: .5rem;
}

input {
    display: inline-block;

    width: 100%;
    padding: .25rem;
    box-sizing: border-box;

    font-family: 'Roboto Mono', monospace;
    font-size: 1rem;
    color: var(--dark-gray);

    outline: none;
    border: 1px solid var(--dark-gray) !important;
    border-radius: .25rem;
}

input:focus {
    outline: 1px dashed var(--dark-gray);
    outline-offset: .25rem;
}
</style>