import {reactive} from 'vue'
import {Ref} from "vue";

import {terminal} from "@/terminal.js";

export interface windowStore {
    terminal: terminalArray,
    data?: dataArray,
}

export interface terminalArray {
    [index:number]: terminal,
}
export interface dataArray {
    [index:number]: object,
}

export interface menuState {
    close: boolean,
    closed: boolean,
}

const windowStore: windowStore = reactive<windowStore>({
    terminal: {},
    data: {},
})

const menuStore: menuState = reactive({
    close: false,
    closed: true
})

export {windowStore, menuStore};
