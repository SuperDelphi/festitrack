<script setup lang='ts'>
import BottomBar from './components/BottomBar.vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { isReady, init } = useAuth()
init() // Chargement global

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