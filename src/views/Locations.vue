<script setup lang='ts'>
import { supabase } from '../supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

import PopUp from '../components/PopUp.vue'

import arrowIcon from '../assets/arrow_icon.svg'

const router = useRouter()

const { userProfile, updateProfileLocation } = useAuth()
const locations = ref<any[]>([])
const yesterdayCount = ref(0)
const todayCount = ref(0)
const globalCount = ref(0)
const loading = ref(false)

const showPopUp = ref(false)
const popUpMessage = ref('')
const locId = ref<number | null>(null)

async function getStatistics() {
    try {
        loading.value = true

        const { data, error } = await supabase
            .rpc('get_global_stats')

        if (error) throw error

        globalCount.value = data.total || 0
        todayCount.value = data.today_total || 0
        yesterdayCount.value = data.yesterday_total || 0
    } finally {
        loading.value = false
    }
}

async function getLocations() {
    try {
        loading.value = true
        const { data, error } = await supabase
        .from('Locations')
        .select('*, Users!assigned_location(id, first_name, last_name)')
        .order('name', { ascending: true })

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

async function askLocation(locationId: number) {
    locId.value = locationId

    let locationUsers = locations.value.find((loc: any) => loc.id === locationId)?.Users || []
    locationUsers = locationUsers.filter((u: any) => u.id !== userProfile.value?.id)

    if (locationUsers.length === 0) {
        selectLocation(locationId)
        return
    }

    popUpMessage.value = 'Ce lieu est actuellement assigné à ' + locationUsers.map((u: any) => u.first_name).join(', ') + '. Vous pouvez continuer, mais si vous n\'êtes pas sur place, merci de ne pas utiliser le compteur !'
    showPopUp.value = true
}

function closePopUp() {
    showPopUp.value = false
    locId.value = null
}

function confirmPopUp() {
    if (locId.value) {
        selectLocation(locId.value)
    }
    showPopUp.value = false
    locId.value = null
}

onMounted(async () => {
    await getLocations();
    await getStatistics();
})

</script>

<template>
    <PopUp v-if='showPopUp' title='Attention' :message='popUpMessage' :close='closePopUp' :action='confirmPopUp' />
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-1'>Sélection du lieu</h1>
        <h2 class='text-xl text-gray-400 font-bold text-center mt-8 uppercase'><span class='text-[#88b3fc]'>{{ yesterdayCount }}</span> visiteurs hier / <span class='text-[#88b3fc]'>{{ todayCount }}</span> visiteurs aujourd'hui / <span class='text-[#88b3fc]'>{{ globalCount }}</span> visiteurs au total en 2026.</h2>
    </div>
    <div>
        <ul class='max-w-md mx-auto p-6'>
            <li v-for='location in locations' :key='location.id' class='px-5 py-3 border-3 border-[#eaeaea] rounded-[15px] mb-2 overflow-hidden shadow-xs active:scale-95 transition-all'>
                <button @click='askLocation(location.id)' class='w-full flex justify-center items-left flex-col'>
                    <div class='flex justify-between items-center w-full'>
                        <span class='text-xl font-bold truncate'>{{ location.name }}</span>
                        <img :src='arrowIcon' class='h-4' />
                    </div>
                    <div v-if='location.Users.length > 0' class='text-left mt-2'>
                        <span v-for="user in location.Users" :key="user.id" :class='"font-bold inline-block py-1 px-2 mr-1 " + (user.id === userProfile?.id ? "bg-[#4e5dff] text-white" : "bg-[#88b3fc22] text-[#88b3fc]") + " rounded-lg"'>{{ user.first_name + ' ' + user.last_name.toUpperCase()[0] + '.' }}</span>
                    </div>
                </button>
            </li>
        </ul>
    </div>
</template>