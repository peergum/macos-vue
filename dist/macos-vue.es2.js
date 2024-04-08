import { reactive as o } from "vue";
const a = () => {
  localStorage.setItem("data", JSON.stringify(t.data)), console.log(t.data);
}, t = o({
  terminal: {},
  data: {}
}), r = o({
  close: !1,
  closed: !0
});
export {
  r as menuStore,
  a as windowSave,
  t as windowStore
};
