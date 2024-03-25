var m = Object.defineProperty;
var g = (l, t, e) => t in l ? m(l, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[t] = e;
var n = (l, t, e) => (g(l, typeof t != "symbol" ? t + "" : t, e), e);
import w from "ansi-to-html";
import { reactive as y } from "vue";
import "./macos-vue.es2.js";
const d = y(
  {
    extensions: {}
    // extension commands
  }
), b = (l) => {
  Object.assign(d.extensions, l);
}, C = new w();
class x {
  constructor(t) {
    /**
     * set system info
     *
     * @param args
     */
    n(this, "setTerminal", (t) => {
      this.dir = t.dir ?? {}, this.user = t.user ?? "user", this.host = t.host ?? "host";
    });
    /**
     * change username
     *
     * @param name
     */
    n(this, "setUser", (t) => {
      this.user = t;
    });
    /**
     * get a copy of cwd rather than a reference
     *
     * @returns {*[]}
     */
    n(this, "getCwd", () => [...this.cwd]);
    /**
     * set cwd
     *
     * @param value
     */
    n(this, "setCwd", (t) => {
      this.cwd = t;
    });
    /**
     * Append to cwd
     *
     * @param value
     */
    n(this, "pushCwd", (t) => {
      this.cwd.push(t);
    });
    /**
     * obtain updated prompt
     *
     * @returns {string}
     */
    n(this, "getPrompt", () => this.user + "@" + this.host + " " + this.getcwd() + this.prompt + " ");
    /**
     * search for a file or directory in given directory structure
     *
     * @param d
     * @param c
     * @returns {*|number}
     */
    n(this, "findDir", (t, e) => {
      if (!e.length)
        return t;
      let i = [...e];
      const h = i.shift();
      return t[h] === void 0 ? -1 : this.findDir(t[h], i);
    });
    n(this, "newline", () => {
      this.buffer += this.typingBuffer + `
`, this.updatePos();
    });
    n(this, "updatePos", () => {
      this.pos = this.buffer.length;
    });
    n(this, "result", (t) => {
      this.buffer += t + this.getPrompt(), this.updatePos();
    });
    n(this, "commandNotFound", (t) => {
      this.result("Command " + t + ` not found.
`);
    });
    n(this, "keypress", (t) => {
      this.typingBuffer += t;
    });
    n(this, "backspace", () => {
      this.typingBuffer.length > 0 && (this.typingBuffer = this.typingBuffer.substring(0, this.typingBuffer.length - 1));
    });
    n(this, "ctrlC", () => {
      this.newline(), this.result(""), this.typingBuffer = "";
    });
    n(this, "exec", async () => {
      this.newline(), this.typingBuffer == "" && this.result("");
      const t = String(this.typingBuffer).replace(/\\ /g, "º").split(" ").map((i) => i.replace(/º/g, " "));
      this.typingBuffer = "";
      const e = Object.entries(this.commands).find((i, h) => i[0] === t[0]);
      if (!e)
        this.commandNotFound(t[0]);
      else {
        const i = await e[1][0](t.length > 1 ? t.slice(1) : []);
        this.result(i);
      }
    });
    n(this, "help", (t) => {
      if (t.length) {
        const e = Object.entries(this.commands).find((i, h) => i[0] === t[0]);
        return e ? e[0] + " " + e[1][1] + " : " + e[1][2] + `
` : "Command " + t[0] + ` not found.
`;
      }
      return "Available commands: " + Object.keys(this.commands).sort((e, i) => e[0] < i[0] ? -1 : e[0] === i[0] ? 0 : 1).join(", ") + "\nUse `help command` for more help\n";
    });
    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    n(this, "ls", (t) => {
      let e = !1;
      t[0] === "-l" && (e = !0, t.shift());
      let i = [], h = "", s = [], o = [];
      const a = t.length > 0;
      for (; ; ) {
        s = this.getCwd(), t.length && t[0].split("/").forEach((r) => {
          s.push(r);
        }), o = this.findDir(this.dir, s);
        let f = [];
        if (typeof o == "string") {
          let r = "";
          e && (r += "-r--r----- "), r += t[0], i.push(r);
        } else
          f = Object.entries(o).sort((r, c) => r[0] < c[0] ? -1 : r[0] === c[0] ? 0 : 1).map((r, c) => {
            let u = "";
            const p = typeof r[1] == "string";
            return e && (u += (p ? "-r--r-----" : "dr-xr-x---") + " "), u += p ? r[0] : C.toHtml("\x1B[35m" + r[0] + "\x1B[0m"), u;
          }), f.length && (h += (a > 0 ? t[0] + `:
` : "") + f.join(e ? `
` : " ") + `

`);
        if (t.length > 1)
          t.shift();
        else
          break;
      }
      return (i.length ? i.join(e ? `
` : " ") + `

` : "") + h;
    });
    /**
     * simple pwd command
     *
     * @returns {string}
     */
    n(this, "pwd", () => this.cwd.reduce((t, e) => (t ? t + "/" : "") + e, "/home/" + this.user) + `
`);
    /**
     * return current directory
     *
     * @returns {*|string}
     */
    n(this, "getcwd", () => {
      let t = this.getCwd();
      return t.length ? t.pop() : "~";
    });
    /**
     * simple cd command
     *
     * @param args
     * @returns {string}
     */
    n(this, "cd", (t) => {
      if (!t.length)
        return this.setCwd([]), `
`;
      let e = this.getCwd();
      if (t[0] === ".." && e.length > 0)
        e.pop();
      else {
        if (t[0] === ".." || t[0] === ".")
          return `
`;
        t[0].split("/").forEach((h) => {
          e.push(h);
        });
      }
      return this.findDir(this.dir, e) === -1 ? `Directory not found.
` : (this.setCwd(e), `
`);
    });
    /**
     * simple text file (url) reader
     *
     * @param url
     * @returns {Promise<string>}
     */
    n(this, "readContent", async (t) => await fetch(t).then(async (i) => await i.text().then((s) => s.replace(/\r?\n/g, "<br/>").replace(/ /g, "&nbsp;")).catch((s) => s)).catch((i) => i));
    /**
     * simple cat command
     *
     * @param name
     * @returns {Promise<string>}
     */
    n(this, "cat", async (t) => {
      if (!t.length)
        return `Missing filename.
`;
      let e = this.getCwd();
      if (t[0].split("/").forEach((s) => {
        e.push(s);
      }), this.findDir(this.dir, e) === -1)
        return `File not found.
`;
      const i = "/files/" + e.join("/");
      return await this.readContent(i).then((s) => s).catch((s) => s) + `
`;
    });
    this.setTerminal(t), this.cwd = [], this.prompt = "%", this.commands = {
      help: [this.help, "[command]", "help with commands"],
      ls: [this.ls, "[-l][dir]", "list files in directory"],
      pwd: [this.pwd, "", "show current directory"],
      cd: [this.cd, "[dir]", "change directory"],
      cat: [this.cat, "[filename]", "dump a text file"],
      ...d.extensions
    }, this.buffer = this.getPrompt(), this.updatePos(), this.typingBuffer = "";
  }
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extendCommands: b,
  terminal: x,
  terminalStore: d
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as a,
  d as b,
  b as e,
  x as t
};
