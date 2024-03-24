"use strict";const P=require("ansi-to-html"),m=require("./macos-vue.cjs2.js");let q=new P,c={},u="",b="",D="%";const y=e=>{c=e.dir,u=e.user,b=e.host},j=e=>{u=e},s=()=>[...m.windowStore.cwd],w=e=>{m.windowStore.cwd=e},x=()=>u+"@"+b+" "+a()+D+" ",f=(e,t)=>{if(!t.length)return e;let n=[...t];const l=n.shift();return e[l]===void 0?-1:f(e[l],n)},T=e=>{let t=!1;e[0]==="-l"&&(t=!0,e.shift());let n=[],l="",o=[],i=[];const E=e.length>0;for(;;){o=s(),e.length&&e[0].split("/").forEach(r=>{o.push(r)}),i=f(c,o);let h=[];if(typeof i=="string"){let r="";t&&(r+="-r--r----- "),r+=e[0],n.push(r)}else h=Object.entries(i).sort((r,d)=>r[0]<d[0]?-1:r[0]===d[0]?0:1).map((r,d)=>{let p="";const g=typeof r[1]=="string";return t&&(p+=(g?"-r--r-----":"dr-xr-x---")+" "),p+=g?r[0]:q.toHtml("\x1B[35m"+r[0]+"\x1B[0m"),p}),h.length&&(l+=(E>0?e[0]+`:
`:"")+h.join(t?`
`:" ")+`

`);if(e.length>1)e.shift();else break}const O=(n.length?n.join(t?`
`:" ")+`

`:"")+l;return console.log(n),O},S=()=>(console.log(s()),s().reduce((e,t)=>(e?e+"/":"")+t,"/home/"+u)+`
`),a=()=>{let e=s();return e.length?e.pop():"~"},_=e=>{if(!e.length)return w([]),`
`;let t=[...s()];if(e[0]===".."&&t.length>0)t.pop();else{if(e[0]===".."||e[0]===".")return`
`;e[0].split("/").forEach(l=>{t.push(l)}),console.log(t)}let n=f(c,t);return n===-1?`Directory not found.
`:(console.log(n,t),w(t),console.log(s()),`
`)},F=async e=>{const t=await fetch(e).then(async n=>{console.log(n);let l=await n.text().then(o=>{let i=o.replace(/\r?\n/g,"<br/>").replace(/ /g,"&nbsp;");return console.log(i),i}).catch(o=>(console.err(o),o));return console.log(l),l}).catch(n=>(console.err(n),n));return console.log(t),t},C=async e=>{if(!e.length)return`Missing filename.
`;let t=s();if(e[0].split("/").forEach(o=>{t.push(o)}),f(c,t)===-1)return`File not found.
`;const n="/files/"+t.join("/");return await F(n).then(o=>(console.log("res=",o),o)).catch(o=>(console.err(o),o))+`
`},M=Object.freeze(Object.defineProperty({__proto__:null,cat:C,cd:_,getPrompt:x,getcwd:a,ls:T,pwd:S,setTerminal:y,setTerminalUser:j},Symbol.toStringTag,{value:"Module"}));exports.cat=C;exports.cd=_;exports.getPrompt=x;exports.getcwd=a;exports.ls=T;exports.pwd=S;exports.setTerminal=y;exports.setTerminalUser=j;exports.terminal=M;
