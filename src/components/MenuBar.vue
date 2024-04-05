<script setup lang="ts">

import {menuDefinition, menuItem, menuItems} from "@/macos-vue.js";

import MenuItem from "@/components/MenuItem.vue";
import Logo from "@/components/Logo.vue";
import icons from "@/assets/images/icons.png"
import notch from "@/assets/images/notch.png"

import {onMounted, Ref, ref, watch} from "vue";
import {menuStore} from "@/stores.js";
import dayjs from "dayjs";
import MenuInfo from "@/components/MenuInfo.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faApple} from "@fortawesome/free-brands-svg-icons";
import {ArrowUpIcon} from "@heroicons/vue/16/solid/index.js";

const props: menuDefinition = defineProps<menuDefinition>()

const clock: Ref<string> = ref('');

const menuActive: Ref<menuItem> = ref({
  name: '',
});

const logoMenu: menuItem = {
  name: "@",
  menu: [
    {name: "About MacOS Vue",}
  ]
};

const menuChanged = (item: menuItem) => {
  if (menuActive.value?.name !== item.name) {
    menuActive.value = item;
    menuStore.closed = false;
    menuStore.close = false;
  } else {
    menuStore.close = true;
  }
}

const hover = (item: menuItem) => {
  if (menuActive.value?.name && menuActive.value.name !== item.name) {
    menuActive.value = item;
    menuStore.close = false;
    menuStore.closed = false;
  }
}

watch(menuStore, (o, n) => {
  if (n.close && !n.closed) {
    menuActive.value = {
      name: '',
    };
    menuStore.close = false;
    menuStore.closed = true;
  }
})

const setClock = () => {
  clock.value = dayjs().format('ddd MMM D hh:mm:ss A');

}
onMounted(() => {
  setInterval(setClock, 1000);
  menuStore.close = false;
  menuStore.closed = false;
})

const antiNotch = ref(false);

</script>

<template>
  <div class="menu-bar">
    <div class="static absolute z-10 w-full h-0 flex flex-col content-center"
         @mouseenter="antiNotch=true" @mouseleave="antiNotch=false">
      <div v-if="antiNotch" class="absolute z-30 text-xs text-white top-0.5 self-center">
        <FontAwesomeIcon :icon="ArrowUpIcon"/>
        This notch sucks, Apple™!
      </div>
      <img :src="notch" class="absolute z-20 w-48 h-8 self-center"/>
    </div>
    <MenuItem :item="logoMenu"
              @mouseenter="hover(logoMenu)"
              @update:active="menuChanged"
              :active='logoMenu?.name !=="---" && menuActive?.name===logoMenu.name'
    >
      <Logo v-if="logo" :image="logo" width="20px" height="20px"/>
      <font-awesome-icon v-else :icon="faApple" class="text-lg mb-1"/>
    </MenuItem>
    <MenuItem v-for="item in items"
              @mouseenter="hover(item)"
              @update:active="menuChanged"
              :active='item?.name !=="---" && menuActive?.name===item.name'
              :item="item"/>
    <div class="flex-grow"/>
    <div class="flex items-center -mx-4">
      <img :src="icons" width="230px" height="4px"/>
    </div>
    <MenuInfo>
      {{ clock }}
    </MenuInfo>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
</style>

<style scoped>
.menu-bar {
  @apply static w-full px-2 shadow-sm border-b border-gray-500 shadow-gray-300 w-full bg-apple-bar h-9 flex flex-row justify-start font-[Roboto] rounded-t-2xl;
}

</style>
