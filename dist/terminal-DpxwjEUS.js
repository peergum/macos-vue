import y from "ansi-to-html";
import { windowStore as a } from "./macos-vue.es2.js";
let _ = new y(), i = {}, s = "", g = "", E = "%";
const O = (e) => {
  i = e.dir, s = e.user, g = e.host;
}, S = (e) => {
  s = e;
}, r = () => [...a.cwd], w = (e) => {
  a.cwd = e;
}, T = () => s + "@" + g + " " + b() + E + " ", c = (e, t) => {
  if (!t.length)
    return e;
  let l = [...t];
  const o = l.shift();
  return e[o] === void 0 ? -1 : c(e[o], l);
}, C = (e) => {
  let t = !1;
  e[0] === "-l" && (t = !0, e.shift());
  let l = [], o = "", f = [], u = [];
  const j = e.length > 0;
  for (; ; ) {
    f = r(), e.length && e[0].split("/").forEach((n) => {
      f.push(n);
    }), u = c(i, f);
    let d = [];
    if (typeof u == "string") {
      let n = "";
      t && (n += "-r--r----- "), n += e[0], l.push(n);
    } else
      d = Object.entries(u).sort((n, h) => n[0] < h[0] ? -1 : n[0] === h[0] ? 0 : 1).map((n, h) => {
        let p = "";
        const m = typeof n[1] == "string";
        return t && (p += (m ? "-r--r-----" : "dr-xr-x---") + " "), p += m ? n[0] : _.toHtml("\x1B[35m" + n[0] + "\x1B[0m"), p;
      }), d.length && (o += (j > 0 ? e[0] + `:
` : "") + d.join(t ? `
` : " ") + `

`);
    if (e.length > 1)
      e.shift();
    else
      break;
  }
  const x = (l.length ? l.join(t ? `
` : " ") + `

` : "") + o;
  return console.log(l), x;
}, D = () => (console.log(r()), r().reduce((e, t) => (e ? e + "/" : "") + t, "/home/" + s) + `
`), b = () => {
  let e = r();
  return e.length ? e.pop() : "~";
}, F = (e) => {
  if (!e.length)
    return w([]), `
`;
  let t = [...r()];
  if (e[0] === ".." && t.length > 0)
    t.pop();
  else {
    if (e[0] === ".." || e[0] === ".")
      return `
`;
    e[0].split("/").forEach((o) => {
      t.push(o);
    }), console.log(t);
  }
  let l = c(i, t);
  return l === -1 ? `Directory not found.
` : (console.log(l, t), w(t), console.log(r()), `
`);
}, M = (e) => {
  if (e === void 0)
    return `Missing filename.
`;
  let t = r();
  return e.split("/").forEach((o) => {
    t.push(o);
  }), c(i, t) === -1 ? `File not found.
` : "./src/files/" + t.join("/") + `
`;
}, z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cat: M,
  cd: F,
  getPrompt: T,
  getcwd: b,
  ls: C,
  pwd: D,
  setTerminal: O,
  setTerminalUser: S
}, Symbol.toStringTag, { value: "Module" }));
export {
  M as a,
  S as b,
  F as c,
  b as d,
  T as g,
  C as l,
  D as p,
  O as s,
  z as t
};
