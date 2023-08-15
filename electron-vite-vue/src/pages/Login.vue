<script setup lang='ts'>
import { getHost } from '../scripts/util'
import { BadResponseError, UnexpectedError } from '../scripts/errors'
import Store from '../scripts/store'
import { alert } from '../scripts/util'
import TextInput from '../components/TextInput.vue'

let usernameOrEmail: string
let password: string
const store = Store.instance

async function generateAuthData(usernameOrEmail: string, password: string): Promise<Response> {
    const host = getHost()
    const response = await fetch(host + '/api/auth/login.php', {
        method: 'POST',
        headers: {
            username_or_email: usernameOrEmail,
            password: password
        }
    })

    if ('error' in response) {
        throw new BadResponseError(response['error'] as (string | undefined))
    }

    return response
}

async function login(): Promise<void> {
    try {
        const authData = await generateAuthData(usernameOrEmail, password)

        // Login successful - store auth data
        await store.set('auth_data', authData)

        // Email is verified - proceed to application
        // window.location.href = '../index.html'
        alert('login succesful')
        return
    } catch (error) {
        console.error(error)
        if ((error as Error).name === 'BAD_RESPONSE_ERROR') {
            alert(error.message)
            password = ''
            return
        }

        throw new UnexpectedError((error as Error).message)
    }
}

async function resetPassword(): Promise<void> {
    if (usernameOrEmail.trim() === '') {
        alert('Please enter your username or email.')
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
        alert(`Password reset request for "${usernameOrEmail}" sent successfully.\n\nCheck your email for a reset link.`);
    }
}
</script>

<template>
<div id='login'>
    <div class='HeaderMedium'>Please Log In</div>
    <TextInput label='Username / Email' v-model='usernameOrEmail' />
    <TextInput label='Password' v-model='password' />
    <div class='Button' @click='login()'>Log In</div>
</div>
</template>

<style scoped>
#login {
    margin-top: 10rem;
}
</style>