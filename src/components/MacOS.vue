<script setup lang="ts">

import {MacOSDefinitions, windowDefinition} from "@/types.js";

// declare module "@/assets/images/sonoma-bar.png";
import sonomaBar from "@/assets/images/sonoma-bar.png";
import MenuBar from "@/components/MenuBar.vue";
import Window from "@/components/Window.vue";
import {computed, onMounted, onUpdated, Ref, ref, toRef} from "vue";
import {windowStore, menuStore} from "@/stores.js";

import {extendCommands, terminal, terminalValues} from "@/terminal.js";
import {ArrowUpIcon} from "@heroicons/vue/16/solid/index.js";
import notch from "@/assets/images/notch.png";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import dayjs from "dayjs";

const MIN_WIDTH = 100; // mininum window width
const MIN_HEIGHT = 100; // mininum window height
const MOUSE_PX_SENSITIVITY = 5; // mouse sensitivity in pixels

const screenLock = ref(true);
const sonomaSaver = 'https://sylvan.apple.com/itunes-assets/Aerials126/v4/ec/eb/c8/ecebc8d2-5486-c2b2-52ae-6f0ab2d6b65f/W010_C003_F01_third_sdr_4k_qp24_15Mbps_240p_t2160_tsa.mov';

const props = defineProps<{
  definitions: MacOSDefinitions,
}>()

const defs = ref({
  screen: {
    w: 1000,
    h: 1000,
    bg: 'white',
    text: 'rgb(82 82 82)',
  },
  menu: props.definitions.menu,
})

const counter = ref(-1);
const screenCounter = ref(-1);
const screenKey = ref(0)
const windows: Ref<windowDefinition[]> = toRef(props.definitions.windows)
const windowOrder: Ref<Array<number>> = ref([])
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
const antiNotch = ref(false);
const showLogin = ref(false);
const showPassword = ref(false);
const passwordField: Ref<HTMLInputElement | null> = ref(null);

const reorder = (index: number) => {
  let w = Array()

  w = windowOrder.value.filter((v, i) => {
    return v!==index
  })
  w.push(index);
  windowOrder.value = w;
  screenKey.value = screenCounter.value
  screenCounter.value += 1
}

const raise = (object: any) => {
  const index = Object.values(windows.value).findIndex((w) => w.name === object.item);
  reorder(index);
}

const mouseStart = (object: any) => {
  moving.value = object.sizer === 0;
  resizing.value = object.sizer !== 0;
  sizer.value = object.sizer;
  const index = Object.values(windows.value).findIndex((w) => w.name === object.item);
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

const mouseStop = (object: any) => {
  moving.value = false;
  resizing.value = false;
  // if (moveTmr.value) clearInterval(moveTmr);
}

const mouseMove = (event: any) => {
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

const updateSizer = (object: any) => {
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
  windows.value.forEach((v: windowDefinition, i: number) => {
    windowOrder.value.push(i)
    if (v.type === 'terminal') {
      windowStore.terminal[i] = new terminal(props.definitions.system, i);
    }
  })
  windowStore.data = JSON.parse(localStorage.getItem('data') ?? '{}')
  setInterval(() => {
    const n = dayjs();
    if (n != now.value) {
      now.value = n
    }
  }, 1000);
})

const keypress = (event: any) => {
  if (event.key === 'Escape') {
    showPassword.value = false;
    showLogin.value = false;
  }
}

const checkPassword = (event: any) => {
  if (event.target.value === props.definitions.system.password) {
    screenLock.value = false;
  } else {
    showPassword.value = false;
    showLogin.value = false;
  }
}

const showField = () => {
  showPassword.value = true;
}

onUpdated(() => {
  if (showPassword.value && passwordField.value) {
    passwordField.value.focus();
  }
})

const now = ref(dayjs())
</script>

<template>
  <div v-if="screenLock" class="w-screen h-screen bg-black p-4"
       @mousemove="showLogin=true">
    <div class="static absolute z-10 w-full h-0 flex flex-col content-center"
         @mouseenter="antiNotch=true" @mouseleave="antiNotch=false">
      <div v-if="antiNotch" class="absolute z-30 text-xs text-white top-0.5 self-center">
        <FontAwesomeIcon :icon="ArrowUpIcon"/>
        This notch sucks, Apple™!
      </div>
      <img :src="notch" class="absolute z-20 w-48 h-8 self-center"/>
      <!--      <div class="absolute mt-[1px] mr-0.5 font-inter font-semibold w-full h-fit top-20 flex flex-col gap-4 items-center justify-center text-white opacity-50">-->
      <!--        <div class="text-4xl">{{ new dayjs().format("dddd, MMMM D") }}</div>-->
      <!--        <div class="text-9xl">{{ new dayjs().format("h:mm") }}</div>-->
      <!--      </div>-->
      <div
          class="absolute font-inter font-semibold w-full h-fit top-20 flex flex-col gap-4 items-center justify-center text-white opacity-80">
        <div class="text-4xl">{{ now.format("dddd, MMMM D") }}</div>
        <div class="text-9xl">{{ now.format("h:mm") }}</div>
      </div>
    </div>
    <div v-if="showLogin" class="static absolute z-10 w-full h-full flex flex-col content-center font-extralight">
      <div class="absolute z-30 w-full flex flex-col items-center gap-4 bottom-20">
        <div class="mb-8 text-white">
          {{ props.definitions.system?.message }}
        </div>
        <div class="rounded-full w-14 h-14 bg-gray-400 text-white flex items-center justify-center text-2xl">
          {{ props.definitions.system.initials }}
        </div>
        <div v-if="!showPassword"
             @click="showField" class="text-white text-xl">
          {{ props.definitions.system.fullname }}
        </div>
        <input v-else
               ref="passwordField"
               type="password"
               autofocus
               class="w-60 h-8 bg-neutral-400 rounded-2xl text-white px-4 border-none outline-none opacity-80"
               @keyup="keypress"
               @change.prevent="checkPassword"
        />
      </div>
    </div>
    <video class="w-full h-full overflow-hidden" :src="sonomaSaver" autoplay loop/>
  </div>
  <div v-else class="w-screen h-screen bg-black p-4">
    <div class="w-full h-full bg-apple bg-cover bg-center flex flex-col rounded-2xl">
      <MenuBar :logo="defs.menu.logo" :items="defs.menu.items"/>
      <div :key='screenKey' class="relative flex-grow flex-auto overflow-hidden"
           :style="screenStyle"
           @mousemove="mouseMove"
           @mousestop="mouseStop"
           @mouse:stop="mouseStop"
           @click="desktopClick">
        <Window v-for="index in windowOrder"
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
