<script setup lang='ts'>
import TextInput from '../components/TextInput.vue'

let username: string
let password: string
</script>

<template>
<div id='login'>
    <div class='HeaderMedium'>Log In</div>
    <TextInput label='Username / Email' v-model='username' />
    <TextInput label='Password' v-model='password' />
</div>
</template>

<style scoped>
#login {
    margin-top: 10rem;
}
</style>