import './assets/css/main.css'
// import "./index.js";

import {createApp} from 'vue'
import App from './App.vue'
import MacOS from "@/components/MacOS.vue";

createApp(App)
    .component('MacOS',MacOS)
    .mount('#app')
