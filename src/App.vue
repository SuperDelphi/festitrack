<script setup lang='ts'>
import BottomBar from './components/BottomBar.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
</script>

<template>
    <main>
      <RouterView />
    </main>
    <BottomBar v-if='route.meta.showBottomBar' />
</template>

<style scoped>
</style>