<script setup>

import SubMenu from "@/components/SubMenu.vue";

const props = defineProps({
  active: Boolean,
  item: Object,
})
const emit = defineEmits({
  "update:active": Boolean,
})

const activate = () => {
  emit("update:active", true)
}

const itemClass = () => {
  return props.active ? 'bg-gray-200' : 'bg-none';
}
</script>

<template>
  <div class="menu-item"
       @click="activate"
       :class="itemClass()">
    <SubMenu v-if='active && item.menu'
             :menu="item.menu"
             :level="1"
    />
    <div v-if="item">{{ item.name }}</div>
    <slot v-else/>
  </div>
</template>

<style scoped>
.menu-item {
  @apply flex items-center h-5 text-sm mx-2 px-4 py-1 m-2 rounded-md;
}
</style>
