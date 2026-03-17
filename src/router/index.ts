import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/CounterDashboard.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { showBottomBar: true, requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { showBottomBar: false, requiresAuth: false }
        },
        {
            path: '/mediation',
            name: 'mediation',
            component: () => import('../views/Mediation.vue'),
            meta: { showBottomBar: true, requiresAuth: true }
        },
        {
            path: '/account',
            name: 'account',
            component: () => import('../views/Account.vue'),
            meta: { showBottomBar: true, requiresAuth: true }
        },
        {
            path: '/locations',
            name: 'locations',
            component: () => import('../views/Locations.vue'),
            meta: { showBottomBar: false, requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const { sessionUser, init, isReady } = useAuth()

    if (!isReady.value) {
        await init()
    }

    // Si la page nécessite une auth et que la session est null -> Login
    if (to.meta.requiresAuth && !sessionUser.value) {
        next('/login')
    } else {
        next()
    }
})

export default router