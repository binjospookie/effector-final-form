"use strict";(globalThis.webpackChunkwebsite=globalThis.webpackChunkwebsite||[]).push([[930],{9613:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(9496);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),f=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=f(e.components);return n.createElement(c.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),s=f(r),m=a,d=s["".concat(c,".").concat(m)]||s[m]||u[m]||o;return r?n.createElement(d,l(l({ref:t},p),{},{components:r})):n.createElement(d,l({ref:t},p))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[s]="string"==typeof e?e:a,l[1]=i;for(var f=2;f<o;f++)l[f]=r[f];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},6882:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>f});var n=r(1163),a=(r(9496),r(9613));r(4063);const o={title:"Installation"},l=void 0,i={unversionedId:"docs/installation",id:"docs/installation",title:"Installation",description:"You need to have installed effector and final-form packages",source:"@site/docs/installation.mdx",sourceDirName:"docs",slug:"/docs/installation",permalink:"/effector-final-form/docs/installation",draft:!1,tags:[],version:"current",frontMatter:{title:"Installation"}},c={},f=[{value:"Usage",id:"usage",level:2}],p={toc:f},s="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(s,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("admonition",{title:"Be careful",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"You need to have installed ",(0,a.kt)("a",{parentName:"p",href:"https://effector.dev/"},"effector")," and ",(0,a.kt)("a",{parentName:"p",href:"https://final-form.org/"},"final-form")," packages")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add effector-final-form\n# or\nnpm add effector-final-form\n# or\npnpm add effector-final-form\n")),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"Just import from the root module:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createForm } from 'effector-final-form';\n")))}u.isMDXComponent=!0},4063:(e,t,r)=>{r(9496)}}]);