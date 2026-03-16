<script setup lang='ts'>
// Assets
import minusIcon from '../assets/minus_icon.svg'
import plusIcon from '../assets/plus_icon.svg'

import { supabase } from '../supabase'
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

// TODO: Demander à l'utilisateur de sélectionner le lieu si aucun lieu assigné
const { sessionUser, userProfile } = useAuth()
const currentCount = ref(0)
const cumulateCount = ref(0)
const loading = ref(true)

onMounted(async () => {
    await populateDashboard()
})

async function fetchCurrentCount(locationId: number) {
    try {
        const { data, error } = await supabase
            .rpc('get_location_current', { loc_id: locationId})

        if (error) throw error

        currentCount.value = data || 0
    } catch (error) {
        console.error('Error during current count fetch:', error)
    }
}

async function fetchCumulateCount(locationId: number) {
    try {
        const { data, error } = await supabase
            .rpc('get_location_cumulate', { loc_id: locationId})

        if (error) throw error

        cumulateCount.value = data || 0
    } catch (error) {
        console.error('Error during cumulative count fetch:', error)
    }
}

async function incrementCount() {
    try {
        if (!userProfile.value || !userProfile.value.Locations) {
            alert('Vous n\'avez pas de lieu assigné. Veuillez choisir un lieu dans votre profil.')
        }

        const { error } = await supabase
            .from('Occupancy_Logs')
            .insert({
                change: 1,
                location_id: userProfile.value.Locations.id,
                user_id: userProfile.value.id
            })
        
        if (error) throw error

        // Mise à jour locale des compteurs
        currentCount.value += 1
        cumulateCount.value += 1
    } catch (error) {
        console.error('Error during count increment:', error)
    }
}

async function decrementCount() {
    try {
        if (!userProfile.value || !userProfile.value.Locations) {
            alert('Vous n\'avez pas de lieu assigné. Veuillez choisir un lieu dans votre profil.')
        }

        const { error } = await supabase
            .from('Occupancy_Logs')
            .insert({
                change: -1,
                location_id: userProfile.value.Locations.id,
                user_id: userProfile.value.id
            })
        
        if (error) throw error

        // Mise à jour locale des compteurs
        currentCount.value = Math.max(0, currentCount.value - 1)
    } catch (error) {
        console.error('Error during count decrement:', error)
    }
}

async function setLocationStatus(isOpen: boolean) {
    
}

async function populateDashboard() {
    try {
        if (userProfile?.value.Locations?.id) {
            await Promise.all([
                fetchCurrentCount(userProfile.value.Locations.id),
                fetchCumulateCount(userProfile.value.Locations.id)
            ])
            console.log('3. Counts fetched - Current:', currentCount.value, 'Cumulative:', cumulateCount.value)
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
        <h1 class='text-3xl font-bold mb-8'>{{ userProfile?.Locations?.name || 'Lieu non assigné' }}</h1>

        <!-- Encart sur fond gris -->
        <div class='w-full max-w-sm p-8 rounded-[25px] bg-gray-100 flex justify-between items-center relative overflow-hidden'>
            <!-- Actuel -->
            <div class='flex flex-col items-center flex-1'>
                <span class='font-bold'>Actuel</span>
                <span :class='"text-6xl font-bold my-1 " + (currentCount >= userProfile?.Locations?.max_capacity ? "text-red-500" : "text-[#2bb385]")'>{{ currentCount }}</span>
                <span class='font-bold'>/ {{ userProfile?.Locations?.max_capacity || 0 }}</span>
            </div>
            
            <!-- Séparateur -->
            <div class='w-px h-24 bg-black opacity-15 mx-4'></div>

            <!-- Total jour -->
            <div class='flex flex-col items-center flex-1'>
                <span class='font-bold'>Total jour</span>
                <span class='text-6xl font-bold my-1'>{{ cumulateCount || 0 }}</span>
                <span class='font-bold'>Cumulatif</span>
            </div>
        </div>

        <!-- Bouton d'ouverture/fermeture du lieu -->
        <button v-if='userProfile?.Roles?.is_admin' class='w-full max-w-sm mt-8 py-2 border-2 border-red-300 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 active:scale-95 transition-all'>Déclarer la fermeture du lieu</button>
    
        <!-- Boutons d'action -->
        <div class='flex w-full max-w-sm gap-4 mt-6'>
            <button @click='decrementCount' class='flex-1 py-3 flex flex-col items-center justify-center border-2 border-black rounded-[25px] hover:bg-gray-50 active:scale-95 transition-all'>
                <img :src='minusIcon' class='h-4' />
                <span class='text-xl font-bold'>Sortie</span>
            </button>
            <button @click='incrementCount' class='flex-1 py-6 flex flex-col items-center justify-center bg-[#4e5dff] text-white rounded-[25px] active:scale-95 transition-all'>
                <img :src="plusIcon" class='h-4' />
                <span class='text-xl font-bold'>Entrée</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>
