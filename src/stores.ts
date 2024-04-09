import {reactive} from 'vue'
import {Ref} from "vue";

import {terminal} from "@/terminal.js";

export interface windowStoreInterface {
    terminal: terminalArrayInterface,
    data: dataArray,
    focused: number,
}

export interface terminalArrayInterface {
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

export const windowStore: windowStoreInterface = reactive<windowStoreInterface>({
    terminal: {},
    data: {},
    focused: 0,
})

export const menuStore: menuState = reactive({
    close: false,
    closed: true
})
