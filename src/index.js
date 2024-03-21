import MacOS from "@/components/MacOS.vue";
import {windowStore, menuStore} from "@/stores.js";
import * as terminal from "@/terminal.js";
import '@/assets/css/main.css';

export default {
    install: (app, options) => {
        app.component('MacOS', MacOS);
    }
};
export {windowStore, menuStore, terminal};
