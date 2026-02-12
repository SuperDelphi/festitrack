<script setup lang='ts'>
import { supabase } from '../supabase'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user: any = ref(null)
const loading = ref(true)
const firstName = ref('')
const lastName = ref('')
const role = ref('')

onMounted(async () => {
    await getProfile()
})

async function getProfile() {
    try {
        loading.value = true

        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData.session) {
            user.value = sessionData.session.user
        }

        const { data, error, status } = await supabase
            .from('Users')
            .select(`first_name, last_name, role_id`)
            .eq('id', user.value.id)
            .single()
        
        if (error && status !== 406) throw error

        if (data) {
            firstName.value = data.first_name
            lastName.value = data.last_name
            role.value = data.role_id
        }
    } catch (error: any) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

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
    <div>
        <h1>{{ firstName }} {{ lastName }}</h1>
        <p>Rôle : {{ role }}(trice)</p>
        <button @click="signOut" :disabled="loading">Se déconnecter</button>
    </div>
</template>