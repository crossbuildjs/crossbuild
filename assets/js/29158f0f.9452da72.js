"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[104],{7522:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>f});var r=o(9901);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function l(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function u(e,t){if(null==e)return{};var o,r,n=function(e,t){if(null==e)return{};var o,r,n={},a=Object.keys(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var i=r.createContext({}),s=function(e){var t=r.useContext(i),o=t;return e&&(o="function"==typeof e?e(t):l(l({},t),e)),o},c=function(e){var t=s(e.components);return r.createElement(i.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},b=r.forwardRef((function(e,t){var o=e.components,n=e.mdxType,a=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=s(o),b=n,f=d["".concat(i,".").concat(b)]||d[b]||p[b]||a;return o?r.createElement(f,l(l({ref:t},c),{},{components:o})):r.createElement(f,l({ref:t},c))}));function f(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=o.length,l=new Array(a);l[0]=b;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u[d]="string"==typeof e?e:n,l[1]=u;for(var s=2;s<a;s++)l[s]=o[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,o)}b.displayName="MDXCreateElement"},6896:(e,t,o)=>{o.d(t,{Y:()=>p});var r=o(9901),n=o(6172),a=o(2517),l=o(4388),u=o(3189);function i(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:o,attributes:r,default:n}}=e;return{value:t,label:o,attributes:r,default:n}}))}function s(e){const{values:t,children:o}=e;return(0,r.useMemo)((()=>{const e=t??i(o);return function(e){const t=(0,l.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,o])}function c(e){let{value:t,tabValues:o}=e;return o.some((e=>e.value===t))}function d(e){let{queryString:t=!1,groupId:o}=e;const l=(0,n.k6)(),u=function(e){let{queryString:t=!1,groupId:o}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!o)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return o??null}({queryString:t,groupId:o});return[(0,a._X)(u),(0,r.useCallback)((e=>{if(!u)return;const t=new URLSearchParams(l.location.search);t.set(u,e),l.replace({...l.location,search:t.toString()})}),[u,l])]}function p(e){const{defaultValue:t,queryString:o=!1,groupId:n}=e,a=s(e),[l,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:o}=e;if(0===o.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!c({value:t,tabValues:o}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${o.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=o.find((e=>e.default))??o[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[p,b]=d({queryString:o,groupId:n}),[f,h]=function(e){let{groupId:t}=e;const o=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,a]=(0,u.Nk)(o);return[n,(0,r.useCallback)((e=>{o&&a.set(e)}),[o,a])]}({groupId:n}),m=(()=>{const e=p??f;return c({value:e,tabValues:a})?e:null})();(0,r.useLayoutEffect)((()=>{m&&i(m)}),[m]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!c({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);i(e),b(e),h(e)}),[b,h,a]),tabValues:a}}},1705:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>x,contentTitle:()=>O,default:()=>C,frontMatter:()=>E,metadata:()=>j,toc:()=>N});var r=o(698),n=o(9901),a=o(7522),l=o(4517),u=o(222),i=o(6896),s=o(6520);const c={tabList:"tabList_CLHa",tabItem:"tabItem_czB0"};function d(e){let{className:t,block:o,selectedValue:a,selectValue:i,tabValues:s}=e;const d=[],{blockElementScrollPositionUntilNextRender:p}=(0,u.o5)(),b=e=>{const t=e.currentTarget,o=d.indexOf(t),r=s[o].value;r!==a&&(p(t),i(r))},f=e=>{let t=null;switch(e.key){case"Enter":b(e);break;case"ArrowRight":{const o=d.indexOf(e.currentTarget)+1;t=d[o]??d[0];break}case"ArrowLeft":{const o=d.indexOf(e.currentTarget)-1;t=d[o]??d[d.length-1];break}}t?.focus()};return n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":o},t)},s.map((e=>{let{value:t,label:o,attributes:u}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,key:t,ref:e=>d.push(e),onKeyDown:f,onClick:b},u,{className:(0,l.Z)("tabs__item",c.tabItem,u?.className,{"tabs__item--active":a===t})}),o??t)})))}function p(e){let{lazy:t,children:o,selectedValue:r}=e;const a=(Array.isArray(o)?o:[o]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return n.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function b(e){const t=(0,i.Y)(e);return n.createElement("div",{className:(0,l.Z)("tabs-container",c.tabList)},n.createElement(d,(0,r.Z)({},e,t)),n.createElement(p,(0,r.Z)({},e,t)))}function f(e){const t=(0,s.Z)();return n.createElement(b,(0,r.Z)({key:String(t)},e))}const h={tabItem:"tabItem_xruj"};function m(e){let{children:t,hidden:o,className:r}=e;return n.createElement("div",{role:"tabpanel",className:(0,l.Z)(h.tabItem,r),hidden:o},t)}const y={toc:[{value:"Discord",id:"discord",level:2},{value:"Your bot&#39;s token",id:"your-bots-token",level:3},{value:"Adding your bot to a server",id:"adding-your-bot-to-a-server",level:3}]},v="wrapper";function w(e){let{components:t,...o}=e;return(0,a.kt)(v,(0,r.Z)({},y,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"discord"},"Discord"),(0,a.kt)("p",null,"To create a Discord bot, you'll need to head over to the ",(0,a.kt)("a",{parentName:"p",href:"https://discord.com/developers/applications"},"Discord Developer Portal")," and create a new application by using the New Application button in the top left. Give your application a name and click Create."),(0,a.kt)("p",null,"You should now see a page that shows information about your bot. You can add an avatar and bio for your bot here. Once you've saved your changes, click on the Bot tab on the left panel."),(0,a.kt)("h3",{id:"your-bots-token"},"Your bot's token"),(0,a.kt)("p",null,"After you open the bot tab, you should see a blue button that says Reset Token. Click on it and confirm that you want to reset your bot's token. You should now see a new section called Token with a button that says Copy. When we ask you to paste your bot's token somewhere, this is the value that you need to put in."),(0,a.kt)("p",null,"Tokens are in the format similar to this one: ",(0,a.kt)("inlineCode",{parentName:"p"},"MTA4NjEwNTYxMDUxMDE1NTg1Nw.GNt-U8.OSHy-g-5FlfESnu3Z9MEEMJLHiRthXajiXNwiE"),". If you accidentally leak your bot's token or lose it, you need to come back to this page and reset your bot's token again which will reveal the new token, invalidating all old ones."),(0,a.kt)("h3",{id:"adding-your-bot-to-a-server"},"Adding your bot to a server"),(0,a.kt)("p",null,"To add your bot to a server, you'll need to go to the OAuth2 tab on the left panel. Under the OAuth2 URL Generator section, select the bot scope and administrator permissions. Copy the generated URL and paste it into your browser. You should see a page that allows you to select a server to add your bot to. Select a server and click Authorize."),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"Gif here soon")))}w.isMDXComponent=!0;const g={toc:[{value:"Guilded",id:"guilded",level:2}]},k="wrapper";function T(e){let{components:t,...o}=e;return(0,a.kt)(k,(0,r.Z)({},g,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"guilded"},"Guilded"),(0,a.kt)("p",null,"Codeize is gonna write this part cause I have no fucking clue"),(0,a.kt)("p",null,"so ttue"),(0,a.kt)("p",null,"wedfuohwefuohefwujihwerfhuiqwdefedhuoqwqwedfhuiohio"),(0,a.kt)("p",null,"vrooom broooom browerfujniowerfhujniowefbjnkpwerfgophjwerfgnkertgh juiopw4th uw34r ioq23r jioqwer uioqwe uiowert jio"))}T.isMDXComponent=!0;const E={title:"Bot Applications",sidebar_position:2},O=void 0,j={unversionedId:"setup/bot-applications",id:"setup/bot-applications",title:"Bot Applications",description:"Now that you've installed Node.js and CrossBuild, you're almost ready to start coding! Next, we need to setup the actual bot applications that your users will be interacting with.",source:"@site/docs/setup/bot-applications.mdx",sourceDirName:"setup",slug:"/setup/bot-applications",permalink:"/docs/setup/bot-applications",draft:!1,editUrl:"https://github.com/crossbuild/crossbuildjs/tree/main/apps/website/docs/docs/setup/bot-applications.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Bot Applications",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Installation",permalink:"/docs/setup/installation"},next:{title:"File Structure",permalink:"/docs/setup/file-structure"}},x={},N=[],D={toc:N},I="wrapper";function C(e){let{components:t,...o}=e;return(0,a.kt)(I,(0,r.Z)({},D,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Now that you've installed Node.js and CrossBuild, you're almost ready to start coding! Next, we need to setup the actual bot applications that your users will be interacting with."),(0,a.kt)(f,{mdxType:"Tabs"},(0,a.kt)(m,{value:"discord",label:"Discord",default:!0,mdxType:"TabItem"},(0,a.kt)(w,{mdxType:"Discord"})),(0,a.kt)(m,{value:"guilded",label:"Guilded",mdxType:"TabItem"},(0,a.kt)(T,{mdxType:"Guilded"}))))}C.isMDXComponent=!0}}]);