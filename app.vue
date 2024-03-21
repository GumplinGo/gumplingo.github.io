<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import 'reset-css'

useHead({
  htmlAttrs: {
    lang: 'zh-CN',
  },
  title: '小江大浪',
  titleTemplate: title => title !== '小江大浪' ? `${title} · 小江大浪` : title,
  meta: [
    { name: 'description', content: '小江大浪的个人空间 ✨' },
  ],
})
</script>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #111;
  color: white;
  color-scheme: dark;
}
</style>
