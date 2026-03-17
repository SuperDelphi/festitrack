<script setup lang='ts'>
import { supabase } from '../supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

const { userProfile } = useAuth()
const loading = ref(false)

async function signOut() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        router.push('/login')
    } catch (error: any) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-1'>{{ userProfile?.first_name }} {{ userProfile?.last_name }}</h1>
        <h2 class='text-xl text-gray-400 font-bold mb-8 uppercase'>{{ userProfile?.role_id }}</h2>
        <button @click="signOut" :disabled="loading" class='flex-1 py-1 mb-6 px-8 flex flex-col items-center justify-center border-gray-300 border-2 rounded-[25px] active:scale-95 transition-all'>
            <span class='text-xl font-bold'>Se déconnecter</span>
        </button>
    </div>
</template>