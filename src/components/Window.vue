<script setup>
import {computed, onMounted, ref} from "vue";
import WindowBar from "@/components/WindowBar.vue";
import WindowView from "@/components/WindowView.vue";

const props = defineProps({
  definitions: Object,
  screen: Object,
  index: Number,
  plugins: Object,
})

const emit = defineEmits({
  'mouse:start': Object,
  'mouse:stop': Object,
  'update:sizer': Object,
  'raise': Object,
})

// set default values
const defs = ref({
  name: props.definitions?.name || 'window',
  type: props.definitions?.type,
  w: Math.floor(window.innerWidth * props.definitions.w / props.screen.w),
  h: Math.floor(window.innerHeight * props.definitions.h / props.screen.h),
  x: Math.floor(window.innerWidth * (props.definitions.x || 0) / props.screen.w),
  y: Math.floor(window.innerHeight * (props.definitions.y || 0) / props.screen.h),
  bg: props.definitions.bg || props.screen.bg,
  text: props.definitions.text || props.screen.text,
  opacity: (props.definitions?.opacity || 100) / 100,
  picture: props.definitions?.picture,
  content: props.definitions?.content,
  contentUrl: props.definitions?.contentUrl,
  class: props.definitions?.class,
  commands: props.definitions?.commands || {},
  prompt: props.definitions?.prompt,
  user: props.definitions?.user || 'user',
  system: props.definitions?.system || 'host23',
  pluginName: props.definitions?.pluginName,
});

const title = defineModel()

const windowStyle = computed(() => {
  const v = 'width:' + defs.value.w + 'px;'
          + ' height:' + defs.value.h + 'px;'
          + ' margin-left:' + defs.value.x + 'px;'
          + ' margin-top:' + defs.value.y + 'px;'
          + ' background-color:' + defs.value.bg + ';'
          + ' color:' + defs.value.text + ';'
          + ' opacity:' + defs.value.opacity + ';'
      // + 'user-select-all:' + (defs.value.type === 'browser' ? 'text' : 'none') + ';'
  ;
  return v;
})

const moving = ref(false);
const resizing = ref(false);
const sizer = ref(0);

const raise = (event) => {
  // console.log(event)
  emit("raise", {item: defs.value.name, event: event})
}

const mouseStart = (event) => {
  emit("mouse:start", {sizer: sizer.value, item: defs.value.name, event: event})
  moving.value = (sizer.value === 0);
  resizing.value = (sizer.value !== 0);
  // console.log('sizer='+sizer.value)
}

const mouseStop = (event) => {
  emit("mouse:stop", {item: defs.value.name, event: event})
  moving.value = false;
  resizing.value = false;
}

const checkCorners = (event) => {
  if (moving.value || resizing.value) {
    return;
  }
  sizer.value = 0;
  const MARGIN = 7;
  const w = defs.value.w; //Math.floor(window.innerWidth * defs.value.w / props.screen.w)
  const h = defs.value.h; //Math.floor(window.innerHeight * defs.value.h / props.screen.h)
  // console.log('(' + w + ',' + h + '),x=' + event.layerX + ',y=' + event.layerY)
  const mx = event.layerX;
  const my = event.layerY;
  if (mx < MARGIN && my < MARGIN) {
    sizer.value = 1
  } else if (my < MARGIN && mx > MARGIN && mx < w - MARGIN) {
    sizer.value = 2;
  } else if (my < MARGIN && mx > w - MARGIN) {
    sizer.value = 3
  } else if (mx > w - MARGIN && my > MARGIN && my < h - MARGIN) {
    sizer.value = 4;
  } else if (mx > w - MARGIN && my > h - MARGIN) {
    sizer.value = 5
  } else if (my > h - MARGIN && mx > MARGIN && mx < w - MARGIN) {
    sizer.value = 6;
  } else if (mx < MARGIN && my > h - MARGIN) {
    sizer.value = 7
  } else if (mx < MARGIN && my > MARGIN && my < h - MARGIN) {
    sizer.value = 8;
  }
  // console.log(moving.value,resizing.value,sizer.value)
  emit('update:sizer', {sizer: sizer.value});
}

onMounted(() => {
})

const tmr = ref(0)
const timedUrl = (value) => {
  if (tmr.value) {
    clearTimeout(tmr.value)
  }
  tmr.value = setTimeout(() => {
    defs.value.content = value;
  }, 500)
}
const urlUpdated = (value) => {
  if (value.match(/https?:[/][/](\w+)(\.(\w+))+/)) {
    timedUrl(value);
  }
}

</script>

<template>
  <div class='window'
       :style="windowStyle"
       @mousemove="checkCorners"
       @mousedown.self="mouseStart"
       @mouseup="mouseStop"
       :class="defs.class"
       @select.prevent
  >
    <WindowBar
        @mousedown="mouseStart"
        @mouseup="mouseStop"
        :title="defs.name"
        :type="defs.type"
        :plugins="props.plugins"
        :pluginName="defs?.pluginName"
    />
    <WindowView
        @mousedown.self="mouseStart"
        :definitions="defs"
        :plugins="props.plugins"
        :index="props.index"
        @update:modelValue="urlUpdated"
        @click="raise"
    />
  </div>
</template>

<style scoped>
.window {
  @apply absolute flex flex-col border-black border-black rounded-xl shadow shadow-black;
}
</style>
