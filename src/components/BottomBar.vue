<script setup lang='ts'>
import counterIcon from '../assets/counter_bar_icon.svg'
import mediationIcon from '../assets/mediation_bar_icon.svg'
import profileIcon from '../assets/profile_bar_icon.svg'
</script>

<template>
    <div class='pb-24'>
    <nav class='fixed bottom-0 left-0 z-50 w-full h-26 bg-white sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 sm:rounded-t-xl'>
      <div class='grid h-full max-w-lg grid-cols-3 mx-auto font-medium'>
        <RouterLink to='/' class='grayscale inline-flex flex-col items-center justify-center px-5 group'>
          <img :src='counterIcon' class='w-12 h-12 mb-1' />
          <span class='text-lg text-black'>Compteur</span>
        </RouterLink>
        <RouterLink to='/login' class='grayscale inline-flex flex-col items-center justify-center px-5 group'>
          <img :src='mediationIcon' class='w-12 h-12 mb-1' />
          <span class='text-lg text-black'>Médiation</span>
        </RouterLink>
        <RouterLink to='/account' class='grayscale inline-flex flex-col items-center justify-center px-5 group'>
          <img :src='profileIcon' class='w-12 h-12 mb-1' />
          <span class='text-lg text-black'>Mon profil</span>
        </RouterLink>
      </div>
    </nav>
    </div>
</template>