<script setup>

const props = defineProps({
  color: String,
})
</script>

<template>
  <div class="w-3 h-3 rounded-full" :class="color"/>
</template>

<style scoped>
.red {
  background-color: #ff5f57;
}

.yellow {
  background-color: #ffbd2f
}

.green {
  background-color: #28c840;
}
</style>
