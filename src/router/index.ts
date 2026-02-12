import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/CounterDashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { showBottomBar: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { showBottomBar: false }
        },
        {
            path: '/account',
            name: 'account',
            component: () => import('../views/Account.vue'),
            meta: { showBottomBar: true }
        }
    ]
})

export default router