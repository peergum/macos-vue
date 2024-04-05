<script setup>
import {computed, onMounted, ref, toRefs} from "vue";
import Convert from "ansi-to-html";
import Terminal from "@/components/Terminal.vue";

const ansi = new Convert()

const props = defineProps({
  definitions: Object,
  index: Number,
  plugins: Object,
})

const emit = defineEmits({
  'raise': Object,
})

const urlValue = defineModel()
const content = ref('')

const raise = (event) => {
  emit("raise", event)
}

const windowStyle = computed(() => {
  let style = 'background-color:' + props.definitions.bg + ';'
  if (props.definitions.picture) {
    style += ' background-image: url("' + props.definitions.picture + '"); background-size: contain; background-position: center; background-repeat: no-repeat;';
  }
  return style;
})

const readContent = (url) => {
  const response = fetch(url)
      .then(async (response) => {
        let v = await response.text();
        content.value = v.replace(/\r?\n/g, '<br/>')
            .replace(/ /g, '\&nbsp;');
        // console.log(content.value)
      })
      .catch((err) => {
        content.value = ""
      });
}

onMounted(() => {
  if (props.definitions.contentUrl) {
    readContent(props.definitions.contentUrl)
  }
})
</script>

<template>
  <div class="window-content"
       :style="windowStyle"
       :class="props.definitions.type === 'viewer' ? 'font-mono':''"
  >
    <component v-if="props.plugins && props.definitions.pluginName"
               :is="props.plugins[props.definitions.pluginName][0]"
               :definitions="props.definitions"
               :index="props.index"
    />
    <Terminal v-else-if="props.definitions.type === 'terminal'"
              :definitions="props.definitions"
              :index="props.index"
              @click="raise"
    />
    <div v-else-if="props.definitions.type !== 'browser'"
         @click="raise"
         class="h-full"
    >
      <div v-if="content" class="overflow-clip" v-html="ansi.toHtml(content)"/>
      <div v-else-if="props.definitions?.content" class="overflow-scroll scroll-smooth">
        {{ props.definitions?.content }}
      </div>
    </div>
    <div v-else class="flex flex-col h-full">
      <iframe :src="props.definitions?.content" class="flex-grow w-full h-full"/>
    </div>
  </div>
</template>

<style scoped>
.window-content {
  @apply relative flex-grow-0 rounded-b-xl m-2 h-full overflow-auto;

  #id {
  }

  .address-bar {
    @apply flex flex-row justify-center w-full h-full p-1 border-y border-gray-400 bg-neutral-200;
  }
}
</style>
