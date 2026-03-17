<script setup lang='ts'>
import { supabase } from '../supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import type { Location } from '@/types/supabase'

const router = useRouter()

const { userProfile, updateProfileLocation } = useAuth()
const locations = ref<Location[]>([])
const loading = ref(false)

async function getLocations() {
    try {
        loading.value = true
        const { data, error } = await supabase
        .from('Locations')
        .select('*')
        // TODO: Filtrer les lieux en fonction de l'utilisateur connecté

        if (error) throw error

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
        <h1 class='text-3xl font-bold mb-1'>Sélection</h1>
        <h2 class='text-xl text-gray-400 font-bold mb-8 uppercase'>{{ locations.length }} lieux disponibles</h2>
    </div>
    <div>
        <ul>
            <li v-for='location in locations' :key='location.id'>
                <button @click='selectLocation(location.id)'>
                    {{ location.name }}
                </button>
            </li>
        </ul>
    </div>
</template>