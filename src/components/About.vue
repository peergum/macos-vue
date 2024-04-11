<script setup lang="ts">
import {version} from "@/version.js";
import {windowDefinition} from "@/macos-vue.js";
import Window from "@/components/Window.vue";
import {ref} from "vue";

const props = defineProps({
  show: Boolean,
  content: String,
})

const visible = ref(true)

const defs: windowDefinition = {
  name: "About",
  type: "modal",
  x: 400,
  y: 300,
  w: 150,
  h: 400,
  bg: '#e8e6df',
  text: 'black',
  opacity: 100,
  class: 'z-50 relative'
}
const screen = {
  w: 1000,
  h: 1000,
  bg: 'white',
  text: 'rgb(82 82 82)',
}

const emit = defineEmits({
  'window:close': Boolean,
})
const hide = () => {
  emit('window:close',true)
}

</script>

<template>
  <Window v-if="show" :definitions="defs" :screen="screen"
          @click="hide">
    <div class="w-full h-full flex flex-col items-center justify-center bg-none">
      <div v-if="content !== undefined" v-html="content"/>
      <div v-else class="text-center">
        <div>MacOS Vue</div>
        <div>{{ props.content ?? 'Version ' + version }}</div>
        <img src="@/assets/images/demo_window.png"
        class="p-4"/>
        <div>&copy; 2024, Peergum</div>
        <div class="">
          &rarr; <a class="hover:underline" href="https://github.com/peergum/macos-vue" target="_blank">github</a>
          &amp;
          <a class="hover:underline" href="https://npmjs.com/@peergum/macos-vue" target="_blank">npmjs</a>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>

</style>
