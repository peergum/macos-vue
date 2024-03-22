"use strict";const q=require("ansi-to-html"),b=require("./macos-vue.cjs2.js");let C=new q,i={},s="",j="",D="%";const y=e=>{i=e.dir,s=e.user,j=e.host},T=e=>{s=e},o=()=>[...b.windowStore.cwd],g=e=>{b.windowStore.cwd=e},a=()=>s+"@"+j+" "+m()+D+" ",c=(e,t)=>{if(!t.length)return e;let r=[...t];const l=r.shift();return e[l]===void 0?-1:c(e[l],r)},x=e=>{let t=!1;e[0]==="-l"&&(t=!0,e.shift());let r=[],l="",f=[],u=[];const O=e.length>0;for(;;){f=o(),e.length&&e[0].split("/").forEach(n=>{f.push(n)}),u=c(i,f);let d=[];if(typeof u=="string"){let n="";t&&(n+="-r--r----- "),n+=e[0],r.push(n)}else d=Object.entries(u).sort((n,h)=>n[0]<h[0]?-1:n[0]===h[0]?0:1).map((n,h)=>{let p="";const w=typeof n[1]=="string";return t&&(p+=(w?"-r--r-----":"dr-xr-x---")+" "),p+=w?n[0]:C.toHtml("\x1B[35m"+n[0]+"\x1B[0m"),p}),d.length&&(l+=(O>0?e[0]+`:
`:"")+d.join(t?`
`:" ")+`

`);if(e.length>1)e.shift();else break}const P=(r.length?r.join(t?`
`:" ")+`

`:"")+l;return console.log(r),P},S=()=>(console.log(o()),o().reduce((e,t)=>(e?e+"/":"")+t,"/home/"+s)+`
`),m=()=>{let e=o();return e.length?e.pop():"~"},_=e=>{if(!e.length)return g([]),`
`;let t=[...o()];if(e[0]===".."&&t.length>0)t.pop();else{if(e[0]===".."||e[0]===".")return`
`;e[0].split("/").forEach(l=>{t.push(l)}),console.log(t)}let r=c(i,t);return r===-1?`Directory not found.
`:(console.log(r,t),g(t),console.log(o()),`
`)},E=e=>{if(e===void 0)return`Missing filename.
`;let t=o();return e.split("/").forEach(l=>{t.push(l)}),c(i,t)===-1?`File not found.
`:"./src/files/"+t.join("/")+`
`},F=Object.freeze(Object.defineProperty({__proto__:null,cat:E,cd:_,getPrompt:a,getcwd:m,ls:x,pwd:S,setTerminal:y,setTerminalUser:T},Symbol.toStringTag,{value:"Module"}));exports.cat=E;exports.cd=_;exports.getPrompt=a;exports.getcwd=m;exports.ls=x;exports.pwd=S;exports.setTerminal=y;exports.setTerminalUser=T;exports.terminal=F;
