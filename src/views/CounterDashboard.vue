<script setup lang='ts'>
import minusIcon from '../assets/minus_icon.svg'
import plusIcon from '../assets/plus_icon.svg'

import { supabase } from '../supabase'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import router from '../router'

const { userProfile } = useAuth()
const currentCount = ref(0)
const cumulateCount = ref(0)
const loading = ref(true)
let realtimeChannel: any = null

onMounted(async () => {
    await populateDashboard()

    if (!userProfile.value?.Locations) {
        router.push('/locations')
    }

    subscribeToCount()
})

onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
    }
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
    if (loading.value) return
    loading.value = true

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
    } finally {
        loading.value = false
    }
}

async function decrementCount() {
    if (loading.value) return
    loading.value = true

    if (currentCount.value <= 0) return

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
    } finally {
        loading.value = false
    }
}

async function setLocationStatus(isOpen: boolean) {
    
}

async function populateDashboard() {
    try {
        if (userProfile.value?.Locations?.id) {
            await Promise.all([
                fetchCurrentCount(userProfile.value.Locations.id),
                fetchCumulateCount(userProfile.value.Locations.id)
            ])
        }
    } catch (error: any) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const subscribeToCount = () => {
    realtimeChannel = supabase
        .channel('public:Occupancy_Logs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Occupancy_Logs', filter: `location_id=eq.${userProfile.value?.assigned_location}`},
            (payload) => {
                if (payload.new.user_id === userProfile.value?.id) return // Ignorer les changements provenant de l'utilisateur actuel
                currentCount.value = Math.max(0, currentCount.value + payload.new.change)
                if (payload.new.change > 0) {
                    cumulateCount.value += payload.new.change
                }
            }
        )
        .subscribe()
}

</script>

<template>
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-8'>{{ userProfile?.Locations?.name || 'Lieu non assigné' }}</h1>

        <template v-if='userProfile?.Locations'>

            <RouterLink to='/locations' class='flex-1 py-1 mb-6 px-8 flex flex-col items-center justify-center border-gray-300 border-2 rounded-[25px] active:scale-95 transition-all'>
                <span class='text-xl font-bold'>Changer de lieu</span>
            </RouterLink>
            
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
            <!-- <button v-if='userProfile?.Roles?.is_admin' class='w-full max-w-sm mt-8 py-2 border-2 border-red-300 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 active:scale-95 transition-all'>Déclarer la fermeture du lieu</button> -->
        
            <!-- Boutons d'action -->
            <div class='flex w-full max-w-sm gap-4 mt-6'>
                <button @click='decrementCount' class='flex-1 py-3 flex flex-col items-center justify-center border-2 border-black rounded-[25px] hover:bg-gray-50 active:scale-95 transition-all' :disabled="currentCount <= 0">
                    <img :src='minusIcon' class='h-4' />
                    <span class='text-xl font-bold'>Sortie</span>
                </button>
                <button @click='incrementCount' class='flex-1 py-6 flex flex-col items-center justify-center bg-[#4e5dff] text-white rounded-[25px] active:scale-95 transition-all'>
                    <img :src="plusIcon" class='h-4' />
                    <span class='text-xl font-bold'>Entrée</span>
                </button>
            </div>
        </template>
        <template v-else>
            <a href='/#/locations' class='flex-1 py-3 px-6 flex flex-col items-center justify-center border-2 border-black rounded-[25px] hover:bg-gray-50 active:scale-95 transition-all' :disabled="currentCount <= 0">
                <span class='text-xl font-bold'>Choisir un lieu</span>
            </a>
        </template>
    </div>
</template>

<style scoped>
:disabled {
    cursor: not-allowed;
    opacity: 0.33;
}
</style>
