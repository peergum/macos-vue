<script setup>
import {onMounted, ref} from "vue";

import {VuePDF, usePDF} from '@tato30/vue-pdf'

const props = defineProps({
  config: {},
})

const {pdf, pages} = usePDF(props.config.contentUrl)
const page = ref(1)

</script>

<template>
  <div class="relative w-full h-8 flex flex-col items-center">
    <div class="fixed z-10 w-fit flex flex-row gap-8 justify-center">
      <button class="button" :disabled="page==1" @click="page-=1">Previous Page</button>
      <div>{{ page }}/{{ pages }}</div>
      <button class="button" :disabled="page==pages" @click="page+=1">Next Page</button>
    </div>
  </div>
  <VuePDF :pdf="pdf" fit-parent :page="page"/>
</template>

<style scoped>
.button {
  @apply inline border border-gray-500 bg-gray-200 shadow shadow-gray-400
  disabled:bg-gray-50 disabled:border-gray-50 rounded-lg px-4;
}
</style>
