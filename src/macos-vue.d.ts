// MacOS props

export interface MacOSDefinitions {
    menu: menuDefinition,
    windows: windowDefinition[],
    system: systemOptions,
    plugins?: pluginList,
    saverUrl?: string,
}

export interface windowDefinition {
    name: string,
    type: string,
    x: number,
    y: number,
    w: number,
    h: number,
    pluginName?: string,
    contentUrl?: string,
    content?: string,
    picture?: string,
    bg?: string,
    text?: string,
    key?: number,
    class?: string,
    opacity?: number,
}

export interface systemOptions {
    dir: dirTree,
    user: string,
    host: string,
    commands?: commandList,
    fullname: string,
    initials: string,
    message?: string,
    password?: string,
}


export interface dirTree {
    files?: dirTrees,
    mod?: number,
    owner?: string,
    path?: string,
}

export interface dirTrees {
    [index: string]: dirTree
}

export interface dirTreePlus {
    [index: string]: inode,
}

export interface inode {
    owner: string,
    group: string,
    mode: string|number,
    type: string,
    children: dirTreePlus,
}

export interface commandList {
    [index: string]: command
}

export interface commandFunction {
    (args: string[]): string | Promise<string>,
}

export interface command {
    0: commandFunction,
    1: string,
    2: string
}

export interface pluginList {
    [index: string]: Object,
}


export interface Definitions {
    menu: menuItem[],
    screen: screenDefinitions,
}

export interface menuDefinition {
    items: menuItems,
    logo?: string,
}

export interface screenDefinitions {
    w: number,
    h: number,
    bg: string,
    text: string,
}

export interface menuItems {
    [index: number]: menuItem,
}

export interface menuItem {
    name: string,
    menu?: menuItems,
}

export interface menuProp {
    active: boolean,
    item: menuItem,
}
