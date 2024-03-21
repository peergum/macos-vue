<script setup>

import {ref} from "vue";
import SubMenu from "@/components/SubMenu.vue";
import {ChevronRightIcon} from "@heroicons/vue/16/solid/index.js";

const props = defineProps({
  active: Boolean,
  item: Object,
})
const tmr = ref(0);
const showSub = ref(false);

const emit = defineEmits({
  "update:active": Boolean,
})

const activate = () => {
  emit("update:active", true)
}

const hoverin = (item) => {
  if (tmr.value) {
    clearTimeout(tmr.value)
  }
  tmr.value = setTimeout(() => {
    activateSub(item)
  }, 500);
}

const hoverout = () => {
  if (tmr.value) {
    clearTimeout(tmr.value)
  }
  showSub.value = false;
}

const activateSub = (item) => {
  showSub.value = true;
}

const itemClass = () => {
  return (props.active ? 'bg-gray-200' : 'bg-none')
      + (props.item.name !== '---' ? ' hover:bg-blue-400 hover:text-white' : '');
}

</script>

<template>
  <div class="menu-item"
       @mouseenter="hoverin(item)"
       @mouseleave="hoverout()"
       :class="itemClass()">
    <SubMenu v-if='showSub && item.menu' :menu="item.menu" :level="2"/>
    <div v-if="item" class="w-full">
      <div v-if="item?.name === '---'" class="flex h-6 w-full text-gray-400 flex flex-col justify-center">
        <hr/>
      </div>
      <div v-else class="flex items-center w-full justify-between gap-2">
        {{ item.name }}
        <ChevronRightIcon v-if="item.menu" class="w-4 h-4"/>
      </div>
    </div>
    <slot v-else/>
  </div>
</template>

<style scoped>
.menu-item {
  @apply relative flex items-center text-sm px-3 rounded-md;
}
</style>
