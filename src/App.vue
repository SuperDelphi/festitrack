<script setup lang='ts'>
import BottomBar from './components/BottomBar.vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { isReady, init, setupVisibilityListener } = useAuth()
init() // Chargement global
setupVisibilityListener() // Rafraîchissement de la session à chaque focus de l'application

const route = useRoute()
</script>

<template>
    <template v-if='isReady'>
      <main>
      <RouterView />
      </main>
      <BottomBar v-if='route.meta.showBottomBar' />
    </template>
</template>

<style scoped>
</style>