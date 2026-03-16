import { ref, readonly } from 'vue'
import { supabase } from '../supabase'
import type { User as AuthUser } from '@supabase/supabase-js'

// État global partagé
const sessionUser = ref<AuthUser | null>(null)
const userProfile = ref<any | null>(null)
const isReady = ref(false)

export function useAuth() {
    const init = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        sessionUser.value = session?.user || null

        if (sessionUser.value) {
            const { data } = await supabase.from('Users').select('*, Locations (*), Roles (*)').eq('id', sessionUser.value.id).maybeSingle()
            userProfile.value = data
        }
        isReady.value = true
    }

    return {
        sessionUser: readonly(sessionUser),
        userProfile: readonly(userProfile),
        isReady: readonly(isReady),
        init
    }
}