import {reactive} from 'vue'

const windowStore = reactive({
    terminal: {},
})

const menuStore = reactive({
    close: false,
    closed: true
})

export {windowStore, menuStore};
