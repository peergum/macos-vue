<script setup lang="ts">

import MacOS from "@/components/MacOS.vue";
import PDFViewer from "@/components/PDFViewer.vue";
import pdfIcon from "/images/pdf-sm.png"
import {commandFunction, commandList, dirTree, MacOSDefinitions, menuItems, windowDefinition} from "@/macos-vue.js";

const menu_items: menuItems = [
  {
    name: "Demo", menu: [
      {name: 'Quit'}
    ]
  },
  {
    name: "File", menu: [
      {
        name: "New",
      },
      {
        name: "Open...",
      },
      {
        name: "Save",
      },
      {
        name: '---',
      },
      {
        name: "Print",
        menu: [
          {
            name: "PDF"
          }
        ],
      },
    ]
  },
  {
    name: "Edit"
  },
  {
    name: "View"
  },
  {
    name: '---',
  },
  {
    name: "Window"
  }, {
    name: "Help"
  }
]

const view1:windowDefinition = {
  name: "View 1",
  type: 'viewer',
  bg: 'gray',
  text: 'white',
  w: 600,
  h: 400,
  x: 10,
  y: 20,
  contentUrl: './src/example/demo.txt',
  content: "test",
  class: 'text-xs',
};

const view2:windowDefinition = {
  name: "View 2",
  type: 'viewer',
  w: 400,
  h: 500,
  x: 100,
  y: 150,
  opacity: 90,
  content: "Hello, world!"
};

const browser:windowDefinition = {
  name: "Browser",
  type: 'browser',
  w: 600,
  h: 600,
  x: 200,
  y: 200,
  content: "https://wikipedia.com",
};

const pic1:windowDefinition = {
  name: "Sad Computer",
  type: 'photo',
  picture: './src/example/designer.png',
  x: 650,
  y: 50,
  w: 150,
  h: 200,
};

const pic2:windowDefinition = {
  name: "Elephant on the Moon",
  type: 'photo',
  picture: './src/example/designer2.png',
  w: 200,
  h: 600,
  x: 700,
  y: 150,
};

const hello:commandFunction = (args: string[]): string => {
  if (!args.length) {
    return "Hello to you too!\n";
  }
  return "Hello! But I'm no " + args.join(' ') + "...\n";
}

const dir:dirTree = {
  'demo_files': {
    'some_text': 'text',
    'more': {"some long filename": 'text'},
  },
  'other': {
    'blah.csv': 'text',
  },
  'README.md': 'text',
}

const commands:commandList = {
  "hello": [hello, "[name]", "say hello"],
}

const terminal1:windowDefinition = {
  name: "Terminal1",
  type: 'terminal',
  w: 600,
  h: 600,
  x: 275,
  y: 230,
  bg: 'black',
  text: 'white',
}

const terminal2:windowDefinition = {
  name: "Terminal2",
  type: 'terminal',
  w: 600,
  h: 600,
  x: 375,
  y: 130,
  bg: 'green',
  text: 'white',
}

const pdfviewer:windowDefinition = {
  name: "PDF",
  type: 'plugin',
  pluginName: 'pdf',
  contentUrl: '/PDF/drylab.pdf',
  w: 500,
  h: 800,
  x: 75,
  y: 30,
  bg: 'white',
  text: 'black',
}

const defs: MacOSDefinitions = {
  menu: {
    items: menu_items,
  },
  windows: [
    view1,
    pic2,
    browser,
    pic1,
    view2,
    terminal1,
    terminal2,
    pdfviewer,
  ],
  system: {
    dir: dir,
    user: "arthur",
    host: "excalibur",
    commands: commands,
    fullname: "King Arthur",
    initials: "KA",
    message: "This message is optional. It could inform the [password]...",
    password: "password",
  },
  plugins: {
    "pdf": [PDFViewer, pdfIcon],
  }

}

</script>

<template>
  <MacOS :definitions="defs"/>
</template>

<style scoped>

</style>
