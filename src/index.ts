import MacOS from "@/components/MacOS.vue";
import {windowStore, menuStore} from "@/stores.js";
import * as terminal from "@/terminal.js";
import '@/assets/css/main.css';

export default {
    install: (app: any, options: any) => {
        app.component('MacOS', MacOS);
    },
    windowStore: windowStore,
    menuStore: menuStore,
    terminal: terminal,
};
