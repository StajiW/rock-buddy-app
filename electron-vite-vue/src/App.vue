<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import RockSniffer from './scripts/rocksniffer'
import Account from './scripts/account'

const router = useRouter()
const rockSniffer = RockSniffer.instance
const account = Account.instance

onMounted(async () => {
    if (!(await account.authDataIsValid())) {
        router.push('/login')
    }

    rockSniffer.startProcess(() => {
        rockSniffer.start()
    })
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
}

#content {
    width: 800px;
    margin: auto;
    margin-top: 2rem;
}
</style>
