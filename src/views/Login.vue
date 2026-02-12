<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) throw error
        console.log(await supabase.auth.getSession())
        alert('Connexion réussie !')
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
    <form @submit.prevent="handleLogin">
        <div>
            <h1>Connexion</h1>
            <div>
                <input required type="email" placeholder="exemple@domaine.com" v-model="email" />
                <br>
                <input required type="password" placeholder="Mot de passe" v-model="password" />
            </div>
            <div>
                <input
                    type="submit"
                    :value="loading ? 'Chargement...' : 'Continuer'"
                    :disabled="loading"
                />
            </div>
        </div>
    </form>
</template>

<style scoped>
</style>