import { ref, readonly } from 'vue'
import { supabase } from '../supabase'
import type { User as AuthUser } from '@supabase/supabase-js'
import router from '../router'

// État global partagé
const sessionUser = ref<AuthUser | null>(null)
const userProfile = ref<any | null>(null)
const isReady = ref(false)

export function useAuth() {
    const loadProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('Users')
            .select('*, Locations (*), Roles (*)')
            .eq('id', userId)
            .maybeSingle()

        if (!error) userProfile.value = data

        return data
    }

    const init = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        sessionUser.value = session?.user || null

        if (sessionUser.value) await loadProfile(sessionUser.value.id)
        else router.push('/login')
    
        isReady.value = true
    }

    return {
        sessionUser: readonly(sessionUser),
        userProfile: readonly(userProfile),
        isReady: readonly(isReady),
        loadProfile,
        init
    }
}