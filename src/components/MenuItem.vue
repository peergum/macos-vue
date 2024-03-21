<script setup>

import SubMenu from "@/components/SubMenu.vue";

const props = defineProps({
  active: Boolean,
  item: Object,
  separator: Boolean,
})
const emit = defineEmits({
  "update:active": Boolean,
})

const activate = (item) => {
  emit("update:active", item)
}

const itemClass = () => {
  return props.active ? 'bg-apple-selected' : 'bg-none';
}
</script>

<template>
  <div class="menu-item"
       @click="activate(props.item)"
       :class="itemClass()">
    <SubMenu v-if='active && item.menu'
             :menu="item.menu"
             :level="1"
    />
    <div v-if="item">
      <div v-if="item?.name === '---'" class="w-1 h-fit text-gray-400">
        |
      </div>
      <div v-else>{{ item.name }}</div>
    </div>
    <slot v-else/>
  </div>
</template>

<style scoped>
.menu-item {
  @apply flex items-center text-sm h-6 mx-1 px-1 py-3 my-1.5 rounded-md;
}
</style>
