var m=Object.defineProperty;var y=(i,t)=>{for(var s in t)m(i,s,{get:t[s],enumerable:!0})};var h=class{static _getAttributes(t){return[...t.attributes].map(s=>s.name)}static _getNodeType(t){return t.nodeType===3?"text":t.nodeType===8?"comment":t.nodeType===11?"fragment":t.tagName.toLowerCase()}static _getNodeContent(t){return t.childNodes&&t.childNodes.length>0?null:t.textContent}static update(t,s){if(this._getNodeType(t)==="text"||this._getNodeType(s)==="text")return;let o=[...new Set([...h._getAttributes(t),...h._getAttributes(s)])],n=(e,r)=>{e.startsWith("on")?s[e.toLowerCase()]=r:s.setAttributeNS(null,e,r)},c=e=>{e.startsWith("on")?s[e.toLowerCase()]=()=>{}:s.removeAttribute(e)};for(let e of o){let r=t.getAttribute(e),a=s.getAttribute(e);!a||a!==r?n(e,r):r||c(e)}}static diff(t,s){let o=[...s.childNodes],n=[...t.childNodes];if(this._getNodeType(t)!==this._getNodeType(s)){s.replaceWith(t);return}let c=o.length-n.length;if(c>0)for(let e=c;e>0;e--)o[o.length-c].remove();n.forEach((e,r)=>{if(!o[r]){s.appendChild(e);return}if(this._getNodeType(e)!==this._getNodeType(o[r])){o[r].replaceWith(e);return}h.update(e,o[r]);let a=this._getNodeContent(e);if(a&&a!==this._getNodeContent(o[r])&&(o[r].textContent=a),o[r].childNodes.length>0&&e.childNodes.length<1){o[r].innerHTML="";return}if(o[r].childNodes.length<1&&e.childNodes.length>0){let f=document.createDocumentFragment();this.diff(e,f),o[r].appendChild(f);return}e.childNodes.length>0&&this.diff(e,o[r])})}};var u=class{subscriptions=[];initialState={};state={};reducer=()=>{};constructor(t={},s=()=>{}){this.initialState=t,this.state=this.createStore(this.initialState),this.reducer=s}dispatch(t){let s=this.reducer(this.state,t);Object.assign(this.state,s)}getState(){return this.state}addSubscription(t){this.subscriptions.push(t)}getEventListeners(t){return this.eventListeners.filter(s=>s.name===t).map(s=>s.cb)}createStore(t){let s={set:(n,c,e)=>(n[c]=o(e),this.subscriptions.forEach(r=>r()),!0)},o=(n={})=>{if(Array.isArray(n))for(let e=0;e<n.length;e++)n[e]=o(n);else for(let[e,r]of Object.entries(n))n[e]=o(r);return(typeof n=="object"||Array.isArray(n))&&n!==null?new Proxy(n,s):n};return o(t)}};var p={};y(p,{$:()=>C,$$:()=>x,isFunction:()=>d,jsh:()=>N});var g=i=>{let t="";for(let s of i){let o=s.toLowerCase();t+=o===s?s:`-${o}`}return t.toLowerCase()},_=(i,t={},s=[])=>{let o=i==="fragment",n=o?document.createDocumentFragment():document.createElement(i);if(!o)for(let[e,r]of Object.entries(t))e.startsWith("on")?n[e.toLowerCase()]=r:n.setAttribute(e,r);let c=s.flat(1/0).filter(e=>e);for(let e of c)typeof e=="string"?n.appendChild(document.createTextNode(e)):n.appendChild(e);return n},N=new Proxy({},{get:(i,t)=>(s,...o)=>_(g(t),s,o)}),C=(i,t)=>i&&t?i.querySelector(t):document.body.querySelector(i),x=(i,t)=>[...i&&t?i.querySelectorAll(t):document.body.querySelectorAll(i)],d=i=>i&&typeof i=="function";var l=class extends HTMLElement{props={};state={};store={};style="";constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open"})}static define(t,s){customElements.define(t,s)}render(){}mount(){}unmount(){}_createStore(){return this.store=this.store instanceof u?this.store:new u(this.store),this.store.addSubscription(()=>{this._updateDOM()}),this.store}connectedCallback(){d(this.mount)&&(this._internalMount(),this.mount())}disconnectedCallback(){d(this.unmount)&&this.unmount()}_internalMount(){this.props=this._createProps(),this.state=this._createStore(),this._updateDOM(!0),this._trackMutations()}_trackMutations(){new MutationObserver(()=>{this._createProps(),this._updateDOM()}).observe(this,{attributes:!0,childList:!0,subtree:!0})}_createProps(){let t={};for(let s of this.getAttributeNames())t[s]=this.getAttribute(s);return t.children=[...this.childNodes],t}_updateDOM(t){if(t)this.shadowRoot.appendChild(this.render());else{let s=this.render(),o=h._getNodeType(s)==="fragment";h.diff(s,o?this.shadowRoot:this.shadowRoot.firstChild)}this._updateStyles()}_updateStyles(){this._styleElement&&(this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement));let t=d(this.style)?this.style():this.style;t&&t!==this._styleElement.textContent&&(this._styleElement.textContent=t)}};export{u as ZeroStore,p as ZeroUtils,l as default};