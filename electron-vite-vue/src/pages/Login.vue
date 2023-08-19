<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { getHost } from '../scripts/util'
import { BadResponseError, UnexpectedError } from '../scripts/errors'
import Store from '../scripts/store'
import TextInput from '../components/TextInput.vue'
import Account from '../scripts/account'
import { ref } from 'vue'

const router = useRouter()
const store = Store.instance
const account = Account.instance

let usernameOrEmail: string
let password: string
let alert = ref('')


async function login(): Promise<void> {
    try {
        await account.logInWithCredentials(usernameOrEmail, password)
        router.push('/')

    } catch (error) {
        if (error instanceof BadResponseError) {
            alert.value = error.message
        }
    }
}

async function resetPassword(): Promise<void> {
    if (usernameOrEmail.trim() === '') {
        // alert('Please enter your username or email.')
        return
    }

    const host = getHost()

    const response = await fetch(host + '/api/account/send_password_reset_email.php', {
        method: 'POST',
        headers: {
            username_or_email: usernameOrEmail
        }
    })

    if ('error' in response) {
        throw new BadResponseError(response['error'] as (string | undefined))
    }

    if ('success' in response && response.success) {
        // alert(`Password reset request for "${usernameOrEmail}" sent successfully.\n\nCheck your email for a reset link.`);
    }
}
</script>

<template>
<div id='login'>
    <div class='HeaderMedium'>Please Log In</div>
    <div id='inputs'>
        <TextInput label='Username / Email' v-model='usernameOrEmail' />
        <TextInput label='Password' v-model='password' type='password' />
    </div>
    <div id='bottomRow'>
        <button @click='login()'>Log In</button>
        <div v-if='alert' id='alert'>{{ alert }}</div>
    </div>

</div>
</template>

<style scoped>
#login {
    width: 500px;

    margin: auto;
    margin-top: 10rem;
    padding: 2rem;

    border: 1px solid var(--dark-gray);
    border-radius: .25rem;

    /* box-shadow: 0 0 .5rem rgba(0, 0, 0, .5); */
}

#inputs {
    margin-bottom: 2rem;
}

#bottomRow {
    display: flex;
    justify-content: space-between;
}

#alert {
    display: inline-block;
    padding: .5rem;

    color: var(--color-red);
    text-decoration: underline;

    animation: appear .2s;
}
</style>