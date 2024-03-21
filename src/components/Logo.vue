<script setup>

const props = defineProps({
  image: String,
  width: String,
  height: String,
})

</script>

<template>
  <img :src="image" :width="width" :height="height"/>
</template>

<style scoped>

</style>
