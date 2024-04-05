<script setup>

import {ref} from "vue";
import SubMenuItem from "@/components/SubMenuItem.vue";

const props = defineProps({
  menu: Object,
  level: Number,
})

const menuActive = ref(null);
const tmr = ref(0);

const menuChanged = (item) => {
  menuActive.value = item;
}

const menuClass = () => {
  return props.level === 1 ? "top-14" : "-top-2 left-full mx-4";
}

</script>

<template>
  <div class="sub-menu" :class="menuClass()">
    <SubMenuItem v-for="item in menu"
                 @update:active="menuChanged(item)"
                 :active='item?.name !== "---" && menuActive?.name===item.name'
                 :item="item"
    />
  </div>
</template>

<style scoped>
.sub-menu {
  @apply absolute z-10 h-fit min-w-40 w-fit bg-gray-100 p-1 -mx-3 -my-1 flex flex-col rounded-lg border border-gray-300 shadow-lg shadow-gray-500 text-black;
}
</style>
