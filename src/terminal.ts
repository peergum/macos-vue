import Convert from "ansi-to-html";
import {reactive} from "vue";
import {windowStore} from "@/stores.ts";
import {dirTree, systemOptions, commandList, command} from "@/types.js";

export interface terminalStore {
    extensions: commandList
}

export interface terminalSettings {
    dir: dirTree,
    user: string,
    host: string,
}

export interface terminalValues {
    buffer: string,
    typingBuffer: string,
}

export const terminalStore: terminalStore = reactive<terminalStore>({
        extensions: {} // extension commands
    }
)

export const extendCommands = (commands: commandList | undefined): void => {
    if (commands !== undefined) {
        Object.assign(terminalStore.extensions, commands)
    }
}

const ansi = new Convert();

export class terminal {
    cwd: string[] = []
    prompt: string = '%'
    commands: commandList = {}
    buffer: string = ''
    typingBuffer: string = ''
    dir: dirTree = {}
    user: string = "user"
    host: string = "host"
    pos: number = 0
    index: number
    history: string[] = []
    historyIndex: number = 0


    constructor(args: systemOptions, index: number) {
        this.index = index;
        this.setTerminal(args)
        this.cwd = [] // current working directory (as an array, not a path)
        this.prompt = '%'; // current default prompt (would change for root user)
        this.commands = {
            help: [this.help, "[command]", "help with commands"],
            ls: [this.ls, "[-l][dir]", "list files in directory"],
            pwd: [this.pwd, "", "show current directory"],
            cd: [this.cd, "[dir]", "change directory"],
            cat: [this.cat, "[filename]", "dump a text file"],
            clear: [this.clear, "", "clear terminal"],
            ...terminalStore.extensions
        };
        this.buffer = this.getPrompt();
        this.typingBuffer = '';
        this.restore()
        this.updatePos();
    }

    restore = (): any => {
        const terminalValues: any = JSON.parse(localStorage.getItem('terminal.' + this.index) ?? '{}')
        if (terminalValues !== undefined) {
            this.buffer = terminalValues.buffer ?? this.getPrompt()
            this.typingBuffer = terminalValues.typingBuffer ?? ''
            this.history = terminalValues.history ?? []
            this.historyIndex = this.history.length
        }
    }

    save = (): void => {
        localStorage.setItem('terminal.' + this.index, JSON.stringify({
            buffer: this.buffer,
            typingBuffer: this.typingBuffer,
            history: this.history,
        }))
    }

    /**
     * set system info
     *
     * @param args
     */
    setTerminal = (args: terminalSettings | systemOptions): void => {
        this.dir = args.dir // current directory structure
        this.user = args.user // current user
        this.host = args.host // current hostname (very unlikely to change)
    }

    /**
     * change username
     *
     * @param name
     */
    setUser = (name: string) => {
        this.user = name;
    }

    goHistory = (pos: number): void => {
        const newIndex = this.historyIndex + pos
        if (newIndex >= 0 && newIndex < this.history.length) {
            this.typingBuffer = this.history[newIndex]
            this.historyIndex = newIndex;
        }
    }

    /**
     * get a copy of cwd rather than a reference
     *
     * @returns {*[]}
     */
    getCwd = (): string[] => [...this.cwd];

    /**
     * set cwd
     *
     * @param value
     */
    setCwd = (value: string[]): void => {
        this.cwd = value
    }

    /**
     * Append to cwd
     *
     * @param value
     */
    pushCwd = (value: string): void => {
        this.cwd.push(value)
    }

    /**
     * obtain updated prompt
     *
     * @returns {string}
     */
    getPrompt = (): string => this.user + '@' + this.host + ' ' + this.getcwd() + this.prompt + ' ';


    /**
     * search for a file or directory in given directory structure
     *
     * @param d
     * @param c
     * @returns {*|number}
     */
    findDir = (d: dirTree | string, c: string[]): dirTree | string => {
        if (typeof (d) === 'string') {
            return d
        }
        if (!c.length) {
            return d;
        }
        let cc: string[] = [...c]
        const c2: string = cc.shift() ?? ''
        if (d[c2] === undefined) {
            return {};
        }
        return this.findDir(d[c2], cc);
    }

    newline = (): void => {
        this.buffer += this.typingBuffer + "\n";
        this.updatePos();
    }

    updatePos = (): void => {
        this.pos = this.buffer.length;
    }

    result = (message: string): void => {
        this.buffer += message + this.getPrompt();
        this.save();
        this.updatePos();
    }

    commandNotFound = (command: string): void => {
        this.result('Command ' + command + " not found.\n");
    }

    keypress = (key: string): void => {
        this.typingBuffer += key;
    }

    backspace = (): void => {
        if (this.typingBuffer.length > 0) {
            this.typingBuffer = this.typingBuffer.substring(0, this.typingBuffer.length - 1);
        }
    }

    ctrlC = (): void => {
        this.newline();
        this.result("");
        this.typingBuffer = '';
    }

    exec = async (): Promise<void> => {
        this.newline();
        this.historyIndex = this.history.push(this.typingBuffer);
        console.log(this.history, this.historyIndex)
        if (this.typingBuffer == '') {
            this.result("");
        }

        const args: string[] = String(this.typingBuffer)
            .replace(/\\ /g, "º")
            .split(" ")
            .map((v) => v.replace(/º/g, " "));
        this.typingBuffer = '';
        const cmd: [string, command] | undefined = Object.entries(this.commands).find((v, i) => {
            return v[0] === args[0];
        });
        if (!cmd) {
            this.commandNotFound(args[0]);
        } else {
            const res: string = await cmd[1][0](args.length > 1 ? args.slice(1) : []);
            this.result(res);
        }
    }

