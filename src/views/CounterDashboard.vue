<script setup lang='ts'>
// Types
import type { AuthUser } from '@supabase/supabase-js'
import type { User, Location } from '../types/supabase'

// Assets
import minusIcon from '../assets/minus_icon.svg'
import plusIcon from '../assets/plus_icon.svg'

import { supabase } from '../supabase'
import { ref, onMounted } from 'vue'

// TODO: Demander à l'utilisateur de sélectionner le lieu si aucun lieu assigné
const sessionUser = ref<AuthUser | null>(null)
const userProfile = ref<User | null>(null)

const location = ref<Location | null>(null)
const isAdmin = ref(false)

const loading = ref(true)

onMounted(async () => {
    await populateDashboard()
})

async function populateDashboard() {
    try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
            sessionUser.value = session.user

            // Utilisateur, rôle et lieu assigné
            const { data } = await supabase
                .from('Users')
                .select('*, Locations ( name, short_name, max_capacity, is_increment_only, is_open ), Roles ( is_admin )')
                .eq('id', session.user.id)
                .single()

            console.log('User data:', data)

            userProfile.value = data
            location.value = data.Locations?.name
            isAdmin.value = data.Roles?.is_admin
        }
    } catch (error: any) {
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-8'>{{ location }}</h1>

        <!-- Encart sur fond gris -->
        <div class='w-full max-w-sm p-8 rounded-[25px] bg-gray-100 flex justify-between items-center relative overflow-hidden'>
            <!-- Actuel -->
            <div class='flex flex-col items-center flex-1'>
                <span class='font-bold'>Actuel</span>
                <span class='text-6xl font-bold text-[#2bb385] my-1'>XX</span>
                <span class='font-bold'>/ YY</span>
            </div>
            
            <!-- Séparateur -->
            <div class='w-px h-24 bg-black opacity-15 mx-4'></div>

            <!-- Total jour -->
            <div class='flex flex-col items-center flex-1'>
                <span class='font-bold'>Total jour</span>
                <span class='text-6xl font-bold my-1'>XXX</span>
                <span class='font-bold'>Cumulatif</span>
            </div>
        </div>

        <!-- Bouton d'ouverture/fermeture du lieu -->
        <button v-if='isAdmin' class='w-full max-w-sm mt-8 py-2 border-2 border-red-300 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 active:scale-95 transition-all'>Déclarer la fermeture du lieu</button>
    
        <!-- Boutons d'action -->
        <div class='flex w-full max-w-sm gap-4 mt-6'>
            <button class='flex-1 py-3 flex flex-col items-center justify-center border-2 border-black rounded-[25px] hover:bg-gray-50 active:scale-95 transition-all'>
                <img :src="minusIcon" class='h-4' />
                <span class='text-xl font-bold'>Sortie</span>
            </button>
            <button class='flex-1 py-6 flex flex-col items-center justify-center bg-[#4e5dff] text-white rounded-[25px] active:scale-95 transition-all'>
                <img :src="plusIcon" class='h-4' />
                <span class='text-xl font-bold'>Entrée</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>
