import MacOS from "@/components/MacOS.vue";
import {windowStore, menuStore} from "@/stores.js";
import * as terminal from "@/terminal.js";
import '@/assets/css/main.css';
import '@/assets/images/folder-sm.png';
import '@/assets/images/terminal-sm.png';
import '@/assets/images/photo-sm.png';
import '@/assets/images/safari-sm.png';

export default {
    install: (app, options) => {
        app.component('MacOS', MacOS);
    },
    windowStore: windowStore,
    menuStore: menuStore,
    terminal: terminal,
};