    help = (command: string[]): string => {
        if (command.length) {
            const c = Object.entries(this.commands).find((v, i) => {
                return v[0] === command[0];
            })
            if (!c) {
                return "Command " + command[0] + " not found.\n";
            }
            return c[0] + " " + c[1][1] + " : " + c[1][2] + "\n";
        }
        return "Available commands: " + Object.keys(this.commands)
                .sort((a, b) => {
                    return a[0] < b[0] ? -1 : (a[0] === b[0] ? 0 : 1);
                })
                .join(', ')
            + "\nUse `help command` for more help\n";
    }

    clear = (): string => {
        this.buffer = "";
        return "\n";
    }

    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    ls = (args: string[]): string => {
        let long = false
        if (args[0] === '-l') {
            long = true
            args.shift()
        }

        let filelist: string[] = [];
        let dirlist: string = '';
        let ndir: string[] = []
        let cdir: dirTree | string = {}

        const withArgs = args.length > 0
        while (true) {
            ndir = this.getCwd()
            console.log("ndir=", ndir)
            if (args.length) {
                args[0].split('/').forEach((v) => {
                    if (v === '..' && ndir.length > 0) {
                        ndir.pop()
                    } else if (v !== '.') {
                        ndir.push(v)
                    }
                })
            }
            cdir = this.findDir(this.dir, ndir);
            let files = []
            if (cdir === undefined) {
                // too far back, nothing here
            } else if (typeof (cdir) === 'string') {
                let fname = '';
                if (long) fname += '-r--r----- ';
                fname += args[0]
                filelist.push(fname)
            } else {
                files = Object.entries(cdir)
                    .sort((a, b) => a[0] < b[0] ? -1 : (a[0] === b[0] ? 0 : 1))
                    .map((v, i) => {
                        let name = ''
                        const isFile = typeof (v[1]) == 'string';
                        if (long) {
                            name += (isFile ? '-r--r-----' : 'dr-xr-x---') + ' ';
                            const inode: number = (isFile ? 1 : 2);
                            name += ' ' + inode + ' '
                        }
                        name += isFile ? v[0] : (ansi.toHtml('\x1b[31m' + v[0] + '\x1b[0m'));
                        return name;
                    })
                if (files.length) {
                    dirlist += (withArgs ? args[0] + ":\n" : '') + files.join(long ? '\n' : ' ') + "\n\n";
                }
            }
            if (args.length > 1) {
                args.shift()
            } else {
                break;
            }
        }
        const list = (filelist.length ? filelist.join(long ? '\n' : ' ') + "\n\n" : '') + dirlist;
        return list;
    }


    /**
     * simple pwd command
     *
     * @returns {string}
     */
    pwd = (): string => {
        return this.cwd.reduce((p, c) => {
            return (p ? p + '/' : '') + c;
        }, '/home/' + this.user) + "\n"
    }


    /**
     * return current directory
     *
     * @returns {*|string}
     */
    getcwd = (): string => {
        let d = this.getCwd(); // get copy

        return d.length ? (d.pop() ?? '~') : '~';
    }


    /**
     * simple cd command
     *
     * @param args
     * @returns {string}
     */
    cd = (args: string[]): string => {
        if (!args.length) {
            this.setCwd([]);
            return "\n"
        }
        let ndir = this.getCwd();
        // if (args[0] === '..' && ndir.length > 0) {
        //     ndir.pop()
        // } else if (args[0] === '..' || args[0] === '.') {
        //     return "\n";
        // } else {
        args[0].split('/').forEach((v) => {
            if (v === '..' && ndir.length > 0) {
                ndir.pop()
            } else if (v !== '.') {
                ndir.push(v)
            }
        })
        // }
        let d = this.findDir(this.dir, ndir)
        if (d === undefined) {
            return "Directory not found.\n"
        }
        // cwd = ndir;
        this.setCwd(ndir);
        return "\n";
    }

    /**
     * simple text file (url) reader
     *
     * @param url
     * @returns {Promise<string>}
     */
    readContent = async (url: string): Promise<string> => {
        const res = await fetch(url)
            .then(async (response) => {
                let v = await response.text()
                    .then((v) => {
                        let res = v.replace(/\r?\n/g, '<br/>')
                            .replace(/ /g, '\&nbsp;');
                        return res;
                    })
                    .catch((err) => {
                        return err;
                    });
                return v;
            })
            .catch((err) => {
                return err
            });
        return res;

    }

    /**
     * simple cat command
     *
     * @param name
     * @returns {Promise<string>}
     */
    cat = async (args: string[]): Promise<string> => {
        if (!args.length) {
            return "Missing filename.\n";
        }
        let ndir = this.getCwd()
        args[0].split('/').forEach((v) => {
            if (v === '..' && ndir.length > 0) {
                ndir.pop()
            } else if (v !== '.') {
                ndir.push(v)
            }
        })
        const url = this.findDir(this.dir, ndir);
        if (typeof (url) !== 'string') {
            return "File not found.\n";
        }

        // const url = c;
        const res = await this.readContent(url)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            })
        return res + "\n";
    }
}
