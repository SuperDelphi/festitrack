<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        })
        if (error) throw error
        alert('Ouvrez votre boîte mail et cliquez sur le lien de connexion !')
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
    <form @submit.preven="handleLogin">
        <div>
            <h1>Connexion</h1>
            <p>Saisissez votre adresse mail pour recevoir un lien de connexion</p>
            <div>
                <input required type="email" placeholder="exemple@domaine.com" v-model="email" />
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