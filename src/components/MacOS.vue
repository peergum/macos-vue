<script setup>

import sonomaBar from "@/assets/images/sonoma-bar.png";
import MenuBar from "@/components/MenuBar.vue";
import Window from "@/components/Window.vue";
import {computed, onMounted, ref, toRef} from "vue";
import {windowStore, menuStore} from "@/stores.js";

import {extendCommands, terminal} from "@/terminal.js";

const MIN_WIDTH = 100; // mininum window width
const MIN_HEIGHT = 100; // mininum window height
const MOUSE_PX_SENSITIVITY = 5; // mouse sensitivity in pixels

const props = defineProps({
  definitions: Object,
})

const defs = ref({
  screen: {
    w: 1000,
    h: 1000,
    bg: 'white',
    text: 'rgb(82 82 82)',
  },
  menu: {
    logo: props.definitions.menu.logo,
    items: props.definitions.menu.items || [],
  },
})

const counter = ref(-1);
const screenCounter = ref(-1);
const screenKey = ref(0)
const windows = ref(props.definitions.windows || [])
const windowOrder = ref([])
const lastMouse = ref({x: 0, y: 0})

const desktopClick = () => {
  menuStore.close = true;
}

const mouse = ref({
  x: 0,
  y: 0,
})

const item = ref({
  index: -1,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
})

const moving = ref(false)
const resizing = ref(false)
const sizer = ref(0)
const cursor = ref('default');

const reorder = (index) => {
  let w = Array()

  windowOrder.value.forEach((i) => {
    if (i !== index) {
      w.push(i)
    }
  })
  w.push(index);
  windowOrder.value = w;
  screenKey.value = screenCounter.value
  screenCounter.value += 1
}

const raise = (object) => {
  // console.log(object)
  const index = windows.value.findIndex((w) => w.name === object.item);
  reorder(index);
}

const mouseStart = (object) => {
  moving.value = object.sizer === 0;
  resizing.value = object.sizer !== 0;
  sizer.value = object.sizer;
  const index = windows.value.findIndex((w) => w.name === object.item);
  reorder(index)
  item.value.index = index;
  // screenKey.value = screenCounter.value
  // screenCounter.value += 1
  mouse.value.x = object.event.x;
  mouse.value.y = object.event.y;
  item.value.x = windows.value[index].x;
  item.value.y = windows.value[index].y;
  item.value.w = windows.value[index].w;
  item.value.h = windows.value[index].h;
  // moveTmr.value = setInterval(() => {
  //   moveCheck.value = true
  // }, 1)
}

const mouseStop = (event) => {
  moving.value = false;
  resizing.value = false;
  // if (moveTmr.value) clearInterval(moveTmr);
}

