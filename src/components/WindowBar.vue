<script setup>

import WindowButton from "@/components/WindowButton.vue";
import {computed, ref} from "vue";

import folderIcon from '@/assets/images/folder-sm.png'
import terminalIcon from '@/assets/images/terminal-sm.png'
import photoIcon from '@/assets/images/photo-sm.png'
import safariIcon from '@/assets/images/safari-sm.png'

const icons = ref({
  "viewer": folderIcon,
  "terminal": terminalIcon,
  "photo": photoIcon,
  "browser": safariIcon,
})

const icon = computed(() => {
  const type = props.type;
  const pluginName =props.pluginName;
  console.log(type,pluginName,props.plugins)
  return (type === 'plugin' && props.plugins
      && pluginName) ? props.plugins[pluginName][1] : icons.value[type];
})

const props = defineProps({
  title: String,
  type: String,
  plugins: Object,
  pluginName: String,
})

const emit = defineEmits({
  'update:url': String,
  'mouse:start': Object,
  'mouse:stop': Object,
})

const url = ref(props.title)
const titleValue = ref(props.title)

const barClass = computed(() => {
  return props.type === 'browser' ? 'h-12' : 'h-7';
  // + ' select-all';
})

const mouseStart = (event) => {
  emit("mouse:start", null)
}

const mouseStop = (event) => {
  emit("mouse:stop", null)
}

</script>

<template>
  <div class="window-bar">
    <div class="flex flex-row items-center gap-2 w-full"
         @mousedown="mouseStart"
         @mouseup="mouseStop">
      <div class="flex flex-row justify-start gap-2">
        <WindowButton color="red"/>
        <WindowButton color="yellow"/>
        <WindowButton color="green"/>
      </div>
      <div class="title">
        <img :src="icon" class="h-5 w-5"/>
        <div class="title-text">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.window-bar {
  @apply flex flex-row items-center justify-start gap-2 rounded-t-xl px-3 bg-apple-bar text-sm font-bold h-7;
}

.title {
  @apply w-full flex-grow flex flex-row justify-center items-center gap-1 text-nowrap text-gray-600 overflow-hidden;

  .title-text {
    @apply justify-center overflow-auto text-ellipsis;
  }
}
</style>
