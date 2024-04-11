<script setup lang="ts">

import {menuItem, menuProp} from "@/macos-vue.js";

import SubMenu from "@/components/SubMenu.vue";

const props: menuProp = defineProps<menuProp>();

// const emit = defineEmits<{
//   "update:active": [value: menuItem],
//   'menu:clicked': string,
// }>
const emit = defineEmits({
  "update:active": Object,
  "menu:click": String,
})

const activate = (item: menuItem) => {
  emit("update:active", item)
}

const itemClass = () => {
  return props.active ? 'bg-apple-selected' : 'bg-none';
}

const menuClicked = (name: string) => {
  emit('menu:click', name)
}
</script>

<template>
  <div class="menu-item"
       @click="activate(props.item)"
       :class="itemClass()">
    <SubMenu v-if='active && item.menu'
             :menu="item.menu"
             :level="1"
             @menu:click="menuClicked"
    />
    <div v-if="item?.name!=='@'">
      <div v-if="item?.name === '---'" class="w-1 h-fit text-gray-400">
        |
      </div>
      <div v-else>{{ item.name }}
      </div>
    </div>
    <slot v-else/>
  </div>
</template>

<style scoped>
.menu-item {
  @apply flex items-center text-sm h-6 mx-1 px-1 py-3 my-1.5 rounded-md;
}
</style>
