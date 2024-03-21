<script setup>

import WindowButton from "@/components/WindowButton.vue";
import {computed, ref} from "vue";

const props = defineProps({
  title: String,
  icon: String,
  type: String,
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

const urlUpdated = (event) => {
  console.log(event)
  // emit('update:url', event.target.value);
}

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
        <img :src="'./src/assets/images/'+icon" class="h-5"/>
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
