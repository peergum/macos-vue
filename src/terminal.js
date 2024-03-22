import Convert from "ansi-to-html";
import {windowStore} from "@/stores.js";

let ansi = new Convert();

let dir = {}
let user = '';
let host = ''
let prompt = '%';

export const setTerminal = (args) => {
    dir = args.dir;
    user = args.user;
    host = args.host;
}

export const setTerminalUser = (name) => {
    user = name;
}

const cwd = () => [...windowStore.cwd]; // generate a copy
const setCwd = (value) => {
    windowStore.cwd = value
}
const pushCwd = (value) => {
    windowStore.cwd.push(value)
}
export const getPrompt = () => user + '@' + host + ' ' + getcwd() + prompt + ' ';

const findDir = (d, c) => {
    // console.log(d, c)
    if (!c.length) {
        return d;
    }
    let cc = [...c]
    const c2 = cc.shift()
    if (d[c2] === undefined) {
        return -1
    }
    return findDir(d[c2], cc);
}

export const ls = (args) => {
    let long = false
    if (args[0] === '-l') {
        long = true
        args.shift()
    }

    // let ndir = cwd
    // if (args[1]) {
    //     ndir.push(args[1])
    // }

    let filelist = [];
    let dirlist = '';
    let ndir = []
    let cdir = []
    let dirs = 0
    const withArgs = args.length > 0
    while (true) {
        ndir = cwd()
        if (args.length) {
            args[0].split('/').forEach((v) => {
                ndir.push(v)
            })
        }
        cdir = findDir(dir, ndir);
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
    console.log(filelist)
    return list;
}

export const pwd = () => {
    console.log(cwd())
    return cwd().reduce((p, c) => {
        return (p ? p + '/' : '') + c;
    }, '/home/' + user) + "\n"
}

export const getcwd = () => {
    let d = cwd();
    return d.length ? d.pop() : '~';
}


export const cd = (args) => {
    if (!args.length) {
        setCwd([]);
        return "\n"
    }
    let ndir = [...cwd()];
    if (args[0] === '..' && ndir.length > 0) {
        ndir.pop()
    } else if (args[0] === '..' || args[0] === '.') {
        return "\n";
    } else {
        args[0].split('/').forEach((v) => {
            ndir.push(v)
        })
        console.log(ndir)
    }
    let d = findDir(dir, ndir)
    if (d === -1) {
        return "Directory not found.\n"
    }
    console.log(d, ndir)
    // cwd = ndir;
    setCwd(ndir);
    console.log(cwd())
    return "\n";
}

const readContent = async (url) => {
    const res= await fetch(url)
            .then( async (response) => {
                console.log(response);
                let v = await response.text()
                    .then((v) => {
                        let res = v.replace(/\r?\n/g, '<br/>')
                            .replace(/ /g, '\&nbsp;');
                        console.log(res);
                        return res;
                    })
                    .catch((err) => {
                        console.err(err);
                        return err;
                    });
                console.log(v);
                return v;
            })
            .catch((err) => {
                console.err(err);
                return err
            });
    console.log(res);
    return res;

}

export const cat = async (name) => {
    if (!name.length) {
        return "Missing filename.\n";
    }
    let ndir = cwd()
    name[0].split('/').forEach((v) => {
        ndir.push(v)
    })
    if (findDir(dir, ndir) === -1) {
        return "File not found.\n";
    }

    const url = '/files/' + ndir.join('/');
    const res = await readContent(url)
        .then((res) => {
            console.log("res=",res);
            return res;
        })
        .catch((err) => {
            console.err(err);
            return err;
        })
    return res+"\n";
}
