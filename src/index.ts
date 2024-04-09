import MacOS from "@/components/MacOS.vue";
import {windowStore, windowStoreInterface, menuStore} from "@/stores.js";
import "@/terminal.js";
import '@/assets/css/main.css';

export default {
    install: (app: any, options: any) => {
        app.component('MacOS', MacOS);
    },
    windowStore,
    menuStore,
    // terminal: terminal,
};
