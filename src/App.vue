<script setup>

import MacOS from "@/components/MacOS.vue";

const menu_items = [
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

const view1 = {
  name: "View 1",
  icon: 'folder-sm.png',
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

const view2 = {
  name: "View 2",
  icon: 'folder-sm.png',
  type: 'viewer',
  w: 400,
  h: 500,
  x: 100,
  y: 150,
  opacity: 90,
  content: "Hello, world!"
};

const browser = {
  name: "Browser",
  icon: 'safari-sm.png',
  type: 'browser',
  w: 600,
  h: 600,
  x: 200,
  y: 200,
  content: "https://wikipedia.com",
};

const pic1 = {
  name: "Sad Computer",
  icon: 'photo-sm.png',
  type: 'photo',
  picture: './src/example/designer.png',
  x: 650,
  y: 50,
  w: 150,
  h: 200,
};

const pic2 = {
  name: "Elephant on the Moon",
  // icon: 'photo-sm.png',
  type: 'photo',
  picture: './src/example/designer2.png',
  w: 200,
  h: 600,
  x: 700,
  y: 150,
};

const hello = (args) => {
  if (!args.length) {
    return "Hello to you too!\n";
  }
  return "Hello! But I'm no " + args[0] + "...\n";
}

const dir = {
  'demo_files': {
    'some_text': 'text',
    'more': {"some long filename": 'text'},
  },
  'other': {
    'blah.csv': 'text',
  },
  'README.md': 'text',
}

const commands = {
  "hello": [hello, "[name]", "say hello"],
}

const terminal = {
  name: "Terminal",
  // icon: 'terminal-sm.png',
  type: 'terminal',
  w: 600,
  h: 600,
  x: 275,
  y: 230,
  bg: 'black',
  text: 'white',
  commands: commands,
}

const defs = {
  menu: {
    items: menu_items,
  },
  windows: [
    view1,
    pic2,
    browser,
    pic1,
    view2,
    terminal,
  ],
  system: {
    dir: dir,
    user: "arthur",
    host: "excalibur",
  }
}

</script>

<template>
  <MacOS :definitions="defs"/>
</template>

<style scoped>

</style>
