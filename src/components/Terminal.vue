<script setup >

import {computed, onMounted, onUpdated, ref} from "vue";
import {windowStore} from "@/stores.ts";
import {terminalStore} from "@/terminal.ts";

const props = defineProps({
  definitions: Object,
  index: Number,
  focused: Boolean,
})

const defs = ref(props.definitions)
const inputField = ref(null)

const textValue = defineModel()
const commands = ref(defs.value?.commands || {})
const tmr = ref(0)
const cursOn = ref(false);
const outputKey = ref(-1)

const terminalStyle = computed(() => {
  return 'background-color:' + defs.value.bg + ';'
      + ';color:' + defs.value.text + ';';
})

const convert = (text) => {
  let r = '';
  let st = 0;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (text[i] === '<') {
      st = 1;
    } else if (text[i] === '>') {
      st = 0;
    } else if (text[i] === ' ' && !st) {
      c = '&nbsp;'
    } else if (text[i] === '\n') {
      c = '<br/>'
    }
    out += c;
  }
  return out;
}

const keypressed = (event) => {
  const keycode = event.keyCode;
  const key = event.key;
  // console.log(key,keycode)
  if (event.ctrlKey) {
    switch(key) {
      case 'c':
      case 'x':
        windowStore.terminal[props.index].ctrlC();
        break;
    }
  } else if (key >= ' ' && key <= '~' && key.length === 1) {
    windowStore.terminal[props.index].keypress(key);
  } else if (key === 'Enter') {
    windowStore.terminal[props.index].exec();
    textValue.value = '';
  } else if (key === 'Backspace') {
    windowStore.terminal[props.index].backspace();
  } else if (key === 'ArrowUp') {
    windowStore.terminal[props.index].goHistory(-1);
  } else if (key === 'ArrowDown') {
    windowStore.terminal[props.index].goHistory(+1);
  }
}

const toggleCursor = () => {
  cursOn.value = !cursOn.value;
  outputKey.value += 1
}

onMounted(() => {
  tmr.value = setInterval(toggleCursor, 500)
})

onUpdated(() => {
  if (props.focused) {
    inputField.value.focus();
  }
})

const cursorValue = computed(() => '<span style="background-color:white; color:white;">' + (cursOn.value ? "_" : "") + '</span> ')

</script>

<template>
  <div class="w-full h-full flex flex-col-reverse items-end"
       :class="'bg-'+defs.bg+' text-'+defs.text">
    <input class="absolute w-0 h-0 bg-none opacity-20 bg-red-500" v-model="textValue"
           @keyup="keypressed" ref="inputField"/>
    <div class="flex flex-col-reverse w-full h-fit overflow-auto">
      <div :key="outputKey" class="h-fit text-sm font-mono p-2"
           v-html="convert(windowStore.terminal[index].buffer)+windowStore.terminal[index].typingBuffer+cursorValue"/>
    </div>
  </div>
</template>

<style scoped>

</style>
