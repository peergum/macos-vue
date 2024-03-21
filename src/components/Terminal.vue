<script setup>

import {computed, onMounted, ref} from "vue";
import {windowStore} from "@/stores.js";
import {cat, cd, getPrompt, ls, pwd} from "@/terminal.js";

const props = defineProps({
  definitions: Object,
  index: Number,
})

const defs = ref(props.definitions)

const textValue = defineModel()
const commands = ref(defs.value?.commands || {})
const tmr = ref(0)
const cursOn = ref(false);
const outputKey = ref(-1)

const help = (command) => {
  if (command.length) {
    const c = Object.entries(commands.value).find((v, i) => {
      return v[0] === command[0];
    })
    if (!c) {
      return "Command " + command[0] + " not found.\n";
    }
    return c[0] + " " + c[1][1] + " : " + c[1][2] + "\n";
  }
  return "Available commands: " + Object.keys(commands.value)
          .sort((a, b) => {
            return a[0] < b[0] ? -1 : (a[0] === b[0] ? 0 : 1);
          })
          .join(', ')
      + "\nUse `help command` for more help\n";
}

const terminalStyle = computed(() => {
  return 'background-color:' + defs.value.bg + ';'
      + ';color:' + defs.value.text + ';';
})

// const greySpan = '\x1b[13m';
// const endSpan = '\x1b[0m';

const result = (message) => {
  windowStore.buffer[props.index] += message + prompt.value;
  pos.value = windowStore.buffer[props.index].length;
}

const commandNotFound = (command) => {
  result('Command ' + command + " not found.\n");
}

const command = (commandline) => {
  const args = String(commandline)
      .replace(/\\ /g, "º")
      .split(" ")
      .map((v) => v.replace(/º/g, " "));
  const command = Object.entries(commands.value).find((v, i) => {
    return v[0] === args[0];
  });
  console.log(commands.value, command)
  if (!command) {
    commandNotFound(args[0]);
  } else {
    result(command[1][0](args.length > 1 ? args.slice(1) : []));
  }
}

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

const pos = ref(windowStore.buffer[props.index].length)

const keypressed = (event) => {
  const keycode = event.keyCode;
  const key = event.key;
  console.log(keycode, key);
  if (key >= ' ' && key < 'z' && key.length === 1) {
    windowStore.typingBuffer[props.index] += key;
  } else if (key === 'Enter') {
    windowStore.buffer[props.index] += windowStore.typingBuffer[props.index] + "\n";
    pos.value = windowStore.buffer[props.index].length;
    if (!windowStore.typingBuffer[props.index].length) {
      result("");
    } else {
      command(textValue.value)
    }
    textValue.value = '';
    windowStore.typingBuffer[props.index] = '';
    console.log(defs.value.commands)
  } else if (key === 'Backspace' && windowStore.typingBuffer[props.index].length > 0) {
    windowStore.typingBuffer[props.index] = windowStore.typingBuffer[props.index].substring(0, windowStore.typingBuffer[props.index].length - 1);
  }
}

const toggleCursor = () => {
  cursOn.value = !cursOn.value;
  outputKey.value += 1
}

const prompt = computed(() => getPrompt())

onMounted(() => {

  commands.value["help"] = [help, "[command]", "help with commands"]
  commands.value["ls"] = [ls, "[-l][dir]", "list files in directory"]
  commands.value["pwd"] = [pwd, "", "show current directory"]
  commands.value["cd"] = [cd, "[dir]", "change directory"]
  commands.value["cat"] = [cat, "[filename]", "dump a text file"]

  tmr.value = setInterval(toggleCursor, 500)
  if (!pos.value) {
    windowStore.buffer[props.index] = prompt.value;
  }
  pos.value = windowStore.buffer[props.index].length;
})


const cursorValue = computed(() => '<span style="background-color:white; color:white;">' + (cursOn.value ? "_" : "") + '</span> ')

</script>

<template>
  <div class="w-full h-full flex flex-col-reverse items-end overflow-hidden"
       :class="'bg-'+defs.bg+' text-'+defs.text">
    <input class="absolute w-full h-full bg-none opacity-0" v-model="textValue"
           @keyup="keypressed"/>
    <div :key="outputKey" class="w-full h-fit text-sm font-mono p-2"
         v-html="convert(windowStore.buffer[index])+windowStore.typingBuffer[index]+cursorValue"/>
  </div>
</template>

<style scoped>

</style>
