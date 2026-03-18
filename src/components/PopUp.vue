<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue';


defineProps<{
    title: string,
    message: string,
    close: () => void,
    action: () => void
}>()

onMounted(() => {
    document.body.classList.add('no-scroll')
})

onUnmounted(() => {
    document.body.classList.remove('no-scroll')
})

</script>

<template>
    <div id='bg' class='w-screen h-screen flex items-center justify-center flex-col backdrop-blur-xs'>
        <div id='popup' class='bg-white rounded-4xl p-6 w-11/12 sm:w-96 text-center justify-between flex flex-col'>
            <div>
                <h2 class='text-2xl font-bold mb-4'>{{ title }}</h2>
                <span>{{ message }}</span>
            </div>
            <div class='mt-6 flex gap-4 justify-center'>
                <button @click="close" class='flex-1 py-1 px-8 flex flex-col items-center justify-center border-gray-300 border-2 rounded-[25px] active:scale-95 transition-all'>
                    <span class='text-xl font-bold'>Retour</span>
                </button>
                <button @click="action" class='flex-1 py-1 px-8 flex flex-col items-center justify-center bg-[#4e5dff] text-white rounded-[25px] active:scale-95 transition-all'>
                    <span class='text-xl font-bold'>Confirmer</span>
                </button>

            </div>
        </div>
    </div>
</template>

<style>
.no-scroll {
    overflow: hidden;
    touch-action: none;
    -webkit-overflow-scrolling: none;
}
</style>

<style scoped>
#bg {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    backdrop-filter: blur(8px);
    background-color: #00000010;
    /* Block scroll behind */
    overflow: hidden;
    pointer-events: all;
}
</style>