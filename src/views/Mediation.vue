<script setup lang='ts'>
import { supabase } from '../supabase'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

import router from '../router'

const { userProfile } = useAuth()
const works = ref<any[]>([])
const loading = ref(false)

async function getWorks() {
    if (!userProfile.value?.Locations) router.push('/locations')

    try {
        loading.value = true
        const { data, error } = await supabase
        .from('Works')
        .select('*, Artists(*)')
        .eq('location_id', userProfile.value?.Locations?.id)
        .order('title', { ascending: true })

        if (error) throw error

        works.value = data || []
    } finally {
        loading.value = false
    }
}

const formatText = (text: string) => {
    if (!text) return ''
    return text.replace(/\n/g, '<br class="block my-1" />')
}

onMounted(async () => {
    await getWorks();
})

</script>

<template>
    <div class='flex flex-col items-center p-6 max-h-screen bg-white'>
        <h1 class='text-3xl font-bold mb-1'>Médiation</h1>
    </div>
    <div>
        <ul class='max-w-md mx-auto p-6'>
            <li v-for='work in works' :key='work.id' class='px-5 py-3 border-3 border-[#eaeaea] rounded-[15px] mb-2 overflow-hidden shadow-xs'>
                <div class='w-full flex justify-center items-left flex-col'>
                    <div class='flex justify-between items-left w-full flex-col text-left'>
                        <span class='text-xl font-bold mb-4'>{{ work.title }}</span>
                        <div class='text-lg mb-4'>
                            <p class='text-[#88b3fc] font-bold'>{{ work.summary }}</p>
                        </div>
                        <p class='text-lg mb-4' v-html='formatText(work.description)'></p>
                        <span class='text-lg font-bold mb-4'>{{ work.Artists.name + ' - ' + work.Artists.country }}</span>
                        <p class='text-lg mb-4' v-html='formatText(work.Artists.bio)'></p>
                        <a :href='work.Artists.website' target='_blank' class='flex-1 py-1 mb-2 px-8 flex flex-col items-center justify-center border-gray-300 border-2 rounded-[25px] active:scale-95 transition-all'>
                            <span class='text-xl font-bold'>Site web</span>
                        </a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>