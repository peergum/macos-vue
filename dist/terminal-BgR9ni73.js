import x from "ansi-to-html";
import { windowStore as m } from "./macos-vue.es2.js";
let _ = new x(), c = {}, f = "", w = "", C = "%";
const E = (e) => {
  c = e.dir, f = e.user, w = e.host;
}, O = (e) => {
  f = e;
}, s = () => [...m.cwd], g = (e) => {
  m.cwd = e;
}, S = () => f + "@" + w + " " + b() + C + " ", u = (e, t) => {
  if (!t.length)
    return e;
  let n = [...t];
  const r = n.shift();
  return e[r] === void 0 ? -1 : u(e[r], n);
}, T = (e) => {
  let t = !1;
  e[0] === "-l" && (t = !0, e.shift());
  let n = [], r = "", o = [], i = [];
  const y = e.length > 0;
  for (; ; ) {
    o = s(), e.length && e[0].split("/").forEach((l) => {
      o.push(l);
    }), i = u(c, o);
    let h = [];
    if (typeof i == "string") {
      let l = "";
      t && (l += "-r--r----- "), l += e[0], n.push(l);
    } else
      h = Object.entries(i).sort((l, d) => l[0] < d[0] ? -1 : l[0] === d[0] ? 0 : 1).map((l, d) => {
        let a = "";
        const p = typeof l[1] == "string";
        return t && (a += (p ? "-r--r-----" : "dr-xr-x---") + " "), a += p ? l[0] : _.toHtml("\x1B[35m" + l[0] + "\x1B[0m"), a;
      }), h.length && (r += (y > 0 ? e[0] + `:
` : "") + h.join(t ? `
` : " ") + `

`);
    if (e.length > 1)
      e.shift();
    else
      break;
  }
  const j = (n.length ? n.join(t ? `
` : " ") + `

` : "") + r;
  return console.log(n), j;
}, D = () => (console.log(s()), s().reduce((e, t) => (e ? e + "/" : "") + t, "/home/" + f) + `
`), b = () => {
  let e = s();
  return e.length ? e.pop() : "~";
}, F = (e) => {
  if (!e.length)
    return g([]), `
`;
  let t = [...s()];
  if (e[0] === ".." && t.length > 0)
    t.pop();
  else {
    if (e[0] === ".." || e[0] === ".")
      return `
`;
    e[0].split("/").forEach((r) => {
      t.push(r);
    }), console.log(t);
  }
  let n = u(c, t);
  return n === -1 ? `Directory not found.
` : (console.log(n, t), g(t), console.log(s()), `
`);
}, M = async (e) => {
  const t = await fetch(e).then(async (n) => {
    console.log(n);
    let r = await n.text().then((o) => {
      let i = o.replace(/\r?\n/g, "<br/>").replace(/ /g, "&nbsp;");
      return console.log(i), i;
    }).catch((o) => (console.err(o), o));
    return console.log(r), r;
  }).catch((n) => (console.err(n), n));
  return console.log(t), t;
}, P = async (e) => {
  if (!e.length)
    return `Missing filename.
`;
  let t = s();
  if (e[0].split("/").forEach((o) => {
    t.push(o);
  }), u(c, t) === -1)
    return `File not found.
`;
  const n = "/files/" + t.join("/");
  return await M(n).then((o) => (console.log("res=", o), o)).catch((o) => (console.err(o), o)) + `
`;
}, z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cat: P,
  cd: F,
  getPrompt: S,
  getcwd: b,
  ls: T,
  pwd: D,
  setTerminal: E,
  setTerminalUser: O
}, Symbol.toStringTag, { value: "Module" }));
export {
  P as a,
  O as b,
  F as c,
  b as d,
  S as g,
  T as l,
  D as p,
  E as s,
  z as t
};
