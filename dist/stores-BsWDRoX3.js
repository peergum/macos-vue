import D from "react";
var ne = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function z(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function oe(e) {
  if (e.__esModule)
    return e;
  var r = e.default;
  if (typeof r == "function") {
    var n = function c() {
      return this instanceof c ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    n.prototype = r.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(c) {
    var f = Object.getOwnPropertyDescriptor(e, c);
    Object.defineProperty(n, c, f.get ? f : {
      enumerable: !0,
      get: function() {
        return e[c];
      }
    });
  }), n;
}
var $ = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 };
const I = (e) => {
  let r;
  const n = /* @__PURE__ */ new Set(), c = (a, i) => {
    const s = typeof a == "function" ? a(r) : a;
    if (!Object.is(s, r)) {
      const t = r;
      r = i ?? (typeof s != "object" || s === null) ? s : Object.assign({}, r, s), n.forEach((o) => o(r, t));
    }
  }, f = () => r, v = { setState: c, getState: f, getInitialState: () => l, subscribe: (a) => (n.add(a), () => n.delete(a)), destroy: () => {
    ($ ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, l = r = e(c, f, v);
  return v;
}, x = (e) => e ? I(e) : I;
var j = { exports: {} }, T = {}, R = { exports: {} }, w = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var C;
function q() {
  if (C)
    return w;
  C = 1;
  var e = D;
  function r(i, s) {
    return i === s && (i !== 0 || 1 / i === 1 / s) || i !== i && s !== s;
  }
  var n = typeof Object.is == "function" ? Object.is : r, c = e.useState, f = e.useEffect, E = e.useLayoutEffect, b = e.useDebugValue;
  function h(i, s) {
    var t = s(), o = c({ inst: { value: t, getSnapshot: s } }), u = o[0].inst, d = o[1];
    return E(
      function() {
        u.value = t, u.getSnapshot = s, v(u) && d({ inst: u });
      },
      [i, t, s]
    ), f(
      function() {
        return v(u) && d({ inst: u }), i(function() {
          v(u) && d({ inst: u });
        });
      },
      [i]
    ), b(t), t;
  }
  function v(i) {
    var s = i.getSnapshot;
    i = i.value;
    try {
      var t = s();
      return !n(i, t);
    } catch {
      return !0;
    }
  }
  function l(i, s) {
    return s();
  }
  var a = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : h;
  return w.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : a, w;
}
var A = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var M;
function F() {
  return M || (M = 1, process.env.NODE_ENV !== "production" && function() {
    function e(t, o) {
      return t === o && (t !== 0 || 1 / t === 1 / o) || t !== t && o !== o;
    }
    function r(t, o) {
      a || f.startTransition === void 0 || (a = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var u = o();
      if (!i) {
        var d = o();
        E(u, d) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), i = !0);
      }
      d = b({
        inst: { value: u, getSnapshot: o }
      });
      var S = d[0].inst, O = d[1];
      return v(
        function() {
          S.value = u, S.getSnapshot = o, n(S) && O({ inst: S });
        },
        [t, u, o]
      ), h(
        function() {
          return n(S) && O({ inst: S }), t(function() {
            n(S) && O({ inst: S });
          });
        },
        [t]
      ), l(u), u;
    }
    function n(t) {
      var o = t.getSnapshot;
      t = t.value;
      try {
        var u = o();
        return !E(t, u);
      } catch {
        return !0;
      }
    }
    function c(t, o) {
      return o();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var f = D, E = typeof Object.is == "function" ? Object.is : e, b = f.useState, h = f.useEffect, v = f.useLayoutEffect, l = f.useDebugValue, a = !1, i = !1, s = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : r;
    A.useSyncExternalStore = f.useSyncExternalStore !== void 0 ? f.useSyncExternalStore : s, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), A;
}
var G;
function N() {
  return G || (G = 1, process.env.NODE_ENV === "production" ? R.exports = q() : R.exports = F()), R.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var B;
function k() {
  if (B)
    return T;
  B = 1;
  var e = D, r = N();
  function n(l, a) {
    return l === a && (l !== 0 || 1 / l === 1 / a) || l !== l && a !== a;
  }
  var c = typeof Object.is == "function" ? Object.is : n, f = r.useSyncExternalStore, E = e.useRef, b = e.useEffect, h = e.useMemo, v = e.useDebugValue;
  return T.useSyncExternalStoreWithSelector = function(l, a, i, s, t) {
    var o = E(null);
    if (o.current === null) {
      var u = { hasValue: !1, value: null };
      o.current = u;
    } else
      u = o.current;
    o = h(
      function() {
        function S(_) {
          if (!O) {
            if (O = !0, m = _, _ = s(_), t !== void 0 && u.hasValue) {
              var p = u.value;
              if (t(p, _))
                return y = p;
            }
            return y = _;
          }
          if (p = y, c(m, _))
            return p;
          var L = s(_);
          return t !== void 0 && t(p, L) ? (m = _, p) : (m = _, y = L);
        }
        var O = !1, m, y, g = i === void 0 ? null : i;
        return [
          function() {
            return S(a());
          },
          g === null ? void 0 : function() {
            return S(g());
          }
        ];
      },
      [a, i, s, t]
    );
    var d = f(l, o[0], o[1]);
    return b(
      function() {
        u.hasValue = !0, u.value = d;
      },
      [d]
    ), v(d), d;
  }, T;
}
var V = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var W;
function J() {
  return W || (W = 1, process.env.NODE_ENV !== "production" && function() {
    function e(l, a) {
      return l === a && (l !== 0 || 1 / l === 1 / a) || l !== l && a !== a;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var r = D, n = N(), c = typeof Object.is == "function" ? Object.is : e, f = n.useSyncExternalStore, E = r.useRef, b = r.useEffect, h = r.useMemo, v = r.useDebugValue;
    V.useSyncExternalStoreWithSelector = function(l, a, i, s, t) {
      var o = E(null);
      if (o.current === null) {
        var u = { hasValue: !1, value: null };
        o.current = u;
      } else
        u = o.current;
      o = h(
        function() {
          function S(_) {
            if (!O) {
              if (O = !0, m = _, _ = s(_), t !== void 0 && u.hasValue) {
                var p = u.value;
                if (t(p, _))
                  return y = p;
              }
              return y = _;
            }
            if (p = y, c(m, _))
              return p;
            var L = s(_);
            return t !== void 0 && t(p, L) ? (m = _, p) : (m = _, y = L);
          }
          var O = !1, m, y, g = i === void 0 ? null : i;
          return [
            function() {
              return S(a());
            },
            g === null ? void 0 : function() {
              return S(g());
            }
          ];
        },
        [a, i, s, t]
      );
      var d = f(l, o[0], o[1]);
      return b(
        function() {
          u.hasValue = !0, u.value = d;
        },
        [d]
      ), v(d), d;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), V;
}
process.env.NODE_ENV === "production" ? j.exports = k() : j.exports = J();
var Y = j.exports;
const Q = /* @__PURE__ */ z(Y);
var U = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 };
const { useDebugValue: X } = D, { useSyncExternalStoreWithSelector: Z } = Q;
let H = !1;
const ee = (e) => e;
function te(e, r = ee, n) {
  (U ? "production" : void 0) !== "production" && n && !H && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), H = !0);
  const c = Z(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    r,
    n
  );
  return X(c), c;
}
const K = (e) => {
  (U ? "production" : void 0) !== "production" && typeof e != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const r = typeof e == "function" ? x(e) : e, n = (c, f) => te(r, c, f);
  return Object.assign(n, r), n;
}, P = (e) => e ? K(e) : K, ue = P((e, r) => ({
  terminals: {},
  data: JSON.parse(localStorage.getItem("data") || "{}"),
  focused: 0,
  setFocused: (n) => e({ focused: n }),
  setTerminal: (n, c) => e((f) => ({
    terminals: { ...f.terminals, [n]: c }
  })),
  setData: (n, c) => e((f) => ({
    data: { ...f.data, [n]: c }
  })),
  saveData: () => {
    const n = r();
    localStorage.setItem("data", JSON.stringify(n.data));
  }
})), ie = P((e) => ({
  close: !1,
  closed: !0,
  setClose: (r) => e({ close: r }),
  setClosed: (r) => e({ closed: r })
}));
export {
  ue as a,
  oe as b,
  ne as c,
  z as g,
  ie as u
};
