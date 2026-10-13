var Ol=0,Uo=1,Fl=2;var ul=1,So=2,Pn=3,Sn=0,$e=1,an=2;var Wn=0,Oi=1,or=2,Do=3,No=4,Bl=5,ii=100,zl=101,kl=102,Oo=103,Fo=104,Hl=200,Vl=201,Gl=202,Wl=203,Ra=204,Ca=205,Xl=206,ql=207,Yl=208,Zl=209,Jl=210,$l=211,Kl=212,jl=213,Ql=214,th=0,eh=1,nh=2,cr=3,ih=4,sh=5,rh=6,ah=7,dl=0,oh=1,ch=2,Xn=0,lh=1,hh=2,uh=3,bo=4,dh=5,fh=6;var fl=300,zi=301,ki=302,Pa=303,Ia=304,Vr=306,Ua=1e3,mn=1001,Da=1002,Xe=1003,Bo=1004;var $r=1005;var rn=1006,ph=1007;var ds=1008;var qn=1009,mh=1010,gh=1011,Eo=1012,pl=1013,Vn=1014,Gn=1015,fs=1016,ml=1017,gl=1018,ri=1020,_h=1021,gn=1023,xh=1024,yh=1025,ai=1026,Hi=1027,vh=1028,_l=1029,Mh=1030,xl=1031,yl=1033,Kr=33776,jr=33777,Qr=33778,ta=33779,zo=35840,ko=35841,Ho=35842,Vo=35843,vl=36196,Go=37492,Wo=37496,Xo=37808,qo=37809,Yo=37810,Zo=37811,Jo=37812,$o=37813,Ko=37814,jo=37815,Qo=37816,tc=37817,ec=37818,nc=37819,ic=37820,sc=37821,ea=36492,rc=36494,ac=36495,Sh=36283,oc=36284,cc=36285,lc=36286;var lr=2300,hr=2301,na=2302,hc=2400,uc=2401,dc=2402;var Ml=3e3,oi=3001,bh=3200,Eh=3201,Sl=0,wh=1,on="",Te="srgb",Nn="srgb-linear",wo="display-p3",Gr="display-p3-linear",ur="linear",pe="srgb",dr="rec709",fr="p3";var mi=7680;var fc=519,Th=512,Lh=513,Ah=514,bl=515,Rh=516,Ch=517,Ph=518,Ih=519,pc=35044;var mc="300 es",Na=1035,Un=2e3,pr=2001,Yn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],gc=1234567,as=Math.PI/180,Vi=180/Math.PI;function fi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function To(i,t){return(i%t+t)%t}function Uh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Dh(i,t,e){return i!==t?(e-i)/(t-i):0}function os(i,t,e){return(1-e)*i+e*t}function Nh(i,t,e,n){return os(i,t,1-Math.exp(-e*n))}function Oh(i,t=1){return t-Math.abs(To(i,t*2)-t)}function Fh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Bh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function zh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function kh(i,t){return i+Math.random()*(t-i)}function Hh(i){return i*(.5-Math.random())}function Vh(i){i!==void 0&&(gc=i);let t=gc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Gh(i){return i*as}function Wh(i){return i*Vi}function Oa(i){return(i&i-1)===0&&i!==0}function Xh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function mr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function qh(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),g=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*d,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*x,c*g,a*l);break;case"YXY":i.set(c*g,a*h,c*x,a*l);break;case"ZYZ":i.set(c*x,c*g,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var yn={DEG2RAD:as,RAD2DEG:Vi,generateUUID:fi,clamp:Ie,euclideanModulo:To,mapLinear:Uh,inverseLerp:Dh,lerp:os,damp:Nh,pingpong:Oh,smoothstep:Fh,smootherstep:Bh,randInt:zh,randFloat:kh,randFloatSpread:Hh,seededRandom:Vh,degToRad:Gh,radToDeg:Wh,isPowerOfTwo:Oa,ceilPowerOfTwo:Xh,floorPowerOfTwo:mr,setQuaternionFromProperEuler:qh,normalize:Ge,denormalize:Pi},_t=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Jt=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],g=n[5],x=n[8],v=s[0],p=s[3],u=s[6],L=s[1],_=s[4],E=s[7],N=s[2],P=s[5],R=s[8];return r[0]=o*v+a*L+c*N,r[3]=o*p+a*_+c*P,r[6]=o*u+a*E+c*R,r[1]=l*v+h*L+d*N,r[4]=l*p+h*_+d*P,r[7]=l*u+h*E+d*R,r[2]=f*v+g*L+x*N,r[5]=f*p+g*_+x*P,r[8]=f*u+g*E+x*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=h*o-a*l,f=a*c-h*r,g=l*r-o*c,x=e*d+n*f+s*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/x;return t[0]=d*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=f*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=g*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ia.makeScale(t,e)),this}rotate(t){return this.premultiply(ia.makeRotation(-t)),this}translate(t,e){return this.premultiply(ia.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},ia=new Jt;function El(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function gr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yh(){let i=gr("canvas");return i.style.display="block",i}var _c={};function cs(i){i in _c||(_c[i]=!0,console.warn(i))}var xc=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),yc=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Us={[Nn]:{transfer:ur,primaries:dr,toReference:i=>i,fromReference:i=>i},[Te]:{transfer:pe,primaries:dr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Gr]:{transfer:ur,primaries:fr,toReference:i=>i.applyMatrix3(yc),fromReference:i=>i.applyMatrix3(xc)},[wo]:{transfer:pe,primaries:fr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(yc),fromReference:i=>i.applyMatrix3(xc).convertLinearToSRGB()}},Zh=new Set([Nn,Gr]),he={enabled:!0,_workingColorSpace:Nn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Zh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Us[t].toReference,s=Us[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Us[i].primaries},getTransfer:function(i){return i===on?ur:Us[i].transfer}};function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function sa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var gi,_r=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{gi===void 0&&(gi=gr("canvas")),gi.width=t.width,gi.height=t.height;let n=gi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=gi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=gr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Fi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Fi(e[n]/255)*255):e[n]=Fi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Jh=0,xr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jh++}),this.uuid=fi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ra(s[o].image)):r.push(ra(s[o]))}else r=ra(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ra(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_r.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var $h=0,cn=class i extends Yn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=mn,s=mn,r=rn,o=ds,a=gn,c=qn,l=i.DEFAULT_ANISOTROPY,h=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=fi(),this.name="",this.source=new xr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===oi?Te:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==fl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ua:t.x=t.x-Math.floor(t.x);break;case mn:t.x=t.x<0?0:1;break;case Da:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ua:t.y=t.y-Math.floor(t.y);break;case mn:t.y=t.y<0?0:1;break;case Da:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Te?oi:Ml}set encoding(t){cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===oi?Te:on}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=fl;cn.DEFAULT_ANISOTROPY=1;var Ue=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],d=c[8],f=c[1],g=c[5],x=c[9],v=c[2],p=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-v)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+v)<.1&&Math.abs(x+p)<.1&&Math.abs(l+g+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,E=(g+1)/2,N=(u+1)/2,P=(h+f)/4,R=(d+v)/4,K=(x+p)/4;return _>E&&_>N?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=P/n,r=R/n):E>N?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=P/s,r=K/s):N<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(N),n=R/r,s=K/r),this.set(n,s,r,e),this}let L=Math.sqrt((p-x)*(p-x)+(d-v)*(d-v)+(f-h)*(f-h));return Math.abs(L)<.001&&(L=1),this.x=(p-x)/L,this.y=(d-v)/L,this.z=(f-h)/L,this.w=Math.acos((l+g+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fa=class extends Yn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(cs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===oi?Te:on),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new cn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new xr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},On=class extends Fa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},yr=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ba=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],g=r[o+1],x=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=g,t[e+2]=x,t[e+3]=v;return}if(d!==v||c!==f||l!==g||h!==x){let p=1-a,u=c*f+l*g+h*x+d*v,L=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let N=Math.sqrt(_),P=Math.atan2(N,u*L);p=Math.sin(p*P)/N,a=Math.sin(a*P)/N}let E=a*L;if(c=c*p+f*E,l=l*p+g*E,h=h*p+x*E,d=d*p+v*E,p===1-a){let N=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=N,l*=N,h*=N,d*=N}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],f=r[o+1],g=r[o+2],x=r[o+3];return t[e]=a*x+h*d+c*g-l*f,t[e+1]=c*x+h*f+l*d-a*g,t[e+2]=l*x+h*g+a*f-c*d,t[e+3]=h*x-a*d-c*f-l*g,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),f=c(n/2),g=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"YXZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"ZXY":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"ZYX":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"YZX":this._x=f*h*d+l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d-f*g*x;break;case"XZY":this._x=f*h*d-l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d+f*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-c)*g,this._y=(r-l)*g,this._z=(o-s)*g}else if(n>a&&n>d){let g=2*Math.sqrt(1+n-a-d);this._w=(h-c)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+l)/g}else if(a>d){let g=2*Math.sqrt(1+a-n-d);this._w=(r-l)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(c+h)/g}else{let g=2*Math.sqrt(1+d-n-a);this._w=(o-s)/g,this._x=(r+l)/g,this._y=(c+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let g=1-e;return this._w=g*o+e*this._w,this._x=g*n+e*this._x,this._y=g*s+e*this._y,this._z=g*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return aa.copy(this).projectOnVector(t),this.sub(aa)}reflect(t){return this.sub(aa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},aa=new V,vc=new Zn,ci=class{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ds.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ds.copy(n.boundingBox)),Ds.applyMatrix4(t.matrixWorld),this.union(Ds)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ns),Ns.subVectors(this.max,ns),_i.subVectors(t.a,ns),xi.subVectors(t.b,ns),yi.subVectors(t.c,ns),Fn.subVectors(xi,_i),Bn.subVectors(yi,xi),jn.subVectors(_i,yi);let e=[0,-Fn.z,Fn.y,0,-Bn.z,Bn.y,0,-jn.z,jn.y,Fn.z,0,-Fn.x,Bn.z,0,-Bn.x,jn.z,0,-jn.x,-Fn.y,Fn.x,0,-Bn.y,Bn.x,0,-jn.y,jn.x,0];return!oa(e,_i,xi,yi,Ns)||(e=[1,0,0,0,1,0,0,0,1],!oa(e,_i,xi,yi,Ns))?!1:(Os.crossVectors(Fn,Bn),e=[Os.x,Os.y,Os.z],oa(e,_i,xi,yi,Ns))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},wn=[new V,new V,new V,new V,new V,new V,new V,new V],dn=new V,Ds=new ci,_i=new V,xi=new V,yi=new V,Fn=new V,Bn=new V,jn=new V,ns=new V,Ns=new V,Os=new V,Qn=new V;function oa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Qn.fromArray(i,r);let a=s.x*Math.abs(Qn.x)+s.y*Math.abs(Qn.y)+s.z*Math.abs(Qn.z),c=t.dot(Qn),l=e.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Kh=new ci,is=new V,ca=new V,Gi=class{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Kh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;is.subVectors(t,this.center);let e=is.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(is.copy(t.center).add(ca)),this.expandByPoint(is.copy(t.center).sub(ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Tn=new V,la=new V,Fs=new V,zn=new V,ha=new V,Bs=new V,ua=new V,vr=class{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Tn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Tn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Tn.copy(this.origin).addScaledVector(this.direction,e),Tn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){la.copy(t).add(e).multiplyScalar(.5),Fs.copy(e).sub(t).normalize(),zn.copy(this.origin).sub(la);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Fs),a=zn.dot(this.direction),c=-zn.dot(Fs),l=zn.lengthSq(),h=Math.abs(1-o*o),d,f,g,x;if(h>0)if(d=o*c-a,f=o*a-c,x=r*h,d>=0)if(f>=-x)if(f<=x){let v=1/h;d*=v,f*=v,g=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f<=-x?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l):f<=x?(d=0,f=Math.min(Math.max(-r,-c),r),g=f*(f+2*c)+l):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(la).addScaledVector(Fs,f),g}intersectSphere(t,e){Tn.subVectors(t.center,this.origin);let n=Tn.dot(this.direction),s=Tn.dot(Tn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,c=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,c=(t.min.z-f.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Tn)!==null}intersectTriangle(t,e,n,s,r){ha.subVectors(e,t),Bs.subVectors(n,t),ua.crossVectors(ha,Bs);let o=this.direction.dot(ua),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zn.subVectors(this.origin,t);let c=a*this.direction.dot(Bs.crossVectors(zn,Bs));if(c<0)return null;let l=a*this.direction.dot(ha.cross(zn));if(l<0||c+l>o)return null;let h=-a*zn.dot(ua);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class i{constructor(t,e,n,s,r,o,a,c,l,h,d,f,g,x,v,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,v,p)}set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,v,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=f,u[3]=g,u[7]=x,u[11]=v,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),r=1/vi.setFromMatrixColumn(t,1).length(),o=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,g=o*d,x=a*h,v=a*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=g+x*l,e[5]=f-v*l,e[9]=-a*c,e[2]=v-f*l,e[6]=x+g*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,g=c*d,x=l*h,v=l*d;e[0]=f+v*a,e[4]=x*a-g,e[8]=o*l,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=g*a-x,e[6]=v+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,g=c*d,x=l*h,v=l*d;e[0]=f-v*a,e[4]=-o*d,e[8]=x+g*a,e[1]=g+x*a,e[5]=o*h,e[9]=v-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,g=o*d,x=a*h,v=a*d;e[0]=c*h,e[4]=x*l-g,e[8]=f*l+v,e[1]=c*d,e[5]=v*l+f,e[9]=g*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,g=o*l,x=a*c,v=a*l;e[0]=c*h,e[4]=v-f*d,e[8]=x*d+g,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=g*d+x,e[10]=f-v*d}else if(t.order==="XZY"){let f=o*c,g=o*l,x=a*c,v=a*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=f*d+v,e[5]=o*h,e[9]=g*d-x,e[2]=x*d-g,e[6]=a*h,e[10]=v*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(jh,t,Qh)}lookAt(t,e,n){let s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),kn.crossVectors(n,je),kn.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),kn.crossVectors(n,je)),kn.normalize(),zs.crossVectors(je,kn),s[0]=kn.x,s[4]=zs.x,s[8]=je.x,s[1]=kn.y,s[5]=zs.y,s[9]=je.y,s[2]=kn.z,s[6]=zs.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],g=n[13],x=n[2],v=n[6],p=n[10],u=n[14],L=n[3],_=n[7],E=n[11],N=n[15],P=s[0],R=s[4],K=s[8],S=s[12],T=s[1],Z=s[5],et=s[9],xt=s[13],O=s[2],Y=s[6],nt=s[10],$=s[14],F=s[3],it=s[7],ct=s[11],ft=s[15];return r[0]=o*P+a*T+c*O+l*F,r[4]=o*R+a*Z+c*Y+l*it,r[8]=o*K+a*et+c*nt+l*ct,r[12]=o*S+a*xt+c*$+l*ft,r[1]=h*P+d*T+f*O+g*F,r[5]=h*R+d*Z+f*Y+g*it,r[9]=h*K+d*et+f*nt+g*ct,r[13]=h*S+d*xt+f*$+g*ft,r[2]=x*P+v*T+p*O+u*F,r[6]=x*R+v*Z+p*Y+u*it,r[10]=x*K+v*et+p*nt+u*ct,r[14]=x*S+v*xt+p*$+u*ft,r[3]=L*P+_*T+E*O+N*F,r[7]=L*R+_*Z+E*Y+N*it,r[11]=L*K+_*et+E*nt+N*ct,r[15]=L*S+_*xt+E*$+N*ft,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],d=t[6],f=t[10],g=t[14],x=t[3],v=t[7],p=t[11],u=t[15];return x*(+r*c*d-s*l*d-r*a*f+n*l*f+s*a*g-n*c*g)+v*(+e*c*g-e*l*f+r*o*f-s*o*g+s*l*h-r*c*h)+p*(+e*l*d-e*a*g-r*o*d+n*o*g+r*a*h-n*l*h)+u*(-s*a*h-e*c*d+e*a*f+s*o*d-n*o*f+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],g=t[11],x=t[12],v=t[13],p=t[14],u=t[15],L=d*p*l-v*f*l+v*c*g-a*p*g-d*c*u+a*f*u,_=x*f*l-h*p*l-x*c*g+o*p*g+h*c*u-o*f*u,E=h*v*l-x*d*l+x*a*g-o*v*g-h*a*u+o*d*u,N=x*d*c-h*v*c-x*a*f+o*v*f+h*a*p-o*d*p,P=e*L+n*_+s*E+r*N;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/P;return t[0]=L*R,t[1]=(v*f*r-d*p*r-v*s*g+n*p*g+d*s*u-n*f*u)*R,t[2]=(a*p*r-v*c*r+v*s*l-n*p*l-a*s*u+n*c*u)*R,t[3]=(d*c*r-a*f*r-d*s*l+n*f*l+a*s*g-n*c*g)*R,t[4]=_*R,t[5]=(h*p*r-x*f*r+x*s*g-e*p*g-h*s*u+e*f*u)*R,t[6]=(x*c*r-o*p*r-x*s*l+e*p*l+o*s*u-e*c*u)*R,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*g+e*c*g)*R,t[8]=E*R,t[9]=(x*d*r-h*v*r-x*n*g+e*v*g+h*n*u-e*d*u)*R,t[10]=(o*v*r-x*a*r+x*n*l-e*v*l-o*n*u+e*a*u)*R,t[11]=(h*a*r-o*d*r-h*n*l+e*d*l+o*n*g-e*a*g)*R,t[12]=N*R,t[13]=(h*v*s-x*d*s+x*n*f-e*v*f-h*n*p+e*d*p)*R,t[14]=(x*a*s-o*v*s-x*n*c+e*v*c+o*n*p-e*a*p)*R,t[15]=(o*d*s-h*a*s+h*n*c-e*d*c-o*n*f+e*a*f)*R,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,d=a+a,f=r*l,g=r*h,x=r*d,v=o*h,p=o*d,u=a*d,L=c*l,_=c*h,E=c*d,N=n.x,P=n.y,R=n.z;return s[0]=(1-(v+u))*N,s[1]=(g+E)*N,s[2]=(x-_)*N,s[3]=0,s[4]=(g-E)*P,s[5]=(1-(f+u))*P,s[6]=(p+L)*P,s[7]=0,s[8]=(x+_)*R,s[9]=(p-L)*R,s[10]=(1-(f+v))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=vi.set(s[0],s[1],s[2]).length(),o=vi.set(s[4],s[5],s[6]).length(),a=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);let l=1/r,h=1/o,d=1/a;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=d,fn.elements[9]*=d,fn.elements[10]*=d,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Un){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),g,x;if(a===Un)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===pr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Un){let c=this.elements,l=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*l,g=(n+s)*h,x,v;if(a===Un)x=(o+r)*d,v=-2*d;else if(a===pr)x=r*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-g,c[2]=0,c[6]=0,c[10]=v,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},vi=new V,fn=new be,jh=new V(0,0,0),Qh=new V(1,1,1),kn=new V,zs=new V,je=new V,Mc=new be,Sc=new Zn,Mr=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],g=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ie(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ie(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Mc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Mc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Sc.setFromEuler(this),this.setFromQuaternion(Sc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mr.DEFAULT_ORDER="XYZ";var Sr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},tu=0,bc=new V,Mi=new Zn,Ln=new be,ks=new V,ss=new V,eu=new V,nu=new Zn,Ec=new V(1,0,0),wc=new V(0,1,0),Tc=new V(0,0,1),iu={type:"added"},su={type:"removed"},ze=class i extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new V,e=new Mr,n=new Zn,s=new V(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new be},normalMatrix:{value:new Jt}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(Ec,t)}rotateY(t){return this.rotateOnAxis(wc,t)}rotateZ(t){return this.rotateOnAxis(Tc,t)}translateOnAxis(t,e){return bc.copy(t).applyQuaternion(this.quaternion),this.position.add(bc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ec,t)}translateY(t){return this.translateOnAxis(wc,t)}translateZ(t){return this.translateOnAxis(Tc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ks.copy(t):ks.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(ss,ks,this.up):Ln.lookAt(ks,ss,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(Ln),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(iu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(su)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,eu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,nu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),g=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ze.DEFAULT_UP=new V(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pn=new V,An=new V,da=new V,Rn=new V,Si=new V,bi=new V,Lc=new V,fa=new V,pa=new V,ma=new V,Hs=!1,Ii=class i{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),An.subVectors(n,e),da.subVectors(t,e);let o=pn.dot(pn),a=pn.dot(An),c=pn.dot(da),l=An.dot(An),h=An.dot(da),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,g=(l*c-a*h)*f,x=(o*h-a*c)*f;return r.set(1-g-x,x,g)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Rn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Rn.x),c.addScaledVector(o,Rn.y),c.addScaledVector(a,Rn.z),c)}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),An.subVectors(t,e),pn.cross(An).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),An.subVectors(this.a,this.b),pn.cross(An).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Si.subVectors(s,n),bi.subVectors(r,n),fa.subVectors(t,n);let c=Si.dot(fa),l=bi.dot(fa);if(c<=0&&l<=0)return e.copy(n);pa.subVectors(t,s);let h=Si.dot(pa),d=bi.dot(pa);if(h>=0&&d<=h)return e.copy(s);let f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Si,o);ma.subVectors(t,r);let g=Si.dot(ma),x=bi.dot(ma);if(x>=0&&g<=x)return e.copy(r);let v=g*l-c*x;if(v<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(n).addScaledVector(bi,a);let p=h*x-g*d;if(p<=0&&d-h>=0&&g-x>=0)return Lc.subVectors(r,s),a=(d-h)/(d-h+(g-x)),e.copy(s).addScaledVector(Lc,a);let u=1/(p+v+f);return o=v*u,a=f*u,e.copy(n).addScaledVector(Si,o).addScaledVector(bi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},wl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function ga(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var $t=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Te){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=To(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ga(o,r,t+1/3),this.g=ga(o,r,t),this.b=ga(o,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=Te){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Te){let n=wl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=sa(t.r),this.g=sa(t.g),this.b=sa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Te){return he.fromWorkingColorSpace(He.copy(this),t),Math.round(Ie(He.r*255,0,255))*65536+Math.round(Ie(He.g*255,0,255))*256+Math.round(Ie(He.b*255,0,255))}getHexString(t=Te){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace(He.copy(this),e);let n=He.r,s=He.g,r=He.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=Te){he.fromWorkingColorSpace(He.copy(this),t);let e=He.r,n=He.g,s=He.b;return t!==Te?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Hn),this.setHSL(Hn.h+t,Hn.s+e,Hn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Hn),t.getHSL(Vs);let n=os(Hn.h,Vs.h,e),s=os(Hn.s,Vs.s,e),r=os(Hn.l,Vs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},He=new $t;$t.NAMES=wl;var ru=0,Jn=class extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=Oi,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ra,this.blendDst=Ca,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ra&&(n.blendSrc=this.blendSrc),this.blendDst!==Ca&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Wi=class extends Jn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Se=new V,Gs=new _t,qe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=pc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gs.fromBufferAttribute(this,e),Gs.applyMatrix3(t),this.setXY(e,Gs.x,Gs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Pi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==pc&&(t.usage=this.usage),t}};var br=class extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Er=class extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ye=class extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}};var au=0,sn=new be,_a=new ze,Ei=new V,Qe=new ci,rs=new ci,Pe=new V,en=class i extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(El(t)?Er:br)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return _a.lookAt(t),_a.updateMatrix(),this.applyMatrix4(_a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ye(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new V,1/0);return}if(t){let n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];rs.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(Qe.min,rs.min),Qe.expandByPoint(Pe),Pe.addVectors(Qe.max,rs.max),Qe.expandByPoint(Pe)):(Qe.expandByPoint(rs.min),Qe.expandByPoint(rs.max))}Qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Pe.fromBufferAttribute(a,l),c&&(Ei.fromBufferAttribute(t,l),Pe.add(Ei)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let T=0;T<a;T++)l[T]=new V,h[T]=new V;let d=new V,f=new V,g=new V,x=new _t,v=new _t,p=new _t,u=new V,L=new V;function _(T,Z,et){d.fromArray(s,T*3),f.fromArray(s,Z*3),g.fromArray(s,et*3),x.fromArray(o,T*2),v.fromArray(o,Z*2),p.fromArray(o,et*2),f.sub(d),g.sub(d),v.sub(x),p.sub(x);let xt=1/(v.x*p.y-p.x*v.y);isFinite(xt)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(g,-v.y).multiplyScalar(xt),L.copy(g).multiplyScalar(v.x).addScaledVector(f,-p.x).multiplyScalar(xt),l[T].add(u),l[Z].add(u),l[et].add(u),h[T].add(L),h[Z].add(L),h[et].add(L))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let T=0,Z=E.length;T<Z;++T){let et=E[T],xt=et.start,O=et.count;for(let Y=xt,nt=xt+O;Y<nt;Y+=3)_(n[Y+0],n[Y+1],n[Y+2])}let N=new V,P=new V,R=new V,K=new V;function S(T){R.fromArray(r,T*3),K.copy(R);let Z=l[T];N.copy(Z),N.sub(R.multiplyScalar(R.dot(Z))).normalize(),P.crossVectors(K,Z);let xt=P.dot(h[T])<0?-1:1;c[T*4]=N.x,c[T*4+1]=N.y,c[T*4+2]=N.z,c[T*4+3]=xt}for(let T=0,Z=E.length;T<Z;++T){let et=E[T],xt=et.start,O=et.count;for(let Y=xt,nt=xt+O;Y<nt;Y+=3)S(n[Y+0]),S(n[Y+1]),S(n[Y+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);let s=new V,r=new V,o=new V,a=new V,c=new V,l=new V,h=new V,d=new V;if(t)for(let f=0,g=t.count;f<g;f+=3){let x=t.getX(f+0),v=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,g=e.count;f<g;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,d=a.normalized,f=new l.constructor(c.length*h),g=0,x=0;for(let v=0,p=c.length;v<p;v++){a.isInterleavedBufferAttribute?g=c[v]*a.data.stride+a.offset:g=c[v]*h;for(let u=0;u<h;u++)f[x++]=l[g++]}return new qe(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let f=l[h],g=t(f,n);c.push(g)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){let g=l[d];h.push(g.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let f=0,g=d.length;f<g;f++)h.push(d[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ac=new be,ti=new vr,Ws=new Gi,Rc=new V,wi=new V,Ti=new V,Li=new V,xa=new V,Xs=new V,qs=new _t,Ys=new _t,Zs=new _t,Cc=new V,Pc=new V,Ic=new V,Js=new V,$s=new V,Fe=class extends ze{constructor(t=new en,e=new Wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Xs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(xa.fromBufferAttribute(d,t),o?Xs.addScaledVector(xa,h):Xs.addScaledVector(xa.sub(e),h))}e.add(Xs)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ws.copy(n.boundingSphere),Ws.applyMatrix4(r),ti.copy(t.ray).recast(t.near),!(Ws.containsPoint(ti.origin)===!1&&(ti.intersectSphere(Ws,Rc)===null||ti.origin.distanceToSquared(Rc)>(t.far-t.near)**2))&&(Ac.copy(r).invert(),ti.copy(t.ray).applyMatrix4(Ac),!(n.boundingBox!==null&&ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ti)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,v=f.length;x<v;x++){let p=f[x],u=o[p.materialIndex],L=Math.max(p.start,g.start),_=Math.min(a.count,Math.min(p.start+p.count,g.start+g.count));for(let E=L,N=_;E<N;E+=3){let P=a.getX(E),R=a.getX(E+1),K=a.getX(E+2);s=Ks(this,u,t,n,l,h,d,P,R,K),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),v=Math.min(a.count,g.start+g.count);for(let p=x,u=v;p<u;p+=3){let L=a.getX(p),_=a.getX(p+1),E=a.getX(p+2);s=Ks(this,o,t,n,l,h,d,L,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,v=f.length;x<v;x++){let p=f[x],u=o[p.materialIndex],L=Math.max(p.start,g.start),_=Math.min(c.count,Math.min(p.start+p.count,g.start+g.count));for(let E=L,N=_;E<N;E+=3){let P=E,R=E+1,K=E+2;s=Ks(this,u,t,n,l,h,d,P,R,K),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),v=Math.min(c.count,g.start+g.count);for(let p=x,u=v;p<u;p+=3){let L=p,_=p+1,E=p+2;s=Ks(this,o,t,n,l,h,d,L,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function ou(i,t,e,n,s,r,o,a){let c;if(t.side===$e?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Sn,a),c===null)return null;$s.copy(a),$s.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo($s);return l<e.near||l>e.far?null:{distance:l,point:$s.clone(),object:i}}function Ks(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,wi),i.getVertexPosition(c,Ti),i.getVertexPosition(l,Li);let h=ou(i,t,e,n,wi,Ti,Li,Js);if(h){s&&(qs.fromBufferAttribute(s,a),Ys.fromBufferAttribute(s,c),Zs.fromBufferAttribute(s,l),h.uv=Ii.getInterpolation(Js,wi,Ti,Li,qs,Ys,Zs,new _t)),r&&(qs.fromBufferAttribute(r,a),Ys.fromBufferAttribute(r,c),Zs.fromBufferAttribute(r,l),h.uv1=Ii.getInterpolation(Js,wi,Ti,Li,qs,Ys,Zs,new _t),h.uv2=h.uv1),o&&(Cc.fromBufferAttribute(o,a),Pc.fromBufferAttribute(o,c),Ic.fromBufferAttribute(o,l),h.normal=Ii.getInterpolation(Js,wi,Ti,Li,Cc,Pc,Ic,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new V,materialIndex:0};Ii.getNormal(wi,Ti,Li,d.normal),h.face=d}return h}var ps=class i extends en{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],f=0,g=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ye(l,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(d,2));function x(v,p,u,L,_,E,N,P,R,K,S){let T=E/R,Z=N/K,et=E/2,xt=N/2,O=P/2,Y=R+1,nt=K+1,$=0,F=0,it=new V;for(let ct=0;ct<nt;ct++){let ft=ct*Z-xt;for(let Mt=0;Mt<Y;Mt++){let st=Mt*T-et;it[v]=st*L,it[p]=ft*_,it[u]=O,l.push(it.x,it.y,it.z),it[v]=0,it[p]=0,it[u]=P>0?1:-1,h.push(it.x,it.y,it.z),d.push(Mt/R),d.push(1-ct/K),$+=1}}for(let ct=0;ct<K;ct++)for(let ft=0;ft<R;ft++){let Mt=f+ft+Y*ct,st=f+ft+Y*(ct+1),I=f+(ft+1)+Y*(ct+1),C=f+(ft+1)+Y*ct;c.push(Mt,st,C),c.push(st,I,C),F+=6}a.addGroup(g,F,S),g+=F,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Xi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function We(i){let t={};for(let e=0;e<i.length;e++){let n=Xi(i[e]);for(let s in n)t[s]=n[s]}return t}function cu(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Tl(i){return i.getRenderTarget()===null?i.outputColorSpace:he.workingColorSpace}var lu={clone:Xi,merge:We},hu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends Jn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hu,this.fragmentShader=uu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=cu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},wr=class extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=Un}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ve=class extends wr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Vi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vi*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(as*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ai=-90,Ri=1,za=class extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ve(Ai,Ri,t,e);s.layers=this.layers,this.add(s);let r=new Ve(Ai,Ri,t,e);r.layers=this.layers,this.add(r);let o=new Ve(Ai,Ri,t,e);o.layers=this.layers,this.add(o);let a=new Ve(Ai,Ri,t,e);a.layers=this.layers,this.add(a);let c=new Ve(Ai,Ri,t,e);c.layers=this.layers,this.add(c);let l=new Ve(Ai,Ri,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),g=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,f,g),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},Tr=class extends cn{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ka=class extends On{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(cs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===oi?Te:on),this.texture=new Tr(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ps(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:Wn});r.uniforms.tEquirect.value=e;let o=new Fe(s,r),a=e.minFilter;return e.minFilter===ds&&(e.minFilter=rn),new za(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},ya=new V,du=new V,fu=new Jt,In=class{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=ya.subVectors(n,e).cross(du.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(ya),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||fu.getNormalMatrix(t),s=this.coplanarPoint(ya).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ei=new Gi,js=new V,ms=class{constructor(t=new In,e=new In,n=new In,s=new In,r=new In,o=new In){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Un){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],f=s[7],g=s[8],x=s[9],v=s[10],p=s[11],u=s[12],L=s[13],_=s[14],E=s[15];if(n[0].setComponents(c-r,f-l,p-g,E-u).normalize(),n[1].setComponents(c+r,f+l,p+g,E+u).normalize(),n[2].setComponents(c+o,f+h,p+x,E+L).normalize(),n[3].setComponents(c-o,f-h,p-x,E-L).normalize(),n[4].setComponents(c-a,f-d,p-v,E-_).normalize(),e===Un)n[5].setComponents(c+a,f+d,p+v,E+_).normalize();else if(e===pr)n[5].setComponents(a,d,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(t){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(js.x=s.normal.x>0?t.max.x:t.min.x,js.y=s.normal.y>0?t.max.y:t.min.y,js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(js)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ll(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function pu(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let d=l.array,f=l.usage,g=d.byteLength,x=i.createBuffer();i.bindBuffer(h,x),i.bufferData(h,d,f),l.onUploadCallback();let v;if(d instanceof Float32Array)v=i.FLOAT;else if(d instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=i.SHORT;else if(d instanceof Uint32Array)v=i.UNSIGNED_INT;else if(d instanceof Int32Array)v=i.INT;else if(d instanceof Int8Array)v=i.BYTE;else if(d instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:x,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:g}}function r(l,h,d){let f=h.array,g=h._updateRange,x=h.updateRanges;if(i.bindBuffer(d,l),g.count===-1&&x.length===0&&i.bufferSubData(d,0,f),x.length!==0){for(let v=0,p=x.length;v<p;v++){let u=x[v];e?i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}g.count!==-1&&(e?i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f,g.offset,g.count):i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let d=n.get(l);if(d===void 0)n.set(l,s(l,h));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,l,h),d.version=l.version}}return{get:o,remove:a,update:c}}var qi=class i extends en{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=t/a,f=e/c,g=[],x=[],v=[],p=[];for(let u=0;u<h;u++){let L=u*f-o;for(let _=0;_<l;_++){let E=_*d-r;x.push(E,-L,0),v.push(0,0,1),p.push(_/a),p.push(1-u/c)}}for(let u=0;u<c;u++)for(let L=0;L<a;L++){let _=L+l*u,E=L+l*(u+1),N=L+1+l*(u+1),P=L+1+l*u;g.push(_,E,P),g.push(E,N,P)}this.setIndex(g),this.setAttribute("position",new Ye(x,3)),this.setAttribute("normal",new Ye(v,3)),this.setAttribute("uv",new Ye(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},mu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,_u=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,vu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Su=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Eu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,wu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Au=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ru=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Pu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Du=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ou=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Fu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Bu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ku=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xu="gl_FragColor = linearToOutputTexel( gl_FragColor );",qu=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Yu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Zu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ju=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$u=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ku=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ju=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,td=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ed=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,id=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,sd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ad=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,od=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,cd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ld=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ud=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,pd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,md=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_d=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Md=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Sd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ed=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Td=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ld=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ad=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Cd=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Pd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ud=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Dd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Od=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Bd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Wd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$d=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Kd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Qd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ef=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,nf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,rf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,af=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,of=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,lf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,hf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,df=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ff=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,mf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Sf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,bf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ef=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,wf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Af=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Rf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Cf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,If=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Df=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Of=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ff=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,kf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Wf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ee={alphahash_fragment:mu,alphahash_pars_fragment:gu,alphamap_fragment:_u,alphamap_pars_fragment:xu,alphatest_fragment:yu,alphatest_pars_fragment:vu,aomap_fragment:Mu,aomap_pars_fragment:Su,batching_pars_vertex:bu,batching_vertex:Eu,begin_vertex:wu,beginnormal_vertex:Tu,bsdfs:Lu,iridescence_fragment:Au,bumpmap_pars_fragment:Ru,clipping_planes_fragment:Cu,clipping_planes_pars_fragment:Pu,clipping_planes_pars_vertex:Iu,clipping_planes_vertex:Uu,color_fragment:Du,color_pars_fragment:Nu,color_pars_vertex:Ou,color_vertex:Fu,common:Bu,cube_uv_reflection_fragment:zu,defaultnormal_vertex:ku,displacementmap_pars_vertex:Hu,displacementmap_vertex:Vu,emissivemap_fragment:Gu,emissivemap_pars_fragment:Wu,colorspace_fragment:Xu,colorspace_pars_fragment:qu,envmap_fragment:Yu,envmap_common_pars_fragment:Zu,envmap_pars_fragment:Ju,envmap_pars_vertex:$u,envmap_physical_pars_fragment:cd,envmap_vertex:Ku,fog_vertex:ju,fog_pars_vertex:Qu,fog_fragment:td,fog_pars_fragment:ed,gradientmap_pars_fragment:nd,lightmap_fragment:id,lightmap_pars_fragment:sd,lights_lambert_fragment:rd,lights_lambert_pars_fragment:ad,lights_pars_begin:od,lights_toon_fragment:ld,lights_toon_pars_fragment:hd,lights_phong_fragment:ud,lights_phong_pars_fragment:dd,lights_physical_fragment:fd,lights_physical_pars_fragment:pd,lights_fragment_begin:md,lights_fragment_maps:gd,lights_fragment_end:_d,logdepthbuf_fragment:xd,logdepthbuf_pars_fragment:yd,logdepthbuf_pars_vertex:vd,logdepthbuf_vertex:Md,map_fragment:Sd,map_pars_fragment:bd,map_particle_fragment:Ed,map_particle_pars_fragment:wd,metalnessmap_fragment:Td,metalnessmap_pars_fragment:Ld,morphcolor_vertex:Ad,morphnormal_vertex:Rd,morphtarget_pars_vertex:Cd,morphtarget_vertex:Pd,normal_fragment_begin:Id,normal_fragment_maps:Ud,normal_pars_fragment:Dd,normal_pars_vertex:Nd,normal_vertex:Od,normalmap_pars_fragment:Fd,clearcoat_normal_fragment_begin:Bd,clearcoat_normal_fragment_maps:zd,clearcoat_pars_fragment:kd,iridescence_pars_fragment:Hd,opaque_fragment:Vd,packing:Gd,premultiplied_alpha_fragment:Wd,project_vertex:Xd,dithering_fragment:qd,dithering_pars_fragment:Yd,roughnessmap_fragment:Zd,roughnessmap_pars_fragment:Jd,shadowmap_pars_fragment:$d,shadowmap_pars_vertex:Kd,shadowmap_vertex:jd,shadowmask_pars_fragment:Qd,skinbase_vertex:tf,skinning_pars_vertex:ef,skinning_vertex:nf,skinnormal_vertex:sf,specularmap_fragment:rf,specularmap_pars_fragment:af,tonemapping_fragment:of,tonemapping_pars_fragment:cf,transmission_fragment:lf,transmission_pars_fragment:hf,uv_pars_fragment:uf,uv_pars_vertex:df,uv_vertex:ff,worldpos_vertex:pf,background_vert:mf,background_frag:gf,backgroundCube_vert:_f,backgroundCube_frag:xf,cube_vert:yf,cube_frag:vf,depth_vert:Mf,depth_frag:Sf,distanceRGBA_vert:bf,distanceRGBA_frag:Ef,equirect_vert:wf,equirect_frag:Tf,linedashed_vert:Lf,linedashed_frag:Af,meshbasic_vert:Rf,meshbasic_frag:Cf,meshlambert_vert:Pf,meshlambert_frag:If,meshmatcap_vert:Uf,meshmatcap_frag:Df,meshnormal_vert:Nf,meshnormal_frag:Of,meshphong_vert:Ff,meshphong_frag:Bf,meshphysical_vert:zf,meshphysical_frag:kf,meshtoon_vert:Hf,meshtoon_frag:Vf,points_vert:Gf,points_frag:Wf,shadow_vert:Xf,shadow_frag:qf,sprite_vert:Yf,sprite_frag:Zf},Tt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Mn={basic:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:We([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:We([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:We([Tt.points,Tt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:We([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:We([Tt.common,Tt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:We([Tt.sprite,Tt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:We([Tt.common,Tt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:We([Tt.lights,Tt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};Mn.physical={uniforms:We([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};var Qs={r:0,b:0,g:0};function Jf(i,t,e,n,s,r,o){let a=new $t(0),c=r===!0?0:1,l,h,d=null,f=0,g=null;function x(p,u){let L=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?v(a,c):_&&_.isColor&&(v(_,1),L=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||L)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Vr)?(h===void 0&&(h=new Fe(new ps(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Xi(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,P,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=he.getTransfer(_.colorSpace)!==pe,(d!==_||f!==_.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Fe(new qi(2,2),new _n({name:"BackgroundMaterial",uniforms:Xi(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,l.material.toneMapped=he.getTransfer(_.colorSpace)!==pe,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||g!==i.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function v(p,u){p.getRGB(Qs,Tl(i)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),c=u,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,v(a,c)},render:x}}function $f(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null),l=c,h=!1;function d(O,Y,nt,$,F){let it=!1;if(o){let ct=v($,nt,Y);l!==ct&&(l=ct,g(l.object)),it=u(O,$,nt,F),it&&L(O,$,nt,F)}else{let ct=Y.wireframe===!0;(l.geometry!==$.id||l.program!==nt.id||l.wireframe!==ct)&&(l.geometry=$.id,l.program=nt.id,l.wireframe=ct,it=!0)}F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(it||h)&&(h=!1,K(O,Y,nt,$),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function g(O){return n.isWebGL2?i.bindVertexArray(O):r.bindVertexArrayOES(O)}function x(O){return n.isWebGL2?i.deleteVertexArray(O):r.deleteVertexArrayOES(O)}function v(O,Y,nt){let $=nt.wireframe===!0,F=a[O.id];F===void 0&&(F={},a[O.id]=F);let it=F[Y.id];it===void 0&&(it={},F[Y.id]=it);let ct=it[$];return ct===void 0&&(ct=p(f()),it[$]=ct),ct}function p(O){let Y=[],nt=[],$=[];for(let F=0;F<s;F++)Y[F]=0,nt[F]=0,$[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Y,enabledAttributes:nt,attributeDivisors:$,object:O,attributes:{},index:null}}function u(O,Y,nt,$){let F=l.attributes,it=Y.attributes,ct=0,ft=nt.getAttributes();for(let Mt in ft)if(ft[Mt].location>=0){let I=F[Mt],C=it[Mt];if(C===void 0&&(Mt==="instanceMatrix"&&O.instanceMatrix&&(C=O.instanceMatrix),Mt==="instanceColor"&&O.instanceColor&&(C=O.instanceColor)),I===void 0||I.attribute!==C||C&&I.data!==C.data)return!0;ct++}return l.attributesNum!==ct||l.index!==$}function L(O,Y,nt,$){let F={},it=Y.attributes,ct=0,ft=nt.getAttributes();for(let Mt in ft)if(ft[Mt].location>=0){let I=it[Mt];I===void 0&&(Mt==="instanceMatrix"&&O.instanceMatrix&&(I=O.instanceMatrix),Mt==="instanceColor"&&O.instanceColor&&(I=O.instanceColor));let C={};C.attribute=I,I&&I.data&&(C.data=I.data),F[Mt]=C,ct++}l.attributes=F,l.attributesNum=ct,l.index=$}function _(){let O=l.newAttributes;for(let Y=0,nt=O.length;Y<nt;Y++)O[Y]=0}function E(O){N(O,0)}function N(O,Y){let nt=l.newAttributes,$=l.enabledAttributes,F=l.attributeDivisors;nt[O]=1,$[O]===0&&(i.enableVertexAttribArray(O),$[O]=1),F[O]!==Y&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](O,Y),F[O]=Y)}function P(){let O=l.newAttributes,Y=l.enabledAttributes;for(let nt=0,$=Y.length;nt<$;nt++)Y[nt]!==O[nt]&&(i.disableVertexAttribArray(nt),Y[nt]=0)}function R(O,Y,nt,$,F,it,ct){ct===!0?i.vertexAttribIPointer(O,Y,nt,F,it):i.vertexAttribPointer(O,Y,nt,$,F,it)}function K(O,Y,nt,$){if(n.isWebGL2===!1&&(O.isInstancedMesh||$.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let F=$.attributes,it=nt.getAttributes(),ct=Y.defaultAttributeValues;for(let ft in it){let Mt=it[ft];if(Mt.location>=0){let st=F[ft];if(st===void 0&&(ft==="instanceMatrix"&&O.instanceMatrix&&(st=O.instanceMatrix),ft==="instanceColor"&&O.instanceColor&&(st=O.instanceColor)),st!==void 0){let I=st.normalized,C=st.itemSize,b=e.get(st);if(b===void 0)continue;let M=b.buffer,j=b.type,lt=b.bytesPerElement,H=n.isWebGL2===!0&&(j===i.INT||j===i.UNSIGNED_INT||st.gpuType===pl);if(st.isInterleavedBufferAttribute){let dt=st.data,A=dt.stride,Q=st.offset;if(dt.isInstancedInterleavedBuffer){for(let U=0;U<Mt.locationSize;U++)N(Mt.location+U,dt.meshPerAttribute);O.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let U=0;U<Mt.locationSize;U++)E(Mt.location+U);i.bindBuffer(i.ARRAY_BUFFER,M);for(let U=0;U<Mt.locationSize;U++)R(Mt.location+U,C/Mt.locationSize,j,I,A*lt,(Q+C/Mt.locationSize*U)*lt,H)}else{if(st.isInstancedBufferAttribute){for(let dt=0;dt<Mt.locationSize;dt++)N(Mt.location+dt,st.meshPerAttribute);O.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let dt=0;dt<Mt.locationSize;dt++)E(Mt.location+dt);i.bindBuffer(i.ARRAY_BUFFER,M);for(let dt=0;dt<Mt.locationSize;dt++)R(Mt.location+dt,C/Mt.locationSize,j,I,C*lt,C/Mt.locationSize*dt*lt,H)}}else if(ct!==void 0){let I=ct[ft];if(I!==void 0)switch(I.length){case 2:i.vertexAttrib2fv(Mt.location,I);break;case 3:i.vertexAttrib3fv(Mt.location,I);break;case 4:i.vertexAttrib4fv(Mt.location,I);break;default:i.vertexAttrib1fv(Mt.location,I)}}}}P()}function S(){et();for(let O in a){let Y=a[O];for(let nt in Y){let $=Y[nt];for(let F in $)x($[F].object),delete $[F];delete Y[nt]}delete a[O]}}function T(O){if(a[O.id]===void 0)return;let Y=a[O.id];for(let nt in Y){let $=Y[nt];for(let F in $)x($[F].object),delete $[F];delete Y[nt]}delete a[O.id]}function Z(O){for(let Y in a){let nt=a[Y];if(nt[O.id]===void 0)continue;let $=nt[O.id];for(let F in $)x($[F].object),delete $[F];delete nt[O.id]}}function et(){xt(),h=!0,l!==c&&(l=c,g(l.object))}function xt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:et,resetDefaultState:xt,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfProgram:Z,initAttributes:_,enableAttribute:E,disableUnusedAttributes:P}}function Kf(i,t,e,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,d){i.drawArrays(r,h,d),e.update(d,r,1)}function c(h,d,f){if(f===0)return;let g,x;if(s)g=i,x="drawArraysInstanced";else if(g=t.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",g===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[x](r,h,d,f),e.update(d,r,f)}function l(h,d,f){if(f===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<f;x++)this.render(h[x],d[x]);else{g.multiDrawArraysWEBGL(r,h,0,d,0,f);let x=0;for(let v=0;v<f;v++)x+=d[v];e.update(x,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function jf(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),L=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,E=o||t.has("OES_texture_float"),N=_&&E,P=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:x,maxAttributes:v,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:L,vertexTextures:_,floatFragmentTextures:E,floatVertexTextures:N,maxSamples:P}}function Qf(i){let t=this,e=null,n=0,s=!1,r=!1,o=new In,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let g=d.length!==0||f||n!==0||s;return s=f,n=d.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,g){let x=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||x===null||x.length===0||r&&!p)r?h(null):l();else{let L=r?0:n,_=L*4,E=u.clippingState||null;c.value=E,E=h(x,f,_,g);for(let N=0;N!==_;++N)E[N]=e[N];u.clippingState=E,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=L}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,g,x){let v=d!==null?d.length:0,p=null;if(v!==0){if(p=c.value,x!==!0||p===null){let u=g+v*4,L=f.matrixWorldInverse;a.getNormalMatrix(L),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,E=g;_!==v;++_,E+=4)o.copy(d[_]).applyMatrix4(L,a),o.normal.toArray(p,E),p[E+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function tp(i){let t=new WeakMap;function e(o,a){return a===Pa?o.mapping=zi:a===Ia&&(o.mapping=ki),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Pa||a===Ia)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new ka(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Lr=class extends wr{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ui=4,Uc=[.125,.215,.35,.446,.526,.582],si=20,va=new Lr,Dc=new $t,Ma=null,Sa=0,ba=0,ni=(1+Math.sqrt(5))/2,Ci=1/ni,Nc=[new V(1,1,1),new V(-1,1,1),new V(1,1,-1),new V(-1,1,-1),new V(0,ni,Ci),new V(0,ni,-Ci),new V(Ci,0,ni),new V(-Ci,0,ni),new V(ni,Ci,0),new V(-ni,Ci,0)],Yi=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ma=this._renderer.getRenderTarget(),Sa=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ma,Sa,ba),t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===ki?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ma=this._renderer.getRenderTarget(),Sa=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:fs,format:gn,colorSpace:Nn,depthBuffer:!1},s=Oc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oc(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ep(r)),this._blurMaterial=np(r,t,e)}return s}_compileMaterial(t){let e=new Fe(this._lodPlanes[0],t);this._renderer.compile(e,va)}_sceneToCubeUV(t,e,n,s){let a=new Ve(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Dc),h.toneMapping=Xn,h.autoClear=!1;let g=new Wi({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),x=new Fe(new ps,g),v=!1,p=t.background;p?p.isColor&&(g.color.copy(p),t.background=null,v=!0):(g.color.copy(Dc),v=!0);for(let u=0;u<6;u++){let L=u%3;L===0?(a.up.set(0,c[u],0),a.lookAt(l[u],0,0)):L===1?(a.up.set(0,0,c[u]),a.lookAt(0,l[u],0)):(a.up.set(0,c[u],0),a.lookAt(0,0,l[u]));let _=this._cubeSize;tr(s,L*_,u>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===zi||t.mapping===ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fc());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;tr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,va)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Nc[(s-1)%Nc.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Fe(this._lodPlanes[s],l),f=l.uniforms,g=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*si-1),v=r/x,p=isFinite(r)?1+Math.floor(h*v):si;p>si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${si}`);let u=[],L=0;for(let R=0;R<si;++R){let K=R/v,S=Math.exp(-K*K/2);u.push(S),R===0?L+=S:R<p&&(L+=2*S)}for(let R=0;R<u.length;R++)u[R]=u[R]/L;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=x,f.mipInt.value=_-n;let E=this._sizeLods[s],N=3*E*(s>_-Ui?s-_+Ui:0),P=4*(this._cubeSize-E);tr(e,N,P,3*E,2*E),c.setRenderTarget(e),c.render(d,va)}};function ep(i){let t=[],e=[],n=[],s=i,r=i-Ui+1+Uc.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ui?c=Uc[o-i+Ui-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,x=6,v=3,p=2,u=1,L=new Float32Array(v*x*g),_=new Float32Array(p*x*g),E=new Float32Array(u*x*g);for(let P=0;P<g;P++){let R=P%3*2/3-1,K=P>2?0:-1,S=[R,K,0,R+2/3,K,0,R+2/3,K+1,0,R,K,0,R+2/3,K+1,0,R,K+1,0];L.set(S,v*x*P),_.set(f,p*x*P);let T=[P,P,P,P,P,P];E.set(T,u*x*P)}let N=new en;N.setAttribute("position",new qe(L,v)),N.setAttribute("uv",new qe(_,p)),N.setAttribute("faceIndex",new qe(E,u)),t.push(N),s>Ui&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Oc(i,t,e){let n=new On(i,t,e);return n.texture.mapping=Vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function np(i,t,e){let n=new Float32Array(si),s=new V(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Lo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Fc(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Bc(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Lo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ip(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===Pa||c===Ia,h=c===zi||c===ki;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new Yi(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(l&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new Yi(i));let f=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function sp(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function rp(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let x in f.attributes)t.remove(f.attributes[x]);for(let x in f.morphAttributes){let v=f.morphAttributes[x];for(let p=0,u=v.length;p<u;p++)t.remove(v[p])}f.removeEventListener("dispose",o),delete s[f.id];let g=r.get(f);g&&(t.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(d){let f=d.attributes;for(let x in f)t.update(f[x],i.ARRAY_BUFFER);let g=d.morphAttributes;for(let x in g){let v=g[x];for(let p=0,u=v.length;p<u;p++)t.update(v[p],i.ARRAY_BUFFER)}}function l(d){let f=[],g=d.index,x=d.attributes.position,v=0;if(g!==null){let L=g.array;v=g.version;for(let _=0,E=L.length;_<E;_+=3){let N=L[_+0],P=L[_+1],R=L[_+2];f.push(N,P,P,R,R,N)}}else if(x!==void 0){let L=x.array;v=x.version;for(let _=0,E=L.length/3-1;_<E;_+=3){let N=_+0,P=_+1,R=_+2;f.push(N,P,P,R,R,N)}}else return;let p=new(El(f)?Er:br)(f,1);p.version=v;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let g=d.index;g!==null&&f.version<g.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function ap(i,t,e,n){let s=n.isWebGL2,r;function o(g){r=g}let a,c;function l(g){a=g.type,c=g.bytesPerElement}function h(g,x){i.drawElements(r,x,a,g*c),e.update(x,r,1)}function d(g,x,v){if(v===0)return;let p,u;if(s)p=i,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,x,a,g*c,v),e.update(x,r,v)}function f(g,x,v){if(v===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<v;u++)this.render(g[u]/c,x[u]);else{p.multiDrawElementsWEBGL(r,x,0,a,g,0,v);let u=0;for(let L=0;L<v;L++)u+=x[L];e.update(u,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function op(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function cp(i,t){return i[0]-t[0]}function lp(i,t){return Math.abs(t[1])-Math.abs(i[1])}function hp(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Ue,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,d){let f=l.morphTargetInfluences;if(t.isWebGL2===!0){let g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=g!==void 0?g.length:0,v=r.get(h);if(v===void 0||v.count!==x){let O=function(){et.dispose(),r.delete(h),h.removeEventListener("dispose",O)};v!==void 0&&v.texture.dispose();let L=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,N=h.morphAttributes.position||[],P=h.morphAttributes.normal||[],R=h.morphAttributes.color||[],K=0;L===!0&&(K=1),_===!0&&(K=2),E===!0&&(K=3);let S=h.attributes.position.count*K,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);let Z=new Float32Array(S*T*4*x),et=new yr(Z,S,T,x);et.type=Gn,et.needsUpdate=!0;let xt=K*4;for(let Y=0;Y<x;Y++){let nt=N[Y],$=P[Y],F=R[Y],it=S*T*4*Y;for(let ct=0;ct<nt.count;ct++){let ft=ct*xt;L===!0&&(o.fromBufferAttribute(nt,ct),Z[it+ft+0]=o.x,Z[it+ft+1]=o.y,Z[it+ft+2]=o.z,Z[it+ft+3]=0),_===!0&&(o.fromBufferAttribute($,ct),Z[it+ft+4]=o.x,Z[it+ft+5]=o.y,Z[it+ft+6]=o.z,Z[it+ft+7]=0),E===!0&&(o.fromBufferAttribute(F,ct),Z[it+ft+8]=o.x,Z[it+ft+9]=o.y,Z[it+ft+10]=o.z,Z[it+ft+11]=F.itemSize===4?o.w:1)}}v={count:x,texture:et,size:new _t(S,T)},r.set(h,v),h.addEventListener("dispose",O)}let p=0;for(let L=0;L<f.length;L++)p+=f[L];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{let g=f===void 0?0:f.length,x=n[h.id];if(x===void 0||x.length!==g){x=[];for(let _=0;_<g;_++)x[_]=[_,0];n[h.id]=x}for(let _=0;_<g;_++){let E=x[_];E[0]=_,E[1]=f[_]}x.sort(lp);for(let _=0;_<8;_++)_<g&&x[_][1]?(a[_][0]=x[_][0],a[_][1]=x[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(cp);let v=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let E=a[_],N=E[0],P=E[1];N!==Number.MAX_SAFE_INTEGER&&P?(v&&h.getAttribute("morphTarget"+_)!==v[N]&&h.setAttribute("morphTarget"+_,v[N]),p&&h.getAttribute("morphNormal"+_)!==p[N]&&h.setAttribute("morphNormal"+_,p[N]),s[_]=P,u+=P):(v&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let L=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",L),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function up(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Ar=class extends cn{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:ai,h!==ai&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ai&&(n=Vn),n===void 0&&h===Hi&&(n=ri),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Xe,this.minFilter=c!==void 0?c:Xe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Al=new cn,Rl=new Ar(1,1);Rl.compareFunction=bl;var Cl=new yr,Pl=new Ba,Il=new Tr,zc=[],kc=[],Hc=new Float32Array(16),Vc=new Float32Array(9),Gc=new Float32Array(4);function $i(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=zc[s];if(r===void 0&&(r=new Float32Array(s),zc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Wr(i,t){let e=kc[t];e===void 0&&(e=new Int32Array(t),kc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function dp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function fp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function pp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function mp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function gp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Le(e,n))return;Gc.set(n),i.uniformMatrix2fv(this.addr,!1,Gc),Ae(e,n)}}function _p(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Le(e,n))return;Vc.set(n),i.uniformMatrix3fv(this.addr,!1,Vc),Ae(e,n)}}function xp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Le(e,n))return;Hc.set(n),i.uniformMatrix4fv(this.addr,!1,Hc),Ae(e,n)}}function yp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function vp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function Mp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function Sp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function bp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ep(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function wp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Tp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function Lp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Rl:Al;e.setTexture2D(t||r,s)}function Ap(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Pl,s)}function Rp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Il,s)}function Cp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Cl,s)}function Pp(i){switch(i){case 5126:return dp;case 35664:return fp;case 35665:return pp;case 35666:return mp;case 35674:return gp;case 35675:return _p;case 35676:return xp;case 5124:case 35670:return yp;case 35667:case 35671:return vp;case 35668:case 35672:return Mp;case 35669:case 35673:return Sp;case 5125:return bp;case 36294:return Ep;case 36295:return wp;case 36296:return Tp;case 35678:case 36198:case 36298:case 36306:case 35682:return Lp;case 35679:case 36299:case 36307:return Ap;case 35680:case 36300:case 36308:case 36293:return Rp;case 36289:case 36303:case 36311:case 36292:return Cp}}function Ip(i,t){i.uniform1fv(this.addr,t)}function Up(i,t){let e=$i(t,this.size,2);i.uniform2fv(this.addr,e)}function Dp(i,t){let e=$i(t,this.size,3);i.uniform3fv(this.addr,e)}function Np(i,t){let e=$i(t,this.size,4);i.uniform4fv(this.addr,e)}function Op(i,t){let e=$i(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Fp(i,t){let e=$i(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Bp(i,t){let e=$i(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function zp(i,t){i.uniform1iv(this.addr,t)}function kp(i,t){i.uniform2iv(this.addr,t)}function Hp(i,t){i.uniform3iv(this.addr,t)}function Vp(i,t){i.uniform4iv(this.addr,t)}function Gp(i,t){i.uniform1uiv(this.addr,t)}function Wp(i,t){i.uniform2uiv(this.addr,t)}function Xp(i,t){i.uniform3uiv(this.addr,t)}function qp(i,t){i.uniform4uiv(this.addr,t)}function Yp(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Al,r[o])}function Zp(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Pl,r[o])}function Jp(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Il,r[o])}function $p(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Cl,r[o])}function Kp(i){switch(i){case 5126:return Ip;case 35664:return Up;case 35665:return Dp;case 35666:return Np;case 35674:return Op;case 35675:return Fp;case 35676:return Bp;case 5124:case 35670:return zp;case 35667:case 35671:return kp;case 35668:case 35672:return Hp;case 35669:case 35673:return Vp;case 5125:return Gp;case 36294:return Wp;case 36295:return Xp;case 36296:return qp;case 35678:case 36198:case 36298:case 36306:case 35682:return Yp;case 35679:case 36299:case 36307:return Zp;case 35680:case 36300:case 36308:case 36293:return Jp;case 36289:case 36303:case 36311:case 36292:return $p}}var Ha=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Pp(e.type)}},Va=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Kp(e.type)}},Ga=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Ea=/(\w+)(\])?(\[|\.)?/g;function Wc(i,t){i.seq.push(t),i.map[t.id]=t}function jp(i,t,e){let n=i.name,s=n.length;for(Ea.lastIndex=0;;){let r=Ea.exec(n),o=Ea.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Wc(e,l===void 0?new Ha(a,i,t):new Va(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Ga(a),Wc(e,d)),e=d}}}var Bi=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);jp(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Xc(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Qp=37297,tm=0;function em(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function nm(i){let t=he.getPrimaries(he.workingColorSpace),e=he.getPrimaries(i),n;switch(t===e?n="":t===fr&&e===dr?n="LinearDisplayP3ToLinearSRGB":t===dr&&e===fr&&(n="LinearSRGBToLinearDisplayP3"),i){case Nn:case Gr:return[n,"LinearTransferOETF"];case Te:case wo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function qc(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+em(i.getShaderSource(t),o)}else return s}function im(i,t){let e=nm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function sm(i,t){let e;switch(t){case lh:e="Linear";break;case hh:e="Reinhard";break;case uh:e="OptimizedCineon";break;case bo:e="ACESFilmic";break;case fh:e="AgX";break;case dh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function rm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Di).join(`
`)}function am(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Di).join(`
`)}function om(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function cm(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Di(i){return i!==""}function Yc(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wa(i){return i.replace(lm,um)}var hm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function um(i,t){let e=ee[t];if(e===void 0){let n=hm.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wa(e)}var dm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jc(i){return i.replace(dm,fm)}function fm(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $c(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function pm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ul?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===So?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Pn&&(t="SHADOWMAP_TYPE_VSM"),t}function mm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case ki:t="ENVMAP_TYPE_CUBE";break;case Vr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function gm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ki:t="ENVMAP_MODE_REFRACTION";break}return t}function _m(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case dl:t="ENVMAP_BLENDING_MULTIPLY";break;case oh:t="ENVMAP_BLENDING_MIX";break;case ch:t="ENVMAP_BLENDING_ADD";break}return t}function xm(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function ym(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=pm(e),l=mm(e),h=gm(e),d=_m(e),f=xm(e),g=e.isWebGL2?"":rm(e),x=am(e),v=om(r),p=s.createProgram(),u,L,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Di).join(`
`),u.length>0&&(u+=`
`),L=[g,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Di).join(`
`),L.length>0&&(L+=`
`)):(u=[$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Di).join(`
`),L=[g,$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Xn?"#define TONE_MAPPING":"",e.toneMapping!==Xn?ee.tonemapping_pars_fragment:"",e.toneMapping!==Xn?sm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,im("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Di).join(`
`)),o=Wa(o),o=Yc(o,e),o=Zc(o,e),a=Wa(a),a=Yc(a,e),a=Zc(a,e),o=Jc(o),a=Jc(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,u=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,L=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+L);let E=_+u+o,N=_+L+a,P=Xc(s,s.VERTEX_SHADER,E),R=Xc(s,s.FRAGMENT_SHADER,N);s.attachShader(p,P),s.attachShader(p,R),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function K(et){if(i.debug.checkShaderErrors){let xt=s.getProgramInfoLog(p).trim(),O=s.getShaderInfoLog(P).trim(),Y=s.getShaderInfoLog(R).trim(),nt=!0,$=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(nt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,P,R);else{let F=qc(s,P,"vertex"),it=qc(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+xt+`
`+F+`
`+it)}else xt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",xt):(O===""||Y==="")&&($=!1);$&&(et.diagnostics={runnable:nt,programLog:xt,vertexShader:{log:O,prefix:u},fragmentShader:{log:Y,prefix:L}})}s.deleteShader(P),s.deleteShader(R),S=new Bi(s,p),T=cm(s,p)}let S;this.getUniforms=function(){return S===void 0&&K(this),S};let T;this.getAttributes=function(){return T===void 0&&K(this),T};let Z=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return Z===!1&&(Z=s.getProgramParameter(p,Qp)),Z},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=tm++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=P,this.fragmentShader=R,this}var vm=0,Xa=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new qa(t),e.set(t,n)),n}},qa=class{constructor(t){this.id=vm++,this.code=t,this.usedTimes=0}};function Mm(i,t,e,n,s,r,o){let a=new Sr,c=new Xa,l=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,g=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return S===0?"uv":`uv${S}`}function p(S,T,Z,et,xt){let O=et.fog,Y=xt.geometry,nt=S.isMeshStandardMaterial?et.environment:null,$=(S.isMeshStandardMaterial?e:t).get(S.envMap||nt),F=$&&$.mapping===Vr?$.image.height:null,it=x[S.type];S.precision!==null&&(g=s.getMaxPrecision(S.precision),g!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));let ct=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ft=ct!==void 0?ct.length:0,Mt=0;Y.morphAttributes.position!==void 0&&(Mt=1),Y.morphAttributes.normal!==void 0&&(Mt=2),Y.morphAttributes.color!==void 0&&(Mt=3);let st,I,C,b;if(it){let De=Mn[it];st=De.vertexShader,I=De.fragmentShader}else st=S.vertexShader,I=S.fragmentShader,c.update(S),C=c.getVertexShaderID(S),b=c.getFragmentShaderID(S);let M=i.getRenderTarget(),j=xt.isInstancedMesh===!0,lt=xt.isBatchedMesh===!0,H=!!S.map,dt=!!S.matcap,A=!!$,Q=!!S.aoMap,U=!!S.lightMap,X=!!S.bumpMap,W=!!S.normalMap,pt=!!S.displacementMap,D=!!S.emissiveMap,m=!!S.metalnessMap,y=!!S.roughnessMap,z=S.anisotropy>0,mt=S.clearcoat>0,gt=S.iridescence>0,ut=S.sheen>0,Ut=S.transmission>0,St=z&&!!S.anisotropyMap,It=mt&&!!S.clearcoatMap,Bt=mt&&!!S.clearcoatNormalMap,Ht=mt&&!!S.clearcoatRoughnessMap,yt=gt&&!!S.iridescenceMap,Kt=gt&&!!S.iridescenceThicknessMap,Yt=ut&&!!S.sheenColorMap,Vt=ut&&!!S.sheenRoughnessMap,zt=!!S.specularMap,Lt=!!S.specularColorMap,Nt=!!S.specularIntensityMap,re=Ut&&!!S.transmissionMap,ae=Ut&&!!S.thicknessMap,ne=!!S.gradientMap,Et=!!S.alphaMap,B=S.alphaTest>0,At=!!S.alphaHash,Rt=!!S.extensions,Wt=!!Y.attributes.uv1,kt=!!Y.attributes.uv2,oe=!!Y.attributes.uv3,ce=Xn;return S.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(ce=i.toneMapping),{isWebGL2:h,shaderID:it,shaderType:S.type,shaderName:S.name,vertexShader:st,fragmentShader:I,defines:S.defines,customVertexShaderID:C,customFragmentShaderID:b,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:lt,instancing:j,instancingColor:j&&xt.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:M===null?i.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Nn,map:H,matcap:dt,envMap:A,envMapMode:A&&$.mapping,envMapCubeUVHeight:F,aoMap:Q,lightMap:U,bumpMap:X,normalMap:W,displacementMap:f&&pt,emissiveMap:D,normalMapObjectSpace:W&&S.normalMapType===wh,normalMapTangentSpace:W&&S.normalMapType===Sl,metalnessMap:m,roughnessMap:y,anisotropy:z,anisotropyMap:St,clearcoat:mt,clearcoatMap:It,clearcoatNormalMap:Bt,clearcoatRoughnessMap:Ht,iridescence:gt,iridescenceMap:yt,iridescenceThicknessMap:Kt,sheen:ut,sheenColorMap:Yt,sheenRoughnessMap:Vt,specularMap:zt,specularColorMap:Lt,specularIntensityMap:Nt,transmission:Ut,transmissionMap:re,thicknessMap:ae,gradientMap:ne,opaque:S.transparent===!1&&S.blending===Oi,alphaMap:Et,alphaTest:B,alphaHash:At,combine:S.combine,mapUv:H&&v(S.map.channel),aoMapUv:Q&&v(S.aoMap.channel),lightMapUv:U&&v(S.lightMap.channel),bumpMapUv:X&&v(S.bumpMap.channel),normalMapUv:W&&v(S.normalMap.channel),displacementMapUv:pt&&v(S.displacementMap.channel),emissiveMapUv:D&&v(S.emissiveMap.channel),metalnessMapUv:m&&v(S.metalnessMap.channel),roughnessMapUv:y&&v(S.roughnessMap.channel),anisotropyMapUv:St&&v(S.anisotropyMap.channel),clearcoatMapUv:It&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:Bt&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ht&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:Kt&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:Yt&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&v(S.sheenRoughnessMap.channel),specularMapUv:zt&&v(S.specularMap.channel),specularColorMapUv:Lt&&v(S.specularColorMap.channel),specularIntensityMapUv:Nt&&v(S.specularIntensityMap.channel),transmissionMapUv:re&&v(S.transmissionMap.channel),thicknessMapUv:ae&&v(S.thicknessMap.channel),alphaMapUv:Et&&v(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(W||z),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,vertexUv1s:Wt,vertexUv2s:kt,vertexUv3s:oe,pointsUvs:xt.isPoints===!0&&!!Y.attributes.uv&&(H||Et),fog:!!O,useFog:S.fog===!0,fogExp2:O&&O.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:xt.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:Mt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&Z.length>0,shadowMapType:i.shadowMap.type,toneMapping:ce,useLegacyLights:i._useLegacyLights,decodeVideoTexture:H&&S.map.isVideoTexture===!0&&he.getTransfer(S.map.colorSpace)===pe,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===an,flipSided:S.side===$e,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:Rt&&S.extensions.derivatives===!0,extensionFragDepth:Rt&&S.extensions.fragDepth===!0,extensionDrawBuffers:Rt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:Rt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Rt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function u(S){let T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(let Z in S.defines)T.push(Z),T.push(S.defines[Z]);return S.isRawShaderMaterial===!1&&(L(T,S),_(T,S),T.push(i.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function L(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function _(S,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),T.alphaHash&&a.enable(18),T.batching&&a.enable(19),S.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function E(S){let T=x[S.type],Z;if(T){let et=Mn[T];Z=lu.clone(et.uniforms)}else Z=S.uniforms;return Z}function N(S,T){let Z;for(let et=0,xt=l.length;et<xt;et++){let O=l[et];if(O.cacheKey===T){Z=O,++Z.usedTimes;break}}return Z===void 0&&(Z=new ym(i,T,S,r),l.push(Z)),Z}function P(S){if(--S.usedTimes===0){let T=l.indexOf(S);l[T]=l[l.length-1],l.pop(),S.destroy()}}function R(S){c.remove(S)}function K(){c.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:E,acquireProgram:N,releaseProgram:P,releaseShaderCache:R,programs:l,dispose:K}}function Sm(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function bm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Kc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function jc(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,g,x,v,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:g,groupOrder:x,renderOrder:d.renderOrder,z:v,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=g,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=v,u.group=p),t++,u}function a(d,f,g,x,v,p){let u=o(d,f,g,x,v,p);g.transmission>0?n.push(u):g.transparent===!0?s.push(u):e.push(u)}function c(d,f,g,x,v,p){let u=o(d,f,g,x,v,p);g.transmission>0?n.unshift(u):g.transparent===!0?s.unshift(u):e.unshift(u)}function l(d,f){e.length>1&&e.sort(d||bm),n.length>1&&n.sort(f||Kc),s.length>1&&s.sort(f||Kc)}function h(){for(let d=t,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Em(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new jc,i.set(n,[o])):s>=r.length?(o=new jc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function wm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new $t};break;case"SpotLight":e={position:new V,direction:new V,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new V,halfWidth:new V,halfHeight:new V};break}return i[t.id]=e,e}}}function Tm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Lm=0;function Am(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Rm(i,t){let e=new wm,n=Tm(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new V);let r=new V,o=new be,a=new be;function c(h,d){let f=0,g=0,x=0;for(let et=0;et<9;et++)s.probe[et].set(0,0,0);let v=0,p=0,u=0,L=0,_=0,E=0,N=0,P=0,R=0,K=0,S=0;h.sort(Am);let T=d===!0?Math.PI:1;for(let et=0,xt=h.length;et<xt;et++){let O=h[et],Y=O.color,nt=O.intensity,$=O.distance,F=O.shadow&&O.shadow.map?O.shadow.map.texture:null;if(O.isAmbientLight)f+=Y.r*nt*T,g+=Y.g*nt*T,x+=Y.b*nt*T;else if(O.isLightProbe){for(let it=0;it<9;it++)s.probe[it].addScaledVector(O.sh.coefficients[it],nt);S++}else if(O.isDirectionalLight){let it=e.get(O);if(it.color.copy(O.color).multiplyScalar(O.intensity*T),O.castShadow){let ct=O.shadow,ft=n.get(O);ft.shadowBias=ct.bias,ft.shadowNormalBias=ct.normalBias,ft.shadowRadius=ct.radius,ft.shadowMapSize=ct.mapSize,s.directionalShadow[v]=ft,s.directionalShadowMap[v]=F,s.directionalShadowMatrix[v]=O.shadow.matrix,E++}s.directional[v]=it,v++}else if(O.isSpotLight){let it=e.get(O);it.position.setFromMatrixPosition(O.matrixWorld),it.color.copy(Y).multiplyScalar(nt*T),it.distance=$,it.coneCos=Math.cos(O.angle),it.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),it.decay=O.decay,s.spot[u]=it;let ct=O.shadow;if(O.map&&(s.spotLightMap[R]=O.map,R++,ct.updateMatrices(O),O.castShadow&&K++),s.spotLightMatrix[u]=ct.matrix,O.castShadow){let ft=n.get(O);ft.shadowBias=ct.bias,ft.shadowNormalBias=ct.normalBias,ft.shadowRadius=ct.radius,ft.shadowMapSize=ct.mapSize,s.spotShadow[u]=ft,s.spotShadowMap[u]=F,P++}u++}else if(O.isRectAreaLight){let it=e.get(O);it.color.copy(Y).multiplyScalar(nt),it.halfWidth.set(O.width*.5,0,0),it.halfHeight.set(0,O.height*.5,0),s.rectArea[L]=it,L++}else if(O.isPointLight){let it=e.get(O);if(it.color.copy(O.color).multiplyScalar(O.intensity*T),it.distance=O.distance,it.decay=O.decay,O.castShadow){let ct=O.shadow,ft=n.get(O);ft.shadowBias=ct.bias,ft.shadowNormalBias=ct.normalBias,ft.shadowRadius=ct.radius,ft.shadowMapSize=ct.mapSize,ft.shadowCameraNear=ct.camera.near,ft.shadowCameraFar=ct.camera.far,s.pointShadow[p]=ft,s.pointShadowMap[p]=F,s.pointShadowMatrix[p]=O.shadow.matrix,N++}s.point[p]=it,p++}else if(O.isHemisphereLight){let it=e.get(O);it.skyColor.copy(O.color).multiplyScalar(nt*T),it.groundColor.copy(O.groundColor).multiplyScalar(nt*T),s.hemi[_]=it,_++}}L>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=g,s.ambient[2]=x;let Z=s.hash;(Z.directionalLength!==v||Z.pointLength!==p||Z.spotLength!==u||Z.rectAreaLength!==L||Z.hemiLength!==_||Z.numDirectionalShadows!==E||Z.numPointShadows!==N||Z.numSpotShadows!==P||Z.numSpotMaps!==R||Z.numLightProbes!==S)&&(s.directional.length=v,s.spot.length=u,s.rectArea.length=L,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=E,s.directionalShadowMap.length=E,s.pointShadow.length=N,s.pointShadowMap.length=N,s.spotShadow.length=P,s.spotShadowMap.length=P,s.directionalShadowMatrix.length=E,s.pointShadowMatrix.length=N,s.spotLightMatrix.length=P+R-K,s.spotLightMap.length=R,s.numSpotLightShadowsWithMaps=K,s.numLightProbes=S,Z.directionalLength=v,Z.pointLength=p,Z.spotLength=u,Z.rectAreaLength=L,Z.hemiLength=_,Z.numDirectionalShadows=E,Z.numPointShadows=N,Z.numSpotShadows=P,Z.numSpotMaps=R,Z.numLightProbes=S,s.version=Lm++)}function l(h,d){let f=0,g=0,x=0,v=0,p=0,u=d.matrixWorldInverse;for(let L=0,_=h.length;L<_;L++){let E=h[L];if(E.isDirectionalLight){let N=s.directional[f];N.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),N.direction.sub(r),N.direction.transformDirection(u),f++}else if(E.isSpotLight){let N=s.spot[x];N.position.setFromMatrixPosition(E.matrixWorld),N.position.applyMatrix4(u),N.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),N.direction.sub(r),N.direction.transformDirection(u),x++}else if(E.isRectAreaLight){let N=s.rectArea[v];N.position.setFromMatrixPosition(E.matrixWorld),N.position.applyMatrix4(u),a.identity(),o.copy(E.matrixWorld),o.premultiply(u),a.extractRotation(o),N.halfWidth.set(E.width*.5,0,0),N.halfHeight.set(0,E.height*.5,0),N.halfWidth.applyMatrix4(a),N.halfHeight.applyMatrix4(a),v++}else if(E.isPointLight){let N=s.point[g];N.position.setFromMatrixPosition(E.matrixWorld),N.position.applyMatrix4(u),g++}else if(E.isHemisphereLight){let N=s.hemi[p];N.direction.setFromMatrixPosition(E.matrixWorld),N.direction.transformDirection(u),p++}}}return{setup:c,setupView:l,state:s}}function Qc(i,t){let e=new Rm(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){e.setup(n,d)}function l(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Cm(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),c;return a===void 0?(c=new Qc(i,t),e.set(r,[c])):o>=a.length?(c=new Qc(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var Ya=class extends Jn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Za=class extends Jn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Pm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Im=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Um(i,t,e){let n=new ms,s=new _t,r=new _t,o=new Ue,a=new Ya({depthPacking:Eh}),c=new Za,l={},h=e.maxTextureSize,d={[Sn]:$e,[$e]:Sn,[an]:an},f=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:Pm,fragmentShader:Im}),g=f.clone();g.defines.HORIZONTAL_PASS=1;let x=new en;x.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Fe(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ul;let u=this.type;this.render=function(P,R,K){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||P.length===0)return;let S=i.getRenderTarget(),T=i.getActiveCubeFace(),Z=i.getActiveMipmapLevel(),et=i.state;et.setBlending(Wn),et.buffers.color.setClear(1,1,1,1),et.buffers.depth.setTest(!0),et.setScissorTest(!1);let xt=u!==Pn&&this.type===Pn,O=u===Pn&&this.type!==Pn;for(let Y=0,nt=P.length;Y<nt;Y++){let $=P[Y],F=$.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let it=F.getFrameExtents();if(s.multiply(it),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/it.x),s.x=r.x*it.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/it.y),s.y=r.y*it.y,F.mapSize.y=r.y)),F.map===null||xt===!0||O===!0){let ft=this.type!==Pn?{minFilter:Xe,magFilter:Xe}:{};F.map!==null&&F.map.dispose(),F.map=new On(s.x,s.y,ft),F.map.texture.name=$.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();let ct=F.getViewportCount();for(let ft=0;ft<ct;ft++){let Mt=F.getViewport(ft);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),et.viewport(o),F.updateMatrices($,ft),n=F.getFrustum(),E(R,K,F.camera,$,this.type)}F.isPointLightShadow!==!0&&this.type===Pn&&L(F,K),F.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(S,T,Z)};function L(P,R){let K=t.update(v);f.defines.VSM_SAMPLES!==P.blurSamples&&(f.defines.VSM_SAMPLES=P.blurSamples,g.defines.VSM_SAMPLES=P.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=P.map.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(R,null,K,f,v,null),g.uniforms.shadow_pass.value=P.mapPass.texture,g.uniforms.resolution.value=P.mapSize,g.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(R,null,K,g,v,null)}function _(P,R,K,S){let T=null,Z=K.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(Z!==void 0)T=Z;else if(T=K.isPointLight===!0?c:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let et=T.uuid,xt=R.uuid,O=l[et];O===void 0&&(O={},l[et]=O);let Y=O[xt];Y===void 0&&(Y=T.clone(),O[xt]=Y,R.addEventListener("dispose",N)),T=Y}if(T.visible=R.visible,T.wireframe=R.wireframe,S===Pn?T.side=R.shadowSide!==null?R.shadowSide:R.side:T.side=R.shadowSide!==null?R.shadowSide:d[R.side],T.alphaMap=R.alphaMap,T.alphaTest=R.alphaTest,T.map=R.map,T.clipShadows=R.clipShadows,T.clippingPlanes=R.clippingPlanes,T.clipIntersection=R.clipIntersection,T.displacementMap=R.displacementMap,T.displacementScale=R.displacementScale,T.displacementBias=R.displacementBias,T.wireframeLinewidth=R.wireframeLinewidth,T.linewidth=R.linewidth,K.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let et=i.properties.get(T);et.light=K}return T}function E(P,R,K,S,T){if(P.visible===!1)return;if(P.layers.test(R.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&T===Pn)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,P.matrixWorld);let xt=t.update(P),O=P.material;if(Array.isArray(O)){let Y=xt.groups;for(let nt=0,$=Y.length;nt<$;nt++){let F=Y[nt],it=O[F.materialIndex];if(it&&it.visible){let ct=_(P,it,S,T);P.onBeforeShadow(i,P,R,K,xt,ct,F),i.renderBufferDirect(K,null,xt,ct,P,F),P.onAfterShadow(i,P,R,K,xt,ct,F)}}}else if(O.visible){let Y=_(P,O,S,T);P.onBeforeShadow(i,P,R,K,xt,Y,null),i.renderBufferDirect(K,null,xt,Y,P,null),P.onAfterShadow(i,P,R,K,xt,Y,null)}}let et=P.children;for(let xt=0,O=et.length;xt<O;xt++)E(et[xt],R,K,S,T)}function N(P){P.target.removeEventListener("dispose",N);for(let K in l){let S=l[K],T=P.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}function Dm(i,t,e){let n=e.isWebGL2;function s(){let B=!1,At=new Ue,Rt=null,Wt=new Ue(0,0,0,0);return{setMask:function(kt){Rt!==kt&&!B&&(i.colorMask(kt,kt,kt,kt),Rt=kt)},setLocked:function(kt){B=kt},setClear:function(kt,oe,ce,ge,De){De===!0&&(kt*=ge,oe*=ge,ce*=ge),At.set(kt,oe,ce,ge),Wt.equals(At)===!1&&(i.clearColor(kt,oe,ce,ge),Wt.copy(At))},reset:function(){B=!1,Rt=null,Wt.set(-1,0,0,0)}}}function r(){let B=!1,At=null,Rt=null,Wt=null;return{setTest:function(kt){kt?lt(i.DEPTH_TEST):H(i.DEPTH_TEST)},setMask:function(kt){At!==kt&&!B&&(i.depthMask(kt),At=kt)},setFunc:function(kt){if(Rt!==kt){switch(kt){case th:i.depthFunc(i.NEVER);break;case eh:i.depthFunc(i.ALWAYS);break;case nh:i.depthFunc(i.LESS);break;case cr:i.depthFunc(i.LEQUAL);break;case ih:i.depthFunc(i.EQUAL);break;case sh:i.depthFunc(i.GEQUAL);break;case rh:i.depthFunc(i.GREATER);break;case ah:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Rt=kt}},setLocked:function(kt){B=kt},setClear:function(kt){Wt!==kt&&(i.clearDepth(kt),Wt=kt)},reset:function(){B=!1,At=null,Rt=null,Wt=null}}}function o(){let B=!1,At=null,Rt=null,Wt=null,kt=null,oe=null,ce=null,ge=null,De=null;return{setTest:function(le){B||(le?lt(i.STENCIL_TEST):H(i.STENCIL_TEST))},setMask:function(le){At!==le&&!B&&(i.stencilMask(le),At=le)},setFunc:function(le,Ne,nn){(Rt!==le||Wt!==Ne||kt!==nn)&&(i.stencilFunc(le,Ne,nn),Rt=le,Wt=Ne,kt=nn)},setOp:function(le,Ne,nn){(oe!==le||ce!==Ne||ge!==nn)&&(i.stencilOp(le,Ne,nn),oe=le,ce=Ne,ge=nn)},setLocked:function(le){B=le},setClear:function(le){De!==le&&(i.clearStencil(le),De=le)},reset:function(){B=!1,At=null,Rt=null,Wt=null,kt=null,oe=null,ce=null,ge=null,De=null}}}let a=new s,c=new r,l=new o,h=new WeakMap,d=new WeakMap,f={},g={},x=new WeakMap,v=[],p=null,u=!1,L=null,_=null,E=null,N=null,P=null,R=null,K=null,S=new $t(0,0,0),T=0,Z=!1,et=null,xt=null,O=null,Y=null,nt=null,$=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,it=0,ct=i.getParameter(i.VERSION);ct.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(ct)[1]),F=it>=1):ct.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(ct)[1]),F=it>=2);let ft=null,Mt={},st=i.getParameter(i.SCISSOR_BOX),I=i.getParameter(i.VIEWPORT),C=new Ue().fromArray(st),b=new Ue().fromArray(I);function M(B,At,Rt,Wt){let kt=new Uint8Array(4),oe=i.createTexture();i.bindTexture(B,oe),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ce=0;ce<Rt;ce++)n&&(B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY)?i.texImage3D(At,0,i.RGBA,1,1,Wt,0,i.RGBA,i.UNSIGNED_BYTE,kt):i.texImage2D(At+ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,kt);return oe}let j={};j[i.TEXTURE_2D]=M(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=M(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(j[i.TEXTURE_2D_ARRAY]=M(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=M(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),lt(i.DEPTH_TEST),c.setFunc(cr),D(!1),m(Uo),lt(i.CULL_FACE),W(Wn);function lt(B){f[B]!==!0&&(i.enable(B),f[B]=!0)}function H(B){f[B]!==!1&&(i.disable(B),f[B]=!1)}function dt(B,At){return g[B]!==At?(i.bindFramebuffer(B,At),g[B]=At,n&&(B===i.DRAW_FRAMEBUFFER&&(g[i.FRAMEBUFFER]=At),B===i.FRAMEBUFFER&&(g[i.DRAW_FRAMEBUFFER]=At)),!0):!1}function A(B,At){let Rt=v,Wt=!1;if(B)if(Rt=x.get(At),Rt===void 0&&(Rt=[],x.set(At,Rt)),B.isWebGLMultipleRenderTargets){let kt=B.texture;if(Rt.length!==kt.length||Rt[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,ce=kt.length;oe<ce;oe++)Rt[oe]=i.COLOR_ATTACHMENT0+oe;Rt.length=kt.length,Wt=!0}}else Rt[0]!==i.COLOR_ATTACHMENT0&&(Rt[0]=i.COLOR_ATTACHMENT0,Wt=!0);else Rt[0]!==i.BACK&&(Rt[0]=i.BACK,Wt=!0);Wt&&(e.isWebGL2?i.drawBuffers(Rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Rt))}function Q(B){return p!==B?(i.useProgram(B),p=B,!0):!1}let U={[ii]:i.FUNC_ADD,[zl]:i.FUNC_SUBTRACT,[kl]:i.FUNC_REVERSE_SUBTRACT};if(n)U[Oo]=i.MIN,U[Fo]=i.MAX;else{let B=t.get("EXT_blend_minmax");B!==null&&(U[Oo]=B.MIN_EXT,U[Fo]=B.MAX_EXT)}let X={[Hl]:i.ZERO,[Vl]:i.ONE,[Gl]:i.SRC_COLOR,[Ra]:i.SRC_ALPHA,[Jl]:i.SRC_ALPHA_SATURATE,[Yl]:i.DST_COLOR,[Xl]:i.DST_ALPHA,[Wl]:i.ONE_MINUS_SRC_COLOR,[Ca]:i.ONE_MINUS_SRC_ALPHA,[Zl]:i.ONE_MINUS_DST_COLOR,[ql]:i.ONE_MINUS_DST_ALPHA,[$l]:i.CONSTANT_COLOR,[Kl]:i.ONE_MINUS_CONSTANT_COLOR,[jl]:i.CONSTANT_ALPHA,[Ql]:i.ONE_MINUS_CONSTANT_ALPHA};function W(B,At,Rt,Wt,kt,oe,ce,ge,De,le){if(B===Wn){u===!0&&(H(i.BLEND),u=!1);return}if(u===!1&&(lt(i.BLEND),u=!0),B!==Bl){if(B!==L||le!==Z){if((_!==ii||P!==ii)&&(i.blendEquation(i.FUNC_ADD),_=ii,P=ii),le)switch(B){case Oi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case or:i.blendFunc(i.ONE,i.ONE);break;case Do:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case No:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Oi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case or:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Do:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case No:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}E=null,N=null,R=null,K=null,S.set(0,0,0),T=0,L=B,Z=le}return}kt=kt||At,oe=oe||Rt,ce=ce||Wt,(At!==_||kt!==P)&&(i.blendEquationSeparate(U[At],U[kt]),_=At,P=kt),(Rt!==E||Wt!==N||oe!==R||ce!==K)&&(i.blendFuncSeparate(X[Rt],X[Wt],X[oe],X[ce]),E=Rt,N=Wt,R=oe,K=ce),(ge.equals(S)===!1||De!==T)&&(i.blendColor(ge.r,ge.g,ge.b,De),S.copy(ge),T=De),L=B,Z=!1}function pt(B,At){B.side===an?H(i.CULL_FACE):lt(i.CULL_FACE);let Rt=B.side===$e;At&&(Rt=!Rt),D(Rt),B.blending===Oi&&B.transparent===!1?W(Wn):W(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),c.setFunc(B.depthFunc),c.setTest(B.depthTest),c.setMask(B.depthWrite),a.setMask(B.colorWrite);let Wt=B.stencilWrite;l.setTest(Wt),Wt&&(l.setMask(B.stencilWriteMask),l.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),l.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),z(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?lt(i.SAMPLE_ALPHA_TO_COVERAGE):H(i.SAMPLE_ALPHA_TO_COVERAGE)}function D(B){et!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),et=B)}function m(B){B!==Ol?(lt(i.CULL_FACE),B!==xt&&(B===Uo?i.cullFace(i.BACK):B===Fl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):H(i.CULL_FACE),xt=B}function y(B){B!==O&&(F&&i.lineWidth(B),O=B)}function z(B,At,Rt){B?(lt(i.POLYGON_OFFSET_FILL),(Y!==At||nt!==Rt)&&(i.polygonOffset(At,Rt),Y=At,nt=Rt)):H(i.POLYGON_OFFSET_FILL)}function mt(B){B?lt(i.SCISSOR_TEST):H(i.SCISSOR_TEST)}function gt(B){B===void 0&&(B=i.TEXTURE0+$-1),ft!==B&&(i.activeTexture(B),ft=B)}function ut(B,At,Rt){Rt===void 0&&(ft===null?Rt=i.TEXTURE0+$-1:Rt=ft);let Wt=Mt[Rt];Wt===void 0&&(Wt={type:void 0,texture:void 0},Mt[Rt]=Wt),(Wt.type!==B||Wt.texture!==At)&&(ft!==Rt&&(i.activeTexture(Rt),ft=Rt),i.bindTexture(B,At||j[B]),Wt.type=B,Wt.texture=At)}function Ut(){let B=Mt[ft];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function St(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function It(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Bt(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ht(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function yt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Kt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Vt(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function zt(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Lt(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Nt(B){C.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),C.copy(B))}function re(B){b.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),b.copy(B))}function ae(B,At){let Rt=d.get(At);Rt===void 0&&(Rt=new WeakMap,d.set(At,Rt));let Wt=Rt.get(B);Wt===void 0&&(Wt=i.getUniformBlockIndex(At,B.name),Rt.set(B,Wt))}function ne(B,At){let Wt=d.get(At).get(B);h.get(At)!==Wt&&(i.uniformBlockBinding(At,Wt,B.__bindingPointIndex),h.set(At,Wt))}function Et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ft=null,Mt={},g={},x=new WeakMap,v=[],p=null,u=!1,L=null,_=null,E=null,N=null,P=null,R=null,K=null,S=new $t(0,0,0),T=0,Z=!1,et=null,xt=null,O=null,Y=null,nt=null,C.set(0,0,i.canvas.width,i.canvas.height),b.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:lt,disable:H,bindFramebuffer:dt,drawBuffers:A,useProgram:Q,setBlending:W,setMaterial:pt,setFlipSided:D,setCullFace:m,setLineWidth:y,setPolygonOffset:z,setScissorTest:mt,activeTexture:gt,bindTexture:ut,unbindTexture:Ut,compressedTexImage2D:St,compressedTexImage3D:It,texImage2D:zt,texImage3D:Lt,updateUBOMapping:ae,uniformBlockBinding:ne,texStorage2D:Yt,texStorage3D:Vt,texSubImage2D:Bt,texSubImage3D:Ht,compressedTexSubImage2D:yt,compressedTexSubImage3D:Kt,scissor:Nt,viewport:re,reset:Et}}function Nm(i,t,e,n,s,r,o){let a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(m,y){return g?new OffscreenCanvas(m,y):gr("canvas")}function v(m,y,z,mt){let gt=1;if((m.width>mt||m.height>mt)&&(gt=mt/Math.max(m.width,m.height)),gt<1||y===!0)if(typeof HTMLImageElement<"u"&&m instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&m instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&m instanceof ImageBitmap){let ut=y?mr:Math.floor,Ut=ut(gt*m.width),St=ut(gt*m.height);d===void 0&&(d=x(Ut,St));let It=z?x(Ut,St):d;return It.width=Ut,It.height=St,It.getContext("2d").drawImage(m,0,0,Ut,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+m.width+"x"+m.height+") to ("+Ut+"x"+St+")."),It}else return"data"in m&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+m.width+"x"+m.height+")."),m;return m}function p(m){return Oa(m.width)&&Oa(m.height)}function u(m){return a?!1:m.wrapS!==mn||m.wrapT!==mn||m.minFilter!==Xe&&m.minFilter!==rn}function L(m,y){return m.generateMipmaps&&y&&m.minFilter!==Xe&&m.minFilter!==rn}function _(m){i.generateMipmap(m)}function E(m,y,z,mt,gt=!1){if(a===!1)return y;if(m!==null){if(i[m]!==void 0)return i[m];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+m+"'")}let ut=y;if(y===i.RED&&(z===i.FLOAT&&(ut=i.R32F),z===i.HALF_FLOAT&&(ut=i.R16F),z===i.UNSIGNED_BYTE&&(ut=i.R8)),y===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(ut=i.R8UI),z===i.UNSIGNED_SHORT&&(ut=i.R16UI),z===i.UNSIGNED_INT&&(ut=i.R32UI),z===i.BYTE&&(ut=i.R8I),z===i.SHORT&&(ut=i.R16I),z===i.INT&&(ut=i.R32I)),y===i.RG&&(z===i.FLOAT&&(ut=i.RG32F),z===i.HALF_FLOAT&&(ut=i.RG16F),z===i.UNSIGNED_BYTE&&(ut=i.RG8)),y===i.RGBA){let Ut=gt?ur:he.getTransfer(mt);z===i.FLOAT&&(ut=i.RGBA32F),z===i.HALF_FLOAT&&(ut=i.RGBA16F),z===i.UNSIGNED_BYTE&&(ut=Ut===pe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(ut=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(ut=i.RGB5_A1)}return(ut===i.R16F||ut===i.R32F||ut===i.RG16F||ut===i.RG32F||ut===i.RGBA16F||ut===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ut}function N(m,y,z){return L(m,z)===!0||m.isFramebufferTexture&&m.minFilter!==Xe&&m.minFilter!==rn?Math.log2(Math.max(y.width,y.height))+1:m.mipmaps!==void 0&&m.mipmaps.length>0?m.mipmaps.length:m.isCompressedTexture&&Array.isArray(m.image)?y.mipmaps.length:1}function P(m){return m===Xe||m===Bo||m===$r?i.NEAREST:i.LINEAR}function R(m){let y=m.target;y.removeEventListener("dispose",R),S(y),y.isVideoTexture&&h.delete(y)}function K(m){let y=m.target;y.removeEventListener("dispose",K),Z(y)}function S(m){let y=n.get(m);if(y.__webglInit===void 0)return;let z=m.source,mt=f.get(z);if(mt){let gt=mt[y.__cacheKey];gt.usedTimes--,gt.usedTimes===0&&T(m),Object.keys(mt).length===0&&f.delete(z)}n.remove(m)}function T(m){let y=n.get(m);i.deleteTexture(y.__webglTexture);let z=m.source,mt=f.get(z);delete mt[y.__cacheKey],o.memory.textures--}function Z(m){let y=m.texture,z=n.get(m),mt=n.get(y);if(mt.__webglTexture!==void 0&&(i.deleteTexture(mt.__webglTexture),o.memory.textures--),m.depthTexture&&m.depthTexture.dispose(),m.isWebGLCubeRenderTarget)for(let gt=0;gt<6;gt++){if(Array.isArray(z.__webglFramebuffer[gt]))for(let ut=0;ut<z.__webglFramebuffer[gt].length;ut++)i.deleteFramebuffer(z.__webglFramebuffer[gt][ut]);else i.deleteFramebuffer(z.__webglFramebuffer[gt]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[gt])}else{if(Array.isArray(z.__webglFramebuffer))for(let gt=0;gt<z.__webglFramebuffer.length;gt++)i.deleteFramebuffer(z.__webglFramebuffer[gt]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let gt=0;gt<z.__webglColorRenderbuffer.length;gt++)z.__webglColorRenderbuffer[gt]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[gt]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(m.isWebGLMultipleRenderTargets)for(let gt=0,ut=y.length;gt<ut;gt++){let Ut=n.get(y[gt]);Ut.__webglTexture&&(i.deleteTexture(Ut.__webglTexture),o.memory.textures--),n.remove(y[gt])}n.remove(y),n.remove(m)}let et=0;function xt(){et=0}function O(){let m=et;return m>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+m+" texture units while this GPU supports only "+s.maxTextures),et+=1,m}function Y(m){let y=[];return y.push(m.wrapS),y.push(m.wrapT),y.push(m.wrapR||0),y.push(m.magFilter),y.push(m.minFilter),y.push(m.anisotropy),y.push(m.internalFormat),y.push(m.format),y.push(m.type),y.push(m.generateMipmaps),y.push(m.premultiplyAlpha),y.push(m.flipY),y.push(m.unpackAlignment),y.push(m.colorSpace),y.join()}function nt(m,y){let z=n.get(m);if(m.isVideoTexture&&pt(m),m.isRenderTargetTexture===!1&&m.version>0&&z.__version!==m.version){let mt=m.image;if(mt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(mt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{C(z,m,y);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+y)}function $(m,y){let z=n.get(m);if(m.version>0&&z.__version!==m.version){C(z,m,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+y)}function F(m,y){let z=n.get(m);if(m.version>0&&z.__version!==m.version){C(z,m,y);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+y)}function it(m,y){let z=n.get(m);if(m.version>0&&z.__version!==m.version){b(z,m,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+y)}let ct={[Ua]:i.REPEAT,[mn]:i.CLAMP_TO_EDGE,[Da]:i.MIRRORED_REPEAT},ft={[Xe]:i.NEAREST,[Bo]:i.NEAREST_MIPMAP_NEAREST,[$r]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[ph]:i.LINEAR_MIPMAP_NEAREST,[ds]:i.LINEAR_MIPMAP_LINEAR},Mt={[Th]:i.NEVER,[Ih]:i.ALWAYS,[Lh]:i.LESS,[bl]:i.LEQUAL,[Ah]:i.EQUAL,[Ph]:i.GEQUAL,[Rh]:i.GREATER,[Ch]:i.NOTEQUAL};function st(m,y,z){if(z?(i.texParameteri(m,i.TEXTURE_WRAP_S,ct[y.wrapS]),i.texParameteri(m,i.TEXTURE_WRAP_T,ct[y.wrapT]),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,ct[y.wrapR]),i.texParameteri(m,i.TEXTURE_MAG_FILTER,ft[y.magFilter]),i.texParameteri(m,i.TEXTURE_MIN_FILTER,ft[y.minFilter])):(i.texParameteri(m,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(m,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(y.wrapS!==mn||y.wrapT!==mn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(m,i.TEXTURE_MAG_FILTER,P(y.magFilter)),i.texParameteri(m,i.TEXTURE_MIN_FILTER,P(y.minFilter)),y.minFilter!==Xe&&y.minFilter!==rn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(i.texParameteri(m,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(m,i.TEXTURE_COMPARE_FUNC,Mt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let mt=t.get("EXT_texture_filter_anisotropic");if(y.magFilter===Xe||y.minFilter!==$r&&y.minFilter!==ds||y.type===Gn&&t.has("OES_texture_float_linear")===!1||a===!1&&y.type===fs&&t.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(i.texParameterf(m,mt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function I(m,y){let z=!1;m.__webglInit===void 0&&(m.__webglInit=!0,y.addEventListener("dispose",R));let mt=y.source,gt=f.get(mt);gt===void 0&&(gt={},f.set(mt,gt));let ut=Y(y);if(ut!==m.__cacheKey){gt[ut]===void 0&&(gt[ut]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),gt[ut].usedTimes++;let Ut=gt[m.__cacheKey];Ut!==void 0&&(gt[m.__cacheKey].usedTimes--,Ut.usedTimes===0&&T(y)),m.__cacheKey=ut,m.__webglTexture=gt[ut].texture}return z}function C(m,y,z){let mt=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(mt=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(mt=i.TEXTURE_3D);let gt=I(m,y),ut=y.source;e.bindTexture(mt,m.__webglTexture,i.TEXTURE0+z);let Ut=n.get(ut);if(ut.version!==Ut.__version||gt===!0){e.activeTexture(i.TEXTURE0+z);let St=he.getPrimaries(he.workingColorSpace),It=y.colorSpace===on?null:he.getPrimaries(y.colorSpace),Bt=y.colorSpace===on||St===It?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let Ht=u(y)&&p(y.image)===!1,yt=v(y.image,Ht,!1,s.maxTextureSize);yt=D(y,yt);let Kt=p(yt)||a,Yt=r.convert(y.format,y.colorSpace),Vt=r.convert(y.type),zt=E(y.internalFormat,Yt,Vt,y.colorSpace,y.isVideoTexture);st(mt,y,Kt);let Lt,Nt=y.mipmaps,re=a&&y.isVideoTexture!==!0&&zt!==vl,ae=Ut.__version===void 0||gt===!0,ne=N(y,yt,Kt);if(y.isDepthTexture)zt=i.DEPTH_COMPONENT,a?y.type===Gn?zt=i.DEPTH_COMPONENT32F:y.type===Vn?zt=i.DEPTH_COMPONENT24:y.type===ri?zt=i.DEPTH24_STENCIL8:zt=i.DEPTH_COMPONENT16:y.type===Gn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===ai&&zt===i.DEPTH_COMPONENT&&y.type!==Eo&&y.type!==Vn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=Vn,Vt=r.convert(y.type)),y.format===Hi&&zt===i.DEPTH_COMPONENT&&(zt=i.DEPTH_STENCIL,y.type!==ri&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=ri,Vt=r.convert(y.type))),ae&&(re?e.texStorage2D(i.TEXTURE_2D,1,zt,yt.width,yt.height):e.texImage2D(i.TEXTURE_2D,0,zt,yt.width,yt.height,0,Yt,Vt,null));else if(y.isDataTexture)if(Nt.length>0&&Kt){re&&ae&&e.texStorage2D(i.TEXTURE_2D,ne,zt,Nt[0].width,Nt[0].height);for(let Et=0,B=Nt.length;Et<B;Et++)Lt=Nt[Et],re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Lt.width,Lt.height,Yt,Vt,Lt.data):e.texImage2D(i.TEXTURE_2D,Et,zt,Lt.width,Lt.height,0,Yt,Vt,Lt.data);y.generateMipmaps=!1}else re?(ae&&e.texStorage2D(i.TEXTURE_2D,ne,zt,yt.width,yt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt.width,yt.height,Yt,Vt,yt.data)):e.texImage2D(i.TEXTURE_2D,0,zt,yt.width,yt.height,0,Yt,Vt,yt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){re&&ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ne,zt,Nt[0].width,Nt[0].height,yt.depth);for(let Et=0,B=Nt.length;Et<B;Et++)Lt=Nt[Et],y.format!==gn?Yt!==null?re?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Et,0,0,0,Lt.width,Lt.height,yt.depth,Yt,Lt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Et,zt,Lt.width,Lt.height,yt.depth,0,Lt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage3D(i.TEXTURE_2D_ARRAY,Et,0,0,0,Lt.width,Lt.height,yt.depth,Yt,Vt,Lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Et,zt,Lt.width,Lt.height,yt.depth,0,Yt,Vt,Lt.data)}else{re&&ae&&e.texStorage2D(i.TEXTURE_2D,ne,zt,Nt[0].width,Nt[0].height);for(let Et=0,B=Nt.length;Et<B;Et++)Lt=Nt[Et],y.format!==gn?Yt!==null?re?e.compressedTexSubImage2D(i.TEXTURE_2D,Et,0,0,Lt.width,Lt.height,Yt,Lt.data):e.compressedTexImage2D(i.TEXTURE_2D,Et,zt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Lt.width,Lt.height,Yt,Vt,Lt.data):e.texImage2D(i.TEXTURE_2D,Et,zt,Lt.width,Lt.height,0,Yt,Vt,Lt.data)}else if(y.isDataArrayTexture)re?(ae&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ne,zt,yt.width,yt.height,yt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,yt.width,yt.height,yt.depth,Yt,Vt,yt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,yt.width,yt.height,yt.depth,0,Yt,Vt,yt.data);else if(y.isData3DTexture)re?(ae&&e.texStorage3D(i.TEXTURE_3D,ne,zt,yt.width,yt.height,yt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,yt.width,yt.height,yt.depth,Yt,Vt,yt.data)):e.texImage3D(i.TEXTURE_3D,0,zt,yt.width,yt.height,yt.depth,0,Yt,Vt,yt.data);else if(y.isFramebufferTexture){if(ae)if(re)e.texStorage2D(i.TEXTURE_2D,ne,zt,yt.width,yt.height);else{let Et=yt.width,B=yt.height;for(let At=0;At<ne;At++)e.texImage2D(i.TEXTURE_2D,At,zt,Et,B,0,Yt,Vt,null),Et>>=1,B>>=1}}else if(Nt.length>0&&Kt){re&&ae&&e.texStorage2D(i.TEXTURE_2D,ne,zt,Nt[0].width,Nt[0].height);for(let Et=0,B=Nt.length;Et<B;Et++)Lt=Nt[Et],re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Yt,Vt,Lt):e.texImage2D(i.TEXTURE_2D,Et,zt,Yt,Vt,Lt);y.generateMipmaps=!1}else re?(ae&&e.texStorage2D(i.TEXTURE_2D,ne,zt,yt.width,yt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Yt,Vt,yt)):e.texImage2D(i.TEXTURE_2D,0,zt,Yt,Vt,yt);L(y,Kt)&&_(mt),Ut.__version=ut.version,y.onUpdate&&y.onUpdate(y)}m.__version=y.version}function b(m,y,z){if(y.image.length!==6)return;let mt=I(m,y),gt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,m.__webglTexture,i.TEXTURE0+z);let ut=n.get(gt);if(gt.version!==ut.__version||mt===!0){e.activeTexture(i.TEXTURE0+z);let Ut=he.getPrimaries(he.workingColorSpace),St=y.colorSpace===on?null:he.getPrimaries(y.colorSpace),It=y.colorSpace===on||Ut===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let Bt=y.isCompressedTexture||y.image[0].isCompressedTexture,Ht=y.image[0]&&y.image[0].isDataTexture,yt=[];for(let Et=0;Et<6;Et++)!Bt&&!Ht?yt[Et]=v(y.image[Et],!1,!0,s.maxCubemapSize):yt[Et]=Ht?y.image[Et].image:y.image[Et],yt[Et]=D(y,yt[Et]);let Kt=yt[0],Yt=p(Kt)||a,Vt=r.convert(y.format,y.colorSpace),zt=r.convert(y.type),Lt=E(y.internalFormat,Vt,zt,y.colorSpace),Nt=a&&y.isVideoTexture!==!0,re=ut.__version===void 0||mt===!0,ae=N(y,Kt,Yt);st(i.TEXTURE_CUBE_MAP,y,Yt);let ne;if(Bt){Nt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Lt,Kt.width,Kt.height);for(let Et=0;Et<6;Et++){ne=yt[Et].mipmaps;for(let B=0;B<ne.length;B++){let At=ne[B];y.format!==gn?Vt!==null?Nt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B,0,0,At.width,At.height,Vt,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B,Lt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B,0,0,At.width,At.height,Vt,zt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B,Lt,At.width,At.height,0,Vt,zt,At.data)}}}else{ne=y.mipmaps,Nt&&re&&(ne.length>0&&ae++,e.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Lt,yt[0].width,yt[0].height));for(let Et=0;Et<6;Et++)if(Ht){Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,yt[Et].width,yt[Et].height,Vt,zt,yt[Et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Lt,yt[Et].width,yt[Et].height,0,Vt,zt,yt[Et].data);for(let B=0;B<ne.length;B++){let Rt=ne[B].image[Et].image;Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B+1,0,0,Rt.width,Rt.height,Vt,zt,Rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B+1,Lt,Rt.width,Rt.height,0,Vt,zt,Rt.data)}}else{Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,Vt,zt,yt[Et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Lt,Vt,zt,yt[Et]);for(let B=0;B<ne.length;B++){let At=ne[B];Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B+1,0,0,Vt,zt,At.image[Et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,B+1,Lt,Vt,zt,At.image[Et])}}}L(y,Yt)&&_(i.TEXTURE_CUBE_MAP),ut.__version=gt.version,y.onUpdate&&y.onUpdate(y)}m.__version=y.version}function M(m,y,z,mt,gt,ut){let Ut=r.convert(z.format,z.colorSpace),St=r.convert(z.type),It=E(z.internalFormat,Ut,St,z.colorSpace);if(!n.get(y).__hasExternalTextures){let Ht=Math.max(1,y.width>>ut),yt=Math.max(1,y.height>>ut);gt===i.TEXTURE_3D||gt===i.TEXTURE_2D_ARRAY?e.texImage3D(gt,ut,It,Ht,yt,y.depth,0,Ut,St,null):e.texImage2D(gt,ut,It,Ht,yt,0,Ut,St,null)}e.bindFramebuffer(i.FRAMEBUFFER,m),W(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,mt,gt,n.get(z).__webglTexture,0,X(y)):(gt===i.TEXTURE_2D||gt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&gt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,mt,gt,n.get(z).__webglTexture,ut),e.bindFramebuffer(i.FRAMEBUFFER,null)}function j(m,y,z){if(i.bindRenderbuffer(i.RENDERBUFFER,m),y.depthBuffer&&!y.stencilBuffer){let mt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||W(y)){let gt=y.depthTexture;gt&&gt.isDepthTexture&&(gt.type===Gn?mt=i.DEPTH_COMPONENT32F:gt.type===Vn&&(mt=i.DEPTH_COMPONENT24));let ut=X(y);W(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,mt,y.width,y.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,mt,y.width,y.height)}else i.renderbufferStorage(i.RENDERBUFFER,mt,y.width,y.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,m)}else if(y.depthBuffer&&y.stencilBuffer){let mt=X(y);z&&W(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,i.DEPTH24_STENCIL8,y.width,y.height):W(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt,i.DEPTH24_STENCIL8,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,m)}else{let mt=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let gt=0;gt<mt.length;gt++){let ut=mt[gt],Ut=r.convert(ut.format,ut.colorSpace),St=r.convert(ut.type),It=E(ut.internalFormat,Ut,St,ut.colorSpace),Bt=X(y);z&&W(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,It,y.width,y.height):W(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Bt,It,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,It,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function lt(m,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,m),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),nt(y.depthTexture,0);let mt=n.get(y.depthTexture).__webglTexture,gt=X(y);if(y.depthTexture.format===ai)W(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,mt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,mt,0);else if(y.depthTexture.format===Hi)W(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,mt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,mt,0);else throw new Error("Unknown depthTexture format")}function H(m){let y=n.get(m),z=m.isWebGLCubeRenderTarget===!0;if(m.depthTexture&&!y.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");lt(y.__webglFramebuffer,m)}else if(z){y.__webglDepthbuffer=[];for(let mt=0;mt<6;mt++)e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[mt]),y.__webglDepthbuffer[mt]=i.createRenderbuffer(),j(y.__webglDepthbuffer[mt],m,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=i.createRenderbuffer(),j(y.__webglDepthbuffer,m,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function dt(m,y,z){let mt=n.get(m);y!==void 0&&M(mt.__webglFramebuffer,m,m.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&H(m)}function A(m){let y=m.texture,z=n.get(m),mt=n.get(y);m.addEventListener("dispose",K),m.isWebGLMultipleRenderTargets!==!0&&(mt.__webglTexture===void 0&&(mt.__webglTexture=i.createTexture()),mt.__version=y.version,o.memory.textures++);let gt=m.isWebGLCubeRenderTarget===!0,ut=m.isWebGLMultipleRenderTargets===!0,Ut=p(m)||a;if(gt){z.__webglFramebuffer=[];for(let St=0;St<6;St++)if(a&&y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[St]=[];for(let It=0;It<y.mipmaps.length;It++)z.__webglFramebuffer[St][It]=i.createFramebuffer()}else z.__webglFramebuffer[St]=i.createFramebuffer()}else{if(a&&y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let St=0;St<y.mipmaps.length;St++)z.__webglFramebuffer[St]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(ut)if(s.drawBuffers){let St=m.texture;for(let It=0,Bt=St.length;It<Bt;It++){let Ht=n.get(St[It]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&m.samples>0&&W(m)===!1){let St=ut?y:[y];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let It=0;It<St.length;It++){let Bt=St[It];z.__webglColorRenderbuffer[It]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[It]);let Ht=r.convert(Bt.format,Bt.colorSpace),yt=r.convert(Bt.type),Kt=E(Bt.internalFormat,Ht,yt,Bt.colorSpace,m.isXRRenderTarget===!0),Yt=X(m);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,Kt,m.width,m.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,z.__webglColorRenderbuffer[It])}i.bindRenderbuffer(i.RENDERBUFFER,null),m.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),j(z.__webglDepthRenderbuffer,m,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(gt){e.bindTexture(i.TEXTURE_CUBE_MAP,mt.__webglTexture),st(i.TEXTURE_CUBE_MAP,y,Ut);for(let St=0;St<6;St++)if(a&&y.mipmaps&&y.mipmaps.length>0)for(let It=0;It<y.mipmaps.length;It++)M(z.__webglFramebuffer[St][It],m,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,It);else M(z.__webglFramebuffer[St],m,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);L(y,Ut)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ut){let St=m.texture;for(let It=0,Bt=St.length;It<Bt;It++){let Ht=St[It],yt=n.get(Ht);e.bindTexture(i.TEXTURE_2D,yt.__webglTexture),st(i.TEXTURE_2D,Ht,Ut),M(z.__webglFramebuffer,m,Ht,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,0),L(Ht,Ut)&&_(i.TEXTURE_2D)}e.unbindTexture()}else{let St=i.TEXTURE_2D;if((m.isWebGL3DRenderTarget||m.isWebGLArrayRenderTarget)&&(a?St=m.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(St,mt.__webglTexture),st(St,y,Ut),a&&y.mipmaps&&y.mipmaps.length>0)for(let It=0;It<y.mipmaps.length;It++)M(z.__webglFramebuffer[It],m,y,i.COLOR_ATTACHMENT0,St,It);else M(z.__webglFramebuffer,m,y,i.COLOR_ATTACHMENT0,St,0);L(y,Ut)&&_(St),e.unbindTexture()}m.depthBuffer&&H(m)}function Q(m){let y=p(m)||a,z=m.isWebGLMultipleRenderTargets===!0?m.texture:[m.texture];for(let mt=0,gt=z.length;mt<gt;mt++){let ut=z[mt];if(L(ut,y)){let Ut=m.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,St=n.get(ut).__webglTexture;e.bindTexture(Ut,St),_(Ut),e.unbindTexture()}}}function U(m){if(a&&m.samples>0&&W(m)===!1){let y=m.isWebGLMultipleRenderTargets?m.texture:[m.texture],z=m.width,mt=m.height,gt=i.COLOR_BUFFER_BIT,ut=[],Ut=m.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(m),It=m.isWebGLMultipleRenderTargets===!0;if(It)for(let Bt=0;Bt<y.length;Bt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let Bt=0;Bt<y.length;Bt++){ut.push(i.COLOR_ATTACHMENT0+Bt),m.depthBuffer&&ut.push(Ut);let Ht=St.__ignoreDepthValues!==void 0?St.__ignoreDepthValues:!1;if(Ht===!1&&(m.depthBuffer&&(gt|=i.DEPTH_BUFFER_BIT),m.stencilBuffer&&(gt|=i.STENCIL_BUFFER_BIT)),It&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[Bt]),Ht===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ut]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ut])),It){let yt=n.get(y[Bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,yt,0)}i.blitFramebuffer(0,0,z,mt,0,0,z,mt,gt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ut)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),It)for(let Bt=0;Bt<y.length;Bt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,St.__webglColorRenderbuffer[Bt]);let Ht=n.get(y[Bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,Ht,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}}function X(m){return Math.min(s.maxSamples,m.samples)}function W(m){let y=n.get(m);return a&&m.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function pt(m){let y=o.render.frame;h.get(m)!==y&&(h.set(m,y),m.update())}function D(m,y){let z=m.colorSpace,mt=m.format,gt=m.type;return m.isCompressedTexture===!0||m.isVideoTexture===!0||m.format===Na||z!==Nn&&z!==on&&(he.getTransfer(z)===pe?a===!1?t.has("EXT_sRGB")===!0&&mt===gn?(m.format=Na,m.minFilter=rn,m.generateMipmaps=!1):y=_r.sRGBToLinear(y):(mt!==gn||gt!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),y}this.allocateTextureUnit=O,this.resetTextureUnits=xt,this.setTexture2D=nt,this.setTexture2DArray=$,this.setTexture3D=F,this.setTextureCube=it,this.rebindTextures=dt,this.setupRenderTarget=A,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=U,this.setupDepthRenderbuffer=H,this.setupFrameBufferTexture=M,this.useMultisampledRTT=W}function Om(i,t,e){let n=e.isWebGL2;function s(r,o=on){let a,c=he.getTransfer(o);if(r===qn)return i.UNSIGNED_BYTE;if(r===ml)return i.UNSIGNED_SHORT_4_4_4_4;if(r===gl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===mh)return i.BYTE;if(r===gh)return i.SHORT;if(r===Eo)return i.UNSIGNED_SHORT;if(r===pl)return i.INT;if(r===Vn)return i.UNSIGNED_INT;if(r===Gn)return i.FLOAT;if(r===fs)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===_h)return i.ALPHA;if(r===gn)return i.RGBA;if(r===xh)return i.LUMINANCE;if(r===yh)return i.LUMINANCE_ALPHA;if(r===ai)return i.DEPTH_COMPONENT;if(r===Hi)return i.DEPTH_STENCIL;if(r===Na)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===vh)return i.RED;if(r===_l)return i.RED_INTEGER;if(r===Mh)return i.RG;if(r===xl)return i.RG_INTEGER;if(r===yl)return i.RGBA_INTEGER;if(r===Kr||r===jr||r===Qr||r===ta)if(c===pe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Kr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===jr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Qr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ta)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Kr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===jr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Qr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ta)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===zo||r===ko||r===Ho||r===Vo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===zo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ko)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ho)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Vo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===vl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Go||r===Wo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Go)return c===pe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Wo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Xo||r===qo||r===Yo||r===Zo||r===Jo||r===$o||r===Ko||r===jo||r===Qo||r===tc||r===ec||r===nc||r===ic||r===sc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Xo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===qo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Yo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Zo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Jo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===$o)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ko)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===jo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Qo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===tc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===ec)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===nc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ic)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===sc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ea||r===rc||r===ac)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ea)return c===pe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===rc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ac)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Sh||r===oc||r===cc||r===lc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ea)return a.COMPRESSED_RED_RGTC1_EXT;if(r===oc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===cc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===lc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ri?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Ja=class extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Dn=class extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}},Fm={type:"move"},ls=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),u=this._getHandJoint(l,v);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),g=.02,x=.005;l.inputState.pinching&&f>g+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=g-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Fm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Dn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},$a=class extends Yn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,f=null,g=null,x=null,v=e.getContextAttributes(),p=null,u=null,L=[],_=[],E=new _t,N=null,P=new Ve;P.layers.enable(1),P.viewport=new Ue;let R=new Ve;R.layers.enable(2),R.viewport=new Ue;let K=[P,R],S=new Ja;S.layers.enable(1),S.layers.enable(2);let T=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(st){let I=L[st];return I===void 0&&(I=new ls,L[st]=I),I.getTargetRaySpace()},this.getControllerGrip=function(st){let I=L[st];return I===void 0&&(I=new ls,L[st]=I),I.getGripSpace()},this.getHand=function(st){let I=L[st];return I===void 0&&(I=new ls,L[st]=I),I.getHandSpace()};function et(st){let I=_.indexOf(st.inputSource);if(I===-1)return;let C=L[I];C!==void 0&&(C.update(st.inputSource,st.frame,l||o),C.dispatchEvent({type:st.type,data:st.inputSource}))}function xt(){s.removeEventListener("select",et),s.removeEventListener("selectstart",et),s.removeEventListener("selectend",et),s.removeEventListener("squeeze",et),s.removeEventListener("squeezestart",et),s.removeEventListener("squeezeend",et),s.removeEventListener("end",xt),s.removeEventListener("inputsourceschange",O);for(let st=0;st<L.length;st++){let I=_[st];I!==null&&(_[st]=null,L[st].disconnect(I))}T=null,Z=null,t.setRenderTarget(p),g=null,f=null,d=null,s=null,u=null,Mt.stop(),n.isPresenting=!1,t.setPixelRatio(N),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(st){r=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(st){a=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(st){l=st},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(st){if(s=st,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",et),s.addEventListener("selectstart",et),s.addEventListener("selectend",et),s.addEventListener("squeeze",et),s.addEventListener("squeezestart",et),s.addEventListener("squeezeend",et),s.addEventListener("end",xt),s.addEventListener("inputsourceschange",O),v.xrCompatible!==!0&&await e.makeXRCompatible(),N=t.getPixelRatio(),t.getSize(E),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let I={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,e,I),s.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),u=new On(g.framebufferWidth,g.framebufferHeight,{format:gn,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let I=null,C=null,b=null;v.depth&&(b=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,I=v.stencil?Hi:ai,C=v.stencil?ri:Vn);let M={colorFormat:e.RGBA8,depthFormat:b,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(M),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),u=new On(f.textureWidth,f.textureHeight,{format:gn,type:qn,depthTexture:new Ar(f.textureWidth,f.textureHeight,C,void 0,void 0,void 0,void 0,void 0,void 0,I),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});let j=t.properties.get(u);j.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Mt.setContext(s),Mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function O(st){for(let I=0;I<st.removed.length;I++){let C=st.removed[I],b=_.indexOf(C);b>=0&&(_[b]=null,L[b].disconnect(C))}for(let I=0;I<st.added.length;I++){let C=st.added[I],b=_.indexOf(C);if(b===-1){for(let j=0;j<L.length;j++)if(j>=_.length){_.push(C),b=j;break}else if(_[j]===null){_[j]=C,b=j;break}if(b===-1)break}let M=L[b];M&&M.connect(C)}}let Y=new V,nt=new V;function $(st,I,C){Y.setFromMatrixPosition(I.matrixWorld),nt.setFromMatrixPosition(C.matrixWorld);let b=Y.distanceTo(nt),M=I.projectionMatrix.elements,j=C.projectionMatrix.elements,lt=M[14]/(M[10]-1),H=M[14]/(M[10]+1),dt=(M[9]+1)/M[5],A=(M[9]-1)/M[5],Q=(M[8]-1)/M[0],U=(j[8]+1)/j[0],X=lt*Q,W=lt*U,pt=b/(-Q+U),D=pt*-Q;I.matrixWorld.decompose(st.position,st.quaternion,st.scale),st.translateX(D),st.translateZ(pt),st.matrixWorld.compose(st.position,st.quaternion,st.scale),st.matrixWorldInverse.copy(st.matrixWorld).invert();let m=lt+pt,y=H+pt,z=X-D,mt=W+(b-D),gt=dt*H/y*m,ut=A*H/y*m;st.projectionMatrix.makePerspective(z,mt,gt,ut,m,y),st.projectionMatrixInverse.copy(st.projectionMatrix).invert()}function F(st,I){I===null?st.matrixWorld.copy(st.matrix):st.matrixWorld.multiplyMatrices(I.matrixWorld,st.matrix),st.matrixWorldInverse.copy(st.matrixWorld).invert()}this.updateCamera=function(st){if(s===null)return;S.near=R.near=P.near=st.near,S.far=R.far=P.far=st.far,(T!==S.near||Z!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),T=S.near,Z=S.far);let I=st.parent,C=S.cameras;F(S,I);for(let b=0;b<C.length;b++)F(C[b],I);C.length===2?$(S,P,R):S.projectionMatrix.copy(P.projectionMatrix),it(st,S,I)};function it(st,I,C){C===null?st.matrix.copy(I.matrixWorld):(st.matrix.copy(C.matrixWorld),st.matrix.invert(),st.matrix.multiply(I.matrixWorld)),st.matrix.decompose(st.position,st.quaternion,st.scale),st.updateMatrixWorld(!0),st.projectionMatrix.copy(I.projectionMatrix),st.projectionMatrixInverse.copy(I.projectionMatrixInverse),st.isPerspectiveCamera&&(st.fov=Vi*2*Math.atan(1/st.projectionMatrix.elements[5]),st.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&g===null))return c},this.setFoveation=function(st){c=st,f!==null&&(f.fixedFoveation=st),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=st)};let ct=null;function ft(st,I){if(h=I.getViewerPose(l||o),x=I,h!==null){let C=h.views;g!==null&&(t.setRenderTargetFramebuffer(u,g.framebuffer),t.setRenderTarget(u));let b=!1;C.length!==S.cameras.length&&(S.cameras.length=0,b=!0);for(let M=0;M<C.length;M++){let j=C[M],lt=null;if(g!==null)lt=g.getViewport(j);else{let dt=d.getViewSubImage(f,j);lt=dt.viewport,M===0&&(t.setRenderTargetTextures(u,dt.colorTexture,f.ignoreDepthValues?void 0:dt.depthStencilTexture),t.setRenderTarget(u))}let H=K[M];H===void 0&&(H=new Ve,H.layers.enable(M),H.viewport=new Ue,K[M]=H),H.matrix.fromArray(j.transform.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale),H.projectionMatrix.fromArray(j.projectionMatrix),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),H.viewport.set(lt.x,lt.y,lt.width,lt.height),M===0&&(S.matrix.copy(H.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),b===!0&&S.cameras.push(H)}}for(let C=0;C<L.length;C++){let b=_[C],M=L[C];b!==null&&M!==void 0&&M.update(b,I,l||o)}ct&&ct(st,I),I.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:I}),x=null}let Mt=new Ll;Mt.setAnimationLoop(ft),this.setAnimationLoop=function(st){ct=st},this.dispose=function(){}}};function Bm(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Tl(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,L,_,E){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&g(p,u,E)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),v(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?c(p,u,L,_):u.isSpriteMaterial?l(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===$e&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===$e&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let L=t.get(u).envMap;if(L&&(p.envMap.value=L,p.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function c(p,u,L,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*L,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function l(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function g(p,u,L){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===$e&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=L.texture,p.transmissionSamplerSize.value.set(L.width,L.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function v(p,u){let L=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(L.matrixWorld),p.nearDistance.value=L.shadow.camera.near,p.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function zm(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(L,_){let E=_.program;n.uniformBlockBinding(L,E)}function l(L,_){let E=s[L.id];E===void 0&&(x(L),E=h(L),s[L.id]=E,L.addEventListener("dispose",p));let N=_.program;n.updateUBOMapping(L,N);let P=t.render.frame;r[L.id]!==P&&(f(L),r[L.id]=P)}function h(L){let _=d();L.__bindingPointIndex=_;let E=i.createBuffer(),N=L.__size,P=L.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,N,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,E),E}function d(){for(let L=0;L<a;L++)if(o.indexOf(L)===-1)return o.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(L){let _=s[L.id],E=L.uniforms,N=L.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let P=0,R=E.length;P<R;P++){let K=Array.isArray(E[P])?E[P]:[E[P]];for(let S=0,T=K.length;S<T;S++){let Z=K[S];if(g(Z,P,S,N)===!0){let et=Z.__offset,xt=Array.isArray(Z.value)?Z.value:[Z.value],O=0;for(let Y=0;Y<xt.length;Y++){let nt=xt[Y],$=v(nt);typeof nt=="number"||typeof nt=="boolean"?(Z.__data[0]=nt,i.bufferSubData(i.UNIFORM_BUFFER,et+O,Z.__data)):nt.isMatrix3?(Z.__data[0]=nt.elements[0],Z.__data[1]=nt.elements[1],Z.__data[2]=nt.elements[2],Z.__data[3]=0,Z.__data[4]=nt.elements[3],Z.__data[5]=nt.elements[4],Z.__data[6]=nt.elements[5],Z.__data[7]=0,Z.__data[8]=nt.elements[6],Z.__data[9]=nt.elements[7],Z.__data[10]=nt.elements[8],Z.__data[11]=0):(nt.toArray(Z.__data,O),O+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,et,Z.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(L,_,E,N){let P=L.value,R=_+"_"+E;if(N[R]===void 0)return typeof P=="number"||typeof P=="boolean"?N[R]=P:N[R]=P.clone(),!0;{let K=N[R];if(typeof P=="number"||typeof P=="boolean"){if(K!==P)return N[R]=P,!0}else if(K.equals(P)===!1)return K.copy(P),!0}return!1}function x(L){let _=L.uniforms,E=0,N=16;for(let R=0,K=_.length;R<K;R++){let S=Array.isArray(_[R])?_[R]:[_[R]];for(let T=0,Z=S.length;T<Z;T++){let et=S[T],xt=Array.isArray(et.value)?et.value:[et.value];for(let O=0,Y=xt.length;O<Y;O++){let nt=xt[O],$=v(nt),F=E%N;F!==0&&N-F<$.boundary&&(E+=N-F),et.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),et.__offset=E,E+=$.storage}}}let P=E%N;return P>0&&(E+=N-P),L.__size=E,L.__cache={},this}function v(L){let _={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(_.boundary=4,_.storage=4):L.isVector2?(_.boundary=8,_.storage=8):L.isVector3||L.isColor?(_.boundary=16,_.storage=12):L.isVector4?(_.boundary=16,_.storage=16):L.isMatrix3?(_.boundary=48,_.storage=48):L.isMatrix4?(_.boundary=64,_.storage=64):L.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",L),_}function p(L){let _=L.target;_.removeEventListener("dispose",p);let E=o.indexOf(_.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let L in s)i.deleteBuffer(s[L]);o=[],s={},r={}}return{bind:c,update:l,dispose:u}}var gs=class{constructor(t={}){let{canvas:e=Yh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let g=new Uint32Array(4),x=new Int32Array(4),v=null,p=null,u=[],L=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Te,this._useLegacyLights=!1,this.toneMapping=Xn,this.toneMappingExposure=1;let _=this,E=!1,N=0,P=0,R=null,K=-1,S=null,T=new Ue,Z=new Ue,et=null,xt=new $t(0),O=0,Y=e.width,nt=e.height,$=1,F=null,it=null,ct=new Ue(0,0,Y,nt),ft=new Ue(0,0,Y,nt),Mt=!1,st=new ms,I=!1,C=!1,b=null,M=new be,j=new _t,lt=new V,H={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function dt(){return R===null?$:1}let A=n;function Q(w,q){for(let tt=0;tt<w.length;tt++){let at=w[tt],rt=e.getContext(at,q);if(rt!==null)return rt}return null}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",Et,!1),e.addEventListener("webglcontextrestored",B,!1),e.addEventListener("webglcontextcreationerror",At,!1),A===null){let q=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&q.shift(),A=Q(q,w),A===null)throw Q(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&A instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),A.getShaderPrecisionFormat===void 0&&(A.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let U,X,W,pt,D,m,y,z,mt,gt,ut,Ut,St,It,Bt,Ht,yt,Kt,Yt,Vt,zt,Lt,Nt,re;function ae(){U=new sp(A),X=new jf(A,U,t),U.init(X),Lt=new Om(A,U,X),W=new Dm(A,U,X),pt=new op(A),D=new Sm,m=new Nm(A,U,W,D,X,Lt,pt),y=new tp(_),z=new ip(_),mt=new pu(A,X),Nt=new $f(A,U,mt,X),gt=new rp(A,mt,pt,Nt),ut=new up(A,gt,mt,pt),Yt=new hp(A,X,m),Ht=new Qf(D),Ut=new Mm(_,y,z,U,X,Nt,Ht),St=new Bm(_,D),It=new Em,Bt=new Cm(U,X),Kt=new Jf(_,y,z,W,ut,f,c),yt=new Um(_,ut,X),re=new zm(A,pt,X,W),Vt=new Kf(A,U,pt,X),zt=new ap(A,U,pt,X),pt.programs=Ut.programs,_.capabilities=X,_.extensions=U,_.properties=D,_.renderLists=It,_.shadowMap=yt,_.state=W,_.info=pt}ae();let ne=new $a(_,A);this.xr=ne,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){let w=U.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=U.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(w){w!==void 0&&($=w,this.setSize(Y,nt,!1))},this.getSize=function(w){return w.set(Y,nt)},this.setSize=function(w,q,tt=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=w,nt=q,e.width=Math.floor(w*$),e.height=Math.floor(q*$),tt===!0&&(e.style.width=w+"px",e.style.height=q+"px"),this.setViewport(0,0,w,q)},this.getDrawingBufferSize=function(w){return w.set(Y*$,nt*$).floor()},this.setDrawingBufferSize=function(w,q,tt){Y=w,nt=q,$=tt,e.width=Math.floor(w*tt),e.height=Math.floor(q*tt),this.setViewport(0,0,w,q)},this.getCurrentViewport=function(w){return w.copy(T)},this.getViewport=function(w){return w.copy(ct)},this.setViewport=function(w,q,tt,at){w.isVector4?ct.set(w.x,w.y,w.z,w.w):ct.set(w,q,tt,at),W.viewport(T.copy(ct).multiplyScalar($).floor())},this.getScissor=function(w){return w.copy(ft)},this.setScissor=function(w,q,tt,at){w.isVector4?ft.set(w.x,w.y,w.z,w.w):ft.set(w,q,tt,at),W.scissor(Z.copy(ft).multiplyScalar($).floor())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(w){W.setScissorTest(Mt=w)},this.setOpaqueSort=function(w){F=w},this.setTransparentSort=function(w){it=w},this.getClearColor=function(w){return w.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor.apply(Kt,arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha.apply(Kt,arguments)},this.clear=function(w=!0,q=!0,tt=!0){let at=0;if(w){let rt=!1;if(R!==null){let Dt=R.texture.format;rt=Dt===yl||Dt===xl||Dt===_l}if(rt){let Dt=R.texture.type,Ft=Dt===qn||Dt===Vn||Dt===Eo||Dt===ri||Dt===ml||Dt===gl,Gt=Kt.getClearColor(),qt=Kt.getClearAlpha(),Qt=Gt.r,Zt=Gt.g,jt=Gt.b;Ft?(g[0]=Qt,g[1]=Zt,g[2]=jt,g[3]=qt,A.clearBufferuiv(A.COLOR,0,g)):(x[0]=Qt,x[1]=Zt,x[2]=jt,x[3]=qt,A.clearBufferiv(A.COLOR,0,x))}else at|=A.COLOR_BUFFER_BIT}q&&(at|=A.DEPTH_BUFFER_BIT),tt&&(at|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Et,!1),e.removeEventListener("webglcontextrestored",B,!1),e.removeEventListener("webglcontextcreationerror",At,!1),It.dispose(),Bt.dispose(),D.dispose(),y.dispose(),z.dispose(),ut.dispose(),Nt.dispose(),re.dispose(),Ut.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",De),ne.removeEventListener("sessionend",le),b&&(b.dispose(),b=null),Ne.stop()};function Et(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function B(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let w=pt.autoReset,q=yt.enabled,tt=yt.autoUpdate,at=yt.needsUpdate,rt=yt.type;ae(),pt.autoReset=w,yt.enabled=q,yt.autoUpdate=tt,yt.needsUpdate=at,yt.type=rt}function At(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Rt(w){let q=w.target;q.removeEventListener("dispose",Rt),Wt(q)}function Wt(w){kt(w),D.remove(w)}function kt(w){let q=D.get(w).programs;q!==void 0&&(q.forEach(function(tt){Ut.releaseProgram(tt)}),w.isShaderMaterial&&Ut.releaseShaderCache(w))}this.renderBufferDirect=function(w,q,tt,at,rt,Dt){q===null&&(q=H);let Ft=rt.isMesh&&rt.matrixWorld.determinant()<0,Gt=Yr(w,q,tt,at,rt);W.setMaterial(at,Ft);let qt=tt.index,Qt=1;if(at.wireframe===!0){if(qt=gt.getWireframeAttribute(tt),qt===void 0)return;Qt=2}let Zt=tt.drawRange,jt=tt.attributes.position,de=Zt.start*Qt,Ee=(Zt.start+Zt.count)*Qt;Dt!==null&&(de=Math.max(de,Dt.start*Qt),Ee=Math.min(Ee,(Dt.start+Dt.count)*Qt)),qt!==null?(de=Math.max(de,0),Ee=Math.min(Ee,qt.count)):jt!=null&&(de=Math.max(de,0),Ee=Math.min(Ee,jt.count));let _e=Ee-de;if(_e<0||_e===1/0)return;Nt.setup(rt,at,Gt,tt,qt);let Ke,ue=Vt;if(qt!==null&&(Ke=mt.get(qt),ue=zt,ue.setIndex(Ke)),rt.isMesh)at.wireframe===!0?(W.setLineWidth(at.wireframeLinewidth*dt()),ue.setMode(A.LINES)):ue.setMode(A.TRIANGLES);else if(rt.isLine){let te=at.linewidth;te===void 0&&(te=1),W.setLineWidth(te*dt()),rt.isLineSegments?ue.setMode(A.LINES):rt.isLineLoop?ue.setMode(A.LINE_LOOP):ue.setMode(A.LINE_STRIP)}else rt.isPoints?ue.setMode(A.POINTS):rt.isSprite&&ue.setMode(A.TRIANGLES);if(rt.isBatchedMesh)ue.renderMultiDraw(rt._multiDrawStarts,rt._multiDrawCounts,rt._multiDrawCount);else if(rt.isInstancedMesh)ue.renderInstances(de,_e,rt.count);else if(tt.isInstancedBufferGeometry){let te=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,ji=Math.min(tt.instanceCount,te);ue.renderInstances(de,_e,ji)}else ue.render(de,_e)};function oe(w,q,tt){w.transparent===!0&&w.side===an&&w.forceSinglePass===!1?(w.side=$e,w.needsUpdate=!0,$n(w,q,tt),w.side=Sn,w.needsUpdate=!0,$n(w,q,tt),w.side=an):$n(w,q,tt)}this.compile=function(w,q,tt=null){tt===null&&(tt=w),p=Bt.get(tt),p.init(),L.push(p),tt.traverseVisible(function(rt){rt.isLight&&rt.layers.test(q.layers)&&(p.pushLight(rt),rt.castShadow&&p.pushShadow(rt))}),w!==tt&&w.traverseVisible(function(rt){rt.isLight&&rt.layers.test(q.layers)&&(p.pushLight(rt),rt.castShadow&&p.pushShadow(rt))}),p.setupLights(_._useLegacyLights);let at=new Set;return w.traverse(function(rt){let Dt=rt.material;if(Dt)if(Array.isArray(Dt))for(let Ft=0;Ft<Dt.length;Ft++){let Gt=Dt[Ft];oe(Gt,tt,rt),at.add(Gt)}else oe(Dt,tt,rt),at.add(Dt)}),L.pop(),p=null,at},this.compileAsync=function(w,q,tt=null){let at=this.compile(w,q,tt);return new Promise(rt=>{function Dt(){if(at.forEach(function(Ft){D.get(Ft).currentProgram.isReady()&&at.delete(Ft)}),at.size===0){rt(w);return}setTimeout(Dt,10)}U.get("KHR_parallel_shader_compile")!==null?Dt():setTimeout(Dt,10)})};let ce=null;function ge(w){ce&&ce(w)}function De(){Ne.stop()}function le(){Ne.start()}let Ne=new Ll;Ne.setAnimationLoop(ge),typeof self<"u"&&Ne.setContext(self),this.setAnimationLoop=function(w){ce=w,ne.setAnimationLoop(w),w===null?Ne.stop():Ne.start()},ne.addEventListener("sessionstart",De),ne.addEventListener("sessionend",le),this.render=function(w,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(q),q=ne.getCamera()),w.isScene===!0&&w.onBeforeRender(_,w,q,R),p=Bt.get(w,L.length),p.init(),L.push(p),M.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),st.setFromProjectionMatrix(M),C=this.localClippingEnabled,I=Ht.init(this.clippingPlanes,C),v=It.get(w,u.length),v.init(),u.push(v),nn(w,q,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(F,it),this.info.render.frame++,I===!0&&Ht.beginShadows();let tt=p.state.shadowsArray;if(yt.render(tt,w,q),I===!0&&Ht.endShadows(),this.info.autoReset===!0&&this.info.reset(),Kt.render(v,w),p.setupLights(_._useLegacyLights),q.isArrayCamera){let at=q.cameras;for(let rt=0,Dt=at.length;rt<Dt;rt++){let Ft=at[rt];Ki(v,w,Ft,Ft.viewport)}}else Ki(v,w,q);R!==null&&(m.updateMultisampleRenderTarget(R),m.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(_,w,q),Nt.resetDefaultState(),K=-1,S=null,L.pop(),L.length>0?p=L[L.length-1]:p=null,u.pop(),u.length>0?v=u[u.length-1]:v=null};function nn(w,q,tt,at){if(w.visible===!1)return;if(w.layers.test(q.layers)){if(w.isGroup)tt=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(q);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||st.intersectsSprite(w)){at&&lt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(M);let Ft=ut.update(w),Gt=w.material;Gt.visible&&v.push(w,Ft,Gt,tt,lt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||st.intersectsObject(w))){let Ft=ut.update(w),Gt=w.material;if(at&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),lt.copy(w.boundingSphere.center)):(Ft.boundingSphere===null&&Ft.computeBoundingSphere(),lt.copy(Ft.boundingSphere.center)),lt.applyMatrix4(w.matrixWorld).applyMatrix4(M)),Array.isArray(Gt)){let qt=Ft.groups;for(let Qt=0,Zt=qt.length;Qt<Zt;Qt++){let jt=qt[Qt],de=Gt[jt.materialIndex];de&&de.visible&&v.push(w,Ft,de,tt,lt.z,jt)}}else Gt.visible&&v.push(w,Ft,Gt,tt,lt.z,null)}}let Dt=w.children;for(let Ft=0,Gt=Dt.length;Ft<Gt;Ft++)nn(Dt[Ft],q,tt,at)}function Ki(w,q,tt,at){let rt=w.opaque,Dt=w.transmissive,Ft=w.transparent;p.setupLightsView(tt),I===!0&&Ht.setGlobalState(_.clippingPlanes,tt),Dt.length>0&&Ts(rt,Dt,q,tt),at&&W.viewport(T.copy(at)),rt.length>0&&pi(rt,q,tt),Dt.length>0&&pi(Dt,q,tt),Ft.length>0&&pi(Ft,q,tt),W.buffers.depth.setTest(!0),W.buffers.depth.setMask(!0),W.buffers.color.setMask(!0),W.setPolygonOffset(!1)}function Ts(w,q,tt,at){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;let Dt=X.isWebGL2;b===null&&(b=new On(1,1,{generateMipmaps:!0,type:U.has("EXT_color_buffer_half_float")?fs:qn,minFilter:ds,samples:Dt?4:0})),_.getDrawingBufferSize(j),Dt?b.setSize(j.x,j.y):b.setSize(mr(j.x),mr(j.y));let Ft=_.getRenderTarget();_.setRenderTarget(b),_.getClearColor(xt),O=_.getClearAlpha(),O<1&&_.setClearColor(16777215,.5),_.clear();let Gt=_.toneMapping;_.toneMapping=Xn,pi(w,tt,at),m.updateMultisampleRenderTarget(b),m.updateRenderTargetMipmap(b);let qt=!1;for(let Qt=0,Zt=q.length;Qt<Zt;Qt++){let jt=q[Qt],de=jt.object,Ee=jt.geometry,_e=jt.material,Ke=jt.group;if(_e.side===an&&de.layers.test(at.layers)){let ue=_e.side;_e.side=$e,_e.needsUpdate=!0,Ls(de,tt,at,Ee,_e,Ke),_e.side=ue,_e.needsUpdate=!0,qt=!0}}qt===!0&&(m.updateMultisampleRenderTarget(b),m.updateRenderTargetMipmap(b)),_.setRenderTarget(Ft),_.setClearColor(xt,O),_.toneMapping=Gt}function pi(w,q,tt){let at=q.isScene===!0?q.overrideMaterial:null;for(let rt=0,Dt=w.length;rt<Dt;rt++){let Ft=w[rt],Gt=Ft.object,qt=Ft.geometry,Qt=at===null?Ft.material:at,Zt=Ft.group;Gt.layers.test(tt.layers)&&Ls(Gt,q,tt,qt,Qt,Zt)}}function Ls(w,q,tt,at,rt,Dt){w.onBeforeRender(_,q,tt,at,rt,Dt),w.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),rt.onBeforeRender(_,q,tt,at,w,Dt),rt.transparent===!0&&rt.side===an&&rt.forceSinglePass===!1?(rt.side=$e,rt.needsUpdate=!0,_.renderBufferDirect(tt,q,at,rt,w,Dt),rt.side=Sn,rt.needsUpdate=!0,_.renderBufferDirect(tt,q,at,rt,w,Dt),rt.side=an):_.renderBufferDirect(tt,q,at,rt,w,Dt),w.onAfterRender(_,q,tt,at,rt,Dt)}function $n(w,q,tt){q.isScene!==!0&&(q=H);let at=D.get(w),rt=p.state.lights,Dt=p.state.shadowsArray,Ft=rt.state.version,Gt=Ut.getParameters(w,rt.state,Dt,q,tt),qt=Ut.getProgramCacheKey(Gt),Qt=at.programs;at.environment=w.isMeshStandardMaterial?q.environment:null,at.fog=q.fog,at.envMap=(w.isMeshStandardMaterial?z:y).get(w.envMap||at.environment),Qt===void 0&&(w.addEventListener("dispose",Rt),Qt=new Map,at.programs=Qt);let Zt=Qt.get(qt);if(Zt!==void 0){if(at.currentProgram===Zt&&at.lightsStateVersion===Ft)return Rs(w,Gt),Zt}else Gt.uniforms=Ut.getUniforms(w),w.onBuild(tt,Gt,_),w.onBeforeCompile(Gt,_),Zt=Ut.acquireProgram(Gt,qt),Qt.set(qt,Zt),at.uniforms=Gt.uniforms;let jt=at.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(jt.clippingPlanes=Ht.uniform),Rs(w,Gt),at.needsLights=Zr(w),at.lightsStateVersion=Ft,at.needsLights&&(jt.ambientLightColor.value=rt.state.ambient,jt.lightProbe.value=rt.state.probe,jt.directionalLights.value=rt.state.directional,jt.directionalLightShadows.value=rt.state.directionalShadow,jt.spotLights.value=rt.state.spot,jt.spotLightShadows.value=rt.state.spotShadow,jt.rectAreaLights.value=rt.state.rectArea,jt.ltc_1.value=rt.state.rectAreaLTC1,jt.ltc_2.value=rt.state.rectAreaLTC2,jt.pointLights.value=rt.state.point,jt.pointLightShadows.value=rt.state.pointShadow,jt.hemisphereLights.value=rt.state.hemi,jt.directionalShadowMap.value=rt.state.directionalShadowMap,jt.directionalShadowMatrix.value=rt.state.directionalShadowMatrix,jt.spotShadowMap.value=rt.state.spotShadowMap,jt.spotLightMatrix.value=rt.state.spotLightMatrix,jt.spotLightMap.value=rt.state.spotLightMap,jt.pointShadowMap.value=rt.state.pointShadowMap,jt.pointShadowMatrix.value=rt.state.pointShadowMatrix),at.currentProgram=Zt,at.uniformsList=null,Zt}function As(w){if(w.uniformsList===null){let q=w.currentProgram.getUniforms();w.uniformsList=Bi.seqWithValue(q.seq,w.uniforms)}return w.uniformsList}function Rs(w,q){let tt=D.get(w);tt.outputColorSpace=q.outputColorSpace,tt.batching=q.batching,tt.instancing=q.instancing,tt.instancingColor=q.instancingColor,tt.skinning=q.skinning,tt.morphTargets=q.morphTargets,tt.morphNormals=q.morphNormals,tt.morphColors=q.morphColors,tt.morphTargetsCount=q.morphTargetsCount,tt.numClippingPlanes=q.numClippingPlanes,tt.numIntersection=q.numClipIntersection,tt.vertexAlphas=q.vertexAlphas,tt.vertexTangents=q.vertexTangents,tt.toneMapping=q.toneMapping}function Yr(w,q,tt,at,rt){q.isScene!==!0&&(q=H),m.resetTextureUnits();let Dt=q.fog,Ft=at.isMeshStandardMaterial?q.environment:null,Gt=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Nn,qt=(at.isMeshStandardMaterial?z:y).get(at.envMap||Ft),Qt=at.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Zt=!!tt.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),jt=!!tt.morphAttributes.position,de=!!tt.morphAttributes.normal,Ee=!!tt.morphAttributes.color,_e=Xn;at.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(_e=_.toneMapping);let Ke=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,ue=Ke!==void 0?Ke.length:0,te=D.get(at),ji=p.state.lights;if(I===!0&&(C===!0||w!==S)){let Ze=w===S&&at.id===K;Ht.setState(at,w,Ze)}let fe=!1;at.version===te.__version?(te.needsLights&&te.lightsStateVersion!==ji.state.version||te.outputColorSpace!==Gt||rt.isBatchedMesh&&te.batching===!1||!rt.isBatchedMesh&&te.batching===!0||rt.isInstancedMesh&&te.instancing===!1||!rt.isInstancedMesh&&te.instancing===!0||rt.isSkinnedMesh&&te.skinning===!1||!rt.isSkinnedMesh&&te.skinning===!0||rt.isInstancedMesh&&te.instancingColor===!0&&rt.instanceColor===null||rt.isInstancedMesh&&te.instancingColor===!1&&rt.instanceColor!==null||te.envMap!==qt||at.fog===!0&&te.fog!==Dt||te.numClippingPlanes!==void 0&&(te.numClippingPlanes!==Ht.numPlanes||te.numIntersection!==Ht.numIntersection)||te.vertexAlphas!==Qt||te.vertexTangents!==Zt||te.morphTargets!==jt||te.morphNormals!==de||te.morphColors!==Ee||te.toneMapping!==_e||X.isWebGL2===!0&&te.morphTargetsCount!==ue)&&(fe=!0):(fe=!0,te.__version=at.version);let En=te.currentProgram;fe===!0&&(En=$n(at,q,rt));let Ps=!1,Kn=!1,Qi=!1,we=En.getUniforms(),vn=te.uniforms;if(W.useProgram(En.program)&&(Ps=!0,Kn=!0,Qi=!0),at.id!==K&&(K=at.id,Kn=!0),Ps||S!==w){we.setValue(A,"projectionMatrix",w.projectionMatrix),we.setValue(A,"viewMatrix",w.matrixWorldInverse);let Ze=we.map.cameraPosition;Ze!==void 0&&Ze.setValue(A,lt.setFromMatrixPosition(w.matrixWorld)),X.logarithmicDepthBuffer&&we.setValue(A,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&we.setValue(A,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,Kn=!0,Qi=!0)}if(rt.isSkinnedMesh){we.setOptional(A,rt,"bindMatrix"),we.setOptional(A,rt,"bindMatrixInverse");let Ze=rt.skeleton;Ze&&(X.floatVertexTextures?(Ze.boneTexture===null&&Ze.computeBoneTexture(),we.setValue(A,"boneTexture",Ze.boneTexture,m)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}rt.isBatchedMesh&&(we.setOptional(A,rt,"batchingTexture"),we.setValue(A,"batchingTexture",rt._matricesTexture,m));let ts=tt.morphAttributes;if((ts.position!==void 0||ts.normal!==void 0||ts.color!==void 0&&X.isWebGL2===!0)&&Yt.update(rt,tt,En),(Kn||te.receiveShadow!==rt.receiveShadow)&&(te.receiveShadow=rt.receiveShadow,we.setValue(A,"receiveShadow",rt.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(vn.envMap.value=qt,vn.flipEnvMap.value=qt.isCubeTexture&&qt.isRenderTargetTexture===!1?-1:1),Kn&&(we.setValue(A,"toneMappingExposure",_.toneMappingExposure),te.needsLights&&Cs(vn,Qi),Dt&&at.fog===!0&&St.refreshFogUniforms(vn,Dt),St.refreshMaterialUniforms(vn,at,$,nt,b),Bi.upload(A,As(te),vn,m)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(Bi.upload(A,As(te),vn,m),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&we.setValue(A,"center",rt.center),we.setValue(A,"modelViewMatrix",rt.modelViewMatrix),we.setValue(A,"normalMatrix",rt.normalMatrix),we.setValue(A,"modelMatrix",rt.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){let Ze=at.uniformsGroups;for(let es=0,Jr=Ze.length;es<Jr;es++)if(X.isWebGL2){let Is=Ze[es];re.update(Is,En),re.bind(Is,En)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return En}function Cs(w,q){w.ambientLightColor.needsUpdate=q,w.lightProbe.needsUpdate=q,w.directionalLights.needsUpdate=q,w.directionalLightShadows.needsUpdate=q,w.pointLights.needsUpdate=q,w.pointLightShadows.needsUpdate=q,w.spotLights.needsUpdate=q,w.spotLightShadows.needsUpdate=q,w.rectAreaLights.needsUpdate=q,w.hemisphereLights.needsUpdate=q}function Zr(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,q,tt){D.get(w.texture).__webglTexture=q,D.get(w.depthTexture).__webglTexture=tt;let at=D.get(w);at.__hasExternalTextures=!0,at.__hasExternalTextures&&(at.__autoAllocateDepthBuffer=tt===void 0,at.__autoAllocateDepthBuffer||U.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),at.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,q){let tt=D.get(w);tt.__webglFramebuffer=q,tt.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(w,q=0,tt=0){R=w,N=q,P=tt;let at=!0,rt=null,Dt=!1,Ft=!1;if(w){let qt=D.get(w);qt.__useDefaultFramebuffer!==void 0?(W.bindFramebuffer(A.FRAMEBUFFER,null),at=!1):qt.__webglFramebuffer===void 0?m.setupRenderTarget(w):qt.__hasExternalTextures&&m.rebindTextures(w,D.get(w.texture).__webglTexture,D.get(w.depthTexture).__webglTexture);let Qt=w.texture;(Qt.isData3DTexture||Qt.isDataArrayTexture||Qt.isCompressedArrayTexture)&&(Ft=!0);let Zt=D.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Zt[q])?rt=Zt[q][tt]:rt=Zt[q],Dt=!0):X.isWebGL2&&w.samples>0&&m.useMultisampledRTT(w)===!1?rt=D.get(w).__webglMultisampledFramebuffer:Array.isArray(Zt)?rt=Zt[tt]:rt=Zt,T.copy(w.viewport),Z.copy(w.scissor),et=w.scissorTest}else T.copy(ct).multiplyScalar($).floor(),Z.copy(ft).multiplyScalar($).floor(),et=Mt;if(W.bindFramebuffer(A.FRAMEBUFFER,rt)&&X.drawBuffers&&at&&W.drawBuffers(w,rt),W.viewport(T),W.scissor(Z),W.setScissorTest(et),Dt){let qt=D.get(w.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+q,qt.__webglTexture,tt)}else if(Ft){let qt=D.get(w.texture),Qt=q||0;A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,qt.__webglTexture,tt||0,Qt)}K=-1},this.readRenderTargetPixels=function(w,q,tt,at,rt,Dt,Ft){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Gt=D.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ft!==void 0&&(Gt=Gt[Ft]),Gt){W.bindFramebuffer(A.FRAMEBUFFER,Gt);try{let qt=w.texture,Qt=qt.format,Zt=qt.type;if(Qt!==gn&&Lt.convert(Qt)!==A.getParameter(A.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let jt=Zt===fs&&(U.has("EXT_color_buffer_half_float")||X.isWebGL2&&U.has("EXT_color_buffer_float"));if(Zt!==qn&&Lt.convert(Zt)!==A.getParameter(A.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Zt===Gn&&(X.isWebGL2||U.has("OES_texture_float")||U.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=w.width-at&&tt>=0&&tt<=w.height-rt&&A.readPixels(q,tt,at,rt,Lt.convert(Qt),Lt.convert(Zt),Dt)}finally{let qt=R!==null?D.get(R).__webglFramebuffer:null;W.bindFramebuffer(A.FRAMEBUFFER,qt)}}},this.copyFramebufferToTexture=function(w,q,tt=0){let at=Math.pow(2,-tt),rt=Math.floor(q.image.width*at),Dt=Math.floor(q.image.height*at);m.setTexture2D(q,0),A.copyTexSubImage2D(A.TEXTURE_2D,tt,0,0,w.x,w.y,rt,Dt),W.unbindTexture()},this.copyTextureToTexture=function(w,q,tt,at=0){let rt=q.image.width,Dt=q.image.height,Ft=Lt.convert(tt.format),Gt=Lt.convert(tt.type);m.setTexture2D(tt,0),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,tt.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,tt.unpackAlignment),q.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,at,w.x,w.y,rt,Dt,Ft,Gt,q.image.data):q.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,at,w.x,w.y,q.mipmaps[0].width,q.mipmaps[0].height,Ft,q.mipmaps[0].data):A.texSubImage2D(A.TEXTURE_2D,at,w.x,w.y,Ft,Gt,q.image),at===0&&tt.generateMipmaps&&A.generateMipmap(A.TEXTURE_2D),W.unbindTexture()},this.copyTextureToTexture3D=function(w,q,tt,at,rt=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Dt=w.max.x-w.min.x+1,Ft=w.max.y-w.min.y+1,Gt=w.max.z-w.min.z+1,qt=Lt.convert(at.format),Qt=Lt.convert(at.type),Zt;if(at.isData3DTexture)m.setTexture3D(at,0),Zt=A.TEXTURE_3D;else if(at.isDataArrayTexture||at.isCompressedArrayTexture)m.setTexture2DArray(at,0),Zt=A.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,at.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,at.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,at.unpackAlignment);let jt=A.getParameter(A.UNPACK_ROW_LENGTH),de=A.getParameter(A.UNPACK_IMAGE_HEIGHT),Ee=A.getParameter(A.UNPACK_SKIP_PIXELS),_e=A.getParameter(A.UNPACK_SKIP_ROWS),Ke=A.getParameter(A.UNPACK_SKIP_IMAGES),ue=tt.isCompressedTexture?tt.mipmaps[rt]:tt.image;A.pixelStorei(A.UNPACK_ROW_LENGTH,ue.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ue.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,w.min.x),A.pixelStorei(A.UNPACK_SKIP_ROWS,w.min.y),A.pixelStorei(A.UNPACK_SKIP_IMAGES,w.min.z),tt.isDataTexture||tt.isData3DTexture?A.texSubImage3D(Zt,rt,q.x,q.y,q.z,Dt,Ft,Gt,qt,Qt,ue.data):tt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),A.compressedTexSubImage3D(Zt,rt,q.x,q.y,q.z,Dt,Ft,Gt,qt,ue.data)):A.texSubImage3D(Zt,rt,q.x,q.y,q.z,Dt,Ft,Gt,qt,Qt,ue),A.pixelStorei(A.UNPACK_ROW_LENGTH,jt),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,de),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ee),A.pixelStorei(A.UNPACK_SKIP_ROWS,_e),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Ke),rt===0&&at.generateMipmaps&&A.generateMipmap(Zt),W.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?m.setTextureCube(w,0):w.isData3DTexture?m.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?m.setTexture2DArray(w,0):m.setTexture2D(w,0),W.unbindTexture()},this.resetState=function(){N=0,P=0,R=null,W.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===wo?"display-p3":"srgb",e.unpackColorSpace=he.workingColorSpace===Gr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Te?oi:Ml}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===oi?Te:Nn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Ka=class extends gs{};Ka.prototype.isWebGL1Renderer=!0;var Rr=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new $t(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var _s=class extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var xs=class extends Jn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},tl=new be,ja=new vr,er=new Gi,nr=new V,Cr=class extends ze{constructor(t=new en,e=new xs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(s),er.radius+=r,t.ray.intersectsSphere(er)===!1)return;tl.copy(s).invert(),ja.copy(t.ray).applyMatrix4(tl);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let x=f,v=g;x<v;x++){let p=l.getX(x);nr.fromBufferAttribute(d,p),el(nr,p,c,s,t,e,this)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=f,v=g;x<v;x++)nr.fromBufferAttribute(d,x),el(nr,x,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function el(i,t,e,n,s,r,o){let a=ja.distanceSqToPoint(i);if(a<e){let c=new V;ja.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var Pr=class extends cn{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},ln=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,g=(o-h)/f;return(s+g)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new _t:new V);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new V,s=[],r=[],o=[],a=new V,c=new be;for(let g=0;g<=t;g++){let x=g/t;s[g]=this.getTangentAt(x,new V)}r[0]=new V,o[0]=new V;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let g=1;g<=t;g++){if(r[g]=r[g-1].clone(),o[g]=o[g-1].clone(),a.crossVectors(s[g-1],s[g]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(Ie(s[g-1].dot(s[g]),-1,1));r[g].applyMatrix4(c.makeRotationAxis(a,x))}o[g].crossVectors(s[g],r[g])}if(e===!0){let g=Math.acos(Ie(r[0].dot(r[t]),-1,1));g/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(g=-g);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],g*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},ys=class extends ln{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){let n=e||new _t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,g=l-this.aY;c=f*h-g*d+this.aX,l=f*d+g*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Qa=class extends ys{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ao(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,g=(a-o)/h-(c-o)/(h+d)+(c-a)/d;f*=h,g*=h,s(o,a,f,g)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var ir=new V,wa=new Ao,Ta=new Ao,La=new Ao,to=class extends ln{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new V){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(ir.subVectors(s[0],s[1]).add(s[0]),l=ir);let d=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ir.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ir),this.curveType==="centripetal"||this.curveType==="chordal"){let g=this.curveType==="chordal"?.5:.25,x=Math.pow(l.distanceToSquared(d),g),v=Math.pow(d.distanceToSquared(f),g),p=Math.pow(f.distanceToSquared(h),g);v<1e-4&&(v=1),x<1e-4&&(x=v),p<1e-4&&(p=v),wa.initNonuniformCatmullRom(l.x,d.x,f.x,h.x,x,v,p),Ta.initNonuniformCatmullRom(l.y,d.y,f.y,h.y,x,v,p),La.initNonuniformCatmullRom(l.z,d.z,f.z,h.z,x,v,p)}else this.curveType==="catmullrom"&&(wa.initCatmullRom(l.x,d.x,f.x,h.x,this.tension),Ta.initCatmullRom(l.y,d.y,f.y,h.y,this.tension),La.initCatmullRom(l.z,d.z,f.z,h.z,this.tension));return n.set(wa.calc(c),Ta.calc(c),La.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new V().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function nl(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function km(i,t){let e=1-i;return e*e*t}function Hm(i,t){return 2*(1-i)*i*t}function Vm(i,t){return i*i*t}function hs(i,t,e,n){return km(i,t)+Hm(i,e)+Vm(i,n)}function Gm(i,t){let e=1-i;return e*e*e*t}function Wm(i,t){let e=1-i;return 3*e*e*i*t}function Xm(i,t){return 3*(1-i)*i*i*t}function qm(i,t){return i*i*i*t}function us(i,t,e,n,s){return Gm(i,t)+Wm(i,e)+Xm(i,n)+qm(i,s)}var Ir=class extends ln{constructor(t=new _t,e=new _t,n=new _t,s=new _t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new _t){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(us(t,s.x,r.x,o.x,a.x),us(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},eo=class extends ln{constructor(t=new V,e=new V,n=new V,s=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new V){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(us(t,s.x,r.x,o.x,a.x),us(t,s.y,r.y,o.y,a.y),us(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ur=class extends ln{constructor(t=new _t,e=new _t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new _t){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new _t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},no=class extends ln{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Dr=class extends ln{constructor(t=new _t,e=new _t,n=new _t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new _t){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(t,s.x,r.x,o.x),hs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},io=class extends ln{constructor(t=new V,e=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new V){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(t,s.x,r.x,o.x),hs(t,s.y,r.y,o.y),hs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Nr=class extends ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new _t){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(nl(a,c.x,l.x,h.x,d.x),nl(a,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new _t().fromArray(s))}return this}},so=Object.freeze({__proto__:null,ArcCurve:Qa,CatmullRomCurve3:to,CubicBezierCurve:Ir,CubicBezierCurve3:eo,EllipseCurve:ys,LineCurve:Ur,LineCurve3:no,QuadraticBezierCurve:Dr,QuadraticBezierCurve3:io,SplineCurve:Nr}),ro=class extends ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new so[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new so[s.type]().fromJSON(s))}return this}},hn=class extends ro{constructor(t){super(),this.type="Path",this.currentPoint=new _t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ur(this.currentPoint.clone(),new _t(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Dr(this.currentPoint.clone(),new _t(t,e),new _t(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Ir(this.currentPoint.clone(),new _t(t,e),new _t(n,s),new _t(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Nr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){let l=new ys(t,e,n,s,r,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var tn=class extends hn{constructor(t){super(t),this.uuid=fi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new hn().fromJSON(s))}return this}},Ym={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Ul(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,d,f,g;if(n&&(r=jm(i,t,r,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let x=e;x<s;x+=e)d=i[x],f=i[x+1],d<a&&(a=d),f<c&&(c=f),d>l&&(l=d),f>h&&(h=f);g=Math.max(l-a,h-c),g=g!==0?32767/g:0}return vs(r,o,e,a,c,g,0),o}};function Ul(i,t,e,n,s){let r,o;if(s===l0(i,t,e,n)>0)for(r=t;r<e;r+=n)o=il(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=il(r,i[r],i[r+1],o);return o&&Xr(o,o.next)&&(Ss(o),o=o.next),o}function li(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Xr(e,e.next)||xe(e.prev,e,e.next)===0)){if(Ss(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function vs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&i0(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?Jm(i,n,s,r):Zm(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Ss(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=$m(li(i),t,e),vs(i,t,e,n,s,r,2)):o===2&&Km(i,t,e,n,s,r):vs(li(i),t,e,n,s,r,1);break}}}function Zm(i){let t=i.prev,e=i,n=i.next;if(xe(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<c?a<l?a:l:c<l?c:l,f=s>r?s>o?s:o:r>o?r:o,g=a>c?a>l?a:l:c>l?c:l,x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=f&&x.y>=d&&x.y<=g&&Ni(s,a,r,c,o,l,x.x,x.y)&&xe(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Jm(i,t,e,n){let s=i.prev,r=i,o=i.next;if(xe(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,f=o.y,g=a<c?a<l?a:l:c<l?c:l,x=h<d?h<f?h:f:d<f?d:f,v=a>c?a>l?a:l:c>l?c:l,p=h>d?h>f?h:f:d>f?d:f,u=ao(g,x,t,e,n),L=ao(v,p,t,e,n),_=i.prevZ,E=i.nextZ;for(;_&&_.z>=u&&E&&E.z<=L;){if(_.x>=g&&_.x<=v&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Ni(a,h,c,d,l,f,_.x,_.y)&&xe(_.prev,_,_.next)>=0||(_=_.prevZ,E.x>=g&&E.x<=v&&E.y>=x&&E.y<=p&&E!==s&&E!==o&&Ni(a,h,c,d,l,f,E.x,E.y)&&xe(E.prev,E,E.next)>=0))return!1;E=E.nextZ}for(;_&&_.z>=u;){if(_.x>=g&&_.x<=v&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Ni(a,h,c,d,l,f,_.x,_.y)&&xe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;E&&E.z<=L;){if(E.x>=g&&E.x<=v&&E.y>=x&&E.y<=p&&E!==s&&E!==o&&Ni(a,h,c,d,l,f,E.x,E.y)&&xe(E.prev,E,E.next)>=0)return!1;E=E.nextZ}return!0}function $m(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Xr(s,r)&&Dl(s,n,n.next,r)&&Ms(s,r)&&Ms(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Ss(n),Ss(n.next),n=i=r),n=n.next}while(n!==i);return li(n)}function Km(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&a0(o,a)){let c=Nl(o,a);o=li(o,o.next),c=li(c,c.next),vs(o,t,e,n,s,r,0),vs(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function jm(i,t,e,n){let s=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Ul(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(r0(l));for(s.sort(Qm),r=0;r<s.length;r++)e=t0(s[r],e);return e}function Qm(i,t){return i.x-t.x}function t0(i,t){let e=e0(i,t);if(!e)return t;let n=Nl(e,i);return li(n,n.next),li(e,e.next)}function e0(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,d;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Ni(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(d=Math.abs(o-e.y)/(r-e.x),Ms(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&n0(s,e)))&&(s=e,h=d)),e=e.next;while(e!==a);return s}function n0(i,t){return xe(i.prev,i,t.prev)<0&&xe(t.next,i,i.next)<0}function i0(i,t,e,n){let s=i;do s.z===0&&(s.z=ao(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,s0(s)}function s0(i){let t,e,n,s,r,o,a,c,l=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(o>1);return i}function ao(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function r0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ni(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function a0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!o0(i,t)&&(Ms(i,t)&&Ms(t,i)&&c0(i,t)&&(xe(i.prev,i,t.prev)||xe(i,t.prev,t))||Xr(i,t)&&xe(i.prev,i,i.next)>0&&xe(t.prev,t,t.next)>0)}function xe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Xr(i,t){return i.x===t.x&&i.y===t.y}function Dl(i,t,e,n){let s=rr(xe(i,t,e)),r=rr(xe(i,t,n)),o=rr(xe(e,n,i)),a=rr(xe(e,n,t));return!!(s!==r&&o!==a||s===0&&sr(i,e,t)||r===0&&sr(i,n,t)||o===0&&sr(e,i,n)||a===0&&sr(e,t,n))}function sr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function rr(i){return i>0?1:i<0?-1:0}function o0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Dl(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ms(i,t){return xe(i.prev,i,i.next)<0?xe(i,t,i.next)>=0&&xe(i,i.prev,t)>=0:xe(i,t,i.prev)<0||xe(i,i.next,t)<0}function c0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Nl(i,t){let e=new oo(i.i,i.x,i.y),n=new oo(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function il(i,t,e,n){let s=new oo(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ss(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function oo(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function l0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Be=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];sl(t),rl(n,t);let o=t.length;e.forEach(sl);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,rl(n,e[c]);let a=Ym.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function sl(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function rl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var hi=class i extends en{constructor(t=new tn([new _t(.5,.5),new _t(-.5,.5),new _t(-.5,-.5),new _t(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new Ye(s,3)),this.setAttribute("uv",new Ye(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,g=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:g-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,u=e.extrudePath,L=e.UVGenerator!==void 0?e.UVGenerator:h0,_,E=!1,N,P,R,K;u&&(_=u.getSpacedPoints(h),E=!0,f=!1,N=u.computeFrenetFrames(h,!1),P=new V,R=new V,K=new V),f||(p=0,g=0,x=0,v=0);let S=a.extractPoints(l),T=S.shape,Z=S.holes;if(!Be.isClockWise(T)){T=T.reverse();for(let A=0,Q=Z.length;A<Q;A++){let U=Z[A];Be.isClockWise(U)&&(Z[A]=U.reverse())}}let xt=Be.triangulateShape(T,Z),O=T;for(let A=0,Q=Z.length;A<Q;A++){let U=Z[A];T=T.concat(U)}function Y(A,Q,U){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),A.clone().addScaledVector(Q,U)}let nt=T.length,$=xt.length;function F(A,Q,U){let X,W,pt,D=A.x-Q.x,m=A.y-Q.y,y=U.x-A.x,z=U.y-A.y,mt=D*D+m*m,gt=D*z-m*y;if(Math.abs(gt)>Number.EPSILON){let ut=Math.sqrt(mt),Ut=Math.sqrt(y*y+z*z),St=Q.x-m/ut,It=Q.y+D/ut,Bt=U.x-z/Ut,Ht=U.y+y/Ut,yt=((Bt-St)*z-(Ht-It)*y)/(D*z-m*y);X=St+D*yt-A.x,W=It+m*yt-A.y;let Kt=X*X+W*W;if(Kt<=2)return new _t(X,W);pt=Math.sqrt(Kt/2)}else{let ut=!1;D>Number.EPSILON?y>Number.EPSILON&&(ut=!0):D<-Number.EPSILON?y<-Number.EPSILON&&(ut=!0):Math.sign(m)===Math.sign(z)&&(ut=!0),ut?(X=-m,W=D,pt=Math.sqrt(mt)):(X=D,W=m,pt=Math.sqrt(mt/2))}return new _t(X/pt,W/pt)}let it=[];for(let A=0,Q=O.length,U=Q-1,X=A+1;A<Q;A++,U++,X++)U===Q&&(U=0),X===Q&&(X=0),it[A]=F(O[A],O[U],O[X]);let ct=[],ft,Mt=it.concat();for(let A=0,Q=Z.length;A<Q;A++){let U=Z[A];ft=[];for(let X=0,W=U.length,pt=W-1,D=X+1;X<W;X++,pt++,D++)pt===W&&(pt=0),D===W&&(D=0),ft[X]=F(U[X],U[pt],U[D]);ct.push(ft),Mt=Mt.concat(ft)}for(let A=0;A<p;A++){let Q=A/p,U=g*Math.cos(Q*Math.PI/2),X=x*Math.sin(Q*Math.PI/2)+v;for(let W=0,pt=O.length;W<pt;W++){let D=Y(O[W],it[W],X);M(D.x,D.y,-U)}for(let W=0,pt=Z.length;W<pt;W++){let D=Z[W];ft=ct[W];for(let m=0,y=D.length;m<y;m++){let z=Y(D[m],ft[m],X);M(z.x,z.y,-U)}}}let st=x+v;for(let A=0;A<nt;A++){let Q=f?Y(T[A],Mt[A],st):T[A];E?(R.copy(N.normals[0]).multiplyScalar(Q.x),P.copy(N.binormals[0]).multiplyScalar(Q.y),K.copy(_[0]).add(R).add(P),M(K.x,K.y,K.z)):M(Q.x,Q.y,0)}for(let A=1;A<=h;A++)for(let Q=0;Q<nt;Q++){let U=f?Y(T[Q],Mt[Q],st):T[Q];E?(R.copy(N.normals[A]).multiplyScalar(U.x),P.copy(N.binormals[A]).multiplyScalar(U.y),K.copy(_[A]).add(R).add(P),M(K.x,K.y,K.z)):M(U.x,U.y,d/h*A)}for(let A=p-1;A>=0;A--){let Q=A/p,U=g*Math.cos(Q*Math.PI/2),X=x*Math.sin(Q*Math.PI/2)+v;for(let W=0,pt=O.length;W<pt;W++){let D=Y(O[W],it[W],X);M(D.x,D.y,d+U)}for(let W=0,pt=Z.length;W<pt;W++){let D=Z[W];ft=ct[W];for(let m=0,y=D.length;m<y;m++){let z=Y(D[m],ft[m],X);E?M(z.x,z.y+_[h-1].y,_[h-1].x+U):M(z.x,z.y,d+U)}}}I(),C();function I(){let A=s.length/3;if(f){let Q=0,U=nt*Q;for(let X=0;X<$;X++){let W=xt[X];j(W[2]+U,W[1]+U,W[0]+U)}Q=h+p*2,U=nt*Q;for(let X=0;X<$;X++){let W=xt[X];j(W[0]+U,W[1]+U,W[2]+U)}}else{for(let Q=0;Q<$;Q++){let U=xt[Q];j(U[2],U[1],U[0])}for(let Q=0;Q<$;Q++){let U=xt[Q];j(U[0]+nt*h,U[1]+nt*h,U[2]+nt*h)}}n.addGroup(A,s.length/3-A,0)}function C(){let A=s.length/3,Q=0;b(O,Q),Q+=O.length;for(let U=0,X=Z.length;U<X;U++){let W=Z[U];b(W,Q),Q+=W.length}n.addGroup(A,s.length/3-A,1)}function b(A,Q){let U=A.length;for(;--U>=0;){let X=U,W=U-1;W<0&&(W=A.length-1);for(let pt=0,D=h+p*2;pt<D;pt++){let m=nt*pt,y=nt*(pt+1),z=Q+X+m,mt=Q+W+m,gt=Q+W+y,ut=Q+X+y;lt(z,mt,gt,ut)}}}function M(A,Q,U){c.push(A),c.push(Q),c.push(U)}function j(A,Q,U){H(A),H(Q),H(U);let X=s.length/3,W=L.generateTopUV(n,s,X-3,X-2,X-1);dt(W[0]),dt(W[1]),dt(W[2])}function lt(A,Q,U,X){H(A),H(Q),H(X),H(Q),H(U),H(X);let W=s.length/3,pt=L.generateSideWallUV(n,s,W-6,W-3,W-2,W-1);dt(pt[0]),dt(pt[1]),dt(pt[3]),dt(pt[1]),dt(pt[2]),dt(pt[3])}function H(A){s.push(c[A*3+0]),s.push(c[A*3+1]),s.push(c[A*3+2])}function dt(A){r.push(A.x),r.push(A.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return u0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new so[s.type]().fromJSON(s)),new i(n,t.options)}},h0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new _t(r,o),new _t(a,c),new _t(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],f=t[s*3],g=t[s*3+1],x=t[s*3+2],v=t[r*3],p=t[r*3+1],u=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new _t(o,1-c),new _t(l,1-d),new _t(f,1-x),new _t(v,1-u)]:[new _t(a,1-c),new _t(h,1-d),new _t(g,1-x),new _t(p,1-u)]}};function u0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var co=class extends Jn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sl,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Or=class extends co{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new _t(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ie(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function ar(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function d0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Zi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},lo=class extends Zi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:hc,endingEnd:hc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case uc:r=t,a=2*e-n;break;case dc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case uc:o=t,c=2*n-e;break;case dc:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,g=this._weightNext,x=(n-e)/(s-e),v=x*x,p=v*x,u=-f*p+2*f*v-f*x,L=(1+f)*p+(-1.5-2*f)*v+(-.5+f)*x+1,_=(-1-g)*p+(1.5+g)*v+.5*x,E=g*p-g*v;for(let N=0;N!==a;++N)r[N]=u*o[h+N]+L*o[l+N]+_*o[c+N]+E*o[d+N];return r}},ho=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*d+o[c+f]*h;return r}},uo=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},xn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ar(e,this.TimeBufferType),this.values=ar(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ar(t.times,Array),values:ar(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new uo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ho(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new lo(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case lr:e=this.InterpolantFactoryMethodDiscrete;break;case hr:e=this.InterpolantFactoryMethodLinear;break;case na:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return lr;case this.InterpolantFactoryMethodLinear:return hr;case this.InterpolantFactoryMethodSmooth:return na}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&d0(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===na,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let d=a*n,f=d-n,g=d+n;for(let x=0;x!==n;++x){let v=e[d+x];if(v!==e[f+x]||v!==e[g+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let g=0;g!==n;++g)e[f+g]=e[d+g]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=hr;var ui=class extends xn{};ui.prototype.ValueTypeName="bool";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=lr;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var fo=class extends xn{};fo.prototype.ValueTypeName="color";var po=class extends xn{};po.prototype.ValueTypeName="number";var mo=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)Zn.slerpFlat(r,0,o,l-a,o,l,c);return r}},bs=class extends xn{InterpolantFactoryMethodLinear(t){return new mo(this.times,this.values,this.getValueSize(),t)}};bs.prototype.ValueTypeName="quaternion";bs.prototype.DefaultInterpolation=hr;bs.prototype.InterpolantFactoryMethodSmooth=void 0;var di=class extends xn{};di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=lr;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var go=class extends xn{};go.prototype.ValueTypeName="vector";var al={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},_o=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){let g=l[d],x=l[d+1];if(g.global&&(g.lastIndex=0),g.test(h))return x}return null}}},f0=new _o,Ji=class{constructor(t){this.manager=t!==void 0?t:f0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Ji.DEFAULT_MATERIAL_NAME="__DEFAULT";var Cn={},xo=class extends Error{constructor(t,e){super(t),this.response=e}},Fr=class extends Ji{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=al.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Cn[t]!==void 0){Cn[t].push({onLoad:e,onProgress:n,onError:s});return}Cn[t]=[],Cn[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=Cn[t],d=l.body.getReader(),f=l.headers.get("Content-Length")||l.headers.get("X-File-Size"),g=f?parseInt(f):0,x=g!==0,v=0,p=new ReadableStream({start(u){L();function L(){d.read().then(({done:_,value:E})=>{if(_)u.close();else{v+=E.byteLength;let N=new ProgressEvent("progress",{lengthComputable:x,loaded:v,total:g});for(let P=0,R=h.length;P<R;P++){let K=h[P];K.onProgress&&K.onProgress(N)}u.enqueue(E),L()}})}}});return new Response(p)}else throw new xo(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),f=d&&d[1]?d[1].toLowerCase():void 0,g=new TextDecoder(f);return l.arrayBuffer().then(x=>g.decode(x))}}}).then(l=>{al.add(t,l);let h=Cn[t];delete Cn[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onLoad&&g.onLoad(l)}}).catch(l=>{let h=Cn[t];if(h===void 0)throw this.manager.itemError(t),l;delete Cn[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onError&&g.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Es=class extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}};var Aa=new be,ol=new V,cl=new V,Br=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ms,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;ol.setFromMatrixPosition(t.matrixWorld),e.position.copy(ol),cl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(cl),e.updateMatrixWorld(),Aa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Aa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Aa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},yo=class extends Br{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Vi*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},zr=class extends Es{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new yo}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var vo=class extends Br{constructor(){super(new Lr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ws=class extends Es{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new vo}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},kr=class extends Es{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var Hr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ll(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=ll();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function ll(){return(typeof performance>"u"?Date:performance).now()}var Ro="\\[\\]\\.:\\/",p0=new RegExp("["+Ro+"]","g"),Co="[^"+Ro+"]",m0="[^"+Ro.replace("\\.","")+"]",g0=/((?:WC+[\/:])*)/.source.replace("WC",Co),_0=/(WCOD+)?/.source.replace("WCOD",m0),x0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Co),y0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Co),v0=new RegExp("^"+g0+_0+x0+y0+"$"),M0=["material","materials","bones","map"],Mo=class{constructor(t,e,n){let s=n||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(p0,"")}static parseTrackName(t){let e=v0.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);M0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=Mo;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var w0=new Float32Array(1);var hl=new _t,un=class{constructor(t=new _t(1/0,1/0),e=new _t(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=hl.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hl).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}};var bn=class{constructor(){this.type="ShapePath",this.color=new $t,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new hn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,s){return this.currentPath.quadraticCurveTo(t,e,n,s),this}bezierCurveTo(t,e,n,s,r,o){return this.currentPath.bezierCurveTo(t,e,n,s,r,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(u){let L=[];for(let _=0,E=u.length;_<E;_++){let N=u[_],P=new tn;P.curves=N.curves,L.push(P)}return L}function n(u,L){let _=L.length,E=!1;for(let N=_-1,P=0;P<_;N=P++){let R=L[N],K=L[P],S=K.x-R.x,T=K.y-R.y;if(Math.abs(T)>Number.EPSILON){if(T<0&&(R=L[P],S=-S,K=L[N],T=-T),u.y<R.y||u.y>K.y)continue;if(u.y===R.y){if(u.x===R.x)return!0}else{let Z=T*(u.x-R.x)-S*(u.y-R.y);if(Z===0)return!0;if(Z<0)continue;E=!E}}else{if(u.y!==R.y)continue;if(K.x<=u.x&&u.x<=R.x||R.x<=u.x&&u.x<=K.x)return!0}}return E}let s=Be.isClockWise,r=this.subPaths;if(r.length===0)return[];let o,a,c,l=[];if(r.length===1)return a=r[0],c=new tn,c.curves=a.curves,l.push(c),l;let h=!s(r[0].getPoints());h=t?!h:h;let d=[],f=[],g=[],x=0,v;f[x]=void 0,g[x]=[];for(let u=0,L=r.length;u<L;u++)a=r[u],v=a.getPoints(),o=s(v),o=t?!o:o,o?(!h&&f[x]&&x++,f[x]={s:new tn,p:v},f[x].s.curves=a.curves,h&&x++,g[x]=[]):g[x].push({h:a,p:v[0]});if(!f[0])return e(r);if(f.length>1){let u=!1,L=0;for(let _=0,E=f.length;_<E;_++)d[_]=[];for(let _=0,E=f.length;_<E;_++){let N=g[_];for(let P=0;P<N.length;P++){let R=N[P],K=!0;for(let S=0;S<f.length;S++)n(R.p,f[S].p)&&(_!==S&&L++,K?(K=!1,d[S].push(R)):u=!0);K&&d[_].push(R)}}L>0&&u===!1&&(g=d)}let p;for(let u=0,L=f.length;u<L;u++){c=f[u].s,l.push(c),p=g[u];for(let _=0,E=p.length;_<E;_++)c.holes.push(p[_].h)}return l}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var b0=Te,qr=class i extends Ji{constructor(t){super(t),this.defaultDPI=90,this.defaultUnit="px"}load(t,e,n,s){let r=this,o=new Fr(r.manager);o.setPath(r.path),o.setRequestHeader(r.requestHeader),o.setWithCredentials(r.withCredentials),o.load(t,function(a){try{e(r.parse(a))}catch(c){s?s(c):console.error(c),r.manager.itemError(t)}},n,s)}parse(t){let e=this;function n(I,C){if(I.nodeType!==1)return;let b=E(I),M=!1,j=null;switch(I.nodeName){case"svg":C=x(I,C);break;case"style":r(I);break;case"g":C=x(I,C);break;case"path":C=x(I,C),I.hasAttribute("d")&&(j=s(I));break;case"rect":C=x(I,C),j=c(I);break;case"polygon":C=x(I,C),j=l(I);break;case"polyline":C=x(I,C),j=h(I);break;case"circle":C=x(I,C),j=d(I);break;case"ellipse":C=x(I,C),j=f(I);break;case"line":C=x(I,C),j=g(I);break;case"defs":M=!0;break;case"use":C=x(I,C);let dt=(I.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),A=I.viewportElement.getElementById(dt);A?n(A,C):console.warn("SVGLoader: 'use node' references non-existent node id: "+dt);break;default:}j&&(C.fill!==void 0&&C.fill!=="none"&&j.color.setStyle(C.fill,b0),P(j,ft),et.push(j),j.userData={node:I,style:C});let lt=I.childNodes;for(let H=0;H<lt.length;H++){let dt=lt[H];M&&dt.nodeName!=="style"&&dt.nodeName!=="defs"||n(dt,C)}b&&(O.pop(),O.length>0?ft.copy(O[O.length-1]):ft.identity())}function s(I){let C=new bn,b=new _t,M=new _t,j=new _t,lt=!0,H=!1,dt=I.getAttribute("d");if(dt===""||dt==="none")return null;let A=dt.match(/[a-df-z][^a-df-z]*/ig);for(let Q=0,U=A.length;Q<U;Q++){let X=A[Q],W=X.charAt(0),pt=X.slice(1).trim();lt===!0&&(H=!0,lt=!1);let D;switch(W){case"M":D=p(pt);for(let m=0,y=D.length;m<y;m+=2)b.x=D[m+0],b.y=D[m+1],M.x=b.x,M.y=b.y,m===0?C.moveTo(b.x,b.y):C.lineTo(b.x,b.y),m===0&&j.copy(b);break;case"H":D=p(pt);for(let m=0,y=D.length;m<y;m++)b.x=D[m],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"V":D=p(pt);for(let m=0,y=D.length;m<y;m++)b.y=D[m],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"L":D=p(pt);for(let m=0,y=D.length;m<y;m+=2)b.x=D[m+0],b.y=D[m+1],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"C":D=p(pt);for(let m=0,y=D.length;m<y;m+=6)C.bezierCurveTo(D[m+0],D[m+1],D[m+2],D[m+3],D[m+4],D[m+5]),M.x=D[m+2],M.y=D[m+3],b.x=D[m+4],b.y=D[m+5],m===0&&H===!0&&j.copy(b);break;case"S":D=p(pt);for(let m=0,y=D.length;m<y;m+=4)C.bezierCurveTo(v(b.x,M.x),v(b.y,M.y),D[m+0],D[m+1],D[m+2],D[m+3]),M.x=D[m+0],M.y=D[m+1],b.x=D[m+2],b.y=D[m+3],m===0&&H===!0&&j.copy(b);break;case"Q":D=p(pt);for(let m=0,y=D.length;m<y;m+=4)C.quadraticCurveTo(D[m+0],D[m+1],D[m+2],D[m+3]),M.x=D[m+0],M.y=D[m+1],b.x=D[m+2],b.y=D[m+3],m===0&&H===!0&&j.copy(b);break;case"T":D=p(pt);for(let m=0,y=D.length;m<y;m+=2){let z=v(b.x,M.x),mt=v(b.y,M.y);C.quadraticCurveTo(z,mt,D[m+0],D[m+1]),M.x=z,M.y=mt,b.x=D[m+0],b.y=D[m+1],m===0&&H===!0&&j.copy(b)}break;case"A":D=p(pt,[3,4],7);for(let m=0,y=D.length;m<y;m+=7){if(D[m+5]==b.x&&D[m+6]==b.y)continue;let z=b.clone();b.x=D[m+5],b.y=D[m+6],M.x=b.x,M.y=b.y,o(C,D[m],D[m+1],D[m+2],D[m+3],D[m+4],z,b),m===0&&H===!0&&j.copy(b)}break;case"m":D=p(pt);for(let m=0,y=D.length;m<y;m+=2)b.x+=D[m+0],b.y+=D[m+1],M.x=b.x,M.y=b.y,m===0?C.moveTo(b.x,b.y):C.lineTo(b.x,b.y),m===0&&j.copy(b);break;case"h":D=p(pt);for(let m=0,y=D.length;m<y;m++)b.x+=D[m],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"v":D=p(pt);for(let m=0,y=D.length;m<y;m++)b.y+=D[m],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"l":D=p(pt);for(let m=0,y=D.length;m<y;m+=2)b.x+=D[m+0],b.y+=D[m+1],M.x=b.x,M.y=b.y,C.lineTo(b.x,b.y),m===0&&H===!0&&j.copy(b);break;case"c":D=p(pt);for(let m=0,y=D.length;m<y;m+=6)C.bezierCurveTo(b.x+D[m+0],b.y+D[m+1],b.x+D[m+2],b.y+D[m+3],b.x+D[m+4],b.y+D[m+5]),M.x=b.x+D[m+2],M.y=b.y+D[m+3],b.x+=D[m+4],b.y+=D[m+5],m===0&&H===!0&&j.copy(b);break;case"s":D=p(pt);for(let m=0,y=D.length;m<y;m+=4)C.bezierCurveTo(v(b.x,M.x),v(b.y,M.y),b.x+D[m+0],b.y+D[m+1],b.x+D[m+2],b.y+D[m+3]),M.x=b.x+D[m+0],M.y=b.y+D[m+1],b.x+=D[m+2],b.y+=D[m+3],m===0&&H===!0&&j.copy(b);break;case"q":D=p(pt);for(let m=0,y=D.length;m<y;m+=4)C.quadraticCurveTo(b.x+D[m+0],b.y+D[m+1],b.x+D[m+2],b.y+D[m+3]),M.x=b.x+D[m+0],M.y=b.y+D[m+1],b.x+=D[m+2],b.y+=D[m+3],m===0&&H===!0&&j.copy(b);break;case"t":D=p(pt);for(let m=0,y=D.length;m<y;m+=2){let z=v(b.x,M.x),mt=v(b.y,M.y);C.quadraticCurveTo(z,mt,b.x+D[m+0],b.y+D[m+1]),M.x=z,M.y=mt,b.x=b.x+D[m+0],b.y=b.y+D[m+1],m===0&&H===!0&&j.copy(b)}break;case"a":D=p(pt,[3,4],7);for(let m=0,y=D.length;m<y;m+=7){if(D[m+5]==0&&D[m+6]==0)continue;let z=b.clone();b.x+=D[m+5],b.y+=D[m+6],M.x=b.x,M.y=b.y,o(C,D[m],D[m+1],D[m+2],D[m+3],D[m+4],z,b),m===0&&H===!0&&j.copy(b)}break;case"Z":case"z":C.currentPath.autoClose=!0,C.currentPath.curves.length>0&&(b.copy(j),C.currentPath.currentPoint.copy(b),lt=!0);break;default:console.warn(X)}H=!1}return C}function r(I){if(!(!I.sheet||!I.sheet.cssRules||!I.sheet.cssRules.length))for(let C=0;C<I.sheet.cssRules.length;C++){let b=I.sheet.cssRules[C];if(b.type!==1)continue;let M=b.selectorText.split(/,/gm).filter(Boolean).map(j=>j.trim());for(let j=0;j<M.length;j++){let lt=Object.fromEntries(Object.entries(b.style).filter(([,H])=>H!==""));xt[M[j]]=Object.assign(xt[M[j]]||{},lt)}}}function o(I,C,b,M,j,lt,H,dt){if(C==0||b==0){I.lineTo(dt.x,dt.y);return}M=M*Math.PI/180,C=Math.abs(C),b=Math.abs(b);let A=(H.x-dt.x)/2,Q=(H.y-dt.y)/2,U=Math.cos(M)*A+Math.sin(M)*Q,X=-Math.sin(M)*A+Math.cos(M)*Q,W=C*C,pt=b*b,D=U*U,m=X*X,y=D/W+m/pt;if(y>1){let yt=Math.sqrt(y);C=yt*C,b=yt*b,W=C*C,pt=b*b}let z=W*m+pt*D,mt=(W*pt-z)/z,gt=Math.sqrt(Math.max(0,mt));j===lt&&(gt=-gt);let ut=gt*C*X/b,Ut=-gt*b*U/C,St=Math.cos(M)*ut-Math.sin(M)*Ut+(H.x+dt.x)/2,It=Math.sin(M)*ut+Math.cos(M)*Ut+(H.y+dt.y)/2,Bt=a(1,0,(U-ut)/C,(X-Ut)/b),Ht=a((U-ut)/C,(X-Ut)/b,(-U-ut)/C,(-X-Ut)/b)%(Math.PI*2);I.currentPath.absellipse(St,It,C,b,Bt,Bt+Ht,lt===0,M)}function a(I,C,b,M){let j=I*b+C*M,lt=Math.sqrt(I*I+C*C)*Math.sqrt(b*b+M*M),H=Math.acos(Math.max(-1,Math.min(1,j/lt)));return I*M-C*b<0&&(H=-H),H}function c(I){let C=_(I.getAttribute("x")||0),b=_(I.getAttribute("y")||0),M=_(I.getAttribute("rx")||I.getAttribute("ry")||0),j=_(I.getAttribute("ry")||I.getAttribute("rx")||0),lt=_(I.getAttribute("width")),H=_(I.getAttribute("height")),dt=1-.551915024494,A=new bn;return A.moveTo(C+M,b),A.lineTo(C+lt-M,b),(M!==0||j!==0)&&A.bezierCurveTo(C+lt-M*dt,b,C+lt,b+j*dt,C+lt,b+j),A.lineTo(C+lt,b+H-j),(M!==0||j!==0)&&A.bezierCurveTo(C+lt,b+H-j*dt,C+lt-M*dt,b+H,C+lt-M,b+H),A.lineTo(C+M,b+H),(M!==0||j!==0)&&A.bezierCurveTo(C+M*dt,b+H,C,b+H-j*dt,C,b+H-j),A.lineTo(C,b+j),(M!==0||j!==0)&&A.bezierCurveTo(C,b+j*dt,C+M*dt,b,C+M,b),A}function l(I){function C(lt,H,dt){let A=_(H),Q=_(dt);j===0?M.moveTo(A,Q):M.lineTo(A,Q),j++}let b=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,M=new bn,j=0;return I.getAttribute("points").replace(b,C),M.currentPath.autoClose=!0,M}function h(I){function C(lt,H,dt){let A=_(H),Q=_(dt);j===0?M.moveTo(A,Q):M.lineTo(A,Q),j++}let b=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,M=new bn,j=0;return I.getAttribute("points").replace(b,C),M.currentPath.autoClose=!1,M}function d(I){let C=_(I.getAttribute("cx")||0),b=_(I.getAttribute("cy")||0),M=_(I.getAttribute("r")||0),j=new hn;j.absarc(C,b,M,0,Math.PI*2);let lt=new bn;return lt.subPaths.push(j),lt}function f(I){let C=_(I.getAttribute("cx")||0),b=_(I.getAttribute("cy")||0),M=_(I.getAttribute("rx")||0),j=_(I.getAttribute("ry")||0),lt=new hn;lt.absellipse(C,b,M,j,0,Math.PI*2);let H=new bn;return H.subPaths.push(lt),H}function g(I){let C=_(I.getAttribute("x1")||0),b=_(I.getAttribute("y1")||0),M=_(I.getAttribute("x2")||0),j=_(I.getAttribute("y2")||0),lt=new bn;return lt.moveTo(C,b),lt.lineTo(M,j),lt.currentPath.autoClose=!1,lt}function x(I,C){C=Object.assign({},C);let b={};if(I.hasAttribute("class")){let H=I.getAttribute("class").split(/\s/).filter(Boolean).map(dt=>dt.trim());for(let dt=0;dt<H.length;dt++)b=Object.assign(b,xt["."+H[dt]])}I.hasAttribute("id")&&(b=Object.assign(b,xt["#"+I.getAttribute("id")]));function M(H,dt,A){A===void 0&&(A=function(U){return U.startsWith("url")&&console.warn("SVGLoader: url access in attributes is not implemented."),U}),I.hasAttribute(H)&&(C[dt]=A(I.getAttribute(H))),b[H]&&(C[dt]=A(b[H])),I.style&&I.style[H]!==""&&(C[dt]=A(I.style[H]))}function j(H){return Math.max(0,Math.min(1,_(H)))}function lt(H){return Math.max(0,_(H))}return M("fill","fill"),M("fill-opacity","fillOpacity",j),M("fill-rule","fillRule"),M("opacity","opacity",j),M("stroke","stroke"),M("stroke-opacity","strokeOpacity",j),M("stroke-width","strokeWidth",lt),M("stroke-linejoin","strokeLineJoin"),M("stroke-linecap","strokeLineCap"),M("stroke-miterlimit","strokeMiterLimit",lt),M("visibility","visibility"),C}function v(I,C){return I-(C-I)}function p(I,C,b){if(typeof I!="string")throw new TypeError("Invalid input: "+typeof I);let M={SEPARATOR:/[ \t\r\n\,.\-+]/,WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},j=0,lt=1,H=2,dt=3,A=j,Q=!0,U="",X="",W=[];function pt(z,mt,gt){let ut=new SyntaxError('Unexpected character "'+z+'" at index '+mt+".");throw ut.partial=gt,ut}function D(){U!==""&&(X===""?W.push(Number(U)):W.push(Number(U)*Math.pow(10,Number(X)))),U="",X=""}let m,y=I.length;for(let z=0;z<y;z++){if(m=I[z],Array.isArray(C)&&C.includes(W.length%b)&&M.FLAGS.test(m)){A=lt,U=m,D();continue}if(A===j){if(M.WHITESPACE.test(m))continue;if(M.DIGIT.test(m)||M.SIGN.test(m)){A=lt,U=m;continue}if(M.POINT.test(m)){A=H,U=m;continue}M.COMMA.test(m)&&(Q&&pt(m,z,W),Q=!0)}if(A===lt){if(M.DIGIT.test(m)){U+=m;continue}if(M.POINT.test(m)){U+=m,A=H;continue}if(M.EXP.test(m)){A=dt;continue}M.SIGN.test(m)&&U.length===1&&M.SIGN.test(U[0])&&pt(m,z,W)}if(A===H){if(M.DIGIT.test(m)){U+=m;continue}if(M.EXP.test(m)){A=dt;continue}M.POINT.test(m)&&U[U.length-1]==="."&&pt(m,z,W)}if(A===dt){if(M.DIGIT.test(m)){X+=m;continue}if(M.SIGN.test(m)){if(X===""){X+=m;continue}X.length===1&&M.SIGN.test(X)&&pt(m,z,W)}}M.WHITESPACE.test(m)?(D(),A=j,Q=!1):M.COMMA.test(m)?(D(),A=j,Q=!0):M.SIGN.test(m)?(D(),A=lt,U=m):M.POINT.test(m)?(D(),A=H,U=m):pt(m,z,W)}return D(),W}let u=["mm","cm","in","pt","pc","px"],L={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function _(I){let C="px";if(typeof I=="string"||I instanceof String)for(let M=0,j=u.length;M<j;M++){let lt=u[M];if(I.endsWith(lt)){C=lt,I=I.substring(0,I.length-lt.length);break}}let b;return C==="px"&&e.defaultUnit!=="px"?b=L.in[e.defaultUnit]/e.defaultDPI:(b=L[C][e.defaultUnit],b<0&&(b=L[C].in*e.defaultDPI)),b*parseFloat(I)}function E(I){if(!(I.hasAttribute("transform")||I.nodeName==="use"&&(I.hasAttribute("x")||I.hasAttribute("y"))))return null;let C=N(I);return O.length>0&&C.premultiply(O[O.length-1]),ft.copy(C),O.push(C),C}function N(I){let C=new Jt,b=Y;if(I.nodeName==="use"&&(I.hasAttribute("x")||I.hasAttribute("y"))){let M=_(I.getAttribute("x")),j=_(I.getAttribute("y"));C.translate(M,j)}if(I.hasAttribute("transform")){let M=I.getAttribute("transform").split(")");for(let j=M.length-1;j>=0;j--){let lt=M[j].trim();if(lt==="")continue;let H=lt.indexOf("("),dt=lt.length;if(H>0&&H<dt){let A=lt.slice(0,H),Q=p(lt.slice(H+1));switch(b.identity(),A){case"translate":if(Q.length>=1){let U=Q[0],X=0;Q.length>=2&&(X=Q[1]),b.translate(U,X)}break;case"rotate":if(Q.length>=1){let U=0,X=0,W=0;U=Q[0]*Math.PI/180,Q.length>=3&&(X=Q[1],W=Q[2]),nt.makeTranslation(-X,-W),$.makeRotation(U),F.multiplyMatrices($,nt),nt.makeTranslation(X,W),b.multiplyMatrices(nt,F)}break;case"scale":if(Q.length>=1){let U=Q[0],X=U;Q.length>=2&&(X=Q[1]),b.scale(U,X)}break;case"skewX":Q.length===1&&b.set(1,Math.tan(Q[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":Q.length===1&&b.set(1,0,0,Math.tan(Q[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":Q.length===6&&b.set(Q[0],Q[2],Q[4],Q[1],Q[3],Q[5],0,0,1);break}}C.premultiply(b)}}return C}function P(I,C){function b(H){ct.set(H.x,H.y,1).applyMatrix3(C),H.set(ct.x,ct.y)}function M(H){let dt=H.xRadius,A=H.yRadius,Q=Math.cos(H.aRotation),U=Math.sin(H.aRotation),X=new V(dt*Q,dt*U,0),W=new V(-A*U,A*Q,0),pt=X.applyMatrix3(C),D=W.applyMatrix3(C),m=Y.set(pt.x,D.x,0,pt.y,D.y,0,0,0,1),y=nt.copy(m).invert(),gt=$.copy(y).transpose().multiply(y).elements,ut=Z(gt[0],gt[1],gt[4]),Ut=Math.sqrt(ut.rt1),St=Math.sqrt(ut.rt2);if(H.xRadius=1/Ut,H.yRadius=1/St,H.aRotation=Math.atan2(ut.sn,ut.cs),!((H.aEndAngle-H.aStartAngle)%(2*Math.PI)<Number.EPSILON)){let Bt=nt.set(Ut,0,0,0,St,0,0,0,1),Ht=$.set(ut.cs,ut.sn,0,-ut.sn,ut.cs,0,0,0,1),yt=Bt.multiply(Ht).multiply(m),Kt=Yt=>{let{x:Vt,y:zt}=new V(Math.cos(Yt),Math.sin(Yt),0).applyMatrix3(yt);return Math.atan2(zt,Vt)};H.aStartAngle=Kt(H.aStartAngle),H.aEndAngle=Kt(H.aEndAngle),R(C)&&(H.aClockwise=!H.aClockwise)}}function j(H){let dt=S(C),A=T(C);H.xRadius*=dt,H.yRadius*=A;let Q=dt>Number.EPSILON?Math.atan2(C.elements[1],C.elements[0]):Math.atan2(-C.elements[3],C.elements[4]);H.aRotation+=Q,R(C)&&(H.aStartAngle*=-1,H.aEndAngle*=-1,H.aClockwise=!H.aClockwise)}let lt=I.subPaths;for(let H=0,dt=lt.length;H<dt;H++){let Q=lt[H].curves;for(let U=0;U<Q.length;U++){let X=Q[U];X.isLineCurve?(b(X.v1),b(X.v2)):X.isCubicBezierCurve?(b(X.v0),b(X.v1),b(X.v2),b(X.v3)):X.isQuadraticBezierCurve?(b(X.v0),b(X.v1),b(X.v2)):X.isEllipseCurve&&(it.set(X.aX,X.aY),b(it),X.aX=it.x,X.aY=it.y,K(C)?M(X):j(X))}}}function R(I){let C=I.elements;return C[0]*C[4]-C[1]*C[3]<0}function K(I){let C=I.elements,b=C[0]*C[3]+C[1]*C[4];if(b===0)return!1;let M=S(I),j=T(I);return Math.abs(b/(M*j))>Number.EPSILON}function S(I){let C=I.elements;return Math.sqrt(C[0]*C[0]+C[1]*C[1])}function T(I){let C=I.elements;return Math.sqrt(C[3]*C[3]+C[4]*C[4])}function Z(I,C,b){let M,j,lt,H,dt,A=I+b,Q=I-b,U=Math.sqrt(Q*Q+4*C*C);return A>0?(M=.5*(A+U),dt=1/M,j=I*dt*b-C*dt*C):A<0?j=.5*(A-U):(M=.5*U,j=-.5*U),Q>0?lt=Q+U:lt=Q-U,Math.abs(lt)>2*Math.abs(C)?(dt=-2*C/lt,H=1/Math.sqrt(1+dt*dt),lt=dt*H):Math.abs(C)===0?(lt=1,H=0):(dt=-.5*lt/C,lt=1/Math.sqrt(1+dt*dt),H=dt*lt),Q>0&&(dt=lt,lt=-H,H=dt),{rt1:M,rt2:j,cs:lt,sn:H}}let et=[],xt={},O=[],Y=new Jt,nt=new Jt,$=new Jt,F=new Jt,it=new _t,ct=new V,ft=new Jt,Mt=new DOMParser().parseFromString(t,"image/svg+xml");return n(Mt.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:et,xml:Mt.documentElement}}static createShapes(t){let n={ORIGIN:0,DESTINATION:1,BETWEEN:2,LEFT:3,RIGHT:4,BEHIND:5,BEYOND:6},s={loc:n.ORIGIN,t:0};function r(v,p,u,L){let _=v.x,E=p.x,N=u.x,P=L.x,R=v.y,K=p.y,S=u.y,T=L.y,Z=(P-N)*(R-S)-(T-S)*(_-N),et=(E-_)*(R-S)-(K-R)*(_-N),xt=(T-S)*(E-_)-(P-N)*(K-R),O=Z/xt,Y=et/xt;if(xt===0&&Z!==0||O<=0||O>=1||Y<0||Y>1)return null;if(Z===0&&xt===0){for(let nt=0;nt<2;nt++)if(o(nt===0?u:L,v,p),s.loc==n.ORIGIN){let $=nt===0?u:L;return{x:$.x,y:$.y,t:s.t}}else if(s.loc==n.BETWEEN){let $=+(_+s.t*(E-_)).toPrecision(10),F=+(R+s.t*(K-R)).toPrecision(10);return{x:$,y:F,t:s.t}}return null}else{for(let F=0;F<2;F++)if(o(F===0?u:L,v,p),s.loc==n.ORIGIN){let it=F===0?u:L;return{x:it.x,y:it.y,t:s.t}}let nt=+(_+O*(E-_)).toPrecision(10),$=+(R+O*(K-R)).toPrecision(10);return{x:nt,y:$,t:O}}}function o(v,p,u){let L=u.x-p.x,_=u.y-p.y,E=v.x-p.x,N=v.y-p.y,P=L*N-E*_;if(v.x===p.x&&v.y===p.y){s.loc=n.ORIGIN,s.t=0;return}if(v.x===u.x&&v.y===u.y){s.loc=n.DESTINATION,s.t=1;return}if(P<-Number.EPSILON){s.loc=n.LEFT;return}if(P>Number.EPSILON){s.loc=n.RIGHT;return}if(L*E<0||_*N<0){s.loc=n.BEHIND;return}if(Math.sqrt(L*L+_*_)<Math.sqrt(E*E+N*N)){s.loc=n.BEYOND;return}let R;L!==0?R=E/L:R=N/_,s.loc=n.BETWEEN,s.t=R}function a(v,p){let u=[],L=[];for(let _=1;_<v.length;_++){let E=v[_-1],N=v[_];for(let P=1;P<p.length;P++){let R=p[P-1],K=p[P],S=r(E,N,R,K);S!==null&&u.find(T=>T.t<=S.t+Number.EPSILON&&T.t>=S.t-Number.EPSILON)===void 0&&(u.push(S),L.push(new _t(S.x,S.y)))}}return L}function c(v,p,u){let L=new _t;p.getCenter(L);let _=[];return u.forEach(E=>{E.boundingBox.containsPoint(L)&&a(v,E.points).forEach(P=>{_.push({identifier:E.identifier,isCW:E.isCW,point:P})})}),_.sort((E,N)=>E.point.x-N.point.x),_}function l(v,p,u,L,_){(_==null||_==="")&&(_="nonzero");let E=new _t;v.boundingBox.getCenter(E);let N=[new _t(u,E.y),new _t(L,E.y)],P=c(N,v.boundingBox,p);P.sort((et,xt)=>et.point.x-xt.point.x);let R=[],K=[];P.forEach(et=>{et.identifier===v.identifier?R.push(et):K.push(et)});let S=R[0].point.x,T=[],Z=0;for(;Z<K.length&&K[Z].point.x<S;)T.length>0&&T[T.length-1]===K[Z].identifier?T.pop():T.push(K[Z].identifier),Z++;if(T.push(v.identifier),_==="evenodd"){let et=T.length%2===0,xt=T[T.length-2];return{identifier:v.identifier,isHole:et,for:xt}}else if(_==="nonzero"){let et=!0,xt=null,O=null;for(let Y=0;Y<T.length;Y++){let nt=T[Y];et?(O=p[nt].isCW,et=!1,xt=nt):O!==p[nt].isCW&&(O=p[nt].isCW,et=!0)}return{identifier:v.identifier,isHole:et,for:xt}}else console.warn('fill-rule: "'+_+'" is currently not implemented.')}let h=999999999,d=-999999999,f=t.subPaths.map(v=>{let p=v.getPoints(),u=-999999999,L=999999999,_=-999999999,E=999999999;for(let N=0;N<p.length;N++){let P=p[N];P.y>u&&(u=P.y),P.y<L&&(L=P.y),P.x>_&&(_=P.x),P.x<E&&(E=P.x)}return d<=_&&(d=_+1),h>=E&&(h=E-1),{curves:v.curves,points:p,isCW:Be.isClockWise(p),identifier:-1,boundingBox:new un(new _t(E,L),new _t(_,u))}});f=f.filter(v=>v.points.length>1);for(let v=0;v<f.length;v++)f[v].identifier=v;let g=f.map(v=>l(v,f,h,d,t.userData?t.userData.style.fillRule:void 0)),x=[];return f.forEach(v=>{if(!g[v.identifier].isHole){let u=new tn;u.curves=v.curves,g.filter(_=>_.isHole&&_.for===v.identifier).forEach(_=>{let E=f[_.identifier],N=new hn;N.curves=E.curves,u.holes.push(N)}),x.push(u)}}),x}static getStrokeStyle(t,e,n,s,r){return t=t!==void 0?t:1,e=e!==void 0?e:"#000",n=n!==void 0?n:"miter",s=s!==void 0?s:"butt",r=r!==void 0?r:4,{strokeColor:e,strokeWidth:t,strokeLineJoin:n,strokeLineCap:s,strokeMiterLimit:r}}static pointsToStroke(t,e,n,s){let r=[],o=[],a=[];if(i.pointsToStrokeWithBuffers(t,e,n,s,r,o,a)===0)return null;let c=new en;return c.setAttribute("position",new Ye(r,3)),c.setAttribute("normal",new Ye(o,3)),c.setAttribute("uv",new Ye(a,2)),c}static pointsToStrokeWithBuffers(t,e,n,s,r,o,a,c){let l=new _t,h=new _t,d=new _t,f=new _t,g=new _t,x=new _t,v=new _t,p=new _t,u=new _t,L=new _t,_=new _t,E=new _t,N=new _t,P=new _t,R=new _t,K=new _t,S=new _t;n=n!==void 0?n:12,s=s!==void 0?s:.001,c=c!==void 0?c:0,t=Q(t);let T=t.length;if(T<2)return 0;let Z=t[0].equals(t[T-1]),et,xt=t[0],O,Y=e.strokeWidth/2,nt=1/(T-1),$=0,F,it,ct,ft,Mt=!1,st=0,I=c*3,C=c*2;b(t[0],t[1],l).multiplyScalar(Y),p.copy(t[0]).sub(l),u.copy(t[0]).add(l),L.copy(p),_.copy(u);for(let U=1;U<T;U++){et=t[U],U===T-1?Z?O=t[1]:O=void 0:O=t[U+1];let X=l;if(b(xt,et,X),d.copy(X).multiplyScalar(Y),E.copy(et).sub(d),N.copy(et).add(d),F=$+nt,it=!1,O!==void 0){b(et,O,h),d.copy(h).multiplyScalar(Y),P.copy(et).sub(d),R.copy(et).add(d),ct=!0,d.subVectors(O,xt),X.dot(d)<0&&(ct=!1),U===1&&(Mt=ct),d.subVectors(O,et),d.normalize();let W=Math.abs(X.dot(d));if(W>Number.EPSILON){let pt=Y/W;d.multiplyScalar(-pt),f.subVectors(et,xt),g.copy(f).setLength(pt).add(d),K.copy(g).negate();let D=g.length(),m=f.length();f.divideScalar(m),x.subVectors(O,et);let y=x.length();switch(x.divideScalar(y),f.dot(K)<m&&x.dot(K)<y&&(it=!0),S.copy(g).add(et),K.add(et),ft=!1,it?ct?(R.copy(K),N.copy(K)):(P.copy(K),E.copy(K)):lt(),e.strokeLineJoin){case"bevel":H(ct,it,F);break;case"round":dt(ct,it),ct?j(et,E,P,F,0):j(et,R,N,F,1);break;case"miter":case"miter-clip":default:let z=Y*e.strokeMiterLimit/D;if(z<1)if(e.strokeLineJoin!=="miter-clip"){H(ct,it,F);break}else dt(ct,it),ct?(x.subVectors(S,E).multiplyScalar(z).add(E),v.subVectors(S,P).multiplyScalar(z).add(P),M(E,F,0),M(x,F,0),M(et,F,.5),M(et,F,.5),M(x,F,0),M(v,F,0),M(et,F,.5),M(v,F,0),M(P,F,0)):(x.subVectors(S,N).multiplyScalar(z).add(N),v.subVectors(S,R).multiplyScalar(z).add(R),M(N,F,1),M(x,F,1),M(et,F,.5),M(et,F,.5),M(x,F,1),M(v,F,1),M(et,F,.5),M(v,F,1),M(R,F,1));else it?(ct?(M(u,$,1),M(p,$,0),M(S,F,0),M(u,$,1),M(S,F,0),M(K,F,1)):(M(u,$,1),M(p,$,0),M(S,F,1),M(p,$,0),M(K,F,0),M(S,F,1)),ct?P.copy(S):R.copy(S)):ct?(M(E,F,0),M(S,F,0),M(et,F,.5),M(et,F,.5),M(S,F,0),M(P,F,0)):(M(N,F,1),M(S,F,1),M(et,F,.5),M(et,F,.5),M(S,F,1),M(R,F,1)),ft=!0;break}}else lt()}else lt();!Z&&U===T-1&&A(t[0],L,_,ct,!0,$),$=F,xt=et,p.copy(P),u.copy(R)}if(!Z)A(et,E,N,ct,!1,F);else if(it&&r){let U=S,X=K;Mt!==ct&&(U=K,X=S),ct?(ft||Mt)&&(X.toArray(r,0),X.toArray(r,9),ft&&U.toArray(r,3)):(ft||!Mt)&&(X.toArray(r,3),X.toArray(r,9),ft&&U.toArray(r,0))}return st;function b(U,X,W){return W.subVectors(X,U),W.set(-W.y,W.x).normalize()}function M(U,X,W){r&&(r[I]=U.x,r[I+1]=U.y,r[I+2]=0,o&&(o[I]=0,o[I+1]=0,o[I+2]=1),I+=3,a&&(a[C]=X,a[C+1]=W,C+=2)),st+=3}function j(U,X,W,pt,D){l.copy(X).sub(U).normalize(),h.copy(W).sub(U).normalize();let m=Math.PI,y=l.dot(h);Math.abs(y)<1&&(m=Math.abs(Math.acos(y))),m/=n,d.copy(X);for(let z=0,mt=n-1;z<mt;z++)f.copy(d).rotateAround(U,m),M(d,pt,D),M(f,pt,D),M(U,pt,.5),d.copy(f);M(f,pt,D),M(W,pt,D),M(U,pt,.5)}function lt(){M(u,$,1),M(p,$,0),M(E,F,0),M(u,$,1),M(E,F,1),M(N,F,0)}function H(U,X,W){X?U?(M(u,$,1),M(p,$,0),M(E,F,0),M(u,$,1),M(E,F,0),M(K,F,1),M(E,W,0),M(P,W,0),M(K,W,.5)):(M(u,$,1),M(p,$,0),M(N,F,1),M(p,$,0),M(K,F,0),M(N,F,1),M(N,W,1),M(K,W,0),M(R,W,1)):U?(M(E,W,0),M(P,W,0),M(et,W,.5)):(M(N,W,1),M(R,W,0),M(et,W,.5))}function dt(U,X){X&&(U?(M(u,$,1),M(p,$,0),M(E,F,0),M(u,$,1),M(E,F,0),M(K,F,1),M(E,$,0),M(et,F,.5),M(K,F,1),M(et,F,.5),M(P,$,0),M(K,F,1)):(M(u,$,1),M(p,$,0),M(N,F,1),M(p,$,0),M(K,F,0),M(N,F,1),M(N,$,1),M(K,F,0),M(et,F,.5),M(et,F,.5),M(K,F,0),M(R,$,1)))}function A(U,X,W,pt,D,m){switch(e.strokeLineCap){case"round":D?j(U,W,X,m,.5):j(U,X,W,m,.5);break;case"square":if(D)l.subVectors(X,U),h.set(l.y,-l.x),d.addVectors(l,h).add(U),f.subVectors(h,l).add(U),pt?(d.toArray(r,3),f.toArray(r,0),f.toArray(r,9)):(d.toArray(r,3),d.toArray(r,9),f.toArray(r,0));else{l.subVectors(W,U),h.set(l.y,-l.x),d.addVectors(l,h).add(U),f.subVectors(h,l).add(U);let y=r.length;pt?(d.toArray(r,y-3),f.toArray(r,y-6),f.toArray(r,y-12)):(f.toArray(r,y-6),d.toArray(r,y-3),f.toArray(r,y-12))}break;case"butt":default:break}}function Q(U){let X=!1;for(let pt=1,D=U.length-1;pt<D;pt++)if(U[pt].distanceTo(U[pt+1])<s){X=!0;break}if(!X)return U;let W=[];W.push(U[0]);for(let pt=1,D=U.length-1;pt<D;pt++)U[pt].distanceTo(U[pt+1])>=s&&W.push(U[pt]);return W.push(U[U.length-1]),W}}};function E0({root:i,canvas:t,shape:e,palette:n,contactCard:s=null,fragments:r=4,onReady:o,autoplay:a=0,lateral:c=null,lift:l=0,scale:h=1,fit:d="window",pixelRatio:f=1.5,fps:g=0,object:x=!0,supersample:v=1}){let p=()=>Math.min(window.devicePixelRatio*v,f),u=()=>d==="canvas"?{width:Math.max(1,t.clientWidth),height:Math.max(1,t.clientHeight)}:{width:window.innerWidth,height:window.innerHeight},L=performance.now(),_={shapes:[e],palette:n,fragments:r},E=!0,N=e,P=e,R=!1,K=[],S=(k,J,G,ot)=>{k.addEventListener(J,G,ot),K.push([k,J,G,ot])},T=3.1,Z=.44,et={size:.042,thickness:.052},xt=E?T:2.9,O=E?Z:.5,Y=E?et:{size:.028,thickness:.038},nt=.006,$,F,it,ct,ft=[],Mt,st,I=[],C=[],b=new Hr,M=0,j=0,lt=0,H=i.querySelector(".scroll-stage"),dt=i.querySelector("[data-glass-after]"),A=s,Q,U,X=6,W=16,pt=30,D=.08,m=.06,y=0,z=0,mt=0,gt=0,ut=window.innerWidth/2,Ut=window.innerHeight/2,St=window.innerWidth/2,It=window.innerHeight/2,Bt,Ht,Kt={...Object.fromEntries(_.palette.map((k,J)=>[`uC${J}`,{value:new $t(k)}])),uTime:{value:0},uResolution:{value:new _t(window.innerWidth,window.innerHeight)},uMouse:{value:new _t(0,0)},uScroll:{value:0},uVelocity:{value:0}},Yt,Vt=450,zt=[],Lt=u(),Nt=(k=0,J=0)=>new _t(k,J),re=(k,J)=>k.x*J.y-k.y*J.x,ae=yn.lerp;function ne(){let k=document.createElement("canvas");k.width=16,k.height=16;let J=k.getContext("2d"),G=J.createRadialGradient(8,8,0,8,8,8);return G.addColorStop(0,"rgba(255, 255, 255, 1)"),G.addColorStop(.25,"rgba(255, 255, 255, 0.85)"),G.addColorStop(.6,"rgba(255, 255, 255, 0.3)"),G.addColorStop(1,"rgba(0, 0, 0, 0)"),J.fillStyle=G,J.fillRect(0,0,16,16),new Pr(k)}function Et(){let k=new en,J=new Float32Array(Vt*3),G=new Float32Array(Vt*3);for(let ht=0;ht<Vt;ht++){let bt=(Math.random()-.5)*6.5,Ct=(Math.random()-.5)*5-.5,Pt=(Math.random()-.5)*6.5;J[ht*3]=bt,J[ht*3+1]=Ct,J[ht*3+2]=Pt,Math.random()<.6?(G[ht*3]=.82+Math.random()*.18,G[ht*3+1]=.9+Math.random()*.1,G[ht*3+2]=1):(G[ht*3]=.78+Math.random()*.12,G[ht*3+1]=.5+Math.random()*.15,G[ht*3+2]=1),zt.push({speedX:(Math.random()-.5)*.4,speedY:.15+Math.random()*.3,speedZ:(Math.random()-.5)*.4,swaySpeed:.5+Math.random()*1.5,swayRadius:.05+Math.random()*.15,phase:Math.random()*Math.PI*2})}k.setAttribute("position",new qe(J,3)),k.setAttribute("color",new qe(G,3));let ot=new xs({size:.025,vertexColors:!0,transparent:!0,opacity:.4,blending:or,depthWrite:!1,map:ne()});Yt=new Cr(k,ot),$.add(Yt)}function B(){let k=new _s;k.background=new $t("#080b10");let J=[[2.8,8,-4,2,3,"#ffffff",2.6],[.65,7,3,1,2,"#dceeff",4],[5,.7,0,5,-1,"#ffffff",3.5],[.5,6,-2,0,-4,"#a78bfa",3],[1,5,3,-1,-3,"#ffc2e0",2.4],[4,.35,0,-3,3,"#92bbff",3],[.16,5,-3,0,2,"#ffffff",5],[.35,4,4,0,-2,"#ffb36b",2]];for(let[ht,bt,Ct,Pt,vt,wt,Xt]of J){let ie=new Fe(new qi(ht,bt),new Wi({color:new $t(wt).multiplyScalar(Xt),side:an}));ie.position.set(Ct,Pt,vt),ie.lookAt(0,0,0),k.add(ie)}let G=new Yi(it),ot=G.fromScene(k,.025,.1,100);$.environment=ot.texture,k.traverse(ht=>{ht.isMesh&&(ht.geometry.dispose(),ht.material.dispose())}),G.dispose()}function At(){let k=new Or({color:"#fafcff",metalness:0,roughness:.025,transmission:1,thickness:.48,ior:1.46,attenuationColor:new $t("#edf7ff"),attenuationDistance:8,clearcoat:.65,clearcoatRoughness:.018,iridescence:.6,iridescenceIOR:1.3,iridescenceThicknessRange:[100,420],envMapIntensity:1.1,side:an});return k.onBeforeCompile=J=>{J.uniforms.uChromaticSpread={value:.018},J.fragmentShader=`uniform float uChromaticSpread;
`+J.fragmentShader;let G=ee.transmission_fragment.replace(/vec4 transmitted = getIBLVolumeRefraction\([\s\S]*?\);/,`// Keep the front faces clear, with spectral accents on grazing edges.
            float chromaticSpread = uChromaticSpread * mix(0.35, 1.0,
                smoothstep(0.15, 0.85, 1.0 - abs(dot(n, v))));
            vec4 transmitted = getIBLVolumeRefraction(
                n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
                material.attenuationColor, material.attenuationDistance );
            vec4 transmittedRed = getIBLVolumeRefraction(
                n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                pos, modelMatrix, viewMatrix, projectionMatrix, material.ior - chromaticSpread, material.thickness,
                material.attenuationColor, material.attenuationDistance );
            vec4 transmittedBlue = getIBLVolumeRefraction(
                n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                pos, modelMatrix, viewMatrix, projectionMatrix, material.ior + chromaticSpread, material.thickness,
                material.attenuationColor, material.attenuationDistance );
            transmitted = vec4(transmittedRed.r, transmitted.g, transmittedBlue.b,
                (transmittedRed.a + transmitted.a + transmittedBlue.a) / 3.0);`);J.fragmentShader=J.fragmentShader.replace("#include <transmission_fragment>",G)},k.customProgramCacheKey=()=>"apple-clear-glass-edge-dispersion-v1",k}function Rt(k,J=1e-4){let G=[];for(let ht of k)(!G.length||G[G.length-1].distanceTo(ht)>J)&&G.push(ht.clone());for(;G.length>1&&G[0].distanceTo(G[G.length-1])<=J;)G.pop();let ot=G.filter((ht,bt)=>{let Ct=G[(bt-1+G.length)%G.length],Pt=G[(bt+1)%G.length];return Math.abs(re(ht.clone().sub(Ct),Pt.clone().sub(ht)))>1e-7});return Be.isClockWise(ot)&&ot.reverse(),ot}function Wt(k,J){let G=k.map(ot=>ot.clone());for(let{origin:ot,normal:ht}of J){let bt=[];for(let Ct=0;Ct<G.length;Ct++){let Pt=G[Ct],vt=G[(Ct+1)%G.length],wt=Pt.clone().sub(ot).dot(ht),Xt=vt.clone().sub(ot).dot(ht);wt>=0&&bt.push(Pt),wt>=0!=Xt>=0&&bt.push(Pt.clone().lerp(vt,wt/(wt-Xt)))}if(G=bt,!G.length)break}return Rt(G)}function kt(k,J,G){let ot=Ct=>Nt(Math.cos(yn.degToRad(Ct)),Math.sin(yn.degToRad(Ct))),ht=ot(J),bt=ot(G);return[{origin:k,normal:Nt(-ht.y,ht.x)},{origin:k,normal:Nt(bt.y,-bt.x)}]}function oe(k){let J=new un().setFromPoints(k).getCenter(Nt());return{contour:k.map(G=>G.clone().sub(J)),home:new V(J.x,J.y,0)}}function ce(k,J,G){let ot=new tn(I);if(G>.02)for(let bt of C){let Ct=new un().setFromPoints(bt).getCenter(Nt());ot.holes.push(new hn(bt.map(Pt=>Pt.clone().sub(Ct).multiplyScalar(G).add(Ct))))}let ht=new hi(ot,{depth:O,steps:1,bevelEnabled:!0,bevelSize:k,bevelThickness:J,bevelSegments:6,curveSegments:24});return ht.translate(0,0,-O/2),ht}function ge(k,J,G,ot){let ht=new hi(new tn(k),{depth:J,steps:1,bevelEnabled:!0,bevelSize:G,bevelThickness:ot,bevelSegments:6,curveSegments:24});return ht.translate(0,0,-J/2),ht}function De(k,J){let G=vt=>{let wt=vt.filter((se,Ot)=>Ot===0||se.distanceToSquared(vt[Ot-1])>1e-12);wt[0].distanceToSquared(wt[wt.length-1])<1e-12&&wt.pop(),Be.isClockWise(wt)&&wt.reverse();let Xt=[Nt(-10,-10),Nt(10,-10),Nt(10,10),Nt(-10,10)];for(let se=0;se<wt.length;se++){let Ot=wt[se],Me=wt[(se+1)%wt.length].clone().sub(Ot),Re=[];for(let ve=0;ve<Xt.length;ve++){let Ce=Xt[ve],Oe=Xt[(ve+1)%Xt.length],ye=re(Me,Ce.clone().sub(Ot)),Je=re(Me,Oe.clone().sub(Ot));ye>=-1e-10&&Re.push(Ce),ye>=0!=Je>=0&&Re.push(Ce.clone().lerp(Oe,ye/(ye-Je)))}Xt=Re}if(!Xt.length)throw new Error("Contour has no visibility kernel.");let ie=Xt.reduce((se,Ot)=>se.add(Ot),Nt()).multiplyScalar(1/Xt.length);return{contour:wt,center:ie}},ot=G(k),ht=G(J),bt=(vt,wt)=>(Math.atan2(vt.y-wt.y,vt.x-wt.x)+Math.PI*2)%(Math.PI*2),Ct=[...ot.contour.map(vt=>bt(vt,ot.center)),...ht.contour.map(vt=>bt(vt,ht.center)),...Array.from({length:32},(vt,wt)=>wt/32*Math.PI*2)].sort((vt,wt)=>vt-wt).filter((vt,wt,Xt)=>wt===0||vt-Xt[wt-1]>1e-8),Pt=({contour:vt,center:wt},Xt)=>{let ie=Nt(Math.cos(Xt),Math.sin(Xt)),se=1/0;for(let Ot=0;Ot<vt.length;Ot++){let Me=vt[Ot],Re=vt[(Ot+1)%vt.length].clone().sub(Me),ve=re(ie,Re);if(Math.abs(ve)<1e-12)continue;let Ce=Me.clone().sub(wt),Oe=re(Ce,Re)/ve,ye=re(Ce,ie)/ve;Oe>=0&&ye>=-1e-8&&ye<=1+1e-8&&(se=Math.min(se,Oe))}if(!isFinite(se))throw new Error("Ray missed the contour.");return wt.clone().addScaledVector(ie,se)};return Ct.map(vt=>({source:Pt(ot,vt),target:Pt(ht,vt)}))}function le(k,J,G=160){let ot=vt=>{let wt=[0];for(let Ot=0;Ot<vt.length;Ot++)wt.push(wt[Ot]+vt[Ot].distanceTo(vt[(Ot+1)%vt.length]));let Xt=wt[vt.length],ie=[],se=0;for(let Ot=0;Ot<G;Ot++){let Me=Ot/G*Xt;for(;se<vt.length-1&&wt[se+1]<Me;)se++;let Re=vt[se],ve=vt[(se+1)%vt.length],Ce=wt[se+1]-wt[se];ie.push(Re.clone().lerp(ve,Ce>0?(Me-wt[se])/Ce:0))}return ie},ht=ot(k),bt=ot(J),Ct=0,Pt=1/0;for(let vt=0;vt<G;vt++){let wt=0;for(let Xt=0;Xt<G;Xt++)wt+=ht[Xt].distanceToSquared(bt[(Xt+vt)%G]);wt<Pt&&(Pt=wt,Ct=vt)}return ht.map((vt,wt)=>({source:vt,target:bt[(wt+Ct)%G]}))}function Ne(k,J,G){try{return De(k,J)}catch(ot){return console.warn(`[glass] radial morph unavailable for "${G}" (${ot.message}); using arc-length matching.`),le(k,J)}}function nn(k,J){let G=!1;for(let ot=0,ht=J.length-1;ot<J.length;ht=ot++){let bt=J[ot],Ct=J[ht];bt.y>k.y!=Ct.y>k.y&&k.x<(Ct.x-bt.x)*(k.y-bt.y)/(Ct.y-bt.y)+bt.x&&(G=!G)}return G}function Ki(k){let G=new qr().parse(k).paths.flatMap(Pt=>Pt.subPaths.map(vt=>Rt(vt.getPoints(6).map(wt=>Nt(wt.x,-wt.y))))).filter(Pt=>Pt.length>=3&&Math.abs(Be.area(Pt))>1e-9).sort((Pt,vt)=>Math.abs(Be.area(vt))-Math.abs(Be.area(Pt)));if(!G.length)throw new Error("This SVG has no closed contour.");let[ot,...ht]=G,bt=[],Ct=[];for(let Pt of ht){let vt=new un().setFromPoints(Pt).getCenter(Nt());(nn(vt,ot)?bt:Ct).push(Pt)}return{outline:ot,holes:bt,extras:Ct}}function Ts(k,J){let G=new un().setFromPoints([k.outline,...k.holes,...k.extras].flat()),ot=G.getCenter(Nt()),ht=G.getSize(Nt()),bt=J/Math.max(ht.x,ht.y),Ct=Pt=>Pt.map(vt=>vt.clone().sub(ot).multiplyScalar(bt));return{outline:Ct(k.outline),holes:k.holes.map(Ct),extras:k.extras.map(Ct)}}function pi(k){let J=k.slice();Be.isClockWise(J)&&J.reverse();let G=new un().setFromPoints(J).getSize(Nt()).length()*2+1,ot=[Nt(-G,-G),Nt(G,-G),Nt(G,G),Nt(-G,G)];for(let ht=0;ht<J.length;ht++){let bt=J[ht],Ct=J[(ht+1)%J.length].clone().sub(bt),Pt=[];for(let vt=0;vt<ot.length;vt++){let wt=ot[vt],Xt=ot[(vt+1)%ot.length],ie=re(Ct,wt.clone().sub(bt)),se=re(Ct,Xt.clone().sub(bt));ie>=-1e-10&&Pt.push(wt),ie>=0!=se>=0&&Pt.push(wt.clone().lerp(Xt,ie/(ie-se)))}if(ot=Pt,!ot.length)return[]}return ot}function Ls(k,J){if(J<=1)return[k];let G=new un().setFromPoints(k).getCenter(Nt()),ot=360/J,ht=null;for(let bt=0;bt<ot-.001;bt+=5){let Ct=[],Pt=1/0;for(let vt=0;vt<J;vt++){let wt=Wt(k,kt(G,bt+vt*ot,bt+(vt+1)*ot));if(wt.length<3){Pt=-1;break}let Xt=pi(wt),ie=Xt.length?Math.abs(Be.area(Xt))/Math.abs(Be.area(wt)):0;Pt=Math.min(Pt,ie),Ct.push(wt)}Pt>=0&&(!ht||Pt>ht.worst)&&(ht={worst:Pt,pieces:Ct})}if(!ht)throw new Error(`Could not split this shape into ${J} fragments.`);return ht.worst===0&&console.warn("[glass] a fragment has no visibility kernel; using arc-length morphing there."),ht.pieces}function $n(k,J){let G=Math.max(1,J-k.extras.length),ot=k.extras.map(Ct=>Object.assign(Ct.slice(),{isExtra:!0})),ht=[...Ls(k.outline,G),...ot].slice(0,Math.max(1,J)),bt=Ct=>{let Pt=new un().setFromPoints(Ct).getCenter(Nt());return(Math.atan2(Pt.y,Pt.x)+Math.PI*2)%(Math.PI*2)};return ht.sort((Ct,Pt)=>bt(Ct)-bt(Pt))}function As(){B(),ct=new Dn,ct.position.y=-.3,ct.visible=x,$.add(ct);let k=At(),J=new Dn;J.rotation.set(-.08,.28,-.08),ct.add(J);let G=Ts(Ki(N),T),ot=Ts(Ki(P),xt);I=ot.outline,C=ot.holes;let ht=oe(G.outline),bt=new tn(ht.contour),Ct=Nt(ht.home.x,ht.home.y);for(let Xt of G.holes)bt.holes.push(new hn(Xt.map(ie=>ie.clone().sub(Ct))));let Pt=new hi(bt,{depth:Z,steps:1,bevelEnabled:!0,bevelSize:et.size,bevelThickness:et.thickness,bevelSegments:6,curveSegments:24});Pt.translate(0,0,-Z/2),Mt=new Fe(Pt,k),Mt.position.copy(ht.home),J.add(Mt),st=new Fe(ce(nt,nt,0),k),st.userData.progress=-1,st.visible=!1,J.add(st);let vt=$n(G,_.fragments),wt=$n(ot,vt.length);vt.forEach((Xt,ie)=>{let se=!!Xt.isExtra,Ot=oe(Xt),Me=oe(wt[Math.min(ie,wt.length-1)]),Re=ge(Ot.contour,Z,et.size,et.thickness),ve=new Fe(Re,k);ve.position.copy(Ot.home),J.add(ve);let Ce=Nt(Ot.home.x,Ot.home.y);Ce.lengthSq()<1e-6&&Ce.set(Math.cos(ie),Math.sin(ie));let Oe=new V(Ce.x,Ce.y,0).normalize().multiplyScalar(1.15);Oe.z=(ie%2===0?1:-1)*.55;let ye=Math.sign(Oe.x)||1,Je=Math.sign(Oe.y)||1;ft.push({name:`fragment-${ie}`,mesh:ve,home:Ot.home,offset:Oe,twist:new V(Je*.12,ye*.18,-ye*Je*.09),targetHome:Me.home,correspondence:Ne(Ot.contour,Me.contour,`fragment-${ie}`),originalGeometry:Re,morphGeometry:null,isBody:!se,finalGeometry:se?ge(Me.contour,O,Y.size,Y.thickness):null,targetContour:se?Me.contour:null,extraBevel:-1})})}function Rs(k,J,G){let ot=new tn,ht=-k/2,bt=-J/2;return ot.moveTo(ht+G,bt),ot.lineTo(ht+k-G,bt),ot.absarc(ht+k-G,bt+G,G,-Math.PI/2,0,!1),ot.lineTo(ht+k,bt+J-G),ot.absarc(ht+k-G,bt+J-G,G,0,Math.PI/2,!1),ot.lineTo(ht+G,bt+J),ot.absarc(ht+G,bt+J-G,G,Math.PI/2,Math.PI,!1),ot.lineTo(ht,bt+G),ot.absarc(ht+G,bt+G,G,Math.PI,Math.PI*1.5,!1),ot}function Yr(){return 2*X*Math.tan(yn.degToRad(F.fov/2))/Lt.height}function Cs(k,J,G){let ot=W*G,ht=Math.max(ot+.002,pt*G),bt=Rs(k-2*ot,J-2*ot,ht-ot),Ct=new hi(bt,{depth:D,steps:1,bevelEnabled:!0,bevelSize:ot,bevelThickness:m,bevelSegments:10,curveSegments:18});return Ct.translate(0,0,-(D+m)),Ct}function Zr(){A&&(U=At(),U.side=Sn,U.color.set("#9ea6b8"),U.roughness=.34,U.thickness=.35,U.attenuationColor.set("#2b1f2f"),U.attenuationDistance=1.8,U.clearcoat=1,U.clearcoatRoughness=.14,U.iridescence=.18,U.envMapIntensity=.55,Q=new Fe(Cs(1,1,1),U),Q.userData={w:0,h:0},Q.visible=!1,F.add(Q),i.classList.add("has-glass-card"))}function w(){if(!Q||!A||(Q.visible=lt>.001,!Q.visible))return;let k=A.getBoundingClientRect(),J=Yr(),G=k.width*J,ot=k.height*J;(Math.abs(Q.userData.w-G)>.003||Math.abs(Q.userData.h-ot)>.003)&&(Q.geometry.dispose(),Q.geometry=Cs(G,ot,J),Q.userData={w:G,h:ot});let ht=k.left+k.width/2-Lt.width/2,bt=Lt.height/2-(k.top+k.height/2);Q.position.set(ht*J,bt*J,-X),Q.rotation.set(-z*.02,y*.025,0)}function q(){let k=H?H.offsetTop+H.offsetHeight:document.documentElement.scrollHeight;return Math.max(1,k-window.innerHeight)}function tt(k,J,G){let ot=yn.clamp((k-J)/(G-J),0,1);return ot*ot*ot*(ot*(ot*6-15)+10)}function at(k){let J=Lt.width/Lt.height,G=yn.clamp((1-J)/.2,0,1),ot=rt(k),ht=tt(k,.4,.54),bt=4.7-Math.sin(k*Math.PI)*.6+ot*2.6+ht*.9,Ct=8.9-Math.sin(k*Math.PI)*.4+ot*2+ht*.4,Pt=ae(bt,Ct,G),vt=1-tt(k,.12,.24),wt=tt(k,.12,.24)-tt(k,.4,.5),Xt=tt(k,.52,.62)-tt(k,.74,.86),ie=tt(k,.74,.86),se=(c??-1.5*vt+1.5*wt-1.8*Xt-1.4*ie)*(1-G),Ot=1-2*tt(k,.16,.26)+2*tt(k,.44,.54)-2*tt(k,.72,.82),Me=2*Pt*Math.tan(yn.degToRad(F.fov/2)),Re=-.15+l+G*Ot*(Ot>0?.2:.19)*Me,ve=k*Math.PI*2,Ce=new V(Math.cos(ve),0,-Math.sin(ve)),Oe=new V(0,Re,0).addScaledVector(Ce,se);return{radius:Pt,lookAt:Oe,portrait:G}}function rt(k){return tt(k,.12,.28)*(1-tt(k,.4,.54))}function Dt(k,J,G){let ot=k.geometryCache||(k.geometryCache=new Map),ht=ot.get(J);if(ht?ot.delete(J):ht=G(),ot.set(J,ht),ot.size>24){let bt=ot.keys().next().value;ot.get(bt).dispose(),ot.delete(bt)}return ht}let Ft=k=>Math.round(k*96)/96;function Gt(k){let J=rt(k),G=tt(k,.4,.54),ot=Ft(G),ht=G>=1,bt=J<=0&&G<=0;if(Mt&&(Mt.visible=bt),st&&(st.visible=ht,ht)){let Ct=Ft(tt(k,.54,.56)),Pt=Ft(tt(k,.54,.6)),vt=`${Ct}:${Pt}`;vt!==st.userData.progress&&(st.geometryCache||st.geometry.dispose(),st.geometry=Dt(st,vt,()=>ce(ae(nt,Y.size,Ct),ae(nt,Y.thickness,Ct),Pt)),st.userData.progress=vt)}for(let Ct of ft){let{mesh:Pt,home:vt,targetHome:wt,offset:Xt,twist:ie,correspondence:se}=Ct;if(Pt.visible=Ct.isBody?!ht&&!bt:!0,Pt.position.copy(vt).lerp(wt,G).addScaledVector(Xt,J),Pt.rotation.set(ie.x*J,ie.y*J,ie.z*J),!!Pt.visible)if(!Ct.isBody&&ht){let Ot=Ft(tt(k,.54,.56));Pt.geometry=Ot>=1?Ct.finalGeometry:Dt(Ct,`extra:${Ot}`,()=>ge(Ct.targetContour,O,ae(nt,Y.size,Ot),ae(nt,Y.thickness,Ot)))}else G<=0?Pt.geometry=Ct.originalGeometry:Pt.geometry=Dt(Ct,`morph:${ot}`,()=>{let Ot=se.map(({source:Me,target:Re})=>Me.clone().lerp(Re,ot));return ge(Ot,ae(Z,O,ot),ae(et.size,nt,ot),ae(et.thickness,nt,ot))})}}function qt(){let k=`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,J=`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform float uScroll;
        uniform float uVelocity;

        mat2 rotate2d(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
        float fineLine(float d, float width) {
            return 1.0 - smoothstep(width, width + 1.5 / uResolution.y, abs(d));
        }
        // Five brand colours, one per chapter, set from SITE.palette.
        uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4;
        vec3 chapterColor(float progress) {
            if (progress < 0.34) return mix(uC0, uC1, smoothstep(0.02, 0.32, progress));
            if (progress < 0.62) return mix(uC1, uC2, smoothstep(0.36, 0.60, progress));
            if (progress < 1.0) return mix(uC2, uC3, smoothstep(0.66, 0.94, progress));
            return mix(uC3, uC4, smoothstep(1.0, 1.2, progress));
        }
        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
            float s = uScroll;
            float time = uTime * 0.065;
            vec3 primary = chapterColor(s);
            vec3 secondary = chapterColor(min(1.22, s + 0.18));
            vec3 color = vec3(0.003, 0.005, 0.010);

            // Two restrained volumes supply depth without washing out the black stage.
            vec2 haloUv = (uv - vec2(0.16 + 0.16 * sin(s * 4.0), 0.14)) * vec2(1.20, 1.8);
            float halo = exp(-dot(haloUv, haloUv) * 2.8);
            vec2 lowerUv = (uv + vec2(0.40, 0.30)) * vec2(1.6, 2.6);
            color += primary * halo * 0.13;
            color += secondary * exp(-dot(lowerUv, lowerUv) * 2.0) * 0.04;

            vec2 p = rotate2d(-0.24 + s * 0.65) * (uv - vec2(0.06, -0.08));
            p += uMouse * 0.018;
            p.x += 0.15 * sin(p.y * 2.8 + s * 4.8 + time * 0.3);
            p.y += 0.09 * cos(p.x * 3.1 - s * 3.8 - time * 0.2);

            // Three broad sculptural folds, spaced apart, with thin polished edges.
            for (int i = 0; i < 3; i++) {
                float k = float(i);
                vec2 q = p + vec2(0.0, 0.012 * sin(time + k));
                float radius = length(q * vec2(0.90, 1.22));
                float angle = atan(q.y, q.x);
                float contour = 0.34 + k * 0.145
                    + 0.075 * sin(angle * 2.0 + s * 5.0 + k * 0.28)
                    + 0.022 * cos(angle * 3.0 - time);
                float d = radius - contour;
                float arc = smoothstep(-0.65, 0.65, sin(angle + k * 0.55 + s * 3.5));
                vec3 tint = mix(primary, secondary, k * 0.38);
                float body = exp(-pow(d * 25.0, 2.0));
                float shoulder = exp(-pow((d + 0.018) * 13.0, 2.0));
                color += tint * (body * 0.10 + shoulder * 0.025) * arc;
                color += mix(tint, vec3(0.72, 0.82, 0.94), 0.20)
                    * fineLine(d, 0.0008) * arc * (0.16 + uVelocity * 0.06);
            }

            // A barely visible peripheral lattice: no scanning beam or dotted overlay.
            vec2 gridUv = rotate2d(-0.20 + s * 0.18) * uv + vec2(s * 0.08, s * 0.16);
            vec2 cell = abs(fract(gridUv * 10.0) - 0.5);
            float grid = max(fineLine((0.5 - cell.x) / 10.0, 0.0002), fineLine((0.5 - cell.y) / 10.0, 0.0002));
            float periphery = smoothstep(0.28, 0.80, length(uv));
            color += primary * grid * periphery * 0.025;

            float vignette = 1.0 - smoothstep(0.36, 1.20, length(uv * vec2(0.8, 1.0)));
            color *= mix(0.25, 1.0, vignette);
            float textShade = (1.0 - smoothstep(-0.5, 0.1, uv.y)) * (1.0 - smoothstep(-0.25, 0.3, uv.x));
            color *= 1.0 - textShade * 0.38;
            gl_FragColor = vec4(color, 1.0);
        }
    `;Bt=new _n({vertexShader:k,fragmentShader:J,uniforms:Kt,depthWrite:!1,depthTest:!1});let G=new qi(30,30);Ht=new Fe(G,Bt),Ht.position.set(0,0,-8),Ht.renderOrder=-10,F.add(Ht)}function Qt(){Object.assign(Lt,u()),F.aspect=Lt.width/Lt.height,F.updateProjectionMatrix(),it.setSize(Lt.width,Lt.height,d!=="canvas"),it.setPixelRatio(p()),Kt&&it.getDrawingBufferSize(Kt.uResolution.value)}S(window,"mousemove",k=>{ut=k.clientX,Ut=k.clientY;let J=i.querySelector(".cursor-inner");J&&(J.style.left=`${ut}px`,J.style.top=`${Ut}px`),mt=k.clientX/window.innerWidth*2-1,gt=k.clientY/window.innerHeight*2-1,i.classList.remove("cursor-hidden")}),S(document,"mouseover",k=>{let J=k.target instanceof Element?k.target:null;i.classList.toggle("cursor-hover",!!(J&&J.closest("a, button"))),i.classList.toggle("cursor-text",!!(J&&J.closest("input, textarea")))}),S(document.documentElement,"mouseleave",()=>i.classList.add("cursor-hidden"));let Zt="";function jt(){let k=i.querySelector(".cursor-label");if(!k)return;k.style.left=`${St}px`,k.style.top=`${It}px`;let J=lt>.02?"CONTACT":String(Math.round(M*100)).padStart(3,"0");J!==Zt&&(k.textContent=J,Zt=J)}S(window,"resize",()=>{Qt(),te.chapter=-1,de()});function de(){i.querySelectorAll(".slide-title").forEach(k=>{k.style.fontSize="";let J=[...k.querySelectorAll(".line-inner")];if(!J.length)return;let G=Math.max(...J.map(ht=>{let bt=document.createRange();return bt.selectNodeContents(ht),bt.getBoundingClientRect().width})),ot=k.clientWidth;if(G>ot&&ot>0){let ht=parseFloat(getComputedStyle(k).fontSize);k.style.fontSize=`${Math.floor(ht*ot/G*.985)}px`}})}let Ee=0,_e=0,Ke=performance.now();for(let k of["scroll","pointermove","pointerdown","keydown","resize"])S(window,k,()=>{Ke=performance.now()},{passive:!0});S(document,"visibilitychange",()=>{cancelAnimationFrame(Ee),Ee=0,!document.hidden&&!R&&(b.getDelta(),_e=0,Ke=performance.now(),Ee=requestAnimationFrame(ue))});function ue(k=performance.now()){if(document.hidden||R)return;Ee=requestAnimationFrame(ue);let J=Math.abs(yn.clamp(window.scrollY/q(),0,1)-M)>1e-4||Math.abs(lt-j)>1e-4,G=g||(J||k-Ke<1500?60:30);if(_e&&k-_e<1e3/G-1)return;_e=k;let ot=Math.min(b.getDelta(),.1),ht=Ot=>1-Math.pow(1-Ot,ot*60),bt=q(),Ct=window.scrollY!==void 0?window.scrollY:window.pageYOffset!==void 0?window.pageYOffset:document.documentElement.scrollTop,Pt=a?(k-L)/1e3%a/a:yn.clamp(Ct/bt,0,1);lt=dt?yn.clamp((Ct-bt)/window.innerHeight,0,1):0,a?M=Pt:M+=(Pt-M)*ht(.025),j+=(lt-j)*ht(.06),Math.abs(lt-j)<.0015&&(j=lt),y+=(mt-y)*ht(.05),z+=(gt-z)*ht(.05),St+=(ut-St)*ht(.2),It+=(Ut-It)*ht(.2);let vt=i.querySelector(".cursor-outer");if(vt&&(vt.style.left=`${St}px`,vt.style.top=`${It}px`),jt(),ct){let Ot=tt(j,0,.85);ct.rotation.y=y*.25+Ot*1.35,ct.rotation.x=z*.15-Ot*.35,ct.rotation.z=Ot*.55,ct.position.set(-Ot*3.4,-.3+Ot*4.8,-Ot*1.2),ct.scale.setScalar(h*(1-Ot*.5))}if(Yt){let Ot=Yt.geometry.attributes.position.array,Me=b.getElapsedTime(),Re=Math.abs(Pt-M),ve=1+Re*9,Ce=Re*.8;for(let Oe=0;Oe<Vt;Oe++){let ye=Oe*3,Je=zt[Oe];Ot[ye]+=Je.speedX*ot*ve,Ot[ye+1]+=Je.speedY*ot*ve,Ot[ye+2]+=Je.speedZ*ot*ve;let Io=Je.swayRadius*(1+Ce*4);Ot[ye]+=Math.sin(Me*Je.swaySpeed+Je.phase)*Io*ot,Ot[ye+2]+=Math.cos(Me*Je.swaySpeed+Je.phase)*Io*ot,(Ot[ye+1]>3||Math.abs(Ot[ye])>3.5||Math.abs(Ot[ye+2])>3.5)&&(Ot[ye+1]=-2.5,Ot[ye]=(Math.random()-.5)*3,Ot[ye+2]=(Math.random()-.5)*3)}Yt.geometry.attributes.position.needsUpdate=!0}let wt=at(M),Xt=M*Math.PI*2,ie=.35+Math.sin(M*Math.PI)*.8,se=new V(wt.radius*Math.sin(Xt),ie,wt.radius*Math.cos(Xt));F.position.lerp(se,ht(.025)),F.lookAt(wt.lookAt),w(),Kt&&(Kt.uTime.value=b.getElapsedTime(),Kt.uMouse.value.set(y,-z),Kt.uScroll.value=a?1-Math.abs(2*M-1):M+j*.22,Kt.uVelocity.value+=(Math.min(1,Math.abs(Pt-M)*14)-Kt.uVelocity.value)*ht(.06)),Gt(M),Qi(M),ji(M),es(),it.render($,F)}let te={chapter:-1};function ji(k){let J=lt>.02?4:k<.2?0:k<.48?1:k<.76?2:3;if(J===te.chapter)return;te.chapter=J;let G=i.querySelector("[data-chapter]");G&&(G.textContent=String(J+1).padStart(2,"0")),i.querySelectorAll("[data-goto]").forEach((ot,ht)=>ot.classList.toggle("is-active",ht===J))}let fe=[[-.1,.15],[.26,.43],[.54,.71],[.82,1.05]],En=1500,Ps=400,Kn=fe.map(()=>({active:!1,since:0,left:0}));function Qi(k){let J=[...i.querySelectorAll("[data-slide]")];for(let vt=1;vt<=4;vt++){let wt=i.querySelector(`[data-dash="${vt}"]`);if(wt){let Xt=(vt-1)*.25,ie=vt*.25,se=(k-Xt)/(ie-Xt);se=Math.max(0,Math.min(1,se)),wt.style.height=`${se*100}%`}}let G=performance.now(),ot=!1,ht=lt>.02,Ct=fe.map(([vt,wt])=>!ot&&!ht&&k>=vt&&k<=wt).indexOf(!0),Pt=Kn.map((vt,wt)=>Ct===wt?(vt.active||(vt.since=G),vt.active=!0,vt.left=0,!0):vt.active&&Ct===-1&&!ht&&!ot&&(vt.left||(vt.left=G),G-vt.since<En||G-vt.left<Ps)?!0:(vt.active=!1,vt.left=0,!1));J.forEach((vt,wt)=>{vt&&vt.classList.toggle("active",Pt[wt])}),ts(Pt[3])}let we=!1,vn=!1;function ts(k){let J=i.querySelectorAll(".figure-value");if(!J.length||k===vn)return;if(vn=k,!k){J.forEach(Ct=>{Ct.textContent=0 .toFixed(Number(Ct.dataset.decimals||0))});return}let G=performance.now(),ot=1400,ht=Symbol("figures");we=ht;let bt=Ct=>{if(we!==ht)return;let Pt=Math.min(1,(Ct-G)/ot),vt=1-Math.pow(1-Pt,4);J.forEach(wt=>{let Xt=Number(wt.dataset.count||0),ie=Number(wt.dataset.decimals||0);wt.textContent=(Xt*vt).toFixed(ie)}),Pt<1&&requestAnimationFrame(bt)};requestAnimationFrame(bt)}function Ze(){i.querySelectorAll("[data-goto]").forEach(k=>{S(k,"click",J=>{let G=k.getAttribute("data-goto"),ot=G==="after"&&dt?dt.getBoundingClientRect().top+window.scrollY:q()*Number(G);J.preventDefault(),window.scrollTo({top:ot,behavior:"smooth"})})})}function es(){dt&&i.classList.toggle("contact-open",lt>.02)}let Jr=window.__glassSite={snap(k){window.scrollTo({top:q()*k,behavior:"instant"}),M=k,j=lt=0;let J=k*Math.PI*2,{radius:G}=at(k);F&&F.position.set(G*Math.sin(J),.35+Math.sin(k*Math.PI)*.8,G*Math.cos(J))},snapContact(k){window.scrollTo({top:q()+window.innerHeight*k,behavior:"instant"}),M=1,j=lt=k,this.snap(1),window.scrollTo({top:q()+window.innerHeight*k,behavior:"instant"}),j=lt=k},get scroll(){return M},get contact(){return j},get pieces(){return ft.map(k=>({name:k.name,points:k.correspondence.length}))}};function Is(){de(),$=new _s,$.background=new $t("#000000"),$.fog=new Rr("#000000",.01),F=new Ve(50,Lt.width/Lt.height,.1,100),F.position.set(0,.2,3),$.add(F),qt(),it=new gs({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),it.setSize(Lt.width,Lt.height,d!=="canvas"),it.setPixelRatio(p()),it.shadowMap.enabled=!0,it.shadowMap.type=So,it.toneMapping=bo,it.toneMappingExposure=2.2;let k=new kr("#ffffff",.1);$.add(k);let J=new zr("#ffffff",18);J.position.set(4,6,3),J.angle=Math.PI/4,J.penumbra=.9,J.castShadow=!0,J.shadow.mapSize.width=2048,J.shadow.mapSize.height=2048,J.shadow.camera.near=1,J.shadow.camera.far=15,J.shadow.bias=-.001,$.add(J);let G=new ws("#e3f2ff",10);G.position.set(-5,3,-4),$.add(G);let ot=new ws("#fff3e6",.8);ot.position.set(-2,-4,2),$.add(ot),Et(),As(),Zr(),Qt(),Q&&(Q.visible=!0,it.compile($,F),Q.visible=!1),i.querySelector(".slide-title")?.getBoundingClientRect(),ue(),Ze();let ht=()=>{R||(de(),i.classList.add("glass-ready"),o?.())};document.fonts&&document.fonts.ready?document.fonts.ready.then(ht,ht):ht()}function Po(){R=!0,cancelAnimationFrame(Ee);for(let[G,ot,ht,bt]of K)G.removeEventListener(ot,ht,bt);let k=new Set,J=G=>{G&&!k.has(G)&&(k.add(G),G.dispose())};for(let G of[st,...ft])G?.geometryCache?.forEach(J);for(let G of ft)J(G.originalGeometry),J(G.finalGeometry);$?.traverse(G=>{J(G.geometry),(Array.isArray(G.material)?G.material:[G.material]).forEach(ot=>{J(ot?.map),J(ot)})}),J($?.environment),it?.dispose(),it?.forceContextLoss(),i.classList.remove("glass-ready","has-glass-card","contact-open","cursor-hover","cursor-text","cursor-hidden"),window.__glassSite===Jr&&delete window.__glassSite}try{Is()}catch(k){throw Po(),k}return Po}var C0=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill-rule="evenodd" d="
M250 0H750A250 250 0 0 1 1000 250V750A250 250 0 0 1 750 1000H250A250 250 0 0 1 0 750V250A250 250 0 0 1 250 0Z
M343.75 250H546.875A156.25 156.25 0 0 1 637.5 534.375A162.5 162.5 0 0 1 562.5 750H343.75Z
M712.5 218.75A68.75 68.75 0 1 0 850 218.75A68.75 68.75 0 1 0 712.5 218.75Z"/></svg>`,P0={growth:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M873.5 293.4 L706.5 126.5 L705.1 125.1 L703.5 123.9 L701.9 122.9 L700.2 122.0 L698.4 121.3 L696.5 120.7 L694.6 120.3 L692.7 120.1 L690.8 120.0 L688.9 120.1 L686.9 120.3 L685.1 120.7 L683.2 121.3 L681.4 122.0 L679.7 122.9 L678.0 123.9 L676.5 125.1 L675.0 126.5 L508.1 293.4 L507.1 294.5 L506.1 295.7 L505.3 296.9 L504.5 298.1 L503.9 299.4 L503.3 300.7 L502.8 302.1 L502.3 303.4 L502.0 304.8 L501.8 306.3 L501.6 307.7 L501.6 309.1 L501.6 310.6 L501.8 312.0 L502.0 313.5 L502.3 314.9 L502.8 316.3 L503.3 317.7 L503.9 319.1 L504.6 320.4 L505.4 321.6 L506.2 322.8 L507.2 323.9 L508.1 325.0 L509.2 325.9 L510.3 326.9 L511.5 327.7 L512.7 328.5 L514.0 329.1 L515.3 329.7 L516.6 330.2 L518.0 330.7 L519.4 331.0 L520.9 331.3 L522.4 331.4 L523.8 331.4 L597.0 331.4 L597.0 857.7 L597.1 859.7 L597.3 861.7 L597.8 863.6 L598.4 865.5 L599.1 867.3 L600.0 868.9 L601.1 870.5 L602.2 872.1 L603.5 873.5 L604.9 874.7 L606.4 875.9 L608.0 876.9 L609.7 877.8 L611.5 878.6 L613.3 879.2 L615.2 879.6 L617.2 879.9 L619.2 880.0 L762.3 880.0 L764.4 879.9 L766.3 879.6 L768.3 879.2 L770.1 878.6 L771.9 877.8 L773.6 876.9 L775.2 875.9 L776.7 874.7 L778.1 873.5 L779.4 872.1 L780.5 870.5 L781.6 868.9 L782.5 867.3 L783.2 865.5 L783.8 863.6 L784.2 861.7 L784.5 859.7 L784.6 857.7 L784.6 331.4 L857.7 331.4 L859.2 331.4 L860.7 331.3 L862.1 331.0 L863.6 330.7 L865.0 330.2 L866.3 329.7 L867.6 329.1 L868.9 328.5 L870.1 327.7 L871.3 326.9 L872.4 325.9 L873.4 325.0 L874.4 323.9 L875.4 322.8 L876.2 321.6 L877.0 320.4 L877.7 319.1 L878.3 317.7 L878.8 316.3 L879.3 314.9 L879.6 313.5 L879.8 312.0 L880.0 310.6 L880.0 309.1 L879.9 307.7 L879.8 306.3 L879.6 304.8 L879.2 303.4 L878.8 302.1 L878.3 300.7 L877.7 299.4 L877.1 298.1 L876.3 296.9 L875.4 295.7 L874.5 294.5 Z M523.8 430.0 L380.8 430.0 L378.7 430.1 L376.8 430.4 L374.8 430.8 L373.0 431.4 L371.2 432.2 L369.5 433.1 L367.9 434.1 L366.4 435.2 L365.0 436.5 L363.7 437.9 L362.6 439.4 L361.5 441.0 L360.6 442.7 L359.9 444.5 L359.3 446.4 L358.8 448.3 L358.6 450.2 L358.5 452.3 L358.5 857.7 L358.6 859.7 L358.8 861.7 L359.3 863.6 L359.9 865.5 L360.6 867.3 L361.5 868.9 L362.6 870.5 L363.7 872.1 L365.0 873.5 L366.4 874.7 L367.9 875.9 L369.5 876.9 L371.2 877.8 L373.0 878.6 L374.8 879.2 L376.8 879.6 L378.7 879.9 L380.8 880.0 L523.8 880.0 L525.9 879.9 L527.9 879.6 L529.8 879.2 L531.6 878.6 L533.4 877.8 L535.1 876.9 L536.7 875.9 L538.2 874.7 L539.6 873.5 L540.9 872.1 L542.0 870.5 L543.1 868.9 L544.0 867.3 L544.7 865.5 L545.3 863.6 L545.8 861.7 L546.0 859.7 L546.1 857.7 L546.1 452.3 L546.0 450.2 L545.8 448.3 L545.3 446.4 L544.7 444.5 L544.0 442.7 L543.1 441.0 L542.0 439.4 L540.9 437.9 L539.6 436.5 L538.2 435.2 L536.7 434.1 L535.1 433.1 L533.4 432.2 L531.6 431.4 L529.8 430.8 L527.9 430.4 L525.9 430.1 Z M285.4 620.8 L142.3 620.8 L140.2 620.9 L138.3 621.2 L136.3 621.6 L134.5 622.2 L132.7 622.9 L131.0 623.8 L129.4 624.9 L127.9 626.0 L126.5 627.3 L125.2 628.7 L124.1 630.2 L123.0 631.8 L122.1 633.5 L121.4 635.3 L120.8 637.1 L120.4 639.1 L120.1 641.0 L120.0 643.1 L120.0 857.7 L120.1 859.7 L120.4 861.7 L120.8 863.6 L121.4 865.5 L122.1 867.3 L123.0 868.9 L124.1 870.5 L125.2 872.1 L126.5 873.5 L127.9 874.7 L129.4 875.9 L131.0 876.9 L132.7 877.8 L134.5 878.6 L136.3 879.2 L138.3 879.6 L140.2 879.9 L142.3 880.0 L285.4 880.0 L287.4 879.9 L289.4 879.6 L291.3 879.2 L293.1 878.6 L294.9 877.8 L296.6 876.9 L298.2 875.9 L299.7 874.7 L301.1 873.5 L302.4 872.1 L303.6 870.5 L304.6 868.9 L305.5 867.3 L306.2 865.5 L306.8 863.6 L307.3 861.7 L307.5 859.7 L307.6 857.7 L307.6 643.1 L307.5 641.0 L307.3 639.1 L306.8 637.1 L306.2 635.3 L305.5 633.5 L304.6 631.8 L303.6 630.2 L302.4 628.7 L301.1 627.3 L299.7 626.0 L298.2 624.9 L296.6 623.8 L294.9 622.9 L293.1 622.2 L291.3 621.6 L289.4 621.2 L287.4 620.9 Z"/></svg>',spark:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M501.9 160.5 L502.9 170.4 L504.1 180.2 L505.6 189.9 L507.3 199.5 L509.2 209.0 L511.3 218.4 L513.7 227.6 L516.2 236.8 L519.0 245.8 L521.9 254.7 L525.1 263.5 L528.4 272.2 L532.0 280.8 L535.7 289.2 L539.7 297.5 L543.8 305.6 L548.1 313.7 L552.6 321.6 L557.3 329.3 L562.2 336.9 L567.3 344.4 L572.5 351.7 L577.9 358.9 L583.5 365.9 L589.2 372.8 L595.2 379.5 L601.2 386.1 L607.5 392.5 L613.9 398.8 L620.5 404.8 L627.2 410.8 L634.1 416.5 L641.1 422.1 L648.3 427.5 L655.6 432.7 L663.1 437.8 L670.7 442.7 L678.4 447.4 L686.3 451.9 L694.4 456.2 L702.5 460.3 L710.8 464.3 L719.2 468.0 L727.8 471.6 L736.5 474.9 L745.3 478.1 L754.2 481.0 L763.2 483.8 L772.4 486.3 L781.6 488.7 L791.0 490.8 L800.5 492.7 L810.1 494.4 L819.8 495.9 L829.6 497.1 L839.5 498.1 L849.5 499.0 L855.0 499.2 L859.2 499.4 L862.3 499.6 L864.1 499.8 L864.7 500.0 L864.1 500.2 L862.3 500.4 L859.2 500.6 L855.0 500.8 L849.5 501.0 L839.5 501.9 L829.6 502.9 L819.8 504.1 L810.1 505.6 L800.5 507.3 L791.0 509.2 L781.6 511.3 L772.4 513.7 L763.2 516.2 L754.2 519.0 L745.3 521.9 L736.5 525.1 L727.8 528.4 L719.2 532.0 L710.8 535.7 L702.5 539.7 L694.4 543.8 L686.3 548.1 L678.4 552.6 L670.7 557.3 L663.1 562.2 L655.6 567.3 L648.3 572.5 L641.1 577.9 L634.1 583.5 L627.2 589.2 L620.5 595.2 L613.9 601.2 L607.5 607.5 L601.2 613.9 L595.2 620.5 L589.2 627.2 L583.5 634.1 L577.9 641.1 L572.5 648.3 L567.3 655.6 L562.2 663.1 L557.3 670.7 L552.6 678.4 L548.1 686.3 L543.8 694.4 L539.7 702.5 L535.7 710.8 L532.0 719.2 L528.4 727.8 L525.1 736.5 L521.9 745.3 L519.0 754.2 L516.2 763.2 L513.7 772.4 L511.3 781.6 L509.2 791.0 L507.3 800.5 L505.6 810.1 L504.1 819.8 L502.9 829.6 L501.9 839.5 L501.0 849.5 L500.8 855.0 L500.6 859.2 L500.4 862.3 L500.2 864.1 L500.0 864.7 L499.8 864.1 L499.6 862.3 L499.4 859.2 L499.2 855.0 L499.0 849.5 L498.1 839.5 L497.1 829.6 L495.9 819.8 L494.4 810.1 L492.7 800.5 L490.8 791.0 L488.7 781.6 L486.3 772.4 L483.8 763.2 L481.0 754.2 L478.1 745.3 L474.9 736.5 L471.6 727.8 L468.0 719.2 L464.3 710.8 L460.3 702.5 L456.2 694.4 L451.9 686.3 L447.4 678.4 L442.7 670.7 L437.8 663.1 L432.7 655.6 L427.5 648.3 L422.1 641.1 L416.5 634.1 L410.8 627.2 L404.8 620.5 L398.8 613.9 L392.5 607.5 L386.1 601.2 L379.5 595.2 L372.8 589.2 L365.9 583.5 L358.9 577.9 L351.7 572.5 L344.4 567.3 L336.9 562.2 L329.3 557.3 L321.6 552.6 L313.7 548.1 L305.6 543.8 L297.5 539.7 L289.2 535.7 L280.8 532.0 L272.2 528.4 L263.5 525.1 L254.7 521.9 L245.8 519.0 L236.8 516.2 L227.6 513.7 L218.4 511.3 L209.0 509.2 L199.5 507.3 L189.9 505.6 L180.2 504.1 L170.4 502.9 L160.5 501.9 L150.5 501.0 L145.0 500.8 L140.8 500.6 L137.7 500.4 L135.9 500.2 L135.3 500.0 L135.9 499.8 L137.7 499.6 L140.8 499.4 L145.0 499.2 L150.5 499.0 L160.5 498.1 L170.4 497.1 L180.2 495.9 L189.9 494.4 L199.5 492.7 L209.0 490.8 L218.4 488.7 L227.6 486.3 L236.8 483.8 L245.8 481.0 L254.7 478.1 L263.5 474.9 L272.2 471.6 L280.8 468.0 L289.2 464.3 L297.5 460.3 L305.6 456.2 L313.7 451.9 L321.6 447.4 L329.3 442.7 L336.9 437.8 L344.4 432.7 L351.7 427.5 L358.9 422.1 L365.9 416.5 L372.8 410.8 L379.5 404.8 L386.1 398.8 L392.5 392.5 L398.8 386.1 L404.8 379.5 L410.8 372.8 L416.5 365.9 L422.1 358.9 L427.5 351.7 L432.7 344.4 L437.8 336.9 L442.7 329.3 L447.4 321.6 L451.9 313.7 L456.2 305.6 L460.3 297.5 L464.3 289.2 L468.0 280.8 L471.6 272.2 L474.9 263.5 L478.1 254.7 L481.0 245.8 L483.8 236.8 L486.3 227.6 L488.7 218.4 L490.8 209.0 L492.7 199.5 L494.4 189.9 L495.9 180.2 L497.1 170.4 L498.1 160.5 L499.0 150.5 L499.2 145.0 L499.4 140.8 L499.6 137.7 L499.8 135.9 L500.0 135.3 L500.2 135.9 L500.4 137.7 L500.6 140.8 L500.8 145.0 L501.0 150.5 Z"/></svg>',prism:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M401.3 291.0 L403.4 287.5 L405.6 284.1 L407.9 280.8 L410.3 277.6 L412.9 274.5 L415.6 271.4 L418.3 268.5 L421.2 265.6 L424.2 262.9 L427.2 260.2 L430.4 257.7 L433.6 255.3 L437.0 253.0 L440.4 250.8 L443.9 248.8 L447.4 246.8 L451.1 245.0 L454.7 243.4 L458.5 241.8 L462.3 240.4 L466.1 239.2 L470.0 238.0 L473.9 237.0 L477.9 236.2 L481.9 235.5 L485.9 234.9 L489.9 234.4 L493.9 234.2 L498.0 234.0 L502.0 234.0 L506.1 234.2 L510.1 234.4 L514.1 234.9 L518.1 235.5 L522.1 236.2 L526.1 237.0 L530.0 238.0 L533.9 239.2 L537.7 240.4 L541.5 241.8 L545.3 243.4 L548.9 245.0 L552.6 246.8 L556.1 248.8 L559.6 250.8 L563.0 253.0 L566.4 255.3 L569.6 257.7 L572.8 260.2 L575.8 262.9 L578.8 265.6 L581.7 268.5 L584.4 271.4 L587.1 274.5 L589.7 277.6 L592.1 280.8 L594.4 284.1 L596.6 287.5 L598.7 291.0 L730.4 519.0 L732.3 522.5 L734.2 526.1 L735.9 529.8 L737.4 533.5 L738.9 537.3 L740.2 541.2 L741.3 545.0 L742.4 548.9 L743.3 552.9 L744.0 556.9 L744.6 560.9 L745.1 564.9 L745.4 568.9 L745.6 573.0 L745.6 577.0 L745.5 581.1 L745.3 585.1 L744.9 589.1 L744.3 593.1 L743.7 597.1 L742.8 601.1 L741.9 605.0 L740.8 608.9 L739.5 612.8 L738.2 616.6 L736.7 620.3 L735.0 624.0 L733.3 627.7 L731.4 631.2 L729.3 634.7 L727.2 638.2 L724.9 641.5 L722.5 644.8 L720.0 648.0 L717.4 651.1 L714.7 654.1 L711.9 657.0 L709.0 659.8 L705.9 662.5 L702.8 665.0 L699.6 667.5 L696.3 669.9 L693.0 672.1 L689.5 674.2 L686.0 676.2 L682.4 678.1 L678.7 679.8 L675.0 681.4 L671.3 682.9 L667.4 684.2 L663.6 685.4 L659.7 686.5 L655.7 687.4 L651.8 688.2 L647.8 688.9 L643.8 689.4 L639.7 689.7 L635.7 689.9 L631.6 690.0 L368.4 690.0 L364.3 689.9 L360.3 689.7 L356.2 689.4 L352.2 688.9 L348.2 688.2 L344.3 687.4 L340.3 686.5 L336.4 685.4 L332.6 684.2 L328.7 682.9 L325.0 681.4 L321.3 679.8 L317.6 678.1 L314.0 676.2 L310.5 674.2 L307.0 672.1 L303.7 669.9 L300.4 667.5 L297.2 665.0 L294.1 662.5 L291.0 659.8 L288.1 657.0 L285.3 654.1 L282.6 651.1 L280.0 648.0 L277.5 644.8 L275.1 641.5 L272.8 638.2 L270.7 634.7 L268.6 631.2 L266.7 627.7 L265.0 624.0 L263.3 620.3 L261.8 616.6 L260.5 612.8 L259.2 608.9 L258.1 605.0 L257.2 601.1 L256.3 597.1 L255.7 593.1 L255.1 589.1 L254.7 585.1 L254.5 581.1 L254.4 577.0 L254.4 573.0 L254.6 568.9 L254.9 564.9 L255.4 560.9 L256.0 556.9 L256.7 552.9 L257.6 548.9 L258.7 545.0 L259.8 541.2 L261.1 537.3 L262.6 533.5 L264.1 529.8 L265.8 526.1 L267.7 522.5 L269.6 519.0 Z"/></svg>',"star-soft":'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M871.9 439.2 L705.4 601.6 L744.7 830.8 L744.9 832.5 L745.1 834.2 L745.1 835.9 L745.0 837.5 L744.8 839.1 L744.5 840.8 L744.2 842.3 L743.7 843.9 L743.1 845.4 L742.5 846.9 L741.7 848.4 L740.9 849.8 L739.9 851.1 L738.9 852.4 L737.8 853.7 L736.7 854.9 L735.4 856.0 L734.1 857.0 L733.3 857.5 L732.5 858.1 L731.7 858.6 L730.9 859.0 L730.0 859.4 L729.2 859.8 L728.3 860.2 L727.4 860.5 L726.5 860.8 L725.7 861.1 L724.8 861.3 L723.9 861.5 L722.9 861.7 L722.0 861.8 L721.1 862.0 L720.2 862.0 L719.3 862.1 L718.4 862.1 L717.6 862.1 L716.9 862.1 L716.2 862.0 L715.5 862.0 L714.8 861.9 L714.1 861.8 L713.4 861.6 L712.7 861.5 L712.0 861.3 L711.3 861.2 L710.6 861.0 L709.9 860.7 L709.3 860.5 L708.6 860.2 L707.9 860.0 L707.2 859.7 L706.6 859.4 L705.9 859.0 L500.0 750.8 L294.1 859.0 L292.6 859.7 L291.0 860.4 L289.5 860.9 L287.9 861.4 L286.3 861.7 L284.6 861.9 L283.0 862.1 L281.4 862.1 L279.7 862.0 L278.1 861.9 L276.5 861.6 L274.9 861.2 L273.3 860.8 L271.8 860.2 L270.3 859.5 L268.8 858.8 L267.3 857.9 L266.0 857.0 L264.6 855.9 L263.4 854.8 L262.2 853.6 L261.1 852.4 L260.1 851.1 L259.2 849.8 L258.3 848.4 L257.6 846.9 L256.9 845.4 L256.3 843.9 L255.9 842.3 L255.5 840.7 L255.2 839.1 L255.0 837.5 L254.9 835.8 L255.0 834.2 L255.1 832.5 L255.3 830.8 L294.6 601.5 L128.1 439.2 L126.9 438.0 L125.8 436.7 L124.8 435.4 L123.9 434.0 L123.1 432.6 L122.4 431.1 L121.8 429.6 L121.2 428.0 L120.8 426.5 L120.4 424.9 L120.2 423.3 L120.0 421.6 L120.0 420.0 L120.1 418.3 L120.2 416.7 L120.5 415.1 L120.8 413.4 L121.3 411.8 L121.9 410.2 L122.6 408.7 L123.3 407.2 L124.1 405.8 L125.1 404.4 L126.1 403.1 L127.2 401.9 L128.3 400.7 L129.5 399.6 L130.8 398.6 L132.1 397.7 L133.5 396.8 L135.0 396.1 L136.5 395.4 L138.0 394.8 L139.6 394.3 L141.3 393.9 L142.9 393.6 L373.1 360.2 L476.0 151.6 L477.7 148.7 L479.7 146.2 L482.1 144.0 L484.7 142.1 L487.5 140.6 L490.5 139.4 L493.6 138.6 L496.8 138.1 L500.0 137.9 L503.2 138.1 L506.4 138.6 L509.5 139.4 L512.5 140.6 L515.3 142.1 L517.9 144.0 L520.3 146.2 L522.3 148.7 L524.0 151.6 L626.9 360.2 L857.1 393.6 L858.7 393.9 L860.4 394.3 L862.0 394.8 L863.5 395.4 L865.0 396.1 L866.5 396.8 L867.9 397.7 L869.2 398.6 L870.5 399.6 L871.7 400.7 L872.8 401.9 L873.9 403.1 L874.9 404.4 L875.9 405.8 L876.7 407.2 L877.4 408.7 L878.1 410.2 L878.7 411.8 L879.2 413.4 L879.5 415.1 L879.8 416.7 L879.9 418.4 L880.0 420.0 L880.0 421.6 L879.8 423.3 L879.6 424.9 L879.2 426.5 L878.8 428.0 L878.2 429.6 L877.6 431.1 L876.9 432.6 L876.1 434.0 L875.2 435.4 L874.2 436.7 L873.1 438.0 Z"/></svg>',bloom:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M880.0 500.0 L879.5 510.8 L878.2 521.6 L875.9 532.3 L872.7 542.8 L868.6 553.0 L863.7 562.9 L858.0 572.5 L851.4 581.7 L844.1 590.4 L836.0 598.7 L827.3 606.3 L817.9 613.4 L807.9 619.9 L797.3 625.6 L786.2 630.7 L774.6 635.0 L762.6 638.6 L750.2 641.3 L737.3 643.1 L723.9 643.9 L709.9 643.5 L693.7 640.7 L701.4 655.3 L706.1 668.5 L709.4 681.5 L711.7 694.3 L712.9 706.9 L713.3 719.5 L712.8 731.8 L711.4 743.9 L709.1 755.8 L706.1 767.3 L702.3 778.4 L697.7 789.1 L692.3 799.3 L686.3 809.0 L679.6 818.0 L672.3 826.5 L664.3 834.2 L655.8 841.2 L646.9 847.5 L637.4 853.0 L627.6 857.6 L617.4 861.4 L607.0 864.3 L596.3 866.3 L585.4 867.5 L574.5 867.7 L563.5 867.0 L552.5 865.4 L541.6 862.9 L530.9 859.5 L520.3 855.2 L510.0 850.1 L500.0 844.1 L490.4 837.4 L481.1 829.8 L472.4 821.6 L464.1 812.6 L456.4 802.9 L449.4 792.6 L442.9 781.6 L437.2 769.9 L432.3 757.5 L428.4 744.0 L426.0 727.7 L414.5 739.5 L403.4 748.1 L392.1 755.2 L380.7 761.3 L369.0 766.5 L357.2 770.7 L345.3 774.0 L333.3 776.4 L321.4 777.9 L309.5 778.6 L297.7 778.4 L286.1 777.3 L274.8 775.4 L263.7 772.7 L253.0 769.1 L242.7 764.7 L232.9 759.6 L223.6 753.7 L214.9 747.1 L206.8 739.8 L199.3 731.9 L192.6 723.4 L186.6 714.3 L181.3 704.8 L176.9 694.8 L173.3 684.5 L170.6 673.8 L168.7 662.9 L167.8 651.7 L167.7 640.4 L168.5 629.1 L170.2 617.7 L172.7 606.3 L176.2 595.1 L180.5 584.0 L185.6 573.1 L191.6 562.5 L198.4 552.2 L206.1 542.3 L214.6 532.7 L223.9 523.7 L234.2 515.2 L245.8 507.3 L260.6 500.0 L245.8 492.7 L234.2 484.8 L223.9 476.3 L214.6 467.3 L206.1 457.7 L198.4 447.8 L191.6 437.5 L185.6 426.9 L180.5 416.0 L176.2 404.9 L172.7 393.7 L170.2 382.3 L168.5 370.9 L167.7 359.6 L167.8 348.3 L168.7 337.1 L170.6 326.2 L173.3 315.5 L176.9 305.2 L181.3 295.2 L186.6 285.7 L192.6 276.6 L199.3 268.1 L206.8 260.2 L214.9 252.9 L223.6 246.3 L232.9 240.4 L242.7 235.3 L253.0 230.9 L263.7 227.3 L274.8 224.6 L286.1 222.7 L297.7 221.6 L309.5 221.4 L321.4 222.1 L333.3 223.6 L345.3 226.0 L357.2 229.3 L369.0 233.5 L380.7 238.7 L392.1 244.8 L403.4 251.9 L414.5 260.5 L426.0 272.3 L428.4 256.0 L432.3 242.5 L437.2 230.1 L442.9 218.4 L449.4 207.4 L456.4 197.1 L464.1 187.4 L472.4 178.4 L481.1 170.2 L490.4 162.6 L500.0 155.9 L510.0 149.9 L520.3 144.8 L530.9 140.5 L541.6 137.1 L552.5 134.6 L563.5 133.0 L574.5 132.3 L585.4 132.5 L596.3 133.7 L607.0 135.7 L617.4 138.6 L627.6 142.4 L637.4 147.0 L646.9 152.5 L655.8 158.8 L664.3 165.8 L672.3 173.5 L679.6 182.0 L686.3 191.0 L692.3 200.7 L697.7 210.9 L702.3 221.6 L706.1 232.7 L709.1 244.2 L711.4 256.1 L712.8 268.2 L713.3 280.5 L712.9 293.1 L711.7 305.7 L709.4 318.5 L706.1 331.5 L701.4 344.7 L693.7 359.3 L709.9 356.5 L723.9 356.1 L737.3 356.9 L750.2 358.7 L762.6 361.4 L774.6 365.0 L786.2 369.3 L797.3 374.4 L807.9 380.1 L817.9 386.6 L827.3 393.7 L836.0 401.3 L844.1 409.6 L851.4 418.3 L858.0 427.5 L863.7 437.1 L868.6 447.0 L872.7 457.2 L875.9 467.7 L878.2 478.4 L879.5 489.2 Z"/></svg>',squircle:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M857.2 500.0 L857.1 587.4 L856.7 618.1 L856.1 640.8 L855.3 659.4 L854.2 675.5 L852.9 689.8 L851.3 702.6 L849.5 714.4 L847.4 725.2 L845.1 735.3 L842.5 744.6 L839.7 753.4 L836.6 761.6 L833.3 769.4 L829.7 776.6 L825.8 783.5 L821.6 790.0 L817.1 796.1 L812.3 801.8 L807.2 807.2 L801.8 812.3 L796.1 817.1 L790.0 821.6 L783.5 825.8 L776.6 829.7 L769.4 833.3 L761.6 836.6 L753.4 839.7 L744.6 842.5 L735.3 845.1 L725.2 847.4 L714.4 849.5 L702.6 851.3 L689.8 852.9 L675.5 854.2 L659.4 855.3 L640.8 856.1 L618.1 856.7 L587.4 857.1 L500.0 857.2 L412.6 857.1 L381.9 856.7 L359.2 856.1 L340.6 855.3 L324.5 854.2 L310.2 852.9 L297.4 851.3 L285.6 849.5 L274.8 847.4 L264.7 845.1 L255.4 842.5 L246.6 839.7 L238.4 836.6 L230.6 833.3 L223.4 829.7 L216.5 825.8 L210.0 821.6 L203.9 817.1 L198.2 812.3 L192.8 807.2 L187.7 801.8 L182.9 796.1 L178.4 790.0 L174.2 783.5 L170.3 776.6 L166.7 769.4 L163.4 761.6 L160.3 753.4 L157.5 744.6 L154.9 735.3 L152.6 725.2 L150.5 714.4 L148.7 702.6 L147.1 689.8 L145.8 675.5 L144.7 659.4 L143.9 640.8 L143.3 618.1 L142.9 587.4 L142.8 500.0 L142.9 412.6 L143.3 381.9 L143.9 359.2 L144.7 340.6 L145.8 324.5 L147.1 310.2 L148.7 297.4 L150.5 285.6 L152.6 274.8 L154.9 264.7 L157.5 255.4 L160.3 246.6 L163.4 238.4 L166.7 230.6 L170.3 223.4 L174.2 216.5 L178.4 210.0 L182.9 203.9 L187.7 198.2 L192.8 192.8 L198.2 187.7 L203.9 182.9 L210.0 178.4 L216.5 174.2 L223.4 170.3 L230.6 166.7 L238.4 163.4 L246.6 160.3 L255.4 157.5 L264.7 154.9 L274.8 152.6 L285.6 150.5 L297.4 148.7 L310.2 147.1 L324.5 145.8 L340.6 144.7 L359.2 143.9 L381.9 143.3 L412.6 142.9 L500.0 142.8 L587.4 142.9 L618.1 143.3 L640.8 143.9 L659.4 144.7 L675.5 145.8 L689.8 147.1 L702.6 148.7 L714.4 150.5 L725.2 152.6 L735.3 154.9 L744.6 157.5 L753.4 160.3 L761.6 163.4 L769.4 166.7 L776.6 170.3 L783.5 174.2 L790.0 178.4 L796.1 182.9 L801.8 187.7 L807.2 192.8 L812.3 198.2 L817.1 203.9 L821.6 210.0 L825.8 216.5 L829.7 223.4 L833.3 230.6 L836.6 238.4 L839.7 246.6 L842.5 255.4 L845.1 264.7 L847.4 274.8 L849.5 285.6 L851.3 297.4 L852.9 310.2 L854.2 324.5 L855.3 340.6 L856.1 359.2 L856.7 381.9 L857.1 412.6 Z"/></svg>'},I0=["#387cd5","#6a6be8","#8b5cf6","#22d3ee","#2563c9"],U0=["#4f8cdb","#7c5cff","#b45cf0","#3aa7ff","#2a4fd6"];function D0(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return!1;try{let i=document.createElement("canvas").getContext("webgl2");return i?.getExtension("WEBGL_lose_context")?.loseContext(),!!i}catch{return!1}}export{D0 as glassAvailable,C0 as glassMark,I0 as glassPalette,P0 as glassShapes,U0 as sitePalette,E0 as startGlass};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
