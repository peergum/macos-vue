<script setup>
import {onMounted, ref} from "vue";

import {VuePDF, usePDF} from '@tato30/vue-pdf'
import {windowSave, windowStore} from "@/stores.ts";

const props = defineProps({
  definitions: {},
  index: Number,
})

const nextPage = () => {
  page.value += 1
  windowStore.data[props.index].page = page.value
  windowSave()
}
const prevPage = () => {
  page.value -= 1
  windowStore.data[props.index].page = page.value
  windowSave()
}

const {pdf, pages} = usePDF(props.definitions?.contentUrl)
const page = ref(1)
const pp = ref(pages)

onMounted(() => {
  if (windowStore.data[props.index] === undefined) {
    windowStore.data[props.index] = {
      page: 1,
      pages: pages.value
    }
  }
  page.value = windowStore.data[props.index].page ?? 1;
  pp.value = windowStore.data[props.index].pages ?? pages.value;
  windowStore.data[props.index].pages = pages.value;
  windowSave()
})

</script>

<template>
  <div class="w-full h-8 flex flex-col items-center">
    <div class="w-fit flex flex-row gap-8 justify-center">
      <button class="button" :disabled="page<=1" @click="prevPage">Previous Page</button>
      <div >{{ page }}/{{ pp }}</div>
      <button class="button" :disabled="!page || page>=pp" @click="nextPage">Next Page</button>
    </div>
  </div>
  <VuePDF :pdf="pdf" fit-parent :page="page"/>
  <div class="bottom-0 w-full h-8 flex flex-col items-center">
    <div class="w-fit flex flex-row gap-8 justify-center">
      <button class="button" :disabled="page<=1" @click="prevPage">Previous Page</button>
      <div >{{ page }}/{{ pp }}</div>
      <button class="button" :disabled="!page || page>=pp" @click="nextPage">Next Page</button>
    </div>
  </div>
</template>

<style scoped>
.button {
  @apply inline border border-gray-500 bg-gray-200 shadow shadow-gray-400
  disabled:bg-gray-50 disabled:border-gray-50 rounded-lg px-4;
}
</style>
