<script setup>
import {computed, onMounted, ref} from "vue";
import Convert from "ansi-to-html";
import Terminal from "@/components/Terminal.vue";

const ansi = new Convert()

const props = defineProps({
  definitions: Object,
  index: Number,
})

const defs = ref(props.definitions)

const emit = defineEmits({
  'raise': Object,
})

const urlValue = defineModel()
const content = ref('')

const raise = (event) => {
  emit("raise", event)
}

const windowStyle = computed(() => {
  let style = 'background-color:' + defs.value.bg + ';'
  if (defs.value.picture) {
    style += ' background-image: url("' + defs.value.picture + '"); background-size: contain; background-position: center; background-repeat: no-repeat;';
  }
  return style;
})

const readContent = (url) => {
  const response = fetch(url)
      .then(async (response) => {
        let v = await response.text();
        content.value = v.replace(/\r?\n/g, '<br/>')
            .replace(/ /g, '\&nbsp;');
        console.log(content.value)
      })
      .catch((err) => {
        content.value = ""
      });
}

onMounted(() => {
  if (defs.value.contentUrl) {
    readContent(defs.value.contentUrl)
  }
})
</script>

<template>
  <div class="window-content"
       :style="windowStyle"
       @click="raise"
       :class="defs.type === 'viewer' ? 'font-mono':''"
  >
    <Terminal v-if="defs.type === 'terminal'"
              :definitions="defs"
              :index="props.index"
    />
    <div v-else-if="defs.type !== 'browser'"
         @click="raise"
         class="h-full"
    >
      <div v-if="content" class="overflow-clip" v-html="ansi.toHtml(content)"/>
      <div v-else-if="defs?.content" class="overflow-scroll scroll-smooth">
        {{ defs?.content }}
      </div>
    </div>
    <div v-else class="flex flex-col h-full">
      <iframe :src="defs?.content" class="flex-grow w-full h-full"/>
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
