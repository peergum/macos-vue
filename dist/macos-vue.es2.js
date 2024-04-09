import { reactive as t } from "vue";
const a = () => {
  localStorage.setItem("data", JSON.stringify(o.data)), console.log(o.data);
}, o = t({
  terminal: {},
  data: {},
  focused: 0
}), r = t({
  close: !1,
  closed: !0
});
export {
  r as menuStore,
  a as windowSave,
  o as windowStore
};
