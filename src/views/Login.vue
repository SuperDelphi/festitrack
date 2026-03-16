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
    <div class="w-screen h-screen flex items-center justify-center flex-col">
        <img src='/logo_full.svg' class="w-40" />
        <form @submit.prevent="handleLogin">
            <label for='email'>Adresse e-mail</label>
            <input required type="email" placeholder="exemple@domaine.com" v-model="email" />
            <label for='password'>Code PIN</label>
            <input required type="password" placeholder="Mot de passe" v-model="password" />
            <div>
                <input
                    type="submit"
                    :value="loading ? 'Chargement...' : 'Continuer'"
                    :disabled="loading"
                />
            </div>
        </form>
    </div>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

label, input {
    font-weight: bold;
}

input {
    border: none;
    border-radius: 0.5rem;
    width: 100%;
}

input[type="email"], input[type="password"] {
    background-color: #e6e6e6;
    padding: 0.75rem 1rem;
}

input::placeholder {
    color: #acacac;
}
</style>