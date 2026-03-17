<script setup lang='ts'>
import { supabase } from '../supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

import arrowIcon from '../assets/arrow_icon.svg'

const router = useRouter()

const { userProfile, updateProfileLocation } = useAuth()
const locations = ref<any[]>([])
const loading = ref(false)

async function getLocations() {
    try {
        loading.value = true
        const { data, error } = await supabase
        .from('Locations')
        .select('*, Users!assigned_location(id, first_name)')
        // TODO: Filtrer les lieux en fonction de l'utilisateur connecté

        if (error) throw error

        console.log('Fetched locations:', data)

        locations.value = data || []
    } finally {
        loading.value = false
    }
}

async function selectLocation(locationId: number) {
    loading.value = true

    const { error } = await updateProfileLocation(locationId)

    if (error) {
        console.error('Error selecting location:', error)
        alert('Erreur lors de la sélection du lieu.')
    } else {
        router.push('/')
    }
}

onMounted(async () => {
    await getLocations();
})

</script>

<template>
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-1'>Sélection du lieu</h1>
        <!-- <h2 class='text-xl text-gray-400 font-bold mb-8 uppercase'>{{ locations.length }} lieux disponibles</h2> -->
    </div>
    <div>
        <ul class='max-w-md mx-auto p-6'>
            <li v-for='location in locations' :key='location.id' class='px-5 py-3 border-3 border-[#eaeaea] rounded-[15px] mb-2 overflow-hidden shadow-xs active:scale-95 transition-all'>
                <button @click='selectLocation(location.id)' class='w-full flex justify-center items-left flex-col'>
                    <div class='flex justify-between items-center w-full'>
                        <span class='text-xl font-bold'>{{ location.name }}</span>
                        <img :src='arrowIcon' class='h-4' />
                    </div>
                    <div v-if='location.Users.length > 0' class='text-left mt-2'>
                        <span v-for="user in location.Users" :key="user.id" :class='"font-bold inline-block py-1 px-2 mr-1 " + (user.id === userProfile?.id ? "bg-[#4e5dff] text-white" : "bg-[#88b3fc22] text-[#88b3fc]") + " rounded-lg"'>{{ user.first_name }}</span>
                    </div>
                </button>
            </li>
        </ul>
    </div>
</template>