const mouseMove = (event) => {
  if ((!moving.value && !resizing.value)
      || (Math.abs(lastMouse.value.x - event.x) < MOUSE_PX_SENSITIVITY
          && Math.abs(lastMouse.value.y - event.y) < MOUSE_PX_SENSITIVITY)
      // || !moveCheck.value
  ) {
    return
  }
  // console.log(moving.value,resizing.value, sizer.value)
  lastMouse.value.x = event.x;
  lastMouse.value.y = event.y;
  // moveCheck.value = false;
  if (moving.value) {
    windows.value[item.value.index].x = Math.floor(item.value.x + defs.value.screen.w * (event.x - mouse.value.x) / window.innerWidth);
    windows.value[item.value.index].y = Math.floor(item.value.y + defs.value.screen.h * (event.y - mouse.value.y) / window.innerHeight);
  } else if (resizing.value) {
    let diff, v;
    const resizeLeft = () => {
      // resizing left
      windows.value[item.value.index].x = Math.floor(item.value.x + defs.value.screen.w * (event.x - mouse.value.x) / window.innerWidth);
      diff = defs.value.screen.w * (mouse.value.x - event.x) / window.innerWidth;
      v = Math.floor(item.value.w + diff);
      if (v < MIN_WIDTH) {
        moving.value = true;
        resizing.value = false;
        windows.value[item.value.index].w = MIN_WIDTH
      } else {
        windows.value[item.value.index].w = v;
      }
    }
    const resizeRight = () => {
      // resizing right
      diff = defs.value.screen.w * (mouse.value.x - event.x) / window.innerWidth;
      v = Math.floor(item.value.w - diff);
      if (v < MIN_WIDTH) {
        moving.value = true;
        resizing.value = false;
        mouse.value.x = event.x;
        windows.value[item.value.index].w = MIN_WIDTH
      } else {
        windows.value[item.value.index].w = v;
      }
    }
    const resizeBottom = () => {
      // resizing bottom
      diff = defs.value.screen.h * (mouse.value.y - event.y) / window.innerHeight;
      v = Math.floor(item.value.h - diff);
      if (v < MIN_HEIGHT) {
        moving.value = true;
        resizing.value = false;
        mouse.value.y = event.y;
        windows.value[item.value.index].h = MIN_HEIGHT
      } else {
        windows.value[item.value.index].h = v;
      }
    }
    const resizeTop = () => {
      // resizing top
      windows.value[item.value.index].y = Math.floor(item.value.y + defs.value.screen.h * (event.y - mouse.value.y) / window.innerHeight);
      diff = defs.value.screen.h * (mouse.value.y - event.y) / window.innerHeight;
      v = Math.floor(item.value.h + diff);
      if (v < MIN_HEIGHT) {
        moving.value = true;
        resizing.value = false;
        windows.value[item.value.index].h = MIN_HEIGHT
      } else {
        windows.value[item.value.index].h = v;
      }
    }
    switch (sizer.value) {
      case 1:
        resizeTop();
        resizeLeft();
        break;
      case 2:
        resizeTop()
        break;
      case 3:
        resizeTop();
        resizeRight();
        break;
      case 4:
        resizeRight();
        break;
      case 5:
        resizeRight()
        resizeBottom();
        break;
      case 6:
        resizeBottom();
        break;
      case 7:
        resizeBottom()
        resizeLeft();
        break;
      case 8:
        resizeLeft();
        break;
      default:
    }
  }
  windows.value[item.value.index].key = counter.value;
  counter.value += 1
}

const screenStyle = computed(() => {
  const v = 'cursor:' + cursor.value + ';';
  // +' user-select:none;-webkit-user-select: none;';
  return v;
})

const updateSizer = (object) => {
  if (!moving.value && !resizing.value) {
    sizer.value = object.sizer;
    switch (sizer.value) {
      case 1:
      case 5:
        cursor.value = 'nwse-resize';
        break;
      case 2:
      case 6:
        cursor.value = 'ns-resize';
        break;
      case 3:
      case 7:
        cursor.value = 'nesw-resize';
        break;
      case 4:
      case 8:
        cursor.value = 'ew-resize';
        break;
      default:
        cursor.value = 'default';
    }
  }
}

onMounted(() => {
  extendCommands(props.definitions.system?.commands)
  windows.value.forEach((v, i) => {
    windowOrder.value.push(i)
    if (v.type === 'terminal') {
      windowStore.terminal[i] = new terminal(props.definitions.system);
    }
  })
})

</script>

<template>
  <div class="w-screen h-screen bg-black p-4">
    <div class="w-full h-full bg-apple bg-cover bg-center flex flex-col rounded-2xl">
      <MenuBar :logo="defs.menu.logo" :items="defs.menu.items"/>
      <div :key='screenKey' class="relative flex-grow flex-auto overflow-hidden"
           :style="screenStyle"
           @mousemove="mouseMove"
           @mousestop="mouseStop"
           @mouse:stop="mouseStop"
           @click="desktopClick">
        <Window v-for="(index,i) in windowOrder"
                :definitions="windows[index]"
                :plugins="props.definitions.plugins"
                :screen="defs.screen"
                :key="windows[index].key"
                :order="windowOrder.length - index"
                :index="index"
                @mouse:start="mouseStart"
                @mouse:stop="mouseStop"
                @update:sizer="updateSizer"
                @raise="raise"
        />
        <div class="absolute bottom-0 w-full flex justify-center">
          <img :src="sonomaBar" width="60%" height="5%" class="self-center mb-2"/>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
