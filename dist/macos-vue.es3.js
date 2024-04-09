var g = Object.defineProperty;
var y = (f, t, e) => t in f ? g(f, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : f[t] = e;
var i = (f, t, e) => (y(f, typeof t != "symbol" ? t + "" : t, e), e);
import w from "ansi-to-html";
import { reactive as x } from "vue";
const a = x(
  {
    extensions: {}
    // extension commands
  }
), P = (f) => {
  f !== void 0 && Object.assign(a.extensions, f);
}, B = new w();
class E {
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
      if (t.path !== void 0)
        return t;
      if (t.files === void 0)
        return;
      if (!e.length)
        return t.files;
      let s = [...e];
      const h = s.shift() ?? "";
      if (t.files[h] !== void 0)
        return this.findDir(t.files[h], s);
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
      this.newline(), this.historyIndex = this.history.push(this.typingBuffer), this.typingBuffer == "" && this.result("");
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
    i(this, "historyCmd", (t) => t.length && t[0] === "-c" ? (this.history = [], this.historyIndex = 0, `
`) : this.history.join(`
`) + `
`);
    i(this, "getmod", (t) => {
      let e = "";
      e += t.path === void 0 ? "d" : "-";
      const s = t.mod ?? (t.path === void 0 ? 750 : 640), h = Math.floor(s / 100), o = Math.floor(s % 100 / 10), n = s % 10;
      return e += (h & 4 ? "r" : "-") + (h & 2 ? "w" : "-") + (h & 1 ? "x" : "-"), e += (o & 4 ? "r" : "-") + (o & 2 ? "w" : "-") + (o & 1 ? "x" : "-"), e += (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-"), e;
    });
    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    i(this, "ls", (t) => {
      let e = !1;
      t[0] === "-l" && (e = !0, t.shift());
      let s = [], h = "", o = [], n = {};
      const m = t.length > 0;
      for (; ; ) {
        o = this.getCwd(), t.length && t[0].split("/").forEach((r) => {
          r === ".." && o.length > 0 ? o.pop() : r !== "." && o.push(r);
        }), n = this.findDir(this.dir, o);
        let c = [];
        if (n !== void 0)
          if (n.path !== void 0) {
            let r = "";
            if (e) {
              r += this.getmod(n) + " ", r += 1 + " ";
              const d = n.owner ? n.owner.split(":") : [this.user, "staff"];
              r += d[0].padEnd(12) + " " + d[1].padEnd(8) + " ";
            }
            r += t[0], s.push(r);
          } else
            c = Object.entries(n).sort((r, l) => r[0] < l[0] ? -1 : r[0] === l[0] ? 0 : 1).map((r, l) => {
              let d = "";
              const u = r[1].path !== void 0;
              if (e) {
                d += this.getmod(r[1]) + " ", d += (u ? 1 : 2) + " ";
                const p = r[1].owner ? r[1].owner.split(":") : [this.user, "staff"];
                d += p[0].padEnd(12) + " " + p[1].padEnd(8) + " ";
              }
              return d += u ? r[0] : B.toHtml("\x1B[31m" + r[0] + "\x1B[0m"), d;
            }), c.length && (h += (m ? t[0] + `:
` : "") + c.join(e ? `
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
      t[0].split("/").forEach((h) => {
        h === ".." && e.length > 0 ? e.pop() : h !== "." && e.push(h);
      });
      let s = this.findDir(this.dir, e);
      return s === void 0 || s.path !== void 0 ? `Directory not found.
` : (this.setCwd(e), `
`);
    });
    /**
     * simple text file (url) reader
     *
     * @param url
     * @returns {Promise<string>}
     */
    i(this, "readContent", async (t) => await fetch(t).then(async (s) => await s.text().then((o) => o.replace(/\r?\n/g, "<br/>").replace(/ /g, "&nbsp;")).catch((o) => o)).catch((s) => s));
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
      t[0].split("/").forEach((n) => {
        n === ".." && e.length > 0 ? e.pop() : n !== "." && e.push(n);
      });
      const s = this.findDir(this.dir, e);
      if (s === void 0 || s.path === void 0)
        return `File not found.
`;
      const h = s.path;
      return await this.readContent(h).then((n) => n).catch((n) => n) + `
`;
    });
    this.index = e, this.setTerminal(t), this.cwd = [], this.prompt = "%", this.commands = {
      help: [this.help, "[command]", "help with commands"],
      ls: [this.ls, "[-l][dir]", "list files in directory"],
      pwd: [this.pwd, "", "show current directory"],
      cd: [this.cd, "[dir]", "change directory"],
      cat: [this.cat, "[filename]", "dump a text file"],
      clear: [this.clear, "", "clear terminal"],
      history: [this.historyCmd, "[-c]", "show or clear history"],
      ...t.commands,
      ...a.extensions
    }, this.buffer = this.getPrompt(), this.typingBuffer = "", this.restore(), this.updatePos();
  }
}
export {
  P as extendCommands,
  E as terminal,
  a as terminalStore
};
