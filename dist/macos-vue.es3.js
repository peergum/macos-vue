var g = Object.defineProperty;
var m = (o, t, e) => t in o ? g(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var i = (o, t, e) => (m(o, typeof t != "symbol" ? t + "" : t, e), e);
import y from "ansi-to-html";
import { reactive as w } from "vue";
const p = w(
  {
    extensions: {}
    // extension commands
  }
), P = (o) => {
  o !== void 0 && Object.assign(p.extensions, o);
}, x = new y();
class O {
  constructor(t, e) {
    i(this, "cwd", []);
    i(this, "prompt", "%");
    i(this, "commands", {});
    i(this, "buffer", "");
    i(this, "typingBuffer", "");
    i(this, "dir", {});
    i(this, "user", "user");
    i(this, "host", "host");
    i(this, "pos", 0);
    i(this, "index");
    i(this, "history", []);
    i(this, "historyIndex", 0);
    i(this, "restore", () => {
      const t = JSON.parse(localStorage.getItem("terminal." + this.index) ?? "{}");
      t !== void 0 && (this.buffer = t.buffer ?? this.getPrompt(), this.typingBuffer = t.typingBuffer ?? "", this.history = t.history ?? [], this.historyIndex = this.history.length);
    });
    i(this, "save", () => {
      localStorage.setItem("terminal." + this.index, JSON.stringify({
        buffer: this.buffer,
        typingBuffer: this.typingBuffer,
        history: this.history
      }));
    });
    /**
     * set system info
     *
     * @param args
     */
    i(this, "setTerminal", (t) => {
      this.dir = t.dir, this.user = t.user, this.host = t.host;
    });
    /**
     * change username
     *
     * @param name
     */
    i(this, "setUser", (t) => {
      this.user = t;
    });
    i(this, "goHistory", (t) => {
      const e = this.historyIndex + t;
      e >= 0 && e < this.history.length && (this.typingBuffer = this.history[e], this.historyIndex = e);
    });
    /**
     * get a copy of cwd rather than a reference
     *
     * @returns {*[]}
     */
    i(this, "getCwd", () => [...this.cwd]);
    /**
     * set cwd
     *
     * @param value
     */
    i(this, "setCwd", (t) => {
      this.cwd = t;
    });
    /**
     * Append to cwd
     *
     * @param value
     */
    i(this, "pushCwd", (t) => {
      this.cwd.push(t);
    });
    /**
     * obtain updated prompt
     *
     * @returns {string}
     */
    i(this, "getPrompt", () => this.user + "@" + this.host + " " + this.getcwd() + this.prompt + " ");
    /**
     * search for a file or directory in given directory structure
     *
     * @param d
     * @param c
     * @returns {*|number}
     */
    i(this, "findDir", (t, e) => {
      if (typeof t == "string" || !e.length)
        return t;
      let s = [...e];
      const h = s.shift() ?? "";
      return t[h] === void 0 ? {} : this.findDir(t[h], s);
    });
    i(this, "newline", () => {
      this.buffer += this.typingBuffer + `
`, this.updatePos();
    });
    i(this, "updatePos", () => {
      this.pos = this.buffer.length;
    });
    i(this, "result", (t) => {
      this.buffer += t + this.getPrompt(), this.save(), this.updatePos();
    });
    i(this, "commandNotFound", (t) => {
      this.result("Command " + t + ` not found.
`);
    });
    i(this, "keypress", (t) => {
      this.typingBuffer += t;
    });
    i(this, "backspace", () => {
      this.typingBuffer.length > 0 && (this.typingBuffer = this.typingBuffer.substring(0, this.typingBuffer.length - 1));
    });
    i(this, "ctrlC", () => {
      this.newline(), this.result(""), this.typingBuffer = "";
    });
    i(this, "exec", async () => {
      this.newline(), this.historyIndex = this.history.push(this.typingBuffer), console.log(this.history, this.historyIndex), this.typingBuffer == "" && this.result("");
      const t = String(this.typingBuffer).replace(/\\ /g, "º").split(" ").map((s) => s.replace(/º/g, " "));
      this.typingBuffer = "";
      const e = Object.entries(this.commands).find((s, h) => s[0] === t[0]);
      if (!e)
        this.commandNotFound(t[0]);
      else {
        const s = await e[1][0](t.length > 1 ? t.slice(1) : []);
        this.result(s);
      }
    });
    i(this, "help", (t) => {
      if (t.length) {
        const e = Object.entries(this.commands).find((s, h) => s[0] === t[0]);
        return e ? e[0] + " " + e[1][1] + " : " + e[1][2] + `
` : "Command " + t[0] + ` not found.
`;
      }
      return "Available commands: " + Object.keys(this.commands).sort((e, s) => e[0] < s[0] ? -1 : e[0] === s[0] ? 0 : 1).join(", ") + "\nUse `help command` for more help\n";
    });
    i(this, "clear", () => (this.buffer = "", `
`));
    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    i(this, "ls", (t) => {
      let e = !1;
      t[0] === "-l" && (e = !0, t.shift());
      let s = [], h = "", r = [], f = {};
      const a = t.length > 0;
      for (; ; ) {
        r = this.getCwd(), console.log("ndir=", r), t.length && t[0].split("/").forEach((n) => {
          n === ".." && r.length > 0 ? r.pop() : n !== "." && r.push(n);
        }), f = this.findDir(this.dir, r);
        let u = [];
        if (f !== void 0)
          if (typeof f == "string") {
            let n = "";
            e && (n += "-r--r----- "), n += t[0], s.push(n);
          } else
            u = Object.entries(f).sort((n, d) => n[0] < d[0] ? -1 : n[0] === d[0] ? 0 : 1).map((n, d) => {
              let l = "";
              const c = typeof n[1] == "string";
              return e && (l += (c ? "-r--r-----" : "dr-xr-x---") + " ", l += " " + (c ? 1 : 2) + " "), l += c ? n[0] : x.toHtml("\x1B[31m" + n[0] + "\x1B[0m"), l;
            }), u.length && (h += (a ? t[0] + `:
` : "") + u.join(e ? `
` : " ") + `

`);
        if (t.length > 1)
          t.shift();
        else
          break;
      }
      return (s.length ? s.join(e ? `
` : " ") + `

` : "") + h;
    });
    /**
     * simple pwd command
     *
     * @returns {string}
     */
    i(this, "pwd", () => this.cwd.reduce((t, e) => (t ? t + "/" : "") + e, "/home/" + this.user) + `
`);
    /**
     * return current directory
     *
     * @returns {*|string}
     */
    i(this, "getcwd", () => {
      let t = this.getCwd();
      return t.length ? t.pop() ?? "~" : "~";
    });
    /**
     * simple cd command
     *
     * @param args
     * @returns {string}
     */
    i(this, "cd", (t) => {
      if (!t.length)
        return this.setCwd([]), `
`;
      let e = this.getCwd();
      return t[0].split("/").forEach((h) => {
        h === ".." && e.length > 0 ? e.pop() : h !== "." && e.push(h);
      }), this.findDir(this.dir, e) === void 0 ? `Directory not found.
` : (this.setCwd(e), `
`);
    });
    /**
     * simple text file (url) reader
     *
     * @param url
     * @returns {Promise<string>}
     */
    i(this, "readContent", async (t) => await fetch(t).then(async (s) => await s.text().then((r) => r.replace(/\r?\n/g, "<br/>").replace(/ /g, "&nbsp;")).catch((r) => r)).catch((s) => s));
    /**
     * simple cat command
     *
     * @param name
     * @returns {Promise<string>}
     */
    i(this, "cat", async (t) => {
      if (!t.length)
        return `Missing filename.
`;
      let e = this.getCwd();
      t[0].split("/").forEach((r) => {
        r === ".." && e.length > 0 ? e.pop() : r !== "." && e.push(r);
      });
      const s = this.findDir(this.dir, e);
      return typeof s != "string" ? `File not found.
` : await this.readContent(s).then((r) => r).catch((r) => r) + `
`;
    });
    this.index = e, this.setTerminal(t), this.cwd = [], this.prompt = "%", this.commands = {
      help: [this.help, "[command]", "help with commands"],
      ls: [this.ls, "[-l][dir]", "list files in directory"],
      pwd: [this.pwd, "", "show current directory"],
      cd: [this.cd, "[dir]", "change directory"],
      cat: [this.cat, "[filename]", "dump a text file"],
      clear: [this.clear, "", "clear terminal"],
      ...p.extensions
    }, this.buffer = this.getPrompt(), this.typingBuffer = "", this.restore(), this.updatePos();
  }
}
export {
  P as extendCommands,
  O as terminal,
  p as terminalStore
};
