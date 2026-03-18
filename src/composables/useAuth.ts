import { ref, readonly, onMounted, onUnmounted } from 'vue'
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

    const updateProfileLocation = async (locationId: number | null) => {
        if (!sessionUser.value) {
            router.push('/login')
            return { error: 'User not authenticated'}
        }

        const { data, error } = await supabase
            .from('Users')
            .update({ assigned_location: locationId })
            .eq('id', userProfile.value.id)
            .select('*, Locations (*), Roles (*)')
            .single()

        if (error) {
            console.error('Error updating profile location:', error)
            return { error }
        }
        
        userProfile.value = data

        return { data }
    }

    const init = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        sessionUser.value = session?.user || null

        if (sessionUser.value) await loadProfile(sessionUser.value.id)
        else router.push('/login')
    
        isReady.value = true

        // Redirige automatiquement vers le login si la session est expirée ou invalide
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                sessionUser.value = null
                userProfile.value = null
                router.push('/login')
            }
        })
    }

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            console.log('App is visible, refreshing session...')
            init()
        }
    }

    const setupVisibilityListener = () => {
        onMounted(() => {
            document.addEventListener('visibilitychange', handleVisibilityChange)
            document.addEventListener('focus', handleVisibilityChange)
        })
        onUnmounted(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            document.removeEventListener('focus', handleVisibilityChange)
        })
    }

    return {
        sessionUser: readonly(sessionUser),
        userProfile: readonly(userProfile),
        isReady: readonly(isReady),
        loadProfile,
        updateProfileLocation,
        setupVisibilityListener,
        init,
    }
}