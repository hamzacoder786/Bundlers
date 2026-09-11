const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/cross-chain-relay-BqsCvfte.js","assets/index.browser.esm-YdP9aFGL.js","assets/provider-jsonrpc-D-gqrPu_.js"])))=>i.map(i=>d[i]);
var Oo=Object.defineProperty;var Va=e=>{throw TypeError(e)};var Wo=(e,t,n)=>t in e?Oo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var ne=(e,t,n)=>Wo(e,typeof t!="symbol"?t+"":t,n),aa=(e,t,n)=>t.has(e)||Va("Cannot "+n);var Ae=(e,t,n)=>(aa(e,t,"read from private field"),n?n.call(e):t.get(e)),Le=(e,t,n)=>t.has(e)?Va("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n),ze=(e,t,n,a)=>(aa(e,t,"write to private field"),a?a.call(e,n):t.set(e,n),n),Pe=(e,t,n)=>(aa(e,t,"access private method"),n);import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as G,h as Q,c as _o,w as No,S as qo,p as Ho,r as Uo,b as Ga,d as jo,n as Tt,e as S0,u as ra,s as E0,j as N,k as Kn,l as De,m as Ko,t as Pn,g as Dt,o as ht,q as Vo,z as oa,v as Go,x as zo,I as wt,y as Ze,B as za,A as Xo,D as Yo,E as Qe,F as Jo,G as Zo,H as Qo,K as es,L as Vn,M as ts,N as ns,O as sa,T as T0,P as Xa,Q as Ya,R as Sa,U as Ea,V as as,W as Ft,X as C0,Y as rs,Z as Ta,_ as B0,$ as tn,a0 as os,a1 as ss,a2 as is,a3 as ls,a4 as cs,a5 as ds,a6 as W,C as _,i as Y,f as X,a7 as he,a8 as ce,J as R0,a9 as Be,aa as A0}from"./provider-jsonrpc-D-gqrPu_.js";function us(e){const t=G(e,"randomBytes");t[6]=t[6]&15|64,t[8]=t[8]&63|128;const n=Q(t);return[n.substring(2,10),n.substring(10,14),n.substring(14,18),n.substring(18,22),n.substring(22,34)].join("-")}let L0=!1;const P0=function(e,t,n){return _o(e,t).update(n).digest()};let I0=P0;function Ht(e,t,n){const a=G(t,"key"),r=G(n,"data");return Q(I0(e,a,r))}Ht._=P0;Ht.lock=function(){L0=!0};Ht.register=function(e){if(L0)throw new Error("computeHmac is locked");I0=e};Object.freeze(Ht);const bs=new Uint8Array([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),M0=Uint8Array.from({length:16},(e,t)=>t),fs=M0.map(e=>(9*e+5)%16);let Ca=[M0],Ba=[fs];for(let e=0;e<4;e++)for(let t of[Ca,Ba])t.push(t[e].map(n=>bs[n]));const D0=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>new Uint8Array(e)),ps=Ca.map((e,t)=>e.map(n=>D0[t][n])),hs=Ba.map((e,t)=>e.map(n=>D0[t][n])),ms=new Uint32Array([0,1518500249,1859775393,2400959708,2840853838]),ys=new Uint32Array([1352829926,1548603684,1836072691,2053994217,0]),Sn=(e,t)=>e<<t|e>>>32-t;function Ja(e,t,n,a){return e===0?t^n^a:e===1?t&n|~t&a:e===2?(t|~n)^a:e===3?t&a|n&~a:t^(n|~a)}const En=new Uint32Array(16);class xs extends qo{constructor(){super(64,20,8,!0),this.h0=1732584193,this.h1=-271733879,this.h2=-1732584194,this.h3=271733878,this.h4=-1009589776}get(){const{h0:t,h1:n,h2:a,h3:r,h4:o}=this;return[t,n,a,r,o]}set(t,n,a,r,o){this.h0=t|0,this.h1=n|0,this.h2=a|0,this.h3=r|0,this.h4=o|0}process(t,n){for(let p=0;p<16;p++,n+=4)En[p]=t.getUint32(n,!0);let a=this.h0|0,r=a,o=this.h1|0,s=o,i=this.h2|0,c=i,u=this.h3|0,d=u,b=this.h4|0,f=b;for(let p=0;p<5;p++){const h=4-p,m=ms[p],v=ys[p],g=Ca[p],$=Ba[p],T=ps[p],S=hs[p];for(let E=0;E<16;E++){const L=Sn(a+Ja(p,o,i,u)+En[g[E]]+m,T[E])+b|0;a=b,b=u,u=Sn(i,10)|0,i=o,o=L}for(let E=0;E<16;E++){const L=Sn(r+Ja(h,s,c,d)+En[$[E]]+v,S[E])+f|0;r=f,f=d,d=Sn(c,10)|0,c=s,s=L}}this.set(this.h1+i+d|0,this.h2+u+f|0,this.h3+b+r|0,this.h4+a+s|0,this.h0+o+c|0)}roundClean(){En.fill(0)}destroy(){this.destroyed=!0,this.buffer.fill(0),this.set(0,0,0,0,0)}}const vs=No(()=>new xs);let F0=!1;const O0=function(e){return vs(e)};let W0=O0;function Ut(e){const t=G(e,"data");return Q(W0(t))}Ut._=O0;Ut.lock=function(){F0=!0};Ut.register=function(e){if(F0)throw new TypeError("ripemd160 is locked");W0=e};Object.freeze(Ut);let _0=!1;const N0=function(e,t,n,a,r){return Ho(e,t,n,a,r)};let q0=N0;function rt(e,t,n,a,r){const o=G(e,"password"),s=G(t,"salt");return Q(q0(o,s,n,a,r))}rt._=N0;rt.lock=function(){_0=!0};rt.register=function(e){if(_0)throw new Error("pbkdf2 is locked");q0=e};Object.freeze(rt);let H0=!1;const U0=function(e){return new Uint8Array(Uo(e))};let j0=U0;function He(e){return j0(e)}He._=U0;He.lock=function(){H0=!0};He.register=function(e){if(H0)throw new Error("randomBytes is locked");j0=e};Object.freeze(He);const J=(e,t)=>e<<t|e>>>32-t;function Za(e,t,n,a,r,o){let s=e[t++]^n[a++],i=e[t++]^n[a++],c=e[t++]^n[a++],u=e[t++]^n[a++],d=e[t++]^n[a++],b=e[t++]^n[a++],f=e[t++]^n[a++],p=e[t++]^n[a++],h=e[t++]^n[a++],m=e[t++]^n[a++],v=e[t++]^n[a++],g=e[t++]^n[a++],$=e[t++]^n[a++],T=e[t++]^n[a++],S=e[t++]^n[a++],E=e[t++]^n[a++],L=s,M=i,D=c,I=u,H=d,V=b,F=f,k=p,O=h,ae=m,z=v,Z=g,be=$,fe=T,Ve=S,Ge=E;for(let Ka=0;Ka<8;Ka+=2)H^=J(L+be|0,7),O^=J(H+L|0,9),be^=J(O+H|0,13),L^=J(be+O|0,18),ae^=J(V+M|0,7),fe^=J(ae+V|0,9),M^=J(fe+ae|0,13),V^=J(M+fe|0,18),Ve^=J(z+F|0,7),D^=J(Ve+z|0,9),F^=J(D+Ve|0,13),z^=J(F+D|0,18),I^=J(Ge+Z|0,7),k^=J(I+Ge|0,9),Z^=J(k+I|0,13),Ge^=J(Z+k|0,18),M^=J(L+I|0,7),D^=J(M+L|0,9),I^=J(D+M|0,13),L^=J(I+D|0,18),F^=J(V+H|0,7),k^=J(F+V|0,9),H^=J(k+F|0,13),V^=J(H+k|0,18),Z^=J(z+ae|0,7),O^=J(Z+z|0,9),ae^=J(O+Z|0,13),z^=J(ae+O|0,18),be^=J(Ge+Ve|0,7),fe^=J(be+Ge|0,9),Ve^=J(fe+be|0,13),Ge^=J(Ve+fe|0,18);r[o++]=s+L|0,r[o++]=i+M|0,r[o++]=c+D|0,r[o++]=u+I|0,r[o++]=d+H|0,r[o++]=b+V|0,r[o++]=f+F|0,r[o++]=p+k|0,r[o++]=h+O|0,r[o++]=m+ae|0,r[o++]=v+z|0,r[o++]=g+Z|0,r[o++]=$+be|0,r[o++]=T+fe|0,r[o++]=S+Ve|0,r[o++]=E+Ge|0}function Rt(e,t,n,a,r){let o=a+0,s=a+16*r;for(let i=0;i<16;i++)n[s+i]=e[t+(2*r-1)*16+i];for(let i=0;i<r;i++,o+=16,t+=16)Za(n,s,e,t,n,o),i>0&&(s+=16),Za(n,o,e,t+=16,n,s)}function K0(e,t,n){const a=jo({dkLen:32,asyncTick:10,maxmem:1073742848},n),{N:r,r:o,p:s,dkLen:i,asyncTick:c,maxmem:u,onProgress:d}=a;if(Tt(r),Tt(o),Tt(s),Tt(i),Tt(c),Tt(u),d!==void 0&&typeof d!="function")throw new Error("progressCb should be function");const b=128*o,f=b/4;if(r<=1||r&r-1||r>=2**(b/8)||r>2**32)throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");if(s<0||s>(2**32-1)*32/b)throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");if(i<0||i>(2**32-1)*32)throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");const p=b*(r+s);if(p>u)throw new Error(`Scrypt: parameters too large, ${p} (128 * r * (N + p)) > ${u} (maxmem)`);const h=S0(E0,e,t,{c:1,dkLen:b*s}),m=ra(h),v=ra(new Uint8Array(b*r)),g=ra(new Uint8Array(b));let $=()=>{};if(d){const T=2*r*s,S=Math.max(Math.floor(T/1e4),1);let E=0;$=()=>{E++,d&&(!(E%S)||E===T)&&d(E/T)}}return{N:r,r:o,p:s,dkLen:i,blockSize32:f,V:v,B32:m,B:h,tmp:g,blockMixCb:$,asyncTick:c}}function V0(e,t,n,a,r){const o=S0(E0,e,n,{c:1,dkLen:t});return n.fill(0),a.fill(0),r.fill(0),o}function ws(e,t,n){const{N:a,r,p:o,dkLen:s,blockSize32:i,V:c,B32:u,B:d,tmp:b,blockMixCb:f}=K0(e,t,n);for(let p=0;p<o;p++){const h=i*p;for(let m=0;m<i;m++)c[m]=u[h+m];for(let m=0,v=0;m<a-1;m++)Rt(c,v,c,v+=i,r),f();Rt(c,(a-1)*i,u,h,r),f();for(let m=0;m<a;m++){const v=u[h+i-16]%a;for(let g=0;g<i;g++)b[g]=u[h+g]^c[v*i+g];Rt(b,0,u,h,r),f()}}return V0(e,s,d,c,b)}async function gs(e,t,n){const{N:a,r,p:o,dkLen:s,blockSize32:i,V:c,B32:u,B:d,tmp:b,blockMixCb:f,asyncTick:p}=K0(e,t,n);for(let h=0;h<o;h++){const m=i*h;for(let g=0;g<i;g++)c[g]=u[m+g];let v=0;await Ga(a-1,p,()=>{Rt(c,v,c,v+=i,r),f()}),Rt(c,(a-1)*i,u,m,r),f(),await Ga(a,p,()=>{const g=u[m+i-16]%a;for(let $=0;$<i;$++)b[$]=u[m+$]^c[g*i+$];Rt(b,0,u,m,r),f()})}return V0(e,s,d,c,b)}let G0=!1,z0=!1;const X0=async function(e,t,n,a,r,o,s){return await gs(e,t,{N:n,r:a,p:r,dkLen:o,onProgress:s})},Y0=function(e,t,n,a,r,o){return ws(e,t,{N:n,r:a,p:r,dkLen:o})};let J0=X0,Z0=Y0;async function jt(e,t,n,a,r,o,s){const i=G(e,"passwd"),c=G(t,"salt");return Q(await J0(i,c,n,a,r,o,s))}jt._=X0;jt.lock=function(){z0=!0};jt.register=function(e){if(z0)throw new Error("scrypt is locked");J0=e};Object.freeze(jt);function Kt(e,t,n,a,r,o){const s=G(e,"passwd"),i=G(t,"salt");return Q(Z0(s,i,n,a,r,o))}Kt._=Y0;Kt.lock=function(){G0=!0};Kt.register=function(e){if(G0)throw new Error("scryptSync is locked");Z0=e};Object.freeze(Kt);const ks=`Ethereum Signed Message:
`;function $s(e){return N(typeof e.address=="string","invalid address for hashAuthorization","auth.address",e),Kn(De(["0x05",Ko([e.chainId!=null?Pn(e.chainId):"0x",Dt(e.address),e.nonce!=null?Pn(e.nonce):"0x"])]))}function Ss(e){return typeof e=="string"&&(e=ht(e)),Kn(De([ht(ks),ht(String(e.length)),e]))}const Es=new RegExp("^bytes([0-9]+)$"),Ts=new RegExp("^(u?int)([0-9]*)$"),Cs=new RegExp("^(.*)\\[([0-9]*)\\]$");function Q0(e,t,n){switch(e){case"address":return n?G(oa(t,32)):G(Dt(t));case"string":return ht(t);case"bytes":return G(t);case"bool":return t=t?"0x01":"0x00",n?G(oa(t,32)):G(t)}let a=e.match(Ts);if(a){let r=a[1]==="int",o=parseInt(a[2]||"256");return N((!a[2]||a[2]===String(o))&&o%8===0&&o!==0&&o<=256,"invalid number type","type",e),n&&(o=256),r&&(t=Vo(t,o)),G(oa(Pn(t),o/8))}if(a=e.match(Es),a){const r=parseInt(a[1]);return N(String(r)===a[1]&&r!==0&&r<=32,"invalid bytes type","type",e),N(Go(t)===r,`invalid value for ${e}`,"value",t),n?G(zo(t,32)):t}if(a=e.match(Cs),a&&Array.isArray(t)){const r=a[1],o=parseInt(a[2]||String(t.length));N(o===t.length,`invalid array length for ${e}`,"value",t);const s=[];return t.forEach(function(i){s.push(Q0(r,i,!0))}),G(De(s))}N(!1,"invalid type","type",e)}function Bs(e,t){N(e.length===t.length,"wrong number of values; expected ${ types.length }","values",t);const n=[];return e.forEach(function(a,r){n.push(Q0(a,t[r]))}),Q(De(n))}class Ra{constructor(t,n,a){ne(this,"interface");ne(this,"bytecode");ne(this,"runner");const r=wt.from(t);n instanceof Uint8Array?n=Q(G(n)):(typeof n=="object"&&(n=n.object),n.startsWith("0x")||(n="0x"+n),n=Q(G(n))),Ze(this,{bytecode:n,interface:r,runner:a||null})}attach(t){return new za(t,this.interface,this.runner)}async getDeployTransaction(...t){let n={};const a=this.interface.deploy;if(a.inputs.length+1===t.length&&(n=await Xo(t.pop())),a.inputs.length!==t.length)throw new Error("incorrect number of arguments to constructor");const r=await Yo(this.runner,a.inputs,t),o=De([this.bytecode,this.interface.encodeDeploy(r)]);return Object.assign({},n,{data:o})}async deploy(...t){const n=await this.getDeployTransaction(...t);Qe(this.runner&&typeof this.runner.sendTransaction=="function","factory runner does not support sending transactions","UNSUPPORTED_OPERATION",{operation:"sendTransaction"});const a=await this.runner.sendTransaction(n),r=Jo(a);return new za(r,this.interface,this.runner,a)}connect(t){return new Ra(this.interface,this.bytecode,t)}static fromSolidity(t,n){N(t!=null,"bad compiler output","output",t),typeof t=="string"&&(t=JSON.parse(t));const a=t.abi;let r="";return t.bytecode?r=t.bytecode:t.evm&&t.evm.bytecode&&(r=t.evm.bytecode),new this(a,r,n)}}var Lt,Pt;const ut=class ut extends Zo{constructor(n,a,r){const o=Object.assign({},r??{},{batchMaxCount:1});N(n&&n.request,"invalid EIP-1193 provider","ethereum",n);super(a,o);Le(this,Lt);Le(this,Pt);ze(this,Pt,null),r&&r.providerInfo&&ze(this,Pt,r.providerInfo),ze(this,Lt,async(s,i)=>{const c={method:s,params:i};this.emit("debug",{action:"sendEip1193Request",payload:c});try{const u=await n.request(c);return this.emit("debug",{action:"receiveEip1193Result",result:u}),u}catch(u){const d=new Error(u.message);throw d.code=u.code,d.data=u.data,d.payload=c,this.emit("debug",{action:"receiveEip1193Error",error:d}),d}})}get providerInfo(){return Ae(this,Pt)}async send(n,a){return await this._start(),await super.send(n,a)}async _send(n){N(!Array.isArray(n),"EIP-1193 does not support batch request","payload",n);try{const a=await Ae(this,Lt).call(this,n.method,n.params||[]);return[{id:n.id,result:a}]}catch(a){return[{id:n.id,error:{code:a.code,data:a.data,message:a.message}}]}}getRpcError(n,a){switch(a=JSON.parse(JSON.stringify(a)),a.error.code||-1){case 4001:a.error.message=`ethers-user-denied: ${a.error.message}`;break;case 4200:a.error.message=`ethers-unsupported: ${a.error.message}`;break}return super.getRpcError(n,a)}async hasSigner(n){n==null&&(n=0);const a=await this.send("eth_accounts",[]);return typeof n=="number"?a.length>n:(n=n.toLowerCase(),a.filter(r=>r.toLowerCase()===n).length!==0)}async getSigner(n){if(n==null&&(n=0),!await this.hasSigner(n))try{await Ae(this,Lt).call(this,"eth_requestAccounts",[])}catch(a){const r=a.payload;throw this.getRpcError(r,{id:r.id,error:a})}return await super.getSigner(n)}static async discover(n){if(n==null&&(n={}),n.provider)return new ut(n.provider);const a=n.window?n.window:typeof window<"u"?window:null;if(a==null)return null;const r=n.anyProvider;if(r&&a.ethereum)return new ut(a.ethereum);if(!("addEventListener"in a&&"dispatchEvent"in a&&"removeEventListener"in a))return null;const o=n.timeout?n.timeout:300;return o===0?null:await new Promise((s,i)=>{let c=[];const u=f=>{c.push(f.detail),r&&d()},d=()=>{if(clearTimeout(b),c.length)if(n&&n.filter){const f=n.filter(c.map(p=>Object.assign({},p.info)));if(f==null)s(null);else if(f instanceof ut)s(f);else{let p=null;if(f.uuid&&(p=c.filter(m=>f.uuid===m.info.uuid)[0]),p){const{provider:h,info:m}=p;s(new ut(h,void 0,{providerInfo:m}))}else i(Qo("filter returned unknown info","UNSUPPORTED_OPERATION",{value:f}))}}else{const{provider:f,info:p}=c[0];s(new ut(f,void 0,{providerInfo:p}))}else s(null);a.removeEventListener("eip6963:announceProvider",u)},b=setTimeout(()=>{d()},o);a.addEventListener("eip6963:announceProvider",u),a.dispatchEvent(new Event("eip6963:requestProvider"))})}};Lt=new WeakMap,Pt=new WeakMap;let In=ut;var It;const ja=class ja extends es{constructor(n,a){super(a);ne(this,"address");Le(this,It);N(n&&typeof n.sign=="function","invalid private key","privateKey","[ REDACTED ]"),ze(this,It,n);const r=Vn(this.signingKey.publicKey);Ze(this,{address:r})}get signingKey(){return Ae(this,It)}get privateKey(){return this.signingKey.privateKey}async getAddress(){return this.address}connect(n){return new ja(Ae(this,It),n)}async signTransaction(n){n=ts(n);const{to:a,from:r}=await ns({to:n.to?sa(n.to,this):void 0,from:n.from?sa(n.from,this):void 0});a!=null&&(n.to=a),r!=null&&(n.from=r),n.from!=null&&(N(Dt(n.from)===this.address,"transaction from address mismatch","tx.from",n.from),delete n.from);const o=T0.from(n);return o.signature=this.signingKey.sign(o.unsignedHash),o.serialized}async signMessage(n){return this.signMessageSync(n)}signMessageSync(n){return this.signingKey.sign(Ss(n)).serialized}authorizeSync(n){N(typeof n.address=="string","invalid address for authorizeSync","auth.address",n);const a=this.signingKey.sign($s(n));return Object.assign({},{address:Dt(n.address),nonce:Xa(n.nonce||0),chainId:Xa(n.chainId||0)},{signature:a})}async authorize(n){return n=Object.assign({},n,{address:await sa(n.address,this)}),this.authorizeSync(await this.populateAuthorization(n))}async signTypedData(n,a,r){const o=await Ya.resolveNames(n,a,r,async s=>{Qe(this.provider!=null,"cannot resolve ENS names without a provider","UNSUPPORTED_OPERATION",{operation:"resolveName",info:{name:s}});const i=await this.provider.resolveName(s);return Qe(i!=null,"unconfigured ENS name","UNCONFIGURED_NAME",{value:s}),i});return this.signingKey.sign(Ya.hash(o.domain,a,o.value)).serialized}};It=new WeakMap;let Mn=ja;const Dn=" !#$%&'()*+,-./<=>?@[]^_`{|}~",Rs=/^[a-z]*$/i;function Qa(e,t){let n=97;return e.reduce((a,r)=>(r===t?n++:r.match(Rs)?a.push(String.fromCharCode(n)+r):(n=97,a.push(r)),a),[])}function As(e,t){for(let r=Dn.length-1;r>=0;r--)e=e.split(Dn[r]).join(t.substring(2*r,2*r+2));const n=[],a=e.replace(/(:|([0-9])|([A-Z][a-z]*))/g,(r,o,s,i)=>{if(s)for(let c=parseInt(s);c>=0;c--)n.push(";");else n.push(o.toLowerCase());return""});if(a)throw new Error(`leftovers: ${JSON.stringify(a)}`);return Qa(Qa(n,";"),":")}function Ls(e){return N(e[0]==="0","unsupported auwl data","data",e),As(e.substring(1+2*Dn.length),e.substring(1,1+2*Dn.length))}class Ps{constructor(t){ne(this,"locale");Ze(this,{locale:t})}split(t){return t.toLowerCase().split(/\s+/g)}join(t){return t.join(" ")}}var Mt,un,ft,bn,ya;class Is extends Ps{constructor(n,a,r){super(n);Le(this,bn);Le(this,Mt);Le(this,un);Le(this,ft);ze(this,Mt,a),ze(this,un,r),ze(this,ft,null)}get _data(){return Ae(this,Mt)}_decodeWords(){return Ls(Ae(this,Mt))}getWord(n){const a=Pe(this,bn,ya).call(this);return N(n>=0&&n<a.length,`invalid word index: ${n}`,"index",n),a[n]}getWordIndex(n){return Pe(this,bn,ya).call(this).indexOf(n)}}Mt=new WeakMap,un=new WeakMap,ft=new WeakMap,bn=new WeakSet,ya=function(){if(Ae(this,ft)==null){const n=this._decodeWords();if(Sa(n.join(`
`)+`
`)!==Ae(this,un))throw new Error(`BIP39 Wordlist for ${this.locale} FAILED`);ze(this,ft,n)}return Ae(this,ft)};const Ms="0erleonalorenseinceregesticitStanvetearctssi#ch2Athck&tneLl0And#Il.yLeOutO=S|S%b/ra@SurdU'0Ce[Cid|CountCu'Hie=IdOu,-Qui*Ro[TT]T%T*[Tu$0AptDD-tD*[Ju,M.UltV<)Vi)0Rob-0FairF%dRaid0A(EEntRee0Ead0MRRp%tS!_rmBumCoholErtI&LLeyLowMo,O}PhaReadySoT Ways0A>urAz(gOngOuntU'd0Aly,Ch%Ci|G G!GryIm$K!Noun)Nu$O` Sw T&naTiqueXietyY1ArtOlogyPe?P!Pro=Ril1ChCt-EaEnaGueMMedM%MyOundR<+Re,Ri=RowTTefa@Ti,Tw%k0KPe@SaultSetSi,SumeThma0H!>OmTa{T&dT.udeTra@0Ct]D.Gu,NtTh%ToTumn0Era+OcadoOid0AkeA*AyEsomeFulKw?d0Is:ByChel%C#D+GL<)Lc#y~MbooN<aNn RRelyRga(R*lSeS-SketTt!3A^AnAutyCau'ComeEfF%eG(Ha=H(dLie=LowLtN^Nef./TrayTt Twe&Y#d3Cyc!DKeNdOlogyRdR`Tt _{AdeAmeAnketA,EakE[IndOodO[omOu'UeUrUsh_rdAtDyIlMbNeNusOkO,Rd R(gRrowSsTtomUn)XY_{etA(AndA[A=EadEezeI{Id+IefIghtIngIskOccoliOk&OnzeOomO` OwnUsh2Bb!DdyD+tFf$oIldLbLkL!tNd!Nk Rd&Rg R,SS(e[SyTt Y Zz:Bba+B(B!CtusGeKe~LmM aMpNN$N)lNdyNn#NoeNvasNy#Pab!P.$Pta(RRb#RdRgoRpetRryRtSeShS(o/!Su$TT$ogT^Teg%yTt!UghtU'Ut]Ve3Il(gL yM|NsusNturyRe$Rta(_irAlkAmp]An+AosApt Ar+A'AtEapE{Ee'EfErryE,I{&IefIldIm}yOi)Oo'R#-U{!UnkUrn0G?Nnam#Rc!Tiz&TyVil_imApArifyAwAyE<ErkEv I{I|IffImbIn-IpO{OgO'O`OudOwnUbUmpU, Ut^_^A,C#utDeFfeeIlInL!@L%LumnMb(eMeMf%tM-Mm#Mp<yNc tNdu@NfirmNg*[N}@Nsid NtrolNv()OkOlPp PyR$ReRnR*@/Tt#U^UntryUp!Ur'Us(V Yo>_{Ad!AftAmA}AshAt AwlAzyEamEd.EekEwI{etImeIspIt-OpO[Ou^OwdUci$UelUi'Umb!Un^UshYY,$2BeLtu*PPbo?dRiousRr|Rta(R=Sh]/omTe3C!:DMa+MpN)Ng R(gShUght WnY3AlBa>BrisCadeCemb CideCl(eC%a>C*a'ErF&'F(eFyG*eLayLiv M<dMi'Ni$Nti,NyP?tP&dPos.P`PutyRi=ScribeS tSignSkSpair/royTailTe@VelopVi)Vo>3AgramAlAm#dAryCeE'lEtFf G.$Gn.yLemmaNn NosaurRe@RtSag*eScov Sea'ShSmi[S%d Splay/<)V tVideV%)Zzy5Ct%Cum|G~Lph(Ma(Na>NkeyN%OrSeUb!Ve_ftAg#AmaA,-AwEamE[IftIllInkIpI=OpUmY2CkMbNeR(g/T^Ty1Arf1Nam-:G G!RlyRnR`Sily/Sy1HoOlogyOnomy0GeItUca>1F%t0G1GhtTh 2BowD E@r-Eg<tEm|Eph<tEvat%I>Se0B?kBodyBra)Er+Ot]PloyPow Pty0Ab!A@DD![D%'EmyErgyF%)Ga+G(eH<)JoyLi,OughR-hRollSu*T Ti*TryVelope1Isode0U$Uip0AA'OdeOs]R%Upt0CapeSayS&)Ta>0Ern$H-s1Id&)IlOkeOl=1A@Amp!Ce[Ch<+C.eCludeCu'Ecu>Erci'Hau,Hib.I!I,ItOt-P<dPe@Pi*Pla(Po'P*[T&dTra0EEbrow:Br-CeCultyDeIntI`~L'MeMilyMousNNcyNtasyRmSh]TT$Th TigueUltV%.e3Atu*Bru?yD $EEdElMa!N)/iv$T^V W3B Ct]EldGu*LeLmLt N$NdNeNg NishReRmR,Sc$ShTT}[X_gAmeAshAtAv%EeIghtIpOatO{O%Ow UidUshY_mCusGIlLd~owOdOtR)Re,R+tRkRtu}RumRw?dSsil/ UndX_gi!AmeEqu|EshI&dIn+OgOntO,OwnOz&U.2ElNNnyRna)RyTu*:D+tInLaxy~ yMePRa+Rba+Rd&Rl-Rm|SSpTeTh U+Ze3N $NiusN*Nt!Nu(e/u*2O,0AntFtGg!Ng RaffeRlVe_dAn)A*A[IdeImp'ObeOomOryO=OwUe_tDde[LdOdO'RillaSpelSsipV nWn_bA)A(AntApeA[Av.yEatE&IdIefItOc yOupOwUnt_rdE[IdeIltIt?N3M:B.IrLfMm M, NdPpyRb%RdRshR=,TVeWkZ?d3AdAl`ArtAvyD+hogIght~oLmetLpNRo3Dd&Gh~NtPRe/%y5BbyCkeyLdLeLiday~owMeNeyOdPeRnRr%R'Sp.$/TelUrV 5BGeM<Mb!M%Nd*dNgryNtRd!RryRtSb<d3Brid:1EOn0EaEntifyLe2N%e4LLeg$L}[0A+Ita>M&'Mu}Pa@Po'Pro=Pul'0ChCludeComeC*a'DexD-a>Do%Du,ryF<tFl-tF%mHa!H .Iti$Je@JuryMa>N Noc|PutQuiryS<eSe@SideSpi*/$lTa@T e,ToVe,V.eVol=3On0L<dOla>Sue0Em1Ory:CketGu?RZz3AlousAns~yWel9BInKeUr}yY5D+I)MpNg!Ni%Nk/:Ng?oo3EnEpT^upY3CkDD}yNdNgdomSsTT^&TeTt&Wi4EeIfeO{Ow:BBelB%Dd DyKeMpNgua+PtopR+T T(UghUndryVaWWnWsu.Y Zy3Ad AfArnA=Ctu*FtGG$G&dIsu*M#NdNg`NsOp?dSs#Tt Vel3ArB tyBr?yC&'FeFtGhtKeMbM.NkOnQuid/Tt!VeZ?d5AdAnB, C$CkG-NelyNgOpTt yUdUn+VeY$5CkyGga+Mb N?N^Xury3R-s:Ch(eDG-G}tIdIlInJ%KeMm$NNa+Nda>NgoNs]Nu$P!Rb!R^Rg(R(eRketRria+SkSs/ T^T i$ThTrixTt XimumZe3AdowAnAsu*AtCh<-D$DiaLodyLtMb M%yNt]NuRcyR+R.RryShSsa+T$Thod3Dd!DnightLk~]M-NdNimumN%Nu>Rac!Rr%S ySs/akeXXedXtu*5Bi!DelDifyMM|N.%NkeyN, N`OnR$ReRn(gSqu.oTh T]T%Unta(U'VeVie5ChFf(LeLtiplySc!SeumShroomS-/Tu$3Self/ yTh:I=MePk(Rrow/yT]Tu*3ArCkEdGati=G!@I` PhewR=/TTw%kUtr$V WsXt3CeGht5B!I'M(eeOd!Rm$R`SeTab!TeTh(gTi)VelW5C!?Mb R'T:K0EyJe@Li+Scu*S =Ta(Vious0CurE<Tob 0Or1FF Fi)T&2L1Ay0DI=Ymp-0It0CeEI#L(eLy1EnEraIn]Po'T]1An+B.Ch?dD D(?yG<I|Ig($Ph<0Tr-h0H 0Tdo%T TputTside0AlEnEr0NN 0Yg&0/ 0O}:CtDd!GeIrLa)LmNdaNelN-N` P RadeR|RkRrotRtySsT^ThTi|TrolTt nU'VeYm|3A)AnutArAs<tL-<NN$tyNcilOp!Pp Rfe@Rm.Rs#T2O}OtoRa'Ys-$0AnoCn-Ctu*E)GGe#~LotNkO} Pe/olT^Zza_)A}tA,-A>AyEa'Ed+U{UgUn+2EmEtIntL?LeLi)NdNyOlPul?Rt]S.]Ssib!/TatoTt yV tyWd W _@i)Ai'Ed-tEf Epa*Es|EttyEv|I)IdeIm?yIntI%.yIs#Iva>IzeOb!mO)[Odu)Of.OgramOje@Omo>OofOp tyOsp O>@OudOvide2Bl-Dd(g~LpL'Mpk(N^PilPpyR^a'R.yRpo'R'ShTZz!3Ramid:99Al.yAntumArt E,]I{ItIzO>:Bb.Cco#CeCkD?DioIlInI'~yMpN^NdomN+PidReTeTh V&WZ%3AdyAlAs#BelBuildC$lCei=CipeC%dCyc!Du)F!@F%mFu'G]G*tGul?Je@LaxLea'LiefLyMa(Memb M(dMo=Nd NewNtOp&PairPeatPla)P%tQui*ScueSemb!Si,Sour)Sp#'SultTi*T*atTurnUn]Ve$ViewW?d2Y`m0BBb#CeChDeD+F!GhtGidNgOtPp!SkTu$V$V 5AdA,BotBu,CketM<)OfOkieOmSeTa>UghUndU>Y$5Bb DeGLeNNwayR$:DDd!D}[FeIlLadLm#L#LtLu>MeMp!NdTisfyToshiU)Usa+VeY1A!AnA*Att E}HemeHoolI&)I[%sOrp]OutRapRe&RiptRub1AAr^As#AtC#dC*tCt]Cur.yEdEkGm|Le@~M(?Ni%N'Nt&)RiesRvi)Ss]Tt!TupV&_dowAftAllowA*EdEllEriffIeldIftI}IpIv O{OeOotOpOrtOuld O=RimpRugUff!Y0Bl(gCkDeE+GhtGnL|Lk~yLv Mil?Mp!N)NgR&/ Tua>XZe1A>Et^IIllInIrtUll0AbAmEepEnd I)IdeIghtImOg<OtOwUsh0AllArtI!OkeOo`0A{AkeApIffOw0ApCc Ci$CkDaFtL?Ldi LidLut]L=Me#eNgOnRryRtUlUndUpUr)U`0A)A*Ati$AwnEakEci$EedEllEndH eI)Id IkeInIr.L.OilOns%O#OrtOtRayReadR(gY0Ua*UeezeUir*l_b!AdiumAffA+AirsAmpAndArtA>AyEakEelEmEpE*oI{IllIngO{Oma^O}OolOryO=Ra>gyReetRikeR#gRugg!Ud|UffUmb!Y!0Bje@Bm.BwayC)[ChDd&Ff G?G+,ItMm NNnyN'tP PplyP*meReRfa)R+Rpri'RroundR=ySpe@/a(1AllowAmpApArmE?EetIftImIngIt^Ord1MbolMptomRup/em:B!Ck!GIlL|LkNkPeR+tSk/eTtooXi3A^Am~NN<tNnisNtRm/Xt_nkAtEmeEnE%yE*EyIngIsOughtReeRi=RowUmbUnd 0CketDeG LtMb MeNyPRedSsueT!5A,BaccoDayDdl EGe` I!tK&MatoM%rowNeNgueNightOlO`PP-Pp!R^RnadoRtoi'SsT$Uri,W?dW WnY_{AdeAff-Ag-A(Ansf ApAshA=lAyEatEeEndI$IbeI{Igg ImIpOphyOub!U{UeUlyUmpetU,U`Y2BeIt]Mb!NaN}lRkeyRnRt!1El=EntyI)InI,O1PeP-$:5Ly5B*lla0Ab!Awa*C!Cov D DoFairFoldHappyIf%mIqueItIv 'KnownLo{TilUsu$Veil1Da>GradeHoldOnP Set1B<Ge0A+EEdEfulE![U$0Il.y:C<tCuumGueLidL!yL=NNishP%Rious/Ult3H-!L=tNd%Ntu*NueRbRifyRs]RyS'lT <3Ab!Br<tCiousCt%yDeoEw~a+Nta+Ol(Rtu$RusSaS.Su$T$Vid5C$I)IdLc<oLumeTeYa+:GeG#ItLk~LnutNtRfa*RmRri%ShSp/eT VeY3Al`Ap#ArA'lA` BDd(gEk&dIrdLcome/T_!AtEatEelEnE*IpIsp 0DeD`FeLd~NNdowNeNgNkNn Nt ReSdomSeShT}[5LfM<Nd OdOlRdRkRldRryR`_pE{E,!I,I>Ong::Rd3Ar~ow9UUngU`:3BraRo9NeO",Ds="0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60";let ia=null;class mt extends Is{constructor(){super("en",Ms,Ds)}static wordlist(){return ia==null&&(ia=new mt),ia}}function er(e){return(1<<e)-1<<8-e&255}function Fs(e){return(1<<e)-1&255}function la(e,t){as("NFKD"),t==null&&(t=mt.wordlist());const n=t.split(e);N(n.length%3===0&&n.length>=12&&n.length<=24,"invalid mnemonic length","mnemonic","[ REDACTED ]");const a=new Uint8Array(Math.ceil(11*n.length/8));let r=0;for(let u=0;u<n.length;u++){let d=t.getWordIndex(n[u].normalize("NFKD"));N(d>=0,`invalid mnemonic word at index ${u}`,"mnemonic","[ REDACTED ]");for(let b=0;b<11;b++)d&1<<10-b&&(a[r>>3]|=1<<7-r%8),r++}const o=32*n.length/3,s=n.length/3,i=er(s),c=G(Ft(a.slice(0,o/8)))[0]&i;return N(c===(a[a.length-1]&i),"invalid mnemonic checksum","mnemonic","[ REDACTED ]"),Q(a.slice(0,o/8))}function ca(e,t){N(e.length%4===0&&e.length>=16&&e.length<=32,"invalid entropy size","entropy","[ REDACTED ]"),t==null&&(t=mt.wordlist());const n=[0];let a=11;for(let s=0;s<e.length;s++)a>8?(n[n.length-1]<<=8,n[n.length-1]|=e[s],a-=8):(n[n.length-1]<<=a,n[n.length-1]|=e[s]>>8-a,n.push(e[s]&Fs(8-a)),a+=3);const r=e.length/4,o=parseInt(Ft(e).substring(2,4),16)&er(r);return n[n.length-1]<<=r,n[n.length-1]|=o>>8-r,t.join(n.map(s=>t.getWord(s)))}const da={};class Ot{constructor(t,n,a,r,o){ne(this,"phrase");ne(this,"password");ne(this,"wordlist");ne(this,"entropy");r==null&&(r=""),o==null&&(o=mt.wordlist()),Ea(t,da,"Mnemonic"),Ze(this,{phrase:a,password:r,wordlist:o,entropy:n})}computeSeed(){const t=ht("mnemonic"+this.password,"NFKD");return rt(ht(this.phrase,"NFKD"),t,2048,64,"sha512")}static fromPhrase(t,n,a){const r=la(t,a);return t=ca(G(r),a),new Ot(da,r,t,n,a)}static fromEntropy(t,n,a){const r=G(t,"entropy"),o=ca(r,a);return new Ot(da,Q(r),o,n,a)}static entropyToPhrase(t,n){const a=G(t,"entropy");return ca(a,n)}static phraseToEntropy(t,n){return la(t,n)}static isValidMnemonic(t,n){try{return la(t,n),!0}catch{}return!1}}/*! MIT License. Copyright 2015-2022 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */var pe=function(e,t,n,a){if(n==="a"&&!a)throw new TypeError("Private accessor was defined without a getter");if(typeof t=="function"?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?a:n==="a"?a.call(e):a?a.value:t.get(e)},ua=function(e,t,n,a,r){if(a==="m")throw new TypeError("Private method is not writable");if(a==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof t=="function"?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return a==="a"?r.call(e,n):r?r.value=n:t.set(e,n),n},An,Te,_e;const Os={16:10,24:12,32:14},Ws=[1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145],Se=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],Tn=[82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,125],_s=[3328402341,4168907908,4000806809,4135287693,4294111757,3597364157,3731845041,2445657428,1613770832,33620227,3462883241,1445669757,3892248089,3050821474,1303096294,3967186586,2412431941,528646813,2311702848,4202528135,4026202645,2992200171,2387036105,4226871307,1101901292,3017069671,1604494077,1169141738,597466303,1403299063,3832705686,2613100635,1974974402,3791519004,1033081774,1277568618,1815492186,2118074177,4126668546,2211236943,1748251740,1369810420,3521504564,4193382664,3799085459,2883115123,1647391059,706024767,134480908,2512897874,1176707941,2646852446,806885416,932615841,168101135,798661301,235341577,605164086,461406363,3756188221,3454790438,1311188841,2142417613,3933566367,302582043,495158174,1479289972,874125870,907746093,3698224818,3025820398,1537253627,2756858614,1983593293,3084310113,2108928974,1378429307,3722699582,1580150641,327451799,2790478837,3117535592,0,3253595436,1075847264,3825007647,2041688520,3059440621,3563743934,2378943302,1740553945,1916352843,2487896798,2555137236,2958579944,2244988746,3151024235,3320835882,1336584933,3992714006,2252555205,2588757463,1714631509,293963156,2319795663,3925473552,67240454,4269768577,2689618160,2017213508,631218106,1269344483,2723238387,1571005438,2151694528,93294474,1066570413,563977660,1882732616,4059428100,1673313503,2008463041,2950355573,1109467491,537923632,3858759450,4260623118,3218264685,2177748300,403442708,638784309,3287084079,3193921505,899127202,2286175436,773265209,2479146071,1437050866,4236148354,2050833735,3362022572,3126681063,840505643,3866325909,3227541664,427917720,2655997905,2749160575,1143087718,1412049534,999329963,193497219,2353415882,3354324521,1807268051,672404540,2816401017,3160301282,369822493,2916866934,3688947771,1681011286,1949973070,336202270,2454276571,201721354,1210328172,3093060836,2680341085,3184776046,1135389935,3294782118,965841320,831886756,3554993207,4068047243,3588745010,2345191491,1849112409,3664604599,26054028,2983581028,2622377682,1235855840,3630984372,2891339514,4092916743,3488279077,3395642799,4101667470,1202630377,268961816,1874508501,4034427016,1243948399,1546530418,941366308,1470539505,1941222599,2546386513,3421038627,2715671932,3899946140,1042226977,2521517021,1639824860,227249030,260737669,3765465232,2084453954,1907733956,3429263018,2420656344,100860677,4160157185,470683154,3261161891,1781871967,2924959737,1773779408,394692241,2579611992,974986535,664706745,3655459128,3958962195,731420851,571543859,3530123707,2849626480,126783113,865375399,765172662,1008606754,361203602,3387549984,2278477385,2857719295,1344809080,2782912378,59542671,1503764984,160008576,437062935,1707065306,3622233649,2218934982,3496503480,2185314755,697932208,1512910199,504303377,2075177163,2824099068,1841019862,739644986],Ns=[2781242211,2230877308,2582542199,2381740923,234877682,3184946027,2984144751,1418839493,1348481072,50462977,2848876391,2102799147,434634494,1656084439,3863849899,2599188086,1167051466,2636087938,1082771913,2281340285,368048890,3954334041,3381544775,201060592,3963727277,1739838676,4250903202,3930435503,3206782108,4149453988,2531553906,1536934080,3262494647,484572669,2923271059,1783375398,1517041206,1098792767,49674231,1334037708,1550332980,4098991525,886171109,150598129,2481090929,1940642008,1398944049,1059722517,201851908,1385547719,1699095331,1587397571,674240536,2704774806,252314885,3039795866,151914247,908333586,2602270848,1038082786,651029483,1766729511,3447698098,2682942837,454166793,2652734339,1951935532,775166490,758520603,3000790638,4004797018,4217086112,4137964114,1299594043,1639438038,3464344499,2068982057,1054729187,1901997871,2534638724,4121318227,1757008337,0,750906861,1614815264,535035132,3363418545,3988151131,3201591914,1183697867,3647454910,1265776953,3734260298,3566750796,3903871064,1250283471,1807470800,717615087,3847203498,384695291,3313910595,3617213773,1432761139,2484176261,3481945413,283769337,100925954,2180939647,4037038160,1148730428,3123027871,3813386408,4087501137,4267549603,3229630528,2315620239,2906624658,3156319645,1215313976,82966005,3747855548,3245848246,1974459098,1665278241,807407632,451280895,251524083,1841287890,1283575245,337120268,891687699,801369324,3787349855,2721421207,3431482436,959321879,1469301956,4065699751,2197585534,1199193405,2898814052,3887750493,724703513,2514908019,2696962144,2551808385,3516813135,2141445340,1715741218,2119445034,2872807568,2198571144,3398190662,700968686,3547052216,1009259540,2041044702,3803995742,487983883,1991105499,1004265696,1449407026,1316239930,504629770,3683797321,168560134,1816667172,3837287516,1570751170,1857934291,4014189740,2797888098,2822345105,2754712981,936633572,2347923833,852879335,1133234376,1500395319,3084545389,2348912013,1689376213,3533459022,3762923945,3034082412,4205598294,133428468,634383082,2949277029,2398386810,3913789102,403703816,3580869306,2297460856,1867130149,1918643758,607656988,4049053350,3346248884,1368901318,600565992,2090982877,2632479860,557719327,3717614411,3697393085,2249034635,2232388234,2430627952,1115438654,3295786421,2865522278,3633334344,84280067,33027830,303828494,2747425121,1600795957,4188952407,3496589753,2434238086,1486471617,658119965,3106381470,953803233,334231800,3005978776,857870609,3151128937,1890179545,2298973838,2805175444,3056442267,574365214,2450884487,550103529,1233637070,4289353045,2018519080,2057691103,2399374476,4166623649,2148108681,387583245,3664101311,836232934,3330556482,3100665960,3280093505,2955516313,2002398509,287182607,3413881008,4238890068,3597515707,975967766],qs=[1671808611,2089089148,2006576759,2072901243,4061003762,1807603307,1873927791,3310653893,810573872,16974337,1739181671,729634347,4263110654,3613570519,2883997099,1989864566,3393556426,2191335298,3376449993,2106063485,4195741690,1508618841,1204391495,4027317232,2917941677,3563566036,2734514082,2951366063,2629772188,2767672228,1922491506,3227229120,3082974647,4246528509,2477669779,644500518,911895606,1061256767,4144166391,3427763148,878471220,2784252325,3845444069,4043897329,1905517169,3631459288,827548209,356461077,67897348,3344078279,593839651,3277757891,405286936,2527147926,84871685,2595565466,118033927,305538066,2157648768,3795705826,3945188843,661212711,2999812018,1973414517,152769033,2208177539,745822252,439235610,455947803,1857215598,1525593178,2700827552,1391895634,994932283,3596728278,3016654259,695947817,3812548067,795958831,2224493444,1408607827,3513301457,0,3979133421,543178784,4229948412,2982705585,1542305371,1790891114,3410398667,3201918910,961245753,1256100938,1289001036,1491644504,3477767631,3496721360,4012557807,2867154858,4212583931,1137018435,1305975373,861234739,2241073541,1171229253,4178635257,33948674,2139225727,1357946960,1011120188,2679776671,2833468328,1374921297,2751356323,1086357568,2408187279,2460827538,2646352285,944271416,4110742005,3168756668,3066132406,3665145818,560153121,271589392,4279952895,4077846003,3530407890,3444343245,202643468,322250259,3962553324,1608629855,2543990167,1154254916,389623319,3294073796,2817676711,2122513534,1028094525,1689045092,1575467613,422261273,1939203699,1621147744,2174228865,1339137615,3699352540,577127458,712922154,2427141008,2290289544,1187679302,3995715566,3100863416,339486740,3732514782,1591917662,186455563,3681988059,3762019296,844522546,978220090,169743370,1239126601,101321734,611076132,1558493276,3260915650,3547250131,2901361580,1655096418,2443721105,2510565781,3828863972,2039214713,3878868455,3359869896,928607799,1840765549,2374762893,3580146133,1322425422,2850048425,1823791212,1459268694,4094161908,3928346602,1706019429,2056189050,2934523822,135794696,3134549946,2022240376,628050469,779246638,472135708,2800834470,3032970164,3327236038,3894660072,3715932637,1956440180,522272287,1272813131,3185336765,2340818315,2323976074,1888542832,1044544574,3049550261,1722469478,1222152264,50660867,4127324150,236067854,1638122081,895445557,1475980887,3117443513,2257655686,3243809217,489110045,2662934430,3778599393,4162055160,2561878936,288563729,1773916777,3648039385,2391345038,2493985684,2612407707,505560094,2274497927,3911240169,3460925390,1442818645,678973480,3749357023,2358182796,2717407649,2306869641,219617805,3218761151,3862026214,1120306242,1756942440,1103331905,2578459033,762796589,252780047,2966125488,1425844308,3151392187,372911126],Hs=[1667474886,2088535288,2004326894,2071694838,4075949567,1802223062,1869591006,3318043793,808472672,16843522,1734846926,724270422,4278065639,3621216949,2880169549,1987484396,3402253711,2189597983,3385409673,2105378810,4210693615,1499065266,1195886990,4042263547,2913856577,3570689971,2728590687,2947541573,2627518243,2762274643,1920112356,3233831835,3082273397,4261223649,2475929149,640051788,909531756,1061110142,4160160501,3435941763,875846760,2779116625,3857003729,4059105529,1903268834,3638064043,825316194,353713962,67374088,3351728789,589522246,3284360861,404236336,2526454071,84217610,2593830191,117901582,303183396,2155911963,3806477791,3958056653,656894286,2998062463,1970642922,151591698,2206440989,741110872,437923380,454765878,1852748508,1515908788,2694904667,1381168804,993742198,3604373943,3014905469,690584402,3823320797,791638366,2223281939,1398011302,3520161977,0,3991743681,538992704,4244381667,2981218425,1532751286,1785380564,3419096717,3200178535,960056178,1246420628,1280103576,1482221744,3486468741,3503319995,4025428677,2863326543,4227536621,1128514950,1296947098,859002214,2240123921,1162203018,4193849577,33687044,2139062782,1347481760,1010582648,2678045221,2829640523,1364325282,2745433693,1077985408,2408548869,2459086143,2644360225,943212656,4126475505,3166494563,3065430391,3671750063,555836226,269496352,4294908645,4092792573,3537006015,3452783745,202118168,320025894,3974901699,1600119230,2543297077,1145359496,387397934,3301201811,2812801621,2122220284,1027426170,1684319432,1566435258,421079858,1936954854,1616945344,2172753945,1330631070,3705438115,572679748,707427924,2425400123,2290647819,1179044492,4008585671,3099120491,336870440,3739122087,1583276732,185277718,3688593069,3772791771,842159716,976899700,168435220,1229577106,101059084,606366792,1549591736,3267517855,3553849021,2897014595,1650632388,2442242105,2509612081,3840161747,2038008818,3890688725,3368567691,926374254,1835907034,2374863873,3587531953,1313788572,2846482505,1819063512,1448540844,4109633523,3941213647,1701162954,2054852340,2930698567,134748176,3132806511,2021165296,623210314,774795868,471606328,2795958615,3031746419,3334885783,3907527627,3722280097,1953799400,522133822,1263263126,3183336545,2341176845,2324333839,1886425312,1044267644,3048588401,1718004428,1212733584,50529542,4143317495,235803164,1633788866,892690282,1465383342,3115962473,2256965911,3250673817,488449850,2661202215,3789633753,4177007595,2560144171,286339874,1768537042,3654906025,2391705863,2492770099,2610673197,505291324,2273808917,3924369609,3469625735,1431699370,673740880,3755965093,2358021891,2711746649,2307489801,218961690,3217021541,3873845719,1111672452,1751693520,1094828930,2576986153,757954394,252645662,2964376443,1414855848,3149649517,370555436],Us=[1374988112,2118214995,437757123,975658646,1001089995,530400753,2902087851,1273168787,540080725,2910219766,2295101073,4110568485,1340463100,3307916247,641025152,3043140495,3736164937,632953703,1172967064,1576976609,3274667266,2169303058,2370213795,1809054150,59727847,361929877,3211623147,2505202138,3569255213,1484005843,1239443753,2395588676,1975683434,4102977912,2572697195,666464733,3202437046,4035489047,3374361702,2110667444,1675577880,3843699074,2538681184,1649639237,2976151520,3144396420,4269907996,4178062228,1883793496,2403728665,2497604743,1383856311,2876494627,1917518562,3810496343,1716890410,3001755655,800440835,2261089178,3543599269,807962610,599762354,33778362,3977675356,2328828971,2809771154,4077384432,1315562145,1708848333,101039829,3509871135,3299278474,875451293,2733856160,92987698,2767645557,193195065,1080094634,1584504582,3178106961,1042385657,2531067453,3711829422,1306967366,2438237621,1908694277,67556463,1615861247,429456164,3602770327,2302690252,1742315127,2968011453,126454664,3877198648,2043211483,2709260871,2084704233,4169408201,0,159417987,841739592,504459436,1817866830,4245618683,260388950,1034867998,908933415,168810852,1750902305,2606453969,607530554,202008497,2472011535,3035535058,463180190,2160117071,1641816226,1517767529,470948374,3801332234,3231722213,1008918595,303765277,235474187,4069246893,766945465,337553864,1475418501,2943682380,4003061179,2743034109,4144047775,1551037884,1147550661,1543208500,2336434550,3408119516,3069049960,3102011747,3610369226,1113818384,328671808,2227573024,2236228733,3535486456,2935566865,3341394285,496906059,3702665459,226906860,2009195472,733156972,2842737049,294930682,1206477858,2835123396,2700099354,1451044056,573804783,2269728455,3644379585,2362090238,2564033334,2801107407,2776292904,3669462566,1068351396,742039012,1350078989,1784663195,1417561698,4136440770,2430122216,775550814,2193862645,2673705150,1775276924,1876241833,3475313331,3366754619,270040487,3902563182,3678124923,3441850377,1851332852,3969562369,2203032232,3868552805,2868897406,566021896,4011190502,3135740889,1248802510,3936291284,699432150,832877231,708780849,3332740144,899835584,1951317047,4236429990,3767586992,866637845,4043610186,1106041591,2144161806,395441711,1984812685,1139781709,3433712980,3835036895,2664543715,1282050075,3240894392,1181045119,2640243204,25965917,4203181171,4211818798,3009879386,2463879762,3910161971,1842759443,2597806476,933301370,1509430414,3943906441,3467192302,3076639029,3776767469,2051518780,2631065433,1441952575,404016761,1942435775,1408749034,1610459739,3745345300,2017778566,3400528769,3110650942,941896748,3265478751,371049330,3168937228,675039627,4279080257,967311729,135050206,3635733660,1683407248,2076935265,3576870512,1215061108,3501741890],js=[1347548327,1400783205,3273267108,2520393566,3409685355,4045380933,2880240216,2471224067,1428173050,4138563181,2441661558,636813900,4233094615,3620022987,2149987652,2411029155,1239331162,1730525723,2554718734,3781033664,46346101,310463728,2743944855,3328955385,3875770207,2501218972,3955191162,3667219033,768917123,3545789473,692707433,1150208456,1786102409,2029293177,1805211710,3710368113,3065962831,401639597,1724457132,3028143674,409198410,2196052529,1620529459,1164071807,3769721975,2226875310,486441376,2499348523,1483753576,428819965,2274680428,3075636216,598438867,3799141122,1474502543,711349675,129166120,53458370,2592523643,2782082824,4063242375,2988687269,3120694122,1559041666,730517276,2460449204,4042459122,2706270690,3446004468,3573941694,533804130,2328143614,2637442643,2695033685,839224033,1973745387,957055980,2856345839,106852767,1371368976,4181598602,1033297158,2933734917,1179510461,3046200461,91341917,1862534868,4284502037,605657339,2547432937,3431546947,2003294622,3182487618,2282195339,954669403,3682191598,1201765386,3917234703,3388507166,0,2198438022,1211247597,2887651696,1315723890,4227665663,1443857720,507358933,657861945,1678381017,560487590,3516619604,975451694,2970356327,261314535,3535072918,2652609425,1333838021,2724322336,1767536459,370938394,182621114,3854606378,1128014560,487725847,185469197,2918353863,3106780840,3356761769,2237133081,1286567175,3152976349,4255350624,2683765030,3160175349,3309594171,878443390,1988838185,3704300486,1756818940,1673061617,3403100636,272786309,1075025698,545572369,2105887268,4174560061,296679730,1841768865,1260232239,4091327024,3960309330,3497509347,1814803222,2578018489,4195456072,575138148,3299409036,446754879,3629546796,4011996048,3347532110,3252238545,4270639778,915985419,3483825537,681933534,651868046,2755636671,3828103837,223377554,2607439820,1649704518,3270937875,3901806776,1580087799,4118987695,3198115200,2087309459,2842678573,3016697106,1003007129,2802849917,1860738147,2077965243,164439672,4100872472,32283319,2827177882,1709610350,2125135846,136428751,3874428392,3652904859,3460984630,3572145929,3593056380,2939266226,824852259,818324884,3224740454,930369212,2801566410,2967507152,355706840,1257309336,4148292826,243256656,790073846,2373340630,1296297904,1422699085,3756299780,3818836405,457992840,3099667487,2135319889,77422314,1560382517,1945798516,788204353,1521706781,1385356242,870912086,325965383,2358957921,2050466060,2388260884,2313884476,4006521127,901210569,3990953189,1014646705,1503449823,1062597235,2031621326,3212035895,3931371469,1533017514,350174575,2256028891,2177544179,1052338372,741876788,1606591296,1914052035,213705253,2334669897,1107234197,1899603969,3725069491,2631447780,2422494913,1635502980,1893020342,1950903388,1120974935],Ks=[2807058932,1699970625,2764249623,1586903591,1808481195,1173430173,1487645946,59984867,4199882800,1844882806,1989249228,1277555970,3623636965,3419915562,1149249077,2744104290,1514790577,459744698,244860394,3235995134,1963115311,4027744588,2544078150,4190530515,1608975247,2627016082,2062270317,1507497298,2200818878,567498868,1764313568,3359936201,2305455554,2037970062,1047239e3,1910319033,1337376481,2904027272,2892417312,984907214,1243112415,830661914,861968209,2135253587,2011214180,2927934315,2686254721,731183368,1750626376,4246310725,1820824798,4172763771,3542330227,48394827,2404901663,2871682645,671593195,3254988725,2073724613,145085239,2280796200,2779915199,1790575107,2187128086,472615631,3029510009,4075877127,3802222185,4107101658,3201631749,1646252340,4270507174,1402811438,1436590835,3778151818,3950355702,3963161475,4020912224,2667994737,273792366,2331590177,104699613,95345982,3175501286,2377486676,1560637892,3564045318,369057872,4213447064,3919042237,1137477952,2658625497,1119727848,2340947849,1530455833,4007360968,172466556,266959938,516552836,0,2256734592,3980931627,1890328081,1917742170,4294704398,945164165,3575528878,958871085,3647212047,2787207260,1423022939,775562294,1739656202,3876557655,2530391278,2443058075,3310321856,547512796,1265195639,437656594,3121275539,719700128,3762502690,387781147,218828297,3350065803,2830708150,2848461854,428169201,122466165,3720081049,1627235199,648017665,4122762354,1002783846,2117360635,695634755,3336358691,4234721005,4049844452,3704280881,2232435299,574624663,287343814,612205898,1039717051,840019705,2708326185,793451934,821288114,1391201670,3822090177,376187827,3113855344,1224348052,1679968233,2361698556,1058709744,752375421,2431590963,1321699145,3519142200,2734591178,188127444,2177869557,3727205754,2384911031,3215212461,2648976442,2450346104,3432737375,1180849278,331544205,3102249176,4150144569,2952102595,2159976285,2474404304,766078933,313773861,2570832044,2108100632,1668212892,3145456443,2013908262,418672217,3070356634,2594734927,1852171925,3867060991,3473416636,3907448597,2614737639,919489135,164948639,2094410160,2997825956,590424639,2486224549,1723872674,3157750862,3399941250,3501252752,3625268135,2555048196,3673637356,1343127501,4130281361,3599595085,2957853679,1297403050,81781910,3051593425,2283490410,532201772,1367295589,3926170974,895287692,1953757831,1093597963,492483431,3528626907,1446242576,1192455638,1636604631,209336225,344873464,1015671571,669961897,3375740769,3857572124,2973530695,3747192018,1933530610,3464042516,935293895,3454686199,2858115069,1863638845,3683022916,4085369519,3292445032,875313188,1080017571,3279033885,621591778,1233856572,2504130317,24197544,3017672716,3835484340,3247465558,2220981195,3060847922,1551124588,1463996600],Vs=[4104605777,1097159550,396673818,660510266,2875968315,2638606623,4200115116,3808662347,821712160,1986918061,3430322568,38544885,3856137295,718002117,893681702,1654886325,2975484382,3122358053,3926825029,4274053469,796197571,1290801793,1184342925,3556361835,2405426947,2459735317,1836772287,1381620373,3196267988,1948373848,3764988233,3385345166,3263785589,2390325492,1480485785,3111247143,3780097726,2293045232,548169417,3459953789,3746175075,439452389,1362321559,1400849762,1685577905,1806599355,2174754046,137073913,1214797936,1174215055,3731654548,2079897426,1943217067,1258480242,529487843,1437280870,3945269170,3049390895,3313212038,923313619,679998e3,3215307299,57326082,377642221,3474729866,2041877159,133361907,1776460110,3673476453,96392454,878845905,2801699524,777231668,4082475170,2330014213,4142626212,2213296395,1626319424,1906247262,1846563261,562755902,3708173718,1040559837,3871163981,1418573201,3294430577,114585348,1343618912,2566595609,3186202582,1078185097,3651041127,3896688048,2307622919,425408743,3371096953,2081048481,1108339068,2216610296,0,2156299017,736970802,292596766,1517440620,251657213,2235061775,2933202493,758720310,265905162,1554391400,1532285339,908999204,174567692,1474760595,4002861748,2610011675,3234156416,3693126241,2001430874,303699484,2478443234,2687165888,585122620,454499602,151849742,2345119218,3064510765,514443284,4044981591,1963412655,2581445614,2137062819,19308535,1928707164,1715193156,4219352155,1126790795,600235211,3992742070,3841024952,836553431,1669664834,2535604243,3323011204,1243905413,3141400786,4180808110,698445255,2653899549,2989552604,2253581325,3252932727,3004591147,1891211689,2487810577,3915653703,4237083816,4030667424,2100090966,865136418,1229899655,953270745,3399679628,3557504664,4118925222,2061379749,3079546586,2915017791,983426092,2022837584,1607244650,2118541908,2366882550,3635996816,972512814,3283088770,1568718495,3499326569,3576539503,621982671,2895723464,410887952,2623762152,1002142683,645401037,1494807662,2595684844,1335535747,2507040230,4293295786,3167684641,367585007,3885750714,1865862730,2668221674,2960971305,2763173681,1059270954,2777952454,2724642869,1320957812,2194319100,2429595872,2815956275,77089521,3973773121,3444575871,2448830231,1305906550,4021308739,2857194700,2516901860,3518358430,1787304780,740276417,1699839814,1592394909,2352307457,2272556026,188821243,1729977011,3687994002,274084841,3594982253,3613494426,2701949495,4162096729,322734571,2837966542,1640576439,484830689,1202797690,3537852828,4067639125,349075736,3342319475,4157467219,4255800159,1030690015,1155237496,2951971274,1757691577,607398968,2738905026,499347990,3794078908,1011452712,227885567,2818666809,213114376,3034881240,1455525988,3414450555,850817237,1817998408,3092726480],Gs=[0,235474187,470948374,303765277,941896748,908933415,607530554,708780849,1883793496,2118214995,1817866830,1649639237,1215061108,1181045119,1417561698,1517767529,3767586992,4003061179,4236429990,4069246893,3635733660,3602770327,3299278474,3400528769,2430122216,2664543715,2362090238,2193862645,2835123396,2801107407,3035535058,3135740889,3678124923,3576870512,3341394285,3374361702,3810496343,3977675356,4279080257,4043610186,2876494627,2776292904,3076639029,3110650942,2472011535,2640243204,2403728665,2169303058,1001089995,899835584,666464733,699432150,59727847,226906860,530400753,294930682,1273168787,1172967064,1475418501,1509430414,1942435775,2110667444,1876241833,1641816226,2910219766,2743034109,2976151520,3211623147,2505202138,2606453969,2302690252,2269728455,3711829422,3543599269,3240894392,3475313331,3843699074,3943906441,4178062228,4144047775,1306967366,1139781709,1374988112,1610459739,1975683434,2076935265,1775276924,1742315127,1034867998,866637845,566021896,800440835,92987698,193195065,429456164,395441711,1984812685,2017778566,1784663195,1683407248,1315562145,1080094634,1383856311,1551037884,101039829,135050206,437757123,337553864,1042385657,807962610,573804783,742039012,2531067453,2564033334,2328828971,2227573024,2935566865,2700099354,3001755655,3168937228,3868552805,3902563182,4203181171,4102977912,3736164937,3501741890,3265478751,3433712980,1106041591,1340463100,1576976609,1408749034,2043211483,2009195472,1708848333,1809054150,832877231,1068351396,766945465,599762354,159417987,126454664,361929877,463180190,2709260871,2943682380,3178106961,3009879386,2572697195,2538681184,2236228733,2336434550,3509871135,3745345300,3441850377,3274667266,3910161971,3877198648,4110568485,4211818798,2597806476,2497604743,2261089178,2295101073,2733856160,2902087851,3202437046,2968011453,3936291284,3835036895,4136440770,4169408201,3535486456,3702665459,3467192302,3231722213,2051518780,1951317047,1716890410,1750902305,1113818384,1282050075,1584504582,1350078989,168810852,67556463,371049330,404016761,841739592,1008918595,775550814,540080725,3969562369,3801332234,4035489047,4269907996,3569255213,3669462566,3366754619,3332740144,2631065433,2463879762,2160117071,2395588676,2767645557,2868897406,3102011747,3069049960,202008497,33778362,270040487,504459436,875451293,975658646,675039627,641025152,2084704233,1917518562,1615861247,1851332852,1147550661,1248802510,1484005843,1451044056,933301370,967311729,733156972,632953703,260388950,25965917,328671808,496906059,1206477858,1239443753,1543208500,1441952575,2144161806,1908694277,1675577880,1842759443,3610369226,3644379585,3408119516,3307916247,4011190502,3776767469,4077384432,4245618683,2809771154,2842737049,3144396420,3043140495,2673705150,2438237621,2203032232,2370213795],zs=[0,185469197,370938394,487725847,741876788,657861945,975451694,824852259,1483753576,1400783205,1315723890,1164071807,1950903388,2135319889,1649704518,1767536459,2967507152,3152976349,2801566410,2918353863,2631447780,2547432937,2328143614,2177544179,3901806776,3818836405,4270639778,4118987695,3299409036,3483825537,3535072918,3652904859,2077965243,1893020342,1841768865,1724457132,1474502543,1559041666,1107234197,1257309336,598438867,681933534,901210569,1052338372,261314535,77422314,428819965,310463728,3409685355,3224740454,3710368113,3593056380,3875770207,3960309330,4045380933,4195456072,2471224067,2554718734,2237133081,2388260884,3212035895,3028143674,2842678573,2724322336,4138563181,4255350624,3769721975,3955191162,3667219033,3516619604,3431546947,3347532110,2933734917,2782082824,3099667487,3016697106,2196052529,2313884476,2499348523,2683765030,1179510461,1296297904,1347548327,1533017514,1786102409,1635502980,2087309459,2003294622,507358933,355706840,136428751,53458370,839224033,957055980,605657339,790073846,2373340630,2256028891,2607439820,2422494913,2706270690,2856345839,3075636216,3160175349,3573941694,3725069491,3273267108,3356761769,4181598602,4063242375,4011996048,3828103837,1033297158,915985419,730517276,545572369,296679730,446754879,129166120,213705253,1709610350,1860738147,1945798516,2029293177,1239331162,1120974935,1606591296,1422699085,4148292826,4233094615,3781033664,3931371469,3682191598,3497509347,3446004468,3328955385,2939266226,2755636671,3106780840,2988687269,2198438022,2282195339,2501218972,2652609425,1201765386,1286567175,1371368976,1521706781,1805211710,1620529459,2105887268,1988838185,533804130,350174575,164439672,46346101,870912086,954669403,636813900,788204353,2358957921,2274680428,2592523643,2441661558,2695033685,2880240216,3065962831,3182487618,3572145929,3756299780,3270937875,3388507166,4174560061,4091327024,4006521127,3854606378,1014646705,930369212,711349675,560487590,272786309,457992840,106852767,223377554,1678381017,1862534868,1914052035,2031621326,1211247597,1128014560,1580087799,1428173050,32283319,182621114,401639597,486441376,768917123,651868046,1003007129,818324884,1503449823,1385356242,1333838021,1150208456,1973745387,2125135846,1673061617,1756818940,2970356327,3120694122,2802849917,2887651696,2637442643,2520393566,2334669897,2149987652,3917234703,3799141122,4284502037,4100872472,3309594171,3460984630,3545789473,3629546796,2050466060,1899603969,1814803222,1730525723,1443857720,1560382517,1075025698,1260232239,575138148,692707433,878443390,1062597235,243256656,91341917,409198410,325965383,3403100636,3252238545,3704300486,3620022987,3874428392,3990953189,4042459122,4227665663,2460449204,2578018489,2226875310,2411029155,3198115200,3046200461,2827177882,2743944855],Xs=[0,218828297,437656594,387781147,875313188,958871085,775562294,590424639,1750626376,1699970625,1917742170,2135253587,1551124588,1367295589,1180849278,1265195639,3501252752,3720081049,3399941250,3350065803,3835484340,3919042237,4270507174,4085369519,3102249176,3051593425,2734591178,2952102595,2361698556,2177869557,2530391278,2614737639,3145456443,3060847922,2708326185,2892417312,2404901663,2187128086,2504130317,2555048196,3542330227,3727205754,3375740769,3292445032,3876557655,3926170974,4246310725,4027744588,1808481195,1723872674,1910319033,2094410160,1608975247,1391201670,1173430173,1224348052,59984867,244860394,428169201,344873464,935293895,984907214,766078933,547512796,1844882806,1627235199,2011214180,2062270317,1507497298,1423022939,1137477952,1321699145,95345982,145085239,532201772,313773861,830661914,1015671571,731183368,648017665,3175501286,2957853679,2807058932,2858115069,2305455554,2220981195,2474404304,2658625497,3575528878,3625268135,3473416636,3254988725,3778151818,3963161475,4213447064,4130281361,3599595085,3683022916,3432737375,3247465558,3802222185,4020912224,4172763771,4122762354,3201631749,3017672716,2764249623,2848461854,2331590177,2280796200,2431590963,2648976442,104699613,188127444,472615631,287343814,840019705,1058709744,671593195,621591778,1852171925,1668212892,1953757831,2037970062,1514790577,1463996600,1080017571,1297403050,3673637356,3623636965,3235995134,3454686199,4007360968,3822090177,4107101658,4190530515,2997825956,3215212461,2830708150,2779915199,2256734592,2340947849,2627016082,2443058075,172466556,122466165,273792366,492483431,1047239e3,861968209,612205898,695634755,1646252340,1863638845,2013908262,1963115311,1446242576,1530455833,1277555970,1093597963,1636604631,1820824798,2073724613,1989249228,1436590835,1487645946,1337376481,1119727848,164948639,81781910,331544205,516552836,1039717051,821288114,669961897,719700128,2973530695,3157750862,2871682645,2787207260,2232435299,2283490410,2667994737,2450346104,3647212047,3564045318,3279033885,3464042516,3980931627,3762502690,4150144569,4199882800,3070356634,3121275539,2904027272,2686254721,2200818878,2384911031,2570832044,2486224549,3747192018,3528626907,3310321856,3359936201,3950355702,3867060991,4049844452,4234721005,1739656202,1790575107,2108100632,1890328081,1402811438,1586903591,1233856572,1149249077,266959938,48394827,369057872,418672217,1002783846,919489135,567498868,752375421,209336225,24197544,376187827,459744698,945164165,895287692,574624663,793451934,1679968233,1764313568,2117360635,1933530610,1343127501,1560637892,1243112415,1192455638,3704280881,3519142200,3336358691,3419915562,3907448597,3857572124,4075877127,4294704398,3029510009,3113855344,2927934315,2744104290,2159976285,2377486676,2594734927,2544078150],Ys=[0,151849742,303699484,454499602,607398968,758720310,908999204,1059270954,1214797936,1097159550,1517440620,1400849762,1817998408,1699839814,2118541908,2001430874,2429595872,2581445614,2194319100,2345119218,3034881240,3186202582,2801699524,2951971274,3635996816,3518358430,3399679628,3283088770,4237083816,4118925222,4002861748,3885750714,1002142683,850817237,698445255,548169417,529487843,377642221,227885567,77089521,1943217067,2061379749,1640576439,1757691577,1474760595,1592394909,1174215055,1290801793,2875968315,2724642869,3111247143,2960971305,2405426947,2253581325,2638606623,2487810577,3808662347,3926825029,4044981591,4162096729,3342319475,3459953789,3576539503,3693126241,1986918061,2137062819,1685577905,1836772287,1381620373,1532285339,1078185097,1229899655,1040559837,923313619,740276417,621982671,439452389,322734571,137073913,19308535,3871163981,4021308739,4104605777,4255800159,3263785589,3414450555,3499326569,3651041127,2933202493,2815956275,3167684641,3049390895,2330014213,2213296395,2566595609,2448830231,1305906550,1155237496,1607244650,1455525988,1776460110,1626319424,2079897426,1928707164,96392454,213114376,396673818,514443284,562755902,679998e3,865136418,983426092,3708173718,3557504664,3474729866,3323011204,4180808110,4030667424,3945269170,3794078908,2507040230,2623762152,2272556026,2390325492,2975484382,3092726480,2738905026,2857194700,3973773121,3856137295,4274053469,4157467219,3371096953,3252932727,3673476453,3556361835,2763173681,2915017791,3064510765,3215307299,2156299017,2307622919,2459735317,2610011675,2081048481,1963412655,1846563261,1729977011,1480485785,1362321559,1243905413,1126790795,878845905,1030690015,645401037,796197571,274084841,425408743,38544885,188821243,3613494426,3731654548,3313212038,3430322568,4082475170,4200115116,3780097726,3896688048,2668221674,2516901860,2366882550,2216610296,3141400786,2989552604,2837966542,2687165888,1202797690,1320957812,1437280870,1554391400,1669664834,1787304780,1906247262,2022837584,265905162,114585348,499347990,349075736,736970802,585122620,972512814,821712160,2595684844,2478443234,2293045232,2174754046,3196267988,3079546586,2895723464,2777952454,3537852828,3687994002,3234156416,3385345166,4142626212,4293295786,3841024952,3992742070,174567692,57326082,410887952,292596766,777231668,660510266,1011452712,893681702,1108339068,1258480242,1343618912,1494807662,1715193156,1865862730,1948373848,2100090966,2701949495,2818666809,3004591147,3122358053,2235061775,2352307457,2535604243,2653899549,3915653703,3764988233,4219352155,4067639125,3444575871,3294430577,3746175075,3594982253,836553431,953270745,600235211,718002117,367585007,484830689,133361907,251657213,2041877159,1891211689,1806599355,1654886325,1568718495,1418573201,1335535747,1184342925];function ba(e){const t=[];for(let n=0;n<e.length;n+=4)t.push(e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3]);return t}class Aa{get key(){return pe(this,An,"f").slice()}constructor(t){if(An.set(this,void 0),Te.set(this,void 0),_e.set(this,void 0),!(this instanceof Aa))throw Error("AES must be instanitated with `new`");ua(this,An,new Uint8Array(t),"f");const n=Os[this.key.length];if(n==null)throw new TypeError("invalid key size (must be 16, 24 or 32 bytes)");ua(this,_e,[],"f"),ua(this,Te,[],"f");for(let d=0;d<=n;d++)pe(this,_e,"f").push([0,0,0,0]),pe(this,Te,"f").push([0,0,0,0]);const a=(n+1)*4,r=this.key.length/4,o=ba(this.key);let s;for(let d=0;d<r;d++)s=d>>2,pe(this,_e,"f")[s][d%4]=o[d],pe(this,Te,"f")[n-s][d%4]=o[d];let i=0,c=r,u;for(;c<a;){if(u=o[r-1],o[0]^=Se[u>>16&255]<<24^Se[u>>8&255]<<16^Se[u&255]<<8^Se[u>>24&255]^Ws[i]<<24,i+=1,r!=8)for(let p=1;p<r;p++)o[p]^=o[p-1];else{for(let p=1;p<r/2;p++)o[p]^=o[p-1];u=o[r/2-1],o[r/2]^=Se[u&255]^Se[u>>8&255]<<8^Se[u>>16&255]<<16^Se[u>>24&255]<<24;for(let p=r/2+1;p<r;p++)o[p]^=o[p-1]}let d=0,b,f;for(;d<r&&c<a;)b=c>>2,f=c%4,pe(this,_e,"f")[b][f]=o[d],pe(this,Te,"f")[n-b][f]=o[d++],c++}for(let d=1;d<n;d++)for(let b=0;b<4;b++)u=pe(this,Te,"f")[d][b],pe(this,Te,"f")[d][b]=Gs[u>>24&255]^zs[u>>16&255]^Xs[u>>8&255]^Ys[u&255]}encrypt(t){if(t.length!=16)throw new TypeError("invalid plaintext size (must be 16 bytes)");const n=pe(this,_e,"f").length-1,a=[0,0,0,0];let r=ba(t);for(let i=0;i<4;i++)r[i]^=pe(this,_e,"f")[0][i];for(let i=1;i<n;i++){for(let c=0;c<4;c++)a[c]=_s[r[c]>>24&255]^Ns[r[(c+1)%4]>>16&255]^qs[r[(c+2)%4]>>8&255]^Hs[r[(c+3)%4]&255]^pe(this,_e,"f")[i][c];r=a.slice()}const o=new Uint8Array(16);let s=0;for(let i=0;i<4;i++)s=pe(this,_e,"f")[n][i],o[4*i]=(Se[r[i]>>24&255]^s>>24)&255,o[4*i+1]=(Se[r[(i+1)%4]>>16&255]^s>>16)&255,o[4*i+2]=(Se[r[(i+2)%4]>>8&255]^s>>8)&255,o[4*i+3]=(Se[r[(i+3)%4]&255]^s)&255;return o}decrypt(t){if(t.length!=16)throw new TypeError("invalid ciphertext size (must be 16 bytes)");const n=pe(this,Te,"f").length-1,a=[0,0,0,0];let r=ba(t);for(let i=0;i<4;i++)r[i]^=pe(this,Te,"f")[0][i];for(let i=1;i<n;i++){for(let c=0;c<4;c++)a[c]=Us[r[c]>>24&255]^js[r[(c+3)%4]>>16&255]^Ks[r[(c+2)%4]>>8&255]^Vs[r[(c+1)%4]&255]^pe(this,Te,"f")[i][c];r=a.slice()}const o=new Uint8Array(16);let s=0;for(let i=0;i<4;i++)s=pe(this,Te,"f")[n][i],o[4*i]=(Tn[r[i]>>24&255]^s>>24)&255,o[4*i+1]=(Tn[r[(i+3)%4]>>16&255]^s>>16)&255,o[4*i+2]=(Tn[r[(i+2)%4]>>8&255]^s>>8)&255,o[4*i+3]=(Tn[r[(i+1)%4]&255]^s)&255;return o}}An=new WeakMap,Te=new WeakMap,_e=new WeakMap;class tr{constructor(t,n,a){if(a&&!(this instanceof a))throw new Error(`${t} must be instantiated with "new"`);Object.defineProperties(this,{aes:{enumerable:!0,value:new Aa(n)},name:{enumerable:!0,value:t}})}}var Cn=function(e,t,n,a,r){if(a==="m")throw new TypeError("Private method is not writable");if(a==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof t=="function"?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return a==="a"?r.call(e,n):r?r.value=n:t.set(e,n),n},Ct=function(e,t,n,a){if(n==="a"&&!a)throw new TypeError("Private accessor was defined without a getter");if(typeof t=="function"?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?a:n==="a"?a.call(e):a?a.value:t.get(e)},Zt,Xe;class La extends tr{constructor(t,n){if(super("ECC",t,La),Zt.set(this,void 0),Xe.set(this,void 0),n){if(n.length%16)throw new TypeError("invalid iv size (must be 16 bytes)");Cn(this,Zt,new Uint8Array(n),"f")}else Cn(this,Zt,new Uint8Array(16),"f");Cn(this,Xe,this.iv,"f")}get iv(){return new Uint8Array(Ct(this,Zt,"f"))}encrypt(t){if(t.length%16)throw new TypeError("invalid plaintext size (must be multiple of 16 bytes)");const n=new Uint8Array(t.length);for(let a=0;a<t.length;a+=16){for(let r=0;r<16;r++)Ct(this,Xe,"f")[r]^=t[a+r];Cn(this,Xe,this.aes.encrypt(Ct(this,Xe,"f")),"f"),n.set(Ct(this,Xe,"f"),a)}return n}decrypt(t){if(t.length%16)throw new TypeError("invalid ciphertext size (must be multiple of 16 bytes)");const n=new Uint8Array(t.length);for(let a=0;a<t.length;a+=16){const r=this.aes.decrypt(t.subarray(a,a+16));for(let o=0;o<16;o++)n[a+o]=r[o]^Ct(this,Xe,"f")[o],Ct(this,Xe,"f")[o]=t[a+o]}return n}}Zt=new WeakMap,Xe=new WeakMap;var Bt=function(e,t,n,a,r){if(a==="m")throw new TypeError("Private method is not writable");if(a==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof t=="function"?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return a==="a"?r.call(e,n):r?r.value=n:t.set(e,n),n},Ee=function(e,t,n,a){if(n==="a"&&!a)throw new TypeError("Private accessor was defined without a getter");if(typeof t=="function"?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?a:n==="a"?a.call(e):a?a.value:t.get(e)},Qt,ct,Ce;class Wt extends tr{constructor(t,n){super("CTR",t,Wt),Qt.set(this,void 0),ct.set(this,void 0),Ce.set(this,void 0),Bt(this,Ce,new Uint8Array(16),"f"),Ee(this,Ce,"f").fill(0),Bt(this,Qt,Ee(this,Ce,"f"),"f"),Bt(this,ct,16,"f"),n==null&&(n=1),typeof n=="number"?this.setCounterValue(n):this.setCounterBytes(n)}get counter(){return new Uint8Array(Ee(this,Ce,"f"))}setCounterValue(t){if(!Number.isInteger(t)||t<0||t>Number.MAX_SAFE_INTEGER)throw new TypeError("invalid counter initial integer value");for(let n=15;n>=0;--n)Ee(this,Ce,"f")[n]=t%256,t=Math.floor(t/256)}setCounterBytes(t){if(t.length!==16)throw new TypeError("invalid counter initial Uint8Array value length");Ee(this,Ce,"f").set(t)}increment(){for(let t=15;t>=0;t--)if(Ee(this,Ce,"f")[t]===255)Ee(this,Ce,"f")[t]=0;else{Ee(this,Ce,"f")[t]++;break}}encrypt(t){var n,a;const r=new Uint8Array(t);for(let o=0;o<r.length;o++)Ee(this,ct,"f")===16&&(Bt(this,Qt,this.aes.encrypt(Ee(this,Ce,"f")),"f"),Bt(this,ct,0,"f"),this.increment()),r[o]^=Ee(this,Qt,"f")[Bt(this,ct,(a=Ee(this,ct,"f"),n=a++,a),"f"),n];return r}decrypt(t){return this.encrypt(t)}}Qt=new WeakMap,ct=new WeakMap,Ce=new WeakMap;function Js(e){if(e.length<16)throw new TypeError("PKCS#7 invalid length");const t=e[e.length-1];if(t>16)throw new TypeError("PKCS#7 padding byte out of range");const n=e.length-t;for(let a=0;a<t;a++)if(e[n+a]!==t)throw new TypeError("PKCS#7 invalid padding byte");return new Uint8Array(e.subarray(0,n))}function nr(e){return typeof e=="string"&&!e.startsWith("0x")&&(e="0x"+e),C0(e)}function Jt(e,t){for(e=String(e);e.length<t;)e="0"+e;return e}function hn(e){return typeof e=="string"?ht(e,"NFKC"):C0(e)}function ie(e,t){const n=t.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);N(n!=null,"invalid path","path",t);const a=n[1],r=n[3],o=n[4]==="!";let s=e;for(const i of a.toLowerCase().split(".")){if(Array.isArray(s)){if(!i.match(/^[0-9]+$/))break;s=s[parseInt(i)]}else if(typeof s=="object"){let c=null;for(const u in s)if(u.toLowerCase()===i){c=s[u];break}s=c}else s=null;if(s==null)break}if(N(!o||s!=null,"missing required value","path",a),r&&s!=null){if(r==="int"){if(typeof s=="string"&&s.match(/^-?[0-9]+$/))return parseInt(s);if(Number.isSafeInteger(s))return s}if(r==="number"&&typeof s=="string"&&s.match(/^-?[0-9.]*$/))return parseFloat(s);if(r==="data"&&typeof s=="string")return nr(s);if(r==="array"&&Array.isArray(s)||r===typeof s)return s;N(!1,`wrong type found for ${r} `,"path",a)}return s}const ar="m/44'/60'/0'/0/0";function e0(e){try{const t=JSON.parse(e);if((t.version!=null?parseInt(t.version):0)===3)return!0}catch{}return!1}function Zs(e,t,n){if(ie(e,"crypto.cipher:string")==="aes-128-ctr"){const r=ie(e,"crypto.cipherparams.iv:data!"),o=new Wt(t,r);return Q(o.decrypt(n))}Qe(!1,"unsupported cipher","UNSUPPORTED_OPERATION",{operation:"decrypt"})}function Fn(e,t){const n=G(t),a=ie(e,"crypto.ciphertext:data!"),r=Q(Kn(De([n.slice(16,32),a]))).substring(2);N(r===ie(e,"crypto.mac:string!").toLowerCase(),"incorrect password","password","[ REDACTED ]");const o=Zs(e,n.slice(0,16),a),s=Vn(o);if(e.address){let u=e.address.toLowerCase();u.startsWith("0x")||(u="0x"+u),N(Dt(u)===s,"keystore address/privateKey mismatch","address",e.address)}const i={address:s,privateKey:o};if(ie(e,"x-ethers.version:string")==="0.1"){const u=n.slice(32,64),d=ie(e,"x-ethers.mnemonicCiphertext:data!"),b=ie(e,"x-ethers.mnemonicCounter:data!"),f=new Wt(u,b);i.mnemonic={path:ie(e,"x-ethers.path:string")||ar,locale:ie(e,"x-ethers.locale:string")||"en",entropy:Q(G(f.decrypt(d)))}}return i}function rr(e){const t=ie(e,"crypto.kdf:string");if(t&&typeof t=="string"){if(t.toLowerCase()==="scrypt"){const n=ie(e,"crypto.kdfparams.salt:data!"),a=ie(e,"crypto.kdfparams.n:int!"),r=ie(e,"crypto.kdfparams.r:int!"),o=ie(e,"crypto.kdfparams.p:int!");N(a>0&&(a&a-1)===0,"invalid kdf.N","kdf.N",a),N(r>0&&o>0,"invalid kdf","kdf",t);const s=ie(e,"crypto.kdfparams.dklen:int!");return N(s===32,"invalid kdf.dklen","kdf.dflen",s),{name:"scrypt",salt:n,N:a,r,p:o,dkLen:64}}else if(t.toLowerCase()==="pbkdf2"){const n=ie(e,"crypto.kdfparams.salt:data!"),a=ie(e,"crypto.kdfparams.prf:string!"),r=a.split("-").pop();N(r==="sha256"||r==="sha512","invalid kdf.pdf","kdf.pdf",a);const o=ie(e,"crypto.kdfparams.c:int!"),s=ie(e,"crypto.kdfparams.dklen:int!");return N(s===32,"invalid kdf.dklen","kdf.dklen",s),{name:"pbkdf2",salt:n,count:o,dkLen:s,algorithm:r}}}N(!1,"unsupported key-derivation function","kdf",t)}function Qs(e,t){const n=JSON.parse(e),a=hn(t),r=rr(n);if(r.name==="pbkdf2"){const{salt:b,count:f,dkLen:p,algorithm:h}=r,m=rt(a,b,f,p,h);return Fn(n,m)}Qe(r.name==="scrypt","cannot be reached","UNKNOWN_ERROR",{params:r});const{salt:o,N:s,r:i,p:c,dkLen:u}=r,d=Kt(a,o,s,i,c,u);return Fn(n,d)}function t0(e){return new Promise(t=>{setTimeout(()=>{t()},e)})}async function ei(e,t,n){const a=JSON.parse(e),r=hn(t),o=rr(a);if(o.name==="pbkdf2"){n&&(n(0),await t0(0));const{salt:f,count:p,dkLen:h,algorithm:m}=o,v=rt(r,f,p,h,m);return n&&(n(1),await t0(0)),Fn(a,v)}Qe(o.name==="scrypt","cannot be reached","UNKNOWN_ERROR",{params:o});const{salt:s,N:i,r:c,p:u,dkLen:d}=o,b=await jt(r,s,i,c,u,d,n);return Fn(a,b)}function or(e){const t=e.salt!=null?G(e.salt,"options.salt"):He(32);let n=1<<17,a=8,r=1;return e.scrypt&&(e.scrypt.N&&(n=e.scrypt.N),e.scrypt.r&&(a=e.scrypt.r),e.scrypt.p&&(r=e.scrypt.p)),N(typeof n=="number"&&n>0&&Number.isSafeInteger(n)&&(BigInt(n)&BigInt(n-1))===BigInt(0),"invalid scrypt N parameter","options.N",n),N(typeof a=="number"&&a>0&&Number.isSafeInteger(a),"invalid scrypt r parameter","options.r",a),N(typeof r=="number"&&r>0&&Number.isSafeInteger(r),"invalid scrypt p parameter","options.p",r),{name:"scrypt",dkLen:32,salt:t,N:n,r:a,p:r}}function sr(e,t,n,a){const r=G(n.privateKey,"privateKey"),o=a.iv!=null?G(a.iv,"options.iv"):He(16);N(o.length===16,"invalid options.iv length","options.iv",a.iv);const s=a.uuid!=null?G(a.uuid,"options.uuid"):He(16);N(s.length===16,"invalid options.uuid length","options.uuid",a.iv);const i=e.slice(0,16),c=e.slice(16,32),u=new Wt(i,o),d=G(u.encrypt(r)),b=Kn(De([c,d])),f={address:n.address.substring(2).toLowerCase(),id:us(s),version:3,Crypto:{cipher:"aes-128-ctr",cipherparams:{iv:Q(o).substring(2)},ciphertext:Q(d).substring(2),kdf:"scrypt",kdfparams:{salt:Q(t.salt).substring(2),n:t.N,dklen:32,p:t.p,r:t.r},mac:b.substring(2)}};if(n.mnemonic){const p=a.client!=null?a.client:`ethers/${rs}`,h=n.mnemonic.path||ar,m=n.mnemonic.locale||"en",v=e.slice(32,64),g=G(n.mnemonic.entropy,"account.mnemonic.entropy"),$=He(16),T=new Wt(v,$),S=G(T.encrypt(g)),E=new Date,M="UTC--"+(E.getUTCFullYear()+"-"+Jt(E.getUTCMonth()+1,2)+"-"+Jt(E.getUTCDate(),2)+"T"+Jt(E.getUTCHours(),2)+"-"+Jt(E.getUTCMinutes(),2)+"-"+Jt(E.getUTCSeconds(),2)+".0Z")+"--"+f.address;f["x-ethers"]={client:p,gethFilename:M,path:h,locale:m,mnemonicCounter:Q($).substring(2),mnemonicCiphertext:Q(S).substring(2),version:"0.1"}}return JSON.stringify(f)}function ir(e,t,n){n==null&&(n={});const a=hn(t),r=or(n),o=Kt(a,r.salt,r.N,r.r,r.p,64);return sr(G(o),r,e,n)}async function lr(e,t,n){n==null&&(n={});const a=hn(t),r=or(n),o=await jt(a,r.salt,r.N,r.r,r.p,64,n.progressCallback);return sr(G(o),r,e,n)}const fa="m/44'/60'/0'/0/0",ti=new Uint8Array([66,105,116,99,111,105,110,32,115,101,101,100]),at=2147483648,ni=BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),ai="0123456789abcdef";function On(e,t){let n="";for(;e;)n=ai[e%16]+n,e=Math.trunc(e/16);for(;n.length<t*2;)n="0"+n;return"0x"+n}function xa(e){const t=G(e),n=Ta(Ft(Ft(t)),0,4),a=De([t,n]);return cs(a)}const Ne={};function cr(e,t,n,a){const r=new Uint8Array(37);e&at?(Qe(a!=null,"cannot derive child of neutered node","UNSUPPORTED_OPERATION",{operation:"deriveChild"}),r.set(G(a),1)):r.set(G(n));for(let s=24;s>=0;s-=8)r[33+(s>>3)]=e>>24-s&255;const o=G(Ht("sha512",t,r));return{IL:o.slice(0,32),IR:o.slice(32)}}function dr(e,t){const n=t.split("/");N(n.length>0,"invalid path","path",t),n[0]==="m"&&(N(e.depth===0,`cannot derive root path (i.e. path starting with "m/") for a node at non-zero depth ${e.depth}`,"path",t),n.shift());let a=e;for(let r=0;r<n.length;r++){const o=n[r];if(o.match(/^[0-9]+'$/)){const s=parseInt(o.substring(0,o.length-1));N(s<at,"invalid path index",`path[${r}]`,o),a=a.deriveChild(at+s)}else if(o.match(/^[0-9]+$/)){const s=parseInt(o);N(s<at,"invalid path index",`path[${r}]`,o),a=a.deriveChild(s)}else N(!1,"invalid path component",`path[${r}]`,o)}return a}var fn,va,pt,en;const Ie=class Ie extends Mn{constructor(n,a,r,o,s,i,c,u,d){super(a,d);Le(this,fn);ne(this,"publicKey");ne(this,"fingerprint");ne(this,"parentFingerprint");ne(this,"mnemonic");ne(this,"chainCode");ne(this,"path");ne(this,"index");ne(this,"depth");Ea(n,Ne,"HDNodeWallet"),Ze(this,{publicKey:a.compressedPublicKey});const b=Ta(Ut(Ft(this.publicKey)),0,4);Ze(this,{parentFingerprint:r,fingerprint:b,chainCode:o,path:s,index:i,depth:c}),Ze(this,{mnemonic:u})}connect(n){return new Ie(Ne,this.signingKey,this.parentFingerprint,this.chainCode,this.path,this.index,this.depth,this.mnemonic,n)}async encrypt(n,a){return await lr(Pe(this,fn,va).call(this),n,{progressCallback:a})}encryptSync(n){return ir(Pe(this,fn,va).call(this),n)}get extendedKey(){return Qe(this.depth<256,"Depth too deep","UNSUPPORTED_OPERATION",{operation:"extendedKey"}),xa(De(["0x0488ADE4",On(this.depth,1),this.parentFingerprint,On(this.index,4),this.chainCode,De(["0x00",this.privateKey])]))}hasPath(){return this.path!=null}neuter(){return new rn(Ne,this.address,this.publicKey,this.parentFingerprint,this.chainCode,this.path,this.index,this.depth,this.provider)}deriveChild(n){const a=B0(n,"index");N(a<=4294967295,"invalid index","index",a);let r=this.path;r&&(r+="/"+(a&~at),a&at&&(r+="'"));const{IR:o,IL:s}=cr(a,this.chainCode,this.publicKey,this.privateKey),i=new tn(os((ss(s)+BigInt(this.privateKey))%ni,32));return new Ie(Ne,i,this.fingerprint,Q(o),r,a,this.depth+1,this.mnemonic,this.provider)}derivePath(n){return dr(this,n)}static fromExtendedKey(n){const a=Pn(ls(n));N(a.length===82||xa(a.slice(0,78))===n,"invalid extended key","extendedKey","[ REDACTED ]");const r=a[4],o=Q(a.slice(5,9)),s=parseInt(Q(a.slice(9,13)).substring(2),16),i=Q(a.slice(13,45)),c=a.slice(45,78);switch(Q(a.slice(0,4))){case"0x0488b21e":case"0x043587cf":{const u=Q(c);return new rn(Ne,Vn(u),u,o,i,null,s,r,null)}case"0x0488ade4":case"0x04358394 ":if(c[0]!==0)break;return new Ie(Ne,new tn(c.slice(1)),o,i,null,s,r,null,null)}N(!1,"invalid extended key prefix","extendedKey","[ REDACTED ]")}static createRandom(n,a,r){var s;n==null&&(n=""),a==null&&(a=fa),r==null&&(r=mt.wordlist());const o=Ot.fromEntropy(He(16),n,r);return Pe(s=Ie,pt,en).call(s,o.computeSeed(),o).derivePath(a)}static fromMnemonic(n,a){var r;return a||(a=fa),Pe(r=Ie,pt,en).call(r,n.computeSeed(),n).derivePath(a)}static fromPhrase(n,a,r,o){var i;a==null&&(a=""),r==null&&(r=fa),o==null&&(o=mt.wordlist());const s=Ot.fromPhrase(n,a,o);return Pe(i=Ie,pt,en).call(i,s.computeSeed(),s).derivePath(r)}static fromSeed(n){var a;return Pe(a=Ie,pt,en).call(a,n,null)}};fn=new WeakSet,va=function(){const n={address:this.address,privateKey:this.privateKey},a=this.mnemonic;return this.path&&a&&a.wordlist.locale==="en"&&a.password===""&&(n.mnemonic={path:this.path,locale:"en",entropy:a.entropy}),n},pt=new WeakSet,en=function(n,a){N(is(n),"invalid seed","seed","[REDACTED]");const r=G(n,"seed");N(r.length>=16&&r.length<=64,"invalid seed","seed","[REDACTED]");const o=G(Ht("sha512",ti,r)),s=new tn(Q(o.slice(0,32)));return new Ie(Ne,s,"0x00000000",Q(o.slice(32)),"m",0,0,a,null)},Le(Ie,pt);let nn=Ie;class rn extends ds{constructor(n,a,r,o,s,i,c,u,d){super(a,d);ne(this,"publicKey");ne(this,"fingerprint");ne(this,"parentFingerprint");ne(this,"chainCode");ne(this,"path");ne(this,"index");ne(this,"depth");Ea(n,Ne,"HDNodeVoidWallet"),Ze(this,{publicKey:r});const b=Ta(Ut(Ft(r)),0,4);Ze(this,{publicKey:r,fingerprint:b,parentFingerprint:o,chainCode:s,path:i,index:c,depth:u})}connect(n){return new rn(Ne,this.address,this.publicKey,this.parentFingerprint,this.chainCode,this.path,this.index,this.depth,n)}get extendedKey(){return Qe(this.depth<256,"Depth too deep","UNSUPPORTED_OPERATION",{operation:"extendedKey"}),xa(De(["0x0488B21E",On(this.depth,1),this.parentFingerprint,On(this.index,4),this.chainCode,this.publicKey]))}hasPath(){return this.path!=null}deriveChild(n){const a=B0(n,"index");N(a<=4294967295,"invalid index","index",a);let r=this.path;r&&(r+="/"+(a&~at),a&at&&(r+="'"));const{IR:o,IL:s}=cr(a,this.chainCode,this.publicKey,null),i=tn.addPoints(s,this.publicKey,!0),c=Vn(i);return new rn(Ne,c,i,this.fingerprint,Q(o),r,a,this.depth+1,this.provider)}derivePath(n){return dr(this,n)}}function n0(e){try{if(JSON.parse(e).encseed)return!0}catch{}return!1}function a0(e,t){const n=JSON.parse(e),a=hn(t),r=Dt(ie(n,"ethaddr:string!")),o=nr(ie(n,"encseed:string!"));N(o&&o.length%16===0,"invalid encseed","json",e);const s=G(rt(a,a,2e3,32,"sha256")).slice(0,16),i=o.slice(0,16),c=o.slice(16),u=new La(s,i),d=Js(G(u.decrypt(c)));let b="";for(let f=0;f<d.length;f++)b+=String.fromCharCode(d[f]);return{address:r,privateKey:Sa(b)}}function r0(e){return new Promise(t=>{setTimeout(()=>{t()},e)})}var pn,wa;const bt=class bt extends Mn{constructor(t,n){typeof t=="string"&&!t.startsWith("0x")&&(t="0x"+t);let a=typeof t=="string"?new tn(t):t;super(a,n)}connect(t){return new bt(this.signingKey,t)}async encrypt(t,n){const a={address:this.address,privateKey:this.privateKey};return await lr(a,t,{progressCallback:n})}encryptSync(t){const n={address:this.address,privateKey:this.privateKey};return ir(n,t)}static async fromEncryptedJson(t,n,a){var o;let r=null;return e0(t)?r=await ei(t,n,a):n0(t)&&(a&&(a(0),await r0(0)),r=a0(t,n),a&&(a(1),await r0(0))),Pe(o=bt,pn,wa).call(o,r)}static fromEncryptedJsonSync(t,n){var r;let a=null;return e0(t)?a=Qs(t,n):n0(t)?a=a0(t,n):N(!1,"invalid JSON wallet","json","[ REDACTED ]"),Pe(r=bt,pn,wa).call(r,a)}static createRandom(t){const n=nn.createRandom();return t?n.connect(t):n}static fromPhrase(t,n){const a=nn.fromPhrase(t);return n?a.connect(n):a}};pn=new WeakSet,wa=function(t){if(N(t,"invalid JSON wallet","json","[ REDACTED ]"),"mnemonic"in t&&t.mnemonic&&t.mnemonic.locale==="en"){const a=Ot.fromEntropy(t.mnemonic.entropy),r=nn.fromMnemonic(a,t.mnemonic.path);if(r.address===t.address&&r.privateKey===t.privateKey)return r;console.log("WARNING: JSON mismatch address/privateKey != mnemonic; fallback onto private key")}const n=new bt(t.privateKey);return N(n.address===t.address,"address/privateKey mismatch","json","[ REDACTED ]"),n},Le(bt,pn);let K=bt;const ri="modulepreload",oi=function(e){return"/"+e},o0={},Wn=function(t,n,a){let r=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));r=Promise.allSettled(n.map(c=>{if(c=oi(c),c in o0)return;o0[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const b=document.createElement("link");if(b.rel=u?"stylesheet":ri,u||(b.as="script"),b.crossOrigin="",b.href=c,i&&b.setAttribute("nonce",i),document.head.appendChild(b),u)return new Promise((f,p)=>{b.addEventListener("load",f),b.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&o(i.reason);return t().catch(o)})},si="hh-sol-artifact-1",ii="HRD",li="contracts/HRD.sol",ci=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"address",name:"_router",type:"address"},{internalType:"address",name:"_taxWallet",type:"address"},{internalType:"address",name:"_ecosystemWallet",type:"address"},{internalType:"address[]",name:"_earlyBuyers",type:"address[]"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"InsufficientBurnBalance",type:"error"},{inputs:[],name:"InvalidShortString",type:"error"},{inputs:[],name:"NotOpen",type:"error"},{inputs:[],name:"OnlyTaxWallet",type:"error"},{inputs:[{internalType:"string",name:"str",type:"string"}],name:"StringTooLong",type:"error"},{inputs:[],name:"ZeroBurnAmount",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"pair",type:"address"},{indexed:!1,internalType:"bool",name:"isPair",type:"bool"}],name:"AMMPairSet",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"spender",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[],name:"EIP712DomainChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!1,internalType:"bool",name:"allowed",type:"bool"}],name:"EarlyBuyerSet",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"tokenAmount",type:"uint256"},{indexed:!1,internalType:"uint256",name:"ethAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"lpRecipient",type:"address"}],name:"Launched",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"bool",name:"enabled",type:"bool"}],name:"SwapEnabledSet",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"swapThreshold",type:"uint256"},{indexed:!1,internalType:"uint256",name:"maxSwap",type:"uint256"},{indexed:!1,internalType:"uint256",name:"swapPoolBps",type:"uint256"}],name:"SwapSettingsSet",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!1,internalType:"bool",name:"exempt",type:"bool"}],name:"TaxExemptSet",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"buyTaxBps",type:"uint256"},{indexed:!1,internalType:"uint256",name:"sellTaxBps",type:"uint256"}],name:"TaxSet",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"taxWallet",type:"address"}],name:"TaxWalletSet",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"taxWallet",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"TokensBurned",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[],name:"DOMAIN_SEPARATOR",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[],name:"EW",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"MAX_SUPPLY",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"MAX_SWAP_POOL_BPS",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"MAX_TAX_BPS",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"amount",type:"uint256"}],name:"burn",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"buyTaxBps",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"subtractedValue",type:"uint256"}],name:"decreaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"earlyBuyerAllowed",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"ecosystemWallet",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"eip712Domain",outputs:[{internalType:"bytes1",name:"fields",type:"bytes1"},{internalType:"string",name:"name",type:"string"},{internalType:"string",name:"version",type:"string"},{internalType:"uint256",name:"chainId",type:"uint256"},{internalType:"address",name:"verifyingContract",type:"address"},{internalType:"bytes32",name:"salt",type:"bytes32"},{internalType:"uint256[]",name:"extensions",type:"uint256[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"addedValue",type:"uint256"}],name:"increaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"isAMMPair",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"lpRecipient",type:"address"}],name:"launch",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"maxSwap",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"nonces",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pair",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"value",type:"uint256"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"}],name:"permit",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"rescueETH",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"rescueToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"router",outputs:[{internalType:"contract IUniswapV2Router02",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"sellTaxBps",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"p",type:"address"},{internalType:"bool",name:"isPair",type:"bool"}],name:"setAMMPair",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"bps",type:"uint256"}],name:"setBuyTax",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"},{internalType:"bool",name:"allowed",type:"bool"}],name:"setEarlyBuyer",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"bps",type:"uint256"}],name:"setSellTax",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bool",name:"enabled",type:"bool"}],name:"setSwapEnabled",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_swapThreshold",type:"uint256"},{internalType:"uint256",name:"_maxSwap",type:"uint256"},{internalType:"uint256",name:"_swapPoolBps",type:"uint256"}],name:"setSwapSettings",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"},{internalType:"bool",name:"exempt",type:"bool"}],name:"setTaxExempt",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"w",type:"address"}],name:"setTaxWallet",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"swapEnabled",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"swapPoolBps",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"swapThreshold",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"taxExempt",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"taxWallet",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"tradingEnabled",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"tradingOpenAt",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"weth",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{stateMutability:"payable",type:"receive"}],di="0x6101c06040526064600c819055600d55620000296127106b033b2e3c9fd0803ce8000000620006e3565b600f556200004560646b033b2e3c9fd0803ce8000000620006e3565b60105560326011553480156200005a57600080fd5b5060405162003f7b38038062003f7b8339810160408190526200007d9162000806565b6040805180820190915260018152603160f81b60208201528690819081886003620000a98382620009d3565b506004620000b88282620009d3565b50620000ca91508390506005620004be565b61012052620000db816006620004be565b61014052815160208084019190912060e052815190820120610100524660a0526200016960e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506200017e33620004f7565b6001600160a01b038416158015906200019f57506001600160a01b03831615155b8015620001b457506001600160a01b03821615155b620001f25760405162461bcd60e51b81526020600482015260096024820152683d32b9379030b2323960b91b60448201526064015b60405180910390fd5b6001600160a01b038416610160819052604080516315ab88c960e31b8152905163ad5c4648916004808201926020929091908290030181865afa1580156200023e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000264919062000a9f565b6001600160a01b0390811661018052600b80546001600160a01b03191685831617905582166101a052600160136000620002a66009546001600160a01b031690565b6001600160a01b03908116825260208083019390935260409182016000908120805495151560ff1996871617905530815260139093528183208054851660019081179091558782168452828420805486168217905590861683529082208054909316179091555b8151811015620004505760006001600160a01b031682828151811062000337576200033762000ac4565b60200260200101516001600160a01b0316036200038a5760405162461bcd60e51b815260206004820152601060248201526f3d32b9379032b0b9363c90313abcb2b960811b6044820152606401620001e9565b600160156000848481518110620003a557620003a562000ac4565b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a81548160ff021916908315150217905550818181518110620003f957620003f962000ac4565b60200260200101516001600160a01b03167f6c0aa45d55b5046ee912685bd882464b41d23a2a15c6d7e8aa18ad62f3b2997760016040516200043f911515815260200190565b60405180910390a26001016200030d565b50600060646200046e6b033b2e3c9fd0803ce8000000600262000ada565b6200047a9190620006e3565b9050600062000496826b033b2e3c9fd0803ce800000062000af4565b9050620004a4848362000570565b620004b0308262000570565b505050505050505062000b7a565b6000602083511015620004de57620004d68362000633565b9050620004f1565b81620004eb8482620009d3565b5060ff90505b92915050565b620005028162000676565b6001600160a01b038116156200056d576001600160a01b038116600081815260136020908152604091829020805460ff1916600190811790915591519182527f8af52ca6865dd040a1247f4d247e92db436b658abb69ed82e9efa8a7de0602e9910160405180910390a25b50565b6001600160a01b038216620005c85760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401620001e9565b8060026000828254620005dc919062000b0a565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600080829050601f8151111562000661578260405163305a27a960e01b8152600401620001e9919062000b20565b80516200066e8262000b55565b179392505050565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b505050565b634e487b7160e01b600052601160045260246000fd5b6000826200070157634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171562000747576200074762000706565b604052919050565b60005b838110156200076c57818101518382015260200162000752565b50506000910152565b600082601f8301126200078757600080fd5b81516001600160401b03811115620007a357620007a362000706565b620007b8601f8201601f19166020016200071c565b818152846020838601011115620007ce57600080fd5b620007e18260208301602087016200074f565b949350505050565b80516001600160a01b03811681146200080157600080fd5b919050565b60008060008060008060c087890312156200082057600080fd5b86516001600160401b03808211156200083857600080fd5b620008468a838b0162000775565b97506020915081890151818111156200085e57600080fd5b6200086c8b828c0162000775565b9750506200087d60408a01620007e9565b95506200088d60608a01620007e9565b94506200089d60808a01620007e9565b935060a089015181811115620008b257600080fd5b8901601f81018b13620008c457600080fd5b805182811115620008d957620008d962000706565b8060051b9250620008ec8484016200071c565b818152928201840192848101908d8511156200090757600080fd5b928501925b8484101562000930576200092084620007e9565b825292850192908501906200090c565b8096505050505050509295509295509295565b600181811c908216806200095857607f821691505b6020821081036200097957634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620006c8576000816000526020600020601f850160051c81016020861015620009aa5750805b601f850160051c820191505b81811015620009cb57828155600101620009b6565b505050505050565b81516001600160401b03811115620009ef57620009ef62000706565b62000a078162000a00845462000943565b846200097f565b602080601f83116001811462000a3f576000841562000a265750858301515b600019600386901b1c1916600185901b178555620009cb565b600085815260208120601f198616915b8281101562000a705788860151825594840194600190910190840162000a4f565b508582101562000a8f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020828403121562000ab257600080fd5b62000abd82620007e9565b9392505050565b634e487b7160e01b600052603260045260246000fd5b8082028115828204841417620004f157620004f1620006cd565b81810381811115620004f157620004f1620006cd565b80820180821115620004f157620004f1620006cd565b602081526000825180602084015262000b418160408501602087016200074f565b601f01601f19169190910160400192915050565b80516020808301519190811015620009795760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a05161333f62000c3c6000396000818161058801526119f301526000818161053401528181610de901528181610e8f01528181610f47015261260a01526000818161091401528181610d4c01528181611074015281816110d90152818161266201526126a1015260006115a201526000611577015260006120b00152600061208801526000611fe30152600061200d01526000612037015261333f6000f3fe6080604052600436106102cd5760003560e01c8063715018a611610175578063b0249cc6116100dc578063dc1052e211610095578063ea414b281161006f578063ea414b28146108ac578063eca7e081146108cc578063f2fde38b146108e2578063f887ea401461090257600080fd5b8063dc1052e21461084c578063dd62ed3e1461086c578063e01af92c1461088c57600080fd5b8063b0249cc61461078a578063c473413a146107ba578063c4918b4e146107d0578063cffd129c146107e6578063d1ecfc68146107fc578063d505accf1461082c57600080fd5b80638cd09d501161012e5780638cd09d50146106d75780638da5cb5b146106f757806395d89b4114610715578063a457c2d71461072a578063a8aa1b311461074a578063a9059cbb1461076a57600080fd5b8063715018a61461062f5780637ce65663146106445780637ecebe0014610659578063819542c51461067957806384b0196e1461069957806387b20b63146106c157600080fd5b80632dc0562d116102345780633fc8cef3116101ed5780634ada218b116101c75780634ada218b146105aa5780636ddd1713146105c45780636e5045a7146105e357806370a08231146105f957600080fd5b80633fc8cef31461052257806342966c6814610556578063435263ef1461057657600080fd5b80632dc0562d14610459578063313ce5671461049157806332cb6b0c146104ad57806333f3d628146104cd5780633644e515146104ed578063395093511461050257600080fd5b80631e4efe51116102865780631e4efe51146103ab57806320800a00146103db578063214013ca146103f057806323b872dd146104035780632c597de9146104235780632d99d32e1461043957600080fd5b80630445b667146102d957806306fdde0314610302578063095ea7b31461032457806316b176a61461035457806318160ddd146103765780631dc610401461038b57600080fd5b366102d457005b600080fd5b3480156102e557600080fd5b506102ef600f5481565b6040519081526020015b60405180910390f35b34801561030e57600080fd5b50610317610936565b6040516102f99190612dd5565b34801561033057600080fd5b5061034461033f366004612e04565b6109c8565b60405190151581526020016102f9565b34801561036057600080fd5b5061037461036f366004612e30565b6109e2565b005b34801561038257600080fd5b506002546102ef565b34801561039757600080fd5b506103746103a6366004612e6a565b610b15565b3480156103b757600080fd5b506103446103c6366004612ea3565b60156020526000908152604090205460ff1681565b3480156103e757600080fd5b50610374610b91565b6103746103fe366004612ea3565b610c7a565b34801561040f57600080fd5b5061034461041e366004612ec0565b61121e565b34801561042f57600080fd5b506102ef61019081565b34801561044557600080fd5b50610374610454366004612e6a565b611242565b34801561046557600080fd5b50600b54610479906001600160a01b031681565b6040516001600160a01b0390911681526020016102f9565b34801561049d57600080fd5b50604051601281526020016102f9565b3480156104b957600080fd5b506102ef6b033b2e3c9fd0803ce800000081565b3480156104d957600080fd5b506103746104e8366004612e04565b6112c8565b3480156104f957600080fd5b506102ef61137b565b34801561050e57600080fd5b5061034461051d366004612e04565b61138a565b34801561052e57600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b34801561056257600080fd5b50610374610571366004612f01565b6113ac565b34801561058257600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b3480156105b657600080fd5b50600e546103449060ff1681565b3480156105d057600080fd5b50600e5461034490610100900460ff1681565b3480156105ef57600080fd5b506102ef60115481565b34801561060557600080fd5b506102ef610614366004612ea3565b6001600160a01b031660009081526020819052604090205490565b34801561063b57600080fd5b5061037461146b565b34801561065057600080fd5b506102ef60b481565b34801561066557600080fd5b506102ef610674366004612ea3565b61147f565b34801561068557600080fd5b50610374610694366004612e6a565b61149d565b3480156106a557600080fd5b506106ae611569565b6040516102f99796959493929190612f1a565b3480156106cd57600080fd5b506102ef60165481565b3480156106e357600080fd5b506103746106f2366004612f01565b6115f2565b34801561070357600080fd5b506009546001600160a01b0316610479565b34801561072157600080fd5b5061031761167a565b34801561073657600080fd5b50610344610745366004612e04565b611689565b34801561075657600080fd5b50600a54610479906001600160a01b031681565b34801561077657600080fd5b50610344610785366004612e04565b611704565b34801561079657600080fd5b506103446107a5366004612ea3565b60146020526000908152604090205460ff1681565b3480156107c657600080fd5b506102ef600c5481565b3480156107dc57600080fd5b506102ef60105481565b3480156107f257600080fd5b506102ef600d5481565b34801561080857600080fd5b50610344610817366004612ea3565b60136020526000908152604090205460ff1681565b34801561083857600080fd5b50610374610847366004612fb3565b611712565b34801561085857600080fd5b50610374610867366004612f01565b611876565b34801561087857600080fd5b506102ef61088736600461302a565b6118f8565b34801561089857600080fd5b506103746108a7366004613058565b611923565b3480156108b857600080fd5b506103746108c7366004612ea3565b611974565b3480156108d857600080fd5b506102ef6103e881565b3480156108ee57600080fd5b506103746108fd366004612ea3565b611b02565b34801561090e57600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b60606003805461094590613075565b80601f016020809104026020016040519081016040528092919081815260200182805461097190613075565b80156109be5780601f10610993576101008083540402835291602001916109be565b820191906000526020600020905b8154815290600101906020018083116109a157829003601f168201915b5050505050905090565b6000336109d6818585611b7b565b60019150505b92915050565b6109ea611c9f565b60008211610a2e5760405162461bcd60e51b815260206004820152600c60248201526b07a65726f206d6178537761760a41b60448201526064015b60405180910390fd5b81831115610a745760405162461bcd60e51b815260206004820152601360248201527207468726573686f6c64203e206d61785377617606c1b6044820152606401610a25565b600081118015610a8657506103e88111155b610ac05760405162461bcd60e51b815260206004820152600b60248201526a62616420706f6f6c42707360a81b6044820152606401610a25565b600f8390556010829055601181905560408051848152602081018490529081018290527f7d2c50c9db091896f4dc8494a07ea917f538a116a5d4a3a9d236889cd8e2004a9060600160405180910390a1505050565b610b1d611c9f565b6001600160a01b038216610b435760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260136020908152604091829020805460ff191685151590811790915591519182526000805160206132ea83398151915291015b60405180910390a25050565b610b99611c9f565b4780610bd05760405162461bcd60e51b81526020600482015260066024820152650dcde408aa8960d31b6044820152606401610a25565b6000610be46009546001600160a01b031690565b6001600160a01b03168260405160006040518083038185875af1925050503d8060008114610c2e576040519150601f19603f3d011682016040523d82523d6000602084013e610c33565b606091505b5050905080610c765760405162461bcd60e51b815260206004820152600f60248201526e195d1a081cd95b990819985a5b1959608a1b6044820152606401610a25565b5050565b610c82611c9f565b600e5460ff1615610cc85760405162461bcd60e51b815260206004820152601060248201526f185b1c9958591e481b185d5b98da195960821b6044820152606401610a25565b60003411610d015760405162461bcd60e51b81526020600482015260066024820152650dcde408aa8960d31b6044820152606401610a25565b6001600160a01b038116610d485760405162461bcd60e51b815260206004820152600e60248201526d1e995c9bc81c9958da5c1a595b9d60921b6044820152606401610a25565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c45a01556040518163ffffffff1660e01b8152600401602060405180830381865afa158015610da8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dcc91906130cc565b60405163e6a4390560e01b81523060048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015291925060009183169063e6a4390590604401602060405180830381865afa158015610e3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e6291906130cc565b90506001600160a01b038116610f07576040516364e329cb60e11b81523060048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015283169063c9c65396906044016020604051808303816000875af1158015610ee0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f0491906130cc565b90505b6001600160a01b038116600090815260208190526040902054158015610fb457506040516370a0823160e01b81526001600160a01b0382811660048301527f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610f8e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fb291906130e9565b155b610ff15760405162461bcd60e51b815260206004820152600e60248201526d70616972206e6f7420656d70747960901b6044820152606401610a25565b600a80546001600160a01b0319166001600160a01b0383169081179091556000908152601460209081526040808320805460ff19166001179055308352908290529020548061106e5760405162461bcd60e51b81526020600482015260096024820152686e6f20746f6b656e7360b81b6044820152606401610a25565b611099307f000000000000000000000000000000000000000000000000000000000000000083611b7b565b60405163f305d71960e01b81523060048201526024810182905260006044820181905260648201526001600160a01b0385811660848301524260a48301527f0000000000000000000000000000000000000000000000000000000000000000169063f305d71990349060c40160606040518083038185885af1158015611123573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906111489190613102565b5050600e805461ffff19166101011790555042601655604051600181526001600160a01b038316907ff9f3066792ece7dadd967a9482836e4b52c2f9d93bb1a3db2e245bbee91db8329060200160405180910390a2604051600181527f5a9e84f78f7957cb4ed7478eb0fcad35ee4ecbe2e0f298420b28a3955392573f9060200160405180910390a1604080518281523460208201526001600160a01b0386168183015290517f04df2004516565fe8e145693f49f1cf75a97d37cff562ff51d81f1fb4e6940e09181900360600190a150505050565b60003361122c858285611cf9565b611237858585611d73565b506001949350505050565b61124a611c9f565b6001600160a01b0382166112705760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260146020908152604091829020805460ff191685151590811790915591519182527ff9f3066792ece7dadd967a9482836e4b52c2f9d93bb1a3db2e245bbee91db8329101610b85565b6112d0611c9f565b6001600160a01b0382166113135760405162461bcd60e51b815260206004820152600a6024820152693d32b937903a37b5b2b760b11b6044820152606401610a25565b306001600160a01b038316036113555760405162461bcd60e51b815260206004820152600760248201526637379039b2b63360c91b6044820152606401610a25565b610c7661136a6009546001600160a01b031690565b6001600160a01b0384169083611f84565b6000611385611fd6565b905090565b6000336109d681858561139d83836118f8565b6113a79190613146565b611b7b565b600b546001600160a01b031633146113d757604051637fdf534b60e01b815260040160405180910390fd5b806000036113f8576040516325ee753160e21b815260040160405180910390fd5b336000908152602081905260409020548111156114285760405163498a30b960e11b815260040160405180910390fd5b6114323382612101565b60405181815233907ffd38818f5291bf0bb3a2a48aadc06ba8757865d1dabd804585338aab3009dcb6906020015b60405180910390a250565b611473611c9f565b61147d6000612233565b565b6001600160a01b0381166000908152600760205260408120546109dc565b6114a5611c9f565b600e5460ff16156114eb5760405162461bcd60e51b815260206004820152601060248201526f185b1c9958591e481b185d5b98da195960821b6044820152606401610a25565b6001600160a01b0382166115115760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260156020908152604091829020805460ff191685151590811790915591519182527f6c0aa45d55b5046ee912685bd882464b41d23a2a15c6d7e8aa18ad62f3b299779101610b85565b60006060808280808361159d7f00000000000000000000000000000000000000000000000000000000000000006005612290565b6115c87f00000000000000000000000000000000000000000000000000000000000000006006612290565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b6115fa611c9f565b6101908111156116355760405162461bcd60e51b81526020600482015260066024820152656d617820342560d01b6044820152606401610a25565b600d819055600c5460408051918252602082018390527f121fab07dc109278f0ccefdafee4cd1b1ceb9cc7370bc2edc4680c5a1c0355ff91015b60405180910390a150565b60606004805461094590613075565b6000338161169782866118f8565b9050838110156116f75760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610a25565b6112378286868403611b7b565b6000336109d6818585611d73565b834211156117625760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610a25565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886117918c61233b565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006117ec82612363565b905060006117fc82878787612390565b9050896001600160a01b0316816001600160a01b03161461185f5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610a25565b61186a8a8a8a611b7b565b50505050505050505050565b61187e611c9f565b6101908111156118b95760405162461bcd60e51b81526020600482015260066024820152656d617820342560d01b6044820152606401610a25565b600c819055600d546040805183815260208101929092527f121fab07dc109278f0ccefdafee4cd1b1ceb9cc7370bc2edc4680c5a1c0355ff910161166f565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61192b611c9f565b600e80548215156101000261ff00199091161790556040517f5a9e84f78f7957cb4ed7478eb0fcad35ee4ecbe2e0f298420b28a3955392573f9061166f90831515815260200190565b61197c611c9f565b6001600160a01b0381166119a25760405162461bcd60e51b8152600401610a25906130a9565b600b546001600160a01b03166119c06009546001600160a01b031690565b6001600160a01b0316816001600160a01b0316141580156119ea57506001600160a01b0381163014155b8015611a2857507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816001600160a01b031614155b15611a6e576001600160a01b0381166000818152601360209081526040808320805460ff19169055519182526000805160206132ea833981519152910160405180910390a25b600b80546001600160a01b0319166001600160a01b038416908117909155600081815260136020908152604091829020805460ff1916600190811790915591519182526000805160206132ea833981519152910160405180910390a26040516001600160a01b038316907f847d0f7f2b16c8dd0b72c0606e65e8bf1b624633d37905b0e08145a295ab875890600090a25050565b611b0a611c9f565b6001600160a01b038116611b6f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610a25565b611b7881612233565b50565b6001600160a01b038316611bdd5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610a25565b6001600160a01b038216611c3e5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610a25565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6009546001600160a01b0316331461147d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610a25565b6000611d0584846118f8565b90506000198114611d6d5781811015611d605760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610a25565b611d6d8484848403611b7b565b50505050565b6001600160a01b0383161580611d9057506001600160a01b038216155b80611d9d575060125460ff165b80611dc057506001600160a01b03831660009081526013602052604090205460ff165b80611de357506001600160a01b03821660009081526013602052604090205460ff165b15611df857611df38383836123ba565b505050565b600e5460ff16611e405760405162461bcd60e51b81526020600482015260136024820152721d1c98591a5b99c81b9bdd08195b98589b1959606a1b6044820152606401610a25565b6001600160a01b0380841660009081526014602052604080822054928516825290205460ff9182169116818015611e84575060b4601654611e819190613146565b42105b8015611ea957506001600160a01b03841660009081526015602052604090205460ff16155b15611ec757604051631bb5f5b360e31b815260040160405180910390fd5b808015611edb5750600e54610100900460ff165b8015611ef85750600f543060009081526020819052604090205410155b15611f0557611f0561255e565b60008215611f2f57612710600c5485611f1e9190613159565b611f289190613170565b9050611f53565b8115611f5357612710600d5485611f469190613159565b611f509190613170565b90505b8015611f7157611f648630836123ba565b611f6e8185613192565b93505b611f7c8686866123ba565b505050505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052611df390849061271f565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561202f57507f000000000000000000000000000000000000000000000000000000000000000046145b1561205957507f000000000000000000000000000000000000000000000000000000000000000090565b611385604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6001600160a01b0382166121615760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610a25565b6001600160a01b038216600090815260208190526040902054818110156121d55760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610a25565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b61223c816127f4565b6001600160a01b03811615611b78576001600160a01b038116600081815260136020908152604091829020805460ff1916600190811790915591519182526000805160206132ea8339815191529101611460565b606060ff83146122aa576122a383612846565b90506109dc565b8180546122b690613075565b80601f01602080910402602001604051908101604052809291908181526020018280546122e290613075565b801561232f5780601f106123045761010080835404028352916020019161232f565b820191906000526020600020905b81548152906001019060200180831161231257829003601f168201915b505050505090506109dc565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b60006109dc612370611fd6565b8360405161190160f01b8152600281019290925260228201526042902090565b60008060006123a187878787612885565b915091506123ae81612949565b5090505b949350505050565b6001600160a01b03831661241e5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610a25565b6001600160a01b0382166124805760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610a25565b6001600160a01b038316600090815260208190526040902054818110156124f85760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610a25565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3611d6d565b6012805460ff1916600117905530600090815260208190526040812054905060105481111561258c57506010545b6000612596612a93565b9050808211156125a4578091505b816000036125b3575050612713565b60408051600280825260608201835260009260208301908036833701905050905030816000815181106125e8576125e86131a5565b60200260200101906001600160a01b031690816001600160a01b0316815250507f00000000000000000000000000000000000000000000000000000000000000008160018151811061263c5761263c6131a5565b60200260200101906001600160a01b031690816001600160a01b031681525050612687307f000000000000000000000000000000000000000000000000000000000000000085611b7b565b600b5460405163791ac94760e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263791ac947926126e39288926000928892919091169042906004016131bb565b600060405180830381600087803b1580156126fd57600080fd5b505af192505050801561270e575060015b505050505b6012805460ff19169055565b6000612774826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612bd59092919063ffffffff16565b9050805160001480612795575080806020019051810190612795919061322e565b611df35760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610a25565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6060600061285383612be4565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156128bc5750600090506003612940565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015612910573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661293957600060019250925050612940565b9150600090505b94509492505050565b600081600481111561295d5761295d61324b565b036129655750565b60018160048111156129795761297961324b565b036129c65760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a25565b60028160048111156129da576129da61324b565b03612a275760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a25565b6003816004811115612a3b57612a3b61324b565b03611b785760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a25565b600a546000906001600160a01b031680612aaf57600091505090565b600080826001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015612af0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b14919061327d565b50915091506000306001600160a01b0316846001600160a01b0316630dfe16816040518163ffffffff1660e01b8152600401602060405180830381865afa158015612b63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b8791906130cc565b6001600160a01b031603612ba557506001600160701b038216612bb1565b506001600160701b0381165b61271060115482612bc29190613159565b612bcc9190613170565b94505050505090565b60606123b28484600085612c0c565b600060ff8216601f8111156109dc57604051632cd44ac360e21b815260040160405180910390fd5b606082471015612c6d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610a25565b600080866001600160a01b03168587604051612c8991906132cd565b60006040518083038185875af1925050503d8060008114612cc6576040519150601f19603f3d011682016040523d82523d6000602084013e612ccb565b606091505b5091509150612cdc87838387612ce7565b979650505050505050565b60608315612d56578251600003612d4f576001600160a01b0385163b612d4f5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a25565b50816123b2565b6123b28383815115612d6b5781518083602001fd5b8060405162461bcd60e51b8152600401610a259190612dd5565b60005b83811015612da0578181015183820152602001612d88565b50506000910152565b60008151808452612dc1816020860160208601612d85565b601f01601f19169290920160200192915050565b602081526000612de86020830184612da9565b9392505050565b6001600160a01b0381168114611b7857600080fd5b60008060408385031215612e1757600080fd5b8235612e2281612def565b946020939093013593505050565b600080600060608486031215612e4557600080fd5b505081359360208301359350604090920135919050565b8015158114611b7857600080fd5b60008060408385031215612e7d57600080fd5b8235612e8881612def565b91506020830135612e9881612e5c565b809150509250929050565b600060208284031215612eb557600080fd5b8135612de881612def565b600080600060608486031215612ed557600080fd5b8335612ee081612def565b92506020840135612ef081612def565b929592945050506040919091013590565b600060208284031215612f1357600080fd5b5035919050565b60ff60f81b881681526000602060e06020840152612f3b60e084018a612da9565b8381036040850152612f4d818a612da9565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b81811015612fa157835183529284019291840191600101612f85565b50909c9b505050505050505050505050565b600080600080600080600060e0888a031215612fce57600080fd5b8735612fd981612def565b96506020880135612fe981612def565b95506040880135945060608801359350608088013560ff8116811461300d57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561303d57600080fd5b823561304881612def565b91506020830135612e9881612def565b60006020828403121561306a57600080fd5b8135612de881612e5c565b600181811c9082168061308957607f821691505b60208210810361235d57634e487b7160e01b600052602260045260246000fd5b6020808252600990820152683d32b9379030b2323960b91b604082015260600190565b6000602082840312156130de57600080fd5b8151612de881612def565b6000602082840312156130fb57600080fd5b5051919050565b60008060006060848603121561311757600080fd5b8351925060208401519150604084015190509250925092565b634e487b7160e01b600052601160045260246000fd5b808201808211156109dc576109dc613130565b80820281158282048414176109dc576109dc613130565b60008261318d57634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156109dc576109dc613130565b634e487b7160e01b600052603260045260246000fd5b600060a08201878352602087602085015260a0604085015281875180845260c08601915060208901935060005b8181101561320d5784516001600160a01b0316835293830193918301916001016131e8565b50506001600160a01b03969096166060850152505050608001529392505050565b60006020828403121561324057600080fd5b8151612de881612e5c565b634e487b7160e01b600052602160045260246000fd5b80516001600160701b038116811461327857600080fd5b919050565b60008060006060848603121561329257600080fd5b61329b84613261565b92506132a960208501613261565b9150604084015163ffffffff811681146132c257600080fd5b809150509250925092565b600082516132df818460208701612d85565b919091019291505056fe8af52ca6865dd040a1247f4d247e92db436b658abb69ed82e9efa8a7de0602e9a26469706673582212200b4e71c9cfa19d3b9fe7a4e376352a8fbdaabd69dbc34cdbde1a88fc52709c5864736f6c63430008180033",ui="0x6080604052600436106102cd5760003560e01c8063715018a611610175578063b0249cc6116100dc578063dc1052e211610095578063ea414b281161006f578063ea414b28146108ac578063eca7e081146108cc578063f2fde38b146108e2578063f887ea401461090257600080fd5b8063dc1052e21461084c578063dd62ed3e1461086c578063e01af92c1461088c57600080fd5b8063b0249cc61461078a578063c473413a146107ba578063c4918b4e146107d0578063cffd129c146107e6578063d1ecfc68146107fc578063d505accf1461082c57600080fd5b80638cd09d501161012e5780638cd09d50146106d75780638da5cb5b146106f757806395d89b4114610715578063a457c2d71461072a578063a8aa1b311461074a578063a9059cbb1461076a57600080fd5b8063715018a61461062f5780637ce65663146106445780637ecebe0014610659578063819542c51461067957806384b0196e1461069957806387b20b63146106c157600080fd5b80632dc0562d116102345780633fc8cef3116101ed5780634ada218b116101c75780634ada218b146105aa5780636ddd1713146105c45780636e5045a7146105e357806370a08231146105f957600080fd5b80633fc8cef31461052257806342966c6814610556578063435263ef1461057657600080fd5b80632dc0562d14610459578063313ce5671461049157806332cb6b0c146104ad57806333f3d628146104cd5780633644e515146104ed578063395093511461050257600080fd5b80631e4efe51116102865780631e4efe51146103ab57806320800a00146103db578063214013ca146103f057806323b872dd146104035780632c597de9146104235780632d99d32e1461043957600080fd5b80630445b667146102d957806306fdde0314610302578063095ea7b31461032457806316b176a61461035457806318160ddd146103765780631dc610401461038b57600080fd5b366102d457005b600080fd5b3480156102e557600080fd5b506102ef600f5481565b6040519081526020015b60405180910390f35b34801561030e57600080fd5b50610317610936565b6040516102f99190612dd5565b34801561033057600080fd5b5061034461033f366004612e04565b6109c8565b60405190151581526020016102f9565b34801561036057600080fd5b5061037461036f366004612e30565b6109e2565b005b34801561038257600080fd5b506002546102ef565b34801561039757600080fd5b506103746103a6366004612e6a565b610b15565b3480156103b757600080fd5b506103446103c6366004612ea3565b60156020526000908152604090205460ff1681565b3480156103e757600080fd5b50610374610b91565b6103746103fe366004612ea3565b610c7a565b34801561040f57600080fd5b5061034461041e366004612ec0565b61121e565b34801561042f57600080fd5b506102ef61019081565b34801561044557600080fd5b50610374610454366004612e6a565b611242565b34801561046557600080fd5b50600b54610479906001600160a01b031681565b6040516001600160a01b0390911681526020016102f9565b34801561049d57600080fd5b50604051601281526020016102f9565b3480156104b957600080fd5b506102ef6b033b2e3c9fd0803ce800000081565b3480156104d957600080fd5b506103746104e8366004612e04565b6112c8565b3480156104f957600080fd5b506102ef61137b565b34801561050e57600080fd5b5061034461051d366004612e04565b61138a565b34801561052e57600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b34801561056257600080fd5b50610374610571366004612f01565b6113ac565b34801561058257600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b3480156105b657600080fd5b50600e546103449060ff1681565b3480156105d057600080fd5b50600e5461034490610100900460ff1681565b3480156105ef57600080fd5b506102ef60115481565b34801561060557600080fd5b506102ef610614366004612ea3565b6001600160a01b031660009081526020819052604090205490565b34801561063b57600080fd5b5061037461146b565b34801561065057600080fd5b506102ef60b481565b34801561066557600080fd5b506102ef610674366004612ea3565b61147f565b34801561068557600080fd5b50610374610694366004612e6a565b61149d565b3480156106a557600080fd5b506106ae611569565b6040516102f99796959493929190612f1a565b3480156106cd57600080fd5b506102ef60165481565b3480156106e357600080fd5b506103746106f2366004612f01565b6115f2565b34801561070357600080fd5b506009546001600160a01b0316610479565b34801561072157600080fd5b5061031761167a565b34801561073657600080fd5b50610344610745366004612e04565b611689565b34801561075657600080fd5b50600a54610479906001600160a01b031681565b34801561077657600080fd5b50610344610785366004612e04565b611704565b34801561079657600080fd5b506103446107a5366004612ea3565b60146020526000908152604090205460ff1681565b3480156107c657600080fd5b506102ef600c5481565b3480156107dc57600080fd5b506102ef60105481565b3480156107f257600080fd5b506102ef600d5481565b34801561080857600080fd5b50610344610817366004612ea3565b60136020526000908152604090205460ff1681565b34801561083857600080fd5b50610374610847366004612fb3565b611712565b34801561085857600080fd5b50610374610867366004612f01565b611876565b34801561087857600080fd5b506102ef61088736600461302a565b6118f8565b34801561089857600080fd5b506103746108a7366004613058565b611923565b3480156108b857600080fd5b506103746108c7366004612ea3565b611974565b3480156108d857600080fd5b506102ef6103e881565b3480156108ee57600080fd5b506103746108fd366004612ea3565b611b02565b34801561090e57600080fd5b506104797f000000000000000000000000000000000000000000000000000000000000000081565b60606003805461094590613075565b80601f016020809104026020016040519081016040528092919081815260200182805461097190613075565b80156109be5780601f10610993576101008083540402835291602001916109be565b820191906000526020600020905b8154815290600101906020018083116109a157829003601f168201915b5050505050905090565b6000336109d6818585611b7b565b60019150505b92915050565b6109ea611c9f565b60008211610a2e5760405162461bcd60e51b815260206004820152600c60248201526b07a65726f206d6178537761760a41b60448201526064015b60405180910390fd5b81831115610a745760405162461bcd60e51b815260206004820152601360248201527207468726573686f6c64203e206d61785377617606c1b6044820152606401610a25565b600081118015610a8657506103e88111155b610ac05760405162461bcd60e51b815260206004820152600b60248201526a62616420706f6f6c42707360a81b6044820152606401610a25565b600f8390556010829055601181905560408051848152602081018490529081018290527f7d2c50c9db091896f4dc8494a07ea917f538a116a5d4a3a9d236889cd8e2004a9060600160405180910390a1505050565b610b1d611c9f565b6001600160a01b038216610b435760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260136020908152604091829020805460ff191685151590811790915591519182526000805160206132ea83398151915291015b60405180910390a25050565b610b99611c9f565b4780610bd05760405162461bcd60e51b81526020600482015260066024820152650dcde408aa8960d31b6044820152606401610a25565b6000610be46009546001600160a01b031690565b6001600160a01b03168260405160006040518083038185875af1925050503d8060008114610c2e576040519150601f19603f3d011682016040523d82523d6000602084013e610c33565b606091505b5050905080610c765760405162461bcd60e51b815260206004820152600f60248201526e195d1a081cd95b990819985a5b1959608a1b6044820152606401610a25565b5050565b610c82611c9f565b600e5460ff1615610cc85760405162461bcd60e51b815260206004820152601060248201526f185b1c9958591e481b185d5b98da195960821b6044820152606401610a25565b60003411610d015760405162461bcd60e51b81526020600482015260066024820152650dcde408aa8960d31b6044820152606401610a25565b6001600160a01b038116610d485760405162461bcd60e51b815260206004820152600e60248201526d1e995c9bc81c9958da5c1a595b9d60921b6044820152606401610a25565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c45a01556040518163ffffffff1660e01b8152600401602060405180830381865afa158015610da8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dcc91906130cc565b60405163e6a4390560e01b81523060048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015291925060009183169063e6a4390590604401602060405180830381865afa158015610e3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e6291906130cc565b90506001600160a01b038116610f07576040516364e329cb60e11b81523060048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015283169063c9c65396906044016020604051808303816000875af1158015610ee0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f0491906130cc565b90505b6001600160a01b038116600090815260208190526040902054158015610fb457506040516370a0823160e01b81526001600160a01b0382811660048301527f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610f8e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fb291906130e9565b155b610ff15760405162461bcd60e51b815260206004820152600e60248201526d70616972206e6f7420656d70747960901b6044820152606401610a25565b600a80546001600160a01b0319166001600160a01b0383169081179091556000908152601460209081526040808320805460ff19166001179055308352908290529020548061106e5760405162461bcd60e51b81526020600482015260096024820152686e6f20746f6b656e7360b81b6044820152606401610a25565b611099307f000000000000000000000000000000000000000000000000000000000000000083611b7b565b60405163f305d71960e01b81523060048201526024810182905260006044820181905260648201526001600160a01b0385811660848301524260a48301527f0000000000000000000000000000000000000000000000000000000000000000169063f305d71990349060c40160606040518083038185885af1158015611123573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906111489190613102565b5050600e805461ffff19166101011790555042601655604051600181526001600160a01b038316907ff9f3066792ece7dadd967a9482836e4b52c2f9d93bb1a3db2e245bbee91db8329060200160405180910390a2604051600181527f5a9e84f78f7957cb4ed7478eb0fcad35ee4ecbe2e0f298420b28a3955392573f9060200160405180910390a1604080518281523460208201526001600160a01b0386168183015290517f04df2004516565fe8e145693f49f1cf75a97d37cff562ff51d81f1fb4e6940e09181900360600190a150505050565b60003361122c858285611cf9565b611237858585611d73565b506001949350505050565b61124a611c9f565b6001600160a01b0382166112705760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260146020908152604091829020805460ff191685151590811790915591519182527ff9f3066792ece7dadd967a9482836e4b52c2f9d93bb1a3db2e245bbee91db8329101610b85565b6112d0611c9f565b6001600160a01b0382166113135760405162461bcd60e51b815260206004820152600a6024820152693d32b937903a37b5b2b760b11b6044820152606401610a25565b306001600160a01b038316036113555760405162461bcd60e51b815260206004820152600760248201526637379039b2b63360c91b6044820152606401610a25565b610c7661136a6009546001600160a01b031690565b6001600160a01b0384169083611f84565b6000611385611fd6565b905090565b6000336109d681858561139d83836118f8565b6113a79190613146565b611b7b565b600b546001600160a01b031633146113d757604051637fdf534b60e01b815260040160405180910390fd5b806000036113f8576040516325ee753160e21b815260040160405180910390fd5b336000908152602081905260409020548111156114285760405163498a30b960e11b815260040160405180910390fd5b6114323382612101565b60405181815233907ffd38818f5291bf0bb3a2a48aadc06ba8757865d1dabd804585338aab3009dcb6906020015b60405180910390a250565b611473611c9f565b61147d6000612233565b565b6001600160a01b0381166000908152600760205260408120546109dc565b6114a5611c9f565b600e5460ff16156114eb5760405162461bcd60e51b815260206004820152601060248201526f185b1c9958591e481b185d5b98da195960821b6044820152606401610a25565b6001600160a01b0382166115115760405162461bcd60e51b8152600401610a25906130a9565b6001600160a01b038216600081815260156020908152604091829020805460ff191685151590811790915591519182527f6c0aa45d55b5046ee912685bd882464b41d23a2a15c6d7e8aa18ad62f3b299779101610b85565b60006060808280808361159d7f00000000000000000000000000000000000000000000000000000000000000006005612290565b6115c87f00000000000000000000000000000000000000000000000000000000000000006006612290565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b6115fa611c9f565b6101908111156116355760405162461bcd60e51b81526020600482015260066024820152656d617820342560d01b6044820152606401610a25565b600d819055600c5460408051918252602082018390527f121fab07dc109278f0ccefdafee4cd1b1ceb9cc7370bc2edc4680c5a1c0355ff91015b60405180910390a150565b60606004805461094590613075565b6000338161169782866118f8565b9050838110156116f75760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610a25565b6112378286868403611b7b565b6000336109d6818585611d73565b834211156117625760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610a25565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886117918c61233b565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006117ec82612363565b905060006117fc82878787612390565b9050896001600160a01b0316816001600160a01b03161461185f5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610a25565b61186a8a8a8a611b7b565b50505050505050505050565b61187e611c9f565b6101908111156118b95760405162461bcd60e51b81526020600482015260066024820152656d617820342560d01b6044820152606401610a25565b600c819055600d546040805183815260208101929092527f121fab07dc109278f0ccefdafee4cd1b1ceb9cc7370bc2edc4680c5a1c0355ff910161166f565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61192b611c9f565b600e80548215156101000261ff00199091161790556040517f5a9e84f78f7957cb4ed7478eb0fcad35ee4ecbe2e0f298420b28a3955392573f9061166f90831515815260200190565b61197c611c9f565b6001600160a01b0381166119a25760405162461bcd60e51b8152600401610a25906130a9565b600b546001600160a01b03166119c06009546001600160a01b031690565b6001600160a01b0316816001600160a01b0316141580156119ea57506001600160a01b0381163014155b8015611a2857507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816001600160a01b031614155b15611a6e576001600160a01b0381166000818152601360209081526040808320805460ff19169055519182526000805160206132ea833981519152910160405180910390a25b600b80546001600160a01b0319166001600160a01b038416908117909155600081815260136020908152604091829020805460ff1916600190811790915591519182526000805160206132ea833981519152910160405180910390a26040516001600160a01b038316907f847d0f7f2b16c8dd0b72c0606e65e8bf1b624633d37905b0e08145a295ab875890600090a25050565b611b0a611c9f565b6001600160a01b038116611b6f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610a25565b611b7881612233565b50565b6001600160a01b038316611bdd5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610a25565b6001600160a01b038216611c3e5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610a25565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6009546001600160a01b0316331461147d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610a25565b6000611d0584846118f8565b90506000198114611d6d5781811015611d605760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610a25565b611d6d8484848403611b7b565b50505050565b6001600160a01b0383161580611d9057506001600160a01b038216155b80611d9d575060125460ff165b80611dc057506001600160a01b03831660009081526013602052604090205460ff165b80611de357506001600160a01b03821660009081526013602052604090205460ff165b15611df857611df38383836123ba565b505050565b600e5460ff16611e405760405162461bcd60e51b81526020600482015260136024820152721d1c98591a5b99c81b9bdd08195b98589b1959606a1b6044820152606401610a25565b6001600160a01b0380841660009081526014602052604080822054928516825290205460ff9182169116818015611e84575060b4601654611e819190613146565b42105b8015611ea957506001600160a01b03841660009081526015602052604090205460ff16155b15611ec757604051631bb5f5b360e31b815260040160405180910390fd5b808015611edb5750600e54610100900460ff165b8015611ef85750600f543060009081526020819052604090205410155b15611f0557611f0561255e565b60008215611f2f57612710600c5485611f1e9190613159565b611f289190613170565b9050611f53565b8115611f5357612710600d5485611f469190613159565b611f509190613170565b90505b8015611f7157611f648630836123ba565b611f6e8185613192565b93505b611f7c8686866123ba565b505050505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052611df390849061271f565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561202f57507f000000000000000000000000000000000000000000000000000000000000000046145b1561205957507f000000000000000000000000000000000000000000000000000000000000000090565b611385604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6001600160a01b0382166121615760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610a25565b6001600160a01b038216600090815260208190526040902054818110156121d55760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610a25565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b61223c816127f4565b6001600160a01b03811615611b78576001600160a01b038116600081815260136020908152604091829020805460ff1916600190811790915591519182526000805160206132ea8339815191529101611460565b606060ff83146122aa576122a383612846565b90506109dc565b8180546122b690613075565b80601f01602080910402602001604051908101604052809291908181526020018280546122e290613075565b801561232f5780601f106123045761010080835404028352916020019161232f565b820191906000526020600020905b81548152906001019060200180831161231257829003601f168201915b505050505090506109dc565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b60006109dc612370611fd6565b8360405161190160f01b8152600281019290925260228201526042902090565b60008060006123a187878787612885565b915091506123ae81612949565b5090505b949350505050565b6001600160a01b03831661241e5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610a25565b6001600160a01b0382166124805760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610a25565b6001600160a01b038316600090815260208190526040902054818110156124f85760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610a25565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3611d6d565b6012805460ff1916600117905530600090815260208190526040812054905060105481111561258c57506010545b6000612596612a93565b9050808211156125a4578091505b816000036125b3575050612713565b60408051600280825260608201835260009260208301908036833701905050905030816000815181106125e8576125e86131a5565b60200260200101906001600160a01b031690816001600160a01b0316815250507f00000000000000000000000000000000000000000000000000000000000000008160018151811061263c5761263c6131a5565b60200260200101906001600160a01b031690816001600160a01b031681525050612687307f000000000000000000000000000000000000000000000000000000000000000085611b7b565b600b5460405163791ac94760e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263791ac947926126e39288926000928892919091169042906004016131bb565b600060405180830381600087803b1580156126fd57600080fd5b505af192505050801561270e575060015b505050505b6012805460ff19169055565b6000612774826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612bd59092919063ffffffff16565b9050805160001480612795575080806020019051810190612795919061322e565b611df35760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610a25565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6060600061285383612be4565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156128bc5750600090506003612940565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015612910573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661293957600060019250925050612940565b9150600090505b94509492505050565b600081600481111561295d5761295d61324b565b036129655750565b60018160048111156129795761297961324b565b036129c65760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a25565b60028160048111156129da576129da61324b565b03612a275760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a25565b6003816004811115612a3b57612a3b61324b565b03611b785760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a25565b600a546000906001600160a01b031680612aaf57600091505090565b600080826001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015612af0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b14919061327d565b50915091506000306001600160a01b0316846001600160a01b0316630dfe16816040518163ffffffff1660e01b8152600401602060405180830381865afa158015612b63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b8791906130cc565b6001600160a01b031603612ba557506001600160701b038216612bb1565b506001600160701b0381165b61271060115482612bc29190613159565b612bcc9190613170565b94505050505090565b60606123b28484600085612c0c565b600060ff8216601f8111156109dc57604051632cd44ac360e21b815260040160405180910390fd5b606082471015612c6d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610a25565b600080866001600160a01b03168587604051612c8991906132cd565b60006040518083038185875af1925050503d8060008114612cc6576040519150601f19603f3d011682016040523d82523d6000602084013e612ccb565b606091505b5091509150612cdc87838387612ce7565b979650505050505050565b60608315612d56578251600003612d4f576001600160a01b0385163b612d4f5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a25565b50816123b2565b6123b28383815115612d6b5781518083602001fd5b8060405162461bcd60e51b8152600401610a259190612dd5565b60005b83811015612da0578181015183820152602001612d88565b50506000910152565b60008151808452612dc1816020860160208601612d85565b601f01601f19169290920160200192915050565b602081526000612de86020830184612da9565b9392505050565b6001600160a01b0381168114611b7857600080fd5b60008060408385031215612e1757600080fd5b8235612e2281612def565b946020939093013593505050565b600080600060608486031215612e4557600080fd5b505081359360208301359350604090920135919050565b8015158114611b7857600080fd5b60008060408385031215612e7d57600080fd5b8235612e8881612def565b91506020830135612e9881612e5c565b809150509250929050565b600060208284031215612eb557600080fd5b8135612de881612def565b600080600060608486031215612ed557600080fd5b8335612ee081612def565b92506020840135612ef081612def565b929592945050506040919091013590565b600060208284031215612f1357600080fd5b5035919050565b60ff60f81b881681526000602060e06020840152612f3b60e084018a612da9565b8381036040850152612f4d818a612da9565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b81811015612fa157835183529284019291840191600101612f85565b50909c9b505050505050505050505050565b600080600080600080600060e0888a031215612fce57600080fd5b8735612fd981612def565b96506020880135612fe981612def565b95506040880135945060608801359350608088013560ff8116811461300d57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561303d57600080fd5b823561304881612def565b91506020830135612e9881612def565b60006020828403121561306a57600080fd5b8135612de881612e5c565b600181811c9082168061308957607f821691505b60208210810361235d57634e487b7160e01b600052602260045260246000fd5b6020808252600990820152683d32b9379030b2323960b91b604082015260600190565b6000602082840312156130de57600080fd5b8151612de881612def565b6000602082840312156130fb57600080fd5b5051919050565b60008060006060848603121561311757600080fd5b8351925060208401519150604084015190509250925092565b634e487b7160e01b600052601160045260246000fd5b808201808211156109dc576109dc613130565b80820281158282048414176109dc576109dc613130565b60008261318d57634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156109dc576109dc613130565b634e487b7160e01b600052603260045260246000fd5b600060a08201878352602087602085015260a0604085015281875180845260c08601915060208901935060005b8181101561320d5784516001600160a01b0316835293830193918301916001016131e8565b50506001600160a01b03969096166060850152505050608001529392505050565b60006020828403121561324057600080fd5b8151612de881612e5c565b634e487b7160e01b600052602160045260246000fd5b80516001600160701b038116811461327857600080fd5b919050565b60008060006060848603121561329257600080fd5b61329b84613261565b92506132a960208501613261565b9150604084015163ffffffff811681146132c257600080fd5b809150509250925092565b600082516132df818460208701612d85565b919091019291505056fe8af52ca6865dd040a1247f4d247e92db436b658abb69ed82e9efa8a7de0602e9a26469706673582212200b4e71c9cfa19d3b9fe7a4e376352a8fbdaabd69dbc34cdbde1a88fc52709c5864736f6c63430008180033",bi={},fi={},ue={_format:si,contractName:ii,sourceName:li,abi:ci,bytecode:di,deployedBytecode:ui,linkReferences:bi,deployedLinkReferences:fi},pi="contracts/HRD.sol:HRD",hi="v0.8.24+commit.e11b9ed9",mi={language:"Solidity",sources:{"@openzeppelin/contracts/access/Ownable.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

import "../utils/Context.sol";

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * \`onlyOwner\`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * \`onlyOwner\` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
`},"@openzeppelin/contracts/access/Ownable2Step.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable2Step.sol)

pragma solidity ^0.8.0;

import "./Ownable.sol";

/**
 * @dev Contract module which provides access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership} and {acceptOwnership}.
 *
 * This module is used through inheritance. It will make available all functions
 * from parent (Ownable).
 */
abstract contract Ownable2Step is Ownable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (\`newOwner\`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
    }
}
`},"@openzeppelin/contracts/interfaces/IERC5267.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)

pragma solidity ^0.8.0;

interface IERC5267 {
    /**
     * @dev MAY be emitted to signal that the domain could have changed.
     */
    event EIP712DomainChanged();

    /**
     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
     * signature.
     */
    function eip712Domain()
        external
        view
        returns (
            bytes1 fields,
            string memory name,
            string memory version,
            uint256 chainId,
            address verifyingContract,
            bytes32 salt,
            uint256[] memory extensions
        );
}
`},"@openzeppelin/contracts/security/ReentrancyGuard.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from \`ReentrancyGuard\` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single \`nonReentrant\` guard, functions marked as
 * \`nonReentrant\` may not call one another. This can be worked around by making
 * those functions \`private\`, and then adding \`external\` \`nonReentrant\` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a \`nonReentrant\` function from another \`nonReentrant\`
     * function is not supported. It is possible to prevent this from happening
     * by making the \`nonReentrant\` function external, and making it call a
     * \`private\` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * \`nonReentrant\` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}
`},"@openzeppelin/contracts/token/ERC20/ERC20.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./extensions/IERC20Metadata.sol";
import "../../utils/Context.sol";

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning \`false\` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if \`decimals\` equals \`2\`, a balance of \`505\` tokens should
     * be displayed to a user as \`5.05\` (\`505 / 10 ** 2\`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - \`to\` cannot be the zero address.
     * - the caller must have a balance of at least \`amount\`.
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If \`amount\` is the maximum \`uint256\`, the allowance is not updated on
     * \`transferFrom\`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - \`spender\` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum \`uint256\`.
     *
     * Requirements:
     *
     * - \`from\` and \`to\` cannot be the zero address.
     * - \`from\` must have a balance of at least \`amount\`.
     * - the caller must have allowance for \`\`from\`\`'s tokens of at least
     * \`amount\`.
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to \`spender\` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - \`spender\` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to \`spender\` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - \`spender\` cannot be the zero address.
     * - \`spender\` must have allowance for the caller of at least
     * \`subtractedValue\`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves \`amount\` of tokens from \`from\` to \`to\`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - \`from\` cannot be the zero address.
     * - \`to\` cannot be the zero address.
     * - \`from\` must have a balance of at least \`amount\`.
     */
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates \`amount\` tokens and assigns them to \`account\`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with \`from\` set to the zero address.
     *
     * Requirements:
     *
     * - \`account\` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys \`amount\` tokens from \`account\`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with \`to\` set to the zero address.
     *
     * Requirements:
     *
     * - \`account\` cannot be the zero address.
     * - \`account\` must have at least \`amount\` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets \`amount\` as the allowance of \`spender\` over the \`owner\` s tokens.
     *
     * This internal function is equivalent to \`approve\`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - \`owner\` cannot be the zero address.
     * - \`spender\` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates \`owner\` s allowance for \`spender\` based on spent \`amount\`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when \`from\` and \`to\` are both non-zero, \`amount\` of \`\`from\`\`'s tokens
     * will be transferred to \`to\`.
     * - when \`from\` is zero, \`amount\` tokens will be minted for \`to\`.
     * - when \`to\` is zero, \`amount\` of \`\`from\`\`'s tokens will be burned.
     * - \`from\` and \`to\` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when \`from\` and \`to\` are both non-zero, \`amount\` of \`\`from\`\`'s tokens
     * has been transferred to \`to\`.
     * - when \`from\` is zero, \`amount\` tokens have been minted for \`to\`.
     * - when \`to\` is zero, \`amount\` of \`\`from\`\`'s tokens have been burned.
     * - \`from\` and \`to\` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
}
`},"@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)

pragma solidity ^0.8.0;

import "./IERC20Permit.sol";
import "../ERC20.sol";
import "../../../utils/cryptography/ECDSA.sol";
import "../../../utils/cryptography/EIP712.sol";
import "../../../utils/Counters.sol";

/**
 * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on \`{IERC20-approve}\`, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * _Available since v3.4._
 */
abstract contract ERC20Permit is ERC20, IERC20Permit, EIP712 {
    using Counters for Counters.Counter;

    mapping(address => Counters.Counter) private _nonces;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    /**
     * @dev In previous versions \`_PERMIT_TYPEHASH\` was declared as \`immutable\`.
     * However, to ensure consistency with the upgradeable transpiler, we will continue
     * to reserve a slot.
     * @custom:oz-renamed-from _PERMIT_TYPEHASH
     */
    // solhint-disable-next-line var-name-mixedcase
    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;

    /**
     * @dev Initializes the {EIP712} domain separator using the \`name\` parameter, and setting \`version\` to \`"1"\`.
     *
     * It's a good idea to use the same \`name\` that is defined as the ERC20 token name.
     */
    constructor(string memory name) EIP712(name, "1") {}

    /**
     * @inheritdoc IERC20Permit
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override {
        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");

        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "ERC20Permit: invalid signature");

        _approve(owner, spender, value);
    }

    /**
     * @inheritdoc IERC20Permit
     */
    function nonces(address owner) public view virtual override returns (uint256) {
        return _nonces[owner].current();
    }

    /**
     * @inheritdoc IERC20Permit
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
        return _domainSeparatorV4();
    }

    /**
     * @dev "Consume a nonce": return the current value and increment.
     *
     * _Available since v4.1._
     */
    function _useNonce(address owner) internal virtual returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
}
`},"@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}
`},"@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * ==== Security Considerations
 *
 * There are two important considerations concerning the use of \`permit\`. The first is that a valid permit signature
 * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
 * considered as an intention to spend the allowance in any specific way. The second is that because permits have
 * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
 * take this into consideration and allow a \`permit\` call to fail. Combining these two aspects, a pattern that may be
 * generally recommended is:
 *
 * \`\`\`solidity
 * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
 *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
 *     doThing(..., value);
 * }
 *
 * function doThing(..., uint256 value) public {
 *     token.safeTransferFrom(msg.sender, address(this), value);
 *     ...
 * }
 * \`\`\`
 *
 * Observe that: 1) \`msg.sender\` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
 * \`try/catch\` allows the permit to fail and makes the code tolerant to frontrunning. (See also
 * {SafeERC20-safeTransferFrom}).
 *
 * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
 * contracts should have entry points that don't rely on permit.
 */
interface IERC20Permit {
    /**
     * @dev Sets \`value\` as the allowance of \`spender\` over \`\`owner\`\`'s tokens,
     * given \`\`owner\`\`'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - \`spender\` cannot be the zero address.
     * - \`deadline\` must be a timestamp in the future.
     * - \`v\`, \`r\` and \`s\` must be a valid \`secp256k1\` signature from \`owner\`
     * over the EIP712-formatted function arguments.
     * - the signature must use \`\`owner\`\`'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     *
     * CAUTION: See Security Considerations above.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for \`owner\`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases \`\`owner\`\`'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
`},"@openzeppelin/contracts/token/ERC20/IERC20.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when \`value\` tokens are moved from one account (\`from\`) to
     * another (\`to\`).
     *
     * Note that \`value\` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a \`spender\` for an \`owner\` is set by
     * a call to {approve}. \`value\` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by \`account\`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves \`amount\` tokens from the caller's account to \`to\`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that \`spender\` will be
     * allowed to spend on behalf of \`owner\` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets \`amount\` as the allowance of \`spender\` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves \`amount\` tokens from \`from\` to \`to\` using the
     * allowance mechanism. \`amount\` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
`},"@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.0;

import "../IERC20.sol";
import "../extensions/IERC20Permit.sol";
import "../../../utils/Address.sol";

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a \`using SafeERC20 for IERC20;\` statement to your contract,
 * which allows you to call the safe operations as \`token.safeTransfer(...)\`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev Transfer \`value\` amount of \`token\` from the calling contract to \`to\`. If \`token\` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /**
     * @dev Transfer \`value\` amount of \`token\` from \`from\` to \`to\`, spending the approval given by \`from\` to the
     * calling contract. If \`token\` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    /**
     * @dev Increase the calling contract's allowance toward \`spender\` by \`value\`. If \`token\` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward \`spender\` by \`value\`. If \`token\` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Set the calling contract's allowance toward \`spender\` to \`value\`. If \`token\` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the \`owner\` approval toward \`spender\` on \`token\`.
     * Revert on invalid signature.
     */
    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return
            success && (returndata.length == 0 || abi.decode(returndata, (bool))) && Address.isContract(address(token));
    }
}
`},"@openzeppelin/contracts/utils/Address.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

pragma solidity ^0.8.1;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if \`account\` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, \`isContract\` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, \`isContract\` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by \`SELFDESTRUCT\`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on \`isContract\` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's \`transfer\`: sends \`amount\` wei to
     * \`recipient\`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by \`transfer\`, making them unable to receive funds via
     * \`transfer\`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to \`recipient\`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level \`call\`. A
     * plain \`call\` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If \`target\` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[\`abi.decode\`].
     *
     * Requirements:
     *
     * - \`target\` must be a contract.
     * - calling \`target\` with \`data\` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`], but with
     * \`errorMessage\` as a fallback revert reason when \`target\` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
     * but also transferring \`value\` wei to \`target\`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least \`value\`.
     * - the called Solidity function must be \`payable\`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[\`functionCallWithValue\`], but
     * with \`errorMessage\` as a fallback revert reason when \`target\` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[\`functionCall\`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[\`functionCall\`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}
`},"@openzeppelin/contracts/utils/Context.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.4) (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}
`},"@openzeppelin/contracts/utils/Counters.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)

pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with \`using Counters for Counters.Counter;\`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
`},"@openzeppelin/contracts/utils/cryptography/ECDSA.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/cryptography/ECDSA.sol)

pragma solidity ^0.8.0;

import "../Strings.sol";

/**
 * @dev Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
 *
 * These functions can be used to verify that a message was signed by the holder
 * of the private keys of a given address.
 */
library ECDSA {
    enum RecoverError {
        NoError,
        InvalidSignature,
        InvalidSignatureLength,
        InvalidSignatureS,
        InvalidSignatureV // Deprecated in v4.8
    }

    function _throwError(RecoverError error) private pure {
        if (error == RecoverError.NoError) {
            return; // no error: do nothing
        } else if (error == RecoverError.InvalidSignature) {
            revert("ECDSA: invalid signature");
        } else if (error == RecoverError.InvalidSignatureLength) {
            revert("ECDSA: invalid signature length");
        } else if (error == RecoverError.InvalidSignatureS) {
            revert("ECDSA: invalid signature 's' value");
        }
    }

    /**
     * @dev Returns the address that signed a hashed message (\`hash\`) with
     * \`signature\` or error string. This address can then be used for verification purposes.
     *
     * The \`ecrecover\` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the \`s\` value to be in the lower
     * half order, and the \`v\` value to be either 27 or 28.
     *
     * IMPORTANT: \`hash\` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     *
     * Documentation for signature generation:
     * - with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
     * - with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, bytes memory signature) internal pure returns (address, RecoverError) {
        if (signature.length == 65) {
            bytes32 r;
            bytes32 s;
            uint8 v;
            // ecrecover takes the signature parameters, and the only way to get them
            // currently is to use assembly.
            /// @solidity memory-safe-assembly
            assembly {
                r := mload(add(signature, 0x20))
                s := mload(add(signature, 0x40))
                v := byte(0, mload(add(signature, 0x60)))
            }
            return tryRecover(hash, v, r, s);
        } else {
            return (address(0), RecoverError.InvalidSignatureLength);
        }
    }

    /**
     * @dev Returns the address that signed a hashed message (\`hash\`) with
     * \`signature\`. This address can then be used for verification purposes.
     *
     * The \`ecrecover\` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the \`s\` value to be in the lower
     * half order, and the \`v\` value to be either 27 or 28.
     *
     * IMPORTANT: \`hash\` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, signature);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Overload of {ECDSA-tryRecover} that receives the \`r\` and \`vs\` short-signature fields separately.
     *
     * See https://eips.ethereum.org/EIPS/eip-2098[EIP-2098 short signatures]
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address, RecoverError) {
        bytes32 s = vs & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        uint8 v = uint8((uint256(vs) >> 255) + 27);
        return tryRecover(hash, v, r, s);
    }

    /**
     * @dev Overload of {ECDSA-recover} that receives the \`r and \`vs\` short-signature fields separately.
     *
     * _Available since v4.2._
     */
    function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, r, vs);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Overload of {ECDSA-tryRecover} that receives the \`v\`,
     * \`r\` and \`s\` signature fields separately.
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address, RecoverError) {
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return (address(0), RecoverError.InvalidSignatureS);
        }

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        if (signer == address(0)) {
            return (address(0), RecoverError.InvalidSignature);
        }

        return (signer, RecoverError.NoError);
    }

    /**
     * @dev Overload of {ECDSA-recover} that receives the \`v\`,
     * \`r\` and \`s\` signature fields separately.
     */
    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, v, r, s);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from a \`hash\`. This
     * produces hash corresponding to the one signed with the
     * https://eth.wiki/json-rpc/API#eth_sign[\`eth_sign\`]
     * JSON-RPC method as part of EIP-191.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32 message) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, "\\x19Ethereum Signed Message:\\n32")
            mstore(0x1c, hash)
            message := keccak256(0x00, 0x3c)
        }
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from \`s\`. This
     * produces hash corresponding to the one signed with the
     * https://eth.wiki/json-rpc/API#eth_sign[\`eth_sign\`]
     * JSON-RPC method as part of EIP-191.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes memory s) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\\x19Ethereum Signed Message:\\n", Strings.toString(s.length), s));
    }

    /**
     * @dev Returns an Ethereum Signed Typed Data, created from a
     * \`domainSeparator\` and a \`structHash\`. This produces hash corresponding
     * to the one signed with the
     * https://eips.ethereum.org/EIPS/eip-712[\`eth_signTypedData\`]
     * JSON-RPC method as part of EIP-712.
     *
     * See {recover}.
     */
    function toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32 data) {
        /// @solidity memory-safe-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, "\\x19\\x01")
            mstore(add(ptr, 0x02), domainSeparator)
            mstore(add(ptr, 0x22), structHash)
            data := keccak256(ptr, 0x42)
        }
    }

    /**
     * @dev Returns an Ethereum Signed Data with intended validator, created from a
     * \`validator\` and \`data\` according to the version 0 of EIP-191.
     *
     * See {recover}.
     */
    function toDataWithIntendedValidatorHash(address validator, bytes memory data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\\x19\\x00", validator, data));
    }
}
`},"@openzeppelin/contracts/utils/cryptography/EIP712.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/cryptography/EIP712.sol)

pragma solidity ^0.8.8;

import "./ECDSA.sol";
import "../ShortStrings.sol";
import "../../interfaces/IERC5267.sol";

/**
 * @dev https://eips.ethereum.org/EIPS/eip-712[EIP 712] is a standard for hashing and signing of typed structured data.
 *
 * The encoding specified in the EIP is very generic, and such a generic implementation in Solidity is not feasible,
 * thus this contract does not implement the encoding itself. Protocols need to implement the type-specific encoding
 * they need in their contracts using a combination of \`abi.encode\` and \`keccak256\`.
 *
 * This contract implements the EIP 712 domain separator ({_domainSeparatorV4}) that is used as part of the encoding
 * scheme, and the final step of the encoding to obtain the message digest that is then signed via ECDSA
 * ({_hashTypedDataV4}).
 *
 * The implementation of the domain separator was designed to be as efficient as possible while still properly updating
 * the chain id to protect against replay attacks on an eventual fork of the chain.
 *
 * NOTE: This contract implements the version of the encoding known as "v4", as implemented by the JSON RPC method
 * https://docs.metamask.io/guide/signing-data.html[\`eth_signTypedDataV4\` in MetaMask].
 *
 * NOTE: In the upgradeable version of this contract, the cached values will correspond to the address, and the domain
 * separator of the implementation contract. This will cause the \`_domainSeparatorV4\` function to always rebuild the
 * separator from the immutable values, which is cheaper than accessing a cached version in cold storage.
 *
 * _Available since v3.4._
 *
 * @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
 */
abstract contract EIP712 is IERC5267 {
    using ShortStrings for *;

    bytes32 private constant _TYPE_HASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    // Cache the domain separator as an immutable value, but also store the chain id that it corresponds to, in order to
    // invalidate the cached domain separator if the chain id changes.
    bytes32 private immutable _cachedDomainSeparator;
    uint256 private immutable _cachedChainId;
    address private immutable _cachedThis;

    bytes32 private immutable _hashedName;
    bytes32 private immutable _hashedVersion;

    ShortString private immutable _name;
    ShortString private immutable _version;
    string private _nameFallback;
    string private _versionFallback;

    /**
     * @dev Initializes the domain separator and parameter caches.
     *
     * The meaning of \`name\` and \`version\` is specified in
     * https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator[EIP 712]:
     *
     * - \`name\`: the user readable name of the signing domain, i.e. the name of the DApp or the protocol.
     * - \`version\`: the current major version of the signing domain.
     *
     * NOTE: These parameters cannot be changed except through a xref:learn::upgrading-smart-contracts.adoc[smart
     * contract upgrade].
     */
    constructor(string memory name, string memory version) {
        _name = name.toShortStringWithFallback(_nameFallback);
        _version = version.toShortStringWithFallback(_versionFallback);
        _hashedName = keccak256(bytes(name));
        _hashedVersion = keccak256(bytes(version));

        _cachedChainId = block.chainid;
        _cachedDomainSeparator = _buildDomainSeparator();
        _cachedThis = address(this);
    }

    /**
     * @dev Returns the domain separator for the current chain.
     */
    function _domainSeparatorV4() internal view returns (bytes32) {
        if (address(this) == _cachedThis && block.chainid == _cachedChainId) {
            return _cachedDomainSeparator;
        } else {
            return _buildDomainSeparator();
        }
    }

    function _buildDomainSeparator() private view returns (bytes32) {
        return keccak256(abi.encode(_TYPE_HASH, _hashedName, _hashedVersion, block.chainid, address(this)));
    }

    /**
     * @dev Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
     * function returns the hash of the fully encoded EIP712 message for this domain.
     *
     * This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:
     *
     * \`\`\`solidity
     * bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
     *     keccak256("Mail(address to,string contents)"),
     *     mailTo,
     *     keccak256(bytes(mailContents))
     * )));
     * address signer = ECDSA.recover(digest, signature);
     * \`\`\`
     */
    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
        return ECDSA.toTypedDataHash(_domainSeparatorV4(), structHash);
    }

    /**
     * @dev See {EIP-5267}.
     *
     * _Available since v4.9._
     */
    function eip712Domain()
        public
        view
        virtual
        override
        returns (
            bytes1 fields,
            string memory name,
            string memory version,
            uint256 chainId,
            address verifyingContract,
            bytes32 salt,
            uint256[] memory extensions
        )
    {
        return (
            hex"0f", // 01111
            _name.toStringWithFallback(_nameFallback),
            _version.toStringWithFallback(_versionFallback),
            block.chainid,
            address(this),
            bytes32(0),
            new uint256[](0)
        );
    }
}
`},"@openzeppelin/contracts/utils/math/Math.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/math/Math.sol)

pragma solidity ^0.8.0;

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with \`/\` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number \`a\` is a power of 2 such that we have
        // \`msb(a) <= a < 2*msb(a)\`. This value can be written \`msb(a)=2**k\` with \`k=log2(a)\`.
        //
        // This can be rewritten \`2**log2(a) <= a < 2**(log2(a) + 1)\`
        // → \`sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))\`
        // → \`2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)\`
        //
        // Consequently, \`2**(log2(a) / 2)\` is a good first approximation of \`sqrt(a)\` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point \`result\` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent \`value\` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}
`},"@openzeppelin/contracts/utils/math/SignedMath.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SignedMath.sol)

pragma solidity ^0.8.0;

/**
 * @dev Standard signed math utilities missing in the Solidity language.
 */
library SignedMath {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support \`n = type(int256).min\`
            return uint256(n >= 0 ? n : -n);
        }
    }
}
`},"@openzeppelin/contracts/utils/ShortStrings.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/ShortStrings.sol)

pragma solidity ^0.8.8;

import "./StorageSlot.sol";

// | string  | 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA   |
// | length  | 0x                                                              BB |
type ShortString is bytes32;

/**
 * @dev This library provides functions to convert short memory strings
 * into a \`ShortString\` type that can be used as an immutable variable.
 *
 * Strings of arbitrary length can be optimized using this library if
 * they are short enough (up to 31 bytes) by packing them with their
 * length (1 byte) in a single EVM word (32 bytes). Additionally, a
 * fallback mechanism can be used for every other case.
 *
 * Usage example:
 *
 * \`\`\`solidity
 * contract Named {
 *     using ShortStrings for *;
 *
 *     ShortString private immutable _name;
 *     string private _nameFallback;
 *
 *     constructor(string memory contractName) {
 *         _name = contractName.toShortStringWithFallback(_nameFallback);
 *     }
 *
 *     function name() external view returns (string memory) {
 *         return _name.toStringWithFallback(_nameFallback);
 *     }
 * }
 * \`\`\`
 */
library ShortStrings {
    // Used as an identifier for strings longer than 31 bytes.
    bytes32 private constant _FALLBACK_SENTINEL = 0x00000000000000000000000000000000000000000000000000000000000000FF;

    error StringTooLong(string str);
    error InvalidShortString();

    /**
     * @dev Encode a string of at most 31 chars into a \`ShortString\`.
     *
     * This will trigger a \`StringTooLong\` error is the input string is too long.
     */
    function toShortString(string memory str) internal pure returns (ShortString) {
        bytes memory bstr = bytes(str);
        if (bstr.length > 31) {
            revert StringTooLong(str);
        }
        return ShortString.wrap(bytes32(uint256(bytes32(bstr)) | bstr.length));
    }

    /**
     * @dev Decode a \`ShortString\` back to a "normal" string.
     */
    function toString(ShortString sstr) internal pure returns (string memory) {
        uint256 len = byteLength(sstr);
        // using \`new string(len)\` would work locally but is not memory safe.
        string memory str = new string(32);
        /// @solidity memory-safe-assembly
        assembly {
            mstore(str, len)
            mstore(add(str, 0x20), sstr)
        }
        return str;
    }

    /**
     * @dev Return the length of a \`ShortString\`.
     */
    function byteLength(ShortString sstr) internal pure returns (uint256) {
        uint256 result = uint256(ShortString.unwrap(sstr)) & 0xFF;
        if (result > 31) {
            revert InvalidShortString();
        }
        return result;
    }

    /**
     * @dev Encode a string into a \`ShortString\`, or write it to storage if it is too long.
     */
    function toShortStringWithFallback(string memory value, string storage store) internal returns (ShortString) {
        if (bytes(value).length < 32) {
            return toShortString(value);
        } else {
            StorageSlot.getStringSlot(store).value = value;
            return ShortString.wrap(_FALLBACK_SENTINEL);
        }
    }

    /**
     * @dev Decode a string that was encoded to \`ShortString\` or written to storage using {setWithFallback}.
     */
    function toStringWithFallback(ShortString value, string storage store) internal pure returns (string memory) {
        if (ShortString.unwrap(value) != _FALLBACK_SENTINEL) {
            return toString(value);
        } else {
            return store;
        }
    }

    /**
     * @dev Return the length of a string that was encoded to \`ShortString\` or written to storage using {setWithFallback}.
     *
     * WARNING: This will return the "byte length" of the string. This may not reflect the actual length in terms of
     * actual characters as the UTF-8 encoding of a single character can span over multiple bytes.
     */
    function byteLengthWithFallback(ShortString value, string storage store) internal view returns (uint256) {
        if (ShortString.unwrap(value) != _FALLBACK_SENTINEL) {
            return byteLength(value);
        } else {
            return bytes(store).length;
        }
    }
}
`},"@openzeppelin/contracts/utils/StorageSlot.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

pragma solidity ^0.8.0;

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a \`value\` member that can be used to read or write.
 *
 * Example usage to set ERC1967 implementation slot:
 * \`\`\`solidity
 * contract ERC1967 {
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * \`\`\`
 *
 * _Available since v4.1 for \`address\`, \`bool\`, \`bytes32\`, \`uint256\`._
 * _Available since v4.9 for \`string\`, \`bytes\`._
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an \`AddressSlot\` with member \`value\` located at \`slot\`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`BooleanSlot\` with member \`value\` located at \`slot\`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`Bytes32Slot\` with member \`value\` located at \`slot\`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`Uint256Slot\` with member \`value\` located at \`slot\`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`StringSlot\` with member \`value\` located at \`slot\`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`StringSlot\` representation of the string storage pointer \`store\`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns an \`BytesSlot\` with member \`value\` located at \`slot\`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an \`BytesSlot\` representation of the bytes storage pointer \`store\`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }
}
`},"@openzeppelin/contracts/utils/Strings.sol":{content:`// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/Strings.sol)

pragma solidity ^0.8.0;

import "./math/Math.sol";
import "./math/SignedMath.sol";

/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a \`uint256\` to its ASCII \`string\` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a \`int256\` to its ASCII \`string\` decimal representation.
     */
    function toString(int256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", toString(SignedMath.abs(value))));
    }

    /**
     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a \`uint256\` to its ASCII \`string\` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an \`address\` with fixed length of 20 bytes to its not checksummed ASCII \`string\` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}
`},"contracts/DopplerAtomicExecutor.sol":{content:`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IAirlock, IUniversalRouter, PoolKey} from "./interfaces/IDoppler.sol";

/// @title Atomic Doppler (Airlock) launcher and buyer
/// @notice Launches a token through Doppler's Airlock and performs configured
/// V4 buys through the Universal Router inside one transaction.
/// @dev Module addresses (tokenFactory, governanceFactory, poolInitializer,
/// liquidityMigrator) are NOT chosen by this contract — Airlock.create()
/// reverts unless each is already whitelisted by the Airlock owner. This
/// contract only assembles the call; it does not grant itself any modules.
contract DopplerAtomicExecutor is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @dev V4_SWAP is Universal Router command 0x10, confirmed from a real
    /// swap transaction against this chain's deployed router.
    bytes1 private constant CMD_V4_SWAP = 0x10;

    /// @dev Inner V4 router actions, per Uniswap's v4-periphery Actions library.
    uint8 private constant ACTION_SWAP_EXACT_IN_SINGLE = 0x06;
    uint8 private constant ACTION_SETTLE_ALL = 0x0b;
    uint8 private constant ACTION_TAKE_ALL = 0x0e;

    /// @dev Uniswap V4 dynamic-fee flag (LPFeeLibrary.DYNAMIC_FEE_FLAG). Doppler
    /// pools use a hook-computed fee, not a static tier — confirmed from a real
    /// Initialize event on this deployment's PoolManager (fee: 8388608 == 0x800000).
    uint24 private constant DYNAMIC_FEE_FLAG = 0x800000;

    struct Buy {
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    IAirlock public immutable airlock;
    IUniversalRouter public immutable router;

    /// @dev Fixed for this Doppler deployment's poolInitializer/hook and pool
    /// tickSpacing — confirmed from the same Initialize event, not caller input.
    /// Airlock.create() must be called with a poolInitializer matching \`hooks\`
    /// below, or the launched pool will not match these buy parameters.
    address public immutable hooks;
    int24 public immutable tickSpacing;

    error EmptyBuy();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event AtomicLaunch(address indexed asset, address indexed pool, address indexed controller, uint256 buyCount);
    event AtomicBuy(address indexed asset, address indexed recipient, uint256 amountIn, uint256 amountOutMinimum);
    event Recovered(address indexed asset, address indexed recipient, uint256 amount);

    constructor(address airlock_, address router_, address hooks_, int24 tickSpacing_) {
        require(airlock_ != address(0) && router_ != address(0) && hooks_ != address(0), "zero addr");
        airlock = IAirlock(airlock_);
        router = IUniversalRouter(router_);
        hooks = hooks_;
        tickSpacing = tickSpacing_;
    }

    /// @notice Atomically launches through Airlock.create() then buys the
    /// freshly created asset for each configured recipient. Any failure
    /// reverts the launch and every buy.
    /// @param createData Forwarded verbatim to Airlock.create(); the caller
    /// is responsible for using module addresses already whitelisted on the
    /// target Airlock deployment and for correctly encoding each module's
    /// opaque data payload.
    /// @param buys Native-currency buys against the newly created pool. The
    /// pool key's hooks/tickSpacing/fee are fixed at deployment (see \`hooks\`
    /// and \`tickSpacing\`) to match this Airlock deployment's poolInitializer;
    /// they are not re-derived from \`create()\`'s return values.
    /// @param numeraireIsNative Whether \`createData.numeraire\` is the chain's
    /// native asset (address(0) equivalent in the pool key) — set to match
    /// however this Airlock deployment represents native currency.
    /// @param deadline Universal Router execute() deadline.
    function launchAndBuy(
        IAirlock.CreateParams calldata createData,
        Buy[] calldata buys,
        bool numeraireIsNative,
        uint256 deadline
    )
        external
        payable
        onlyOwner
        nonReentrant
        returns (address asset, address pool)
    {
        if (block.timestamp > deadline) revert Expired();

        uint256 buyValue;
        for (uint256 i; i < buys.length; ++i) {
            if (buys[i].recipient == address(0) || buys[i].amountIn == 0 || buys[i].amountOutMinimum == 0) {
                revert EmptyBuy();
            }
            buyValue += buys[i].amountIn;
        }

        address governance;
        address timelock;
        address migrationPool;
        (asset, pool, governance, timelock, migrationPool) = airlock.create(createData);

        _executeBuys(asset, createData.numeraire, numeraireIsNative, buys, deadline);

        emit AtomicLaunch(asset, pool, msg.sender, buys.length);
    }

    function _executeBuys(
        address asset,
        address numeraire,
        bool numeraireIsNative,
        Buy[] calldata buys,
        uint256 deadline
    ) private {
        address currencyIn = numeraireIsNative ? address(0) : numeraire;
        bool zeroForOne = currencyIn < asset;

        PoolKey memory key = zeroForOne
            ? PoolKey({
                currency0: currencyIn,
                currency1: asset,
                fee: DYNAMIC_FEE_FLAG,
                tickSpacing: tickSpacing,
                hooks: hooks
            })
            : PoolKey({
                currency0: asset,
                currency1: currencyIn,
                fee: DYNAMIC_FEE_FLAG,
                tickSpacing: tickSpacing,
                hooks: hooks
            });

        for (uint256 i; i < buys.length; ++i) {

            bytes memory actions = abi.encodePacked(ACTION_SWAP_EXACT_IN_SINGLE, ACTION_SETTLE_ALL, ACTION_TAKE_ALL);

            // TAKE_ALL params are (currency, recipient) on this router, per
            // the decoded reference swap — the router delivers output tokens
            // straight to \`recipient\`, it does not return them to msg.sender.
            bytes[] memory params = new bytes[](3);
            params[0] = abi.encode(key, zeroForOne, buys[i].amountIn, buys[i].amountOutMinimum, bytes(""));
            params[1] = abi.encode(currencyIn, buys[i].amountIn);
            params[2] = abi.encode(asset, buys[i].recipient);

            bytes[] memory inputs = new bytes[](1);
            inputs[0] = abi.encode(actions, params);

            router.execute{value: buys[i].amountIn}(abi.encodePacked(CMD_V4_SWAP), inputs, deadline);

            emit AtomicBuy(asset, buys[i].recipient, buys[i].amountIn, buys[i].amountOutMinimum);
        }
    }

    function recoverETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "zero addr");
        (bool ok, bytes memory reason) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(reason);
        emit Recovered(address(0), recipient, amount);
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(token != address(0) && recipient != address(0), "zero addr");
        IERC20(token).safeTransfer(recipient, amount);
        emit Recovered(token, recipient, amount);
    }

    function renounceOwnership() public override onlyOwner {
        revert OwnershipRenunciationDisabled();
    }

    receive() external payable {}
}
`},"contracts/HRD.sol":{content:`// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    IUniswapV2Router02,
    IUniswapV2Factory,
    IUniswapV2Pair
} from "./interfaces/IUniswapV2.sol";

/// @title Tradeable governance token with configurable buy/sell tax.
/// @notice 1B fixed initial supply. 2% goes to the ecosystem wallet,
/// while 98% is held by this contract to seed liquidity.
/// @dev The tax wallet may permanently burn tokens held in its own wallet.
contract HRD is ERC20, ERC20Permit, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    /// @notice Maximum buy or sell tax: 4%.
    uint256 public constant MAX_TAX_BPS = 400;

    /// @notice Swapback cannot exceed 10% of the token reserve in the pool.
    uint256 public constant MAX_SWAP_POOL_BPS = 1_000;

    /// @notice Early-buyer restriction window in seconds.
    uint256 public constant EW = 180;

    IUniswapV2Router02 public immutable router;
    address public immutable weth;

    address public pair;
    address public immutable ecosystemWallet;

    address public taxWallet;

    uint256 public buyTaxBps = 100;
    uint256 public sellTaxBps = 100;

    bool public tradingEnabled;
    bool public swapEnabled;

    uint256 public swapThreshold = MAX_SUPPLY / 10_000;
    uint256 public maxSwap = MAX_SUPPLY / 100;
    uint256 public swapPoolBps = 50;

    bool private inSwap;

    mapping(address => bool) public taxExempt;
    mapping(address => bool) public isAMMPair;
    mapping(address => bool) public earlyBuyerAllowed;

    uint256 public tradingOpenAt;

    error NotOpen();
    error OnlyTaxWallet();
    error ZeroBurnAmount();
    error InsufficientBurnBalance();

    event Launched(
        uint256 tokenAmount,
        uint256 ethAmount,
        address lpRecipient
    );

    event EarlyBuyerSet(
        address indexed account,
        bool allowed
    );

    event TaxSet(
        uint256 buyTaxBps,
        uint256 sellTaxBps
    );

    event TaxWalletSet(
        address indexed taxWallet
    );

    event TaxExemptSet(
        address indexed account,
        bool exempt
    );

    event AMMPairSet(
        address indexed pair,
        bool isPair
    );

    event SwapEnabledSet(
        bool enabled
    );

    event SwapSettingsSet(
        uint256 swapThreshold,
        uint256 maxSwap,
        uint256 swapPoolBps
    );

    event TokensBurned(
        address indexed taxWallet,
        uint256 amount
    );

    modifier lockSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    modifier onlyTaxWallet() {
        if (msg.sender != taxWallet) {
            revert OnlyTaxWallet();
        }
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address _router,
        address _taxWallet,
        address _ecosystemWallet,
        address[] memory _earlyBuyers
    )
        ERC20(name_, symbol_)
        ERC20Permit(name_)
    {
        require(
            _router != address(0) &&
                _taxWallet != address(0) &&
                _ecosystemWallet != address(0),
            "zero addr"
        );

        router = IUniswapV2Router02(_router);
        weth = router.WETH();

        taxWallet = _taxWallet;
        ecosystemWallet = _ecosystemWallet;

        taxExempt[owner()] = true;
        taxExempt[address(this)] = true;
        taxExempt[_taxWallet] = true;
        taxExempt[_ecosystemWallet] = true;

        for (uint256 i; i < _earlyBuyers.length; i++) {
            require(
                _earlyBuyers[i] != address(0),
                "zero early buyer"
            );

            earlyBuyerAllowed[_earlyBuyers[i]] = true;

            emit EarlyBuyerSet(
                _earlyBuyers[i],
                true
            );
        }

        uint256 ecosystemAllocation =
            (MAX_SUPPLY * 2) / 100;

        uint256 liquidityAllocation =
            MAX_SUPPLY -
            ecosystemAllocation;

        _mint(
            _ecosystemWallet,
            ecosystemAllocation
        );

        _mint(
            address(this),
            liquidityAllocation
        );
    }

    /// @notice Creates or retrieves the WETH pair and adds all tokens
    /// held by this contract as initial liquidity.
    /// @param lpRecipient Address that receives the LP tokens.
    function launch(
        address lpRecipient
    ) external payable onlyOwner {
        require(
            !tradingEnabled,
            "already launched"
        );

        require(
            msg.value > 0,
            "no ETH"
        );

        require(
            lpRecipient != address(0),
            "zero recipient"
        );

        IUniswapV2Factory factory =
            IUniswapV2Factory(
                router.factory()
            );

        address p =
            factory.getPair(
                address(this),
                weth
            );

        if (p == address(0)) {
            p = factory.createPair(
                address(this),
                weth
            );
        }

        require(
            balanceOf(p) == 0 &&
                IERC20(weth).balanceOf(p) == 0,
            "pair not empty"
        );

        pair = p;
        isAMMPair[p] = true;

        uint256 tokenAmount =
            balanceOf(address(this));

        require(
            tokenAmount > 0,
            "no tokens"
        );

        _approve(
            address(this),
            address(router),
            tokenAmount
        );

        router.addLiquidityETH{
            value: msg.value
        }(
            address(this),
            tokenAmount,
            0,
            0,
            lpRecipient,
            block.timestamp
        );

        tradingEnabled = true;
        swapEnabled = true;
        tradingOpenAt = block.timestamp;

        emit AMMPairSet(
            p,
            true
        );

        emit SwapEnabledSet(
            true
        );

        emit Launched(
            tokenAmount,
            msg.value,
            lpRecipient
        );
    }

    /// @notice Permanently burns tokens held by the tax wallet.
    /// @dev Only the current taxWallet can call this function.
    /// The function cannot burn tokens belonging to any other address.
    /// @param amount Token amount to burn, including 18 decimals.
    function burn(
        uint256 amount
    ) external onlyTaxWallet {
        if (amount == 0) {
            revert ZeroBurnAmount();
        }

        if (balanceOf(msg.sender) < amount) {
            revert InsufficientBurnBalance();
        }

        _burn(
            msg.sender,
            amount
        );

        emit TokensBurned(
            msg.sender,
            amount
        );
    }

    function setBuyTax(
        uint256 bps
    ) external onlyOwner {
        require(
            bps <= MAX_TAX_BPS,
            "max 4%"
        );

        buyTaxBps = bps;

        emit TaxSet(
            bps,
            sellTaxBps
        );
    }

    function setSellTax(
        uint256 bps
    ) external onlyOwner {
        require(
            bps <= MAX_TAX_BPS,
            "max 4%"
        );

        sellTaxBps = bps;

        emit TaxSet(
            buyTaxBps,
            bps
        );
    }

    function setTaxWallet(
        address w
    ) external onlyOwner {
        require(
            w != address(0),
            "zero addr"
        );

        address oldTaxWallet =
            taxWallet;

        if (
            oldTaxWallet != owner() &&
            oldTaxWallet != address(this) &&
            oldTaxWallet != ecosystemWallet
        ) {
            taxExempt[oldTaxWallet] = false;

            emit TaxExemptSet(
                oldTaxWallet,
                false
            );
        }

        taxWallet = w;
        taxExempt[w] = true;

        emit TaxExemptSet(
            w,
            true
        );

        emit TaxWalletSet(
            w
        );
    }

    function setTaxExempt(
        address account,
        bool exempt
    ) external onlyOwner {
        require(
            account != address(0),
            "zero addr"
        );

        taxExempt[account] = exempt;

        emit TaxExemptSet(
            account,
            exempt
        );
    }

    function setAMMPair(
        address p,
        bool isPair
    ) external onlyOwner {
        require(
            p != address(0),
            "zero addr"
        );

        isAMMPair[p] = isPair;

        emit AMMPairSet(
            p,
            isPair
        );
    }

    function setEarlyBuyer(
        address account,
        bool allowed
    ) external onlyOwner {
        require(
            !tradingEnabled,
            "already launched"
        );

        require(
            account != address(0),
            "zero addr"
        );

        earlyBuyerAllowed[account] =
            allowed;

        emit EarlyBuyerSet(
            account,
            allowed
        );
    }

    function setSwapEnabled(
        bool enabled
    ) external onlyOwner {
        swapEnabled = enabled;

        emit SwapEnabledSet(
            enabled
        );
    }

    function setSwapSettings(
        uint256 _swapThreshold,
        uint256 _maxSwap,
        uint256 _swapPoolBps
    ) external onlyOwner {
        require(
            _maxSwap > 0,
            "zero maxSwap"
        );

        require(
            _swapThreshold <= _maxSwap,
            "threshold > maxSwap"
        );

        require(
            _swapPoolBps > 0 &&
                _swapPoolBps <=
                MAX_SWAP_POOL_BPS,
            "bad poolBps"
        );

        swapThreshold =
            _swapThreshold;

        maxSwap =
            _maxSwap;

        swapPoolBps =
            _swapPoolBps;

        emit SwapSettingsSet(
            _swapThreshold,
            _maxSwap,
            _swapPoolBps
        );
    }

    function rescueETH()
        external
        onlyOwner
    {
        uint256 balance =
            address(this).balance;

        require(
            balance > 0,
            "no ETH"
        );

        (bool ok, ) = payable(owner()).call{
            value: balance
        }("");

        require(
            ok,
            "eth send failed"
        );
    }

    function rescueToken(
        address token,
        uint256 amount
    ) external onlyOwner {
        require(
            token != address(0),
            "zero token"
        );

        require(
            token != address(this),
            "no self"
        );

        IERC20(token).safeTransfer(
            owner(),
            amount
        );
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal {
        if (from == address(0)) {
            _mint(to, amount);
        } else if (to == address(0)) {
            _burn(from, amount);
        } else {
            _transfer(from, to, amount);
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (
            from == address(0) ||
            to == address(0) ||
            inSwap ||
            taxExempt[from] ||
            taxExempt[to]
        ) {
            super._transfer(
                from,
                to,
                amount
            );

            return;
        }

        require(
            tradingEnabled,
            "trading not enabled"
        );

        bool isBuy =
            isAMMPair[from];

        bool isSell =
            isAMMPair[to];

        if (
            isBuy &&
            block.timestamp <
                tradingOpenAt + EW &&
            !earlyBuyerAllowed[to]
        ) {
            revert NotOpen();
        }

        if (
            isSell &&
            swapEnabled &&
            balanceOf(address(this)) >=
                swapThreshold
        ) {
            _swapBack();
        }

        uint256 tax;

        if (isBuy) {
            tax =
                (amount * buyTaxBps) /
                10_000;
        } else if (isSell) {
            tax =
                (amount * sellTaxBps) /
                10_000;
        }

        if (tax > 0) {
            super._transfer(
                from,
                address(this),
                tax
            );

            amount -= tax;
        }

        super._transfer(
            from,
            to,
            amount
        );
    }

    function _swapBack()
        private
        lockSwap
    {
        uint256 amount =
            balanceOf(address(this));

        if (amount > maxSwap) {
            amount = maxSwap;
        }

        uint256 poolCap =
            _poolSwapCap();

        if (amount > poolCap) {
            amount = poolCap;
        }

        if (amount == 0) {
            return;
        }

        address[] memory path =
            new address[](2);

        path[0] =
            address(this);

        path[1] =
            weth;

        _approve(
            address(this),
            address(router),
            amount
        );

        try
            router
                .swapExactTokensForETHSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    taxWallet,
                    block.timestamp
                )
        {
            // Swap succeeded.
        } catch {
            // Swap failure is intentionally ignored so sells are not blocked.
        }
    }

    function _poolSwapCap()
        private
        view
        returns (uint256)
    {
        address p = pair;

        if (p == address(0)) {
            return 0;
        }

        (
            uint112 reserve0,
            uint112 reserve1,

        ) = IUniswapV2Pair(p)
            .getReserves();

        uint256 tokenReserve;

        if (
            IUniswapV2Pair(p).token0() ==
            address(this)
        ) {
            tokenReserve =
                uint256(reserve0);
        } else {
            tokenReserve =
                uint256(reserve1);
        }

        return
            (
                tokenReserve *
                    swapPoolBps
            ) / 10_000;
    }

    function _transferOwnership(
        address newOwner
    ) internal override {
        super._transferOwnership(
            newOwner
        );

        if (newOwner != address(0)) {
            taxExempt[newOwner] = true;

            emit TaxExemptSet(
                newOwner,
                true
            );
        }
    }

    receive() external payable {}
}
`},"contracts/interfaces/IDoppler.sol":{content:`// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.17 <0.9.0;

/// @dev Minimal interfaces for the Doppler Airlock launcher and the Uniswap V4
/// Universal Router, reconstructed from Airlock.sol and a decoded on-chain
/// create() + execute() transaction on Robinhood Chain. Only the pieces the
/// executor needs are declared here.

enum ModuleState {
    NotWhitelisted,
    TokenFactory,
    GovernanceFactory,
    PoolInitializer,
    LiquidityMigrator
}

interface ITokenFactory {
    function create(
        uint256 initialSupply,
        address recipient,
        address owner,
        bytes32 salt,
        bytes calldata data
    ) external returns (address);
}

interface IGovernanceFactory {
    function create(address asset, bytes calldata data) external returns (address governance, address timelock);
}

interface IPoolInitializer {
    function initialize(
        address asset,
        address numeraire,
        uint256 numTokensToSell,
        bytes32 salt,
        bytes calldata data
    ) external returns (address pool);
}

interface ILiquidityMigrator {
    function initialize(address asset, address numeraire, bytes calldata data) external returns (address migrationPool);
}

interface IAirlock {
    struct CreateParams {
        uint256 initialSupply;
        uint256 numTokensToSell;
        address numeraire;
        ITokenFactory tokenFactory;
        bytes tokenFactoryData;
        IGovernanceFactory governanceFactory;
        bytes governanceFactoryData;
        IPoolInitializer poolInitializer;
        bytes poolInitializerData;
        ILiquidityMigrator liquidityMigrator;
        bytes liquidityMigratorData;
        address integrator;
        bytes32 salt;
    }

    function create(CreateParams calldata createData)
        external
        returns (address asset, address pool, address governance, address timelock, address migrationPool);

    function getModuleState(address module) external view returns (ModuleState);
}

/// @dev Uniswap V4 PoolKey, matches v4-core's Pools.PoolKey layout exactly
/// (currency ordering, fee, tickSpacing, hooks). Field order is load-bearing.
struct PoolKey {
    address currency0;
    address currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

/// @dev Uniswap Universal Router entrypoint. \`commands\` is a packed byte
/// string of command ids; \`inputs[i]\` is the ABI-encoded parameter blob for
/// commands[i]. Command 0x10 = V4_SWAP (confirmed from a real Robinhood Chain
/// swap transaction against this deployment's UniversalRouter).
interface IUniversalRouter {
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable;
}
`},"contracts/interfaces/IUniswapV2.sol":{content:`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.17 <0.9.0;

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity);

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}
`},"contracts/Lunch7702Atomic.sol":{content:`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ILunchV3Launcher, ILunchV3Router} from "./LunchAtomicExecutor.sol";

interface ILunch7702Buyer {
    function executeBuy(address token, uint24 fee, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96, uint256 deadline, uint256 nonce, bytes calldata signature)
        external returns (uint256 amountOut);
}

/// @notice Code delegated to each buyer EOA through EIP-7702.
/// @dev Executes in the buyer EOA's context, so the router observes that EOA as msg.sender.
contract Lunch7702BuyerDelegate {
    using ECDSA for bytes32;

    bytes32 private constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant BUY_TYPEHASH = keccak256("AuthorizedBuy(address token,uint24 fee,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96,uint256 deadline,uint256 nonce)");
    bytes32 private constant NAME_HASH = keccak256("Lunch7702Buyer");
    bytes32 private constant VERSION_HASH = keccak256("1");
    bytes32 private constant NONCE_SLOT = keccak256("rh-launch.lunch7702.execution-nonce.v1");
    address public immutable coordinator;
    ILunchV3Router public immutable router;
    address public immutable xToken;

    error Unauthorized();
    error ExpiredAuthorization();
    error InvalidNonce();
    error InvalidSignature();

    constructor(address coordinator_, address router_, address xToken_) {
        coordinator = coordinator_;
        router = ILunchV3Router(router_);
        xToken = xToken_;
    }

    function executionNonce() public view returns (uint256 value) {
        bytes32 slot = NONCE_SLOT;
        assembly { value := sload(slot) }
    }

    function executeBuy(address token, uint24 fee, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96, uint256 deadline, uint256 nonce, bytes calldata signature)
        external returns (uint256 amountOut)
    {
        if (msg.sender != coordinator) revert Unauthorized();
        if (block.timestamp > deadline) revert ExpiredAuthorization();
        if (nonce != executionNonce()) revert InvalidNonce();
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, NAME_HASH, VERSION_HASH, block.chainid, address(this)));
        bytes32 structHash = keccak256(abi.encode(BUY_TYPEHASH, token, fee, amountIn, amountOutMinimum, sqrtPriceLimitX96, deadline, nonce));
        if (keccak256(abi.encodePacked("\\x19\\x01", domainSeparator, structHash)).recover(signature) != address(this)) revert InvalidSignature();
        bytes32 slot = NONCE_SLOT;
        assembly { sstore(slot, add(nonce, 1)) }
        ILunchV3Router.ExactInputSingleParams memory params = ILunchV3Router.ExactInputSingleParams({
            tokenIn: xToken,
            tokenOut: token,
            fee: fee,
            recipient: address(this),
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: sqrtPriceLimitX96
        });
        return router.exactInputSingle{value: amountIn}(params);
    }
}

/// @notice Launches Lunch.fun and calls separately delegated buyer EOAs in one atomic transaction.
contract Lunch7702AtomicCoordinator is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
        uint24 fee;
        ILunchV3Launcher.Meta meta;
        bytes32 userSalt;
        uint256 deadline;
    }

    struct Buyer {
        address account;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
        uint256 nonce;
        bytes signature;
    }

    ILunchV3Launcher public immutable launcher;
    address public immutable delegateImplementation;

    error InvalidConfiguration();
    error InvalidBuyer();
    error DuplicateBuyer();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event Atomic7702Launch(address indexed token, uint256 indexed tokenId, uint256 buyerCount);
    event BuyerExecuted(address indexed buyer, address indexed token, uint256 amountIn, uint256 amountOut);

    constructor(address launcher_, address delegateImplementation_) {
        if (launcher_ == address(0) || delegateImplementation_ == address(0)) revert InvalidConfiguration();
        launcher = ILunchV3Launcher(launcher_);
        delegateImplementation = delegateImplementation_;
    }

    function launchAndBuy(LaunchParams calldata params, Buyer[] calldata buyers)
        external payable onlyOwner nonReentrant returns (address token, uint256 tokenId, uint256[] memory amountsOut)
    {
        if (block.timestamp > params.deadline) revert Expired();
        if (params.fee != 10_000 || buyers.length == 0) revert InvalidConfiguration();
        uint256 launchFee = launcher.launchFeeWei();
        if (msg.value != launchFee) revert InvalidConfiguration();

        for (uint256 i; i < buyers.length; ++i) {
            if (buyers[i].account == address(0) || buyers[i].amountIn == 0 || buyers[i].amountOutMinimum == 0) revert InvalidBuyer();
            if (buyers[i].account.codehash != keccak256(abi.encodePacked(hex"ef0100", delegateImplementation))) revert InvalidBuyer();
            for (uint256 j; j < i; ++j) if (buyers[j].account == buyers[i].account) revert DuplicateBuyer();
        }

        (token, tokenId) = _launch(params, launchFee);

        amountsOut = new uint256[](buyers.length);
        for (uint256 i; i < buyers.length; ++i) {
            amountsOut[i] = ILunch7702Buyer(buyers[i].account).executeBuy(
                token, params.fee, buyers[i].amountIn, buyers[i].amountOutMinimum, buyers[i].sqrtPriceLimitX96,
                params.deadline, buyers[i].nonce, buyers[i].signature
            );
            emit BuyerExecuted(buyers[i].account, token, buyers[i].amountIn, amountsOut[i]);
        }
        emit Atomic7702Launch(token, tokenId, buyers.length);
    }

    function _launch(LaunchParams calldata params, uint256 launchFee) private returns (address token, uint256 tokenId) {
        return launcher.launchWithMetaSalt{value: launchFee}(
            params.name, params.symbol, params.totalSupply, params.fee, 0, params.meta, params.userSalt
        );
    }

    function creatorCall(address target, bytes calldata data) external onlyOwner nonReentrant returns (bytes memory result) {
        (bool ok, bytes memory returned) = target.call(data);
        if (!ok) revert ExternalCallFailed(returned);
        return returned;
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        IERC20(token).safeTransfer(recipient, amount);
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        (bool ok, bytes memory returned) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(returned);
    }

    function renounceOwnership() public override onlyOwner { revert OwnershipRenunciationDisabled(); }
}
`},"contracts/LunchAtomicExecutor.sol":{content:`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface ILunchV3Launcher {
    struct Meta {
        string image;
        string banner;
        string description;
        string website;
        string twitter;
        string telegram;
    }

    function launchFeeWei() external view returns (uint256);

    function launchWithMetaSalt(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint24 fee,
        uint256 initialBuyMaxTokens,
        Meta calldata meta,
        bytes32 userSalt
    ) external payable returns (address token, uint256 tokenId);
}

interface ILunchV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/// @title Atomic Lunch.fun launcher and buyer
/// @notice Launches a Lunch.fun token and performs all configured buys inside one transaction.
/// @dev This contract, rather than the controlling EOA, is recorded as the Lunch.fun creator.
contract LunchAtomicExecutor is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
        uint24 fee;
        ILunchV3Launcher.Meta meta;
        bytes32 userSalt;
        uint256 deadline;
    }

    struct Buy {
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    ILunchV3Launcher public immutable launcher;
    ILunchV3Router public immutable router;
    address public immutable xToken;

    error IncorrectValue(uint256 expected, uint256 received);
    error InvalidAddress();
    error InvalidFee();
    error EmptyBuy();
    error Expired();
    error OwnershipRenunciationDisabled();
    error ExternalCallFailed(bytes reason);

    event AtomicLaunch(
        address indexed token,
        uint256 indexed tokenId,
        address indexed controller,
        uint256 buyCount
    );
    event AtomicBuy(address indexed token, address indexed recipient, uint256 amountIn, uint256 amountOut);
    event CreatorCall(address indexed target, uint256 value, bytes data, bytes result);
    event Recovered(address indexed asset, address indexed recipient, uint256 amount);

    constructor(address launcher_, address router_, address xToken_) {
        if (launcher_ == address(0) || router_ == address(0) || xToken_ == address(0)) revert InvalidAddress();
        launcher = ILunchV3Launcher(launcher_);
        router = ILunchV3Router(router_);
        xToken = xToken_;
    }

    /// @notice Atomically launches and buys. Any failure reverts the launch and every buy.
    function launchAndBuy(LaunchParams calldata params, Buy[] calldata buys)
        external
        payable
        onlyOwner
        nonReentrant
        returns (address token, uint256 tokenId, uint256[] memory amountsOut)
    {
        if (params.fee != 10_000) revert InvalidFee();
        if (block.timestamp > params.deadline) revert Expired();

        uint256 buyValue;
        for (uint256 i; i < buys.length; ++i) {
            if (buys[i].recipient == address(0) || buys[i].amountIn == 0 || buys[i].amountOutMinimum == 0) {
                revert EmptyBuy();
            }
            buyValue += buys[i].amountIn;
        }

        uint256 launchFee = launcher.launchFeeWei();
        uint256 expectedValue = launchFee + buyValue;
        if (msg.value != expectedValue) revert IncorrectValue(expectedValue, msg.value);

        (token, tokenId) = _launch(params, launchFee);

        uint256 executorTokenBalance = IERC20(token).balanceOf(address(this));
        if (executorTokenBalance != 0) IERC20(token).safeTransfer(owner(), executorTokenBalance);

        amountsOut = _executeBuys(token, params.fee, buys);
        emit AtomicLaunch(token, tokenId, msg.sender, buys.length);
    }

    function _launch(LaunchParams calldata params, uint256 launchValue)
        private
        returns (address token, uint256 tokenId)
    {
        return launcher.launchWithMetaSalt{value: launchValue}(
            params.name,
            params.symbol,
            params.totalSupply,
            params.fee,
            0,
            params.meta,
            params.userSalt
        );
    }

    function _executeBuys(address token, uint24 fee, Buy[] calldata buys)
        private
        returns (uint256[] memory amountsOut)
    {
        amountsOut = new uint256[](buys.length);
        for (uint256 i; i < buys.length; ++i) {
            ILunchV3Router.ExactInputSingleParams memory swapParams = ILunchV3Router.ExactInputSingleParams({
                tokenIn: xToken,
                tokenOut: token,
                fee: fee,
                recipient: buys[i].recipient,
                amountIn: buys[i].amountIn,
                amountOutMinimum: buys[i].amountOutMinimum,
                sqrtPriceLimitX96: buys[i].sqrtPriceLimitX96
            });
            amountsOut[i] = router.exactInputSingle{value: buys[i].amountIn}(swapParams);
            emit AtomicBuy(token, buys[i].recipient, buys[i].amountIn, amountsOut[i]);
        }
    }

    /// @notice Performs an owner-approved call as the Lunch.fun creator contract.
    /// @dev Use for fee-locker creator settings or recovery; simulate the call before submitting.
    function creatorCall(address target, uint256 value, bytes calldata data)
        external
        payable
        onlyOwner
        nonReentrant
        returns (bytes memory result)
    {
        if (target == address(0)) revert InvalidAddress();
        if (msg.value != value) revert IncorrectValue(value, msg.value);
        (bool ok, bytes memory returned) = target.call{value: value}(data);
        if (!ok) revert ExternalCallFailed(returned);
        emit CreatorCall(target, value, data, returned);
        return returned;
    }

    function recoverETH(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        if (recipient == address(0)) revert InvalidAddress();
        (bool ok, bytes memory reason) = recipient.call{value: amount}("");
        if (!ok) revert ExternalCallFailed(reason);
        emit Recovered(address(0), recipient, amount);
    }

    function recoverToken(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0) || recipient == address(0)) revert InvalidAddress();
        IERC20(token).safeTransfer(recipient, amount);
        emit Recovered(token, recipient, amount);
    }

    function renounceOwnership() public override onlyOwner {
        revert OwnershipRenunciationDisabled();
    }

    receive() external payable {}
}
`},"contracts/test/MockLunchAtomic.sol":{content:`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ILunchV3Launcher, ILunchV3Router} from "../LunchAtomicExecutor.sol";

contract MockLunchToken is ERC20 {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract MockLunchLauncher is ILunchV3Launcher {
    uint256 public constant override launchFeeWei = 0.01 ether;
    address public lastCreator;
    address public lastToken;

    function launchWithMetaSalt(
        string calldata name,
        string calldata symbol,
        uint256,
        uint24,
        uint256 initialBuyMaxTokens,
        Meta calldata,
        bytes32
    ) external payable returns (address token, uint256 tokenId) {
        require(msg.value >= launchFeeWei, "fee");
        MockLunchToken created = new MockLunchToken(name, symbol);
        token = address(created);
        tokenId = 1;
        lastCreator = msg.sender;
        lastToken = token;
        if (initialBuyMaxTokens != 0) created.mint(msg.sender, (msg.value - launchFeeWei) * 1_000);
    }
}

contract MockLunchRouter is ILunchV3Router {
    mapping(address => uint256) public spendByCaller;
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
        require(msg.value == params.amountIn, "value");
        spendByCaller[msg.sender] += msg.value;
        amountOut = params.amountIn * 500;
        require(amountOut >= params.amountOutMinimum, "minimum");
        MockLunchToken(params.tokenOut).mint(params.recipient, amountOut);
    }
}
`}},settings:{optimizer:{enabled:!0,runs:200},evmVersion:"paris",outputSelection:{"*":{"*":["abi","evm.bytecode","evm.deployedBytecode","evm.methodIdentifiers","metadata"],"":["ast"]}}}},yi={runs:200},xi="paris",dt={contractName:pi,compilerVersion:hi,standardJsonInput:mi,optimizer:yi,evmVersion:xi},vi=document.querySelector("#app"),oe={chainId:4663,chainIdHex:"0x1237",chainName:"Robinhood Chain",get rpcUrl(){return`${window.location.origin}/rpc`},router:"0x89e5db8b5aa49aa85ac63f691524311aeb649eba",currencySymbol:"ETH",blockExplorerUrl:"https://robinhoodchain.blockscout.com/",blockscoutApiUrl:"https://robinhoodchain.blockscout.com/api"},y={provider:null,signer:null,contract:null,address:"",walletMode:"",activeFunctionTab:"wallets",generatedWallets:[],lastDeployTxHash:""},C={running:!1,config:null,provider:null,wallets:[],reactiveWallets:[],balances:{},stats:{startedAt:null,totalBuys:0,totalSells:0,reactiveSells:0,totalBuyVolumeEth:0,successfulTrades:0,failedTrades:0,cyclesCompleted:0,lastTradeAt:null,lastError:null},trades:[],loopTimeout:null,reactiveFilter:null},xe={wallets:[],revealed:!1,loading:!1,log:[]},l={},wi=ue.abi.filter(e=>e.type==="function"&&e.stateMutability!=="view"&&e.stateMutability!=="pure"),gi=ue.abi.filter(e=>e.type==="function"&&(e.stateMutability==="view"||e.stateMutability==="pure")),ki=[{id:"accounts",label:"Accounts",icon:"👥"},{id:"multisend",label:"Multisend",icon:"📤"},{id:"sweep",label:"Collect ETH",icon:"🧹"},{id:"mmBot",label:"Market Maker Bot",icon:"🤖"},{id:"wallets",label:"Wallets",icon:"🗂️"},{id:"projectMgmt",label:"Project Management",icon:"📁"},{id:"disperse",label:"Disperse",icon:"🌐"},{id:"walletWash",label:"Wallet Wash",icon:"🔄"},{id:"walletReport",label:"Check Balance",icon:"📋"},{id:"launch",label:"Launch Planner",icon:"🧮"},{id:"pons",label:"Pons Launch",icon:"🚀"},{id:"ponsWash",label:"Pons + Wash",icon:"🔁"},{id:"multiBuys",label:"Multiple Buys",icon:"🛒"},{id:"lunch",label:"Lunch.fun Launch",icon:"🍽️"},{id:"lunchBurst",label:"Lunch Burst",icon:"💥"},{id:"lunchCombo",label:"Lunch + Burst",icon:"⚡"},{id:"doppler",label:"Feel Cash",icon:"🌀"},{id:"verify",label:"Verify",icon:"✅"}],we=["function WETH() external pure returns (address)","function factory() external pure returns (address)","function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable","function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external","function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)","function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external returns (uint256 amountETH)","function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)"],$i=["function getPair(address tokenA, address tokenB) external view returns (address pair)"],Si=["function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)","function token0() external view returns (address)","function token1() external view returns (address)"],Ei=["function approve(address spender, uint256 value) external returns (bool)","function allowance(address owner, address spender) external view returns (uint256)","function balanceOf(address account) external view returns (uint256)"],Ue={name:"Robinhood Chain",id:4663,explorerUrl:"https://robinhoodchain.blockscout.com/",launchContract:"0xF4fC0CD27fC8EcF17E55eE4c3f7201897dF3eb75"},ur=["function dexConfigCount() view returns (uint256)","function launchConfigCount() view returns (uint256)","function getDexConfig(uint256 id) view returns (tuple(string name,address factory,address positionManager,address swapRouter,uint24 poolFee,int24 tickSpacing,bool enabled))","function getLaunchConfig(uint256 id) view returns (tuple(address pairToken,uint256 graduationThreshold,int24 initialTick,uint256 supply,uint16 maxWalletBps,uint16 maxTxBps,uint32 restrictionBlocks,uint24 reservedFee,bool enabled,bool routerRequiresDeadline))","function getLaunchedToken(address token) view returns (tuple(address token,address deployer,address pairedToken,address positionManager,uint256 positionId,uint256 dexId,uint256 launchConfigId,uint256 restrictionsEndBlock,uint256 supply,bool isToken0,uint24 poolFee,bool exists,uint256 initialBuyAmount))","function launchEnabled() view returns (bool)","function launchFee() view returns (uint256)","function locker() view returns (address)","function predictTokenAddress((string name,string symbol,string logo,string description,(string twitter,string telegram,string discord,string website,string farcaster) socials,address feeWallet) params,uint256 launchConfigId,uint256 dexId,bytes32 salt,address tokenDeployer) view returns (address)","function launchToken((string name,string symbol,string logo,string description,(string twitter,string telegram,string discord,string website,string farcaster) socials,address feeWallet) params,uint256 launchConfigId,uint256 dexId,bytes32 salt) payable returns (address token)","event TokenLaunched(address indexed token,address indexed deployer,address indexed dexFactory,address pairToken,address pool,uint256 dexId,uint256 launchConfigId,uint256 positionId,uint256 restrictionsEndBlock,uint256 initialBuyAmount)","function owner() view returns (address)","function whitelistedLaunchers(address launcher) view returns (bool)","function setLaunchEnabled(bool enabled) external","function setWhitelistedLauncher(address launcher, bool enabled) external"],br=["function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"],Pa=["function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16,uint16,uint16,uint8,bool)","function liquidity() view returns (uint128)","function token0() view returns (address)","function token1() view returns (address)"],Ia=["function balanceOf(address account) view returns (uint256)","function withdraw(uint256 amount)"],Re=["function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)","function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)"],mn=["function balanceOf(address account) view returns (uint256)","function decimals() view returns (uint8)","function liquidityPool() view returns (address)","function restrictionEndBlock() view returns (uint256)","function maxWalletLimit() view returns (uint256)","function maxTxLimit() view returns (uint256)"];function fr(){return{factory:null,dexConfig:null,launchConfig:null,launchFee:0n,launchEnabled:!1,locker:"",predictedToken:"",launchedToken:"",launchedPool:"",restrictionsEndBlock:0n,owner:"",isOwner:!1}}const pr=fr(),pa={"":pr};function ot(e=""){return pa[e]||(pa[e]=fr()),pa[e]}const j={name:"Robinhood Chain",id:4663,explorerUrl:"https://robinhoodchain.blockscout.com/",launchContract:"0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6",implementation:"0xc419ba7b9c32103ab8b1a04de4ea2ed518e03749",router:"0xCaf681a66D020601342297493863E78C959E5cb2",atomicExecutor:"0xCE5D2591C5601c639813c84c169F15c24c3DAe31",delegate7702:"0xeC3982E8fB11FA941F73a98Ec7E37d103989C8D6",coordinator7702:"0x25373dEf200d9db41ee3691F8534B8133685ED9d"},hr=["function factory() view returns (address)","function npm() view returns (address)","function xToken() view returns (address)","function feeLocker() view returns (address)","function launchFeeWei() view returns (uint256)","function enforcedSupply() view returns (uint256)","function launchTickMagnitude() view returns (int24)","function midBandTicks() view returns (int24)","function band1DepthWei() view returns (uint256)","function allTokensLength() view returns (uint256)","function predictTokenAddress(string name,string symbol,uint256 totalSupply,address creator,bytes32 userSalt) view returns (address)","function launchWithMetaSalt(string name,string symbol,uint256 totalSupply,uint24 fee,uint256 initialBuyMaxTokens,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt) payable returns (address token,uint256 tokenId)","event V3TokenLaunched(address indexed token,uint256 indexed tokenId,address indexed creator,address pool,uint24 fee)","event V3BandsLaunched(address indexed token,uint256 curveTokenId,uint256 tailTokenId,int24 launchTick,int24 midTick,uint256 band1Tokens,uint256 band2Tokens)","event V3SaltedLaunch(address indexed token,bytes32 userSalt)","event V3TokenMeta(address indexed token,address indexed creator,string image,string banner,string description,string website,string twitter,string telegram)"],mr=["function owner() view returns(address)","function launcher() view returns(address)","function delegateImplementation() view returns(address)","function launchAndBuy((string name,string symbol,uint256 totalSupply,uint24 fee,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt,uint256 deadline) params,(address account,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96,uint256 nonce,bytes signature)[] buyers) payable returns(address,uint256,uint256[])"],Ti=["function coordinator() view returns(address)","function router() view returns(address)","function xToken() view returns(address)","function executionNonce() view returns(uint256)"],yr=600000n,xr=550000n,Ci="https://sequencer.mainnet.chain.robinhood.com",Bn=1000000n,Bi=15000n,ye={factory:null,factoryAddress:"",npm:"",xToken:"",feeLocker:"",launchFee:0n,enforcedSupply:0n,predictedToken:"",launchedToken:"",launchedPool:""},U={name:"Robinhood Chain",id:4663,explorerUrl:"https://robinhoodchain.blockscout.com/",airlock:"0xeb7C034704eF8Dcd2D32324c1545f62fB4aD0862",tokenFactory:"0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",governanceFactory:"0x1B37D3a72082029c44B35B604Ea473617580b69a",poolInitializer:"0x4e3468951D49f2EEa976eD0D6e75fFCb44a9a544",liquidityMigrator:"0x4035f7cce90d78307420a987a9e084bfbdc83e2b",numeraire:"0xba2F330EDb16cD8056f5988d8CE19BbC63475A0e",universalRouter:"0x8876789976dEcBfCbBbe364623C63652db8C0904",poolManager:"0x8366a39CC670B4001A1121B8F6A443A643e40951",hooks:"0x4e3468951D49f2EEa976eD0D6e75fFCb44a9a544",tickSpacing:200,dynamicFeeFlag:8388608,atomicExecutor:""},vr=["function getModuleState(address module) view returns (uint8)","function getAssetData(address asset) view returns (address numeraire,address timelock,address governance,address liquidityMigrator,address poolInitializer,address pool,address migrationPool,uint256 numTokensToSell,uint256 totalSupply,address integrator)","function create((uint256 initialSupply,uint256 numTokensToSell,address numeraire,address tokenFactory,bytes tokenFactoryData,address governanceFactory,bytes governanceFactoryData,address poolInitializer,bytes poolInitializerData,address liquidityMigrator,bytes liquidityMigratorData,address integrator,bytes32 salt) createData) returns (address asset,address pool,address governance,address timelock,address migrationPool)","event Create(address asset,address indexed numeraire,address initializer,address poolOrHook)"],Ri=["function execute(bytes commands, bytes[] inputs, uint256 deadline) payable"],Ai="0x10",Li=6,Pi=11,Ii=14,Mi="tuple(address currency0,address currency1,uint24 fee,int24 tickSpacing,address hooks)",Di=["function owner() view returns (address)","function airlock() view returns (address)","function router() view returns (address)","function hooks() view returns (address)","function tickSpacing() view returns (int24)","function launchAndBuy((uint256 initialSupply,uint256 numTokensToSell,address numeraire,address tokenFactory,bytes tokenFactoryData,address governanceFactory,bytes governanceFactoryData,address poolInitializer,bytes poolInitializerData,address liquidityMigrator,bytes liquidityMigratorData,address integrator,bytes32 salt) createData,(address recipient,uint256 amountIn,uint256 amountOutMinimum)[] buys,bool numeraireIsNative,uint256 deadline) payable returns (address asset,address pool)","event AtomicLaunch(address indexed asset,address indexed pool,address indexed controller,uint256 buyCount)","event AtomicBuy(address indexed asset,address indexed recipient,uint256 amountIn,uint256 amountOutMinimum)"],on={predictedAsset:"",launchedAsset:"",launchedPool:""};function R(e){return e?e.length>18?`${e.slice(0,10)}...${e.slice(-6)}`:e:""}function wr(e){return e.trim()?e.split(",").map(t=>t.trim()).filter(Boolean):[]}function Fi(e,t){return e.type.endsWith("[]")?wr(t):e.type==="bool"?t===!0||t==="true":t.trim()}function gt(e,t){const n=String(e??"").trim().split(/\s+/)[0];if(!n)throw new Error(`${t} is required.`);if(!/^\d+(\.\d+)?$/.test(n))throw new Error(`${t} must be a plain number, for example 1000 or 0.25.`);return n}function _t(e,t,n){return Be(gt(e,n),t)}function me(e,t){return ce(gt(e,t))}function x(e,t="",n="text"){return`<input id="${q(e)}" type="${q(n)}" placeholder="${q(t)}" autocomplete="off" />`}function ge(e,t=""){return`<textarea id="${q(e)}" placeholder="${q(t)}"></textarea>`}function Ln(e,t){return`
    <div class="token-image-drop" data-token-image-drop="${q(e)}">
      <span>${q(t)}</span>
      <div class="token-image-drop-box">
        <span class="token-image-drop-icon">^</span>
        <span class="token-image-drop-caption">Paste an image URL</span>
        <span class="token-image-drop-value" data-token-image-drop-value="${q(e)}"></span>
        <input id="${q(e)}" type="text" placeholder="https://..." autocomplete="off" />
      </div>
    </div>
  `}function Oi(){for(const e of document.querySelectorAll("[data-token-image-drop]")){const t=e.dataset.tokenImageDrop,n=document.querySelector(`#${t}`),a=e.querySelector(".token-image-drop-box"),r=e.querySelector(`[data-token-image-drop-value="${t}"]`);if(!n||!a||!r)continue;const o=()=>{const s=n.value.trim().length>0;a.classList.toggle("has-value",s),r.textContent=s?n.value.trim():""};o(),n.addEventListener("input",o)}}function gr(e=""){return`
          <h2>Pons Launch</h2>
          <p class="hint">Mode B: the deployed Pons factory can launch and perform one atomic initial buy only. Additional wallets buy after the launch restriction window lifts, via the Fast Lane (5 wallets) and 3 Burst sections (15 wallets each, 45 total) below; same-block inclusion is not guaranteed and launch-block extra buys are blocked by the token regardless of caller.</p>

          <!-- Hidden, not removed: Network/Contract/Owner Controls still
          populate and function normally under the hood (ponsSwitchNetwork,
          ponsLoadStatus, the owner-control buttons, etc. all still run) —
          just not shown by default in this tab's UI. -->
          <div class="hidden">
          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${Ue.name} (${Ue.id})" /></label>
            <label>Current block <input id="${e}ponsCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Primary wallet <input id="${e}ponsPrimaryWallet" readonly placeholder="Connect MetaMask" /></label>
            <label>Native balance <input id="${e}ponsPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="${e}ponsSwitchNetwork" type="button">Switch Network</button>
            <button id="${e}ponsLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch contract <input id="${e}ponsLaunchContract" readonly value="${Ue.launchContract}" /></label>
            <label>Launch fee <input id="${e}ponsLaunchFee" readonly placeholder="-" /></label>
            <label>Router <input id="${e}ponsRouter" readonly placeholder="-" /></label>
            <label>Factory <input id="${e}ponsFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="${e}ponsPositionManager" readonly placeholder="-" /></label>
            <label>Wrapped native / pair token <input id="${e}ponsPairToken" readonly placeholder="-" /></label>
            <label>Launch config ID ${x(`${e}ponsLaunchConfigId`,"0")}</label>
            <label>DEX config ID ${x(`${e}ponsDexId`,"0")}</label>
          </div>
          <div class="result" id="${e}ponsContractResult"></div>

          <h2 class="section-gap">Owner Controls</h2>
          <p class="hint">launchToken() reverts with NotWhitelisted() unless public launching is enabled or the caller is a whitelisted launcher. Only the factory owner can change either setting. Click "Load Contract Status" above first to populate this.</p>
          <div class="grid two">
            <label>Factory owner <input id="${e}ponsOwner" readonly placeholder="Load contract status" /></label>
            <label>Public launching (launchEnabled) <input id="${e}ponsLaunchEnabledStatus" readonly placeholder="-" /></label>
            <label>Connected wallet is owner <input id="${e}ponsIsOwner" readonly placeholder="-" /></label>
            <label>Address to check/whitelist ${x(`${e}ponsWhitelistAddress`,"blank = connected wallet")}</label>
            <label>Is that address whitelisted <input id="${e}ponsIsWhitelisted" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="${e}ponsCheckWhitelist" type="button">Check Whitelist Status</button>
            <button id="${e}ponsEnableLaunch" type="button">Enable Public Launching</button>
            <button id="${e}ponsDisableLaunch" type="button">Disable Public Launching</button>
            <button id="${e}ponsWhitelistAdd" type="button">Whitelist This Address</button>
            <button id="${e}ponsWhitelistRemove" type="button">Remove From Whitelist</button>
          </div>
          <p class="hint">These calls only succeed if the connected wallet is the factory owner shown above; otherwise the contract itself reverts the transaction.</p>
          <div class="result" id="${e}ponsOwnerResult"></div>
          </div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the Fast Lane/Burst rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="${e}ponsDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="${e}ponsUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="${e}ponsFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="${e}ponsWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${Ln(`${e}ponsLogo`,"Token Image")}
          <div class="grid two">
            <label class="required">Token name ${x(`${e}ponsTokenName`,"e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${x(`${e}ponsTokenSymbol`,"PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${ge(`${e}ponsDescription`,"Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Twitter / X (optional) ${x(`${e}ponsTwitter`,"https://x.com/...")}</label>
            <label>Telegram (optional) ${x(`${e}ponsTelegram`,"https://t.me/...")}</label>
            <label>Discord (optional) ${x(`${e}ponsDiscord`,"optional")}</label>
            <label>Website (optional) ${x(`${e}ponsWebsite`,"https://...")}</label>
            <label>Farcaster (optional) ${x(`${e}ponsFarcaster`,"optional")}</label>
            <label>Fee wallet / initial buy recipient ${x(`${e}ponsFeeWallet`,"blank = primary wallet")}</label>
            <label>Salt ${x(`${e}ponsSalt`,"blank = random bytes32")}</label>
            <label>Slippage % for later buys ${x(`${e}ponsSlippage`,"5")}</label>
          </div>
          </div>

          <h2 class="section-gap">Atomic Launch Buy (1 wallet)</h2>
          <p class="hint">Row 1 is the only truly atomic buy Pons allows: the primary wallet's initial buy inside launchToken itself. PonsLauncherToken enforces maxWalletLimit/maxTxLimit and blocks all other buys until restrictionEndBlock passes, regardless of who calls the router or whether the caller is a contract — so no additional wallet can be bundled into this same transaction.</p>
          <div id="${e}ponsBuyerRows" class="buyer-rows">
            ${Wi(e)}
          </div>

          <h2 class="section-gap">Review</h2>
          <p class="hint">Validate All / Execute All at the bottom of this tab run this launch step — there's no standalone button here anymore.</p>
          <div class="result" id="${e}ponsReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="${e}ponsExecutionResult"></div>

          <h2 class="section-gap">Fast Lane (5 wallets, fires the instant restrictions lift)</h2>
          <p class="hint">These 5 wallets are prepared before launch and race to submit their own router buys the moment restrictionEndBlock passes — the closest timing Pons allows to a bundle, but not atomic with the launch transaction and not guaranteed to land in the same block as each other. Each wallet spends its own ETH using its own private key, used locally in this page and never stored or transmitted. Validate All / Execute All at the bottom of this tab run this leg — there's no standalone button here anymore.</p>
          <div id="${e}ponsFastLaneRows" class="buyer-rows">
            ${_i(e)}
          </div>
          <div class="result" id="${e}ponsFastLaneReviewResult"></div>
          <div class="result" id="${e}ponsFastLaneExecutionResult"></div>

          ${et.map(({prefix:t,label:n})=>`
          <h2 class="section-gap">${n} (${je} wallets, not atomic)</h2>
          <p class="hint">Standard burst leg: after restrictions lift, each enabled wallet signs and broadcasts its own router buy in parallel using its own private key and ETH balance. Same-block inclusion is not guaranteed. Validate All / Execute All at the bottom of this tab run this leg — there's no standalone button here anymore.</p>
          <div id="${e}${t}BuyerRows" class="buyer-rows">
            ${Hi(t,e)}
          </div>
          <div class="result" id="${e}${t}ReviewResult"></div>
          <div class="result" id="${e}${t}ExecutionResult"></div>
          `).join("")}

          <h2 class="section-gap">Run Everything</h2>
          <div class="function-card pons-all-card">
            <div class="function-head">
              <strong>Run Everything</strong>
              <span>Atomic launch → Fast Lane → Burst 1 → Burst 2 → Burst 3</span>
            </div>
            <p class="hint">Validates and, on a single confirm, executes the launch plus all four wallet legs in sequence: launch fires first, then this waits for restrictionsEndBlock to pass on-chain, then Fast Lane and all three Burst sections broadcast automatically, one after another. Same underlying steps as the individual sections above, just chained from one click, with one combined log below.</p>
            ${e===""?`
            <label class="checkbox-row"><input id="ponsAllThenWash" type="checkbox" checked /> When the bundle finishes, automatically run Wallet Wash: every bundle wallet (Fast Lane + Burst) sells its whole balance through relay wallets into a matched Wash&nbsp;Buy wallet from this project's vault.</label>
            <div class="grid two">
              <label>Wait after bundle before wash starts, seconds ${x("ponsAllWashStartDelay","30")}</label>
              <label>Slippage % for the wash ${x("ponsAllWashSlippage","25")}</label>
            </div>
            <div class="grid two">
              <label>Relay wallets per pair ${x("ponsAllWashRelayCount","2")}</label>
              <label>Delay between hops and pairs, seconds (min-max) ${x("ponsAllWashDelayRange","20-90")}</label>
            </div>
            <div class="grid two">
              <label>Amount variance % ${x("ponsAllWashVariancePct","10")}</label>
              <label>Reserve per wallet for its own gas ${x("ponsAllWashGasReserve","0.0005")}</label>
            </div>
            <label class="checkbox-row"><input id="ponsAllWashUseCrossChain" type="checkbox" /> Route every pair through a disposable Solana wallet instead of same-chain relay wallets</label>
            <div class="grid two">
              <label>Reserve on Solana leg, SOL ${x("ponsAllWashSolanaGasReserve","0.002")}</label>
            </div>
            <p class="hint">The Solana RPC endpoint is taken from the server's <code>SOLANA_RPC_URL</code> — it is never entered here or exposed to the browser.</p>
            <input id="washTokenAddress" type="hidden" />
            <input id="washSlippage" type="hidden" />
            `:""}
            <div class="button-row">
              <button id="${e}ponsValidateAll" type="button">Validate All</button>
              <button id="${e}ponsExecuteAll" type="button">Execute All</button>
            </div>
            <div class="result" id="${e}ponsAllResult"></div>
            ${e===""?'<div class="result" id="ponsAllWashResult"></div>':""}
          </div>
  `}function Wi(e=""){return["Primary wallet"].map((n,a)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${a+1}. ${n}</strong>
        <span>atomic launch buy</span>
      </div>
      <label class="checkbox-row"><input id="${e}ponsBuyerEnabled${a}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Primary wallet / initial buy recipient ${x(`${e}ponsBuyerAddress${a}`,"blank = connected wallet")}</label>
        <label>Native amount to spend ${x(`${e}ponsBuyerAmount${a}`,"0.01")}</label>
        <label>Minimum token output <input id="${e}ponsBuyerMinOut${a}" readonly placeholder="factory uses 0 internally" /></label>
        <label>Available native balance <input id="${e}ponsBuyerBalance${a}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${e}ponsBuyerGas${a}" readonly placeholder="-" /></label>
        <label>Signature / tx status <input id="${e}ponsBuyerStatus${a}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${e}ponsBuyerHash${a}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${e}ponsBuyerReceived${a}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function _i(e=""){const t=(a,r)=>`${e}ponsFastLaneBuyer${a}${r}`;return Array.from({length:5},(a,r)=>`Fast lane wallet ${r+1}`).map((a,r)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${r+1}. ${a}</strong>
        <span>fast lane order ${r+1}</span>
      </div>
      <label class="checkbox-row"><input id="${t("Enabled",r)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(t("Key",r),"used locally; never stored","password")}</label>
        <label>Recipient address ${x(t("Address",r),"blank = buyer wallet")}</label>
        <label>Native amount to spend ${x(t("Amount",r),"0.01")}</label>
        <label>Minimum token output ${x(t("MinOut",r),"required and greater than zero")}</label>
        <label>Available native balance <input id="${t("Balance",r)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${t("Gas",r)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${t("Status",r)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${t("Hash",r)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${t("Received",r)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}const Ni=4e3,s0=3,qi=3e3,je=15,et=[{prefix:"ponsBurst1",label:"Burst 1"},{prefix:"ponsBurst2",label:"Burst 2"},{prefix:"ponsBurst3",label:"Burst 3"}];function Hi(e,t=""){const n=(r,o)=>`${t}${e}Buyer${r}${o}`;return Array.from({length:je},(r,o)=>`Buyer wallet ${o+1}`).map((r,o)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${o+1}. ${r}</strong>
        <span>burst order ${o+1}</span>
      </div>
      <label class="checkbox-row"><input id="${n("Enabled",o)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(n("Key",o),"used locally; never stored","password")}</label>
        <label>Recipient address ${x(n("Address",o),"blank = buyer wallet")}</label>
        <label>Native amount to spend ${x(n("Amount",o),"0.01")}</label>
        <label>Minimum token output ${x(n("MinOut",o),"required and greater than zero")}</label>
        <label>Available native balance <input id="${n("Balance",o)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${n("Gas",o)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${n("Status",o)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${n("Hash",o)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${n("Received",o)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function Ui(){const e=(n,a)=>`multiBurstBuyer${n}${a}`;return Array.from({length:25},(n,a)=>`Buyer wallet ${a+1}`).map((n,a)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${a+1}. ${n}</strong>
        <span>burst order ${a+1}</span>
      </div>
      <label class="checkbox-row"><input id="${e("Enabled",a)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(e("Key",a),"used locally; never stored","password")}</label>
        <label>Recipient address ${x(e("Address",a),"blank = buyer wallet")}</label>
        <label>Native amount to spend ${x(e("Amount",a),"0.01")}</label>
        <label>Available native balance <input id="${e("Balance",a)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${e("Status",a)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${e("Hash",a)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${e("Received",a)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function i0(e="lunch"){const t=(a,r)=>e==="lunch"?`lunchBuyer${a}${r}`:`${e}Buyer${a}${r}`;return["Primary wallet","Buyer wallet 1","Buyer wallet 2","Buyer wallet 3","Buyer wallet 4"].map((a,r)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${r+1}. ${a}</strong>
        <span>order ${r+1}</span>
      </div>
      <label class="checkbox-row"><input id="${t("Enabled",r)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(t("Key",r),"used locally; never stored","password")}</label>
        <label>${r===0?"Creator / first-buy recipient":"Recipient address"} ${x(t("Address",r),r===0?"blank = connected wallet":"0x recipient")}</label>
        <label>Native amount to spend ${x(t("Amount",r),r===0?"0.01":"0")}</label>
        <label>Minimum token output ${x(t("MinOut",r),"required and greater than zero")}</label>
        <label>Available native balance <input id="${t("Balance",r)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${t("Gas",r)}" readonly placeholder="-" /></label>
        <label>Signature / tx status <input id="${t("Status",r)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${t("Hash",r)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${t("Received",r)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function ji(){const e=(n,a)=>`dopplerBuyer${n}${a}`;return["Creator / first-buy recipient","Buyer wallet 2","Buyer wallet 3","Buyer wallet 4","Buyer wallet 5"].map((n,a)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${a+1}. ${n}</strong>
        <span>order ${a+1}</span>
      </div>
      <label class="checkbox-row"><input id="${e("Enabled",a)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Recipient address ${x(e("Address",a),a===0?"blank = connected wallet":"0x recipient")}</label>
        <label>Native amount to spend ${x(e("Amount",a),a===0?"0.01":"0")}</label>
        <label>Minimum token output ${x(e("MinOut",a),"required and greater than zero")}</label>
        <label>Estimated gas <input id="${e("Gas",a)}" readonly placeholder="-" /></label>
        <label>Status <input id="${e("Status",a)}" readonly placeholder="Not started" /></label>
        <label>Token amount received <input id="${e("Received",a)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function Ki(){const e=(n,a)=>`dopplerBurstBuyer${n}${a}`;return Array.from({length:25},(n,a)=>`Buyer wallet ${a+1}`).map((n,a)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${a+1}. ${n}</strong>
        <span>burst order ${a+1}</span>
      </div>
      <label class="checkbox-row"><input id="${e("Enabled",a)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(e("Key",a),"used locally; never stored","password")}</label>
        <label>Recipient address ${x(e("Address",a),"blank = buyer wallet")}</label>
        <label>Native amount to spend ${x(e("Amount",a),"0.01")}</label>
        <label>Minimum token output ${x(e("MinOut",a),"required and greater than zero")}</label>
        <label>Available native balance <input id="${e("Balance",a)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${e("Gas",a)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${e("Status",a)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${e("Hash",a)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${e("Received",a)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function l0(e="lunchBurst"){const t=(a,r)=>e==="lunchBurst"?`lunchBurstBuyer${a}${r}`:`${e}BurstBuyer${a}${r}`;return Array.from({length:25},(a,r)=>`Buyer wallet ${r+1}`).map((a,r)=>`
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${r+1}. ${a}</strong>
        <span>burst order ${r+1}</span>
      </div>
      <label class="checkbox-row"><input id="${t("Enabled",r)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${x(t("Key",r),"used locally; never stored","password")}</label>
        <label>Recipient address ${x(t("Address",r),"blank = buyer wallet")}</label>
        <label>Native amount to spend ${x(t("Amount",r),"0.01")}</label>
        <label>Minimum token output ${x(t("MinOut",r),"required and greater than zero")}</label>
        <label>Available native balance <input id="${t("Balance",r)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${t("Gas",r)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${t("Status",r)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${t("Hash",r)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${t("Received",r)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("")}function kr(e=""){return`
    <div class="function-card">
      <h2>Wallet Wash</h2>
    <p class="hint">Sell with Wallet A, route the resulting ETH through disposable relay wallets, then buy with Wallet B using whatever lands there — a direct A→B transfer is a textbook two-node bubble-map edge (same two wallets, same token, back to back), so this deliberately avoids that. It raises the bar against casual clustering; it does not make the flow untraceable — a determined trace can still follow value through the relay hop. Detects the token's pool automatically (V2 or V3) and applies real slippage protection to both sides. Keys are used locally in this page and never stored or transmitted.</p>

      <div class="result" id="${e}washCrossChainResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Batch Wash (up to 33 pairs)</strong><span>two groups, paired by position</span></div>
      <p class="hint">Two separate lists of private keys, one per line. Sell wallet on line N funds buy wallet on line N through its own relay hop — sell[1]→relay→buy[1], sell[2]→relay→buy[2], and so on, up to 33 pairs. Each pair's relay hop runs independently with its own randomized amount/timing, and pairs run one after another (not simultaneously) with a delay between them, so it doesn't read as 33 identical actions firing at once.</p>
      <div class="wash-columns">
        <div class="wash-column">
          <h3>Sell Wallets</h3>
          <label class="stacked">Private keys, one per line ${ge(`${e}washBatchSellKeys`,`0x_private_key
0x_private_key
0x_private_key`)}</label>
        </div>
        <div class="wash-column">
          <h3>Buy Wallets</h3>
          <label class="stacked">Private keys, one per line, same order as Sell Wallets ${ge(`${e}washBatchBuyKeys`,`0x_private_key
0x_private_key
0x_private_key`)}</label>
        </div>
      </div>
      <div class="grid two">
        <label>Relay wallets per pair ${x(`${e}washBatchRelayCount`,"2")}</label>
        <label>Delay between hops and between pairs, seconds (min-max) ${x(`${e}washBatchDelayRange`,"20-90")}</label>
      </div>
      <div class="grid two">
        <label>Amount variance % ${x(`${e}washBatchVariancePct`,"10")}</label>
        <label>Reserve per wallet for its own gas ${x(`${e}washBatchGasReserve`,"0.0005")}</label>
      </div>
      <p class="hint">Each sell wallet always sells its exact, real on-chain balance — read fresh right before selling, no amount to type or get wrong.</p>
      <label><input type="checkbox" id="${e}washBatchUseCrossChain" /> Route every pair through a disposable Solana wallet instead of same-chain relay wallets (real bridge fees + time per pair — see the Cross-Chain Relay card above for what this does and does not achieve)</label>
      <div class="grid two section-gap">
        <label>Solana RPC URL ${x(`${e}washBatchSolanaRpcUrl`,"blank = server's SOLANA_RPC_URL")}</label>
        <label>Reserve on Solana leg for fees, SOL ${x(`${e}washBatchSolanaGasReserve`,"0.002")}</label>
      </div>
      <button id="${e}washBatchRun" type="button">Run Batch Wash</button>
      <div class="result" id="${e}washBatchResult"></div>
    </div>
  `}const qe={rows:[],tokenAddress:"",tokenSymbol:"",totalSupply:0};function $r(){const e=qe.rows,t=e.reduce((o,s)=>o+s.eth,0),n=e.reduce((o,s)=>o+s.token,0),a=e.reduce((o,s)=>o+s.pctSupply,0),r=B.projects.find(o=>o.id===B.activeProjectId);return`
    <h2>Check Balance</h2>
    <p class="hint">Checks every wallet saved in the active project's vault, plus anything freshly pasted below. Reads each wallet's ETH balance, token balance, and % of total supply — no transactions, read-only.</p>

    <div class="function-card">
      <div class="function-head"><strong>Check Balances</strong></div>
      <p class="hint">
        Token: <strong>${r?q(r.config.tokenAddress)||"not set for this project":"select a project first"}</strong>
        ${r?'<span class="hint-secondary"> &mdash; set in Users &amp; Roles &rarr; Projects</span>':""}
      </p>
      <p class="hint">Saved wallets in this project: <strong id="balanceCheckSavedCount">${qe.savedCount??"…"}</strong></p>
      <label class="stacked">Add more wallets by private key, one per line (saved to this project's vault, then checked alongside the rest)
        ${ge("balanceCheckKeys",`0x_private_key
0x_private_key
0x_private_key`)}
      </label>
      <p class="hint">Pasted keys are saved (encrypted) to the active project's vault before checking, so you never have to paste them again — leave this blank to just re-check everything already saved.</p>
      <button id="balanceCheckRun" type="button">Run</button>
      <div class="result" id="balanceCheckStatus"></div>
    </div>

    ${e.length>0?`
    <div class="function-card section-gap">
      <div class="function-head">
        <strong>${sn(qe.tokenSymbol||"Token")} — ${R(qe.tokenAddress)}</strong>
        <span>${e.length} wallet(s)</span>
      </div>
      <div class="table-wrap-scroll">
        <table class="disperse-table">
          <thead>
            <tr><th>#</th><th>Address</th><th>ETH</th><th>Token Balance</th><th>% of Supply</th></tr>
          </thead>
          <tbody>
            ${e.map((o,s)=>`
              <tr>
                <td>${s+1}</td>
                <td class="mono">${o.address}</td>
                <td>${P(o.eth)}</td>
                <td>${P(o.token)}</td>
                <td>${o.pctSupply.toFixed(4)}%</td>
              </tr>
            `).join("")}
            <tr>
              <td></td>
              <td><strong>Total</strong></td>
              <td><strong>${P(t)}</strong></td>
              <td><strong>${P(n)}</strong></td>
              <td><strong>${a.toFixed(4)}%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `:""}
  `}const nt=[{id:"dev",label:"Dev Wallets",hint:"Deploys/launches the token. Usually just one — a fresh one per launch, since analysts track creator addresses across launches."},{id:"bundle",label:"Bundle Wallets",hint:"Buys in the launch bundle, and doubles as Wallet Wash's sell side later — paired by position with Wash — Buy Wallets below."},{id:"wash-buy",label:"Wallet Wash — Buy Wallets",hint:"Buy side of Wallet Wash's Batch Wash — Bundle[N] (selling) funds Wash-Buy[N], matched by the order both lists were saved in."}],de={wallets:{},revealed:{},selected:{}};function yn(e){return de.selected[e]||(de.selected[e]=new Set),de.selected[e]}const Sr=[{id:"pons",label:"Pons Launch"},{id:"lunch",label:"Lunch.fun Launch"},{id:"lunchCombo",label:"Lunch.fun + Burst"},{id:"doppler",label:"Feel Cash"}],le={expanded:new Set,wallets:{},revealed:{},counts:{}};function Ma(e,t,n={}){const a={...n.headers||{},"X-Project-Id":e};return fetch(t,{...n,headers:a,credentials:"same-origin"})}function Er(){return B.projects.length===0?`
      <h2>Project Management</h2>
      <p class="hint">No projects yet. Create one in Users &amp; Roles &rarr; Projects.</p>
    `:`
    <h2>Project Management</h2>
    <p class="hint">Every project you have access to, with its wallets grouped by category. Expand a project to see addresses, balances, and reveal/delete individual wallets. To move funds (Fund/Collect), switch to that project and use the Wallets tab.</p>
    ${B.projects.map(e=>Cr(e)).join("")}
  `}function Vi(){return`
    <div class="launch-planner">
      <div class="function-head"><strong>Launch Planner</strong><span>calculation only</span></div>
      <p class="hint">Answer two questions. The total budget is split evenly across the requested wallets, then each wallet's token amount and supply percentage are calculated as the price rises sequentially. A wallet may buy any percentage up to the 5% limit.</p>
      <div class="grid two launch-planner-inputs">
        <label>How many dollars will you spend? ${x("launchPlanBudget","6900")}</label>
        <label>How many bundle wallets will you use? ${x("launchPlanWalletCount","100")}</label>
      </div>
      <div class="button-row launch-planner-actions">
        <button id="launchPlanCalculate" type="button">Calculate Launch Plan</button>
        <button id="launchPlanReset" type="button">Reset</button>
      </div>
      <div class="launch-planner-results" id="launchPlanResults" aria-live="polite">
        <p class="hint">Enter your launch assumptions and calculate the bundle plan.</p>
      </div>
    </div>
  `}function Tr(){const e=document.querySelector("#launchPlanResults"),t=Number(l.launchPlanBudget.value),n=Number(l.launchPlanWalletCount.value),a=0,r=1e9,o=3450,s=93400,i=5,c=3;if(![t,a,n,r,o,s,i,c].every(Number.isFinite)){e.innerHTML='<p class="result error">Enter numbers in every planning field.</p>';return}if(t<=0||a<0||a>=t||!Number.isInteger(n)||n<=0||r<=0||o<=0||s<o||i<=0||c<=0){e.innerHTML='<p class="result error">Check the values: budget must exceed reserve, wallet count must be positive, market caps must be positive, and the wallet limit must be greater than zero.</p>';return}const u=t-a,d=u/n,b=i/100,f=D=>o+(s-o)*D**c,p=[];let h=0,m=0;for(let D=0;D<n&&m<1-Number.EPSILON;D+=1){const I=m,H=Math.min(1,I+b),V=z=>(f(I)+f(z))/2*(z-I);let F=I,k=H;for(let z=0;z<60;z+=1){const Z=(F+k)/2;V(Z)<=d?F=Z:k=Z}const O=F,ae=V(O);if(O<=I+Number.EPSILON)break;h+=ae,m=O,p.push({index:D+1,walletCost:ae,walletPct:(O-I)*100,cumulativeFunds:h,marketCap:f(O),cumulativePct:m*100})}const v=r*m,g=r-v,$=f(m),T=o/r,S=$/r,E=(D,I=2)=>D.toLocaleString(void 0,{maximumFractionDigits:I}),L=D=>`$${D.toFixed(8)}`,M=p.length<n&&m<1;e.innerHTML=`
    <div class="launch-planner-summary">
      <div><span>Requested wallets</span><strong>${E(n,0)}</strong></div>
      <div><span>Wallets funded</span><strong>${E(p.length,0)}</strong></div>
      <div><span>USD spent</span><strong>$${E(h,2)}</strong></div>
      <div><span>Supply bought</span><strong>${E(m*100,2)}%</strong></div>
    </div>
    <div class="launch-planner-details">
      <div><span>Tokens bought</span><strong>${E(v,0)}</strong></div>
      <div><span>Average per-wallet spend</span><strong>$${E(p.length?h/p.length:0,2)}</strong></div>
      <div><span>Remaining supply</span><strong>${E(g,2)}</strong></div>
      <div><span>Initial price</span><strong>${L(T)}</strong></div>
      <div><span>Final price</span><strong>${L(S)}</strong></div>
      <div><span>Final market cap</span><strong>$${E($,2)}</strong></div>
      <div><span>Budget per wallet</span><strong>$${E(d,2)}</strong></div>
    </div>
    <div class="launch-planner-table-wrap"><table class="launch-planner-table"><thead><tr><th>Wallet</th><th>USD this wallet</th><th>Supply this wallet</th><th>Cumulative USD</th><th>Cumulative supply</th><th>Market cap</th></tr></thead><tbody>${p.map(D=>`<tr><td>${D.index}</td><td>$${E(D.walletCost,2)}</td><td>${E(D.walletPct,4)}%</td><td>$${E(D.cumulativeFunds,2)}</td><td>${E(D.cumulativePct,2)}%</td><td>$${E(D.marketCap,2)}</td></tr>`).join("")}</tbody></table></div>
    <p class="hint ${M?"launch-planner-warning":""}">${M?`The requested budget cannot be distributed across all ${E(n,0)} wallets without exceeding the ${E(i,2)}% wallet limit. ${E(p.length,0)} wallets were funded; the remaining budget is $${E(u-h,2)}.`:`The full $${E(u,2)} buy budget is distributed across ${E(n,0)} wallets. Each wallet's supply percentage is calculated independently and may be different as the price rises.`}</p>
  `}function Gi(){l.launchPlanBudget.value="6900",l.launchPlanWalletCount.value="100",Tr()}function Cr(e){var s,i;const t=le.expanded.has(e.id),n=le.counts[e.id],a=n?nt.map(c=>`${n[c.id]??0} ${c.label.replace(" Wallets","").replace("Wallet Wash — ","")}`).join(" · "):"Loading counts...",r=e.id===B.activeProjectId,o=B.canManageProjects?`<div class="project-mgmt-token-row">
        <input type="text" class="mono" data-project-mgmt-token-input="${e.id}" placeholder="0x token address" value="${q(((s=e.config)==null?void 0:s.tokenAddress)||"")}" />
        <button type="button" data-project-mgmt-save-token="${e.id}">Save</button>
      </div>
      <div class="result" id="projectMgmtTokenResult_${e.id}"></div>`:`<p class="hint mono">${q(((i=e.config)==null?void 0:i.tokenAddress)||"no token address set")}</p>`;return`
    <div class="function-card section-gap" data-project-mgmt-card="${e.id}">
      <div class="function-head">
        <strong>${q(e.name)}${r?' <span class="active-project-badge">active</span>':""}</strong>
        <span>${a}</span>
      </div>
      ${o}
      <div class="button-row">
        <button type="button" data-project-mgmt-toggle="${e.id}">${t?"Collapse":"Expand"}</button>
        ${r?"":`<button type="button" data-project-mgmt-switch="${e.id}">Switch To This Project</button>`}
      </div>
      ${t?`<div class="project-mgmt-detail section-gap">${zi(e)}</div>`:""}
    </div>
  `}function zi(e){const t=le.wallets[e.id]||{},n=le.revealed[e.id]||{};return nt.map(a=>{const r=t[a.id],o=!!n[a.id];return r===void 0?`<div class="project-mgmt-category"><strong>${q(a.label)}</strong> <span class="hint">loading...</span></div>`:`
      <div class="project-mgmt-category">
        <div class="function-head">
          <strong>${q(a.label)}</strong>
          <span>${r.length} wallet(s)</span>
        </div>
        <div class="button-row">
          <button type="button" data-project-mgmt-reveal="${e.id}:${a.id}">${o?"Hide Keys":"Reveal Keys"}</button>
        </div>
        ${r.length>0?`
        <div class="table-wrap-scroll">
          <table class="disperse-table">
            <thead><tr><th>#</th><th>Address</th>${o?"<th>Private Key</th>":""}<th>Label</th><th></th></tr></thead>
            <tbody>
              ${r.map((s,i)=>`
                <tr>
                  <td>${i+1}</td>
                  <td class="mono">${s.address}</td>
                  ${o?`<td class="mono">${q(s.privateKey||"")}</td>`:""}
                  <td>${q(s.label||"")}</td>
                  <td><button type="button" class="project-mgmt-delete" data-project="${e.id}" data-category="${a.id}" data-address="${s.address}">Delete</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>`:""}
      </div>
    `}).join("")}async function Xi(){let e=!1;for(const t of B.projects){if(le.counts[t.id])continue;const n={};for(const a of nt)try{const r=await Ma(t.id,`/api/wallets?chain=evm&category=${a.id}`),o=await r.json();n[a.id]=r.ok?o.wallets.length:0}catch{n[a.id]=0}le.counts[t.id]=n,e=!0}e&&_n()}async function Yi(e){if(le.expanded.has(e)){le.expanded.delete(e),_n();return}le.expanded.add(e),_n();for(const t of nt)await Da(e,t.id,!1)}async function Da(e,t,n){try{const a=await Ma(e,`/api/wallets?chain=evm&category=${t}${n?"&reveal=1":""}`),r=await a.json();if(!a.ok)throw new Error(r.error||"Failed to load wallets.");le.wallets[e]||(le.wallets[e]={}),le.revealed[e]||(le.revealed[e]={}),le.wallets[e][t]=r.wallets,le.revealed[e][t]=n,le.counts[e]||(le.counts[e]={}),le.counts[e][t]=r.wallets.length,Qi(e)}catch(a){w(`Project Management: failed to load ${t} wallets for project ${e} — ${a.message}`)}}async function Ji(e,t,n){var a;if(window.confirm(`Remove ${R(n)} from this project's ${t} wallets? This cannot be undone.`))try{const r=await Ma(e,`/api/wallets?address=${encodeURIComponent(n)}`,{method:"DELETE"}),o=await r.json();if(!r.ok)throw new Error(o.error||"Failed to remove wallet.");w(`Project Management: removed ${R(n)} from project ${e}.`);const s=((a=le.revealed[e])==null?void 0:a[t])||!1;await Da(e,t,s)}catch(r){w(`Project Management: delete failed — ${r.message}`)}}function Zi(e){Yn(e);const t=document.querySelector("#activeProjectSelect");t&&(t.value=e),_n()}function _n(){const e=document.querySelector('[data-tab-panel="projectMgmt"]');e&&(e.innerHTML=Er(),Rr())}function Qi(e){const t=B.projects.find(a=>a.id===e),n=document.querySelector(`[data-project-mgmt-card="${e}"]`);!t||!n||(n.outerHTML=Cr(t),Br(e))}function Br(e){var n,a,r;const t=document.querySelector(`[data-project-mgmt-card="${e}"]`);if(t){(n=t.querySelector(`[data-project-mgmt-toggle="${e}"]`))==null||n.addEventListener("click",()=>Yi(e)),(a=t.querySelector(`[data-project-mgmt-switch="${e}"]`))==null||a.addEventListener("click",()=>Zi(e)),(r=t.querySelector(`[data-project-mgmt-save-token="${e}"]`))==null||r.addEventListener("click",()=>el(e));for(const o of t.querySelectorAll("[data-project-mgmt-reveal]")){const[s,i]=o.dataset.projectMgmtReveal.split(":");o.addEventListener("click",()=>{var u;const c=((u=le.revealed[s])==null?void 0:u[i])||!1;Da(s,i,!c)})}for(const o of t.querySelectorAll(".project-mgmt-delete"))o.addEventListener("click",()=>Ji(o.dataset.project,o.dataset.category,o.dataset.address))}}async function el(e){const t=document.querySelector(`[data-project-mgmt-token-input="${e}"]`),n=document.querySelector(`#projectMgmtTokenResult_${e}`),a=(t==null?void 0:t.value.trim())||"";try{n&&(n.textContent="Saving...");const r=await fetch("/api/admin/projects",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({id:e,tokenAddress:a})}),o=await r.json();if(!r.ok)throw new Error(o.error||"Failed to save token address.");const s=B.projects.find(i=>i.id===e);s&&(s.config.tokenAddress=a),n&&(n.textContent=a?"Saved.":"Cleared."),w(`Project Management: saved token address for project ${e}.`)}catch(r){n&&(n.textContent=r.message)}}function Rr(){for(const e of B.projects)Br(e.id);B.projects.length>0&&Xi()}function Ar(){return B.activeProjectId?`
    <h2>Wallets</h2>
    ${c0()}
    <p class="hint">Generate or import wallets for this project, grouped by what they're used for. Keys are encrypted at rest and only decrypted when you click Reveal.</p>
    ${nt.map(e=>Pr(e)).join("")}
    ${Lr()}
  `:`
      <h2>Wallets</h2>
      ${c0()}
      <p class="hint section-gap">Select or create a project (top of the page, or above) to generate or manage its wallets.</p>
    `}function c0(){return B.canManageProjects?`
    <div class="function-card section-gap">
      <div class="function-head"><strong>Create Project</strong><span>a project is where a token's wallets, config, and launchpad live</span></div>
      <label>Project name ${x("walletsNewProjectName","e.g. Stoxi")}</label>
      <p class="hint">No token address needed yet — it doesn't exist until you actually launch. Once a launch confirms on any launchpad tab, its token address is saved to this project automatically.</p>
      <button id="walletsCreateProject" type="button">Create Project</button>
      <div class="result" id="walletsCreateProjectResult"></div>
    </div>
  `:""}function Lr(){var n;const e=B.projects.find(a=>a.id===B.activeProjectId),t=((n=e==null?void 0:e.config)==null?void 0:n.platform)||"";return`
    <div class="function-card section-gap" data-wallet-platform-card>
      <div class="function-head"><strong>Platform</strong></div>
      <div class="platform-pill-row">
        ${Sr.map(a=>`
          <button type="button" class="platform-pill${a.id===t?" active":""}" data-platform-pill="${a.id}">${q(a.label)}</button>
        `).join("")}
      </div>
      <p class="hint">Saves this project's target launchpad and switches you to that tab. Change it any time — it just decides where "Launch" takes you, it does not restrict which tabs you can otherwise open.</p>
      <div class="result" id="walletPlatformResult"></div>
    </div>
  `}function Pr(e){const t=de.wallets[e.id]||[],n=de.revealed[e.id],a=yn(e.id),r=t.filter(i=>a.has(i.address)).length,o=t.reduce((i,c)=>i+(c.balanceEth||0),0),s=nt.filter(i=>i.id!==e.id).flatMap(i=>(de.wallets[i.id]||[]).map(c=>({...c,categoryLabel:i.label})));return`
    <div class="function-card section-gap" data-wallet-category="${e.id}">
      <div class="function-head"><strong>${q(e.label)}</strong><span>${t.length} saved &middot; ${P(o)} ETH total</span></div>
      <p class="hint">${q(e.hint)}</p>
      <div class="grid two">
        <label>Generate count ${x(`walletsGenCount_${e.id}`,"1")}</label>
        <label>Label, optional ${x(`walletsGenLabel_${e.id}`,"optional note")}</label>
      </div>
      <div class="button-row">
        <button type="button" data-wallets-generate="${e.id}">Generate New</button>
        <button type="button" data-wallets-reveal="${e.id}">${n?"Hide Keys":"Reveal Keys"}</button>
        <button type="button" data-wallets-balances="${e.id}">Load Balances</button>
        <button type="button" data-wallets-refresh="${e.id}">Refresh</button>
      </div>
      <label class="stacked">Import by private key, one per line
        ${ge(`walletsImportKeys_${e.id}`,`0x_private_key
0x_private_key`)}
      </label>
      <button type="button" data-wallets-import="${"0x"+e.id}">Import</button>
      <div class="result" data-wallets-status="${e.id}"></div>

      ${t.length>0?`
      <div class="wallets-fund-row section-gap">
        <label>Fund from
          <select id="walletsFundSource_${e.id}">
            <option value="">Use a pasted key instead...</option>
            ${s.map(i=>`<option value="${i.address}">${q(i.categoryLabel)} — ${R(i.address)}</option>`).join("")}
          </select>
        </label>
        <label>Or source private key ${x(`walletsFundSourceKey_${e.id}`,"0x... (used instead of the dropdown)","password")}</label>
        <label>ETH per wallet ${x(`walletsFundAmount_${e.id}`,"0.01")}</label>
        <button type="button" data-wallets-fund="${e.id}">Fund Selected (${r})</button>
        <label>Collect to ${x(`walletsCollectTo_${e.id}`,"0x destination")}</label>
        <button type="button" data-wallets-collect="${e.id}">Collect Selected (${r}) ETH</button>
      </div>
      <p class="hint">Fund sends the source wallet's key locally in this browser only — never stored or transmitted. Collect sweeps each selected wallet's ETH minus gas back to the destination; a wallet with too little balance to cover gas is skipped, not failed.</p>

      <div class="table-wrap-scroll section-gap">
        <table class="disperse-table">
          <thead><tr>
            <th><input type="checkbox" data-wallets-select-all="${e.id}" ${t.length>0&&r===t.length?"checked":""} /></th>
            <th>#</th><th>Address</th><th>ETH</th>${n?"<th>Private Key</th>":""}<th>Label</th><th></th>
          </tr></thead>
          <tbody>
            ${t.map((i,c)=>`
              <tr>
                <td><input type="checkbox" class="wallets-select" data-category="${e.id}" data-address="${i.address}" ${a.has(i.address)?"checked":""} /></td>
                <td>${c+1}</td>
                <td class="mono">${i.address}</td>
                <td>${i.balanceEth!=null?P(i.balanceEth):"—"}</td>
                ${n?`<td class="mono">${q(i.privateKey||"")}</td>`:""}
                <td>${q(i.label||"")}</td>
                <td><button type="button" class="wallets-delete" data-address="${i.address}" data-category="${e.id}">Delete</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>`:""}
    </div>
  `}function tl(){const e=document.querySelector('[data-tab-panel="wallets"]');e&&(e.innerHTML=Ar(),Ir())}function Ir(){var e;for(const t of document.querySelectorAll("[data-wallets-generate]"))t.addEventListener("click",()=>Wr(t.dataset.walletsGenerate));for(const t of document.querySelectorAll("[data-wallets-import]"))t.addEventListener("click",()=>_r(t.dataset.walletsImport));for(const t of document.querySelectorAll("[data-wallets-reveal]"))t.addEventListener("click",()=>Or(t.dataset.walletsReveal));for(const t of document.querySelectorAll("[data-wallets-balances]"))t.addEventListener("click",()=>Xn(t.dataset.walletsBalances));for(const t of document.querySelectorAll("[data-wallets-refresh]"))t.addEventListener("click",()=>yt(t.dataset.walletsRefresh,de.revealed[t.dataset.walletsRefresh]));for(const t of document.querySelectorAll("[data-wallets-fund]"))t.addEventListener("click",()=>Hr(t.dataset.walletsFund));for(const t of document.querySelectorAll("[data-wallets-collect]"))t.addEventListener("click",()=>Ur(t.dataset.walletsCollect));for(const t of document.querySelectorAll(".wallets-select"))t.addEventListener("change",()=>Dr(t.dataset.category,t.dataset.address,t.checked));for(const t of document.querySelectorAll("[data-wallets-select-all]"))t.addEventListener("change",()=>Fr(t.dataset.walletsSelectAll,t.checked));for(const t of document.querySelectorAll(".wallets-delete"))t.addEventListener("click",()=>Nr(t.dataset.category,t.dataset.address));for(const t of document.querySelectorAll("[data-platform-pill]"))t.addEventListener("click",()=>Mr(t.dataset.platformPill));if((e=document.querySelector("#walletsCreateProject"))==null||e.addEventListener("click",nl),B.activeProjectId)for(const t of nt)yt(t.id,!1)}async function nl(){const e=document.querySelector("#walletsCreateProjectResult"),t=document.querySelector("#walletsNewProjectName"),n=t==null?void 0:t.value.trim();if(!n){e&&(e.textContent="Enter a project name.");return}try{e&&(e.textContent="Creating...");const a=await fetch("/api/admin/projects",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({name:n})}),r=await a.json();if(!a.ok)throw new Error(r.error||"Failed to create project.");e&&(e.textContent=`Created "${r.project.name}". Switching to it...`),await Fa(),await Yn(r.project.id);const o=document.querySelector("#activeProjectSelect");o&&(o.value=r.project.id),w(`Wallets: created project "${r.project.name}" and switched to it.`),tl()}catch(a){e&&(e.textContent=a.message)}}async function Gn(e,t){if(!(!B.activeProjectId||!e))try{const n=await fetch("/api/admin/projects",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({id:B.activeProjectId,tokenAddress:e})}),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to save token address.");const r=B.projects.find(o=>o.id===B.activeProjectId);r&&(r.config.tokenAddress=e),w(`${t}: saved launched token ${e} to the active project's config.`)}catch(n){w(`${t}: could not save the launched token address to the project (${n.message}) — the launch itself still succeeded.`)}}async function Mr(e){var n,a;const t=document.querySelector("#walletPlatformResult");if(B.activeProjectId)try{t&&(t.textContent="Saving...");const r=await fetch("/api/admin/projects",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({id:B.activeProjectId,platform:e})}),o=await r.json();if(!r.ok)throw new Error(o.error||"Failed to save platform.");const s=B.projects.find(i=>i.id===B.activeProjectId);s&&(s.config.platform=e),t&&(t.textContent=`Saved. Switching to ${((n=Sr.find(i=>i.id===e))==null?void 0:n.label)||e}...`),y.activeFunctionTab=e,Ua(e),(a=document.querySelector(`[data-tab="${e}"]`))==null||a.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"}),al()}catch(r){t&&(t.textContent=A(r))}}function al(){const e=document.querySelector("[data-wallet-platform-card]");if(e){e.outerHTML=Lr();for(const t of document.querySelectorAll("[data-platform-pill]"))t.addEventListener("click",()=>Mr(t.dataset.platformPill))}}function Dr(e,t,n){const a=yn(e);n?a.add(t):a.delete(t),zn(e)}function Fr(e,t){const n=yn(e),a=de.wallets[e]||[];t?a.forEach(r=>n.add(r.address)):n.clear(),zn(e)}function ee(e,t){const n=document.querySelector(`[data-wallets-status="${e}"]`);n&&(n.textContent=t)}async function yt(e,t){if(B.activeProjectId)try{const n=await ve(`/api/wallets?chain=evm&category=${e}${t?"&reveal=1":""}`),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to load wallets.");de.wallets[e]=a.wallets,de.revealed[e]=t,zn(e)}catch(n){ee(e,n.message)}}function zn(e){var r,o,s,i,c,u,d,b;const t=nt.find(f=>f.id===e),n=document.querySelector(`[data-wallet-category="${e}"]`);if(!t||!n)return;n.outerHTML=Pr(t);const a=document.querySelector(`[data-wallet-category="${e}"]`);(r=a.querySelector(`[data-wallets-generate="${e}"]`))==null||r.addEventListener("click",()=>Wr(e)),(o=a.querySelector(`[data-wallets-import="${e}"]`))==null||o.addEventListener("click",()=>_r(e)),(s=a.querySelector(`[data-wallets-reveal="${e}"]`))==null||s.addEventListener("click",()=>Or(e)),(i=a.querySelector(`[data-wallets-balances="${e}"]`))==null||i.addEventListener("click",()=>Xn(e)),(c=a.querySelector(`[data-wallets-refresh="${e}"]`))==null||c.addEventListener("click",()=>yt(e,de.revealed[e])),(u=a.querySelector(`[data-wallets-fund="${e}"]`))==null||u.addEventListener("click",()=>Hr(e)),(d=a.querySelector(`[data-wallets-collect="${e}"]`))==null||d.addEventListener("click",()=>Ur(e)),(b=a.querySelector(`[data-wallets-select-all="${e}"]`))==null||b.addEventListener("change",f=>Fr(e,f.target.checked));for(const f of a.querySelectorAll(".wallets-select"))f.addEventListener("change",()=>Dr(e,f.dataset.address,f.checked));for(const f of a.querySelectorAll(".wallets-delete"))f.addEventListener("click",()=>Nr(e,f.dataset.address))}function Or(e){yt(e,!de.revealed[e])}async function Wr(e){if(!B.activeProjectId)return ee(e,"Select a project first.");const t=document.querySelector(`#walletsGenCount_${e}`),n=document.querySelector(`#walletsGenLabel_${e}`),a=Math.max(1,Math.min(200,parseInt(t==null?void 0:t.value)||1)),r=(n==null?void 0:n.value.trim())||"";ee(e,`Generating ${a} wallet(s)...`);try{const o=await ve("/api/wallets/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({count:a,label:r,category:e})}),s=await o.json();if(!o.ok)throw new Error(s.error||"Wallet generation failed.");ee(e,`Generated ${s.wallets.length} wallet(s).`),w(`Wallets (${e}): generated ${s.wallets.length} wallet(s).`),await yt(e,de.revealed[e]),e==="dev"&&lt()}catch(o){ee(e,o.message)}}async function _r(e){if(!B.activeProjectId)return ee(e,"Select a project first.");const t=document.querySelector(`#walletsImportKeys_${e}`),n=Ke((t==null?void 0:t.value)||"");if(n.length===0)return ee(e,"Paste at least one private key.");ee(e,`Importing ${n.length} wallet(s)...`);try{const a=await ve("/api/wallets/save",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({privateKeys:n,label:"imported",category:e})}),r=await a.json();if(!a.ok)throw new Error(r.error||"Wallet import failed.");ee(e,`Imported ${r.wallets.length} wallet(s). ${n.length-r.wallets.length>0?`${n.length-r.wallets.length} skipped (invalid or already saved).`:""}`),w(`Wallets (${e}): imported ${r.wallets.length} wallet(s).`),t&&(t.value=""),await yt(e,de.revealed[e]),e==="dev"&&lt()}catch(a){ee(e,a.message)}}async function Nr(e,t){if(window.confirm(`Remove ${R(t)} from ${e}? This cannot be undone.`))try{const n=await ve(`/api/wallets?address=${encodeURIComponent(t)}`,{method:"DELETE"}),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to remove wallet.");ee(e,`Removed ${R(t)}.`),w(`Wallets (${e}): removed ${R(t)}.`),await yt(e,de.revealed[e]),e==="dev"&&lt()}catch(n){ee(e,n.message)}}async function Xn(e){const t=de.wallets[e]||[];if(t.length!==0){ee(e,`Loading ${t.length} balance(s)...`);try{const n=te(),a=await Promise.all(t.map(r=>n.getBalance(r.address)));t.forEach((r,o)=>{r.balanceEth=Number(W(a[o]))}),ee(e,`Loaded ${t.length} balance(s).`),zn(e)}catch(n){ee(e,A(n))}}}async function qr(e,t){const n=await ve(`/api/wallets?chain=evm&category=${e}&reveal=1`),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to reveal wallets.");const r=new Set(t.map(o=>o.toLowerCase()));return a.wallets.filter(o=>r.has(o.address.toLowerCase()))}async function Hr(e){var f;const t=de.wallets[e]||[],n=yn(e),a=t.filter(p=>n.has(p.address)).map(p=>p.address);if(a.length===0)return ee(e,"Select at least one wallet to fund.");const r=document.querySelector(`#walletsFundAmount_${e}`),o=parseFloat(r==null?void 0:r.value);if(!o||o<=0)return ee(e,"Enter an ETH amount per wallet greater than zero.");const s=document.querySelector(`#walletsFundSource_${e}`),i=document.querySelector(`#walletsFundSourceKey_${e}`),c=i==null?void 0:i.value.trim(),u=te();let d;try{if(c)d=new K(c,u);else if(s!=null&&s.value){const p=(f=nt.find(m=>m.id!==e&&(de.wallets[m.id]||[]).some(v=>v.address===s.value)))==null?void 0:f.id;if(!p)throw new Error("Could not find the selected source wallet's category.");const[h]=await qr(p,[s.value]);if(!h)throw new Error("Could not reveal the selected source wallet's key.");d=new K(h.privateKey,u)}else throw new Error("Pick a source wallet or paste a source private key.")}catch(p){ee(e,p.message);return}ee(e,`Funding ${a.length} wallet(s) with ${P(o)} ETH each from ${R(d.address)}...`),w(`Wallets (${e}): funding ${a.length} wallet(s) with ${P(o)} ETH each from ${R(d.address)}.`);let b=0;for(const[p,h]of a.entries())try{const m=await d.sendTransaction({to:h,value:ce(P(o))});await m.wait(),w(`Fund ${p+1}/${a.length} to ${R(h)}: ${m.hash}`),b++}catch(m){w(`Fund ${p+1}/${a.length} to ${R(h)} failed: ${A(m)}`)}ee(e,`Funded ${b}/${a.length} wallet(s). Check log for hashes and failures.`),await Xn(e)}async function Ur(e){const t=de.wallets[e]||[],n=yn(e),a=t.filter(b=>n.has(b.address)).map(b=>b.address);if(a.length===0)return ee(e,"Select at least one wallet to collect from.");const r=document.querySelector(`#walletsCollectTo_${e}`),o=r==null?void 0:r.value.trim();if(!Y(o||""))return ee(e,"Enter a valid destination address.");ee(e,`Revealing ${a.length} wallet key(s)...`);let s;try{s=await qr(e,a)}catch(b){ee(e,b.message);return}const i=te();ee(e,`Collecting from ${s.length} wallet(s) to ${R(o)}...`),w(`Wallets (${e}): collecting from ${s.length} wallet(s) to ${R(o)}.`);let c=0,u=0,d=0;for(const[b,f]of s.entries())try{const p=new K(f.privateKey,i),h=await i.getBalance(f.address),m=await i.getFeeData(),g=await p.estimateGas({to:o,value:h>1n?1n:0n})*130n/100n,$=m.maxFeePerGas??m.gasPrice;if($==null)throw new Error("Could not read gas price from RPC.");const T=g*($*130n/100n),S=h-T;if(S<=0n){w(`Collect ${b+1}/${s.length}: ${R(f.address)} balance too low (${W(h)} ETH, needs ${W(T)} ETH for gas). Skipped.`),u++;continue}const E={to:o,value:S,gasLimit:g};m.maxFeePerGas!=null?(E.maxFeePerGas=m.maxFeePerGas*130n/100n,E.maxPriorityFeePerGas=m.maxPriorityFeePerGas!=null?m.maxPriorityFeePerGas*130n/100n:void 0):E.gasPrice=m.gasPrice*130n/100n;const L=await p.sendTransaction(E);await L.wait(),w(`Collect ${b+1}/${s.length} from ${R(f.address)}: ${L.hash}`),c++}catch(p){d++,w(`Collect ${b+1}/${s.length} from ${R(f.address)} failed: ${A(p)}`)}ee(e,`Collected from ${c}/${s.length}. Skipped (too low): ${u}. Failed: ${d}. Check log for hashes.`),await Xn(e)}function jr(){const e=xe.wallets;return`
    <h2>Disperse</h2>
    <p class="hint">Generate wallets on the server, saved (encrypted) in the database so they persist across sessions — then send ETH or a token from one source wallet to every saved wallet in one flow.</p>

    <div class="function-card">
      <div class="function-head"><strong>Generate Wallets</strong><span>${e.length} saved</span></div>
      <div class="grid two">
        <label>Wallets to generate ${x("disperseGenerateCount","10")}</label>
        <label>Label, optional ${x("disperseGenerateLabel","e.g. batch-1")}</label>
      </div>
      <div class="button-row">
        <button id="disperseGenerate" type="button">Generate &amp; Save</button>
        <button id="disperseLoadWallets" type="button">Load Saved Wallets</button>
        <button id="disperseRevealKeys" type="button">Reveal Private Keys</button>
        <button id="disperseExportJson" type="button">Export JSON</button>
        <button id="disperseExportCsv" type="button">Export CSV</button>
      </div>
      <div class="result" id="disperseWalletResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Saved Wallets</strong></div>
      <p class="hint">${xe.revealed?"Private keys are visible below — treat this screen like a wallet backup. Close it when done.":'Private keys are hidden. Click "Reveal Private Keys" to load and display them.'}</p>
      <div class="table-wrap-scroll">
        <table class="disperse-table">
          <thead>
            <tr><th>#</th><th>Address</th><th>Label</th>${xe.revealed?"<th>Private Key</th>":""}<th>Created</th><th></th></tr>
          </thead>
          <tbody id="disperseWalletRows">
            ${e.length===0?'<tr><td colspan="6" class="disperse-empty">No wallets loaded yet. Click "Load Saved Wallets".</td></tr>':e.map((t,n)=>`
                <tr>
                  <td>${n+1}</td>
                  <td class="mono">${t.address}</td>
                  <td>${sn(t.label||"-")}</td>
                  ${xe.revealed?`<td class="mono">${sn(t.privateKey||"-")}</td>`:""}
                  <td>${t.createdAt?new Date(t.createdAt).toLocaleString():"-"}</td>
                  <td><button type="button" class="disperse-delete" data-address="${t.address}">Remove</button></td>
                </tr>
              `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Disperse Transfer</strong></div>
      <p class="hint">Sends from one source wallet's private key to every saved wallet's address above (loads the list automatically if not already loaded).</p>
      <label>Source wallet private key ${x("disperseSourceKey","0x_private_key","password")}</label>
      <div class="grid two">
        <label>Asset
          <select id="disperseAsset">
            <option value="eth" selected>ETH</option>
            <option value="token">Token</option>
          </select>
        </label>
        <label>Token address, required for Token ${x("disperseTokenAddress","blank = current contract")}</label>
      </div>
      <div class="grid two">
        <label>Distribution
          <select id="disperseMode">
            <option value="split" selected>Split total evenly</option>
            <option value="each">Fixed amount per wallet</option>
          </select>
        </label>
        <label>Amount ${x("disperseAmount","1 total, or per-wallet amount")}</label>
      </div>
      <div class="button-row">
        <button id="disperseRun" type="button">Disperse To Saved Wallets</button>
      </div>
      <div class="result" id="disperseRunResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Multi-Hop Fund</strong><span>break up the single-source star pattern</span></div>
      <p class="hint">A direct source → many-wallets transfer (Disperse Transfer above) is a textbook star cluster on a bubble map: one bright hub, every spoke funded from the same address, all created together. This routes the same ETH through a middle layer of disposable relay wallets first — source → 2-3 relays → your saved wallets — with a randomized amount and delay on every hop, so no single address is the obvious funder of every wallet. This raises the bar against casual clustering; it does not make the funds untraceable — a determined trace can still follow value through the relays.</p>
      <div class="grid two">
        <label>Source wallet private key ${x("hopSourceKey","0x_private_key","password")}</label>
        <label>Relay wallets ${x("hopRelayCount","3")}</label>
      </div>
      <div class="grid two">
        <label>Total ETH to distribute ${x("hopTotalAmount","1.0")}</label>
        <label>Delay between hops, seconds (min-max) ${x("hopDelayRange","20-90")}</label>
      </div>
      <div class="grid two">
        <label>Amount variance % (randomizes each send ± this much) ${x("hopVariancePct","15")}</label>
        <label>Reserve per relay for its own gas ${x("hopGasReserve","0.0005")}</label>
      </div>
      <div class="button-row">
        <button id="hopFundRun" type="button">Run Multi-Hop Fund</button>
      </div>
      <div class="result" id="hopFundResult"></div>
    </div>
  `}function Kr(){const e=C.stats,t=e.startedAt?Date.now()-e.startedAt:0,n=e.successfulTrades+e.failedTrades>0?`${Math.round(e.successfulTrades/(e.successfulTrades+e.failedTrades)*100)}%`:"--",a=Object.values(C.balances).reduce((o,s)=>({eth:o.eth+(s.eth||0),token:o.token+(s.token||0)}),{eth:0,token:0}),r=C.wallets.length;return`
    <div class="mmbot-grid">
      <div class="mmbot-col">
        <div class="function-card mmbot-card">
          <div class="function-head">
            <strong>Market Maker Bot</strong>
            <span class="mmbot-badge ${C.running?"running":"stopped"}">${C.running?"RUNNING":"STOPPED"}</span>
          </div>
          <label>Token Mint Address ${x("mmTokenAddress","Enter token contract address")}</label>
          <p class="hint">Trades route through the pool for the Router address set in the Deploy section above — no separate router or pool address needed here.</p>
          <label class="stacked">Wallet private keys, one per line ${ge("mmWalletKeys",`0x_private_key
0x_private_key
0x_private_key`)}</label>
          <p class="hint">These wallets place the buy/sell orders. Keys are only used locally in this browser and are never stored or sent anywhere.</p>
          <div class="grid two">
            <label>Wallets to generate ${x("mmGenerateCount","5")}</label>
            <label>Import wallets.json <input id="mmImportFile" type="file" accept="application/json" /></label>
          </div>
          <div class="button-row mmbot-wallet-actions">
            <button id="mmGenerateWallets" type="button">Generate Wallets</button>
            <button id="mmDownloadWallets" type="button" title="Download market-making-wallets.json">Download Wallets JSON</button>
          </div>
          <div class="result" id="mmWalletResult"></div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Fund Wallets</strong></div>
          <p class="hint">Multisends ETH or tokens from one funding wallet to every bot wallet listed above, split evenly (or a fixed amount each). Runs before the bot starts so wallets have gas/inventory to trade with immediately.</p>
          <label>Funding wallet private key ${x("mmFundingKey","0x_private_key","password")}</label>
          <div class="grid two">
            <label>Asset to send
              <select id="mmFundAsset">
                <option value="eth" selected>ETH</option>
                <option value="token">Token</option>
              </select>
            </label>
            <label>Distribution
              <select id="mmFundMode">
                <option value="split" selected>Split total evenly</option>
                <option value="each">Fixed amount per wallet</option>
              </select>
            </label>
          </div>
          <label>Amount ${x("mmFundAmount","0.5 total, or per-wallet amount")}</label>
          <div class="button-row">
            <button id="mmFundWallets" type="button">Fund Wallets</button>
            <button id="mmFundAndStart" type="button">Fund Wallets &amp; Start Bot</button>
          </div>
          <div class="result" id="mmFundResult"></div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Trade Settings</strong></div>
          <div class="grid two">
            <label>Min Buy (ETH) ${x("mmMinBuy","0.001")}</label>
            <label>Max Buy (ETH) ${x("mmMaxBuy","0.01")}</label>
            <label>Min Sell (%) ${x("mmMinSellPct","10")}</label>
            <label>Max Sell (%) ${x("mmMaxSellPct","50")}</label>
          </div>
          <label>Sell Hardcap (tokens, 0 = off) ${x("mmSellHardcap","0")}</label>
          <label class="stacked">Buy Weight
            <input id="mmBuyWeight" type="range" min="0" max="100" value="50" />
          </label>
          <p class="hint" id="mmBuyWeightLabel">Buy: 50% / Sell: 50%</p>
          <div class="grid two">
            <label>Interval
              <select id="mmIntervalUnit">
                <option value="per_minute" selected>Per Minute</option>
                <option value="per_second">Per Second</option>
              </select>
            </label>
            <label class="stacked">Txns: <span id="mmTxnsLabel">2</span>
              <input id="mmTxnsPerUnit" type="range" min="1" max="30" value="2" />
            </label>
          </div>
          <div class="grid two">
            <label>Slippage (%) ${x("mmSlippage","25")}</label>
            <label>Gas Price, gwei, optional ${x("mmGasPrice","blank = network suggested")}</label>
            <label>Min ETH Reserve ${x("mmMinReserve","0.005")}</label>
          </div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Reactive Sell</strong></div>
          <label class="checkbox-row"><input id="mmReactiveEnabled" type="checkbox" /> Enable</label>
          <div class="grid two">
            <label>Reactive sell (%) ${x("mmReactivePct","50")}</label>
            <label>Reactive sell max tokens, 0 = off ${x("mmReactiveMaxTokens","0")}</label>
          </div>
          <label class="stacked">Reactive wallet keys, one per line, optional ${ge("mmReactiveKeys","blank = use the wallets above")}</label>
          <p class="hint">When enabled, an external buy on this token triggers an automatic sell from the wallets above (or the dedicated reactive wallets), sized as a percentage of the detected buy.</p>
        </div>

        <button id="mmStartStop" class="mmbot-start-btn">${C.running?"Stop Bot":"Start Bot"}</button>
      </div>

      <div class="mmbot-col">
        <div class="function-card mmbot-card">
          <div class="function-head"><strong>Live Stats</strong></div>
          <div class="mmbot-stats-grid">
            ${We("Uptime",C.running||t>0?Vr(t):"--","","data-mm-uptime")}
            ${We("Cycles",e.cyclesCompleted)}
            ${We("Total Buys",e.totalBuys,"good")}
            ${We("Total Sells",e.totalSells,"bad")}
            ${We("Reactive Sells",e.reactiveSells,"accent")}
            ${We("Buy Vol (ETH)",P(e.totalBuyVolumeEth))}
            ${We("Success Rate",n)}
            ${We("Wallets",r)}
            ${We("ETH Balance",r?P(a.eth):"--")}
            ${We("Token Balance",r?P(a.token):"--")}
          </div>
          <div class="mmbot-error-tile">
            <span>Pool</span>
            <strong>${rl()}</strong>
          </div>
          <div class="mmbot-error-tile">
            <span>Last Error</span>
            <strong>${e.lastError?sn(e.lastError):"--"}</strong>
          </div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head">
            <strong>Trade Log</strong>
            <span class="mmbot-badge accent">${C.trades.length}</span>
          </div>
          <div class="mmbot-log" id="mmTradeLog">
            ${C.trades.length===0?'<p class="hint">Bot not started</p>':C.trades.map(ol).join("")}
          </div>
        </div>
      </div>
    </div>
  `}function We(e,t,n="",a=""){return`<div class="mmbot-stat"><span>${e}</span><strong class="${n}" ${a}>${t}</strong></div>`}function rl(){const e=C.config;return e?e.poolVersion==="v3"?`${R(e.v3PoolAddress)} (V3)`:e.pairAddress?`${R(e.pairAddress)} (V2)`:"Checked at start":"Checked at start"}function ol(e){const t=new Date(e.time).toLocaleTimeString(),n=e.status==="success"?"good":e.status==="skipped"?"":"bad",a=e.status==="success"?`${P(e.amount)} ${e.unit}${e.hash?` · ${R(e.hash)}`:""}`:e.error||e.status;return`<div class="mmbot-log-row ${n}">
    <span class="mmbot-log-time">${t}</span>
    <span class="mmbot-log-action">${e.action}</span>
    <span class="mmbot-log-wallet">${e.wallet?R(e.wallet):"-"}</span>
    <span class="mmbot-log-detail">${sn(a)}</span>
  </div>`}function Vr(e){const t=Math.floor(e/1e3),n=Math.floor(t/3600),a=Math.floor(t%3600/60),r=t%60;return`${String(n).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function P(e){const t=Number(e||0);return Number(t.toFixed(6)).toString()}function sn(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function Nn(e){const t=Number(e.min)||0,n=Number(e.max)||100,a=(Number(e.value)-t)/(n-t)*100;e.style.setProperty("--range-fill",`${a}%`)}function sl(e){const t=Number(l.mmBuyWeight.value);document.querySelector("#mmBuyWeightLabel").textContent=`Buy: ${t}% / Sell: ${100-t}%`,Nn(e?e.currentTarget:l.mmBuyWeight)}function il(e){document.querySelector("#mmTxnsLabel").textContent=l.mmTxnsPerUnit.value,Nn(e?e.currentTarget:l.mmTxnsPerUnit)}const Gr=["mmTokenAddress","mmWalletKeys","mmGenerateCount","mmImportFile","mmFundingKey","mmFundAsset","mmFundMode","mmFundAmount","mmMinBuy","mmMaxBuy","mmMinSellPct","mmMaxSellPct","mmSellHardcap","mmBuyWeight","mmIntervalUnit","mmTxnsPerUnit","mmSlippage","mmGasPrice","mmMinReserve","mmReactiveEnabled","mmReactivePct","mmReactiveMaxTokens","mmReactiveKeys"];function zr(){const e=document.querySelector('[data-tab-panel="disperse"]');e&&(e.innerHTML=jr(),Yr())}const Xr=["disperseGenerateCount","disperseGenerateLabel","disperseSourceKey","disperseAsset","disperseTokenAddress","disperseMode","disperseAmount","hopSourceKey","hopRelayCount","hopTotalAmount","hopDelayRange","hopVariancePct","hopGasReserve"];function ll(){for(const e of Xr)l[e]=document.querySelector(`#${e}`)}function Yr(){ll(),document.querySelector("#disperseGenerate").addEventListener("click",fl),document.querySelector("#disperseLoadWallets").addEventListener("click",()=>vt(!1)),document.querySelector("#disperseRevealKeys").addEventListener("click",()=>vt(!0)),document.querySelector("#disperseExportJson").addEventListener("click",()=>u0("json")),document.querySelector("#disperseExportCsv").addEventListener("click",()=>u0("csv")),document.querySelector("#disperseRun").addEventListener("click",hl),document.querySelector("#hopFundRun").addEventListener("click",cl);for(const e of document.querySelectorAll(".disperse-delete"))e.addEventListener("click",()=>pl(e.dataset.address))}function tt(e){return new Promise(t=>setTimeout(t,e))}function qn(e,t,n){const a=[];let r=e;for(let o=0;o<t;o+=1){if(o===t-1){a.push(Math.max(0,r));break}const s=r/(t-o),i=s*(n/100),c=Math.max(0,s+(Math.random()*2-1)*i);a.push(c),r-=c}return a}function xt(e){const[t,n]=e.split("-").map(o=>o.trim()),a=Math.max(0,parseFloat(t)||0),r=Math.max(a,parseFloat(n)||a);return Math.floor((a+Math.random()*(r-a))*1e3)}async function cl(){const e=document.querySelector("#hopFundResult"),t=[],n=a=>{t.push(`[${new Date().toLocaleTimeString()}] ${a}`),e.textContent=t.join(`
`),w(`Multi-Hop Fund: ${a}`)};try{const a=l.hopSourceKey.value.trim();if(!a)throw new Error("Enter the source wallet's private key.");const r=Math.max(2,Math.min(6,parseInt(l.hopRelayCount.value)||3)),o=parseFloat(l.hopTotalAmount.value);if(!o||o<=0)throw new Error("Enter a total ETH amount greater than zero.");const s=Math.max(0,Math.min(90,parseFloat(l.hopVariancePct.value)||15)),i=Math.max(0,parseFloat(l.hopGasReserve.value)||5e-4),c=l.hopDelayRange.value.trim()||"20-90";if(xe.wallets.length===0&&(n("Loading saved wallets first..."),await vt(!1)),xe.wallets.length===0)throw new Error("No saved wallets found. Generate some in the Saved Wallets section first.");const u=te(),d=new K(a,u),b=Array.from({length:r},()=>K.createRandom().connect(u));n(`Generated ${r} disposable relay wallet(s): ${b.map(v=>R(v.address)).join(", ")}`),n(`Hop 1/2: source ${R(d.address)} → ${r} relay(s), total ${P(o)} ETH, randomized ±${s}% per send, ${c}s delay between sends.`);const f=qn(o,r,s);for(const[v,g]of b.entries()){const $=f[v];if($<=0)continue;const T=await d.sendTransaction({to:g.address,value:ce(P($))});if(n(`  → relay ${v+1} (${R(g.address)}): ${P($)} ETH — ${T.hash}`),await T.wait(),v<b.length-1){const S=xt(c);n(`  waiting ${(S/1e3).toFixed(1)}s before next hop-1 send...`),await tt(S)}}n(`Hop 2/2: each relay → a shuffled share of the ${xe.wallets.length} saved wallet(s), reserving ${i} ETH per relay for its own gas.`);const p=[...xe.wallets].sort(()=>Math.random()-.5),h=[];for(let v=0;v<r;v+=1)h.push([]);p.forEach((v,g)=>h[g%r].push(v));let m=0;for(const[v,g]of b.entries()){const $=h[v];if($.length===0)continue;const T=Number(W(await u.getBalance(g.address))),S=Math.max(0,T-i);if(S<=0){n(`  relay ${v+1} (${R(g.address)}) has no spendable balance after gas reserve — skipping its ${$.length} target(s).`);continue}const E=qn(S,$.length,s);for(const[L,M]of $.entries()){const D=E[L];if(D<=0)continue;try{const H=await g.sendTransaction({to:M.address,value:ce(P(D))});n(`  relay ${v+1} → ${R(M.address)}: ${P(D)} ETH — ${H.hash}`),await H.wait(),m++}catch(H){n(`  relay ${v+1} → ${R(M.address)} failed: ${H.shortMessage||H.message}`)}const I=xt(c);await tt(I)}}n(`Done: funded ${m}/${xe.wallets.length} saved wallet(s) via ${r} relay hop(s).`),n(`Relay private keys (for sweeping any leftover dust — these were never saved anywhere): ${b.map(v=>`${R(v.address)}=${v.privateKey}`).join(" | ")}`)}catch(a){e.textContent=`${e.textContent}
Failed: ${A(a)}`.trim(),w(`Multi-Hop Fund failed: ${A(a)}`)}}const Jr=["balanceCheckKeys"];function dl(){for(const e of Jr)l[e]=document.querySelector(`#${e}`)}function d0(){const e=document.querySelector('[data-tab-panel="walletReport"]');e&&(e.innerHTML=$r(),Zr())}function Zr(){dl(),document.querySelector("#balanceCheckRun").addEventListener("click",bl),ul()}async function ul(){const e=document.querySelector("#balanceCheckSavedCount");if(!(!e||!B.activeProjectId))try{const t=await ve("/api/wallets?chain=evm"),n=await t.json();t.ok&&(qe.savedCount=n.wallets.length,e.textContent=String(n.wallets.length))}catch{}}async function bl(){var s;const e=document.querySelector("#balanceCheckStatus");if(!B.activeProjectId){e.textContent="Select a project first (top of the page).";return}const t=B.projects.find(i=>i.id===B.activeProjectId),n=(s=t==null?void 0:t.config.tokenAddress)==null?void 0:s.trim();if(!n||!Y(n)){e.textContent="This project has no valid token address set — add one in Users & Roles → Projects.";return}const a=Ke(l.balanceCheckKeys.value);e.textContent="Loading saved wallets for this project...";let r;try{if(a.length>0){e.textContent=`Saving ${a.length} new wallet(s) to the project vault...`;const u=await ve("/api/wallets/save",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({privateKeys:a,label:"balance-check"})}),d=await u.json();if(!u.ok)throw new Error(d.error||"Failed to save pasted wallets.");w(`Check Balance: saved ${d.wallets.length} new wallet(s) to the project vault.`),l.balanceCheckKeys.value=""}const i=await ve("/api/wallets?chain=evm"),c=await i.json();if(!i.ok)throw new Error(c.error||"Failed to load saved wallets.");r=c.wallets.map(u=>u.address),qe.savedCount=r.length}catch(i){e.textContent=A(i),w(`Check Balance failed: ${A(i)}`);return}if(r.length===0){e.textContent="No wallets saved in this project yet — paste some private keys above to add them.",d0();return}const o=te();e.textContent=`Checking ${r.length} wallet(s)...`;try{const i=new _(n,ue.abi,o);let c=18,u="TOKEN",d=0n;try{c=Number(await i.decimals())}catch{}try{u=await i.symbol()}catch{}try{d=await i.totalSupply()}catch{}const b=Number(X(d,c)),f=await Promise.all(r.map(async m=>{const[v,g]=await Promise.all([o.getBalance(m),i.balanceOf(m).catch(()=>0n)]),$=Number(W(v)),T=Number(X(g,c)),S=b>0?T/b*100:0;return{address:m,eth:$,token:T,pctSupply:S}}));qe.rows=f,qe.tokenAddress=n,qe.tokenSymbol=u,qe.totalSupply=b;const p=f.reduce((m,v)=>m+v.eth,0),h=f.reduce((m,v)=>m+v.pctSupply,0);e.textContent=`Checked ${f.length} wallet(s). Total ${P(p)} ETH, ${h.toFixed(4)}% of ${u} supply.`,w(`Check Balance: ${f.length} wallet(s) — total ${P(p)} ETH, ${h.toFixed(4)}% of supply.`),d0()}catch(i){e.textContent=A(i),w(`Check Balance failed: ${A(i)}`)}}async function fl(){const e=document.querySelector("#disperseWalletResult");if(!B.activeProjectId){e.textContent="Select a project first.";return}const t=Math.max(1,Math.min(200,parseInt(l.disperseGenerateCount.value)||10)),n=l.disperseGenerateLabel.value.trim();e.textContent=`Generating ${t} wallet(s) on the server...`;try{const a=await ve("/api/wallets/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({count:t,label:n}),credentials:"same-origin"}),r=await a.json();if(!a.ok)throw new Error(r.error||"Wallet generation failed.");e.textContent=`Generated and saved ${r.wallets.length} wallet(s). Click "Load Saved Wallets" to see addresses, or "Reveal Private Keys" to see keys.`,w(`Disperse: generated ${r.wallets.length} wallet(s).`),await vt(!1)}catch(a){e.textContent=a.message,w(`Disperse generate failed: ${a.message}`)}}async function vt(e){const t=document.querySelector("#disperseWalletResult");if(!B.activeProjectId){t.textContent="Select a project first.";return}t.textContent=e?"Loading wallets with private keys...":"Loading saved wallets...";try{const n=await ve(`/api/wallets${e?"?reveal=1":""}`),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to load wallets.");xe.wallets=a.wallets,xe.revealed=e,t.textContent=`Loaded ${a.wallets.length} saved wallet(s).`,w(`Disperse: loaded ${a.wallets.length} wallet(s)${e?" with private keys":""}.`),zr()}catch(n){t.textContent=n.message,w(`Disperse load failed: ${n.message}`)}}async function pl(e){if(!window.confirm(`Remove ${R(e)} from the saved wallet vault? This cannot be undone.`))return;const t=document.querySelector("#disperseWalletResult");try{const n=await ve(`/api/wallets?address=${encodeURIComponent(e)}`,{method:"DELETE"}),a=await n.json();if(!n.ok)throw new Error(a.error||"Failed to remove wallet.");xe.wallets=xe.wallets.filter(r=>r.address.toLowerCase()!==e.toLowerCase()),t.textContent=`Removed ${R(e)}.`,w(`Disperse: removed wallet ${R(e)}.`),zr()}catch(n){t.textContent=n.message}}function u0(e){if(!B.activeProjectId){w("Disperse export failed: select a project first.");return}window.open(`/api/wallets/export?format=${e}&projectId=${encodeURIComponent(B.activeProjectId)}`,"_blank"),w(`Disperse: exported wallets as ${e.toUpperCase()}.`)}async function hl(){var p;const e=document.querySelector("#disperseRunResult"),t=l.disperseSourceKey.value.trim();if(!t){e.textContent="Enter the source wallet's private key.";return}if(xe.wallets.length===0&&(e.textContent="Loading saved wallets first...",await vt(!1),xe.wallets.length===0)){e.textContent="No saved wallets found. Generate some first.";return}const n=l.disperseAsset.value,a=l.disperseTokenAddress.value.trim()||((p=y.contract)==null?void 0:p.target);if(n==="token"&&!Y(a||"")){e.textContent="Enter a valid token address (or attach a contract first).";return}const r=parseFloat(l.disperseAmount.value);if(!r||r<=0){e.textContent="Enter an amount greater than zero.";return}const o=l.disperseMode.value,s=xe.wallets.map(h=>h.address),i=o==="split"?r/s.length:r,c=te();let u;try{u=new K(t,c)}catch(h){e.textContent=`Invalid source private key — ${h.message}`;return}e.textContent=`Sending ${P(i)} ${n==="eth"?"ETH":"token"} to ${s.length} saved wallet(s)...`,w(`Disperse: sending ${P(i)} ${n==="eth"?"ETH":"token"} each to ${s.length} wallet(s) from ${R(u.address)}.`);let d=null,b=18;if(n==="token"){d=new _(a,ue.abi,u);try{b=Number(await d.decimals())}catch{}}let f=0;for(const[h,m]of s.entries())try{const v=n==="eth"?await u.sendTransaction({to:m,value:ce(P(i))}):await d.transfer(m,Be(P(i),b));await v.wait(),w(`Disperse ${h+1}/${s.length} to ${R(m)}: ${v.hash}`),f++}catch(v){w(`Disperse ${h+1}/${s.length} to ${R(m)} failed: ${v.shortMessage||v.message}`)}e.textContent=`Dispersed to ${f}/${s.length} wallet(s). Check log for hashes and failures.`}function At(){const e=document.querySelector('[data-tab-panel="mmBot"]');e&&(e.innerHTML=Kr(),ml(),Qr())}function ml(){for(const e of Gr)l[e]=document.querySelector(`#${e}`)}function Qr(){document.querySelector("#mmStartStop").addEventListener("click",kl),document.querySelector("#mmBuyWeight").addEventListener("input",sl),document.querySelector("#mmTxnsPerUnit").addEventListener("input",il),Nn(l.mmBuyWeight),Nn(l.mmTxnsPerUnit),document.querySelector("#mmGenerateWallets").addEventListener("click",vl),document.querySelector("#mmDownloadWallets").addEventListener("click",wl),document.querySelector("#mmImportFile").addEventListener("change",gl),document.querySelector("#mmFundWallets").addEventListener("click",()=>b0(!1)),document.querySelector("#mmFundAndStart").addEventListener("click",()=>b0(!0))}async function b0(e){var m;const t=document.querySelector("#mmFundResult"),n=l.mmFundingKey.value.trim();if(!n){t.textContent="Enter the funding wallet's private key.";return}const a=Ke(l.mmWalletKeys.value);if(a.length===0){t.textContent="Add bot wallets first (paste keys, generate, or import).";return}const r=l.mmTokenAddress.value.trim()||((m=y.contract)==null?void 0:m.target),o=l.mmFundAsset.value;if(o==="token"&&!Y(r||"")){t.textContent="Enter a valid Token Mint Address first — required to send tokens.";return}const s=parseFloat(l.mmFundAmount.value);if(!s||s<=0){t.textContent="Enter an amount greater than zero.";return}const c=l.mmFundMode.value==="split"?s/a.length:s,u=te();let d;try{d=new K(n,u)}catch(v){t.textContent=`Invalid funding private key — ${v.message}`;return}const b=a.map(v=>new K(v).address);t.textContent=`Sending ${P(c)} ${o==="eth"?"ETH":"token"} to ${b.length} wallet(s)...`,w(`Market Maker Bot: funding ${b.length} wallet(s) with ${P(c)} ${o==="eth"?"ETH":"token"} each from ${R(d.address)}.`);let f=null,p=18;if(o==="token"){f=new _(r,ue.abi,d);try{p=Number(await f.decimals())}catch{}}let h=0;for(const[v,g]of b.entries())try{const $=o==="eth"?await d.sendTransaction({to:g,value:ce(P(c))}):await f.transfer(g,Be(P(c),p));await $.wait(),w(`Fund ${v+1}/${b.length} to ${R(g)}: ${$.hash}`),h++}catch($){w(`Fund ${v+1}/${b.length} to ${R(g)} failed: ${$.shortMessage||$.message}`)}t.textContent=`Funded ${h}/${b.length} wallet(s) with ${P(c)} ${o==="eth"?"ETH":"token"} each. Check log for hashes and failures.`,e&&h>0&&await eo()}async function st(e,t,n){const a=await yl(e,t,n);if(a.exists)return a;const r=await xl(e,n);return r.exists?r:{exists:!1,error:`No V2 pool (${a.error}) and no V3 pool (${r.error}).`}}async function yl(e,t,n){try{const a=new _(t,we,e),[r,o]=await Promise.all([a.WETH(),a.factory()]),i=await new _(o,$i,e).getPair(n,r);if(!i||i===he)return{exists:!1,error:"factory has no V2 pair for this token/WETH"};const c=new _(i,Si,e),[u,d]=await c.getReserves(),f=(await c.token0()).toLowerCase()===n.toLowerCase(),p=f?u:d,h=f?d:u;return p===0n||h===0n?{exists:!1,pairAddress:i,error:"V2 pair exists but has zero reserves"}:{exists:!0,version:"v2",pairAddress:i,wethReserve:Number(W(h)),tokenReserve:Number(X(p,18))}}catch(a){return{exists:!1,error:a.shortMessage||a.message}}}async function xl(e,t){try{const a=await zt(e).getDexConfig(0);if(!a.enabled||!a.factory||a.factory===he)return{exists:!1,error:"no V3 DEX config available"};const r=new _(a.factory,br,e),o=oe.router?await new _(oe.router,we,e).WETH():null;if(!o)return{exists:!1,error:"could not resolve WETH address"};const s=await r.getPool(t,o,a.poolFee);if(!s||s===he)return{exists:!1,error:"no V3 pool for this token/WETH at the known fee tier"};const i=new _(s,Pa,e),[c,u]=await Promise.all([i.liquidity(),i.token0()]);return c===0n?{exists:!1,poolAddress:s,error:"V3 pool exists but has zero liquidity"}:{exists:!0,version:"v3",poolAddress:s,wethAddress:o,swapRouter:a.swapRouter,poolFee:a.poolFee,isToken0:u.toLowerCase()===t.toLowerCase()}}catch(n){return{exists:!1,error:n.shortMessage||n.message}}}function Ke(e){return e.split(/\r?\n/).map(t=>t.trim()).filter(Boolean)}function vl(){const e=Math.max(1,Math.min(200,parseInt(l.mmGenerateCount.value)||5)),t=Array.from({length:e},()=>K.createRandom());l.mmWalletKeys.value=t.map(n=>n.privateKey).join(`
`),C.lastGenerated=t.map(n=>({address:n.address,privateKey:n.privateKey})),document.querySelector("#mmWalletResult").textContent=`Generated ${e} wallet(s) locally. Download the JSON to keep a copy, or start the bot with them now.`,w(`Market Maker Bot: generated ${e} fresh wallet(s) locally.`)}function wl(){const e=Ke(l.mmWalletKeys.value);if(e.length===0){document.querySelector("#mmWalletResult").textContent="Generate or paste wallet keys first.";return}let t;try{t=e.map(o=>{const s=new K(o);return{address:s.address,privateKey:s.privateKey}})}catch(o){document.querySelector("#mmWalletResult").textContent=`Invalid private key — ${o.message}`;return}const n=new Blob([JSON.stringify({generatedAt:new Date().toISOString(),wallets:t},null,2)],{type:"application/json"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download="market-making-wallets.json",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(a),document.querySelector("#mmWalletResult").textContent=`Downloaded market-making-wallets.json with ${t.length} wallet(s). Keep this file private — it contains raw private keys.`,w(`Market Maker Bot: downloaded market-making-wallets.json with ${t.length} wallet(s).`)}async function gl(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(t)try{const a=await t.text(),r=JSON.parse(a),o=Array.isArray(r)?r:r.wallets;if(!Array.isArray(o)||o.length===0)throw new Error("No wallets found in file.");const s=o.map(i=>i.privateKey||i.secretKey||i.key).filter(Boolean);if(s.length===0)throw new Error("File has no privateKey fields.");l.mmWalletKeys.value=s.join(`
`),document.querySelector("#mmWalletResult").textContent=`Imported ${s.length} wallet(s) from ${t.name}.`,w(`Market Maker Bot: imported ${s.length} wallet(s) from ${t.name}.`)}catch(a){document.querySelector("#mmWalletResult").textContent=`Import failed — ${a.message}`}finally{e.target.value=""}}function an(e){C.trades.unshift({time:Date.now(),...e}),C.trades.length>200&&(C.trades.length=200)}async function kl(){C.running?$l():await eo()}async function eo(){var f;const e=l.mmTokenAddress.value.trim()||((f=y.contract)==null?void 0:f.target);if(!Y(e||"")){w("Market Maker Bot: enter a valid token contract address.");return}const t=Ke(l.mmWalletKeys.value);if(t.length===0){w("Market Maker Bot: paste at least one wallet private key.");return}const n=te();let a;try{a=t.map(p=>new K(p,n))}catch(p){w(`Market Maker Bot: invalid private key — ${p.message}`);return}const r=Ke(l.mmReactiveKeys.value),o=r.length>0?r.map(p=>new K(p,n)):[],s=$e(),i=await st(n,s,e);if(!i.exists){w(`Market Maker Bot: no ${R(e)}/WETH pool found on router ${R(s)} — ${i.error||"add liquidity first (LP tab)."}`),document.querySelector("#mmWalletResult").textContent=`No pool found for this token on the configured router. ${i.error||"Add liquidity first (LP tab)."}`;return}i.version==="v3"?w(`Market Maker Bot: V3 pool found at ${R(i.poolAddress)} (fee ${i.poolFee}), no V2 pair exists — trading via V3 exactInputSingle.`):w(`Market Maker Bot: V2 pool found at ${R(i.pairAddress)} — ${P(i.wethReserve)} WETH / ${P(i.tokenReserve)} token reserves.`);const c=Math.max(1,parseInt(l.mmTxnsPerUnit.value)||2),b=(l.mmIntervalUnit.value==="per_second"?1e3:6e4)/c;C.config={tokenAddress:e,routerAddress:s,poolVersion:i.version,pairAddress:i.pairAddress,v3PoolAddress:i.poolAddress,v3SwapRouter:i.swapRouter,v3PoolFee:i.poolFee,v3WethAddress:i.wethAddress,v3IsToken0:i.isToken0,minBuyEth:parseFloat(l.mmMinBuy.value)||.001,maxBuyEth:parseFloat(l.mmMaxBuy.value)||.01,minSellPct:parseFloat(l.mmMinSellPct.value)||10,maxSellPct:parseFloat(l.mmMaxSellPct.value)||50,sellHardcap:parseFloat(l.mmSellHardcap.value)||0,buyWeight:Number(l.mmBuyWeight.value)||50,minIntervalMs:Math.floor(b*.7),maxIntervalMs:Math.floor(b*1.3),slippagePct:parseFloat(l.mmSlippage.value)||25,gasPriceGwei:parseFloat(l.mmGasPrice.value)||0,minReserveEth:parseFloat(l.mmMinReserve.value)||.005,reactiveEnabled:l.mmReactiveEnabled.checked,reactivePct:parseFloat(l.mmReactivePct.value)||50,reactiveMaxTokens:parseFloat(l.mmReactiveMaxTokens.value)||0},C.provider=n,C.wallets=a,C.reactiveWallets=o,C.balances={},C.trades=[],C.stats={startedAt:Date.now(),totalBuys:0,totalSells:0,reactiveSells:0,totalBuyVolumeEth:0,successfulTrades:0,failedTrades:0,cyclesCompleted:0,lastTradeAt:null,lastError:null},C.running=!0,w(`Market Maker Bot: started for ${R(e)} with ${a.length} wallet(s).`),At(),await to(),ao(),C.config.reactiveEnabled&&Bl(),C.uptimeTicker=setInterval(()=>{const p=document.querySelector('[data-tab-panel="mmBot"] [data-mm-uptime]');p&&(p.textContent=Vr(Date.now()-C.stats.startedAt))},1e3)}function $l(){C.running=!1,C.loopTimeout&&(clearTimeout(C.loopTimeout),C.loopTimeout=null),C.uptimeTicker&&(clearInterval(C.uptimeTicker),C.uptimeTicker=null),Rl(),w(`Market Maker Bot: stopped after ${C.stats.cyclesCompleted} cycle(s).`),At()}async function to(){const e=C.config,t=new _(e.tokenAddress,ue.abi,C.provider);let n=18;try{n=Number(await t.decimals())}catch{}const a={};await Promise.allSettled(C.wallets.map(async r=>{try{const[o,s]=await Promise.all([C.provider.getBalance(r.address),t.balanceOf(r.address)]);a[r.address]={eth:Number(W(o)),token:Number(X(s,n)),tokenDecimals:n}}catch{a[r.address]={eth:0,token:0,tokenDecimals:n}}})),C.balances=a}function Sl(){const e=C.config,t=[],n=[];for(const d of C.wallets){const b=C.balances[d.address];if(!b)continue;const f=e.minBuyEth+e.minReserveEth;b.eth>=f&&t.push(d),b.token>0&&n.push(d)}if(t.length===0&&n.length===0)return null;const a=Math.random()*100;let r;if(t.length===0?r="sell":n.length===0?r="buy":r=a<e.buyWeight?"buy":"sell",r==="buy"){const d=t[Math.floor(Math.random()*t.length)],b=C.balances[d.address],f=Math.min(e.maxBuyEth,b.eth-e.minReserveEth),p=e.minBuyEth+Math.random()*(e.maxBuyEth-e.minBuyEth),h=Math.round(Math.min(p,f)*1e6)/1e6;return h<e.minBuyEth?null:{action:"buy",wallet:d,amount:h}}n.sort((d,b)=>{var f,p;return(((f=C.balances[b.address])==null?void 0:f.token)||0)-(((p=C.balances[d.address])==null?void 0:p.token)||0)});const o=n[0],s=C.balances[o.address],i=e.minSellPct+Math.random()*(e.maxSellPct-e.minSellPct);let c=s.token*(i/100);e.sellHardcap>0&&(c=Math.min(c,e.sellHardcap));const u=Math.round(c*10**s.tokenDecimals)/10**s.tokenDecimals;return u<=0?null:{action:"sell",wallet:o,amount:u}}function Fe(e,t){const n=BigInt(Math.max(0,Math.round((100-(t||0))*100))),a=e*n/10000n;return a>0n?a:0n}async function xn(e,t,n,a){const o=await new _(e,we,a).getAmountsOut(n,t);return o[o.length-1]}async function kt(e,t,n,a){const r=new _(e,Pa,a),[o,s]=await Promise.all([r.slot0(),r.liquidity()]),i=2n**96n,c=10n**27n,u=o.sqrtPriceX96*c/i,d=s;if(d===0n)return 0n;if(t){const m=c*c/u+n*c/d,v=c*c/m;return d*(u-v)/c}const b=u+n*c/d,f=c*c/u,p=c*c/b;return d*(f-p)/c}async function El(e,t){const n=C.config;if(n.poolVersion==="v3")return Tl(e,t);const a=new _(n.routerAddress,we,e),r={value:ce(String(t))};n.gasPriceGwei>0&&(r.gasPrice=Be(String(n.gasPriceGwei),"gwei"));const s=[await a.WETH(),n.tokenAddress],i=await xn(n.routerAddress,s,r.value,e.provider),c=Fe(i,n.slippagePct),u=await a.swapExactETHForTokensSupportingFeeOnTransferTokens(c,s,e.address,Oe("20"),r);return await u.wait(),u.hash}async function Tl(e,t){const n=C.config,a=new _(n.v3SwapRouter,[Re[0]],e),r={value:ce(String(t))};n.gasPriceGwei>0&&(r.gasPrice=Be(String(n.gasPriceGwei),"gwei"));const o=await kt(n.v3PoolAddress,!n.v3IsToken0,r.value,e.provider),s=Fe(o,n.slippagePct),i={tokenIn:n.v3WethAddress,tokenOut:n.tokenAddress,fee:n.v3PoolFee,recipient:e.address,amountIn:r.value,amountOutMinimum:s,sqrtPriceLimitX96:0n},c=await a.exactInputSingle(i,r);return await c.wait(),c.hash}async function no(e,t,n){const a=C.config;if(a.poolVersion==="v3")return Cl(e,t,n);const r=new _(a.tokenAddress,ue.abi,e),o=new _(a.routerAddress,we,e),s=Be(P(t),n);await r.allowance(e.address,a.routerAddress)<s&&await(await r.approve(a.routerAddress,s)).wait();const c={};a.gasPriceGwei>0&&(c.gasPrice=Be(String(a.gasPriceGwei),"gwei"));const u=await o.WETH(),d=[a.tokenAddress,u],b=await xn(a.routerAddress,d,s,e.provider),f=Fe(b,a.slippagePct),p=await o.swapExactTokensForETHSupportingFeeOnTransferTokens(s,f,d,e.address,Oe("20"),c);return await p.wait(),p.hash}async function f0(e){return Number(W(await e.provider.getBalance(e.address)))}async function Cl(e,t,n){const a=C.config,r=new _(a.tokenAddress,ue.abi,e),o=new _(a.v3SwapRouter,[Re[0]],e),s=Be(P(t),n);await r.allowance(e.address,a.v3SwapRouter)<s&&await(await r.approve(a.v3SwapRouter,s)).wait();const c={};a.gasPriceGwei>0&&(c.gasPrice=Be(String(a.gasPriceGwei),"gwei"));const u=await kt(a.v3PoolAddress,a.v3IsToken0,s,e.provider),d=Fe(u,a.slippagePct),b={tokenIn:a.tokenAddress,tokenOut:a.v3WethAddress,fee:a.v3PoolFee,recipient:e.address,amountIn:s,amountOutMinimum:d,sqrtPriceLimitX96:0n},f=await o.exactInputSingle(b,c);await f.wait();const p=new _(a.v3WethAddress,Ia,e),h=await p.balanceOf(e.address);return h>0n&&await(await p.withdraw(h)).wait(),f.hash}async function ao(){var e;if(C.running){try{C.stats.cyclesCompleted%5===0&&await to();const t=Sl();if(!t){an({action:"skip",wallet:null,amount:0,unit:"",hash:null,status:"skipped",error:"No wallets with sufficient balance"}),C.stats.cyclesCompleted++,At(),p0();return}let n=null,a=null;try{if(t.action==="buy")n=await El(t.wallet,t.amount),C.stats.totalBuys++,C.stats.totalBuyVolumeEth+=t.amount,C.balances[t.wallet.address]&&(C.balances[t.wallet.address].eth=await f0(t.wallet));else{const r=((e=C.balances[t.wallet.address])==null?void 0:e.tokenDecimals)??18;n=await no(t.wallet,t.amount,r),C.stats.totalSells++,C.balances[t.wallet.address]&&(C.balances[t.wallet.address].token-=t.amount,C.balances[t.wallet.address].eth=await f0(t.wallet))}C.stats.successfulTrades++}catch(r){a=r.shortMessage||r.message,C.stats.failedTrades++,C.stats.lastError=a}an({action:t.action,wallet:t.wallet.address,amount:t.amount,unit:t.action==="buy"?"ETH":"tokens",hash:n,status:a?"failed":"success",error:a}),C.stats.lastTradeAt=Date.now(),C.stats.cyclesCompleted++,At()}catch(t){C.stats.lastError=t.message,C.stats.failedTrades++,an({action:"error",wallet:null,amount:0,unit:"",hash:null,status:"error",error:t.message}),At()}p0()}}function p0(){if(!C.running)return;const e=C.config,t=e.minIntervalMs+Math.random()*(e.maxIntervalMs-e.minIntervalMs);C.loopTimeout=setTimeout(()=>ao(),t)}function Bl(){const e=C.config,t=new _(e.tokenAddress,ue.abi,C.provider),n=new Set([...C.wallets.map(o=>o.address.toLowerCase()),...C.reactiveWallets.map(o=>o.address.toLowerCase())]),a=e.poolVersion==="v3"?e.v3SwapRouter:e.routerAddress;C.reactiveFilter=t.filters.Transfer();const r=async(o,s,i)=>{var h;if(!C.running||!C.config.reactiveEnabled||o.toLowerCase()!==a.toLowerCase()||n.has(s.toLowerCase()))return;const c=((h=Object.values(C.balances)[0])==null?void 0:h.tokenDecimals)??18,u=Number(X(i,c));let d=u*(e.reactivePct/100);if(e.reactiveMaxTokens>0&&(d=Math.min(d,e.reactiveMaxTokens)),d<=0)return;w(`Market Maker Bot: external buy detected (${P(u)} tokens). Triggering reactive sell.`);const f=[...C.reactiveWallets.length>0?C.reactiveWallets:C.wallets].sort((m,v)=>{var g,$;return(((g=C.balances[v.address])==null?void 0:g.token)||0)-((($=C.balances[m.address])==null?void 0:$.token)||0)});let p=d;for(const m of f){if(p<=0)break;const v=C.balances[m.address];if(!v||v.token<=0)continue;const g=Math.min(v.token,p);try{const $=await no(m,g,v.tokenDecimals);v.token-=g,C.stats.reactiveSells++,C.stats.successfulTrades++,an({action:"reactive_sell",wallet:m.address,amount:g,unit:"tokens",hash:$,status:"success",error:null}),p-=g}catch($){C.stats.failedTrades++,an({action:"reactive_sell",wallet:m.address,amount:g,unit:"tokens",hash:null,status:"failed",error:$.shortMessage||$.message})}}At()};C._reactiveHandler=r,t.on(C.reactiveFilter,r),C._reactiveToken=t,w("Market Maker Bot: reactive sell watcher started.")}function Rl(){if(C._reactiveToken&&C.reactiveFilter&&C._reactiveHandler)try{C._reactiveToken.off(C.reactiveFilter,C._reactiveHandler)}catch{}C._reactiveToken=null,C._reactiveHandler=null,C.reactiveFilter=null}const B={username:"",role:"",isSuperAdmin:!1,permissions:new Set,catalogue:{tabs:[],actions:[]},roles:[],users:[],canManageRoles:!1,canManageUsers:!1,projects:[],activeProjectId:"",canManageProjects:!1};function h0(e){return B.permissions.has(e)}function Al(e){return B.permissions.has(`tab.${e}`)}async function Ll(){try{const t=await(await fetch("/api/auth/session",{credentials:"same-origin"})).json();return t.authenticated?(B.username=t.username||"",B.role=t.role||"",B.isSuperAdmin=!!t.isSuperAdmin,B.permissions=new Set(t.permissions||[]),B.canManageRoles=B.permissions.has("roles.manage"),B.canManageUsers=B.permissions.has("users.manage"),!0):!1}catch{return!1}}function ve(e,t={}){const n={...t.headers||{}};return B.activeProjectId&&(n["X-Project-Id"]=B.activeProjectId),fetch(e,{...t,headers:n,credentials:"same-origin"})}async function Fa(){var e;try{const n=await(await fetch("/api/admin/projects",{credentials:"same-origin"})).json();B.projects=n.projects||[],B.canManageProjects=B.permissions.has("projects.manage"),B.projects.some(a=>a.id===B.activeProjectId)||(B.activeProjectId=((e=B.projects[0])==null?void 0:e.id)||""),ro(),_l()}catch{B.projects=[]}}function ro(){const e=B.projects.find(t=>t.id===B.activeProjectId);e&&(l.contractAddress&&e.config.tokenAddress&&(l.contractAddress.value=e.config.tokenAddress),l.rpcUrl&&e.config.rpcUrl&&(l.rpcUrl.value=e.config.rpcUrl),l.router&&e.config.router&&(l.router.value=e.config.router))}async function Yn(e){if(B.activeProjectId=e,ro(),typeof vt=="function")try{await vt(!1)}catch{}lt();const t=document.querySelector("#activeProjectSelect");t&&t.value!==B.activeProjectId&&(t.value=B.activeProjectId)}async function ke(e,t={}){const n=await fetch(e,{credentials:"same-origin",...t}),a=await n.json().catch(()=>({}));if(!n.ok)throw new Error(a.error||`Request failed (${n.status}).`);return a}async function Je(){if(B.canManageRoles||B.canManageUsers){const e=await ke("/api/admin/roles");B.catalogue={tabs:e.tabs||[],actions:e.actions||[]},B.roles=e.roles||[]}if(B.canManageUsers){const e=await ke("/api/admin/users");B.users=e.users||[]}B.canManageProjects&&await Fa(),Il(),Ml(),oo(),Pl()}function Pl(){const e=document.querySelector("#adminProjectsList"),t=document.querySelector("#adminAccessProject");if(!(!e&&!t)){if(e){e.innerHTML=B.projects.length===0?"No projects yet.":B.projects.map(n=>`
      <div class="admin-user-row">
        <strong>${q(n.name)}</strong>
        <span class="admin-project-config">${q(n.config.tokenAddress||"no token set")}</span>
        <button type="button" data-admin-delete-project="${n.id}">Delete</button>
      </div>`).join("");for(const n of e.querySelectorAll("[data-admin-delete-project]"))n.addEventListener("click",async()=>{const a=n.dataset.adminDeleteProject,r=B.projects.find(o=>o.id===a);if(confirm(`Delete project "${(r==null?void 0:r.name)||a}"? Its wallet vault must already be empty.`))try{await ke(`/api/admin/projects?id=${encodeURIComponent(a)}`,{method:"DELETE"}),re("#adminProjectResult",`Deleted "${(r==null?void 0:r.name)||a}".`),await Je(),lt()}catch(o){re("#adminProjectResult",o.message)}})}t&&(t.innerHTML=B.projects.map(n=>`<option value="${n.id}">${q(n.name)}</option>`).join(""),Hn(t.value),t.addEventListener("change",()=>Hn(t.value)))}}async function Hn(e){const t=document.querySelector("#adminAccessList");if(!(!t||!e)){t.textContent="Loading access list...";try{const a=(await ke(`/api/admin/project-access?projectId=${encodeURIComponent(e)}`)).access||[];t.innerHTML=a.length===0?"No one has explicit access yet (super_admin always sees every project).":a.map(r=>`
      <div class="admin-user-row">
        <span>${q(r.username)}</span>
        <button type="button" data-admin-revoke="${q(r.username)}">Revoke</button>
      </div>`).join("");for(const r of t.querySelectorAll("[data-admin-revoke]"))r.addEventListener("click",async()=>{try{await ke(`/api/admin/project-access?projectId=${encodeURIComponent(e)}&username=${encodeURIComponent(r.dataset.adminRevoke)}`,{method:"DELETE"}),Hn(e)}catch(o){re("#adminProjectResult",o.message)}})}catch(n){t.textContent=n.message}}}function Il(){const e=document.querySelector("#adminUsersList");if(e){if(B.users.length===0){e.textContent="No users found.";return}e.innerHTML=B.users.map(t=>{const n=t.username.toLowerCase()===B.username.toLowerCase(),a=[...B.isSuperAdmin?["super_admin"]:[],...B.roles.map(r=>r.name)];return`
      <div class="admin-user-row">
        <strong>${q(t.username)}</strong>${n?" <em>(you)</em>":""}
        <select data-admin-role-for="${q(t.username)}">
          ${a.map(r=>`<option value="${q(r)}"${r===t.role?" selected":""}>${q(r)}</option>`).join("")}
          ${a.includes(t.role)?"":`<option value="${q(t.role)}" selected>${q(t.role)} (missing)</option>`}
        </select>
        <button type="button" data-admin-reset="${q(t.username)}">Reset Password</button>
        ${n?"":`<button type="button" data-admin-delete-user="${q(t.username)}">Delete</button>`}
      </div>`}).join("");for(const t of e.querySelectorAll("[data-admin-role-for]"))t.addEventListener("change",async()=>{const n=t.dataset.adminRoleFor;try{await ke("/api/admin/users",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({username:n,role:t.value})}),re("#adminUserResult",`${n} is now "${t.value}".`),await Je()}catch(a){re("#adminUserResult",a.message),await Je()}});for(const t of e.querySelectorAll("[data-admin-reset]"))t.addEventListener("click",async()=>{const n=t.dataset.adminReset,a=prompt(`New password for ${n} (min 8 characters):`);if(a)try{await ke("/api/admin/users",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({username:n,password:a})}),re("#adminUserResult",`Password reset for ${n}. Their existing sessions were signed out.`)}catch(r){re("#adminUserResult",r.message)}});for(const t of e.querySelectorAll("[data-admin-delete-user]"))t.addEventListener("click",async()=>{const n=t.dataset.adminDeleteUser;if(confirm(`Delete user "${n}"? This cannot be undone.`))try{await ke(`/api/admin/users?username=${encodeURIComponent(n)}`,{method:"DELETE"}),re("#adminUserResult",`Deleted ${n}.`),await Je()}catch(a){re("#adminUserResult",a.message)}})}}function Ml(){const e=document.querySelector("#adminNewRole");if(e){const n=[...B.isSuperAdmin?["super_admin"]:[],...B.roles.map(a=>a.name)];e.innerHTML=n.map(a=>`<option value="${q(a)}">${q(a)}</option>`).join("")}const t=document.querySelector("#adminRoleSelect");t&&(t.innerHTML='<option value="">— new role —</option>'+B.roles.map(n=>`<option value="${q(n.name)}">${q(n.name)}</option>`).join(""))}function oo(e=null){const t=document.querySelector("#adminPermissionGrid");if(!t)return;const n=new Set(e||[]),a=B.catalogue.tabs.map(o=>{const s=`tab.${o.id}`,i=!B.isSuperAdmin&&!h0(s);return`<label class="admin-perm${i?" locked":""}">
      <input type="checkbox" value="${q(s)}"${n.has(s)?" checked":""}${i?" disabled":""} />
      ${q(o.label)}
    </label>`}).join(""),r=B.catalogue.actions.map(o=>{const s=!B.isSuperAdmin&&!h0(o.id);return`<label class="admin-perm${o.danger?" danger":""}${s?" locked":""}">
      <input type="checkbox" value="${q(o.id)}"${n.has(o.id)?" checked":""}${s?" disabled":""} />
      ${q(o.label)}
    </label>`}).join("");t.innerHTML=`
    <p class="hint">Tabs this role can open</p>
    <div class="admin-perm-grid">${a}</div>
    <p class="hint">Actions this role can perform</p>
    <div class="admin-perm-grid">${r}</div>`}function Dl(){return[...document.querySelectorAll("#adminPermissionGrid input[type=checkbox]:checked")].map(e=>e.value)}function re(e,t){const n=document.querySelector(e);n&&(n.textContent=t)}function Fl(){var t,n,a,r,o;const e=document.querySelector("#adminRoleSelect");e&&e.addEventListener("change",()=>{const s=B.roles.find(i=>i.name===e.value);l.adminRoleName.value=s?s.name:"",l.adminRoleDescription.value=s?s.description:"",oo(s?s.permissions:[])}),(t=document.querySelector("#adminSaveRole"))==null||t.addEventListener("click",async()=>{try{await ke("/api/admin/roles",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:l.adminRoleName.value.trim(),description:l.adminRoleDescription.value.trim(),permissions:Dl()})}),re("#adminRoleResult",`Saved role "${l.adminRoleName.value.trim()}".`),await Je()}catch(s){re("#adminRoleResult",s.message)}}),(n=document.querySelector("#adminDeleteRole"))==null||n.addEventListener("click",async()=>{const s=l.adminRoleName.value.trim();if(!s)return re("#adminRoleResult","Pick a role to delete.");if(confirm(`Delete role "${s}"?`))try{await ke(`/api/admin/roles?name=${encodeURIComponent(s)}`,{method:"DELETE"}),re("#adminRoleResult",`Deleted role "${s}".`),await Je()}catch(i){re("#adminRoleResult",i.message)}}),(a=document.querySelector("#adminCreateUser"))==null||a.addEventListener("click",async()=>{try{await ke("/api/admin/users",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({username:l.adminNewUsername.value.trim(),password:l.adminNewPassword.value,role:document.querySelector("#adminNewRole").value})}),re("#adminUserResult",`Created ${l.adminNewUsername.value.trim()}.`),l.adminNewUsername.value="",l.adminNewPassword.value="",await Je()}catch(s){re("#adminUserResult",s.message)}}),(r=document.querySelector("#adminCreateProject"))==null||r.addEventListener("click",async()=>{try{const s=await ke("/api/admin/projects",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:l.adminProjectName.value.trim(),tokenAddress:l.adminProjectTokenAddress.value.trim(),rpcUrl:l.adminProjectRpcUrl.value.trim(),router:l.adminProjectRouter.value.trim()})});re("#adminProjectResult",`Created "${s.project.name}".`),l.adminProjectName.value="",l.adminProjectTokenAddress.value="",l.adminProjectRpcUrl.value="",l.adminProjectRouter.value="",await Je(),lt()}catch(s){re("#adminProjectResult",s.message)}}),(o=document.querySelector("#adminGrantAccess"))==null||o.addEventListener("click",async()=>{var c;const s=(c=document.querySelector("#adminAccessProject"))==null?void 0:c.value,i=l.adminAccessUsername.value.trim();if(!s||!i)return re("#adminProjectResult","Pick a project and enter a username.");try{await ke(`/api/admin/project-access?projectId=${encodeURIComponent(s)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({username:i})}),l.adminAccessUsername.value="",Hn(s),re("#adminProjectResult",`Granted ${i} access.`)}catch(u){re("#adminProjectResult",u.message)}}),(B.canManageRoles||B.canManageUsers||B.canManageProjects)&&Je().catch(s=>{re("#adminUserResult",s.message),re("#adminRoleResult",s.message),re("#adminProjectResult",s.message)})}function Ol(){const e=ki.filter(t=>Al(t.id));return(B.canManageUsers||B.canManageRoles)&&e.push({id:"admin",label:"Users & Roles",icon:"🛡️"}),e.length>0&&!e.some(t=>t.id===y.activeFunctionTab)&&(y.activeFunctionTab=e[0].id),e}function q(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Wl(){return`
    <h2>Users, Roles &amp; Projects</h2>
    <p class="hint">
      Signed in as <strong>${q(B.username)}</strong> (${q(B.role)}).
      Permission changes apply immediately &mdash; affected users do not need to sign out and back in.
    </p>

    ${B.canManageProjects?`
    <div class="function-card section-gap">
      <div class="function-head"><strong>Projects</strong><span>isolated workspaces &mdash; token/RPC/router config + their own wallet vault</span></div>
      <div class="result" id="adminProjectsList">Loading projects...</div>
      <div class="grid two section-gap">
        <label>Project name ${x("adminProjectName","e.g. Client A launch")}</label>
        <label>Token contract address ${x("adminProjectTokenAddress","0x token")}</label>
        <label>RPC URL ${x("adminProjectRpcUrl","/rpc or https://...")}</label>
        <label>Router address ${x("adminProjectRouter","0x router")}</label>
      </div>
      <button id="adminCreateProject" type="button">Create Project</button>
      <div class="result" id="adminProjectResult"></div>

      <label class="stacked section-gap">Grant a user access to a project
        <div class="grid two">
          <select id="adminAccessProject"></select>
          <div class="inline-with-button">
            ${x("adminAccessUsername","username")}
            <button id="adminGrantAccess" type="button">Grant</button>
          </div>
        </div>
      </label>
      <div class="result" id="adminAccessList"></div>
    </div>`:""}

    ${B.canManageUsers?`
    <div class="function-card section-gap">
      <div class="function-head"><strong>Users</strong><span>create, reassign, reset, remove</span></div>
      <div class="result" id="adminUsersList">Loading users...</div>
      <div class="grid two section-gap">
        <label>Username ${x("adminNewUsername","3-32 chars")}</label>
        <label>Password ${x("adminNewPassword","min 8 chars","password")}</label>
      </div>
      <label class="stacked">Role <select id="adminNewRole"></select></label>
      <button id="adminCreateUser" type="button">Create User</button>
      <div class="result" id="adminUserResult"></div>
    </div>`:""}

    ${B.canManageRoles?`
    <div class="function-card section-gap">
      <div class="function-head"><strong>Roles</strong><span>tick exactly what each role may do</span></div>
      <label class="stacked">Edit an existing role, or type a new name below
        <select id="adminRoleSelect"></select>
      </label>
      <div class="grid two">
        <label>Role name ${x("adminRoleName","e.g. trader")}</label>
        <label>Description ${x("adminRoleDescription","what this role is for")}</label>
      </div>
      <div id="adminPermissionGrid"></div>
      <div class="button-row">
        <button id="adminSaveRole" type="button">Save Role</button>
        <button id="adminDeleteRole" type="button">Delete Role</button>
      </div>
      <div class="result" id="adminRoleResult"></div>
    </div>`:""}
  `}function so(){return B.projects.length===0?'<span class="project-switcher project-switcher-empty">No projects yet</span>':`<label class="project-switcher">
    Project
    <select id="activeProjectSelect">
      ${B.projects.map(e=>`<option value="${e.id}"${e.id===B.activeProjectId?" selected":""}>${q(e.name)}</option>`).join("")}
    </select>
  </label>`}function _l(){var t;const e=document.querySelector("#projectSwitcherSlot");e&&(e.innerHTML=so(),(t=document.querySelector("#activeProjectSelect"))==null||t.addEventListener("change",n=>{Yn(n.target.value)}))}function Nl(){var e,t,n,a,r,o,s,i,c,u,d,b,f,p,h,m,v,g,$,T,S,E,L,M,D,I,H;vi.innerHTML=`
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Robinhood Chain Token Launcher</p>
          <h1>Deploy and manage Token</h1>
        </div>
        <div class="hero-actions">
          <span id="projectSwitcherSlot">${so()}</span>

          <a class="manager-link" href="#" id="signOutLink">Sign Out</a>
          <div class="status" id="status">Not connected</div>
        </div>
      </section>

      <!-- Hidden, not removed: many tabs still depend on these fields
      (rpcUrl, privateKey, contractAddress) and functions (attach(),
      connect(), connectMetaMask()) under the hood — the panels are visually
      hidden via the "hidden" class rather than deleted, so all of that
      keeps working exactly as before, just without a visible UI. -->
      <section class="panel hidden">
        <h2>Wallet</h2>
        <div class="grid two">
          <label>RPC URL for private-key wallet ${x("rpcUrl","/rpc or https://...")}</label>
          <label>Private key ${x("privateKey","0x...","password")}</label>
        </div>
        <div class="button-row">
          <button id="connectMetaMask">Connect MetaMask</button>
          <button id="addRobinhood">Add/Switch Robinhood Chain</button>
          <button id="connect">Connect RPC Wallet</button>
        </div>
      </section>

      <section class="panel hidden">
        <h2>Deploy</h2>
        <div class="grid two">
          <label>Name ${x("tokenName","Robin Dex")}</label>
          <label>Symbol ${x("tokenSymbol","RD")}</label>
          <label>Router ${x("router","0x router")}</label>
          <label>Tax wallet ${x("taxWallet","0x tax wallet")}</label>
          <label>Ecosystem wallet ${x("ecosystemWallet","0x ecosystem wallet")}</label>
          <label>Early buyer list, comma separated ${x("bel","0x..., 0x...")}</label>
          <label>Deploy gas limit, optional ${x("deployGasLimit","blank = estimated + 20%")}</label>
        </div>
        <div class="button-row">
          <button id="deploy">Deploy Contract</button>
          <button id="diagnoseDeploy" type="button">Diagnose Last Deploy</button>
          <button id="verifyLatestDeploy" type="button">Verify Latest Contract</button>
        </div>
      </section>

      <section class="panel hidden">
        <h2>Attach Existing Contract</h2>
        <div class="grid two">
          <label>Contract address ${x("contractAddress","0x token")}</label>
        </div>
        <button id="attach">Attach</button>
      </section>

      <section class="panel dashboard-panel">
        <div class="dashboard">
          <nav class="sidebar" id="functionSidebar">
            <p class="sidebar-label">Functions</p>
            ${Ol().map(V=>`
            <button class="tab ${y.activeFunctionTab===V.id?"active":""}" data-tab="${V.id}">
              <span class="tab-icon">${V.icon}</span>
              <span class="tab-text">${V.label}</span>
            </button>`).join("")}
          </nav>
          <div class="dashboard-content">
        <div class="tab-panel ${y.activeFunctionTab==="write"?"active":""}" data-tab-panel="write">
          <div class="functions">${wi.map(m0).join("")}</div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="read"?"active":""}" data-tab-panel="read">
          <div class="functions">${gi.map(m0).join("")}</div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="buy"?"active":""}" data-tab-panel="buy">
          <div class="grid two">
            <label>Token contract address ${x("buyTokenAddress","0x token to buy")}</label>
            <label>&nbsp;<button id="buyAttachToken" type="button">Load Token</button></label>
          </div>
          <p class="hint" id="buyTokenStatus">${y.contract?`Loaded: ${y.contract.target}`:"No token loaded yet — paste an address and click Load Token."}</p>
          <div class="grid two">
            <label>ETH per buy ${x("buyEthAmount","0.01")}</label>
            <label>Minimum tokens out ${x("buyMinTokens","0")}</label>
            <label>Recipient override, optional ${x("buyRecipient","blank = buyer wallet")}</label>
            <label>Deadline minutes ${x("buyDeadline","20")}</label>
          </div>
          <button id="buyConnected">Buy With Connected Wallet</button>
          <label class="stacked">Buyer private keys, one per line ${ge("buyerPrivateKeys",`0x_private_key,0.01
0x_private_key,0.025`)}</label>
          <p class="hint">Use private_key,eth_amount per line. If the ETH amount is omitted, the global ETH per buy value above is used. Each wallet buys the token loaded above; batch buys are signed locally in this browser using the RPC URL/proxy.</p>
          <button id="buyBatch">Buy From All Pasted Wallets</button>
          <div class="result" id="buyResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="sell"?"active":""}" data-tab-panel="sell">
          <div class="grid two">
            <label>Minimum ETH out per wallet ${x("sellMinEth","0")}</label>
            <label>ETH recipient override, optional ${x("sellRecipient","blank = seller wallet")}</label>
            <label>Deadline minutes ${x("sellDeadline","20")}</label>
          </div>
          <button id="sellConnected">Sell All From Connected Wallet</button>
          <label class="stacked">Seller private keys, one per line ${ge("sellerPrivateKeys",`0x_private_key
0x_private_key`)}</label>
          <p class="hint">Batch sell approves the router and sells the full token balance from each pasted wallet. ETH returns to each seller unless you set a recipient override.</p>
          <button id="sellBatch">Sell All From Pasted Wallets</button>
          <div class="result" id="sellResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="lp"?"active":""}" data-tab-panel="lp">
          <h2>Launch Initial LP</h2>
          <p class="hint">Use this for first liquidity. It sends ETH to the token contract's launch() function, which pairs it with the 98% token supply held by the contract.</p>
          <div class="grid two">
            <label>ETH amount ${x("launchEthAmount","0.5")}</label>
            <label>LP recipient ${x("launchLpRecipient","blank = connected wallet")}</label>
          </div>
          <button id="launchInitialLp">Launch Initial LP</button>
          <h2>Add LP</h2>
          <p class="hint">Use this only after launch, when the connected wallet already holds the tokens it wants to add.</p>
          <div class="grid two">
            <label>Token amount ${x("lpTokenAmount","100000")}</label>
            <label>ETH amount ${x("lpEthAmount","1")}</label>
            <label>Minimum token amount ${x("lpMinToken","0")}</label>
            <label>Minimum ETH amount ${x("lpMinEth","0")}</label>
            <label>LP recipient ${x("lpRecipient","blank = connected wallet")}</label>
            <label>Deadline minutes ${x("lpDeadline","20")}</label>
          </div>
          <button id="addLp">Approve And Add LP</button>
          <h2 class="section-gap">Remove LP</h2>
          <div class="grid two">
            <label>Pair / LP token address ${x("removePair","blank = token pair()")}</label>
            <label>LP token amount ${x("removeLpAmount","1")}</label>
            <label>Minimum token amount ${x("removeMinToken","0")}</label>
            <label>Minimum ETH amount ${x("removeMinEth","0")}</label>
            <label>Remove recipient ${x("removeRecipient","blank = connected wallet")}</label>
            <label>Deadline minutes ${x("removeDeadline","20")}</label>
          </div>
          <button id="removeLp">Approve And Remove LP</button>
          <div class="result" id="lpResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="burn"?"active":""}" data-tab-panel="burn">
          <p class="hint">Only the current tax wallet can call burn. Amount is entered in normal token units, not wei.</p>
          <div class="grid two">
            <label>Token amount to burn ${x("burnAmount","1000")}</label>
          </div>
          <button id="burnTokens">Burn Tokens</button>
          <div class="result" id="burnResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="accounts"?"active":""}" data-tab-panel="accounts">
          <p class="hint">Generate 5 fresh wallets locally in this browser. Store the private keys immediately; they are not saved by the app.</p>
          <div class="button-row">
            <button id="generateAccounts">Create 5 Accounts</button>
            <button id="copyAccounts">Copy Accounts</button>
            <button id="loadAccountsToMultisend">Use Addresses In Multisend</button>
          </div>
          <textarea id="generatedAccounts" readonly placeholder="Generated wallets will appear here"></textarea>
          <div class="result" id="accountsResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="multisend"?"active":""}" data-tab-panel="multisend">
          <p class="hint">Send ETH from the connected wallet to up to 5 recipients. Each row needs a recipient address and ETH amount.</p>
          ${Array.from({length:5},(V,F)=>`
            <div class="grid two multisend-row">
              <label>Recipient ${F+1} ${x(`sendTo${F}`,"0x recipient")}</label>
              <label>ETH amount ${x(`sendAmount${F}`,"0.01")}</label>
            </div>
          `).join("")}
          <button id="sendEthBatch">Send ETH To 5 Wallets</button>
          <div class="result" id="multisendResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="sweep"?"active":""}" data-tab-panel="sweep">
          <h2>Collect ETH From Wallets</h2>
          <p class="hint">Paste private keys and send all available ETH from those wallets to one destination. The app estimates gas per wallet and leaves an optional extra buffer.</p>
          <div class="grid two">
            <label>Destination wallet ${x("sweepRecipient","0x destination")}</label>
            <label>Extra gas buffer ETH ${x("sweepBuffer","0.00001")}</label>
          </div>
          <label class="stacked">Private keys to collect from ${ge("sweepPrivateKeys",`0x_private_key
0x_private_key
0x_private_key`)}</label>
          <p class="hint">You can paste one key per line, or separate keys with commas/spaces. Transactions are signed locally in this browser using the RPC URL above.</p>
          <div class="button-row">
            <button id="previewSweep">Preview Balances</button>
            <button id="sweepBatch">Send All ETH From Pasted Keys</button>
            <button id="sweepConnected">Send All ETH From Connected Wallet</button>
          </div>
          <div class="result" id="sweepResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="mmBot"?"active":""}" data-tab-panel="mmBot">
          ${Kr()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="wallets"?"active":""}" data-tab-panel="wallets">
          ${Ar()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="projectMgmt"?"active":""}" data-tab-panel="projectMgmt">
          ${Er()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="disperse"?"active":""}" data-tab-panel="disperse">
          ${jr()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="walletWash"?"active":""}" data-tab-panel="walletWash">
          ${kr()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="walletReport"?"active":""}" data-tab-panel="walletReport">
          ${$r()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="launch"?"active":""}" data-tab-panel="launch">
          ${Vi()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="pons"?"active":""}" data-tab-panel="pons">
          ${gr("")}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="ponsWash"?"active":""}" data-tab-panel="ponsWash">
          ${zl()}
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="multiBuys"?"active":""}" data-tab-panel="multiBuys">
          <h2>Multiple Buys</h2>
          <h2 class="section-gap">Multiple Burst Buy</h2>
          <p class="hint">Buy an existing token — already live on-chain, launched anytime and by anyone, not tied to a launch you ran here — with multiple wallets at once. No launch or restriction-window wait: this just detects the token's pool (V2 or V3) and fires every enabled wallet's buy in parallel, right away.</p>
          <div class="grid two">
            <label>Token contract address ${x("multiBurstTokenAddress","0x token to buy")}</label>
            <label>Slippage % ${x("multiBurstSlippage","25")}</label>
          </div>
          <div id="multiBurstRows" class="buyer-rows">
            ${Ui()}
          </div>
          <div class="button-row">
            <button id="multiBurstCheckPool" type="button">Check Pool</button>
            <button id="multiBurstExecute" type="button">Run Multiple Burst Buy</button>
          </div>
          <div class="result" id="multiBurstResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="lunch"?"active":""}" data-tab-panel="lunch">
          <h2>Lunch.fun Launch</h2>
          <p class="hint">EIP-7702 atomic mode: each enabled buyer wallet spends its own ETH and appears as the router caller. The launch and every signed buy execute in one transaction; any failure reverts everything. Keys stay in this page's memory and delegations are revoked after confirmation.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${j.name} (${j.id})" /></label>
            <label>Current block <input id="lunchCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Primary wallet <input id="lunchPrimaryWallet" readonly placeholder="Connect MetaMask" /></label>
            <label>Native balance <input id="lunchPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch proxy <input id="lunchLaunchContract" readonly value="${j.launchContract}" /></label>
            <label>7702 coordinator <input id="lunch7702Coordinator" readonly value="${j.coordinator7702}" /></label>
            <label>7702 buyer delegate <input id="lunch7702Delegate" readonly value="${j.delegate7702}" /></label>
            <label>Coordinator owner <input id="lunchAtomicOwner" readonly placeholder="Load status" /></label>
            <label>Implementation <input id="lunchImplementation" readonly value="${j.implementation}" /></label>
            <label>Launch fee <input id="lunchLaunchFee" readonly placeholder="-" /></label>
            <label>Router for later buys ${x("lunchRouter",j.router)}</label>
            <label>Factory <input id="lunchFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="lunchNpm" readonly placeholder="-" /></label>
            <label>Wrapped native / X token <input id="lunchXToken" readonly placeholder="-" /></label>
            <label>Fee locker <input id="lunchFeeLocker" readonly placeholder="-" /></label>
            <label>Enforced supply <input id="lunchEnforcedSupply" readonly placeholder="-" /></label>
            <label>Launch tick magnitude <input id="lunchTickMagnitude" readonly placeholder="-" /></label>
          </div>
          <div class="result" id="lunchContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${Ln("lunchImage","Token Image")}
          <div class="grid two">
            <label class="required">Token name ${x("lunchTokenName","e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${x("lunchTokenSymbol","PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${ge("lunchDescription","Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${x("lunchTotalSupply","1000000000")}</label>
            <label>Fee tier ${x("lunchFeeTier","10000")}</label>
            <label>Banner URL ${x("lunchBanner","https://...")}</label>
            <label>Website (optional) ${x("lunchWebsite","https://...")}</label>
            <label>Twitter / X (optional) ${x("lunchTwitter","https://x.com/...")}</label>
            <label>Telegram (optional) ${x("lunchTelegram","https://t.me/...")}</label>
            <label>User salt ${x("lunchSalt","blank = random bytes32")}</label>
            <label>Transaction deadline, minutes ${x("lunchDeadline","5")}</label>
          </div>
          </div>

          <h2 class="section-gap">Buyer Configuration</h2>
          <p class="hint">Every enabled row requires its private key, own ETH balance, and nonzero minimum output. The derived wallet address is displayed automatically during review. Use this only on a trusted local machine.</p>
          <div id="lunchBuyerRows" class="buyer-rows">
            ${i0()}
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="button-row">
            <button id="lunchReview" type="button">Validate And Review</button>
            <button id="lunchExecute" type="button">Execute Atomic Launch</button>
          </div>
          <div class="result" id="lunchReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchExecutionResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="lunchBurst"?"active":""}" data-tab-panel="lunchBurst">
          <h2>Lunch.fun Burst Launch</h2>
          <p class="hint">Burst mode: the connected launcher creates the token and performs the optional dev buy in the launch transaction. After the receipt reveals the real token and pool, every enabled buyer wallet signs locally and broadcasts its own buy transaction in parallel. This is fast, but not atomic and same-block inclusion is not guaranteed.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${j.name} (${j.id})" /></label>
            <label>Current block <input id="lunchBurstCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Launcher wallet <input id="lunchBurstPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Launcher native balance <input id="lunchBurstPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchBurstSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchBurstLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch proxy <input id="lunchBurstLaunchContract" readonly value="${j.launchContract}" /></label>
            <label>Implementation <input id="lunchBurstImplementation" readonly value="${j.implementation}" /></label>
            <label>Launch fee <input id="lunchBurstLaunchFee" readonly placeholder="-" /></label>
            <label>Router ${x("lunchBurstRouter",j.router)}</label>
            <label>Factory <input id="lunchBurstFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="lunchBurstNpm" readonly placeholder="-" /></label>
            <label>Wrapped native / X token <input id="lunchBurstXToken" readonly placeholder="-" /></label>
            <label>Enforced supply <input id="lunchBurstEnforcedSupply" readonly placeholder="-" /></label>
          </div>
          <div class="result" id="lunchBurstContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchBurstDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchBurstUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchBurstFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchBurstWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${Ln("lunchBurstImage","Token Image")}
          <div class="grid two">
            <label class="required">Token name ${x("lunchBurstTokenName","e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${x("lunchBurstTokenSymbol","PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${ge("lunchBurstDescription","Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${x("lunchBurstTotalSupply","1000000000")}</label>
            <label>Fee tier ${x("lunchBurstFeeTier","10000")}</label>
            <label>Dev buy ETH in launch tx ${x("lunchBurstDevBuyEth","0.05")}</label>
            <label>User salt ${x("lunchBurstSalt","blank = random bytes32")}</label>
            <label>Banner URL ${x("lunchBurstBanner","https://...")}</label>
            <label>Website (optional) ${x("lunchBurstWebsite","https://...")}</label>
            <label>Twitter / X (optional) ${x("lunchBurstTwitter","https://x.com/...")}</label>
            <label>Telegram (optional) ${x("lunchBurstTelegram","https://t.me/...")}</label>
          </div>
          </div>

          <h2 class="section-gap">Burst Buyer Wallets</h2>
          <p class="hint">Each enabled buyer spends from its own ETH balance. The token address is not entered; it is decoded from the launch receipt immediately before broadcasting the burst buys.</p>
          <div id="lunchBurstBuyerRows" class="buyer-rows">
            ${l0()}
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="button-row">
            <button id="lunchBurstReview" type="button">Validate Burst</button>
            <button id="lunchBurstExecute" type="button">Launch And Burst Buy</button>
          </div>
          <div class="result" id="lunchBurstReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchBurstExecutionResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="lunchCombo"?"active":""}" data-tab-panel="lunchCombo">
          <h2>Lunch + Burst</h2>
          <p class="hint">One token form for both execution modes. Atomic mode runs the existing EIP-7702 coordinator flow (one transaction, launch plus every buy, revert-all-or-nothing). Burst mode runs the existing separate-transaction flow (launch confirms first, then buyer wallets buy in parallel; not atomic). Switching the mode below only changes which buyer wallet rows and execute button are used; the token details are shared.</p>

          <h2 class="section-gap">Execution Mode</h2>
          <div class="button-row" id="lunchComboModeRow">
            <label class="checkbox-row"><input id="lunchComboModeAtomic" type="radio" name="lunchComboMode" value="atomic" checked /> Atomic (EIP-7702, one transaction)</label>
            <label class="checkbox-row"><input id="lunchComboModeBurst" type="radio" name="lunchComboMode" value="burst" /> Burst (parallel transactions)</label>
            <label class="checkbox-row"><input id="lunchComboModeChained" type="radio" name="lunchComboMode" value="chained" /> Atomic then Burst (chained)</label>
          </div>
          <p class="hint" id="lunchComboChainedHint" style="display:none">Chained mode: burst transactions are signed locally for the predicted token before the atomic EIP-7702 launch is submitted. As soon as the atomic receipt confirms, the signed burst transactions are sent in parallel directly to the Robinhood sequencer, with the configured RPC as fallback. Delegations are revoked after burst receipts settle. Only the atomic leg has guaranteed internal ordering.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${j.name} (${j.id})" /></label>
            <label>Current block <input id="lunchComboCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Wallet <input id="lunchComboPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="lunchComboPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchComboSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchComboLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="lunchComboContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchComboDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchComboUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchComboFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchComboWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${Ln("lunchComboImage","Token Image")}
          <div class="grid two">
            <label class="required">Token name ${x("lunchComboTokenName","e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${x("lunchComboTokenSymbol","PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${ge("lunchComboDescription","Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${x("lunchComboTotalSupply","1000000000")}</label>
            <label>Fee tier ${x("lunchComboFeeTier","10000")}</label>
            <label>Banner URL ${x("lunchComboBanner","https://...")}</label>
            <label>Website (optional) ${x("lunchComboWebsite","https://...")}</label>
            <label>Twitter / X (optional) ${x("lunchComboTwitter","https://x.com/...")}</label>
            <label>Telegram (optional) ${x("lunchComboTelegram","https://t.me/...")}</label>
            <label>User salt ${x("lunchComboSalt","blank = random bytes32")}</label>
            <label>Transaction deadline, minutes (atomic mode only) ${x("lunchComboDeadline","5")}</label>
            <label>Dev buy ETH in launch tx (burst mode only) ${x("lunchComboDevBuyEth","0")}</label>
          </div>
          </div>

          <div id="lunchComboAtomicSection">
            <h2 class="section-gap">Atomic Buyer Configuration</h2>
            <p class="hint">Row 1 is the coordinator owner's atomic initial buy. Rows 2-7 are separately funded buyer wallets; every enabled row requires its own private key and nonzero minimum output. Requires an RPC wallet connection.</p>
            <div id="lunchComboAtomicBuyerRows" class="buyer-rows">
              ${i0("lunchCombo")}
            </div>
            <div class="button-row" id="lunchComboAtomicButtons">
              <button id="lunchComboAtomicReview" type="button">Validate And Review</button>
              <button id="lunchComboAtomicExecute" type="button">Execute Atomic Launch</button>
            </div>
          </div>

          <div id="lunchComboBurstSection" style="display:none">
            <h2 class="section-gap">Burst Buyer Wallets</h2>
            <p class="hint">Each enabled buyer spends from its own ETH balance. In Burst-only mode the token address is decoded from a launch this leg performs itself. In Chained mode this leg buys against the token launched by the atomic leg above; no separate launch happens here.</p>
            <div id="lunchComboBurstBuyerRows" class="buyer-rows">
              ${l0("lunchCombo")}
            </div>
            <div class="button-row" id="lunchComboBurstButtons">
              <button id="lunchComboBurstReview" type="button">Validate Burst</button>
              <button id="lunchComboBurstExecute" type="button">Launch And Burst Buy</button>
            </div>
          </div>

          <div class="button-row" id="lunchComboChainedButtons" style="display:none">
            <button id="lunchComboChainedReview" type="button">Validate Atomic Then Burst</button>
            <button id="lunchComboChainedExecute" type="button">Execute Atomic Then Burst</button>
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="result" id="lunchComboReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchComboExecutionResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="doppler"?"active":""}" data-tab-panel="doppler">
          <h2>Feel Cash Launch + Bundle</h2>
          <p class="hint">Launches a token through Doppler's Airlock contract (module addresses, hooks, tick spacing and dynamic-fee flag are fixed to this Robinhood Chain deployment, confirmed from a real create() transaction) then bundles buys against the resulting Uniswap V4 pool via the Universal Router, all inside one atomic transaction executed by DopplerAtomicExecutor. Any failed buy reverts the entire launch.</p>

          <h2 class="section-gap">Network &amp; Contracts</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${U.name} (${U.id})" /></label>
            <label>Atomic executor <input id="dopplerExecutorAddress" readonly value="${U.atomicExecutor}" placeholder="Deploy DopplerAtomicExecutor and set the address" /></label>
            <label>Airlock <input readonly value="${U.airlock}" /></label>
            <label>Universal Router <input readonly value="${U.universalRouter}" /></label>
            <label>Token factory <input readonly value="${U.tokenFactory}" /></label>
            <label>Governance factory <input readonly value="${U.governanceFactory}" /></label>
            <label>Pool initializer / hooks <input readonly value="${U.poolInitializer}" /></label>
            <label>Liquidity migrator <input readonly value="${U.liquidityMigrator}" /></label>
            <label>Numeraire <input readonly value="${U.numeraire}" /></label>
            <label>Wallet <input id="dopplerPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="dopplerPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="dopplerSwitchNetwork" type="button">Switch Network</button>
            <button id="dopplerLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="dopplerContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="dopplerDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="dopplerUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="dopplerFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="dopplerWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          <div class="grid two">
            <label class="required">Token name ${x("dopplerTokenName","e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${x("dopplerTokenSymbol","PEPE")}</label>
            <label>Initial supply ${x("dopplerInitialSupply","1000000000")}</label>
            <label>Tokens to sell ${x("dopplerNumTokensToSell","800000000")}</label>
            <label>Integrator (blank = executor owner) ${x("dopplerIntegrator","optional 0x")}</label>
            <label>User salt ${x("dopplerSalt","blank = random bytes32")}</label>
            <label>Numeraire is native asset <input id="dopplerNumeraireIsNative" type="checkbox" /></label>
            <label>Transaction deadline, minutes ${x("dopplerDeadline","5")}</label>
          </div>
          </div>
          <p class="hint">tokenFactoryData / governanceFactoryData / poolInitializerData / liquidityMigratorData are opaque bytes defined by Doppler's own modules, not by this app. Provide each as raw 0x-prefixed ABI-encoded hex — export it from Doppler's SDK/UI for this deployment, or reuse the encoding from a known-good create() transaction. Leaving one blank sends empty bytes, which will revert unless the module accepts that.</p>
          <div class="grid two">
            <label>tokenFactoryData ${x("dopplerTokenFactoryData","0x...")}</label>
            <label>governanceFactoryData ${x("dopplerGovernanceFactoryData","0x...")}</label>
            <label>poolInitializerData ${x("dopplerPoolInitializerData","0x...")}</label>
            <label>liquidityMigratorData ${x("dopplerLiquidityMigratorData","0x...")}</label>
          </div>

          <h2 class="section-gap">Bundled Buyer Configuration (Atomic, 5 wallets)</h2>
          <p class="hint">Row 1 is the atomic creator/first buy. Rows 2-5 are additional recipients funded by the executor owner's connected wallet. Every enabled row requires its own nonzero minimum token output. Requires the connected wallet to be the DopplerAtomicExecutor owner.</p>
          <div id="dopplerBuyerRows" class="buyer-rows">
            ${ji()}
          </div>
          <div class="button-row">
            <button id="dopplerReview" type="button">Validate And Review</button>
            <button id="dopplerExecute" type="button">Execute Atomic Launch And Buy</button>
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="result" id="dopplerReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="dopplerExecutionResult"></div>

          <h2 class="section-gap">Burst Buyer Wallets (25 wallets, not atomic)</h2>
          <p class="hint">Burst mode launches through Airlock.create() directly (no bundled buys in that transaction), decodes the created asset from the receipt, then each enabled buyer wallet signs and broadcasts its own V4 swap transaction in parallel using its own private key and ETH balance. Same-block inclusion is not guaranteed. Keys are used locally in this page and are never sent anywhere.</p>
          <div class="grid two">
            <label>Expected chain <input readonly value="${U.name} (${U.id})" /></label>
            <label>Wallet <input id="dopplerBurstPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="dopplerBurstPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <h3 class="section-gap">Burst Token Launch Form</h3>
          <div class="grid two">
            <label>Token name ${x("dopplerBurstTokenName","Token name")}</label>
            <label>Token symbol ${x("dopplerBurstTokenSymbol","TICKER")}</label>
            <label>Initial supply ${x("dopplerBurstInitialSupply","1000000000")}</label>
            <label>Tokens to sell ${x("dopplerBurstNumTokensToSell","800000000")}</label>
            <label>Integrator (blank = launcher wallet) ${x("dopplerBurstIntegrator","optional 0x")}</label>
            <label>User salt ${x("dopplerBurstSalt","blank = random bytes32")}</label>
            <label>Numeraire is native asset <input id="dopplerBurstNumeraireIsNative" type="checkbox" /></label>
          </div>
          <div class="grid two">
            <label>tokenFactoryData ${x("dopplerBurstTokenFactoryData","0x...")}</label>
            <label>governanceFactoryData ${x("dopplerBurstGovernanceFactoryData","0x...")}</label>
            <label>poolInitializerData ${x("dopplerBurstPoolInitializerData","0x...")}</label>
            <label>liquidityMigratorData ${x("dopplerBurstLiquidityMigratorData","0x...")}</label>
          </div>
          <div class="button-row">
            <button id="dopplerBurstSwitchNetwork" type="button">Switch Network</button>
            <button id="dopplerBurstLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="dopplerBurstContractResult"></div>
          <div id="dopplerBurstBuyerRows" class="buyer-rows">
            ${Ki()}
          </div>
          <div class="button-row">
            <button id="dopplerBurstReview" type="button">Validate Burst</button>
            <button id="dopplerBurstExecute" type="button">Launch And Burst Buy</button>
          </div>

          <h3 class="section-gap">Burst Review</h3>
          <div class="result" id="dopplerBurstReviewResult"></div>

          <h3 class="section-gap">Burst Execution</h3>
          <div class="result" id="dopplerBurstExecutionResult"></div>
        </div>
        <div class="tab-panel ${y.activeFunctionTab==="verify"?"active":""}" data-tab-panel="verify">
          <p class="hint">Verify the deployed Token contract on Robinhood Blockscout using Hardhat Standard JSON input.</p>
          <div class="grid two">
            <label>Contract address ${x("verifyAddress","blank = deployed/attached contract")}</label>
            <label>Contract name ${x("verifyContractName","contracts/HRD.sol:HRD")}</label>
            <label>Compiler version ${x("verifyCompiler","v0.8.17+commit.8df45f5f")}</label>
            <label>Constructor args, optional override ${x("verifyConstructorArgs","blank = encode deploy form")}</label>
            <label>Verification GUID ${x("verifyGuid","returned after submit")}</label>
          </div>
          <div class="button-row">
            <button id="verifyContract">Verify On Blockscout</button>
            <button id="checkVerifyStatus">Check Verification Status</button>
            <button id="openBlockscout">Open In Blockscout</button>
          </div>
          <div class="result" id="verifyResult"></div>
        </div>
        ${B.canManageUsers||B.canManageRoles?`
        <div class="tab-panel ${y.activeFunctionTab==="admin"?"active":""}" data-tab-panel="admin">
          ${Wl()}
        </div>`:""}
          </div>
        </div>
      </section>

      <pre id="log"></pre>
    </main>
  `;for(const V of["rpcUrl","privateKey","tokenName","tokenSymbol","router","taxWallet","ecosystemWallet","bel","contractAddress","deployGasLimit","buyTokenAddress","buyEthAmount","buyMinTokens","buyRecipient","buyDeadline","buyerPrivateKeys","sellMinEth","sellRecipient","sellDeadline","sellerPrivateKeys","launchEthAmount","launchLpRecipient","lpTokenAmount","lpEthAmount","lpMinToken","lpMinEth","lpRecipient","lpDeadline","removePair","removeLpAmount","removeMinToken","removeMinEth","removeRecipient","removeDeadline","burnAmount","generatedAccounts","sendTo0","sendAmount0","sendTo1","sendAmount1","sendTo2","sendAmount2","sendTo3","sendAmount3","sendTo4","sendAmount4","sweepRecipient","sweepBuffer","sweepPrivateKeys","ponsCurrentBlock","ponsPrimaryWallet","ponsPrimaryBalance","ponsLaunchContract","ponsLaunchFee","ponsRouter","ponsFactory","ponsPositionManager","ponsPairToken","ponsLaunchConfigId","ponsDexId","ponsTokenName","ponsTokenSymbol","ponsLogo","ponsDescription","ponsTwitter","ponsTelegram","ponsDiscord","ponsWebsite","ponsFarcaster","ponsFeeWallet","ponsSalt","ponsSlippage","ponsOwner","ponsLaunchEnabledStatus","ponsIsOwner","ponsWhitelistAddress","ponsIsWhitelisted",...Array.from({length:1},(F,k)=>[`ponsBuyerEnabled${k}`,`ponsBuyerAddress${k}`,`ponsBuyerAmount${k}`,`ponsBuyerMinOut${k}`,`ponsBuyerBalance${k}`,`ponsBuyerGas${k}`,`ponsBuyerStatus${k}`,`ponsBuyerHash${k}`,`ponsBuyerReceived${k}`]).flat(),...Array.from({length:5},(F,k)=>[`ponsFastLaneBuyerEnabled${k}`,`ponsFastLaneBuyerKey${k}`,`ponsFastLaneBuyerAddress${k}`,`ponsFastLaneBuyerAmount${k}`,`ponsFastLaneBuyerMinOut${k}`,`ponsFastLaneBuyerBalance${k}`,`ponsFastLaneBuyerGas${k}`,`ponsFastLaneBuyerStatus${k}`,`ponsFastLaneBuyerHash${k}`,`ponsFastLaneBuyerReceived${k}`]).flat(),...et.flatMap(({prefix:F})=>Array.from({length:je},(k,O)=>[`${F}BuyerEnabled${O}`,`${F}BuyerKey${O}`,`${F}BuyerAddress${O}`,`${F}BuyerAmount${O}`,`${F}BuyerMinOut${O}`,`${F}BuyerBalance${O}`,`${F}BuyerGas${O}`,`${F}BuyerStatus${O}`,`${F}BuyerHash${O}`,`${F}BuyerReceived${O}`]).flat()),"lunchCurrentBlock","lunchPrimaryWallet","lunchPrimaryBalance","lunchLaunchContract","lunch7702Coordinator","lunch7702Delegate","lunchAtomicOwner","lunchImplementation","lunchLaunchFee","lunchRouter","lunchFactory","lunchNpm","lunchXToken","lunchFeeLocker","lunchEnforcedSupply","lunchTickMagnitude","lunchTokenName","lunchTokenSymbol","lunchTotalSupply","lunchFeeTier","lunchImage","lunchBanner","lunchDescription","lunchWebsite","lunchTwitter","lunchTelegram","lunchSalt","lunchDeadline",...Array.from({length:5},(F,k)=>[`lunchBuyerEnabled${k}`,`lunchBuyerKey${k}`,`lunchBuyerAddress${k}`,`lunchBuyerAmount${k}`,`lunchBuyerMinOut${k}`,`lunchBuyerBalance${k}`,`lunchBuyerGas${k}`,`lunchBuyerStatus${k}`,`lunchBuyerHash${k}`,`lunchBuyerReceived${k}`]).flat(),"lunchBurstCurrentBlock","lunchBurstPrimaryWallet","lunchBurstPrimaryBalance","lunchBurstLaunchContract","lunchBurstImplementation","lunchBurstLaunchFee","lunchBurstRouter","lunchBurstFactory","lunchBurstNpm","lunchBurstXToken","lunchBurstEnforcedSupply","lunchBurstTokenName","lunchBurstTokenSymbol","lunchBurstTotalSupply","lunchBurstFeeTier","lunchBurstDevBuyEth","lunchBurstSalt","lunchBurstImage","lunchBurstBanner","lunchBurstDescription","lunchBurstWebsite","lunchBurstTwitter","lunchBurstTelegram",...Array.from({length:25},(F,k)=>[`lunchBurstBuyerEnabled${k}`,`lunchBurstBuyerKey${k}`,`lunchBurstBuyerAddress${k}`,`lunchBurstBuyerAmount${k}`,`lunchBurstBuyerMinOut${k}`,`lunchBurstBuyerBalance${k}`,`lunchBurstBuyerGas${k}`,`lunchBurstBuyerStatus${k}`,`lunchBurstBuyerHash${k}`,`lunchBurstBuyerReceived${k}`]).flat(),"lunchComboCurrentBlock","lunchComboPrimaryWallet","lunchComboPrimaryBalance","lunchComboTokenName","lunchComboTokenSymbol","lunchComboTotalSupply","lunchComboFeeTier","lunchComboImage","lunchComboBanner","lunchComboDescription","lunchComboWebsite","lunchComboTwitter","lunchComboTelegram","lunchComboSalt","lunchComboDeadline","lunchComboDevBuyEth",...Array.from({length:5},(F,k)=>[`lunchComboBuyerEnabled${k}`,`lunchComboBuyerKey${k}`,`lunchComboBuyerAddress${k}`,`lunchComboBuyerAmount${k}`,`lunchComboBuyerMinOut${k}`,`lunchComboBuyerBalance${k}`,`lunchComboBuyerGas${k}`,`lunchComboBuyerStatus${k}`,`lunchComboBuyerHash${k}`,`lunchComboBuyerReceived${k}`]).flat(),...Array.from({length:25},(F,k)=>[`lunchComboBurstBuyerEnabled${k}`,`lunchComboBurstBuyerKey${k}`,`lunchComboBurstBuyerAddress${k}`,`lunchComboBurstBuyerAmount${k}`,`lunchComboBurstBuyerMinOut${k}`,`lunchComboBurstBuyerBalance${k}`,`lunchComboBurstBuyerGas${k}`,`lunchComboBurstBuyerStatus${k}`,`lunchComboBurstBuyerHash${k}`,`lunchComboBurstBuyerReceived${k}`]).flat(),"dopplerPrimaryWallet","dopplerPrimaryBalance","dopplerTokenName","dopplerTokenSymbol","dopplerInitialSupply","dopplerNumTokensToSell","dopplerIntegrator","dopplerSalt","dopplerNumeraireIsNative","dopplerDeadline","dopplerTokenFactoryData","dopplerGovernanceFactoryData","dopplerPoolInitializerData","dopplerLiquidityMigratorData",...Array.from({length:5},(F,k)=>[`dopplerBuyerEnabled${k}`,`dopplerBuyerAddress${k}`,`dopplerBuyerAmount${k}`,`dopplerBuyerMinOut${k}`,`dopplerBuyerGas${k}`,`dopplerBuyerStatus${k}`,`dopplerBuyerReceived${k}`]).flat(),"dopplerBurstPrimaryWallet","dopplerBurstPrimaryBalance","dopplerBurstTokenName","dopplerBurstTokenSymbol","dopplerBurstInitialSupply","dopplerBurstNumTokensToSell","dopplerBurstIntegrator","dopplerBurstSalt","dopplerBurstNumeraireIsNative","dopplerBurstTokenFactoryData","dopplerBurstGovernanceFactoryData","dopplerBurstPoolInitializerData","dopplerBurstLiquidityMigratorData",...Array.from({length:25},(F,k)=>[`dopplerBurstBuyerEnabled${k}`,`dopplerBurstBuyerKey${k}`,`dopplerBurstBuyerAddress${k}`,`dopplerBurstBuyerAmount${k}`,`dopplerBurstBuyerMinOut${k}`,`dopplerBurstBuyerBalance${k}`,`dopplerBurstBuyerGas${k}`,`dopplerBurstBuyerStatus${k}`,`dopplerBurstBuyerHash${k}`,`dopplerBurstBuyerReceived${k}`]).flat(),"verifyAddress","verifyContractName","verifyCompiler","verifyConstructorArgs","verifyGuid",...Gr,...Xr,...Jr,"multiBurstTokenAddress","multiBurstSlippage",...Array.from({length:25},(F,k)=>[`multiBurstBuyerEnabled${k}`,`multiBurstBuyerKey${k}`,`multiBurstBuyerAddress${k}`,`multiBurstBuyerAmount${k}`,`multiBurstBuyerBalance${k}`,`multiBurstBuyerStatus${k}`,`multiBurstBuyerHash${k}`,`multiBurstBuyerReceived${k}`]).flat(),"washTokenAddress","washSlippage","washSellKey","washSellAmount","washBuyKey","washRelayCount","washRelayDelayRange","washRelayVariancePct","washRelayGasReserve","washUseCrossChain","washSolanaRpcUrl","washSolanaGasReserve","washBatchSellKeys","washBatchBuyKeys","washBatchRelayCount","washBatchDelayRange","washBatchVariancePct","washBatchGasReserve","washBatchUseCrossChain","washBatchSolanaRpcUrl","washBatchSolanaGasReserve","pwponsCurrentBlock","pwponsPrimaryWallet","pwponsPrimaryBalance","pwponsLaunchContract","pwponsLaunchFee","pwponsRouter","pwponsFactory","pwponsPositionManager","pwponsPairToken","pwponsLaunchConfigId","pwponsDexId","pwponsTokenName","pwponsTokenSymbol","pwponsLogo","pwponsDescription","pwponsTwitter","pwponsTelegram","pwponsDiscord","pwponsWebsite","pwponsFarcaster","pwponsFeeWallet","pwponsSalt","pwponsSlippage","pwponsOwner","pwponsLaunchEnabledStatus","pwponsIsOwner","pwponsWhitelistAddress","pwponsIsWhitelisted",...Array.from({length:1},(F,k)=>[`pwponsBuyerEnabled${k}`,`pwponsBuyerAddress${k}`,`pwponsBuyerAmount${k}`,`pwponsBuyerMinOut${k}`,`pwponsBuyerBalance${k}`,`pwponsBuyerGas${k}`,`pwponsBuyerStatus${k}`,`pwponsBuyerHash${k}`,`pwponsBuyerReceived${k}`]).flat(),...Array.from({length:5},(F,k)=>[`pwponsFastLaneBuyerEnabled${k}`,`pwponsFastLaneBuyerKey${k}`,`pwponsFastLaneBuyerAddress${k}`,`pwponsFastLaneBuyerAmount${k}`,`pwponsFastLaneBuyerMinOut${k}`,`pwponsFastLaneBuyerBalance${k}`,`pwponsFastLaneBuyerGas${k}`,`pwponsFastLaneBuyerStatus${k}`,`pwponsFastLaneBuyerHash${k}`,`pwponsFastLaneBuyerReceived${k}`]).flat(),...et.flatMap(({prefix:F})=>Array.from({length:je},(k,O)=>[`pw${F}BuyerEnabled${O}`,`pw${F}BuyerKey${O}`,`pw${F}BuyerAddress${O}`,`pw${F}BuyerAmount${O}`,`pw${F}BuyerMinOut${O}`,`pw${F}BuyerBalance${O}`,`pw${F}BuyerGas${O}`,`pw${F}BuyerStatus${O}`,`pw${F}BuyerHash${O}`,`pw${F}BuyerReceived${O}`]).flat()),"pwwashTokenAddress","pwwashSlippage","pwwashBatchSellKeys","pwwashBatchBuyKeys","pwwashBatchRelayCount","pwwashBatchDelayRange","pwwashBatchVariancePct","pwwashBatchGasReserve","pwwashBatchUseCrossChain","pwwashBatchSolanaRpcUrl","pwwashBatchSolanaGasReserve","pwponsWashStartDelay","ponsAllThenWash","ponsAllWashStartDelay","ponsAllWashSlippage","ponsAllWashRelayCount","ponsAllWashDelayRange","ponsAllWashVariancePct","ponsAllWashGasReserve","ponsAllWashUseCrossChain","ponsAllWashSolanaGasReserve","launchPlanBudget","launchPlanWalletCount","adminNewUsername","adminNewPassword","adminRoleName","adminRoleDescription","adminProjectName","adminProjectTokenAddress","adminProjectRpcUrl","adminProjectRouter","adminAccessUsername"])l[V]=document.querySelector(`#${V}`);l.tokenName.value="Hood Research Departmen",l.tokenSymbol.value="HRD",l.rpcUrl.value="/rpc",l.router.value=oe.router,l.buyMinTokens.value="0",l.buyDeadline.value="20",l.sellMinEth.value="0",l.sellDeadline.value="20",l.lpMinToken.value="0",l.lpMinEth.value="0",l.lpDeadline.value="20",l.removeMinToken.value="0",l.removeMinEth.value="0",l.removeDeadline.value="20",l.sweepBuffer.value="0.00001",l.ponsLaunchConfigId.value="0",l.ponsDexId.value="0",l.ponsSlippage.value="5",l.ponsBuyerEnabled0.checked=!0,l.pwponsLaunchConfigId.value="0",l.pwponsDexId.value="0",l.pwponsSlippage.value="5",l.pwponsBuyerEnabled0.checked=!0,l.lunchRouter.value=j.router,l.lunchTotalSupply.value="1000000000",l.lunchFeeTier.value="10000",l.lunchDeadline.value="5",l.lunchBuyerEnabled0.checked=!0,l.lunchBurstRouter.value=j.router,l.lunchBurstTotalSupply.value="1000000000",l.lunchBurstFeeTier.value="10000",l.lunchBurstDevBuyEth.value="0",l.lunchComboTotalSupply.value="1000000000",l.lunchComboFeeTier.value="10000",l.lunchComboDeadline.value="5",l.lunchComboDevBuyEth.value="0",l.lunchComboBuyerEnabled0.checked=!0,l.launchPlanBudget.value="6900",l.launchPlanWalletCount.value="100",l.verifyContractName.value=dt.contractName,l.verifyCompiler.value=dt.compilerVersion,document.querySelector("#signOutLink").addEventListener("click",ql),Fl(),(e=document.querySelector("#activeProjectSelect"))==null||e.addEventListener("change",V=>{Yn(V.target.value)}),document.querySelector("#connectMetaMask").addEventListener("click",Hl),document.querySelector("#addRobinhood").addEventListener("click",Ye),document.querySelector("#connect").addEventListener("click",Ul);for(const V of document.querySelectorAll("[data-tab]"))V.addEventListener("click",ic);document.querySelector("#deploy").addEventListener("click",lc),document.querySelector("#diagnoseDeploy").addEventListener("click",bc),document.querySelector("#verifyLatestDeploy").addEventListener("click",k0),document.querySelector("#attach").addEventListener("click",co),document.querySelector("#buyAttachToken").addEventListener("click",fc),document.querySelector("#buyConnected").addEventListener("click",mc),document.querySelector("#buyBatch").addEventListener("click",yc),document.querySelector("#sellConnected").addEventListener("click",xc),document.querySelector("#sellBatch").addEventListener("click",vc),document.querySelector("#launchInitialLp").addEventListener("click",wc),document.querySelector("#addLp").addEventListener("click",gc),document.querySelector("#removeLp").addEventListener("click",kc),document.querySelector("#burnTokens").addEventListener("click",$c),document.querySelector("#generateAccounts").addEventListener("click",Sc),document.querySelector("#copyAccounts").addEventListener("click",Ec),document.querySelector("#loadAccountsToMultisend").addEventListener("click",Tc),document.querySelector("#sendEthBatch").addEventListener("click",Cc),document.querySelector("#previewSweep").addEventListener("click",Rc),document.querySelector("#sweepConnected").addEventListener("click",Bc),document.querySelector("#sweepBatch").addEventListener("click",Ac),document.querySelector("#ponsSwitchNetwork").addEventListener("click",Ye),document.querySelector("#ponsLoadStatus").addEventListener("click",()=>x0("")),document.querySelector("#ponsValidateAll").addEventListener("click",()=>ga("")),document.querySelector("#ponsExecuteAll").addEventListener("click",()=>g0("")),document.querySelector("#ponsCheckWhitelist").addEventListener("click",Lc),document.querySelector("#ponsEnableLaunch").addEventListener("click",()=>v0(!0)),document.querySelector("#ponsDisableLaunch").addEventListener("click",()=>v0(!1)),document.querySelector("#ponsWhitelistAdd").addEventListener("click",()=>w0(!0)),document.querySelector("#ponsWhitelistRemove").addEventListener("click",()=>w0(!1)),document.querySelector("#multiBurstCheckPool").addEventListener("click",Hc),document.querySelector("#multiBurstExecute").addEventListener("click",Uc),(t=document.querySelector("#washCheckPool"))==null||t.addEventListener("click",jc),(n=document.querySelector("#washRunSequence"))==null||n.addEventListener("click",zc),(a=document.querySelector("#washRunSequenceCrossChain"))==null||a.addEventListener("click",Xc),(r=document.querySelector("#washBatchRun"))==null||r.addEventListener("click",()=>jn()),document.querySelector("#lunchSwitchNetwork").addEventListener("click",Ye),document.querySelector("#lunchLoadStatus").addEventListener("click",vo),document.querySelector("#lunchReview").addEventListener("click",Na),document.querySelector("#lunchExecute").addEventListener("click",qa),document.querySelector("#lunchBurstSwitchNetwork").addEventListener("click",Ye),document.querySelector("#lunchBurstLoadStatus").addEventListener("click",To),document.querySelector("#lunchBurstReview").addEventListener("click",Co),document.querySelector("#lunchBurstExecute").addEventListener("click",Bo),document.querySelector("#lunchComboModeAtomic").addEventListener("change",Rn),document.querySelector("#lunchComboModeBurst").addEventListener("change",Rn),document.querySelector("#lunchComboModeChained").addEventListener("change",Rn),document.querySelector("#lunchComboSwitchNetwork").addEventListener("click",Ye),document.querySelector("#lunchComboLoadStatus").addEventListener("click",fd),document.querySelector("#lunchComboAtomicReview").addEventListener("click",pd),document.querySelector("#lunchComboAtomicExecute").addEventListener("click",hd),document.querySelector("#lunchComboBurstReview").addEventListener("click",md),document.querySelector("#lunchComboBurstExecute").addEventListener("click",yd),document.querySelector("#lunchComboChainedReview").addEventListener("click",xd),document.querySelector("#lunchComboChainedExecute").addEventListener("click",vd),Rn(),document.querySelector("#dopplerSwitchNetwork").addEventListener("click",Ye),document.querySelector("#dopplerLoadStatus").addEventListener("click",od),document.querySelector("#dopplerReview").addEventListener("click",sd),document.querySelector("#dopplerExecute").addEventListener("click",id),document.querySelector("#dopplerBurstSwitchNetwork").addEventListener("click",Ye),document.querySelector("#dopplerBurstLoadStatus").addEventListener("click",cd),document.querySelector("#dopplerBurstReview").addEventListener("click",ud),document.querySelector("#dopplerBurstExecute").addEventListener("click",bd),document.querySelector("#verifyContract").addEventListener("click",k0),document.querySelector("#checkVerifyStatus").addEventListener("click",Ed),document.querySelector("#openBlockscout").addEventListener("click",Td),document.querySelector("#launchPlanCalculate").addEventListener("click",Tr),document.querySelector("#launchPlanReset").addEventListener("click",Gi);for(const V of document.querySelectorAll("[data-call]"))V.addEventListener("click",hc);Qr(),Ir(),Rr(),Yr(),Zr(),Oi(),(o=document.querySelector("#ponsUseDevWallet"))==null||o.addEventListener("click",Vl),(s=document.querySelector("#ponsFillBundleWallets"))==null||s.addEventListener("click",Gl),(i=document.querySelector("#pwponsWashConnectDev"))==null||i.addEventListener("click",Xl),(c=document.querySelector("#pwponsWashFillBundle"))==null||c.addEventListener("click",y0),(u=document.querySelector("#pwponsWashFillWashBuy"))==null||u.addEventListener("click",Yl),(d=document.querySelector("#pwponsWashValidate"))==null||d.addEventListener("click",Jl),(b=document.querySelector("#pwponsWashStart"))==null||b.addEventListener("click",Zl),(f=document.querySelector("#pwponsSwitchNetwork"))==null||f.addEventListener("click",Ye),(p=document.querySelector("#pwponsLoadStatus"))==null||p.addEventListener("click",()=>x0("pw")),(h=document.querySelector("#pwponsValidateAll"))==null||h.addEventListener("click",()=>ga("pw")),(m=document.querySelector("#pwponsExecuteAll"))==null||m.addEventListener("click",()=>g0("pw")),(v=document.querySelector("#pwponsUseDevWallet"))==null||v.addEventListener("click",()=>$t("pwponsWalletsTabResult","Pons + Wash","pwponsDevWalletSelect")),(g=document.querySelector("#pwponsFillBundleWallets"))==null||g.addEventListener("click",y0),($=document.querySelector("#pwwashBatchRun"))==null||$.addEventListener("click",()=>jn("#pwwashBatchResult")),(T=document.querySelector("#lunchUseDevWallet"))==null||T.addEventListener("click",Ql),(S=document.querySelector("#lunchFillBundleWallets"))==null||S.addEventListener("click",ec),(E=document.querySelector("#lunchBurstUseDevWallet"))==null||E.addEventListener("click",tc),(L=document.querySelector("#lunchBurstFillBundleWallets"))==null||L.addEventListener("click",nc),(M=document.querySelector("#lunchComboUseDevWallet"))==null||M.addEventListener("click",ac),(D=document.querySelector("#lunchComboFillBundleWallets"))==null||D.addEventListener("click",rc),(I=document.querySelector("#dopplerUseDevWallet"))==null||I.addEventListener("click",oc),(H=document.querySelector("#dopplerFillBundleWallets"))==null||H.addEventListener("click",sc),lt(),Vt()}function m0(e){const t=e.stateMutability==="payable";return`
    <article class="function-card">
      <div class="function-head">
        <strong>${e.name}</strong>
        <span>${e.stateMutability}</span>
      </div>
      <div class="grid ${e.inputs.length+(t?1:0)>1?"two":""}">
        ${e.inputs.map((n,a)=>`<label>${n.name||`arg${a}`} <input data-input="${e.name}-${a}" placeholder="${n.type}" /></label>`).join("")}
        ${t?`<label>Native value <input data-value="${e.name}" placeholder="0.1" /></label>`:""}
      </div>
      <button data-call="${e.name}" data-mutability="${e.stateMutability}">${e.stateMutability==="view"||e.stateMutability==="pure"?"Read":"Send"}</button>
      <div class="result" data-result="${e.name}"></div>
    </article>
  `}function w(e){const t=document.querySelector("#log");t.textContent=`[${new Date().toLocaleTimeString()}] ${e}
${t.textContent}`}function Vt(){const e=document.querySelector("#status");e.textContent=y.signer?`Connected ${R(y.address)}${y.walletMode?` via ${y.walletMode}`:""}${y.contract?` | Contract ${R(y.contract.target)}`:""}`:"Not connected"}async function ql(e){e.preventDefault();try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"})}catch{}window.location.href="/login.html"}async function Hl(){if(!window.ethereum){w("MetaMask was not detected in this browser.");return}y.provider=new In(window.ethereum),await y.provider.send("eth_requestAccounts",[]),y.signer=await y.provider.getSigner(),y.address=await y.signer.getAddress(),y.walletMode="MetaMask";const e=await y.provider.getNetwork();w(`Connected MetaMask ${y.address} on chain ${e.chainId}`),e.chainId!==BigInt(oe.chainId)&&w('MetaMask is not on Robinhood Chain. Click "Add/Switch Robinhood Chain" or deploy will switch before sending.'),Vt()}async function Ye(){if(!window.ethereum){w("MetaMask was not detected in this browser.");return}try{await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:oe.chainIdHex}]}),w("MetaMask switched to Robinhood Chain.")}catch(e){if(e.code!==4902){w(`Switch failed: ${e.message}`);return}await window.ethereum.request({method:"wallet_addEthereumChain",params:[{chainId:oe.chainIdHex,chainName:oe.chainName,rpcUrls:[oe.rpcUrl],nativeCurrency:{name:oe.currencySymbol,symbol:oe.currencySymbol,decimals:18},blockExplorerUrls:[oe.blockExplorerUrl]}]}),w("Robinhood Chain was added to MetaMask.")}}async function Ul(){y.provider=te(),y.signer=new K(l.privateKey.value.trim(),y.provider),y.address=await y.signer.getAddress(),y.walletMode="RPC";const e=await y.provider.getBalance(y.address);w(`Connected ${y.address} with ${W(e)} native balance`),Vt()}async function vn(e){if(!B.activeProjectId)throw new Error("Select a project first (top of the page).");const t=await ve(`/api/wallets?chain=evm&category=${e}&reveal=1`),n=await t.json();if(!t.ok)throw new Error(n.error||"Failed to load wallets.");return n.wallets}async function jl(e){if(!B.activeProjectId)return[];const t=await ve(`/api/wallets?chain=evm&category=${e}`),n=await t.json();return t.ok?n.wallets:[]}async function Kl(e){const t=document.querySelector(`#${e}`);if(!t)return;const n=t.value,a=await jl("dev");if(a.length===0){t.innerHTML='<option value="">No Dev wallets saved</option>';return}t.innerHTML=a.map((r,o)=>`<option value="${r.address}">${R(r.address)}${r.label?` — ${q(r.label)}`:""}${o===0?" (newest)":""}</option>`).join(""),a.some(r=>r.address===n)&&(t.value=n)}async function $t(e,t,n){const a=document.querySelector(`#${e}`);try{const r=document.querySelector(`#${n}`),o=r==null?void 0:r.value;if(!o)throw new Error("No Dev wallet saved for this project yet — generate one in the Wallets tab first.");a.textContent=`Loading Dev wallet ${R(o)} from the vault...`;const i=(await vn("dev")).find(u=>u.address.toLowerCase()===o.toLowerCase());if(!i)throw new Error(`Selected Dev wallet ${R(o)} was not found — it may have been deleted. Refresh the dropdown.`);y.provider=te(),y.signer=new K(i.privateKey,y.provider),y.address=await y.signer.getAddress(),y.walletMode="RPC";const c=await y.provider.getBalance(y.address);a.textContent=`Connected Dev wallet ${R(y.address)} (${P(Number(W(c)))} ETH) as the launch signer.`,w(`${t}: connected Dev wallet ${y.address} from the vault as signer.`),Vt()}catch(r){a.textContent=A(r)}}async function Gt(e,t,n,a){const r=document.querySelector(`#${t}`);try{r.textContent="Loading Bundle wallets from the vault...";const o=await vn("bundle");if(o.length===0)throw new Error("No Bundle wallets saved for this project yet — generate some in the Wallets tab first.");o.length>e.length&&(r.textContent=`${o.length} Bundle wallets saved, but only ${e.length} buyer-row slot(s) exist (${a}) — using the first ${e.length}.`);let s=0;for(const i of o){if(s>=e.length)break;const{prefix:c,index:u}=e[s],d=document.querySelector(`#${c}BuyerKey${u}`),b=document.querySelector(`#${c}BuyerEnabled${u}`);!d||!b||(d.value=i.privateKey,b.checked=!0,s++)}r.textContent=`Filled ${s} Bundle wallet(s) into buyer rows (${a}). Set each row's ETH amount and minimum token output before validating/executing.`,w(`${n}: filled ${s} Bundle wallet(s) from the vault into buyer rows.`)}catch(o){r.textContent=A(o)}}function Vl(){return $t("ponsWalletsTabResult","Pons","ponsDevWalletSelect")}function Gl(){const e=[...Array.from({length:5},(t,n)=>({prefix:"ponsFastLane",index:n})),...et.flatMap(({prefix:t})=>Array.from({length:je},(n,a)=>({prefix:t,index:a})))];return Gt(e,"ponsWalletsTabResult","Pons","Fast Lane first, then Burst 1/2/3")}const St="pw";function io(){const e=St;return[...Array.from({length:5},(t,n)=>({prefix:`${e}ponsFastLane`,index:n})),...et.flatMap(({prefix:t})=>Array.from({length:je},(n,a)=>({prefix:`${e}${t}`,index:a})))]}function lo(){var n,a;const e=[],t=new Set;for(const{prefix:r,index:o}of io()){if(!((n=l[`${r}BuyerEnabled${o}`])!=null&&n.checked))continue;const s=(((a=l[`${r}BuyerKey${o}`])==null?void 0:a.value)||"").trim();if(!s)continue;const i=s.startsWith("0x")?s:`0x${s}`;if(!/^0x[0-9a-fA-F]{64}$/.test(i))continue;let c;try{c=new K(i).address.toLowerCase()}catch{continue}t.has(c)||(t.add(c),e.push(i))}return e}function zl(){const e=St;return`
    <h2>Pons + Wash</h2>
    <p class="hint">A full Pons launch form and a full Wallet Wash form on one page. "Start Combo" launches the token, runs the Fast Lane + all three Burst sections, then automatically runs the Batch Wallet Wash: every bundle wallet sells its whole balance through disposable relay wallets into a matched Wash&nbsp;Buy wallet. The standalone <strong>Pons Launch</strong> and <strong>Wallet Wash</strong> tabs are separate and unaffected.</p>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Wallet fetch</strong><span>from the active project's vault</span></div>
      <p class="hint">"Fill Bundle Wallets" fills this tab's Fast Lane + Burst rows with the project's saved Bundle wallets and lists them as the wash Sell side. "Fill Wash Buy Wallets" loads the project's saved Wash&nbsp;Buy wallets as the wash Buy side. They pair by position: Bundle[N] sells → relay → Wash&nbsp;Buy[N] buys. Both also run automatically when you press Start Combo.</p>
      <div class="button-row">
        <button id="${e}ponsWashConnectDev" type="button">Connect Dev Wallet (launch signer)</button>
        <select id="${e}ponsWashDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
      </div>
      <div class="button-row">
        <button id="${e}ponsWashFillBundle" type="button">Fill Bundle Wallets</button>
        <button id="${e}ponsWashFillWashBuy" type="button">Fill Wash Buy Wallets</button>
      </div>
      <div class="result" id="${e}ponsWashFillResult"></div>
    </div>

    <h2 class="section-gap">Launch form</h2>
    ${gr(e)}

    <h2 class="section-gap">Wallet Wash form</h2>
    <div class="function-card section-gap">
      <div class="function-head"><strong>Token</strong><span>auto-set to the launched token after Start Combo</span></div>
      <div class="grid two">
        <label>Token contract address ${x(`${e}washTokenAddress`,"0x token (auto-filled on launch)")}</label>
        <label>Slippage % ${x(`${e}washSlippage`,"25")}</label>
      </div>
    </div>
    ${kr(e)}

    <div class="function-card section-gap pons-all-card">
      <div class="function-head"><strong>Run</strong><span>launch → Fast Lane → Burst → wait → Batch Wash</span></div>
      <p class="hint">On one confirm: launches the token, waits for restrictions to lift on-chain, fires Fast Lane and all three Burst sections, then waits the delay below and runs the Batch Wash across every filled pair, one after another. If the launch or a burst leg throws, the wash does not start. Long-running — keep this tab open.</p>
      <div class="grid two">
        <label>Wait after bundle before wash starts, seconds ${x(`${e}ponsWashStartDelay`,"30")}</label>
      </div>
      <div class="button-row">
        <button id="${e}ponsWashValidate" type="button">Validate (launch + burst)</button>
        <button id="${e}ponsWashStart" type="button">Start Combo</button>
      </div>
      <div class="result" id="${e}ponsWashComboResult"></div>
    </div>
  `}function Xl(){const e=St;return $t(`${e}ponsWashFillResult`,"Pons + Wash",`${e}ponsWashDevWalletSelect`)}async function y0(){const e=St,t=document.querySelector(`#${e}ponsWashFillResult`);await Gt(io(),`${e}ponsWashFillResult`,"Pons + Wash","Fast Lane first, then Burst 1/2/3");const n=lo();n.length>0&&(l[`${e}washBatchSellKeys`].value=n.join(`
`),t.textContent=`${t.textContent}
Wash Sell side set to ${n.length} bundle wallet(s).`.trim())}async function Yl(){const e=St,t=document.querySelector(`#${e}ponsWashFillResult`);try{t.textContent="Loading Wash Buy wallets from the vault...";const n=await vn("wash-buy");if(n.length===0)throw new Error("No Wash Buy wallets saved for this project yet — generate some in the Wallets tab (Wallet Wash — Buy Wallets).");l[`${e}washBatchBuyKeys`].value=n.map(a=>a.privateKey).join(`
`),t.textContent=`Loaded ${n.length} Wash Buy wallet(s) as the wash Buy side.`,w(`Pons + Wash: loaded ${n.length} Wash Buy wallet(s) from the vault.`)}catch(n){t.textContent=A(n)}}async function Jl(){var a;const e=St,t=document.querySelector(`#${e}ponsWashComboResult`);t.textContent="Validating this tab's launch + burst form...",await ga(e);const n=((a=document.querySelector(`#${e}ponsAllResult`))==null?void 0:a.textContent)||"";t.textContent=`Launch + burst validation:

${n}`}async function Zl(){var s;const e=St,t=ot(e),n=document.querySelector(`#${e}ponsWashComboResult`),a=[],r=i=>{a.push(`[${new Date().toLocaleTimeString()}] ${i}`),n.textContent=a.join(`
`),w(`Pons + Wash: ${i}`)},o=Math.max(0,(parseFloat(l[`${e}ponsWashStartDelay`].value)||0)*1e3);if(!window.confirm(`Start Combo will:
1. Launch the token and run Fast Lane + all Burst sections (no further prompts).
2. Auto-fill the wash Sell list from the bundle wallets and the Buy list from the project's Wash Buy wallets.
3. Wait ${(o/1e3).toFixed(0)}s, then run the Batch Wash.

Continue?`)){r("Combo cancelled before starting.");return}try{r("Phase 1 — Pons launch..."),await ho(r,e),r("Phase 2 — Fast Lane...");const i=await Un(`${e}ponsFastLane`,5,r,e);r(`Fast Lane done: ${i.confirmed}/${i.submitted} confirmed.`),r("Phase 3 — Burst sections...");let c=0,u=0;for(const{prefix:v,label:g}of et){const $=await Un(`${e}${v}`,je,r,e);r(`${g} done: ${$.confirmed}/${$.submitted} confirmed.`),c+=$.confirmed,u+=$.submitted}if(r(`Bundle complete. Token ${t.launchedToken}. Fast Lane ${i.confirmed}/${i.submitted}, Burst ${c}/${u} confirmed.`),!t.launchedToken)throw new Error("No launched token detected — not starting the wash.");let d=Ke(l[`${e}washBatchSellKeys`].value);d.length===0&&(d=lo(),l[`${e}washBatchSellKeys`].value=d.join(`
`),r(`Wash Sell side auto-filled with ${d.length} bundle wallet(s).`));let b=Ke(l[`${e}washBatchBuyKeys`].value);if(b.length===0)try{b=(await vn("wash-buy")).map(g=>g.privateKey),l[`${e}washBatchBuyKeys`].value=b.join(`
`),r(`Wash Buy side auto-filled with ${b.length} Wash Buy wallet(s) from the vault.`)}catch(v){throw new Error(`Could not auto-load Wash Buy wallets: ${A(v)}. Paste buy keys into the wash form and retry, or fill them first.`)}if(d.length===0||b.length===0)throw new Error("Need at least one Sell and one Buy wallet for the wash.");const f=Math.min(d.length,b.length);o>0&&(r(`Phase 4 — waiting ${(o/1e3).toFixed(0)}s before the wash...`),await tt(o)),r(`Phase 5 — Batch Wash across ${f} pair(s) (bundle sells → relay → wash buys)...`),l.washTokenAddress.value=t.launchedToken,l.washSlippage.value=(((s=l[`${e}washSlippage`])==null?void 0:s.value)||"25").trim()||"25",l[`${e}washBatchSellKeys`].value=d.join(`
`),l[`${e}washBatchBuyKeys`].value=b.join(`
`);const p=document.querySelector(`#${e}washBatchResult`);p&&(p.textContent=""),await jn(`#${e}washBatchResult`);const m=((p==null?void 0:p.textContent)||"").trim().split(`
`).filter(Boolean).pop()||"Batch Wash finished.";r(`Batch Wash: ${m.replace(/^\[[^\]]*\]\s*/,"")}`),r("Combo complete.")}catch(i){r(`Combo stopped: ${A(i)}`)}}function Ql(){return $t("lunchWalletsTabResult","Lunch.fun","lunchDevWalletSelect")}function ec(){const e=Array.from({length:4},(t,n)=>({prefix:"lunch",index:n+1}));return Gt(e,"lunchWalletsTabResult","Lunch.fun","buyer rows 2-5")}function tc(){return $t("lunchBurstWalletsTabResult","Lunch Burst","lunchBurstDevWalletSelect")}function nc(){const e=Array.from({length:25},(t,n)=>({prefix:"lunchBurst",index:n}));return Gt(e,"lunchBurstWalletsTabResult","Lunch Burst","all 25 burst buyer rows")}function ac(){return $t("lunchComboWalletsTabResult","Lunch + Burst","lunchComboDevWalletSelect")}function rc(){const e=[...Array.from({length:4},(t,n)=>({prefix:"lunchCombo",index:n+1})),...Array.from({length:25},(t,n)=>({prefix:"lunchComboBurst",index:n}))];return Gt(e,"lunchComboWalletsTabResult","Lunch + Burst","atomic rows 2-5, then all 25 burst rows")}function oc(){return $t("dopplerWalletsTabResult","Doppler","dopplerDevWalletSelect")}function sc(){const e=Array.from({length:25},(t,n)=>({prefix:"dopplerBurst",index:n}));return Gt(e,"dopplerWalletsTabResult","Doppler","all 25 Doppler Burst buyer rows — the 5-row atomic form has no key fields to fill, it always spends from the connected signer")}function ic(e){y.activeFunctionTab=e.currentTarget.dataset.tab,Ua(y.activeFunctionTab)}async function lc(){try{se();const e=cc();await pc(e[2]);const t=new Ra(ue.abi,ue.bytecode,y.signer);w("Estimating deployment...");const n=await t.getDeployTransaction(...e),a=await y.signer.estimateGas(n),r=dc(a);await uc(r),w(`Deployment gas estimate: ${a.toString()}. Using gas limit: ${r.toString()}`),w("Deploying contract...");const o=await t.deploy(...e,{gasLimit:r}),s=o.deploymentTransaction();y.lastDeployTxHash=s.hash,w(`Deployment transaction: ${s.hash}`);const i=await s.wait();if(w(`Deployment receipt status: ${i.status===1?"success":"failed"} in block ${i.blockNumber}`),i.status!==1)throw new Error(`Deployment transaction failed. Blockscout: ${oe.blockExplorerUrl}tx/${s.hash}`);await o.waitForDeployment(),y.contract=o,l.contractAddress.value=o.target,l.verifyAddress.value=o.target,w(`Deployed at ${o.target}`),w(`Blockscout contract page: ${oe.blockExplorerUrl}address/${o.target}`),Vt()}catch(e){w(`Deploy failed: ${e.shortMessage||e.reason||e.message}`)}}function cc(){return Oa()}function Oa(){const e=[l.tokenName.value.trim(),l.tokenSymbol.value.trim(),l.router.value.trim(),l.taxWallet.value.trim(),l.ecosystemWallet.value.trim(),wr(l.bel.value)],[t,n,a,r,o,s]=e;if(!t)throw new Error("Token name is required.");if(!n)throw new Error("Token symbol is required.");for(const[i,c]of[["router",a],["tax wallet",r],["ecosystem wallet",o]])if(!Y(c))throw new Error(`Invalid ${i} address.`);for(const i of s)if(!Y(i))throw new Error(`Invalid BEL address: ${i}`);return e}function dc(e){const t=l.deployGasLimit.value.trim();return t?BigInt(t):e*120n/100n}async function uc(e){const t=await y.signer.getAddress(),n=await y.provider.getBalance(t),a=await y.provider.getFeeData(),r=a.maxFeePerGas??a.gasPrice;if(r==null){w(`Deploy funding check: deployer ${t}, balance ${W(n)} ETH, gas price unavailable.`);return}const o=e*r;if(w(`Deploy funding check: deployer ${t}`),w(`Deployer balance on connected chain: ${W(n)} ETH`),w(`Max deploy gas cost at current fee: ${W(o)} ETH`),n<o)throw new Error(`Connected deployer balance is too low. Need about ${W(o)} ETH for gas.`)}async function bc(){var e;try{se();const t=[],n=await y.provider.getNetwork();t.push(`connected chain: ${n.chainId}`),t.push(`expected chain: ${oe.chainId}`);const a=$e(),r=await y.provider.getCode(a);if(t.push(`router: ${a}`),t.push(`router code bytes: ${r==="0x"?0:(r.length-2)/2}`),r!=="0x"){const s=new _(a,we,y.provider);t.push(`router WETH: ${await s.WETH()}`)}const o=l.contractAddress.value.trim()||((e=y.contract)==null?void 0:e.target);if(o&&Y(o)){const s=await y.provider.getCode(o);t.push(`contract: ${o}`),t.push(`contract code bytes: ${s==="0x"?0:(s.length-2)/2}`)}else t.push("contract: no valid contract address in the UI");if(y.lastDeployTxHash){const s=await y.provider.getTransactionReceipt(y.lastDeployTxHash);t.push(`last deploy tx: ${y.lastDeployTxHash}`),t.push(`last deploy receipt: ${s?`status ${s.status}, block ${s.blockNumber}, gasUsed ${s.gasUsed}`:"not found yet"}`)}else t.push("last deploy tx: none recorded in this page session");w(`Deploy diagnostics:
${t.join(`
`)}`)}catch(t){w(`Deploy diagnostics failed: ${t.shortMessage||t.message}`)}}async function co(){const e=l.contractAddress.value.trim();if(!e)throw new Error("Paste a token contract address first");y.contract=new _(e,ue.abi,y.signer||te()),l.verifyAddress.value=e,w(`Attached to ${e}`),Vt()}async function fc(){const e=document.querySelector("#buyTokenStatus");try{const t=l.buyTokenAddress.value.trim();if(!t)throw new Error("Paste a token contract address first");l.contractAddress.value=t,await co(),e&&(e.textContent=`Loaded: ${t}`)}catch(t){e&&(e.textContent=t.shortMessage||t.message),w(`Load token failed: ${t.shortMessage||t.message}`)}}async function pc(e=$e()){const t=await y.provider.getNetwork();if(t.chainId!==BigInt(oe.chainId))if(y.walletMode==="MetaMask"&&window.ethereum){if(w(`MetaMask is on chain ${t.chainId}. Switching to Robinhood Chain ${oe.chainId}...`),await Ye(),y.provider=new In(window.ethereum),y.signer=await y.provider.getSigner(),y.address=await y.signer.getAddress(),(await y.provider.getNetwork()).chainId!==BigInt(oe.chainId))throw new Error(`Wrong chain. Switch MetaMask to Robinhood Chain ${oe.chainId}.`)}else throw new Error(`Wrong RPC chain ${t.chainId}. Expected Robinhood Chain ${oe.chainId}.`);if(await y.provider.getCode(e)==="0x")throw new Error(`Router has no contract code on the connected chain: ${e}`);const r=await new _(e,we,y.provider).WETH();if(!Y(r))throw new Error("Router WETH() returned an invalid address.");w(`Preflight OK: Robinhood Chain ${oe.chainId}, router ${R(e)}, WETH ${R(r)}.`)}async function hc(e){var o;Et();const t=e.currentTarget.dataset.call,n=ue.abi.find(s=>s.type==="function"&&s.name===t),a=n.inputs.map((s,i)=>{var c;return Fi(s,((c=document.querySelector(`[data-input="${t}-${i}"]`))==null?void 0:c.value)??"")}),r=document.querySelector(`[data-result="${t}"]`);try{if(n.stateMutability==="view"||n.stateMutability==="pure"){const u=await y.contract[t](...a);r.textContent=Pd(u);return}const s={};if(n.stateMutability==="payable"){const u=(o=document.querySelector(`[data-value="${t}"]`))==null?void 0:o.value.trim();u&&(s.value=ce(u))}const i=await y.contract[t](...a,s);w(`${t} transaction: ${i.hash}`);const c=await i.wait();r.textContent=`Mined in block ${c.blockNumber}`}catch(s){r.textContent=s.shortMessage||s.message,w(`${t} failed: ${s.shortMessage||s.message}`)}}async function mc(){const e=document.querySelector("#buyResult");try{Et();const t=await y.signer.getAddress(),n=await Mo(y.signer,t);w(`Buy transaction: ${n.hash}`);const a=await n.wait();e.textContent=`Buy mined in block ${a.blockNumber}`}catch(t){e.textContent=t.shortMessage||t.message,w(`Buy failed: ${t.shortMessage||t.message}`)}}async function yc(){const e=document.querySelector("#buyResult");try{Fo()}catch(a){e.textContent=a.shortMessage||a.message,w(`Buy failed: ${a.shortMessage||a.message}`);return}const t=Rd(l.buyerPrivateKeys.value);if(t.length===0){e.textContent="Paste at least one buyer private key.";return}const n=te();e.textContent=`Starting ${t.length} buys...`;for(const[a,r]of t.entries())try{const o=new K(r.privateKey,n),s=await Mo(o,o.address,r.ethAmount);w(`Batch buy ${a+1}/${t.length} from ${R(o.address)} for ${r.ethAmount} ETH: ${s.hash}`),await s.wait()}catch(o){w(`Batch buy ${a+1}/${t.length} failed: ${o.shortMessage||o.message}`)}e.textContent=`Batch buy finished for ${t.length} pasted wallets. Check log for transaction hashes and failures.`}async function xc(){const e=document.querySelector("#sellResult");try{Et();const t=await y.signer.getAddress(),n=await uo(y.signer,t);e.textContent=`Sell mined in block ${n.blockNumber}`}catch(t){e.textContent=t.shortMessage||t.message,w(`Sell failed: ${t.shortMessage||t.message}`)}}async function vc(){const e=document.querySelector("#sellResult");try{Fo()}catch(a){e.textContent=a.shortMessage||a.message,w(`Sell failed: ${a.shortMessage||a.message}`);return}const t=l.sellerPrivateKeys.value.split(/\r?\n/).map(a=>a.trim()).filter(Boolean);if(t.length===0){e.textContent="Paste at least one seller private key.";return}const n=te();e.textContent=`Starting ${t.length} full-balance sells...`;for(const[a,r]of t.entries())try{const o=new K(r,n);await uo(o,o.address,`${a+1}/${t.length}`)}catch(o){w(`Batch sell ${a+1}/${t.length} failed: ${o.shortMessage||o.message}`)}e.textContent=`Batch sell finished for ${t.length} pasted wallets. Check log for transaction hashes and skipped zero balances.`}async function uo(e,t,n="connected"){const a=y.contract.target,r=$n(e),o=e.provider,s=$e(),i=await r.balanceOf(t);if(i===0n)return w(`Sell ${n}: ${R(t)} has zero token balance, skipped.`),{blockNumber:"skipped"};const c=await st(o,s,a);if(!c.exists)throw new Error(`No liquidity pool found for this token: ${c.error}`);const u=l.sellRecipient.value.trim()||t,d=l.sellMinEth.value.trim();if(c.version==="v3"){const v=c.swapRouter;if(await r.allowance(t,v)<i){const H=await r.approve(v,i);w(`Sell ${n} approval for ${R(t)}: ${H.hash}`),await H.wait()}const $=new _(v,[Re[0]],e),T=await kt(c.poolAddress,c.isToken0,i,o),S=d&&d!=="0"?me(d,"Minimum ETH out"):Fe(T,5),E={tokenIn:a,tokenOut:c.wethAddress,fee:c.poolFee,recipient:u,amountIn:i,amountOutMinimum:S,sqrtPriceLimitX96:0n},L=await $.exactInputSingle(E);w(`Sell ${n} from ${R(t)}: ${L.hash}`);const M=await L.wait(),D=new _(c.wethAddress,Ia,e),I=await D.balanceOf(t);if(I>0n){const H=await D.withdraw(I);w(`Sell ${n} WETH-to-ETH unwrap for ${R(t)}: ${H.hash}`),await H.wait()}return M}const b=new _(s,we,e);if(await r.allowance(t,s)<i){const v=await r.approve(s,i);w(`Sell ${n} approval for ${R(t)}: ${v.hash}`),await v.wait()}const p=await b.WETH(),h=me(d||"0","Minimum ETH out"),m=await b.swapExactTokensForETHSupportingFeeOnTransferTokens(i,h,[a,p],u,Oe(l.sellDeadline.value));return w(`Sell ${n} from ${R(t)}: ${m.hash}`),m.wait()}async function wc(){Et();const e=document.querySelector("#lpResult");try{const t=me(l.launchEthAmount.value,"Launch ETH amount"),n=await y.signer.getAddress(),a=l.launchLpRecipient.value.trim()||n;if(!Y(a))throw new Error("Invalid LP recipient address.");const r=await y.contract.launch(a,{value:t});w(`Launch initial LP transaction: ${r.hash}`);const o=await r.wait();e.textContent=`Initial LP launched in block ${o.blockNumber}`}catch(t){e.textContent=A(t),w(`Launch initial LP failed: ${A(t)}`)}}async function gc(){Et();const e=document.querySelector("#lpResult");try{const t=$e(),n=$n(y.signer),a=Do(y.signer),r=await n.decimals(),o=_t(l.lpTokenAmount.value,r,"Token amount"),s=_t(l.lpMinToken.value||"0",r,"Minimum token amount"),i=me(l.lpMinEth.value||"0","Minimum ETH amount"),c=me(l.lpEthAmount.value,"ETH amount"),u=l.lpRecipient.value.trim()||await y.signer.getAddress(),d=Oe(l.lpDeadline.value),b=await y.signer.getAddress(),f=await n.balanceOf(b);if(f<o)throw new Error(`Connected wallet has ${X(f,r)} tokens, but Add LP needs ${X(o,r)}. For first liquidity, use Launch Initial LP so the contract can pair its held token supply with your ETH.`);const p=await n.approve(t,o);w(`Token approval for LP: ${p.hash}`),await p.wait();const h=await a.addLiquidityETH(y.contract.target,o,s,i,u,d,{value:c});w(`Add LP transaction: ${h.hash}`);const m=await h.wait();e.textContent=`LP added in block ${m.blockNumber}`}catch(t){e.textContent=t.shortMessage||t.message,w(`Add LP failed: ${t.shortMessage||t.message}`)}}async function kc(){Et();const e=document.querySelector("#lpResult");try{const t=$e(),n=$n(y.signer),a=Do(y.signer),r=await n.decimals(),o=l.removePair.value.trim()||await y.contract.pair();if(!o||o===he)throw new Error("Pair address is empty. Launch first or enter pair address.");const s=new _(o,Ei,y.signer),i=_t(l.removeLpAmount.value,18,"LP token amount"),c=_t(l.removeMinToken.value||"0",r,"Minimum token amount"),u=me(l.removeMinEth.value||"0","Minimum ETH amount"),d=l.removeRecipient.value.trim()||await y.signer.getAddress(),b=Oe(l.removeDeadline.value),f=await s.approve(t,i);w(`LP approval: ${f.hash}`),await f.wait();const p=await a.removeLiquidityETHSupportingFeeOnTransferTokens(y.contract.target,i,c,u,d,b);w(`Remove LP transaction: ${p.hash}`);const h=await p.wait();e.textContent=`LP removed in block ${h.blockNumber}`}catch(t){e.textContent=t.shortMessage||t.message,w(`Remove LP failed: ${t.shortMessage||t.message}`)}}async function $c(){Et();const e=document.querySelector("#burnResult");try{const n=await $n(y.signer).decimals(),a=_t(l.burnAmount.value,n,"Burn amount"),r=await y.contract.burn(a);w(`Burn transaction: ${r.hash}`);const o=await r.wait();e.textContent=`Burn mined in block ${o.blockNumber}`}catch(t){e.textContent=A(t),w(`Burn failed: ${A(t)}`)}}function Sc(){y.generatedWallets=Array.from({length:5},()=>K.createRandom()),l.generatedAccounts.value=Bd(),document.querySelector("#accountsResult").textContent="Created 5 accounts locally.",w("Created 5 fresh accounts locally.")}async function Ec(){if(!l.generatedAccounts.value.trim()){document.querySelector("#accountsResult").textContent="Generate accounts first.";return}await navigator.clipboard.writeText(l.generatedAccounts.value),document.querySelector("#accountsResult").textContent="Copied generated accounts."}function Tc(){if(y.generatedWallets.length===0){document.querySelector("#accountsResult").textContent="Generate accounts first.";return}for(const[e,t]of y.generatedWallets.entries())l[`sendTo${e}`].value=t.address;y.activeFunctionTab="multisend",Ua("multisend"),w("Loaded generated account addresses into Multisend.")}async function Cc(){se();const e=document.querySelector("#multisendResult"),t=Array.from({length:5},(n,a)=>({to:l[`sendTo${a}`].value.trim(),amount:l[`sendAmount${a}`].value.trim()})).filter(n=>n.to&&n.amount);if(t.length===0){e.textContent="Enter at least one recipient and ETH amount.";return}e.textContent=`Sending ${t.length} ETH transfers...`;for(const[n,a]of t.entries())try{const r=await y.signer.sendTransaction({to:a.to,value:me(a.amount,`ETH amount for ${R(a.to)}`)});w(`ETH send ${n+1}/${t.length} to ${R(a.to)} for ${a.amount} ETH: ${r.hash}`),await r.wait()}catch(r){w(`ETH send ${n+1}/${t.length} failed: ${r.shortMessage||r.message}`)}e.textContent=`Finished ${t.length} ETH transfer attempts. Check log for hashes and failures.`}async function Bc(){se();const e=document.querySelector("#sweepResult");try{const t=await y.signer.getAddress(),n=await bo(y.signer,t);e.textContent=n?`Sweep mined in block ${n.blockNumber}`:"Nothing to sweep."}catch(t){e.textContent=t.shortMessage||t.message,w(`Sweep failed: ${t.shortMessage||t.message}`)}}async function Rc(){const e=document.querySelector("#sweepResult");try{Wa();const t=fo(l.sweepPrivateKeys.value);if(t.length===0){e.textContent="Paste at least one private key to preview.";return}const n=te(),a=[];let r=0n;for(const[o,s]of t.entries()){const i=new K(s,n),c=await n.getBalance(i.address);r+=c,a.push(`${o+1}. ${i.address} | ${W(c)} ETH`)}e.textContent=`Found ${t.length} wallets. Total before gas: ${W(r)} ETH

${a.join(`
`)}`,w(`Previewed ${t.length} sweep wallets. Total before gas: ${W(r)} ETH.`)}catch(t){e.textContent=A(t),w(`Sweep preview failed: ${A(t)}`)}}async function Ac(){const e=document.querySelector("#sweepResult");try{const t=Wa(),n=fo(l.sweepPrivateKeys.value);if(n.length===0){e.textContent="Paste at least one private key to sweep.";return}const a=te();let r=0,o=0,s=0;e.textContent=`Sending all ETH from ${n.length} wallets to ${R(t)}...`;for(const[i,c]of n.entries())try{const u=new K(c,a);await bo(u,u.address,`${i+1}/${n.length}`)?r++:o++}catch(u){s++,w(`Sweep ${i+1}/${n.length} failed: ${A(u)}`)}e.textContent=`Sweep finished. Sent: ${r}. Skipped low-balance: ${o}. Failed: ${s}. Check log for hashes and details.`}catch(t){e.textContent=A(t),w(`Sweep failed: ${A(t)}`)}}async function bo(e,t,n="connected"){const a=Wa(),r=e.provider||y.provider,o=await r.getBalance(t),s=await r.getFeeData(),c=await e.estimateGas({to:a,value:o>1n?1n:0n})*130n/100n,u=s.maxFeePerGas??s.gasPrice;if(u==null)throw new Error("Could not read gas price from RPC.");const d=me(l.sweepBuffer.value||"0","Extra gas buffer ETH"),b=c*(u*130n/100n),f=o-b-d;if(f<=0n)return w(`Sweep ${n}: ${R(t)} balance too low. Balance ${W(o)} ETH, gas+buffer ${W(b+d)} ETH.`),null;const p={to:a,value:f,gasLimit:c};s.maxFeePerGas!=null?(p.maxFeePerGas=s.maxFeePerGas*130n/100n,p.maxPriorityFeePerGas=s.maxPriorityFeePerGas??0n):p.gasPrice=s.gasPrice*130n/100n;const h=await e.sendTransaction(p);return w(`Sweep ${n} from ${R(t)} to ${R(a)} for ${W(f)} ETH: ${h.hash}`),h.wait()}function Wa(){const e=l.sweepRecipient.value.trim();if(!Y(e))throw new Error("Valid sweep destination wallet is required.");return e}function fo(e){return String(e??"").split(/[\s,;]+/).map(t=>t.trim()).filter(Boolean)}async function x0(e=""){var a;const t=ot(e),n=document.querySelector(`#${e}ponsContractResult`);try{se(),await it();const r=await y.signer.getAddress(),o=zt(y.signer);t.factory=o;const s=Nt(l[`${e}ponsDexId`].value||"0","DEX config ID"),i=Nt(l[`${e}ponsLaunchConfigId`].value||"0","Launch config ID"),[c,u,d,b,f,p,h,m,v,g]=await Promise.all([y.provider.getBlockNumber(),y.provider.getBalance(r),o.launchFee(),o.launchEnabled(),o.locker(),o.getDexConfig(s),o.getLaunchConfig(i),o.dexConfigCount(),o.launchConfigCount(),o.owner()]);t.launchFee=d,t.launchEnabled=b,t.locker=f,t.dexConfig=p,t.launchConfig=h,t.owner=g,t.isOwner=g.toLowerCase()===r.toLowerCase(),l[`${e}ponsCurrentBlock`].value=String(c),l[`${e}ponsPrimaryWallet`].value=r,l[`${e}ponsPrimaryBalance`].value=`${W(u)} ETH`,l[`${e}ponsLaunchFee`].value=`${W(d)} ETH`,l[`${e}ponsOwner`].value=g,l[`${e}ponsLaunchEnabledStatus`].value=b?"Open to everyone":"Closed — whitelist only",l[`${e}ponsIsOwner`].value=t.isOwner?`Yes (${R(r)})`:`No — owner is ${R(g)}`,l[`${e}ponsRouter`].value=p.swapRouter,l[`${e}ponsFactory`].value=p.factory,l[`${e}ponsPositionManager`].value=p.positionManager,l[`${e}ponsPairToken`].value=h.pairToken,(a=l[`${e}ponsBuyerAddress0`]).value||(a.value=r),l[`${e}ponsBuyerBalance0`].value=`${W(u)} ETH`,n.textContent=["Contract verified on Blockscout: yes","Required functions: launchToken, predictTokenAddress, getDexConfig, getLaunchConfig",`DEX configs: ${m}, launch configs: ${v}`,`Launch enabled: ${b}`,`Locker: ${f}`,"Mode: B - launch plus sequential router buys after restricted blocks"].join(`
`),w("Loaded Pons contract status.")}catch(r){n.textContent=A(r),w(`Pons status failed: ${A(r)}`)}}function po(){return l.ponsWhitelistAddress.value.trim()||l.ponsPrimaryWallet.value.trim()}async function Lc(){const e=document.querySelector("#ponsOwnerResult");try{se(),await it();const t=po();if(!Y(t))throw new Error("Enter a valid address, or load status first to default to the connected wallet.");const a=await zt(y.provider).whitelistedLaunchers(t);l.ponsIsWhitelisted.value=a?"Yes":"No",e.textContent=`${R(t)} is ${a?"":"not "}whitelisted to launch.`,w(`Pons: checked whitelist for ${R(t)} — ${a}.`)}catch(t){e.textContent=A(t),w(`Pons whitelist check failed: ${A(t)}`)}}async function v0(e){const t=document.querySelector("#ponsOwnerResult");try{se(),await it();const n=zt(y.signer);t.textContent=`${e?"Enabling":"Disabling"} public launching...`;const a=await n.setLaunchEnabled(e);if(w(`Pons: setLaunchEnabled(${e}) submitted: ${a.hash}`),(await a.wait()).status!==1)throw new Error("Transaction reverted.");l.ponsLaunchEnabledStatus.value=e?"Open to everyone":"Closed — whitelist only",t.textContent=`Public launching is now ${e?"enabled":"disabled"}. Tx: ${a.hash}`,w(`Pons: launchEnabled is now ${e}.`)}catch(n){t.textContent=A(n),w(`Pons setLaunchEnabled failed: ${A(n)}`)}}async function w0(e){const t=document.querySelector("#ponsOwnerResult");try{se(),await it();const n=po();if(!Y(n))throw new Error("Enter a valid address to whitelist, or connect a wallet first.");const a=zt(y.signer);t.textContent=`${e?"Whitelisting":"Removing"} ${R(n)}...`;const r=await a.setWhitelistedLauncher(n,e);if(w(`Pons: setWhitelistedLauncher(${R(n)}, ${e}) submitted: ${r.hash}`),(await r.wait()).status!==1)throw new Error("Transaction reverted.");l.ponsIsWhitelisted.value=e?"Yes":"No",t.textContent=`${R(n)} is ${e?"now whitelisted":"removed from the whitelist"}. Tx: ${r.hash}`,w(`Pons: ${R(n)} whitelist set to ${e}.`)}catch(n){t.textContent=A(n),w(`Pons setWhitelistedLauncher failed: ${A(n)}`)}}async function Pc(e=""){const t=ot(e),n=document.querySelector(`#${e}ponsReviewResult`);try{se(),await it();const a=await mo(e),r=await a.factory.launchToken.estimateGas(a.params,a.launchConfigId,a.dexId,a.salt,{value:a.launchValue});await a.factory.launchToken.staticCall(a.params,a.launchConfigId,a.dexId,a.salt,{value:a.launchValue}),t.predictedToken=a.predictedToken;const o=["Atomic: only the primary initial buy inside launchToken.","PonsLauncherToken blocks all other buys until restrictionEndBlock passes, regardless of caller.","Primary initial buy amountOutMinimum: fixed to 0 inside existing factory.","Use the Fast Lane / Burst sections below for additional wallets after restrictions lift."];l[`${e}ponsBuyerStatus0`].value="Ready for launch signature",l[`${e}ponsBuyerGas0`].value=`${r}`,n.textContent=[`Predicted token: ${a.predictedToken}`,"Launch function: launchToken(TokenParams,uint256,uint256,bytes32)",`DEX: ${a.dexConfig.name}, router ${a.dexConfig.swapRouter}, fee ${a.dexConfig.poolFee}`,`Supply: ${X(a.launchConfig.supply,18)} tokens`,`Launch fee: ${W(a.launchFee)} ETH`,`Primary initial buy: ${W(a.primaryBuyAmount)} ETH`,`Total primary wallet ETH required before gas: ${W(a.launchValue)} ETH`,`Restriction end block will be emitted by launch; configured restriction blocks: ${a.launchConfig.restrictionBlocks}`,`Warnings:
- ${o.join(`
- `)}`].join(`
`),w(`Pons review OK. Predicted token ${a.predictedToken}.`)}catch(a){n.textContent=A(a),w(`Pons review failed: ${A(a)}`)}}async function ho(e,t=""){var b;const n=ot(t);se(),await it(),e("Validating contract and simulating launch...");const a=await mo(t);await a.factory.launchToken.staticCall(a.params,a.launchConfigId,a.dexId,a.salt,{value:a.launchValue});const r=await a.factory.launchToken.estimateGas(a.params,a.launchConfigId,a.dexId,a.salt,{value:a.launchValue});l[`${t}ponsBuyerGas0`].value=`${r}`,e("Awaiting primary-wallet signature for launch..."),l[`${t}ponsBuyerStatus0`].value="Awaiting wallet confirmation";const o=await a.factory.launchToken(a.params,a.launchConfigId,a.dexId,a.salt,{value:a.launchValue});l[`${t}ponsBuyerHash0`].value=o.hash,l[`${t}ponsBuyerStatus0`].value="Launch submitted",e(`Launch submitted: ${xo(o.hash)}`);const s=await o.wait();if(s.status!==1)throw new Error("Launch transaction reverted.");l[`${t}ponsBuyerStatus0`].value=`Launch confirmed block ${s.blockNumber}`,e(`Launch confirmed in block ${s.blockNumber}.`);const i=Oc(s.logs);if(!i)throw new Error("TokenLaunched event was not found in the launch receipt.");n.launchedToken=i.token,n.launchedPool=i.pool,n.restrictionsEndBlock=i.restrictionsEndBlock,await Gn(i.token,"Pons"),e(`Token address detected: ${ma(i.token)}`),e(`Pool address detected: ${ma(i.pool)}`);const c=new _(i.token,mn,y.signer),u=await c.decimals(),d=((b=a.buyers[0])==null?void 0:b.recipient)||a.primary;if(a.primaryBuyAmount>0n){const f=await c.balanceOf(d);l[`${t}ponsBuyerReceived0`].value=X(f,u)}return e(`Launch complete. Token ${ma(i.token)} restricted until block ${i.restrictionsEndBlock}.`),i}async function mo(e=""){const t=ot(e),n=await y.signer.getAddress(),a=zt(y.signer),r=Nt(l[`${e}ponsDexId`].value||"0","DEX config ID"),o=Nt(l[`${e}ponsLaunchConfigId`].value||"0","Launch config ID"),[s,i,c]=await Promise.all([a.launchFee(),a.getDexConfig(r),a.getLaunchConfig(o)]);if(t.factory=a,t.dexConfig=i,t.launchConfig=c,t.launchFee=s,!i.enabled)throw new Error("Selected Pons DEX config is disabled.");if(!c.enabled)throw new Error("Selected Pons launch config is disabled.");if(!i.swapRouter||i.swapRouter===he)throw new Error("Selected Pons DEX config has no swap router.");const u=Ic(n,e);Mc(u);const d=u[0],b=d.enabled?d.amount:0n,f=l[`${e}ponsFeeWallet`].value.trim(),p=d.recipient||n,h={name:l[`${e}ponsTokenName`].value.trim(),symbol:l[`${e}ponsTokenSymbol`].value.trim(),logo:l[`${e}ponsLogo`].value.trim(),description:l[`${e}ponsDescription`].value.trim(),socials:{twitter:l[`${e}ponsTwitter`].value.trim(),telegram:l[`${e}ponsTelegram`].value.trim(),discord:l[`${e}ponsDiscord`].value.trim(),website:l[`${e}ponsWebsite`].value.trim(),farcaster:l[`${e}ponsFarcaster`].value.trim()},feeWallet:f||(p.toLowerCase()===n.toLowerCase()?he:p)};if(!h.name||!h.symbol)throw new Error("Pons token name and symbol are required.");if(h.feeWallet!==he&&!Y(h.feeWallet))throw new Error("Invalid Pons fee wallet / initial recipient.");const m=wn(l[`${e}ponsSalt`].value.trim());l[`${e}ponsSalt`].value.trim()||(l[`${e}ponsSalt`].value=m);const v=await a.predictTokenAddress(h,o,r,m,n);return{primary:n,factory:a,dexId:r,launchConfigId:o,launchFee:s,dexConfig:i,launchConfig:c,buyers:u,primaryBuyAmount:b,launchValue:s+b,params:h,salt:m,predictedToken:v}}function Ic(e,t=""){return Array.from({length:1},(n,a)=>{const r=l[`${t}ponsBuyerEnabled${a}`].checked,o=a===0?e:"",s=l[`${t}ponsBuyerAddress${a}`].value.trim()||o,i=l[`${t}ponsBuyerAmount${a}`].value.trim()||"0";return{index:a,enabled:r,recipient:s,amount:r?me(i,`Buyer ${a+1} amount`):0n,minOut:l[`${t}ponsBuyerMinOut${a}`].value.trim()}})}function Mc(e){const t=new Set;for(const n of e.filter(a=>a.enabled)){if(!Y(n.recipient)||n.recipient===he)throw new Error(`Buyer ${n.index+1} has an invalid recipient address.`);const a=n.recipient.toLowerCase();if(t.has(a))throw new Error(`Duplicate buyer recipient: ${n.recipient}`);if(t.add(a),n.amount<0n)throw new Error(`Buyer ${n.index+1} amount is invalid.`);if(n.index>0&&n.amount>0n&&!n.minOut)throw new Error(`Buyer ${n.index+1} needs a minimum token output. Do not use zero in production.`)}}function Dc(e,t){const n={tokenIn:e.launchConfig.pairToken,tokenOut:e.launchedToken||e.predictedToken,fee:e.dexConfig.poolFee,recipient:t.recipient,amountIn:t.amount,amountOutMinimum:Me(t.minOut,18,`Buyer ${t.index+1} minimum token output`),sqrtPriceLimitX96:0n};return e.launchConfig.routerRequiresDeadline?{...n,deadline:BigInt(Oe("20"))}:n}function zt(e){return new _(Ue.launchContract,ur,e)}function Fc(e,t,n){var o;const r=((o=n??pr.launchConfig)==null?void 0:o.routerRequiresDeadline)?[Re[1]]:[Re[0]];return new _(e.swapRouter,r,t)}async function it(){if(!y.provider||!y.signer)throw new Error("Connect primary wallet first.");const e=await y.provider.getNetwork();if(e.chainId!==BigInt(Ue.id))throw new Error(`Wrong network. Expected ${Ue.name} chain ${Ue.id}, connected to ${e.chainId}.`)}function Oc(e){const t=new wt(ur);for(const n of e)if(n.address.toLowerCase()===Ue.launchContract.toLowerCase())try{const a=t.parseLog(n);if((a==null?void 0:a.name)==="TokenLaunched")return{token:a.args.token,pool:a.args.pool,restrictionsEndBlock:a.args.restrictionsEndBlock,initialBuyAmount:a.args.initialBuyAmount}}catch{}return null}async function Wc(e,t,n=""){let a=BigInt(await y.provider.getBlockNumber());for(;a<=e;)t(`Waiting for restricted launch window to pass. Current block ${a}, need > ${e}.`),await qt(5e3),a=BigInt(await y.provider.getBlockNumber()),l[`${n}ponsCurrentBlock`].value=String(a)}async function yo(e,t){var r;const n=new Set,a=[];for(let o=0;o<t;o+=1){if(!((r=l[`${e}BuyerEnabled${o}`])!=null&&r.checked))continue;const s=l[`${e}BuyerKey${o}`].value.trim(),i=s.startsWith("0x")?s:`0x${s}`;if(!/^0x[0-9a-fA-F]{64}$/.test(i))throw new Error(`${e} buyer ${o+1} private key must be a 64-character hex string.`);const c=new K(i,y.provider);if(n.has(c.address.toLowerCase()))throw new Error(`Duplicate ${e} buyer wallet ${c.address}.`);n.add(c.address.toLowerCase());const u=l[`${e}BuyerAddress${o}`].value.trim()||c.address;if(!Y(u))throw new Error(`${e} buyer ${o+1} recipient is invalid.`);const d=me(l[`${e}BuyerAmount${o}`].value,`${e} buyer ${o+1} amount`),b=l[`${e}BuyerMinOut${o}`].value.trim();if(d===0n||!b)throw new Error(`${e} buyer ${o+1} amount and minimum output must be set.`);const f=await y.provider.getBalance(c.address);if(l[`${e}BuyerBalance${o}`].value=`${W(f)} ETH`,f<d)throw new Error(`${e} buyer ${o+1} lacks ETH for its own purchase.`);a.push({index:o,wallet:c,recipient:u,amount:d,minOut:b})}return a}async function _c(e,t,n,a,r,o){const i=await new _(t.factory,br,e).getPool(n,a,t.poolFee);if(!i||i===he)throw new Error("No Uniswap V3 pool found yet for this token/pair — it may not be launched, or has no liquidity.");const c=new _(i,Pa,e),[u,d,b]=await Promise.all([c.slot0(),c.liquidity(),c.token0()]),f=b.toLowerCase()===n.toLowerCase(),p=2n**96n,h=10n**27n;let m=u.sqrtPriceX96*h/p;const v=d,g=Number(X(r,18)),$=[];for(const{label:M,ethIn:D}of o){let I;if(f){const V=m+D*h/v,F=h*h/m,k=h*h/V;I=v*(F-k)/h,m=V}else{const F=h*h/m+D*h/v,k=h*h/F;I=v*(m-k)/h,m=k}const H=Number(I)/1e18;$.push({label:M,ethIn:Number(W(D)),tokensOut:H,pctOfSupply:g>0?H/g*100:0})}const T=Number(m)/Number(h),S=T*T,E=f?S:1/S,L=E*g;return{rows:$,marketCapInPairUnits:L,priceOfTokenInPairUnits:E,poolAddress:i}}async function Nc(e,t,n,a=""){var s;const r=ot(a),o=document.querySelector(`#${n}`);try{se(),await it();const i=await yo(e,t);for(const d of i)(s=l[`${e}BuyerAddress${d.index}`]).value||(s.value=d.wallet.address),l[`${e}BuyerStatus${d.index}`].value="Ready, waiting on launch";const c=[`Enabled wallets: ${i.length}`,`Wallets: ${i.map(d=>R(d.wallet.address)).join(", ")||"none"}`,`Total spend: ${W(i.reduce((d,b)=>d+b.amount,0n))} ETH from buyer wallet balances`,"Execution: fires after Pons launch confirms and restrictionEndBlock passes; each wallet broadcasts its own router buy in parallel.","Atomic: no. Same-block inclusion is not guaranteed, and PonsLauncherToken rejects any buy before restrictions lift regardless of caller."],u=r.launchedToken||r.predictedToken;if(i.length>0&&u&&r.dexConfig&&r.launchConfig)try{const d=await _c(y.provider,r.dexConfig,u,r.launchConfig.pairToken,Be("1000000000",18),i.map(f=>({label:`Wallet ${f.index+1} (${R(f.wallet.address)})`,ethIn:f.amount})));c.push(""),c.push("--- Buy preview (live pool, sequential — each wallet's price reflects prior wallets already buying) ---");let b=0;for(const f of d.rows)b+=f.pctOfSupply,c.push(`${f.label}: ${f.ethIn} ETH -> ${P(f.tokensOut)} tokens (${f.pctOfSupply.toFixed(2)}% of supply, ${b.toFixed(2)}% cumulative)`);c.push(`Projected market cap after all buys: ${P(d.marketCapInPairUnits)} ETH (${P(d.priceOfTokenInPairUnits)} ETH per token)`),c.push("Model assumes constant pool liquidity across the whole sequence (single active tick range) — treat later wallets as an optimistic lower bound, not a guarantee.")}catch(d){c.push(""),c.push(`Buy preview unavailable: ${A(d)}`)}o.textContent=c.join(`
`),w(`Pons ${e} review OK. ${i.length} wallet(s) ready.`)}catch(i){o.textContent=A(i),w(`Pons ${e} review failed: ${A(i)}`)}}async function Un(e,t,n,a=""){const r=ot(a);se(),await it();const o=await yo(e,t);if(!r.launchedToken)throw new Error("No launched Pons token detected yet. Run Execute Launch Flow first.");if(!o.length)return n(`${e}: no wallets enabled. Nothing to do.`),{submitted:0,confirmed:0};const s={dexConfig:r.dexConfig,launchConfig:r.launchConfig,predictedToken:r.launchedToken,launchedToken:r.launchedToken};r.restrictionsEndBlock>0n&&await Wc(r.restrictionsEndBlock,n,a),await qt(Ni);const i=new _(r.launchedToken,mn,y.provider),c=await i.decimals();n(`Preparing ${o.length} ${e} buy transaction(s)...`);const u=await Promise.allSettled(o.map(async p=>{const h=Fc(s.dexConfig,p.wallet,s.launchConfig),m=Dc(s,p);let v;for(let g=1;g<=s0;g+=1)try{const $=await h.exactInputSingle.estimateGas(m,{value:p.amount});l[`${e}BuyerGas${p.index}`].value=`${$}`;const T=await h.exactInputSingle(m,{value:p.amount,gasLimit:$*125n/100n});return l[`${e}BuyerHash${p.index}`].value=T.hash,l[`${e}BuyerStatus${p.index}`].value="Submitted",{buyer:p,tx:T}}catch($){v=$,g<s0&&(n(`${e} buyer ${p.index+1} attempt ${g} failed (${A($)}), retrying...`),await qt(qi))}throw v})),d=[];for(const[p,h]of u.entries()){const m=o[p];h.status==="fulfilled"?(d.push(h.value),n(`${e} buyer ${m.index+1} submitted: ${xo(h.value.tx.hash)}`)):(l[`${e}BuyerStatus${m.index}`].value="Submit failed",n(`${e} buyer ${m.index+1} submit failed: ${A(h.reason)}`))}n(`Waiting for ${d.length} submitted ${e} receipt(s)...`);const b=await Promise.allSettled(d.map(async p=>{const h=await p.tx.wait(),m=await i.balanceOf(p.buyer.recipient);return{...p,receipt:h,received:m}}));let f=0;for(const[p,h]of b.entries()){const m=d[p].buyer;if(h.status==="fulfilled"){const{receipt:v,received:g}=h.value,$=v.status===1;$&&(f+=1),l[`${e}BuyerStatus${m.index}`].value=$?`Confirmed block ${v.blockNumber}`:"Reverted",l[`${e}BuyerReceived${m.index}`].value=X(g,c),n(`${e} buyer ${m.index+1} ${$?"confirmed":"reverted"} in block ${v.blockNumber}.`)}else l[`${e}BuyerStatus${m.index}`].value="Receipt wait failed",n(`${e} buyer ${m.index+1} receipt wait failed: ${A(h.reason)}`)}return n(`${e} complete.`),{submitted:d.length,confirmed:f}}function qc(){var n;const e=[],t=new Set;for(let a=0;a<25;a+=1){if(!((n=l[`multiBurstBuyerEnabled${a}`])!=null&&n.checked))continue;const r=l[`multiBurstBuyerKey${a}`].value.trim(),o=r.startsWith("0x")?r:`0x${r}`;if(!/^0x[0-9a-fA-F]{64}$/.test(o))throw new Error(`Multi Burst buyer ${a+1} private key must be a 64-character hex string.`);const s=new K(o,te());if(t.has(s.address.toLowerCase()))throw new Error(`Duplicate Multi Burst buyer wallet ${s.address}.`);t.add(s.address.toLowerCase());const i=l[`multiBurstBuyerAddress${a}`].value.trim()||s.address;if(!Y(i))throw new Error(`Multi Burst buyer ${a+1} recipient is invalid.`);const c=me(l[`multiBurstBuyerAmount${a}`].value,`Multi Burst buyer ${a+1} amount`);if(c===0n)throw new Error(`Multi Burst buyer ${a+1} amount must be greater than zero.`);e.push({index:a,wallet:s,recipient:i,amount:c})}return e}async function Hc(){const e=document.querySelector("#multiBurstResult"),t=l.multiBurstTokenAddress.value.trim();if(!Y(t)){e.textContent="Enter a valid token contract address.";return}e.textContent="Checking pool...";const n=te(),a=await st(n,$e(),t);if(!a.exists){e.textContent=`No pool found for this token. ${a.error||"Add liquidity first (LP tab)."}`;return}e.textContent=a.version==="v3"?`V3 pool found at ${R(a.poolAddress)} (fee ${a.poolFee}). Ready to buy.`:`V2 pool found at ${R(a.pairAddress)} — ${P(a.wethReserve)} WETH / ${P(a.tokenReserve)} token reserves. Ready to buy.`,w(`Multi Burst: pool check for ${R(t)} — ${a.version==="v3"?"V3":"V2"} pool found.`)}async function Uc(){const e=document.querySelector("#multiBurstResult");try{const t=l.multiBurstTokenAddress.value.trim();if(!Y(t))throw new Error("Enter a valid token contract address.");const n=qc();if(n.length===0){e.textContent="No wallets enabled. Nothing to do.";return}const a=te(),r=$e();e.textContent="Checking pool...";const o=await st(a,r,t);if(!o.exists){e.textContent=`No pool found for this token. ${o.error||"Add liquidity first (LP tab)."}`;return}const s=parseFloat(l.multiBurstSlippage.value)||25,i=new _(t,ue.abi,a);let c=18;try{c=Number(await i.decimals())}catch{}w(`Multi Burst: buying ${R(t)} with ${n.length} wallet(s) via ${o.version==="v3"?"V3":"V2"} pool.`),e.textContent=`Preparing ${n.length} buy transaction(s)...`;const u=await Promise.allSettled(n.map(async f=>{let p;if(o.version==="v3"){const m=new _(o.swapRouter,[Re[0]],f.wallet),v=await kt(o.poolAddress,!o.isToken0,f.amount,f.wallet.provider),g=Fe(v,s),$={tokenIn:o.wethAddress,tokenOut:t,fee:o.poolFee,recipient:f.recipient,amountIn:f.amount,amountOutMinimum:g,sqrtPriceLimitX96:0n},T=await m.exactInputSingle($,{value:f.amount});p=T.hash,l[`multiBurstBuyerHash${f.index}`].value=T.hash,l[`multiBurstBuyerStatus${f.index}`].value="Submitted",await T.wait()}else{const m=new _(r,we,f.wallet),g=[await m.WETH(),t],$=await xn(r,g,f.amount,f.wallet.provider),T=Fe($,s),S=await m.swapExactETHForTokensSupportingFeeOnTransferTokens(T,g,f.recipient,Oe("20"),{value:f.amount});p=S.hash,l[`multiBurstBuyerHash${f.index}`].value=S.hash,l[`multiBurstBuyerStatus${f.index}`].value="Submitted",await S.wait()}const h=await i.balanceOf(f.recipient);return l[`multiBurstBuyerReceived${f.index}`].value=X(h,c),l[`multiBurstBuyerStatus${f.index}`].value="Confirmed",{buyer:f,hash:p}}));let d=0;const b=[];for(const[f,p]of u.entries()){const h=n[f];p.status==="fulfilled"?(d++,b.push(`Buyer ${h.index+1} confirmed: ${p.value.hash}`)):(l[`multiBurstBuyerStatus${h.index}`].value="Failed",b.push(`Buyer ${h.index+1} failed: ${A(p.reason)}`))}e.textContent=`${d}/${n.length} confirmed.
${b.join(`
`)}`,w(`Multi Burst: ${d}/${n.length} wallet(s) confirmed.`)}catch(t){e.textContent=A(t),w(`Multi Burst failed: ${A(t)}`)}}async function jc(){const e=document.querySelector("#washPoolResult"),t=l.washTokenAddress.value.trim();if(!Y(t)){e.textContent="Enter a valid token contract address.";return}e.textContent="Checking pool...";const n=te(),a=await st(n,$e(),t);if(!a.exists){e.textContent=`No pool found for this token. ${a.error||"Add liquidity first (LP tab)."}`;return}e.textContent=a.version==="v3"?`V3 pool found at ${R(a.poolAddress)} (fee ${a.poolFee}). Ready to buy/sell.`:`V2 pool found at ${R(a.pairAddress)} — ${P(a.wethReserve)} WETH / ${P(a.tokenReserve)} token reserves. Ready to buy/sell.`,w(`Wallet Wash: pool check for ${R(t)} — ${a.version==="v3"?"V3":"V2"} pool found.`)}async function Jn(e,t,n="washBuyResult"){var r;const a=document.querySelector(`#${n}`);try{const o=l.washTokenAddress.value.trim();if(!Y(o))throw new Error("Enter a valid token contract address.");const s=t??l.washBuyKey.value.trim();if(!s)throw new Error("Enter Wallet B's private key.");const i=e??me(((r=l.washBuyAmount)==null?void 0:r.value)||"0","ETH amount to spend");if(i===0n)throw new Error("ETH amount must be greater than zero.");const c=parseFloat(l.washSlippage.value)||25,u=te(),d=new K(s.startsWith("0x")?s:`0x${s}`,u),b=d.address,f=$e();a.textContent="Checking pool...";const p=await st(u,f,o);if(!p.exists){a.textContent=`No pool found for this token. ${p.error||"Add liquidity first (LP tab)."}`;return}a.textContent="Submitting buy...",w(`Wallet Wash: buying ${R(o)} with ${R(d.address)} for ${W(i)} ETH via ${p.version==="v3"?"V3":"V2"} pool.`);let h;if(p.version==="v3"){const T=new _(p.swapRouter,[Re[0]],d),S=await kt(p.poolAddress,!p.isToken0,i,u),E=Fe(S,c),L={tokenIn:p.wethAddress,tokenOut:o,fee:p.poolFee,recipient:b,amountIn:i,amountOutMinimum:E,sqrtPriceLimitX96:0n};h=await T.exactInputSingle(L,{value:i})}else{const T=new _(f,we,d),E=[await T.WETH(),o],L=await xn(f,E,i,u),M=Fe(L,c);h=await T.swapExactETHForTokensSupportingFeeOnTransferTokens(M,E,b,Oe("20"),{value:i})}a.textContent=`Buy submitted: ${h.hash}`,w(`Wallet Wash buy submitted: ${h.hash}`);const m=await h.wait(),v=new _(o,ue.abi,u);let g=18;try{g=Number(await v.decimals())}catch{}const $=await v.balanceOf(b);a.textContent=`Buy confirmed in block ${m.blockNumber}: ${h.hash}
Token balance now: ${X($,g)}`,w(`Wallet Wash buy confirmed in block ${m.blockNumber}.`)}catch(o){a.textContent=A(o),w(`Wallet Wash buy failed: ${A(o)}`)}}function Kc(e,t,n,a,r,o,s){if(e.version==="v3"){const c=new _(e.swapRouter,[Re[0]],a),u={tokenIn:t,tokenOut:e.wethAddress,fee:e.poolFee,recipient:o,amountIn:r,amountOutMinimum:s,sqrtPriceLimitX96:0n};return{call:()=>c.exactInputSingle(u),staticCall:()=>c.exactInputSingle.staticCall(u)}}const i=new _(n,we,a);return{call:async()=>{const c=await i.WETH();return i.swapExactTokensForETHSupportingFeeOnTransferTokens(r,s,[t,c],o,Oe("20"))},staticCall:async()=>{const c=await i.WETH();return i.swapExactTokensForETHSupportingFeeOnTransferTokens.staticCall(r,s,[t,c],o,Oe("20"))}}}async function Vc(e,t,n,a,r){return e.version==="v3"?kt(e.poolAddress,e.isToken0,a,r):xn(n,[t,await new _(n,we,r).WETH()],a,r)}const ha=20;async function Gc(e,t,n,a,r,o,s,i,c,u){const d=10n**BigInt(Math.max(0,c-6));let b=a,f=a;const p=[];for(;b>0n;){if(p.length>=ha){u(`Stopped after ${ha} chunk(s) as a safety limit — ${X(b,c)} tokens still unsold. Run Sell again to continue with the remainder (the discovered chunk size will need to be re-probed).`);break}const h=f>b?b:f,m=await Vc(o,n,s,h,t),v=Fe(m,i),g=Kc(o,n,s,e,h,r,v);try{await g.staticCall()}catch(T){if(f>d){f=f/2n,u(`Sell of ${X(h,c)} reverted (${T.reason||T.shortMessage||"unknown reason"}) — probing a smaller chunk size (${X(f,c)}).`);continue}throw new Error(`Sell reverted even at a small chunk size (${X(h,c)}): ${T.reason||T.shortMessage||T.message}`)}const $=await g.call();u(`Chunk ${p.length+1}/${ha} submitted (size ${X(f,c)}): ${X(h,c)} tokens — ${$.hash}`),await $.wait(),p.push($.hash),b-=h,u(`Chunk confirmed. Remaining: ${X(b,c)}`)}if(o.version==="v3"&&r.toLowerCase()===e.address.toLowerCase()){const h=new _(o.wethAddress,Ia,e),m=await h.balanceOf(e.address);if(m>0n){u(`Unwrapping ${W(m)} WETH to native ETH...`);const v=await h.withdraw(m);await v.wait(),u(`Unwrapped: ${v.hash}`)}}else o.version==="v3"&&u(`Sold to a custom recipient (${R(r)}) — that address holds WETH, not native ETH. Unwrap it there separately.`);return p}async function Zn(e,t,n="washSellResult"){const a=document.querySelector(`#${n}`),r=[],o=s=>{r.push(s),a.textContent=r.join(`
`),w(`Wallet Wash: ${s}`)};try{const s=l.washTokenAddress.value.trim();if(!Y(s))throw new Error("Enter a valid token contract address.");const i=e??l.washSellKey.value.trim();if(!i)throw new Error("Enter Wallet A's private key.");const c=parseFloat(l.washSlippage.value)||25,u=te(),d=new K(i.startsWith("0x")?i:`0x${i}`,u),b=d.address,f=new _(s,ue.abi,d);let p=18;try{p=Number(await f.decimals())}catch{}const h=t??l.washSellAmount.value.trim(),m=await f.balanceOf(d.address),v=h.toLowerCase()==="all"?m:Be(gt(h,"Token amount to sell"),p);if(v===0n)throw new Error("Token amount to sell must be greater than zero.");if(v>m)throw new Error("Wallet A does not hold enough of this token.");const g=$e();o("Checking pool...");const $=await st(u,g,s);if(!$.exists){a.textContent=`No pool found for this token. ${$.error||"Add liquidity first (LP tab)."}`;return}const T=$.version==="v3"?$.swapRouter:g;if(await f.allowance(d.address,T)<v){o("Approving router...");const L=await f.approve(T,v);o(`Approval submitted ${L.hash}`),await L.wait()}o(`Selling ${X(v,p)} ${R(s)} with ${R(d.address)} via ${$.version==="v3"?"V3":"V2"} pool. If the full amount reverts, this automatically retries in smaller chunks.`);const E=await Gc(d,u,s,v,b,$,g,c,p,o);o(`Sell complete across ${E.length} transaction(s).`)}catch(s){a.textContent=`${a.textContent}
Failed: ${A(s)}`.trim(),w(`Wallet Wash sell failed: ${A(s)}`)}}async function zc(){const e=document.querySelector("#washBothResult"),t=[],n=a=>{t.push(`[${new Date().toLocaleTimeString()}] ${a}`),e.textContent=t.join(`
`),w(`Wallet Wash: ${a}`)};try{const a=l.washSellKey.value.trim();if(!a)throw new Error("Enter Wallet A's private key.");const r=l.washBuyKey.value.trim();if(!r)throw new Error("Enter Wallet B's private key.");const o=Math.max(1,Math.min(6,parseInt(l.washRelayCount.value)||2)),s=Math.max(0,Math.min(90,parseFloat(l.washRelayVariancePct.value)||10)),i=Math.max(0,parseFloat(l.washRelayGasReserve.value)||5e-4),c=l.washRelayDelayRange.value.trim()||"20-90",u=te(),d=new K(a.startsWith("0x")?a:`0x${a}`,u),b=new K(r.startsWith("0x")?r:`0x${r}`,u);if(d.address.toLowerCase()===b.address.toLowerCase())throw new Error("Wallet A and Wallet B must be different wallets — using the same one defeats the point of the relay.");if(n("Step 1/3 — Selling with Wallet A..."),await Zn(),document.querySelector("#washSellResult").textContent.toLowerCase().includes("failed")){e.textContent=`${e.textContent}
Sell failed — see Wallet A result above. Relay and buy were not attempted.`,w("Wallet Wash: sell failed, sequence stopped.");return}const f=Number(W(await u.getBalance(d.address)));if(f<=i)throw new Error(`Wallet A only has ${P(f)} ETH after selling — not enough above the ${i} gas reserve to fund the relay.`);const p=f-i;n(`Step 2/3 — Routing ${P(p)} ETH through ${o} relay wallet(s) to Wallet B (reserving ${i} ETH in Wallet A for its own gas)...`);const h=Array.from({length:o},()=>K.createRandom().connect(u));n(`Generated ${o} disposable relay wallet(s): ${h.map(S=>R(S.address)).join(", ")}`);const m=qn(p,o,s);for(const[S,E]of h.entries()){const L=m[S];if(L<=0)continue;const M=await d.sendTransaction({to:E.address,value:ce(P(L))});n(`  Wallet A → relay ${S+1} (${R(E.address)}): ${P(L)} ETH — ${M.hash}`),await M.wait();const D=xt(c);n(`  waiting ${(D/1e3).toFixed(1)}s...`),await tt(D)}let v=0;for(const[S,E]of h.entries()){const L=Number(W(await u.getBalance(E.address))),M=Math.max(0,L-i);if(M<=0){n(`  relay ${S+1} (${R(E.address)}) has no spendable balance after gas reserve — skipping.`);continue}const D=await E.sendTransaction({to:b.address,value:ce(P(M))});if(n(`  relay ${S+1} → Wallet B: ${P(M)} ETH — ${D.hash}`),await D.wait(),v+=M,S<h.length-1){const I=xt(c);n(`  waiting ${(I/1e3).toFixed(1)}s...`),await tt(I)}}if(v<=0)throw new Error("No ETH reached Wallet B through the relay hop — nothing left to buy with.");const g=Number(W(await u.getBalance(b.address))),$=Math.max(0,g-i);if($<=0)throw new Error(`Wallet B received ${P(g)} ETH, which doesn't leave enough above the ${i} gas reserve to buy with.`);n(`Step 3/3 — Buying with Wallet B using ${P($)} ETH (reserving ${i} ETH of the ${P(g)} received for its own gas)...`),await Jn(ce(P($)));const T=document.querySelector("#washBuyResult").textContent.toLowerCase().includes("failed");n(T?"Buy failed — see Wallet B result above for details.":"Sequence complete: sold with Wallet A, routed through relays, bought with Wallet B."),n(`Relay private keys (for sweeping any leftover dust — these were never saved anywhere): ${h.map(S=>`${R(S.address)}=${S.privateKey}`).join(" | ")}`)}catch(a){e.textContent=`${e.textContent}
Failed: ${A(a)}`.trim(),w(`Wallet Wash sequence failed: ${A(a)}`)}}async function Xc(){const e=document.querySelector("#washCrossChainResult"),t=[],n=a=>{t.push(`[${new Date().toLocaleTimeString()}] ${a}`),e.textContent=t.join(`
`),w(`Wallet Wash (Solana relay): ${a}`)};try{const a=l.washSellKey.value.trim();if(!a)throw new Error("Enter Wallet A's private key.");const r=l.washBuyKey.value.trim();if(!r)throw new Error("Enter Wallet B's private key.");const o=Math.max(0,parseFloat(l.washRelayGasReserve.value)||5e-4),s=Ha(l.washSolanaRpcUrl.value.trim()||"/api/solana-rpc"),i=Math.max(0,parseFloat(l.washSolanaGasReserve.value)||.002);n(`Using Solana RPC: ${s}`);const c=te(),u=new K(a.startsWith("0x")?a:`0x${a}`,c),d=new K(r.startsWith("0x")?r:`0x${r}`,c);if(u.address.toLowerCase()===d.address.toLowerCase())throw new Error("Wallet A and Wallet B must be different wallets — using the same one defeats the point of the relay.");const{generateSolanaKeypair:b,solanaSecretKeyToBase58:f,bridgeEthToSolana:p,bridgeSolanaToEth:h,waitForSolanaBalance:m}=await Wn(async()=>{const{generateSolanaKeypair:O,solanaSecretKeyToBase58:ae,bridgeEthToSolana:z,bridgeSolanaToEth:Z,waitForSolanaBalance:be}=await import("./cross-chain-relay-BqsCvfte.js").then(fe=>fe.k);return{generateSolanaKeypair:O,solanaSecretKeyToBase58:ae,bridgeEthToSolana:z,bridgeSolanaToEth:Z,waitForSolanaBalance:be}},__vite__mapDeps([0,1,2])),{Connection:v}=await Wn(async()=>{const{Connection:O}=await import("./index.browser.esm-YdP9aFGL.js").then(ae=>ae.i);return{Connection:O}},[]);if(n("Step 1/4 — Selling with Wallet A..."),await Zn(),document.querySelector("#washSellResult").textContent.toLowerCase().includes("failed")){e.textContent=`${e.textContent}
Sell failed — see Wallet A result above. Relay and buy were not attempted.`,w("Wallet Wash (Solana relay): sell failed, sequence stopped.");return}const g=Number(W(await c.getBalance(u.address)));if(g<=o)throw new Error(`Wallet A only has ${P(g)} ETH after selling — not enough above the ${o} gas reserve to bridge.`);const $=g-o,T=ce(P($)),S=b(),E=S.publicKey.toBase58();n(`Generated disposable Solana relay wallet: ${E}`);try{const O=await ve("/api/wallets/save",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chain:"solana",privateKeys:[f(S)],label:"wash-relay (solana): cross-chain pair"}),credentials:"same-origin"});O.ok?n("  saved Solana relay wallet to the wallet vault (Disperse tab)."):n(`  could not save Solana relay wallet to the vault (continuing anyway): ${(await O.json()).error||O.statusText}`)}catch(O){n(`  could not save Solana relay wallet to the vault (continuing anyway): ${A(O)}`)}n(`Step 2/4 — Bridging ${P($)} ETH from Wallet A to ${R(E)} on Solana via Relay Protocol...`),await p({evmWallet:u,solanaKeypair:S,amountWei:T,solanaRpcUrl:s,onProgress:O=>{var z,Z;const ae=(Z=(z=O==null?void 0:O.txHashes)==null?void 0:z.at(-1))==null?void 0:Z.txHash;ae&&n(`  bridge tx: ${ae}`)}}),n("  bridge to Solana confirmed — waiting for the destination-side SOL to actually land (Relay's solver delivers this on its own schedule, a few seconds to a couple minutes after the deposit confirms)...");const L=new v(s,"confirmed"),M=Math.round(i*1e9),D=await m(L,S.publicKey,{minLamports:M+1,onPoll:O=>n(`  Solana relay wallet balance so far: ${O/1e9} SOL...`)}),I=D/1e9;n(`  Solana relay wallet balance: ${I} SOL`);const H=D-M;if(H<=0)throw new Error(`Solana relay wallet only received ${I} SOL after waiting — not enough above the ${i} SOL fee reserve to bridge back. It may still be in flight; check ${E} on solscan.io before retrying.`);n(`Step 3/4 — Bridging ${H/1e9} SOL from Solana back to Wallet B on Robinhood Chain...`),await h({solanaKeypair:S,evmRecipientAddress:d.address,amountLamports:H,solanaRpcUrl:s,onProgress:O=>{var z,Z;const ae=(Z=(z=O==null?void 0:O.txHashes)==null?void 0:z.at(-1))==null?void 0:Z.txHash;ae&&n(`  bridge tx: ${ae}`)}}),n("  bridge back to Robinhood Chain confirmed.");const V=Number(W(await c.getBalance(d.address))),F=Math.max(0,V-o);if(F<=0)throw new Error(`Wallet B received ${P(V)} ETH, which doesn't leave enough above the ${o} gas reserve to buy with.`);n(`Step 4/4 — Buying with Wallet B using ${P(F)} ETH...`),await Jn(ce(P(F)));const k=document.querySelector("#washBuyResult").textContent.toLowerCase().includes("failed");n(k?"Buy failed — see Wallet B result above for details.":"Sequence complete: sold with Wallet A, bridged through Solana, bridged back, bought with Wallet B."),n(`Solana relay secret key (base58, for sweeping any leftover dust — also saved to the wallet vault above): ${f(S)}`)}catch(a){e.textContent=`${e.textContent}
Failed: ${A(a)}`.trim(),w(`Wallet Wash cross-chain sequence failed: ${A(a)}`)}}async function Yc(e,t,n,a,r,o,s,i){const c=document.querySelector(`#${s}`),u=d=>{c.textContent=`${c.textContent}
[${new Date().toLocaleTimeString()}] ${d}`.trim(),w(`Wallet Wash (Solana relay) ${i}: ${d}`)};try{u(`Using Solana RPC: ${r}`);const d=te(),b=new K(e.startsWith("0x")?e:`0x${e}`,d),f=new K(t.startsWith("0x")?t:`0x${t}`,d);if(b.address.toLowerCase()===f.address.toLowerCase())throw new Error("Sell and buy wallets must be different — using the same one defeats the point of the relay.");const{generateSolanaKeypair:p,solanaSecretKeyToBase58:h,bridgeEthToSolana:m,bridgeSolanaToEth:v,waitForSolanaBalance:g}=await Wn(async()=>{const{generateSolanaKeypair:z,solanaSecretKeyToBase58:Z,bridgeEthToSolana:be,bridgeSolanaToEth:fe,waitForSolanaBalance:Ve}=await import("./cross-chain-relay-BqsCvfte.js").then(Ge=>Ge.k);return{generateSolanaKeypair:z,solanaSecretKeyToBase58:Z,bridgeEthToSolana:be,bridgeSolanaToEth:fe,waitForSolanaBalance:Ve}},__vite__mapDeps([0,1,2])),{Connection:$}=await Wn(async()=>{const{Connection:z}=await import("./index.browser.esm-YdP9aFGL.js").then(Z=>Z.i);return{Connection:z}},[]);if(u(`Step 1/4 — Selling with ${R(b.address)}...`),await Zn(e,n,s),c.textContent.toLowerCase().includes("failed"))return u("Sell failed. Bridge and buy were not attempted for this pair."),{ok:!1,summary:`${i}: sell failed`};const T=Number(W(await d.getBalance(b.address)));if(T<=a)throw new Error(`Sell wallet only has ${P(T)} ETH after selling — not enough above the ${a} gas reserve to bridge.`);const S=T-a,E=ce(P(S)),L=p(),M=L.publicKey.toBase58();u(`Generated disposable Solana relay wallet: ${M}`);try{const z=await ve("/api/wallets/save",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chain:"solana",privateKeys:[h(L)],label:`wash-relay (solana): ${i}`}),credentials:"same-origin"});z.ok?u("  saved Solana relay wallet to the wallet vault (Disperse tab)."):u(`  could not save Solana relay wallet to the vault (continuing anyway): ${(await z.json()).error||z.statusText}`)}catch(z){u(`  could not save Solana relay wallet to the vault (continuing anyway): ${A(z)}`)}u(`Step 2/4 — Bridging ${P(S)} ETH to ${R(M)} on Solana...`),await m({evmWallet:b,solanaKeypair:L,amountWei:E,solanaRpcUrl:r,onProgress:z=>{var be,fe;const Z=(fe=(be=z==null?void 0:z.txHashes)==null?void 0:be.at(-1))==null?void 0:fe.txHash;Z&&u(`  bridge tx: ${Z}`)}}),u("  bridge to Solana confirmed — waiting for the destination-side SOL to actually land...");const D=new $(r,"confirmed"),I=Math.round(o*1e9),H=await g(D,L.publicKey,{minLamports:I+1,onPoll:z=>u(`  Solana relay wallet balance so far: ${z/1e9} SOL...`)}),V=H/1e9;u(`  Solana relay wallet balance: ${V} SOL`);const F=H-I;if(F<=0)throw new Error(`Solana relay wallet only received ${V} SOL after waiting — not enough above the ${o} SOL fee reserve to bridge back. It may still be in flight; check ${M} on solscan.io before retrying.`);u(`Step 3/4 — Bridging ${F/1e9} SOL back to ${R(f.address)}...`),await v({solanaKeypair:L,evmRecipientAddress:f.address,amountLamports:F,solanaRpcUrl:r,onProgress:z=>{var be,fe;const Z=(fe=(be=z==null?void 0:z.txHashes)==null?void 0:be.at(-1))==null?void 0:fe.txHash;Z&&u(`  bridge tx: ${Z}`)}}),u("  bridge back to Robinhood Chain confirmed.");const k=Number(W(await d.getBalance(f.address))),O=Math.max(0,k-a);if(O<=0)throw new Error(`Buy wallet received ${P(k)} ETH, not enough above the ${a} gas reserve to buy with.`);u(`Step 4/4 — Buying with ${R(f.address)} using ${P(O)} ETH...`),await Jn(ce(P(O)),t,s);const ae=c.textContent.toLowerCase().includes("failed");return u(ae?"Buy failed.":"Pair complete (via Solana relay)."),u(`Solana relay secret key (also saved to the vault above): ${h(L)}`),{ok:!ae,summary:`${i}: ${ae?"buy failed":"OK (Solana relay)"}`}}catch(d){return u(`Failed: ${A(d)}`),{ok:!1,summary:`${i}: ${A(d)}`}}}async function Jc(e,t){const n=await ve("/api/wallets/save",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({privateKeys:e.map(r=>r.privateKey),label:`wash-relay: ${t}`}),credentials:"same-origin"}),a=await n.json();if(!n.ok)throw new Error(a.error||"Wallet save failed.");return a.wallets}async function Zc(e,t,n,a,r,o,s,i,c){const u=document.querySelector(`#${i}`),d=b=>{u.textContent=`${u.textContent}
[${new Date().toLocaleTimeString()}] ${b}`.trim(),w(`Wallet Wash ${c}: ${b}`)};try{const b=te(),f=new K(e.startsWith("0x")?e:`0x${e}`,b),p=new K(t.startsWith("0x")?t:`0x${t}`,b);if(f.address.toLowerCase()===p.address.toLowerCase())throw new Error("Sell and buy wallets must be different — using the same one defeats the point of the relay.");if(d(`Step 1/3 — Selling with ${R(f.address)}...`),await Zn(e,n,i),u.textContent.toLowerCase().includes("failed"))return d("Sell failed. Relay and buy were not attempted for this pair."),{ok:!1,summary:`${c}: sell failed`};const h=Number(W(await b.getBalance(f.address)));if(h<=o)throw new Error(`Sell wallet only has ${P(h)} ETH after selling — not enough above the ${o} gas reserve to fund the relay.`);const m=h-o;d(`Step 2/3 — Routing ${P(m)} ETH through ${a} relay wallet(s)...`);const v=Array.from({length:a},()=>K.createRandom().connect(b));try{await Jc(v,c),d(`  saved ${v.length} relay wallet(s) to the wallet vault (Disperse tab).`)}catch(L){d(`  could not save relay wallets to the vault (continuing anyway): ${A(L)}`)}const g=qn(m,a,r);for(const[L,M]of v.entries()){const D=g[L];if(D<=0)continue;const I=await f.sendTransaction({to:M.address,value:ce(P(D))});d(`  sell wallet → relay ${L+1}: ${P(D)} ETH — ${I.hash}`),await I.wait(),await tt(xt(s))}let $=0;for(const[L,M]of v.entries()){const D=Number(W(await b.getBalance(M.address))),I=Math.max(0,D-o);if(I<=0)continue;const H=await M.sendTransaction({to:p.address,value:ce(P(I))});d(`  relay ${L+1} → buy wallet: ${P(I)} ETH — ${H.hash}`),await H.wait(),$+=I,L<v.length-1&&await tt(xt(s))}if($<=0)throw new Error("No ETH reached the buy wallet through the relay hop.");const T=Number(W(await b.getBalance(p.address))),S=Math.max(0,T-o);if(S<=0)throw new Error(`Buy wallet received ${P(T)} ETH, not enough above the ${o} gas reserve to buy with.`);d(`Step 3/3 — Buying with ${R(p.address)} using ${P(S)} ETH...`),await Jn(ce(P(S)),t,i);const E=u.textContent.toLowerCase().includes("failed");return d(E?"Buy failed.":"Pair complete."),d(`Relay keys (sweep any dust; never saved): ${v.map(L=>`${R(L.address)}=${L.privateKey}`).join(" | ")}`),{ok:!E,summary:`${c}: ${E?"buy failed":"OK"}`}}catch(b){return d(`Failed: ${A(b)}`),{ok:!1,summary:`${c}: ${A(b)}`}}}async function jn(e="#washBatchResult",t=null){const n=e.replace(/^#/,"");t===null&&(t=n.endsWith("washBatchResult")?n.replace(/washBatchResult$/,""):"");const a=T=>l[`${t}${T}`]??l[T],r=document.querySelector(e),o=l.washTokenAddress.value.trim();if(!Y(o)){r.textContent="Enter a valid token contract address in the Token card above.";return}const s=Ke(a("washBatchSellKeys").value),i=Ke(a("washBatchBuyKeys").value);if(s.length===0||i.length===0){r.textContent="Paste at least one sell wallet and one buy wallet.";return}const c=Math.min(s.length,i.length,33);s.length!==i.length&&w(`Wallet Wash batch: ${s.length} sell key(s) and ${i.length} buy key(s) pasted — running ${c} matched pair(s), extra unmatched key(s) ignored.`);const u=Math.max(1,Math.min(6,parseInt(a("washBatchRelayCount").value)||2)),d=Math.max(0,Math.min(90,parseFloat(a("washBatchVariancePct").value)||10)),b=Math.max(0,parseFloat(a("washBatchGasReserve").value)||5e-4),f=a("washBatchDelayRange").value.trim()||"20-90",p=a("washBatchUseCrossChain").checked,h=Ha(a("washBatchSolanaRpcUrl").value.trim()||"/api/solana-rpc"),m=Math.max(0,parseFloat(a("washBatchSolanaGasReserve").value)||.002),v=Array(c).fill("all"),g=T=>{r.textContent=`${r.textContent}
[${new Date().toLocaleTimeString()}] ${T}`.trim()};g(`Starting batch wash: ${c} pair(s), one after another.`);let $=0;for(let T=0;T<c;T+=1){const S=`Pair ${T+1}/${c}`;g(`${S}: starting${p?" via Solana relay":""} (sell ${R(new K(s[T]).address)} → buy ${R(new K(i[T]).address)})...`);const E=p?await Yc(s[T],i[T],v[T],b,h,m,n,S):await Zc(s[T],i[T],v[T],u,d,b,f,n,S);if(E.ok&&$++,g(E.summary),T<c-1){const L=xt(f);g(`Waiting ${(L/1e3).toFixed(1)}s before the next pair...`),await tt(L)}}g(`Batch wash complete: ${$}/${c} pair(s) succeeded.`),w(`Wallet Wash batch: ${$}/${c} pair(s) succeeded.`)}function Qc(e='[data-tab-panel="pons"]'){for(const t of document.querySelectorAll(`${e} .buyer-row.has-issue`))t.classList.remove("has-issue")}function ed(e,t){const n=document.querySelector(`#${e}BuyerEnabled${t}`)||document.querySelector(`#${e}BuyerKey${t}`),a=n==null?void 0:n.closest(".buyer-row");a&&a.classList.add("has-issue")}function td(e,t){var r;const n=[],a=new Set;for(let o=0;o<t;o+=1){if(!((r=l[`${e}BuyerEnabled${o}`])!=null&&r.checked))continue;const s=`${e} wallet ${o+1}`;let i=!1;const c=l[`${e}BuyerKey${o}`].value.trim(),u=c.startsWith("0x")?c:`0x${c}`;if(!/^0x[0-9a-fA-F]{64}$/.test(u))n.push(`${s}: private key must be a 64-character hex string.`),i=!0;else try{const f=new K(u).address.toLowerCase();a.has(f)&&(n.push(`${s}: duplicate wallet address, already used in this section.`),i=!0),a.add(f)}catch{n.push(`${s}: private key is invalid.`),i=!0}const d=l[`${e}BuyerAddress${o}`].value.trim();d&&!Y(d)&&(n.push(`${s}: recipient address is invalid.`),i=!0);const b=l[`${e}BuyerAmount${o}`].value.trim();(!b||parseFloat(b)<=0)&&(n.push(`${s}: native amount to spend must be greater than zero.`),i=!0),l[`${e}BuyerMinOut${o}`]&&!l[`${e}BuyerMinOut${o}`].value.trim()&&(n.push(`${s}: minimum token output is required.`),i=!0),i&&ed(e,o)}return n}async function ga(e=""){const t=document.querySelector(`#${e}ponsAllResult`),n=[],a=i=>{n.push(`[${new Date().toLocaleTimeString()}] ${i}`),t.textContent=n.join(`
`)};Qc(e?'[data-tab-panel="ponsWash"]':'[data-tab-panel="pons"]');const r=[];a("Validating launch, Fast Lane, and Burst..."),await Pc(e);const o=document.querySelector(`#${e}ponsReviewResult`).textContent.toLowerCase().includes("failed");a(o?"Launch validation FAILED — see Review section above for details.":"Launch validation OK — see Review section above for the full simulation."),o&&r.push("Launch: "+document.querySelector(`#${e}ponsReviewResult`).textContent);const s=[{prefix:`${e}ponsFastLane`,count:5,resultId:`${e}ponsFastLaneReviewResult`,label:"Fast Lane"},...et.map(({prefix:i,label:c})=>({prefix:`${e}${i}`,count:je,resultId:`${e}${i}ReviewResult`,label:c}))];for(const{prefix:i,count:c,resultId:u,label:d}of s){const b=td(i,c);if(r.push(...b),b.length===0){await Nc(i,c,u,e);const f=document.querySelector(`#${u}`).textContent.toLowerCase().includes("failed");a(f?`${d} validation FAILED — see ${d} section above for details.`:`${d} validation OK — see ${d} section above for wallet count, spend, and buy preview.`),f&&r.push(`${d}: ${document.querySelector(`#${u}`).textContent}`)}else a(`${d}: ${b.length} wallet row(s) have issues — flagged in red below, listed in the summary.`)}r.length>0?(t.textContent=`⚠ ${r.length} issue(s) found:
${r.map(i=>`- ${i}`).join(`
`)}

${n.join(`
`)}`,w(`Pons: Validate All found ${r.length} issue(s).`)):(a("All validations complete — no issues found. Review each section's own result panel for full detail before executing."),w("Pons: Validate All complete, no issues."))}async function g0(e=""){var o;const t=ot(e),n=document.querySelector(`#${e}ponsAllResult`),a=[],r=s=>{a.push(`[${new Date().toLocaleTimeString()}] ${s}`),n.textContent=a.join(`
`),w(`Pons all: ${s}`)};if(!window.confirm("Execute All will launch the token, then automatically wait for restrictions to lift and fire Fast Lane and Burst — no further confirmation prompts. Continue?")){r("Execute All cancelled before starting.");return}try{r("Step 1/3 — Launching token..."),await ho(r,e),r("Step 2/3 — Running Fast Lane...");const s=await Un(`${e}ponsFastLane`,5,r,e);r(`Fast Lane done: ${s.confirmed}/${s.submitted} confirmed.`),r("Step 3/3 — Running Burst sections...");let i=0,c=0;for(const{prefix:u,label:d}of et){const b=await Un(`${e}${u}`,je,r,e);r(`${d} done: ${b.confirmed}/${b.submitted} confirmed.`),i+=b.confirmed,c+=b.submitted}r(`Execute All complete. Token ${t.launchedToken}. Fast Lane ${s.confirmed}/${s.submitted}, Burst ${i}/${c} confirmed.`),e===""&&((o=document.querySelector("#ponsAllThenWash"))!=null&&o.checked)&&await nd(r,t.launchedToken)}catch(s){r(`Execute All stopped: ${A(s)}`),w(`Pons Execute All failed: ${A(s)}`)}}async function nd(e,t){var d,b,f,p,h,m,v,g,$,T;if(!t||!Y(t)){e("Auto-wash skipped: no launched token address.");return}const n=[...Array.from({length:5},(S,E)=>({prefix:"ponsFastLane",index:E})),...et.flatMap(({prefix:S})=>Array.from({length:je},(E,L)=>({prefix:S,index:L})))],a=new Set,r=[];for(const{prefix:S,index:E}of n){if(!((d=l[`${S}BuyerEnabled${E}`])!=null&&d.checked))continue;const L=(((b=l[`${S}BuyerKey${E}`])==null?void 0:b.value)||"").trim(),M=L.startsWith("0x")?L:`0x${L}`;if(!/^0x[0-9a-fA-F]{64}$/.test(M))continue;let D;try{D=new K(M).address.toLowerCase()}catch{continue}a.has(D)||(a.add(D),r.push(M))}if(r.length===0){e("Auto-wash skipped: no bundle wallet keys found in the Fast Lane / Burst rows.");return}e("Auto-wash: fetching Wash Buy wallets from the project vault...");let o=[];try{o=(await vn("wash-buy")).map(E=>E.privateKey)}catch(S){e(`Auto-wash skipped: could not load Wash Buy wallets (${A(S)}).`);return}if(o.length===0){e("Auto-wash skipped: no Wash Buy wallets saved for this project (Wallets tab → Wallet Wash — Buy Wallets).");return}const s=Math.max(0,(parseFloat((f=l.ponsAllWashStartDelay)==null?void 0:f.value)||0)*1e3);s>0&&(e(`Auto-wash: waiting ${(s/1e3).toFixed(0)}s before starting the wash...`),await tt(s)),l.washTokenAddress.value=t,l.washSlippage.value=(((p=l.ponsAllWashSlippage)==null?void 0:p.value)||"25").trim()||"25",l.washBatchSellKeys.value=r.join(`
`),l.washBatchBuyKeys.value=o.join(`
`),l.washBatchRelayCount.value=(((h=l.ponsAllWashRelayCount)==null?void 0:h.value)||"2").trim()||"2",l.washBatchDelayRange.value=(((m=l.ponsAllWashDelayRange)==null?void 0:m.value)||"20-90").trim()||"20-90",l.washBatchVariancePct.value=(((v=l.ponsAllWashVariancePct)==null?void 0:v.value)||"10").trim()||"10",l.washBatchGasReserve.value=(((g=l.ponsAllWashGasReserve)==null?void 0:g.value)||"0.0005").trim()||"0.0005",l.washBatchUseCrossChain.checked=!!(($=document.querySelector("#ponsAllWashUseCrossChain"))!=null&&$.checked),l.washBatchSolanaRpcUrl.value="",l.washBatchSolanaGasReserve.value=(((T=l.ponsAllWashSolanaGasReserve)==null?void 0:T.value)||"0.002").trim()||"0.002";const i=Math.min(r.length,o.length);e(`Auto-wash: running Batch Wash across ${i} pair(s) — full detail below.`);const c=document.querySelector("#ponsAllWashResult");c&&(c.textContent=""),await jn("#ponsAllWashResult","");const u=((c==null?void 0:c.textContent)||"").trim().split(`
`).filter(Boolean).pop()||"Batch Wash finished.";e(`Auto-wash: ${u.replace(/^\[[^\]]*\]\s*/,"")}`)}function wn(e){return e?/^0x[0-9a-fA-F]{64}$/.test(e)?e:Sa(e):Q(He(32))}function Nt(e,t){const n=String(e??"").trim();if(!/^\d+$/.test(n))throw new Error(`${t} must be a non-negative integer.`);return BigInt(n)}function Me(e,t,n){return Be(gt(e,n),t)}function xo(e){return`${Ue.explorerUrl}tx/${e}`}function ma(e){return`${Ue.explorerUrl}address/${e}`}async function vo(){var t;const e=document.querySelector("#lunchContractResult");try{se(),await kn();const n=await y.signer.getAddress(),a=gn(y.signer),r=So(y.signer),o=Eo(j.delegate7702,y.signer);ye.factory=a;const[s,i,c,u,d,b,f,p,h,m,v,g,$,T,S,E,L,M]=await Promise.all([y.provider.getBlockNumber(),y.provider.getBalance(n),a.factory(),a.npm(),a.xToken(),a.feeLocker(),a.launchFeeWei(),a.enforcedSupply(),a.launchTickMagnitude(),a.midBandTicks(),a.band1DepthWei(),a.allTokensLength(),r.owner(),r.launcher(),r.delegateImplementation(),o.coordinator(),o.router(),o.xToken()]);if(T.toLowerCase()!==j.launchContract.toLowerCase())throw new Error("Atomic executor launcher mismatch.");if(S.toLowerCase()!==j.delegate7702.toLowerCase())throw new Error("7702 delegate mismatch.");if(E.toLowerCase()!==j.coordinator7702.toLowerCase())throw new Error("7702 coordinator mismatch.");if(L.toLowerCase()!==j.router.toLowerCase())throw new Error("7702 router mismatch.");if(M.toLowerCase()!==d.toLowerCase())throw new Error("7702 wrapped-native token mismatch.");ye.factoryAddress=c,ye.npm=u,ye.xToken=d,ye.feeLocker=b,ye.launchFee=f,ye.enforcedSupply=p,l.lunchCurrentBlock.value=String(s),l.lunchPrimaryWallet.value=n,l.lunchPrimaryBalance.value=`${W(i)} ETH`,l.lunchLaunchFee.value=`${W(f)} ETH`,l.lunchAtomicOwner.value=$,l.lunchFactory.value=c,l.lunchNpm.value=u,l.lunchXToken.value=d,l.lunchFeeLocker.value=b,l.lunchEnforcedSupply.value=`${X(p,18)} tokens`,l.lunchTickMagnitude.value=String(h),(t=l.lunchBuyerAddress0).value||(t.value=n),l.lunchBuyerBalance0.value=`${W(i)} ETH`,p>0n&&(l.lunchTotalSupply.value=X(p,18)),e.textContent=["Proxy verified on Blockscout: yes",`Implementation: ${j.implementation}`,`7702 coordinator: ${j.coordinator7702}`,`7702 delegate: ${j.delegate7702}`,`Coordinator owner: ${$}${$.toLowerCase()===n.toLowerCase()?" (connected)":" (connect this wallet to execute)"}`,`allTokensLength: ${g}`,`midBandTicks: ${m}, band1DepthWei: ${W(v)} ETH`,"Mode: EIP-7702 - launch plus up to 7 separately funded EOA buys in one transaction"].join(`
`),w("Loaded Lunch.fun contract status.")}catch(n){e.textContent=A(n),w(`Lunch status failed: ${A(n)}`)}}function ad(e){throw new Error("Set DOPPLER_CHAIN.atomicExecutor after deploying DopplerAtomicExecutor.")}function _a(e){return new _(U.airlock,vr,e)}async function Xt(){const e=await y.provider.getNetwork();if(e.chainId!==BigInt(U.id))throw new Error(`Connected network is chain ${e.chainId}, expected ${U.name} (${U.id}). Use Switch Network first.`)}function ka(e){return`${U.explorerUrl}tx/${e}`}function $a(e){return`${U.explorerUrl}address/${e}`}function wo(e){const t=new wt(Di);for(const n of e)try{const a=t.parseLog(n);if(a&&a.name==="AtomicLaunch")return{asset:a.args.asset,pool:a.args.pool}}catch{}return null}function rd(e){return Array.from({length:5},(n,a)=>{var c,u,d,b;const r=((c=l[`dopplerBuyerEnabled${a}`])==null?void 0:c.checked)??!1,o=((u=l[`dopplerBuyerAddress${a}`])==null?void 0:u.value.trim())??"",s=a===0&&!o?e:o,i=((d=l[`dopplerBuyerAmount${a}`])==null?void 0:d.value)||"0";return{index:a,enabled:r,recipient:s,amount:ce(gt(i,`Doppler buyer ${a+1} amount`)),minOut:((b=l[`dopplerBuyerMinOut${a}`])==null?void 0:b.value.trim())??""}})}async function od(){const e=document.querySelector("#dopplerContractResult");try{se(),await Xt();const t=await y.signer.getAddress(),n=await y.provider.getBalance(t);l.dopplerPrimaryWallet.value=t,l.dopplerPrimaryBalance.value=`${W(n)} ETH`;const a=_a(y.provider),[r,o,s,i]=await Promise.all([a.getModuleState(U.tokenFactory),a.getModuleState(U.governanceFactory),a.getModuleState(U.poolInitializer),a.getModuleState(U.liquidityMigrator)]),c=[`tokenFactory module state: ${r} (expect 1 = TokenFactory)`,`governanceFactory module state: ${o} (expect 2 = GovernanceFactory)`,`poolInitializer module state: ${s} (expect 3 = PoolInitializer)`,`liquidityMigrator module state: ${i} (expect 4 = LiquidityMigrator)`];[r,o,s,i].some(u=>u===0n||u===0)&&c.push("WARNING: at least one module shows NotWhitelisted (0). Airlock.create() will revert until Doppler's Airlock owner whitelists it."),U.atomicExecutor||c.push("No DopplerAtomicExecutor address configured yet — deploy it and set DOPPLER_CHAIN.atomicExecutor."),e.textContent=c.join(`
`),w("Doppler status loaded.")}catch(t){e.textContent=A(t),w(`Doppler status load failed: ${A(t)}`)}}async function go(){const e=await y.signer.getAddress(),t=ad(),n=await t.owner();if(n.toLowerCase()!==e.toLowerCase())throw new Error(`Connected wallet is not the Doppler atomic executor owner. Connect ${n}.`);const a=l.dopplerTokenName.value.trim(),r=l.dopplerTokenSymbol.value.trim();if(!a||!r)throw new Error("Doppler token name and symbol are required.");const o=Me(l.dopplerInitialSupply.value,18,"Doppler initial supply"),s=Me(l.dopplerNumTokensToSell.value,18,"Doppler tokens to sell");if(s<=0n||s>o)throw new Error("Tokens to sell must be greater than zero and no more than the initial supply.");const i=l.dopplerIntegrator.value.trim(),c=i||he;if(c!==he&&!Y(c))throw new Error("Integrator must be a valid address or blank.");const u=wn(l.dopplerSalt.value.trim());l.dopplerSalt.value.trim()||(l.dopplerSalt.value=u);const d=(I,H)=>{const V=I.trim();if(!V)return"0x";if(!/^0x([0-9a-fA-F]{2})*$/.test(V))throw new Error(`${H} must be 0x-prefixed hex bytes.`);return V},b=d(l.dopplerTokenFactoryData.value,"tokenFactoryData"),f=d(l.dopplerGovernanceFactoryData.value,"governanceFactoryData"),p=d(l.dopplerPoolInitializerData.value,"poolInitializerData"),h=d(l.dopplerLiquidityMigratorData.value,"liquidityMigratorData"),m={initialSupply:o,numTokensToSell:s,numeraire:U.numeraire,tokenFactory:U.tokenFactory,tokenFactoryData:b,governanceFactory:U.governanceFactory,governanceFactoryData:f,poolInitializer:U.poolInitializer,poolInitializerData:p,liquidityMigrator:U.liquidityMigrator,liquidityMigratorData:h,integrator:c,salt:u},v=rd(e).filter(I=>I.enabled);if(v.length===0)throw new Error("Enable at least one Doppler buyer row.");const g=new Set,$=v.map(I=>{if(!Y(I.recipient)||I.recipient===he)throw new Error(`Buyer ${I.index+1} has an invalid recipient.`);if(g.has(I.recipient.toLowerCase()))throw new Error(`Duplicate Doppler buyer recipient: ${I.recipient}`);if(g.add(I.recipient.toLowerCase()),I.amount<=0n)throw new Error(`Buyer ${I.index+1} amount must be greater than zero.`);const H=Me(I.minOut,18,`Buyer ${I.index+1} minimum token output`);if(H<=0n)throw new Error(`Buyer ${I.index+1} minimum output must be greater than zero.`);return{recipient:I.recipient,amountIn:I.amount,amountOutMinimum:H}}),T=l.dopplerNumeraireIsNative.checked,S=$.reduce((I,H)=>I+H.amountIn,0n),E=T?S:0n,L=Number(gt(l.dopplerDeadline.value||"5","Doppler deadline"));if(!Number.isFinite(L)||L<=0||L>60)throw new Error("Doppler deadline must be between 0 and 60 minutes.");const M=BigInt(Math.floor(Date.now()/1e3)+Math.floor(L*60));if(await y.provider.getBalance(e)<=E)throw new Error(`Wallet balance is below ${W(E)} ETH plus gas.`);return{primary:e,executor:t,owner:n,createData:m,enabledBuyers:v,buys:$,buyValue:S,numeraireIsNative:T,value:E,deadline:M}}async function sd(){const e=document.querySelector("#dopplerReviewResult");try{se(),await Xt();const t=await go(),n=await t.executor.launchAndBuy.staticCall(t.createData,t.buys,t.numeraireIsNative,t.deadline,{value:t.value}),a=await t.executor.launchAndBuy.estimateGas(t.createData,t.buys,t.numeraireIsNative,t.deadline,{value:t.value});on.predictedAsset=n.asset;for(const r of t.enabledBuyers)l[`dopplerBuyerStatus${r.index}`].value="Ready in atomic transaction",l[`dopplerBuyerGas${r.index}`].value=`${a} total`;e.textContent=[`Atomic executor: ${U.atomicExecutor}`,`Simulated asset: ${n.asset}`,`Simulated pool: ${n.pool}`,`Enabled buys: ${t.buys.length}`,`Execution order: ${t.enabledBuyers.map(r=>`${r.index+1}:${R(r.recipient)}`).join(" -> ")}`,`Purchase total: ${W(t.buyValue)} ETH${t.numeraireIsNative?"":" (numeraire is not native; buy value is not sent as msg.value)"}`,`Total msg.value required: ${W(t.value)} ETH`,`Estimated total gas: ${a}`,`Deadline: ${new Date(Number(t.deadline)*1e3).toLocaleString()}`,"Atomic guarantee: launch and every listed buy are internal calls in one transaction. Any failure reverts everything."].join(`
`),w(`Doppler review OK. Simulated asset ${n.asset}.`)}catch(t){e.textContent=A(t),w(`Doppler review failed: ${A(t)}`)}}async function id(){const e=document.querySelector("#dopplerExecutionResult");try{se(),await Xt();const t=await go(),n=[],a=d=>{n.push(`[${new Date().toLocaleTimeString()}] ${d}`),e.textContent=n.join(`
`),w(`Doppler atomic: ${d}`)};a("Simulating the complete atomic launch and all buys..."),await t.executor.launchAndBuy.staticCall(t.createData,t.buys,t.numeraireIsNative,t.deadline,{value:t.value});const r=await t.executor.launchAndBuy.estimateGas(t.createData,t.buys,t.numeraireIsNative,t.deadline,{value:t.value});a(`Simulation passed. Estimated gas ${r}.`);for(const d of t.enabledBuyers)l[`dopplerBuyerGas${d.index}`].value=`${r} total`,l[`dopplerBuyerStatus${d.index}`].value="Awaiting wallet confirmation";a("Awaiting executor-owner signature for one atomic transaction...");const o=await t.executor.launchAndBuy(t.createData,t.buys,t.numeraireIsNative,t.deadline,{value:t.value,gasLimit:r*125n/100n});for(const d of t.enabledBuyers)l[`dopplerBuyerStatus${d.index}`].value="Transaction submitted";a(`Submitted: ${ka(o.hash)}`);const s=await o.wait();if(s.status!==1)throw new Error("Atomic launch transaction reverted.");const i=wo(s.logs);if(!i)throw new Error("AtomicLaunch event was not found in the receipt.");on.launchedAsset=i.asset,on.launchedPool=i.pool,await Gn(i.asset,"Doppler");const c=new _(i.asset,["function decimals() view returns (uint8)","function balanceOf(address) view returns (uint256)"],y.signer),u=await c.decimals();for(const d of t.enabledBuyers){const b=await c.balanceOf(d.recipient);l[`dopplerBuyerReceived${d.index}`].value=X(b,u),l[`dopplerBuyerStatus${d.index}`].value=`Confirmed block ${s.blockNumber}`}a(`Confirmed in block ${s.blockNumber}. Asset: ${$a(i.asset)}`),a(`Pool: ${$a(i.pool)}`),a("Complete. No external transaction occurred between launch and the configured buys.")}catch(t){e.textContent=`${e.textContent}
Failed: ${A(t)}`.trim(),w(`Doppler execution failed: ${A(t)}`)}}function ld(e,t,n,a,r){const o=BigInt(t)<BigInt(e),s=o?{currency0:t,currency1:e,fee:U.dynamicFeeFlag,tickSpacing:U.tickSpacing,hooks:U.hooks}:{currency0:e,currency1:t,fee:U.dynamicFeeFlag,tickSpacing:U.tickSpacing,hooks:U.hooks},i=Bs(["uint8","uint8","uint8"],[Li,Pi,Ii]),c=A0.defaultAbiCoder(),u=[c.encode([Mi,"bool","uint256","uint256","bytes"],[s,o,n,a,"0x"]),c.encode(["address","uint256"],[t,n]),c.encode(["address","address"],[e,r])],d=[c.encode(["bytes","bytes[]"],[i,u])];return{commands:Ai,inputs:d,zeroForOne:o,key:s}}async function cd(){const e=document.querySelector("#dopplerBurstContractResult");try{se(),await Xt();const t=await y.signer.getAddress(),n=await y.provider.getBalance(t);l.dopplerBurstPrimaryWallet.value=t,l.dopplerBurstPrimaryBalance.value=`${W(n)} ETH`;const a=_a(y.provider),[r,o,s,i]=await Promise.all([a.getModuleState(U.tokenFactory),a.getModuleState(U.governanceFactory),a.getModuleState(U.poolInitializer),a.getModuleState(U.liquidityMigrator)]);e.textContent=[`tokenFactory module state: ${r} (expect 1)`,`governanceFactory module state: ${o} (expect 2)`,`poolInitializer module state: ${s} (expect 3)`,`liquidityMigrator module state: ${i} (expect 4)`,"Mode: burst - Airlock.create() confirms first, then buyer wallet V4 swaps are broadcast in parallel","Atomic: no. Same-block inclusion: not guaranteed."].join(`
`),w("Doppler burst status loaded.")}catch(t){e.textContent=A(t),w(`Doppler burst status load failed: ${A(t)}`)}}async function dd(e){var a;const t=new Set,n=[];for(let r=0;r<25;r+=1){if(!((a=l[`dopplerBurstBuyerEnabled${r}`])!=null&&a.checked))continue;const o=l[`dopplerBurstBuyerKey${r}`].value.trim(),s=o.startsWith("0x")?o:`0x${o}`;if(!/^0x[0-9a-fA-F]{64}$/.test(s))throw new Error(`Burst buyer ${r+1} private key must be a 64-character hex string.`);const i=new K(s,y.provider);if(t.has(i.address.toLowerCase()))throw new Error(`Duplicate burst buyer wallet ${i.address}.`);t.add(i.address.toLowerCase());const c=l[`dopplerBurstBuyerAddress${r}`].value.trim()||i.address;if(!Y(c))throw new Error(`Burst buyer ${r+1} recipient is invalid.`);const u=me(l[`dopplerBurstBuyerAmount${r}`].value,`Burst buyer ${r+1} amount`),d=Me(l[`dopplerBurstBuyerMinOut${r}`].value,18,`Burst buyer ${r+1} minimum output`);if(u===0n||d===0n)throw new Error(`Burst buyer ${r+1} amount and minimum output must be nonzero.`);const b=await y.provider.getBalance(i.address);if(l[`dopplerBurstBuyerBalance${r}`].value=`${W(b)} ETH`,b<u)throw new Error(`Burst buyer ${r+1} lacks ETH for its own purchase.`);n.push({index:r,wallet:i,recipient:c,amountIn:u,minOut:d})}return n}async function ko(){const e=await y.signer.getAddress(),t=_a(y.signer),n=l.dopplerBurstTokenName.value.trim(),a=l.dopplerBurstTokenSymbol.value.trim();if(!n||!a)throw new Error("Doppler burst token name and symbol are required.");const r=Me(l.dopplerBurstInitialSupply.value,18,"Doppler burst initial supply"),o=Me(l.dopplerBurstNumTokensToSell.value,18,"Doppler burst tokens to sell");if(o<=0n||o>r)throw new Error("Tokens to sell must be greater than zero and no more than the initial supply.");const s=l.dopplerBurstIntegrator.value.trim(),i=s||he;if(i!==he&&!Y(i))throw new Error("Integrator must be a valid address or blank.");const c=wn(l.dopplerBurstSalt.value.trim());l.dopplerBurstSalt.value.trim()||(l.dopplerBurstSalt.value=c);const u=(m,v)=>{const g=m.trim();if(!g)return"0x";if(!/^0x([0-9a-fA-F]{2})*$/.test(g))throw new Error(`${v} must be 0x-prefixed hex bytes.`);return g},d={initialSupply:r,numTokensToSell:o,numeraire:U.numeraire,tokenFactory:U.tokenFactory,tokenFactoryData:u(l.dopplerBurstTokenFactoryData.value,"tokenFactoryData"),governanceFactory:U.governanceFactory,governanceFactoryData:u(l.dopplerBurstGovernanceFactoryData.value,"governanceFactoryData"),poolInitializer:U.poolInitializer,poolInitializerData:u(l.dopplerBurstPoolInitializerData.value,"poolInitializerData"),liquidityMigrator:U.liquidityMigrator,liquidityMigratorData:u(l.dopplerBurstLiquidityMigratorData.value,"liquidityMigratorData"),integrator:i,salt:c},b=l.dopplerBurstNumeraireIsNative.checked,f=await y.provider.getBalance(e),p=await dd(),h=p.reduce((m,v)=>m+v.amountIn,0n);if(f<=0n)throw new Error("Launcher wallet has no balance for gas.");return{primary:e,airlock:t,createData:d,numeraireIsNative:b,buyers:p,buyerValue:h}}async function ud(){var t;const e=document.querySelector("#dopplerBurstReviewResult");try{se(),await Xt();const n=await ko(),a=await n.airlock.create.staticCall(n.createData),r=await n.airlock.create.estimateGas(n.createData);for(const o of n.buyers)(t=l[`dopplerBurstBuyerAddress${o.index}`]).value||(t.value=o.wallet.address),l[`dopplerBurstBuyerGas${o.index}`].value="estimated after launch",l[`dopplerBurstBuyerStatus${o.index}`].value="Ready for burst";e.textContent=[`Simulated asset: ${a.asset}`,`Simulated pool: ${a.pool}`,`Launch gas estimate: ${r}`,`Burst buyer wallets: ${n.buyers.map(o=>R(o.wallet.address)).join(", ")||"none"}`,`Burst buy total: ${W(n.buyerValue)} ETH from buyer wallet balances`,"Execution: Airlock.create() confirms first, asset is decoded from receipt, then all buyer V4 swaps are broadcast in parallel.","Atomic: no. Same-block inclusion: not guaranteed."].join(`
`),w(`Doppler burst review OK. Simulated asset ${a.asset}.`)}catch(n){e.textContent=A(n),w(`Doppler burst review failed: ${A(n)}`)}}async function bd(){const e=document.querySelector("#dopplerBurstExecutionResult");try{se(),await Xt();const t=await ko(),n=[],a=h=>{n.push(`[${new Date().toLocaleTimeString()}] ${h}`),e.textContent=n.join(`
`),w(`Doppler burst: ${h}`)};a("Simulating Airlock.create()..."),await t.airlock.create.staticCall(t.createData);const r=await t.airlock.create.estimateGas(t.createData);a(`Launch simulation passed. Estimated gas ${r}.`),a("Awaiting launcher wallet signature...");const o=await t.airlock.create(t.createData,{gasLimit:r*125n/100n});a(`Launch submitted: ${ka(o.hash)}`);const s=await o.wait();if(s.status!==1)throw new Error("Doppler burst launch transaction reverted.");const i=wo(s.logs)||(()=>{const h=new wt(vr);for(const m of s.logs)try{const v=h.parseLog(m);if(v&&v.name==="Create")return{asset:v.args.asset,pool:v.args.poolOrHook}}catch{}return null})();if(!i)throw new Error("Create event was not found in the launch receipt.");if(on.launchedAsset=i.asset,on.launchedPool=i.pool,await Gn(i.asset,"Doppler Burst"),a(`Launch confirmed block ${s.blockNumber}. Asset ${$a(i.asset)}`),!t.buyers.length){a("No burst buyers enabled. Done after launch.");return}const c=t.numeraireIsNative?he:U.numeraire,u=new _(i.asset,["function decimals() view returns (uint8)","function balanceOf(address) view returns (uint256)"],y.provider),d=await u.decimals();a(`Preparing ${t.buyers.length} burst buy transaction(s)...`);const b=await Promise.allSettled(t.buyers.map(async h=>{const{commands:m,inputs:v}=ld(i.asset,c,h.amountIn,h.minOut,h.recipient),g=new _(U.universalRouter,Ri,h.wallet),$=BigInt(Math.floor(Date.now()/1e3)+300),T=await g.execute.estimateGas(m,v,$,{value:h.amountIn});l[`dopplerBurstBuyerGas${h.index}`].value=`${T}`;const S=await g.execute(m,v,$,{value:h.amountIn,gasLimit:T*125n/100n});return l[`dopplerBurstBuyerHash${h.index}`].value=S.hash,l[`dopplerBurstBuyerStatus${h.index}`].value="Submitted",{buyer:h,tx:S}})),f=[];for(const[h,m]of b.entries()){const v=t.buyers[h];m.status==="fulfilled"?(f.push(m.value),a(`Buyer ${v.index+1} submitted: ${ka(m.value.tx.hash)}`)):(l[`dopplerBurstBuyerStatus${v.index}`].value="Submit failed",a(`Buyer ${v.index+1} submit failed: ${A(m.reason)}`))}a(`Waiting for ${f.length} submitted burst receipt(s)...`);const p=await Promise.allSettled(f.map(async h=>{const m=await h.tx.wait(),v=await u.balanceOf(h.buyer.recipient);return{...h,receipt:m,received:v}}));for(const[h,m]of p.entries()){const v=f[h].buyer;if(m.status==="fulfilled"){const{receipt:g,received:$}=m.value,T=g.status===1;l[`dopplerBurstBuyerStatus${v.index}`].value=T?`Confirmed block ${g.blockNumber}`:"Reverted",l[`dopplerBurstBuyerReceived${v.index}`].value=X($,d),a(`Buyer ${v.index+1} ${T?"confirmed":"reverted"} in block ${g.blockNumber}.`)}else l[`dopplerBurstBuyerStatus${v.index}`].value="Receipt wait failed",a(`Buyer ${v.index+1} receipt wait failed: ${A(m.reason)}`)}a("Burst complete.")}catch(t){e.textContent=`${e.textContent}
Failed: ${A(t)}`.trim(),w(`Doppler burst execution failed: ${A(t)}`)}}async function Na(){const e=document.querySelector("#lunchReviewResult");try{const t=await Qn();let n=yr+xr*BigInt(t.buyers.length),a="Skipped eth_call simulation: at least one buyer wallet is not yet delegated on-chain, and eth_call does not apply an authorizationList. This is expected before the first atomic launch for these wallets; the real type-4 transaction applies delegations before executing.";t.pendingDelegation||(await y.provider.call({from:t.owner.address,...t.request}),n=await y.provider.estimateGas({from:t.owner.address,...t.request}),a="Full type-4 simulation passed. Each buyer authorization is limited to this token, amount, minimum output, deadline, and nonce.");for(const r of t.buyers)l[`lunchBuyerGas${r.index}`].value=`${n} ${t.pendingDelegation?"estimated":"total"}`,l[`lunchBuyerStatus${r.index}`].value="7702 authorization ready";e.textContent=[`Coordinator: ${j.coordinator7702}`,`Delegate: ${j.delegate7702}`,`Predicted token: ${t.predictedToken}`,`Actual router callers: ${t.buyers.map(r=>r.account).join(" -> ")}`,`Each wallet spends: ${t.buyers.map(r=>W(r.amountIn)).join(", ")} ETH`,`Launch fee paid by coordinator owner: ${W(t.launchFee)} ETH`,`Estimated total gas: ${n}`,a].join(`
`)}catch(t){e.textContent=A(t),w(`Lunch 7702 review failed: ${A(t)}`)}}async function qa({context:e=null,deferRevocation:t=!1}={}){const n=document.querySelector("#lunchExecutionResult");try{const a=e||await Qn(),r=[],o=d=>{r.push(`[${new Date().toLocaleTimeString()}] ${d}`),n.textContent=r.join(`
`)};let s=yr+xr*BigInt(a.buyers.length);a.pendingDelegation?o("Skipping eth_call simulation: buyer wallet(s) are not yet delegated on-chain and eth_call cannot apply an authorizationList. Submitting the real atomic type-4 transaction directly."):(o("Simulating EIP-7702 launch and all separately funded wallet buys..."),await y.provider.call({from:a.owner.address,...a.request}),s=await y.provider.estimateGas({from:a.owner.address,...a.request}),o(`Simulation passed. Awaiting one owner signature; estimated gas ${s}.`));const i=await a.owner.sendTransaction({...a.request,gasLimit:s*125n/100n});for(const d of a.buyers)l[`lunchBuyerHash${d.index}`].value=i.hash,l[`lunchBuyerStatus${d.index}`].value="Atomic type-4 transaction submitted";o(`Submitted: ${cn(i.hash)}`);const c=await i.wait();if(c.status!==1)throw new Error("EIP-7702 launch reverted.");const u=Po(c.logs);if(!u)throw new Error("Launch event missing from receipt.");if(t){for(const d of a.buyers)l[`lunchBuyerStatus${d.index}`].value=`Confirmed block ${c.blockNumber}; burst broadcasting`;return o(`Launch and buys confirmed atomically in block ${c.blockNumber}. Delegation revocation deferred until the burst leg settles.`),{token:u.token,pool:u.pool,ctx:a,receipt:c}}return await $o(a,u,c,o),{token:u.token,pool:u.pool,ctx:a,receipt:c}}catch(a){return n.textContent=`${n.textContent}
Failed: ${A(a)}`.trim(),w(`Lunch 7702 execution failed: ${A(a)}`),null}}async function $o(e,t,n,a){const r=new _(t.token,mn,y.provider),o=await r.decimals();for(const c of e.buyers)l[`lunchBuyerReceived${c.index}`].value=X(await r.balanceOf(c.account),o),l[`lunchBuyerStatus${c.index}`].value=`Confirmed block ${n.blockNumber}; revoking`;a(`Launch and buys confirmed atomically in block ${n.blockNumber}. Revoking buyer delegations...`);const s=[];for(const c of e.wallets)s.push(await c.authorize({address:he,chainId:BigInt(j.id),nonce:await y.provider.getTransactionCount(c.address,"pending")}));const i=await e.owner.sendTransaction({to:e.owner.address,value:0n,authorizationList:s});a(`Revocation submitted: ${cn(i.hash)}`),await i.wait();for(const c of e.buyers)l[`lunchBuyerStatus${c.index}`].value="Buy confirmed; delegation revoked",l[`lunchBuyerKey${c.index}`].value="";a(`Complete. Token: ${dn(t.token)}. Every router call originated from its listed buyer wallet.`)}async function Qn(){if(se(),await kn(),y.walletMode!=="RPC"||!(y.signer instanceof K))throw new Error("Connect the coordinator owner using Connect RPC Wallet; MetaMask cannot assemble this multi-authorization transaction.");const e=y.signer,t=So(e);if((await t.owner()).toLowerCase()!==e.address.toLowerCase())throw new Error("Connected RPC wallet is not the 7702 coordinator owner.");const n=gn(y.provider),a=await n.launchFeeWei(),r=await n.enforcedSupply(),o=l.lunchTokenName.value.trim(),s=l.lunchTokenSymbol.value.trim();if(!o||!s)throw new Error("Lunch token name and symbol are required.");const i=Me(l.lunchTotalSupply.value,18,"Lunch total supply");if(r>0n&&i!==r)throw new Error("Lunch total supply does not match enforced supply.");const c=Number(gt(l.lunchDeadline.value||"5","Lunch deadline"));if(c<=0||c>60)throw new Error("Deadline must be between 0 and 60 minutes.");const u=wn(l.lunchSalt.value.trim());l.lunchSalt.value.trim()||(l.lunchSalt.value=u);const d={name:o,symbol:s,totalSupply:i,fee:1e4,meta:{image:l.lunchImage.value.trim(),banner:l.lunchBanner.value.trim(),description:l.lunchDescription.value.trim(),website:l.lunchWebsite.value.trim(),twitter:l.lunchTwitter.value.trim(),telegram:l.lunchTelegram.value.trim()},userSalt:u,deadline:BigInt(Math.floor(Date.now()/1e3)+Math.floor(c*60))},b=await n.predictTokenAddress(o,s,i,j.coordinator7702,u),f=[],p=[],h=[],m=new Set,v=`0xef0100${j.delegate7702.slice(2).toLowerCase()}`;for(let S=0;S<5;S++){if(!l[`lunchBuyerEnabled${S}`].checked)continue;const E=l[`lunchBuyerKey${S}`].value.trim();if(!E)throw new Error(`Buyer ${S+1} private key is required.`);const L=E.startsWith("0x")?E:`0x${E}`;if(!/^0x[0-9a-fA-F]{64}$/.test(L))throw new Error(`Buyer ${S+1} private key must be a 64-character hex string.`);const M=new K(L,y.provider);if(m.has(M.address.toLowerCase()))throw new Error(`Duplicate buyer wallet ${M.address}.`);m.add(M.address.toLowerCase()),f.push(M),l[`lunchBuyerAddress${S}`].value=M.address;const D=me(l[`lunchBuyerAmount${S}`].value,`Buyer ${S+1} amount`),I=Me(l[`lunchBuyerMinOut${S}`].value,18,`Buyer ${S+1} minimum output`);if(D===0n||I===0n)throw new Error(`Buyer ${S+1} amount and minimum output must be nonzero.`);const H=await y.provider.getBalance(M.address);if(l[`lunchBuyerBalance${S}`].value=`${W(H)} ETH`,H<D)throw new Error(`Buyer ${S+1} lacks ETH for its own purchase.`);const V=(await y.provider.getCode(M.address)).toLowerCase();if(V!=="0x"&&V!==v)throw new Error(`Buyer ${S+1} has an incompatible existing delegation.`);const F=V===v?await Eo(M.address,y.provider).executionNonce():0n,k={token:b,fee:1e4,amountIn:D,amountOutMinimum:I,sqrtPriceLimitX96:0n,deadline:d.deadline,nonce:F},O=await M.signTypedData({name:"Lunch7702Buyer",version:"1",chainId:BigInt(j.id),verifyingContract:M.address},{AuthorizedBuy:[{name:"token",type:"address"},{name:"fee",type:"uint24"},{name:"amountIn",type:"uint256"},{name:"amountOutMinimum",type:"uint256"},{name:"sqrtPriceLimitX96",type:"uint160"},{name:"deadline",type:"uint256"},{name:"nonce",type:"uint256"}]},k);p.push({index:S,account:M.address,amountIn:D,amountOutMinimum:I,sqrtPriceLimitX96:0n,nonce:F,signature:O}),h.push(await M.authorize({address:j.delegate7702,chainId:BigInt(j.id),nonce:await y.provider.getTransactionCount(M.address,"pending")}))}if(!p.length)throw new Error("Enable at least one buyer wallet.");const g=p.map(({index:S,...E})=>E),$=new wt(mr).encodeFunctionData("launchAndBuy",[d,g]),T=f.length!==0&&(await Promise.all(f.map(async S=>(await y.provider.getCode(S.address)).toLowerCase()!==v))).some(Boolean);return{owner:e,coordinator:t,launcher:n,launchFee:a,params:d,predictedToken:b,wallets:f,buyers:p,pendingDelegation:T,request:{to:j.coordinator7702,data:$,value:a,authorizationList:h}}}function So(e){return new _(j.coordinator7702,mr,e)}function Eo(e,t){return new _(e,Ti,t)}async function To(){const e=document.querySelector("#lunchBurstContractResult");try{se(),await kn();const t=await y.signer.getAddress(),n=gn(y.signer);ye.factory=n;const[a,r,o,s,i,c,u,d]=await Promise.all([y.provider.getBlockNumber(),y.provider.getBalance(t),n.factory(),n.npm(),n.xToken(),n.launchFeeWei(),n.enforcedSupply(),n.allTokensLength()]);ye.factoryAddress=o,ye.npm=s,ye.xToken=i,ye.launchFee=c,ye.enforcedSupply=u,l.lunchBurstCurrentBlock.value=String(a),l.lunchBurstPrimaryWallet.value=t,l.lunchBurstPrimaryBalance.value=`${W(r)} ETH`,l.lunchBurstLaunchFee.value=`${W(c)} ETH`,l.lunchBurstFactory.value=o,l.lunchBurstNpm.value=s,l.lunchBurstXToken.value=i,l.lunchBurstEnforcedSupply.value=`${X(u,18)} tokens`,u>0n&&(l.lunchBurstTotalSupply.value=X(u,18)),e.textContent=["Required function: launchWithMetaSalt","Router function: exactInputSingle",`allTokensLength: ${d}`,"Mode: burst - launch confirms first, then buyer wallet txs are broadcast in parallel","Atomic: no. Same-block inclusion: not guaranteed."].join(`
`),w("Loaded Lunch burst status.")}catch(t){e.textContent=A(t),w(`Lunch burst status failed: ${A(t)}`)}}async function Co(){var t;const e=document.querySelector("#lunchBurstReviewResult");try{se(),await kn();const n=await Ao();await n.launcher.launchWithMetaSalt.staticCall(n.name,n.symbol,n.totalSupply,n.fee,n.initialBuyFlag,n.meta,n.userSalt,{value:n.launchValue});const a=await n.launcher.launchWithMetaSalt.estimateGas(n.name,n.symbol,n.totalSupply,n.fee,n.initialBuyFlag,n.meta,n.userSalt,{value:n.launchValue});ye.predictedToken=n.predictedToken;for(const r of n.buyers)(t=l[`lunchBurstBuyerAddress${r.index}`]).value||(t.value=r.wallet.address),l[`lunchBurstBuyerBalance${r.index}`].value=`${W(r.balance)} ETH`,l[`lunchBurstBuyerGas${r.index}`].value="estimated after launch",l[`lunchBurstBuyerStatus${r.index}`].value="Ready for burst";e.textContent=[`Predicted token: ${n.predictedToken}`,"Launch function: launchWithMetaSalt(string,string,uint256,uint24,uint256,Meta,bytes32)",`Dev buy in launch tx: ${W(n.devBuy)} ETH`,`Launch fee: ${W(n.launchFee)} ETH`,`Launch gas estimate: ${a}`,`Burst buyer wallets: ${n.buyers.map(r=>R(r.wallet.address)).join(", ")||"none"}`,`Burst buy total: ${W(n.buyerValue)} ETH from buyer wallet balances`,`Minimum outputs: ${n.buyers.map(r=>X(r.minOut,18)).join(", ")||"none"}`,"Execution: launcher tx confirms first, token is decoded from receipt, then all buyer txs are broadcast in parallel.","Atomic: no. Same-block inclusion: not guaranteed."].join(`
`),w(`Lunch burst review OK. Predicted token ${n.predictedToken}.`)}catch(n){e.textContent=A(n),w(`Lunch burst review failed: ${A(n)}`)}}async function Bo(){const e=document.querySelector("#lunchBurstExecutionResult");try{se(),await kn();const t=await Ao(),n=[],a=h=>{n.push(`[${new Date().toLocaleTimeString()}] ${h}`),e.textContent=n.join(`
`),w(`Lunch burst: ${h}`)};a("Simulating Lunch.fun launch..."),await t.launcher.launchWithMetaSalt.staticCall(t.name,t.symbol,t.totalSupply,t.fee,t.initialBuyFlag,t.meta,t.userSalt,{value:t.launchValue});const r=await t.launcher.launchWithMetaSalt.estimateGas(t.name,t.symbol,t.totalSupply,t.fee,t.initialBuyFlag,t.meta,t.userSalt,{value:t.launchValue});a(`Launch simulation passed. Estimated gas ${r}.`),a("Awaiting launcher wallet signature...");const o=await t.launcher.launchWithMetaSalt(t.name,t.symbol,t.totalSupply,t.fee,t.initialBuyFlag,t.meta,t.userSalt,{value:t.launchValue,gasLimit:r*125n/100n});a(`Launch submitted: ${cn(o.hash)}`);const s=await o.wait();if(s.status!==1)throw new Error("Lunch burst launch transaction reverted.");const i=Po(s.logs);if(!i)throw new Error("V3TokenLaunched event was not found in the launch receipt.");if(ye.launchedToken=i.token,ye.launchedPool=i.pool,await Gn(i.token,"Lunch Burst"),a(`Launch confirmed block ${s.blockNumber}. Token ${dn(i.token)}`),a(`Pool detected: ${dn(i.pool)}`),!t.buyers.length){a("No burst buyers enabled. Done after launch.");return}const c=new _(i.token,mn,y.provider),u=await c.decimals();a(`Estimating ${t.buyers.length} burst buy transaction(s) after token detection...`);const d=await Promise.all(t.buyers.map(async h=>gd(t,h,i.token,c,u)));for(const h of d)l[`lunchBurstBuyerGas${h.buyer.index}`].value=`${h.gas}`,l[`lunchBurstBuyerReceived${h.buyer.index}`].value=`expected ${X(h.quote,u)}`,l[`lunchBurstBuyerStatus${h.buyer.index}`].value="Ready to broadcast";a("Broadcasting all burst buyer transactions in parallel...");const b=await Promise.allSettled(d.map(async h=>{const v=await new _(t.routerAddress,[Re[0]],h.buyer.wallet).exactInputSingle(h.params,{value:h.buyer.amountIn,gasLimit:h.gas*125n/100n});return l[`lunchBurstBuyerHash${h.buyer.index}`].value=v.hash,l[`lunchBurstBuyerStatus${h.buyer.index}`].value="Submitted",{...h,tx:v}})),f=[];for(const[h,m]of b.entries()){const v=d[h].buyer;m.status==="fulfilled"?(f.push(m.value),a(`Buyer ${v.index+1} submitted: ${cn(m.value.tx.hash)}`)):(l[`lunchBurstBuyerStatus${v.index}`].value="Submit failed",a(`Buyer ${v.index+1} submit failed: ${A(m.reason)}`))}a(`Waiting for ${f.length} submitted burst receipt(s)...`);const p=await Promise.allSettled(f.map(async h=>{const m=await h.tx.wait(),v=await c.balanceOf(h.buyer.recipient);return{...h,receipt:m,received:v-h.before}}));for(const h of p)if(h.status==="fulfilled"){const{buyer:m,receipt:v,received:g}=h.value;l[`lunchBurstBuyerStatus${m.index}`].value=v.status===1?`Confirmed block ${v.blockNumber}`:"Reverted",l[`lunchBurstBuyerReceived${m.index}`].value=X(g,u)}else a(`Receipt wait failed: ${A(h.reason)}`);a("Burst flow complete. Submitted buyer txs were parallel, but block ordering is determined by the network.")}catch(t){e.textContent=`${e.textContent}
Failed: ${A(t)}`.trim(),w(`Lunch burst execution failed: ${A(t)}`)}}function Rn(){const e=document.querySelector('input[name="lunchComboMode"]:checked').value;document.querySelector("#lunchComboAtomicSection").style.display=e==="burst"?"none":"",document.querySelector("#lunchComboBurstSection").style.display=e==="atomic"?"none":"",document.querySelector("#lunchComboAtomicButtons").style.display=e==="chained"?"none":"",document.querySelector("#lunchComboBurstButtons").style.display=e==="chained"?"none":"",document.querySelector("#lunchComboChainedButtons").style.display=e==="chained"?"":"none",document.querySelector("#lunchComboChainedHint").style.display=e==="chained"?"":"none"}function Yt(){const e=["TokenName","TokenSymbol","TotalSupply","FeeTier","Image","Banner","Description","Website","Twitter","Telegram","Salt"];for(const t of e)l[`lunch${t}`].value=l[`lunchCombo${t}`].value,l[`lunchBurst${t}`].value=l[`lunchCombo${t}`].value;l.lunchDeadline.value=l.lunchComboDeadline.value,l.lunchBurstDevBuyEth.value=l.lunchComboDevBuyEth.value}function ea(){for(let e=0;e<5;e++)l[`lunchBuyerEnabled${e}`].checked=l[`lunchComboBuyerEnabled${e}`].checked,l[`lunchBuyerKey${e}`].value=l[`lunchComboBuyerKey${e}`].value,l[`lunchBuyerAddress${e}`].value=l[`lunchComboBuyerAddress${e}`].value,l[`lunchBuyerAmount${e}`].value=l[`lunchComboBuyerAmount${e}`].value,l[`lunchBuyerMinOut${e}`].value=l[`lunchComboBuyerMinOut${e}`].value}function ln(){for(let e=0;e<5;e++)for(const t of["Address","Balance","Gas","Status","Hash","Received"])l[`lunchComboBuyer${t}${e}`].value=l[`lunchBuyer${t}${e}`].value}function ta(){for(let e=0;e<25;e++)l[`lunchBurstBuyerEnabled${e}`].checked=l[`lunchComboBurstBuyerEnabled${e}`].checked,l[`lunchBurstBuyerKey${e}`].value=l[`lunchComboBurstBuyerKey${e}`].value,l[`lunchBurstBuyerAddress${e}`].value=l[`lunchComboBurstBuyerAddress${e}`].value,l[`lunchBurstBuyerAmount${e}`].value=l[`lunchComboBurstBuyerAmount${e}`].value,l[`lunchBurstBuyerMinOut${e}`].value=l[`lunchComboBurstBuyerMinOut${e}`].value}function na(){for(let e=0;e<25;e++)for(const t of["Address","Balance","Gas","Status","Hash","Received"])l[`lunchComboBurstBuyer${t}${e}`].value=l[`lunchBurstBuyer${t}${e}`].value}async function fd(){const e=document.querySelector("#lunchComboModeAtomic").checked;await(e?vo():To());const t=e?"lunch":"lunchBurst";l.lunchComboCurrentBlock.value=l[`${t}CurrentBlock`].value,l.lunchComboPrimaryWallet.value=l[`${t}PrimaryWallet`].value,l.lunchComboPrimaryBalance.value=l[`${t}PrimaryBalance`].value;const n=document.querySelector("#lunchComboContractResult"),a=document.querySelector(`#${t}ContractResult`);n.textContent=a?a.textContent:""}async function pd(){Yt(),ea(),await Na(),ln(),document.querySelector("#lunchComboReviewResult").textContent=document.querySelector("#lunchReviewResult").textContent}async function hd(){Yt(),ea(),await qa(),ln(),document.querySelector("#lunchComboExecutionResult").textContent=document.querySelector("#lunchExecutionResult").textContent}async function md(){Yt(),ta(),await Co(),na(),document.querySelector("#lunchComboReviewResult").textContent=document.querySelector("#lunchBurstReviewResult").textContent}async function yd(){Yt(),ta(),await Bo(),na(),document.querySelector("#lunchComboExecutionResult").textContent=document.querySelector("#lunchBurstExecutionResult").textContent}async function xd(){const e=document.querySelector("#lunchComboReviewResult"),t=[],n=a=>{t.push(`[${new Date().toLocaleTimeString()}] ${a}`),e.textContent=t.join(`
`),w(`Lunch combo chained review: ${a}`)};try{Yt(),ea(),ta(),n("Validating atomic leg (launch plus EIP-7702 buyer wallets)..."),await Na(),ln(),n(document.querySelector("#lunchReviewResult").textContent);const a=await Qn();n("Pre-signing burst leg locally against the predicted token (not broadcast)...");const r=await Ro(a.predictedToken,n);na(),n(`Validation complete. ${r.length} burst transaction(s) ready to broadcast once the atomic leg confirms.`)}catch(a){e.textContent=`${e.textContent}
Failed: ${A(a)}`.trim(),w(`Lunch combo chained review failed: ${A(a)}`)}}async function vd(){const e=document.querySelector("#lunchComboExecutionResult"),t=[],n=a=>{t.push(`[${new Date().toLocaleTimeString()}] ${a}`),e.textContent=t.join(`
`),w(`Lunch combo chained: ${a}`)};try{Yt(),ea(),ta(),n("Preparing and locally signing burst transactions for the predicted token...");const a=await Qn(),r=await Ro(a.predictedToken,n);n("Starting atomic leg: launch plus EIP-7702 buyer wallets in one transaction...");const o=await qa({context:a,deferRevocation:!0});if(ln(),n(document.querySelector("#lunchExecutionResult").textContent),!o)throw new Error("Atomic leg failed or was aborted; burst leg was not started.");if(o.token.toLowerCase()!==a.predictedToken.toLowerCase())throw new Error(`Launched token ${o.token} did not match pre-signed target ${a.predictedToken}; burst transactions were not broadcast.`);n(`Atomic leg complete. Token ${dn(o.token)}.`),n("Atomic receipt confirmed. Broadcasting all pre-signed burst transactions directly to the Robinhood sequencer..."),await wd(r,o.token,n),na(),n("Burst transactions settled. Revoking EIP-7702 buyer delegations..."),await $o(o.ctx,{token:o.token,pool:o.pool},o.receipt,n),ln(),n("Chained flow complete.")}catch(a){e.textContent=`${e.textContent}
Failed: ${A(a)}`.trim(),w(`Lunch combo chained execution failed: ${A(a)}`)}}async function Ro(e,t){const n=await y.signer.getAddress(),a=l.lunchBurstRouter.value.trim()||j.router;if(!Y(a))throw new Error("Lunch burst router is invalid.");const r=Number(Nt(l.lunchBurstFeeTier.value||"10000","Lunch burst fee tier"));if(r!==1e4)throw new Error("Lunch launcher requires fee tier 10000.");if(await y.provider.getCode(e)!=="0x")throw new Error(`Predicted token ${e} already has code; refusing to pre-sign burst transactions.`);const o=gn(y.provider),[s,i,c]=await Promise.all([o.xToken(),y.provider.getFeeData(),Lo(n)]);if(!c.length)return t("No burst buyers enabled. Only the atomic leg will execute."),[];const u=i.maxFeePerGas??i.gasPrice;if(u==null||u<=0n)throw new Error("RPC did not return a usable gas fee for pre-signing.");const d=u*Bi/10000n,b=i.maxPriorityFeePerGas??0n,f=b>d?d:b,p=new wt([Re[0]]),h=await Promise.all(c.map(async m=>{const v=await y.provider.getTransactionCount(m.wallet.address,"pending"),g=Bn*d;if(m.balance<m.amountIn+g)throw new Error(`Burst buyer ${m.index+1} needs at least ${W(m.amountIn+g)} ETH for its buy and pre-signed gas ceiling.`);const $={tokenIn:s,tokenOut:e,fee:r,recipient:m.recipient,amountIn:m.amountIn,amountOutMinimum:m.minOut,sqrtPriceLimitX96:0n},T=await m.wallet.signTransaction({chainId:j.id,type:2,nonce:v,to:a,data:p.encodeFunctionData("exactInputSingle",[$]),value:m.amountIn,gasLimit:Bn,maxFeePerGas:d,maxPriorityFeePerGas:f}),S=T0.from(T).hash;return l[`lunchBurstBuyerGas${m.index}`].value=`${Bn} ceiling`,l[`lunchBurstBuyerReceived${m.index}`].value=`minimum ${X(m.minOut,18)}`,l[`lunchBurstBuyerStatus${m.index}`].value="Pre-signed locally; not broadcast",l[`lunchBurstBuyerHash${m.index}`].value=S,{buyer:m,params:$,raw:T,hash:S,nonce:v}}));return t(`Pre-signed ${h.length} burst transaction(s) in browser memory for ${dn(e)}. Gas ceiling ${Bn}; max fee ${X(d,"gwei")} gwei.`),h}async function wd(e,t,n){if(!e.length)return;const a=new R0(Ci,{chainId:j.id,name:"robinhood"},{staticNetwork:!0,batchMaxCount:1}),r=await Promise.allSettled(e.map(async d=>{let b="direct sequencer";try{const f=await a.send("eth_sendRawTransaction",[d.raw]);if(f.toLowerCase()!==d.hash.toLowerCase())throw new Error(`Sequencer returned unexpected transaction hash ${f}.`)}catch(f){b="configured RPC fallback";try{const p=await y.provider.send("eth_sendRawTransaction",[d.raw]);if(p.toLowerCase()!==d.hash.toLowerCase())throw new Error(`RPC returned unexpected transaction hash ${p}.`)}catch(p){const h=new Error(`Direct sequencer failed: ${A(f)}. Configured RPC fallback failed: ${A(p)}`);throw h.sequencerError=f,h.fallbackError=p,h}}return l[`lunchBurstBuyerStatus${d.buyer.index}`].value=`Submitted via ${b}`,{...d,route:b}})),o=[];for(const[d,b]of r.entries()){const f=e[d];b.status==="fulfilled"?(o.push(b.value),n(`Buyer ${f.buyer.index+1} submitted via ${b.value.route}: ${cn(f.hash)}`)):(l[`lunchBurstBuyerStatus${f.buyer.index}`].value="Submit failed",n(`Buyer ${f.buyer.index+1} submit failed: ${A(b.reason)}`))}if(o.length!==e.length)throw new Error(`${e.length-o.length} pre-signed burst transaction(s) could not be submitted; delegation revocation was paused.`);n(`Waiting for ${o.length} pre-signed burst receipt(s) before creating nonce-safe revocations...`);const s=new _(t,mn,y.provider),i=await s.decimals(),c=await Promise.allSettled(o.map(async d=>{const b=await y.provider.waitForTransaction(d.hash);if(!b)throw new Error(`No receipt returned for ${d.hash}.`);const f=await s.balanceOf(d.buyer.recipient);return{...d,receipt:b,received:f}}));let u=0;for(const[d,b]of c.entries()){const f=o[d];if(b.status==="fulfilled"){const{receipt:p,received:h}=b.value,m=p.status===1;m||(u+=1),l[`lunchBurstBuyerStatus${f.buyer.index}`].value=m?`Confirmed block ${p.blockNumber}`:"Reverted",l[`lunchBurstBuyerReceived${f.buyer.index}`].value=X(h,i),n(`Buyer ${f.buyer.index+1} ${m?"confirmed":"reverted"} in block ${p.blockNumber}.`)}else u+=1,l[`lunchBurstBuyerStatus${f.buyer.index}`].value="Receipt wait failed",n(`Buyer ${f.buyer.index+1} receipt wait failed: ${A(b.reason)}`)}if(u)throw new Error(`${u} burst transaction(s) failed or could not be confirmed; delegation revocation was paused for manual review.`)}async function gd(e,t,n,a,r){const o=new _(e.routerAddress,[Re[0]],t.wallet),s={tokenIn:e.xToken,tokenOut:n,fee:e.fee,recipient:t.recipient,amountIn:t.amountIn,amountOutMinimum:t.minOut,sqrtPriceLimitX96:0n},i=await a.balanceOf(t.recipient),c=await o.exactInputSingle.staticCall(s,{value:t.amountIn});if(c<t.minOut)throw new Error(`Buyer ${t.index+1} quote ${X(c,r)} is below minimum.`);const u=await o.exactInputSingle.estimateGas(s,{value:t.amountIn});return{buyer:t,params:s,before:i,quote:c,gas:u}}async function Ao(){const e=await y.signer.getAddress(),t=gn(y.signer),[n,a,r]=await Promise.all([t.launchFeeWei(),t.enforcedSupply(),t.xToken()]),o=l.lunchBurstTokenName.value.trim(),s=l.lunchBurstTokenSymbol.value.trim();if(!o||!s)throw new Error("Lunch burst token name and symbol are required.");const i=Me(l.lunchBurstTotalSupply.value,18,"Lunch burst total supply");if(a>0n&&i!==a)throw new Error(`Lunch burst total supply must equal enforced supply ${X(a,18)}.`);const c=Number(Nt(l.lunchBurstFeeTier.value||"10000","Lunch burst fee tier"));if(c!==1e4)throw new Error("Lunch launcher requires fee tier 10000.");const u=l.lunchBurstRouter.value.trim()||j.router;if(!Y(u))throw new Error("Lunch burst router is invalid.");const d=me(l.lunchBurstDevBuyEth.value||"0","Lunch burst dev buy"),b=d>0n?1n:0n,f=wn(l.lunchBurstSalt.value.trim());l.lunchBurstSalt.value.trim()||(l.lunchBurstSalt.value=f);const p={image:l.lunchBurstImage.value.trim(),banner:l.lunchBurstBanner.value.trim(),description:l.lunchBurstDescription.value.trim(),website:l.lunchBurstWebsite.value.trim(),twitter:l.lunchBurstTwitter.value.trim(),telegram:l.lunchBurstTelegram.value.trim()},h=await t.predictTokenAddress(o,s,i,e,f),m=n+d;if(await y.provider.getBalance(e)<=m)throw new Error(`Launcher balance is below ${W(m)} ETH plus gas.`);const g=await Lo(e),$=g.reduce((T,S)=>T+S.amountIn,0n);return{primary:e,launcher:t,launchFee:n,enforcedSupply:a,xToken:r,name:o,symbol:s,totalSupply:i,fee:c,routerAddress:u,devBuy:d,initialBuyFlag:b,userSalt:f,meta:p,predictedToken:h,launchValue:m,buyers:g,buyerValue:$}}async function Lo(e){const t=[],n=new Set([e.toLowerCase()]),a=new Set;for(let r=0;r<25;r++){if(!l[`lunchBurstBuyerEnabled${r}`].checked)continue;const o=l[`lunchBurstBuyerKey${r}`].value.trim();if(!o)throw new Error(`Burst buyer ${r+1} private key is required.`);const s=o.startsWith("0x")?o:`0x${o}`;if(!/^0x[0-9a-fA-F]{64}$/.test(s))throw new Error(`Burst buyer ${r+1} private key must be a 64-character hex string.`);const i=new K(s,y.provider),c=i.address.toLowerCase();if(n.has(c))throw new Error(`Duplicate or launcher burst wallet: ${i.address}`);n.add(c);const u=l[`lunchBurstBuyerAddress${r}`].value.trim()||i.address;if(!Y(u)||u===he)throw new Error(`Burst buyer ${r+1} recipient is invalid.`);const d=u.toLowerCase();if(a.has(d))throw new Error(`Duplicate burst recipient: ${u}`);a.add(d);const b=me(l[`lunchBurstBuyerAmount${r}`].value,`Burst buyer ${r+1} amount`),f=Me(l[`lunchBurstBuyerMinOut${r}`].value,18,`Burst buyer ${r+1} minimum output`);if(b<=0n||f<=0n)throw new Error(`Burst buyer ${r+1} amount and minimum output must be nonzero.`);const p=await y.provider.getBalance(i.address);if(p<=b)throw new Error(`Burst buyer ${r+1} ${i.address} lacks ETH for buy amount plus gas.`);t.push({index:r,wallet:i,recipient:u,amountIn:b,minOut:f,balance:p})}return t}function gn(e){return new _(j.launchContract,hr,e)}async function kn(){if(!y.provider||!y.signer)throw new Error("Connect primary wallet first.");const e=await y.provider.getNetwork();if(e.chainId!==BigInt(j.id))throw new Error(`Wrong network. Expected ${j.name} chain ${j.id}, connected to ${e.chainId}.`)}function Po(e){const t=new wt(hr);for(const n of e)if(n.address.toLowerCase()===j.launchContract.toLowerCase())try{const a=t.parseLog(n);if((a==null?void 0:a.name)==="V3TokenLaunched")return{token:a.args.token,tokenId:a.args.tokenId,pool:a.args.pool,fee:a.args.fee}}catch{}return null}function cn(e){return`${j.explorerUrl}tx/${e}`}function dn(e){return`${j.explorerUrl}address/${e}`}async function k0(){const e=document.querySelector("#verifyResult");try{const t=Io();e.textContent="Waiting for Blockscout/RPC indexing, then submitting verification...";const n=await kd(t,Oa());e.textContent=`Verification submitted. GUID: ${n}`}catch(t){e.textContent=t.shortMessage||t.message,w(`Verification failed: ${t.shortMessage||t.message}`)}}async function kd(e,t){await Sd(e);let n;for(let a=1;a<=5;a++)try{return w(`Verification attempt ${a}/5...`),await $d(e,t)}catch(r){n=r;const o=r.shortMessage||r.message||"";if(/already verified/i.test(o))return"already verified";a<5&&(w(`Verification attempt ${a} failed: ${o}. Retrying in 15s...`),await qt(15e3))}throw n}async function $d(e,t){var s;l.verifyAddress.value=e;const n=l.verifyConstructorArgs.value.trim().replace(/^0x/,"")||Cd(t),a=new FormData;a.append("contractaddress",e),a.append("sourceCode",JSON.stringify(dt.standardJsonInput)),a.append("contractname",l.verifyContractName.value.trim()||dt.contractName),a.append("codeformat","solidity-standard-json-input"),a.append("compilerversion",l.verifyCompiler.value.trim()||dt.compilerVersion),a.append("optimizationUsed","1"),a.append("runs",String((s=dt.optimizer)==null?void 0:s.runs)),a.append("constructorArguments",n),a.append("evmversion",dt.evmVersion),w(`Submitting Blockscout verification for ${e}...`);const r=await fetch(`${oe.blockscoutApiUrl}?module=contract&action=verifysourcecode`,{method:"POST",body:a}),o=await r.json();if(!r.ok||o.status==="0")throw new Error(o.result||o.message||`HTTP ${r.status}`);return l.verifyGuid.value=o.result,w(`Blockscout verification submitted for ${e}. GUID: ${o.result}`),o.result}async function Sd(e){for(let t=1;t<=12;t++){const n=await y.provider.getCode(e);if(n&&n!=="0x"){w(`Deployed bytecode visible on RPC for ${R(e)}.`),t>1&&await qt(1e4);return}w(`Waiting for deployed bytecode ${t}/12...`),await qt(5e3)}throw new Error("Deployed bytecode was not visible after waiting.")}function qt(e){return new Promise(t=>setTimeout(t,e))}async function Ed(){const e=document.querySelector("#verifyResult"),t=l.verifyGuid.value.trim();if(!t){e.textContent="Enter a verification GUID first.";return}try{const n=`${oe.blockscoutApiUrl}?module=contract&action=checkverifystatus&guid=${encodeURIComponent(t)}`,a=await fetch(n),r=await a.json();e.textContent=r.result||r.message||`HTTP ${a.status}`,w(`Verification status: ${e.textContent}`)}catch(n){e.textContent=n.shortMessage||n.message,w(`Verification status failed: ${n.shortMessage||n.message}`)}}function Td(){try{const e=Io();window.open(`${oe.blockExplorerUrl}address/${e}`,"_blank","noopener,noreferrer")}catch(e){document.querySelector("#verifyResult").textContent=e.message}}function Io(){var t;const e=l.verifyAddress.value.trim()||l.contractAddress.value.trim()||((t=y.contract)==null?void 0:t.target);if(!Y(e||""))throw new Error("A valid contract address is required for verification.");return e}function Cd(e=Oa()){const n=ue.abi.find(r=>r.type==="constructor").inputs.map(r=>r.type);return A0.defaultAbiCoder().encode(n,e).replace(/^0x/,"")}function Bd(){return y.generatedWallets.map((e,t)=>`Wallet ${t+1}
Address: ${e.address}
Private Key: ${e.privateKey}`).join(`

`)}async function Mo(e,t,n=l.buyEthAmount.value.trim()){const a=y.contract.target,r=e.provider,o=$e(),s=await st(r,o,a);if(!s.exists)throw new Error(`No liquidity pool found for this token: ${s.error}`);const i=l.buyRecipient.value.trim()||t,c=me(n,"ETH per buy"),u=Oe(l.buyDeadline.value),d=l.buyMinTokens.value.trim();if(s.version==="v3"){const m=new _(s.swapRouter,[Re[0]],e),v=await kt(s.poolAddress,!s.isToken0,c,r),g=d&&d!=="0"?await $0(d):Fe(v,5),$={tokenIn:s.wethAddress,tokenOut:a,fee:s.poolFee,recipient:i,amountIn:c,amountOutMinimum:g,sqrtPriceLimitX96:0n};return m.exactInputSingle($,{value:c})}const b=new _(o,we,e),p=[await b.WETH(),a],h=d?await $0(d):0n;return b.swapExactETHForTokensSupportingFeeOnTransferTokens(h,p,i,u,{value:c})}function Rd(e){return e.split(/\r?\n/).map(t=>t.trim()).filter(Boolean).map(t=>{const[n,a]=t.split(/[,\s]+/).map(r=>r.trim()).filter(Boolean);return{privateKey:n,ethAmount:a||l.buyEthAmount.value.trim()}})}async function $0(e){const n=await $n(y.signer||te()).decimals();return _t(e,n,"Token amount")}function Do(e){return new _($e(),we,e)}function $n(e){return new _(y.contract.target,ue.abi,e)}function $e(){return l.router.value.trim()||oe.router}function te(){return new R0(Ha(l.rpcUrl.value.trim()||"/rpc"))}function Ha(e){return e.startsWith("/")?`${window.location.origin}${e}`:e}function Oe(e){const t=Number(e||"20");return Math.floor(Date.now()/1e3)+Math.max(1,t)*60}const Ad=["ponsDevWalletSelect","pwponsDevWalletSelect","pwponsWashDevWalletSelect","lunchDevWalletSelect","lunchBurstDevWalletSelect","lunchComboDevWalletSelect","dopplerDevWalletSelect"];function lt(){if(B.activeProjectId)for(const e of Ad)document.querySelector(`#${e}`)&&Kl(e)}const Ld=new Set(["pons","ponsWash","lunch","lunchBurst","lunchCombo","doppler"]);function Ua(e){for(const t of document.querySelectorAll("[data-tab]"))t.classList.toggle("active",t.dataset.tab===e);for(const t of document.querySelectorAll("[data-tab-panel]"))t.classList.toggle("active",t.dataset.tabPanel===e);Ld.has(e)&&lt()}function Pd(e){return Array.isArray(e)?e.map(String).join(", "):String(e)}function A(e){var r,o,s,i;const t=((r=e==null?void 0:e.info)==null?void 0:r.error)||(e==null?void 0:e.error),n=typeof t=="string"?t:t==null?void 0:t.message,a=((o=e==null?void 0:e.data)==null?void 0:o.message)||((i=(s=e==null?void 0:e.info)==null?void 0:s.payload)==null?void 0:i.method);return[e==null?void 0:e.shortMessage,e==null?void 0:e.reason,n,e==null?void 0:e.message,a].filter(Boolean).join(" | ")}function se(){if(!y.signer)throw new Error("Connect MetaMask or RPC wallet first")}function Et(){if(se(),!y.contract)throw new Error("Deploy or attach a contract first")}function Fo(){if(!y.contract)throw new Error("Enter a token contract address and click Attach first")}Ll().then(async()=>{await Fa(),Nl()});export{Wn as _};
