<template>

</template>

<script setup lang="ts">
import sakura from '~/lib/sakura'

onMounted(() => {
  const img = new Image();
  img.src = '/avatar.jpg';
  img.onload = () => {
    sakura.startSakura(img);
  }
})

onUnmounted(() => {
  sakura.stopSakura()
})

</script>







