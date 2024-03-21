import {reactive} from 'vue'

const windowStore = reactive({
    buffer: {},
    typingBuffer: {},
    cwd: [],
})

const menuStore = reactive({
    close: false,
    closed: true
})

export {windowStore, menuStore};
