import React from 'react';
import MacOS from './components/MacOS';
import PDFViewer from './components/PDFViewer';
import pdfIcon from '/images/pdf-sm.png';
import { MacOSDefinitions, MenuItem, CommandFunction } from './types';

const menuItems: MenuItem[] = [
  {
    name: 'Demo',
    menu: [{ name: 'Quit', label: 'quit' }],
  },
  {
    name: 'File',
    menu: [
      { name: 'New', label: 'new' },
      { name: 'Open...', label: 'open' },
      { name: 'Save', label: 'save' },
      { name: '---' },
      {
        name: 'Print',
        label: 'print',
        menu: [{ name: 'PDF', label: 'pdf' }],
      },
    ],
  },
  { name: 'Edit', label: 'edit' },
  { name: 'View', label: 'view' },
  { name: '---' },
  { name: 'Window', label: 'window' },
  { name: 'Help', label: 'help' },
];

const hello: CommandFunction = (args: string[]) => {
  if (!args.length) {
    return "Hello to you too!\n";
  }
  return "Hello! But I'm no " + args.join(' ') + "...\n";
};

const dir = {
  files: {
    demo_files: {
      files: {
        some_text: {
          path: '/files/demo_files/some_text',
          owner: 'arthur:kingdom',
          mod: 640,
        },
        more: {
          files: {
            'some long filename': {
              path: '/files/demo_files/more/some long filename',
              owner: 'arthur:kingdom',
              mod: 400,
            },
          },
        },
      },
    },
    other: {
      files: {
        'blah.csv': {
          path: '/files/other/blah.csv',
          owner: 'arthur:kingdom',
          mod: 640,
        },
      },
      mod: 700,
      owner: 'root:admin',
    },
    'README.md': {
      path: '/files/README.md',
      mod: 644,
    },
  },
};

const definitions: MacOSDefinitions = {
  menu: {
    items: menuItems,
  },
  windows: [
    {
      name: 'View 1',
      type: 'viewer',
      bg: 'gray',
      text: 'white',
      w: 600,
      h: 400,
      x: 10,
      y: 20,
      contentUrl: './src/example/demo.txt',
      content: 'test',
      class: 'text-xs',
    },
    {
      name: 'Elephant on the Moon',
      type: 'photo',
      picture: './src/example/designer2.png',
      w: 200,
      h: 600,
      x: 700,
      y: 150,
    },
    {
      name: 'Browser',
      type: 'browser',
      w: 600,
      h: 600,
      x: 200,
      y: 200,
      content: 'https://wikipedia.com',
    },
    {
      name: 'Sad Computer',
      type: 'photo',
      picture: './src/example/designer.png',
      x: 650,
      y: 50,
      w: 150,
      h: 200,
    },
    {
      name: 'View 2',
      type: 'viewer',
      w: 400,
      h: 500,
      x: 100,
      y: 150,
      opacity: 90,
      content: 'Hello, world!',
    },
    {
      name: 'Terminal1',
      type: 'terminal',
      w: 600,
      h: 600,
      x: 275,
      y: 230,
      bg: 'black',
      text: 'white',
    },
    {
      name: 'Terminal2',
      type: 'terminal',
      w: 600,
      h: 600,
      x: 375,
      y: 130,
      bg: '#003000',
      text: 'white',
    },
    {
      name: 'PDF',
      type: 'plugin',
      pluginName: 'pdf',
      contentUrl: '/PDF/drylab.pdf',
      w: 500,
      h: 800,
      x: 75,
      y: 30,
      bg: 'white',
      text: 'black',
    },
  ],
  system: {
    dir: dir,
    user: 'arthur',
    host: 'excalibur',
    commands: {
      hello: [hello, '[name]', 'say hello'],
    },
    fullname: 'King Arthur',
    initials: 'KA',
    message: 'This message is optional. It could inform the [password]...',
    password: 'password',
  },
  plugins: {
    pdf: [PDFViewer, pdfIcon],
  },
};

const App: React.FC = () => {
  return <MacOS definitions={definitions} />;
};

export default App;
