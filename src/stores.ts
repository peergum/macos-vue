import {reactive} from 'vue'
import {Ref} from "vue";

import {terminal} from "@/terminal.js";

export interface windowStore {
    terminal: terminalArray,
    data: dataArray,
}

export interface terminalArray {
    [index: number]: terminal,
}

export interface dataArray {
    [index: number]: dataItems,
}

export interface dataItems {
    [index: string]: any
}

export interface menuState {
    close: boolean,
    closed: boolean,
}

export const windowSave = () => {
    localStorage.setItem('data',JSON.stringify(windowStore.data));
    console.log(windowStore.data)
}

export const windowStore: windowStore = reactive<windowStore>({
    terminal: {},
    data: {},
})

export const menuStore: menuState = reactive({
    close: false,
    closed: true
})
