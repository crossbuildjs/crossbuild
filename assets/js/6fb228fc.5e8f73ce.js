"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[345],{9031:(e,a,t)=>{const l=t(9901),n=t(7562),r=t(1114),s=t(83),c=t(4251),d=t(3843),m=t(351),i=t(576),u=e=>e&&e.__esModule?e:{default:e},o=u(l),f=u(n),p=u(c);function E(e,a,t){if(!e.match(/api\/([\d.]+)/)&&!e.includes("api/next")&&t&&t.name!==a.version){const a="current"===t.name?"next":t.name;return e.endsWith("/api")?`${e}/${a}`:e.replace("/api/",`/api/${a}/`)}return e}e.exports=function(e){let{options:a,packages:t,history:n}=e;const c=s.useDocsVersion(),u=r.useDocsPreferredVersion(c.pluginId).preferredVersion;return l.useEffect((()=>{1===t.length?n.replace(E(t[0].entryPoints[0].reflection.permalink,c,u)):u&&n.replace(E(n.location.pathname,c,u))}),[t,n,c,u]),o.default.createElement("div",{className:"row"},o.default.createElement("div",{className:"col apiItemCol"},a.banner&&o.default.createElement("div",{className:"alert alert--info margin-bottom--md",role:"alert"},o.default.createElement("div",{dangerouslySetInnerHTML:{__html:a.banner}})),o.default.createElement(i.VersionBanner,null),o.default.createElement("div",{className:"apiItemContainer"},o.default.createElement("article",null,o.default.createElement("div",{className:"markdown"},o.default.createElement("header",null,o.default.createElement(p.default,{as:"h1"},"API")),o.default.createElement("section",{className:"tsd-panel"},o.default.createElement("h3",{className:"tsd-panel-header"},"Packages"),o.default.createElement("div",{className:"tsd-panel-content"},o.default.createElement("ul",{className:"tsd-index-list"},t.map((e=>o.default.createElement("li",{key:e.packageName,className:"tsd-truncate"},o.default.createElement(f.default,{className:"tsd-kind-icon",to:e.entryPoints[0].reflection.permalink},o.default.createElement("span",{className:"tsd-signature-symbol"},"v",e.packageVersion)," ",o.default.createElement("span",null,d.removeScopes(e.packageName,a.scopes)))))))))),o.default.createElement(m.Footer,null)))))}},3843:(e,a)=>{a.removeScopes=function(e,a){return 0===a.length?e:a.reduce(((e,a)=>e.replace(new RegExp(`^(${a}-|@${a}/)`),"")),e)}}}]);