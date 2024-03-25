import Convert from "ansi-to-html";
import {reactive} from "vue";
import {windowStore} from "@/stores.js";

export const terminalStore = reactive({
        extensions: {}, // extension commands
    }
)

export const extendCommands = (commands) => {
    Object.assign(terminalStore.extensions,commands)
}

const ansi = new Convert();

export class terminal {
    constructor(args) {
        this.setTerminal(args)
        this.cwd = [] // current working directory (as an array, not a path)
        this.prompt = '%'; // current default prompt (would change for root user)
        this.commands = {
            help: [this.help, "[command]", "help with commands"],
            ls: [this.ls, "[-l][dir]", "list files in directory"],
            pwd: [this.pwd, "", "show current directory"],
            cd: [this.cd, "[dir]", "change directory"],
            cat: [this.cat, "[filename]", "dump a text file"],
            ...terminalStore.extensions
        };
        this.buffer = this.getPrompt();
        this.updatePos();
        this.typingBuffer = '';
    }

    /**
     * set system info
     *
     * @param args
     */
    setTerminal = (args) => {
        this.dir = args.dir ?? {} // current directory structure
        this.user = args.user ?? 'user'; // current user
        this.host = args.host ?? 'host' // current hostname (very unlikely to change)
    }

    /**
     * change username
     *
     * @param name
     */
    setUser = (name) => {
        this.user = name;
    }


    /**
     * get a copy of cwd rather than a reference
     *
     * @returns {*[]}
     */
    getCwd = () => [...this.cwd]

    /**
     * set cwd
     *
     * @param value
     */
    setCwd = (value) => {
        this.cwd = value
    }

    /**
     * Append to cwd
     *
     * @param value
     */
    pushCwd = (value) => {
        this.cwd.push(value)
    }

    /**
     * obtain updated prompt
     *
     * @returns {string}
     */
    getPrompt = () => this.user + '@' + this.host + ' ' + this.getcwd() + this.prompt + ' ';


    /**
     * search for a file or directory in given directory structure
     *
     * @param d
     * @param c
     * @returns {*|number}
     */
    findDir = (d, c) => {
        if (!c.length) {
            return d;
        }
        let cc = [...c]
        const c2 = cc.shift()
        if (d[c2] === undefined) {
            return -1
        }
        return this.findDir(d[c2], cc);
    }

    newline = () => {
        this.buffer += this.typingBuffer + "\n";
        this.updatePos();
    }

    updatePos = () => {
        this.pos = this.buffer.length;
    }

    result = (message) => {
        this.buffer += message + this.getPrompt();
        this.updatePos();
    }

    commandNotFound = (command) => {
        this.result('Command ' + command + " not found.\n");
    }

    keypress = (key) => {
        this.typingBuffer += key;
    }

    backspace = () => {
        if (this.typingBuffer.length>0) {
            this.typingBuffer = this.typingBuffer.substring(0, this.typingBuffer.length - 1);
        }
    }

    ctrlC = () => {
        this.newline();
        this.result("");
        this.typingBuffer = '';
    }

    exec = async () => {
        this.newline();
        if (this.typingBuffer == '') {
            this.result("");
        }

        const args = String(this.typingBuffer)
            .replace(/\\ /g, "º")
            .split(" ")
            .map((v) => v.replace(/º/g, " "));
        this.typingBuffer = '';
        const cmd = Object.entries(this.commands).find((v, i) => {
            return v[0] === args[0];
        });
        if (!cmd) {
            this.commandNotFound(args[0]);
        } else {
            const res = await cmd[1][0](args.length > 1 ? args.slice(1) : []);
            this.result(res);
        }
    }

    help = (command) => {
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

    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    ls = (args) => {
        let long = false
        if (args[0] === '-l') {
            long = true
            args.shift()
        }

        let filelist = [];
        let dirlist = '';
        let ndir = []
        let cdir = []

        const withArgs = args.length > 0
        while (true) {
            ndir = this.getCwd()
            if (args.length) {
                args[0].split('/').forEach((v) => {
                    ndir.push(v)
                })
            }
            cdir = this.findDir(this.dir, ndir);
            let files = []
            if (typeof (cdir) === 'string') {
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
                        }
                        name += isFile ? v[0] : (ansi.toHtml('\x1b[35m' + v[0] + '\x1b[0m'));
                        return name;
                    })
                if (files.length) {
                    dirlist += (withArgs > 0 ? args[0] + ":\n" : '') + files.join(long ? '\n' : ' ') + "\n\n";
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
    pwd = () => {
        return this.cwd.reduce((p, c) => {
            return (p ? p + '/' : '') + c;
        }, '/home/' + this.user) + "\n"
    }


    /**
     * return current directory
     *
     * @returns {*|string}
     */
    getcwd = () => {
        let d = this.getCwd(); // get copy
        return d.length ? d.pop() : '~';
    }


    /**
     * simple cd command
     *
     * @param args
     * @returns {string}
     */
    cd = (args) => {
        if (!args.length) {
            this.setCwd([]);
            return "\n"
        }
        let ndir = this.getCwd();
        if (args[0] === '..' && ndir.length > 0) {
            ndir.pop()
        } else if (args[0] === '..' || args[0] === '.') {
            return "\n";
        } else {
            args[0].split('/').forEach((v) => {
                ndir.push(v)
            })
        }
        let d = this.findDir(this.dir, ndir)
        if (d === -1) {
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
    readContent = async (url) => {
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
    cat = async (name) => {
        if (!name.length) {
            return "Missing filename.\n";
        }
        let ndir = this.getCwd()
        name[0].split('/').forEach((v) => {
            ndir.push(v)
        })
        if (this.findDir(this.dir, ndir) === -1) {
            return "File not found.\n";
        }

        const url = '/files/' + ndir.join('/');
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
