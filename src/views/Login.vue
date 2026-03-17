<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')

const { loadProfile } = useAuth()

const handleLogin = async () => {
    try {
        loading.value = true
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) throw error
        
        await loadProfile(data.user.id)
        router.push('/')
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class='w-screen h-[80vh] flex items-center justify-center flex-col'>
        <img src='/logo_full.svg' class="w-40 mb-8" />
        <form @submit.prevent="handleLogin">
            <label for='email'>Adresse e-mail</label>
            <input required type="email" placeholder='exemple@domaine.com' v-model='email' />
            <label for='password'>Code PIN</label>
            <input required type='password' placeholder='Mot de passe' v-model='password' />
            <div>
                <input
                    type='submit'
                    :value="loading ? 'Chargement...' : 'Continuer'"
                    :disabled="loading"
                    class='mt-2'
                />
            </div>
        </form>
    </div>
    <footer class='w-screen h-[20vh] text-center flex items-center justify-end flex-col py-6'>
        <span class='text-md mb-3'>Merci à nos bénévoles &#60;3</span>
        <span class='text-sm'>nød est un outil <a class='underline' href='https://github.com/SuperDelphi/festitrack' target='_blank'>open source</a> de comptage d'affluence et d'aide à la médiation développé par (et pour) le Festival ZERØ1.</span>
    </footer>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    width: 80%;
}

label, input {
    font-weight: bold;
}

input {
    border: none;
    border-radius: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
}

input[type="email"], input[type="password"] {
    background-color: #e6e6e6;
}

input[type="submit"] {
    background-color: black;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

input::placeholder {
    color: #acacac;
}
</style>