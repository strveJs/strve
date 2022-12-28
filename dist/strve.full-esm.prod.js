/*!
 * Strve.js v4.7.0
 * (c) 2021-2022 maomincoding
 * Released under the MIT License.
 */
const e=l("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot"),t=l("svg,animate,circle,clippath,cursor,image,defs,desc,ellipse,filter,font-faceforeignobject,g,glyph,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feFlood,feGaussianBlur,feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight,linearGradient,stop,radialGradient,animateTransform,animateMotion");function n(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)}function r(e){return-1!==["object","array","function","regexp","date","math"].indexOf(o(e))}function o(e){return Object.prototype.toString.call(e).match(/\[object (.+?)\]/)[1].toLowerCase()}function l(e){const t=Object.create(null),n=e.split(",");for(let e=0;e<n.length;e++)t[n[e]]=!0;return function(e){return t[e]}}function i(e){if(e.hasOwnProperty("tag")&&e.hasOwnProperty("props")&&e.hasOwnProperty("children"))return!0}function s(e){if("array"===o(e)){for(let t=0;t<e.length;t++)if(i(e[t]))return!0}else if("object"===o(e))return i(e)}l("function,regexp,date,math,undefined,null,boolean,string,number,symbol,bigInt");const a=e=>("object"==typeof e||"function"==typeof e)&&null!==e;function c(e,t){if(!a(e)||!a(t))return e===t;if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(const n in e){if(!c(e[n],t[n]))return!1}return!0}const u={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},p="http://www.w3.org/1999/xlink";function f(e,t){for(let n in t)e.style[n]=t[n]}function d(e,t,r){var o;if(n(t)?e.removeAttributeNS(p,n(o=t)?o.slice(6,o.length):""):e.removeAttribute(t),t.startsWith("on")){const n=t.split("on")[1][0].toLowerCase()+t.split("on")[1].substring(1);e.removeEventListener(n,r[t])}}function h(n){return e(n)?document.createElement(n):t(n)?(r=function(e){return t(e)?"svg":"math"===e?"math":void 0}(n),o=n,document.createElementNS(u[r],o)):"fragment"===n||"component"===n?document.createDocumentFragment():"comment"===n||"null"===n?document.createComment(n):-1!==n.indexOf("-")?document.createElement(n):void 0;var r,o}function m(e){return e.tag?e:function(e){return{tag:"fragment",props:null,children:e}}(e)}function g(e){class t extends HTMLElement{constructor(){if(super(),e.template&&e.id){const t=document.createElement("template");t.setAttribute("id",e.id),t.innerHTML=e.template;const n=this.attachShadow({mode:"open"}),r=t.content.cloneNode(!0);if(e.styles&&Array.isArray(e.styles)){const t=document.createElement("style");t.textContent=e.styles.join(""),r.appendChild(t)}n.appendChild(r)}}connectedCallback(){const t=arguments;e.lifetimes&&e.lifetimes.connectedCallback(t)}disconnectedCallback(){const t=arguments;e.lifetimes&&e.lifetimes.disconnectedCallback(t)}adoptedCallback(){const t=arguments;e.lifetimes&&e.lifetimes.adoptedCallback(t)}attributeChangedCallback(){const t=arguments;e.lifetimes&&e.lifetimes.attributeChangedCallback(t)}}return t}const b=Object.create(null),y=new WeakMap,w=["$key","$name","$props"];let v="";const C=Object.create(null);let O=function e(t={}){if("object"!=typeof t||null===t)return t;const n={get(t,n,r){if(Reflect.ownKeys(t).includes(n)){const o=Reflect.get(t,n,r);return e(o)}},set(e,t,n,r){if(n===e[t])return!0;if(Reflect.ownKeys(e).includes(t)||Object.keys(b).includes(t)){return Reflect.set(e,t,n,r)}},deleteProperty:(e,t)=>Reflect.deleteProperty(e,t)};return new Proxy(t,n)}(Object.create(null));function j(e,t,r){if(e.tag){const l=h(e.tag);if(e.props){!function(e,t){for(let n=0;n<Object.keys(t).length;n++){const r=Object.keys(t)[n].toString();if(r.startsWith("on")){const n=r.split("on")[1][0].toLowerCase()+r.split("on")[1].substring(1);e.addEventListener(n,t[r])}}}(l,e.props),e.props.hasOwnProperty(w[0])&&(e.el=l,"string"===o(e.props[w[0]])&&(C[e.props[w[0]]]=l)),e.props.hasOwnProperty(w[1])&&(b[e.props[w[1]]]=Object.create(null),y.set(b[e.props[w[1]]],e.children[0])),e.props.hasOwnProperty(w[1])&&e.props.hasOwnProperty(w[2])&&(O[e.props[w[1]]]=e.props[w[2]]);for(const t in e.props)e.props.hasOwnProperty(t)&&("function"!==o(e.props[t])&&(n(t)?l.setAttributeNS(p,t,e.props[t]):w.includes(t)||l.setAttribute(t,e.props[t])),"object"===o(e.props[t])&&f(l,e.props[t]))}if(e.children){x(e.children,l,(function(){"array"===o(e.children[0])?e.children[0].forEach((e=>{i(e)&&j(e,l)})):"array"===o(e.children)&&e.children.forEach((e=>{i(e)&&j(e,l)}))}))}r?t.insertBefore(l,r):t.appendChild(l)}}function k(e,t,r){const l=e.props||{};if(l.hasOwnProperty(w[0])&&e.tag!==t.tag){const n=e.el.parentNode,r=e.el.nextSibling;n.removeChild(e.el),j(t,n,r)}else{let i=null;if(l.hasOwnProperty(w[0])){const r=t.props||{};i=t.el=e.el;for(const e in r){let[t,s]=[r[e],l[e]];if(t!==s)if(null!==t)if("function"===o(t)||w.includes(e)){if(e.startsWith("on")){const n=e.split("on")[1][0].toLowerCase()+e.split("on")[1].substring(1);i.addEventListener(n,t,!1)}}else i[e]&&(i[e]=t),n(e)?i.setAttributeNS(p,e,t):i.setAttribute(e,t),"object"===o(t)&&f(i,t);else d(i,e,l)}for(const e in l)e in r||d(i,e,l)}const s=e.children[0],a=t.children[0],u=e.children,h=t.children;if(!c(u,h)){x(h,i,(function(){"array"!==o(s)&&"array"===o(a)?(i.innerHTML="",a.forEach((e=>j(e,i)))):"array"===o(s)&&"array"===o(a)?M(s,a,i,r):M(u,h,i,r)}))}}}function M(e,t,n,r){if("useFirstKey"===r)for(let o=1;o<=Math.max(e.length,t.length);o++)e[e.length-o]?t[t.length-o]?k(e[e.length-o],t[t.length-o],r):n.removeChild(e[e.length-o].el):j(t[t.length-o],e[e.length-1].el.parentNode,e[0].el);else{for(let n=0;n<Math.min(e.length,t.length);n++)k(e[n],t[n],r);t.length>e.length?t.slice(e.length).forEach((e=>j(e,n))):e.length>t.length&&e.slice(t.length).forEach((e=>{n.removeChild(e.el)}))}}function x(e,t,n){1!==e.length||r(e[0])?e.length>1&&!s(e)?t&&S(e.join().replace(/,/g,""),t):!r(e[0])||e[0].tag||s(e[0])?n():t&&S(e[0],t):t&&S(e,t)}function S(e,t){r(e)?"function"===o(e)||"regexp"===o(e)||"array"===o(e)?t.textContent=String(e):t.textContent=JSON.stringify(e,null,2):t.textContent=e?e.toString():String(e)}let E=null;function L(e){E=e}let P=null;function T(e){P=e}let A=null;function _(e){A=e}function R(e,t,n,r){if(H.isMounted){const t=m(e);k(H.oldTree,t,n),H.oldTree=t,r&&y.set(b[r],e)}else{const n=m(e);j(n,t),H.oldTree=n,H.isMounted=!0,E&&E()}}function N(e,t){if("function"===o(e)&&"undefined"!==o(Promise))return Promise.resolve().then((()=>{e()})).then((()=>{if(t&&"useRouter"===t.status)P&&P(),H._el.innerHTML="",P=null,j(H.oldTree=H._template(),H._el),E&&E();else if(t&&"function"==typeof t.name){const e=t.name.name,n=t.name();v!==e&&(v=e,H.oldTree=m(y.get(b[e]))),R(n,H._el,t.status,e)}else{const e=t&&t.status?t.status:null;R(H._template(),H._el,e)}A&&A()})).catch((e=>console.error(e)))}const W="4.7.0",H={_el:null,_template:null,oldTree:null,isMounted:!1,observer:null};function $(e){if("string"==typeof e){const t=document.querySelector(e);if(!t){let t=null;return e.startsWith("#")?(t=document.createElement("div"),t.setAttribute("id",e.substring(1,e.length))):e.startsWith(".")?(t=document.createElement("div"),t.setAttribute("class",e.substring(1,e.length))):console.warn(`[Strve warn]: Failed to mount app: mount target selector "${e}" returned null.`),document.body.insertAdjacentElement("afterbegin",t),t}return t}return e instanceof HTMLElement?e:window.ShadowRoot&&e instanceof window.ShadowRoot&&"closed"===e.mode?(console.warn('[Strve warn]: mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs.'),null):null}function D(e){return{mount(t){if($(t)){const n=e();H._template=e,H._el=$(t),H._el&&R(n,H._el)}else console.warn("[Strve warn]: There must be a mount element node.")}}}const F=(e,t,n,r)=>{let o;t[0]=0;for(let l=1;l<t.length;l++){const i=t[l++],s=t[l]?(t[0]|=i?1:2,n[t[l++]]):t[++l];3===i?r[0]=s:4===i?r[1]=Object.assign(r[1]||{},s):5===i?(r[1]=r[1]||{})[t[++l]]=s:6===i?r[1][t[++l]]+=s+"":i?(o=e.apply(s,F(e,s,n,["",null])),r.push(o),s[0]?t[0]|=2:(t[l-2]=0,t[l]=o)):r.push(s)}return r},q=function(e){let t,n,r=1,o="",l="",i=[0];const s=e=>{1===r&&(e||(o=o.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?i.push(0,e,o):3===r&&(e||o)?(i.push(3,e,o),r=2):2===r&&"..."===o&&e?i.push(4,e,0):2===r&&o&&!e?i.push(5,0,!0,o):r>=5&&((o||!e&&5===r)&&(i.push(r,0,o,n),r=6),e&&(i.push(r,e,0,n),r=6)),o=""};for(let a=0;a<e.length;a++){a&&(1===r&&s(),s(a));for(let c=0;c<e[a].length;c++)t=e[a][c],1===r?"<"===t?(s(),i=[i],r=3):o+=t:4===r?"--"===o&&">"===t?(r=1,o=""):o=t+o[0]:l?t===l?l="":o+=t:'"'===t||"'"===t?l=t:">"===t?(s(),r=1):r&&("="===t?(r=5,n=o,o=""):"/"===t&&(r<5||">"===e[a][c+1])?(s(),3===r&&(i=i[0]),r=i,(i=i[0]).push(2,0,r),r=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(s(),r=2):o+=t),3===r&&"!--"===o&&(r=4,i=i[0])}return s(),i},B=new Map,G=function(e){let t=B.get(this);return t||(t=new Map,B.set(this,t)),t=F(this,t.get(e)||(t.set(e,t=q(e)),t),arguments,[]),t.length>1?t:t[0]}.bind((function(e,t,...n){return{tag:e,props:t,children:n}}));export{D as createApp,g as defineCustomElement,C as domInfo,G as h,_ as nextTick,L as onMounted,T as onUnmounted,O as propsData,N as setData,W as version};