// MacOS React Types

export interface MacOSDefinitions {
  menu: MenuDefinition;
  windows: WindowDefinition[];
  system: SystemOptions;
  plugins?: PluginList;
  saverUrl?: string;
  about?: string;
}

export interface WindowDefinition {
  name: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  pluginName?: string;
  contentUrl?: string;
  content?: string;
  picture?: string;
  bg?: string;
  text?: string;
  key?: number;
  class?: string;
  opacity?: number;
}

export interface SystemOptions {
  dir: DirTree;
  user: string;
  host: string;
  commands?: CommandList;
  fullname: string;
  initials: string;
  message?: string;
  password?: string;
}

export interface DirTree {
  files?: DirTrees;
  mod?: number;
  owner?: string;
  path?: string;
}

export interface DirTrees {
  [index: string]: DirTree;
}

export interface CommandList {
  [index: string]: Command;
}

export type CommandFunction = (args: string[]) => string | Promise<string>;

export type Command = [CommandFunction, string, string];

export interface PluginList {
  [index: string]: [React.ComponentType<any>, string];
}

export interface MenuDefinition {
  items: MenuItem[];
  logo?: string;
  about?: string;
}

export interface ScreenDefinitions {
  w: number;
  h: number;
  bg: string;
  text: string;
}

export interface MenuItem {
  name: string;
  label?: string;
  menu?: MenuItem[];
}

export interface MenuProp {
  active: boolean;
  item: MenuItem;
}

export interface WindowStore {
  terminals: { [index: number]: any };
  data: { [index: number]: any };
  focused: number;
  setFocused: (index: number) => void;
  setTerminal: (index: number, terminal: any) => void;
  setData: (index: number, data: any) => void;
  saveData: () => void;
}

export interface MenuStore {
  close: boolean;
  closed: boolean;
  setClose: (close: boolean) => void;
  setClosed: (closed: boolean) => void;
}
