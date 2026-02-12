<script setup lang='ts'>
</script>

<template>
  <nav>
    <RouterLink to='/'>Home</RouterLink>
    <RouterLink to='/login'>Connexion</RouterLink>
    <RouterLink to='/account'>Mon compte</RouterLink>
  </nav>
  
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
</style>