import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    build: {
        // target: 'esnext',
        lib: {
            // src/index.js is where we have exported the component(s)
            entry: {
                "index": path.resolve(__dirname, "src/index.js"),
                "stores": path.resolve(__dirname, "src/stores.js"),
                "terminal": path.resolve(__dirname, "src/terminal.js"),
            },
            name: "MacOS",
            // the name of the output files when the build is run
            fileName: (format) => `macos-vue.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                "vue",
                "ansi-to-html"
            ],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
