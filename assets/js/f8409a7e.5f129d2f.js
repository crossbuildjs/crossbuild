"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[206],{7522:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>b});var n=r(9901);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},s=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=u(r),f=o,b=p["".concat(l,".").concat(f)]||p[f]||d[f]||i;return r?n.createElement(b,a(a({ref:t},s),{},{components:r})):n.createElement(b,a({ref:t},s))}));function b(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=f;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[p]="string"==typeof e?e:o,a[1]=c;for(var u=2;u<i;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},812:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>u});var n=r(698),o=(r(9901),r(7522));const i={title:"Introduction",sidebar_position:1},a=void 0,c={unversionedId:"intro",id:"intro",title:"Introduction",description:"This guide will teach you how to:",source:"@site/docs/intro.mdx",sourceDirName:".",slug:"/intro",permalink:"/docs/intro",draft:!1,editUrl:"https://github.com/crossbuild/crossbuildjs/tree/main/apps/website/docs/docs/intro.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Introduction",sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Installation",permalink:"/docs/setup/installation"}},l={},u=[{value:"Before you begin",id:"before-you-begin",level:2}],s={toc:u},p="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(p,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This guide will teach you how to:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Install CrossBuild"),(0,o.kt)("li",{parentName:"ul"},"Setup your bot to connect to both Discord and Guilded"),(0,o.kt)("li",{parentName:"ul"},"Create commands"),(0,o.kt)("li",{parentName:"ul"},"Add your own events")),(0,o.kt)("h2",{id:"before-you-begin"},"Before you begin"),(0,o.kt)("p",null,"Before you begin, you'll need to have a basic grasp of Javascript and Node.js. If you don't, we recommend you check out ",(0,o.kt)("a",{parentName:"p",href:"https://javascript.info"},"JavaScript.info")," to learn the basics of Javascript, before attempting to use this package."))}d.isMDXComponent=!0}}]);