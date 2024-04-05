var g = Object.defineProperty;
var w = (o, t, e) => t in o ? g(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var i = (o, t, e) => (w(o, typeof t != "symbol" ? t + "" : t, e), e);
import y from "ansi-to-html";
import { reactive as b } from "vue";
const p = b(
  {
    extensions: {}
    // extension commands
  }
), C = (o) => {
  o !== void 0 && Object.assign(p.extensions, o);
}, B = new y();
class j {
  constructor(t) {
    i(this, "cwd", []);
    i(this, "prompt", "%");
    i(this, "commands", {});
    i(this, "buffer", "");
    i(this, "typingBuffer", "");
    i(this, "dir", {});
    i(this, "user", "user");
    i(this, "host", "host");
    i(this, "pos", 0);
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
      if (typeof t == "string")
        return {};
      if (!e.length)
        return t;
      let s = [...e];
      const h = s.shift() ?? "";
      return this.findDir(t[h], s);
    });
    i(this, "newline", () => {
      this.buffer += this.typingBuffer + `
`, this.updatePos();
    });
    i(this, "updatePos", () => {
      this.pos = this.buffer.length;
    });
    i(this, "result", (t) => {
      this.buffer += t + this.getPrompt(), this.updatePos();
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
      this.newline(), this.typingBuffer == "" && this.result("");
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
    /**
     * simple ls command
     *
     * @param args
     * @returns {string}
     */
    i(this, "ls", (t) => {
      let e = !1;
      t[0] === "-l" && (e = !0, t.shift());
      let s = [], h = "", n = [], l = {};
      const a = t.length > 0;
      for (; ; ) {
        n = this.getCwd(), t.length && t[0].split("/").forEach((r) => {
          n.push(r);
        }), l = this.findDir(this.dir, n);
        let c = [];
        if (typeof l == "string") {
          let r = "";
          e && (r += "-r--r----- "), r += t[0], s.push(r);
        } else
          c = Object.entries(l).sort((r, u) => r[0] < u[0] ? -1 : r[0] === u[0] ? 0 : 1).map((r, u) => {
            let f = "";
            const d = typeof r[1] == "string";
            if (e) {
              f += (d ? "-r--r-----" : "dr-xr-x---") + " ";
              const m = (d ? 1 : 2) + Object.keys(l).length;
              f += " " + m + " ";
            }
            return f += d ? r[0] : B.toHtml("\x1B[35m" + r[0] + "\x1B[0m"), f;
          }), c.length && (h += (a ? t[0] + `:
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
      return this.findDir(this.dir, e) === void 0 ? `Directory not found.
` : (this.setCwd(e), `
`);
    });
    /**
     * simple text file (url) reader
     *
     * @param url
     * @returns {Promise<string>}
     */
    i(this, "readContent", async (t) => await fetch(t).then(async (s) => await s.text().then((n) => n.replace(/\r?\n/g, "<br/>").replace(/ /g, "&nbsp;")).catch((n) => n)).catch((s) => s));
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
      if (t[0].split("/").forEach((n) => {
        e.push(n);
      }), this.findDir(this.dir, e) === void 0)
        return `File not found.
`;
      const s = "/files/" + e.join("/");
      return await this.readContent(s).then((n) => n).catch((n) => n) + `
`;
    });
    this.setTerminal(t), this.cwd = [], this.prompt = "%", this.commands = {
      help: [this.help, "[command]", "help with commands"],
      ls: [this.ls, "[-l][dir]", "list files in directory"],
      pwd: [this.pwd, "", "show current directory"],
      cd: [this.cd, "[dir]", "change directory"],
      cat: [this.cat, "[filename]", "dump a text file"],
      ...p.extensions
    }, this.buffer = this.getPrompt(), this.updatePos(), this.typingBuffer = "";
  }
}
const D = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extendCommands: C,
  terminal: j,
  terminalStore: p
}, Symbol.toStringTag, { value: "Module" }));
export {
  D as a,
  p as b,
  C as e,
  j as t
};
