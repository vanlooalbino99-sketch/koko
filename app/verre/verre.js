var Il=0,Ro=1,Ll=2;var al=1,xo=2,Ln=3,Sn=0,$e=1,rn=2;var Xn=0,Bi=1,rr=2,Co=3,Po=4,Ul=5,ii=100,Dl=101,Nl=102,Io=103,Lo=104,Ol=200,Fl=201,Bl=202,zl=203,wa=204,Ta=205,kl=206,Hl=207,Vl=208,Gl=209,Wl=210,Xl=211,ql=212,Yl=213,Zl=214,Jl=0,$l=1,Kl=2,ar=3,jl=4,Ql=5,th=6,eh=7,ol=0,nh=1,ih=2,qn=0,sh=1,rh=2,ah=3,yo=4,oh=5,ch=6;var cl=300,Hi=301,Vi=302,Aa=303,Ra=304,kr=306,Ca=1e3,mn=1001,Pa=1002,qe=1003,Uo=1004;var qr=1005;var sn=1006,lh=1007;var ds=1008;var Yn=1009,hh=1010,uh=1011,vo=1012,ll=1013,Gn=1014,Wn=1015,fs=1016,hl=1017,ul=1018,ri=1020,dh=1021,gn=1023,fh=1024,ph=1025,ai=1026,Gi=1027,mh=1028,dl=1029,gh=1030,fl=1031,pl=1033,Yr=33776,Zr=33777,Jr=33778,$r=33779,Do=35840,No=35841,Oo=35842,Fo=35843,ml=36196,Bo=37492,zo=37496,ko=37808,Ho=37809,Vo=37810,Go=37811,Wo=37812,Xo=37813,qo=37814,Yo=37815,Zo=37816,Jo=37817,$o=37818,Ko=37819,jo=37820,Qo=37821,Kr=36492,tc=36494,ec=36495,_h=36283,nc=36284,ic=36285,sc=36286;var or=2300,cr=2301,jr=2302,rc=2400,ac=2401,oc=2402;var gl=3e3,oi=3001,xh=3200,yh=3201,_l=0,vh=1,an="",we="srgb",On="srgb-linear",Mo="display-p3",Hr="display-p3-linear",lr="linear",pe="srgb",hr="rec709",ur="p3";var _i=7680;var cc=519,Mh=512,Sh=513,bh=514,xl=515,Eh=516,wh=517,Th=518,Ah=519,lc=35044;var hc="300 es",Ia=1035,Dn=2e3,dr=2001,Zn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uc=1234567,as=Math.PI/180,Wi=180/Math.PI;function fi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Ue(i,t,e){return Math.max(t,Math.min(e,i))}function So(i,t){return(i%t+t)%t}function Rh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ch(i,t,e){return i!==t?(e-i)/(t-i):0}function os(i,t,e){return(1-e)*i+e*t}function Ph(i,t,e,n){return os(i,t,1-Math.exp(-e*n))}function Ih(i,t=1){return t-Math.abs(So(i,t*2)-t)}function Lh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Uh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Dh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Nh(i,t){return i+Math.random()*(t-i)}function Oh(i){return i*(.5-Math.random())}function Fh(i){i!==void 0&&(uc=i);let t=uc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Bh(i){return i*as}function zh(i){return i*Wi}function La(i){return(i&i-1)===0&&i!==0}function kh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function fr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Hh(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),g=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*d,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*x,c*g,a*l);break;case"YXY":i.set(c*g,a*h,c*x,a*l);break;case"ZYZ":i.set(c*x,c*g,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ui(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var yn={DEG2RAD:as,RAD2DEG:Wi,generateUUID:fi,clamp:Ue,euclideanModulo:So,mapLinear:Rh,inverseLerp:Ch,lerp:os,damp:Ph,pingpong:Ih,smoothstep:Lh,smootherstep:Uh,randInt:Dh,randFloat:Nh,randFloatSpread:Oh,seededRandom:Fh,degToRad:Bh,radToDeg:zh,isPowerOfTwo:La,ceilPowerOfTwo:kh,floorPowerOfTwo:fr,setQuaternionFromProperEuler:Hh,normalize:We,denormalize:Ui},yt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$t=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],g=n[5],x=n[8],y=s[0],p=s[3],u=s[6],A=s[1],_=s[4],b=s[7],N=s[2],I=s[5],C=s[8];return r[0]=o*y+a*A+c*N,r[3]=o*p+a*_+c*I,r[6]=o*u+a*b+c*C,r[1]=l*y+h*A+d*N,r[4]=l*p+h*_+d*I,r[7]=l*u+h*b+d*C,r[2]=f*y+g*A+x*N,r[5]=f*p+g*_+x*I,r[8]=f*u+g*b+x*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=h*o-a*l,f=a*c-h*r,g=l*r-o*c,x=e*d+n*f+s*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/x;return t[0]=d*y,t[1]=(s*l-h*n)*y,t[2]=(a*n-s*o)*y,t[3]=f*y,t[4]=(h*e-s*c)*y,t[5]=(s*r-a*e)*y,t[6]=g*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Qr.makeScale(t,e)),this}rotate(t){return this.premultiply(Qr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Qr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Qr=new $t;function yl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vh(){let i=pr("canvas");return i.style.display="block",i}var dc={};function cs(i){i in dc||(dc[i]=!0,console.warn(i))}var fc=new $t().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),pc=new $t().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Is={[On]:{transfer:lr,primaries:hr,toReference:i=>i,fromReference:i=>i},[we]:{transfer:pe,primaries:hr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Hr]:{transfer:lr,primaries:ur,toReference:i=>i.applyMatrix3(pc),fromReference:i=>i.applyMatrix3(fc)},[Mo]:{transfer:pe,primaries:ur,toReference:i=>i.convertSRGBToLinear().applyMatrix3(pc),fromReference:i=>i.applyMatrix3(fc).convertLinearToSRGB()}},Gh=new Set([On,Hr]),le={enabled:!0,_workingColorSpace:On,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Gh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Is[t].toReference,s=Is[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Is[i].primaries},getTransfer:function(i){return i===an?lr:Is[i].transfer}};function zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ta(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var xi,mr=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{xi===void 0&&(xi=pr("canvas")),xi.width=t.width,xi.height=t.height;let n=xi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=xi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=pr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=zi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zi(e[n]/255)*255):e[n]=zi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Wh=0,gr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=fi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ea(s[o].image)):r.push(ea(s[o]))}else r=ea(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ea(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Xh=0,on=class i extends Zn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=mn,s=mn,r=sn,o=ds,a=gn,c=Yn,l=i.DEFAULT_ANISOTROPY,h=an){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=fi(),this.name="",this.source=new gr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new yt(0,0),this.repeat=new yt(1,1),this.center=new yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===oi?we:an),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ca:t.x=t.x-Math.floor(t.x);break;case mn:t.x=t.x<0?0:1;break;case Pa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ca:t.y=t.y-Math.floor(t.y);break;case mn:t.y=t.y<0?0:1;break;case Pa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===we?oi:gl}set encoding(t){cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===oi?we:an}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=cl;on.DEFAULT_ANISOTROPY=1;var De=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],d=c[8],f=c[1],g=c[5],x=c[9],y=c[2],p=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-y)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+y)<.1&&Math.abs(x+p)<.1&&Math.abs(l+g+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,b=(g+1)/2,N=(u+1)/2,I=(h+f)/4,C=(d+y)/4,j=(x+p)/4;return _>b&&_>N?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=I/n,r=C/n):b>N?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=I/s,r=j/s):N<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(N),n=C/r,s=j/r),this.set(n,s,r,e),this}let A=Math.sqrt((p-x)*(p-x)+(d-y)*(d-y)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(p-x)/A,this.y=(d-y)/A,this.z=(f-h)/A,this.w=Math.acos((l+g+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ua=class extends Zn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new De(0,0,t,e),this.scissorTest=!1,this.viewport=new De(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(cs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===oi?we:an),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new on(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new gr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends Ua{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},_r=class extends on{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Da=class extends on{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Jn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],g=r[o+1],x=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=g,t[e+2]=x,t[e+3]=y;return}if(d!==y||c!==f||l!==g||h!==x){let p=1-a,u=c*f+l*g+h*x+d*y,A=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let N=Math.sqrt(_),I=Math.atan2(N,u*A);p=Math.sin(p*I)/N,a=Math.sin(a*I)/N}let b=a*A;if(c=c*p+f*b,l=l*p+g*b,h=h*p+x*b,d=d*p+y*b,p===1-a){let N=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=N,l*=N,h*=N,d*=N}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],f=r[o+1],g=r[o+2],x=r[o+3];return t[e]=a*x+h*d+c*g-l*f,t[e+1]=c*x+h*f+l*d-a*g,t[e+2]=l*x+h*g+a*f-c*d,t[e+3]=h*x-a*d-c*f-l*g,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),f=c(n/2),g=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"YXZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"ZXY":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"ZYX":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"YZX":this._x=f*h*d+l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d-f*g*x;break;case"XZY":this._x=f*h*d-l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d+f*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-c)*g,this._y=(r-l)*g,this._z=(o-s)*g}else if(n>a&&n>d){let g=2*Math.sqrt(1+n-a-d);this._w=(h-c)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+l)/g}else if(a>d){let g=2*Math.sqrt(1+a-n-d);this._w=(r-l)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(c+h)/g}else{let g=2*Math.sqrt(1+d-n-a);this._w=(o-s)/g,this._x=(r+l)/g,this._y=(c+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ue(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let g=1-e;return this._w=g*o+e*this._w,this._x=g*n+e*this._x,this._y=g*s+e*this._y,this._z=g*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(mc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(mc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return na.copy(this).projectOnVector(t),this.sub(na)}reflect(t){return this.sub(na.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},na=new G,mc=new Jn,ci=class{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ls.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ls.copy(n.boundingBox)),Ls.applyMatrix4(t.matrixWorld),this.union(Ls)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ns),Us.subVectors(this.max,ns),yi.subVectors(t.a,ns),vi.subVectors(t.b,ns),Mi.subVectors(t.c,ns),Bn.subVectors(vi,yi),zn.subVectors(Mi,vi),jn.subVectors(yi,Mi);let e=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-jn.z,jn.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,jn.z,0,-jn.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-jn.y,jn.x,0];return!ia(e,yi,vi,Mi,Us)||(e=[1,0,0,0,1,0,0,0,1],!ia(e,yi,vi,Mi,Us))?!1:(Ds.crossVectors(Bn,zn),e=[Ds.x,Ds.y,Ds.z],ia(e,yi,vi,Mi,Us))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Tn=[new G,new G,new G,new G,new G,new G,new G,new G],dn=new G,Ls=new ci,yi=new G,vi=new G,Mi=new G,Bn=new G,zn=new G,jn=new G,ns=new G,Us=new G,Ds=new G,Qn=new G;function ia(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Qn.fromArray(i,r);let a=s.x*Math.abs(Qn.x)+s.y*Math.abs(Qn.y)+s.z*Math.abs(Qn.z),c=t.dot(Qn),l=e.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var qh=new ci,is=new G,sa=new G,Xi=class{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):qh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;is.subVectors(t,this.center);let e=is.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(sa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(is.copy(t.center).add(sa)),this.expandByPoint(is.copy(t.center).sub(sa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},An=new G,ra=new G,Ns=new G,kn=new G,aa=new G,Os=new G,oa=new G,xr=class{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,An)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=An.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(An.copy(this.origin).addScaledVector(this.direction,e),An.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ra.copy(t).add(e).multiplyScalar(.5),Ns.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(ra);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Ns),a=kn.dot(this.direction),c=-kn.dot(Ns),l=kn.lengthSq(),h=Math.abs(1-o*o),d,f,g,x;if(h>0)if(d=o*c-a,f=o*a-c,x=r*h,d>=0)if(f>=-x)if(f<=x){let y=1/h;d*=y,f*=y,g=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f<=-x?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l):f<=x?(d=0,f=Math.min(Math.max(-r,-c),r),g=f*(f+2*c)+l):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ra).addScaledVector(Ns,f),g}intersectSphere(t,e){An.subVectors(t.center,this.origin);let n=An.dot(this.direction),s=An.dot(An)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,c=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,c=(t.min.z-f.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,An)!==null}intersectTriangle(t,e,n,s,r){aa.subVectors(e,t),Os.subVectors(n,t),oa.crossVectors(aa,Os);let o=this.direction.dot(oa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;kn.subVectors(this.origin,t);let c=a*this.direction.dot(Os.crossVectors(kn,Os));if(c<0)return null;let l=a*this.direction.dot(aa.cross(kn));if(l<0||c+l>o)return null;let h=-a*kn.dot(oa);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class i{constructor(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p)}set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=f,u[3]=g,u[7]=x,u[11]=y,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Si.setFromMatrixColumn(t,0).length(),r=1/Si.setFromMatrixColumn(t,1).length(),o=1/Si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,g=o*d,x=a*h,y=a*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=g+x*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=x+g*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,g=c*d,x=l*h,y=l*d;e[0]=f+y*a,e[4]=x*a-g,e[8]=o*l,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=g*a-x,e[6]=y+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,g=c*d,x=l*h,y=l*d;e[0]=f-y*a,e[4]=-o*d,e[8]=x+g*a,e[1]=g+x*a,e[5]=o*h,e[9]=y-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,g=o*d,x=a*h,y=a*d;e[0]=c*h,e[4]=x*l-g,e[8]=f*l+y,e[1]=c*d,e[5]=y*l+f,e[9]=g*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,g=o*l,x=a*c,y=a*l;e[0]=c*h,e[4]=y-f*d,e[8]=x*d+g,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=g*d+x,e[10]=f-y*d}else if(t.order==="XZY"){let f=o*c,g=o*l,x=a*c,y=a*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=f*d+y,e[5]=o*h,e[9]=g*d-x,e[2]=x*d-g,e[6]=a*h,e[10]=y*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yh,t,Zh)}lookAt(t,e,n){let s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),Hn.crossVectors(n,je),Hn.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),Hn.crossVectors(n,je)),Hn.normalize(),Fs.crossVectors(je,Hn),s[0]=Hn.x,s[4]=Fs.x,s[8]=je.x,s[1]=Hn.y,s[5]=Fs.y,s[9]=je.y,s[2]=Hn.z,s[6]=Fs.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],g=n[13],x=n[2],y=n[6],p=n[10],u=n[14],A=n[3],_=n[7],b=n[11],N=n[15],I=s[0],C=s[4],j=s[8],M=s[12],T=s[1],Y=s[5],K=s[9],dt=s[13],U=s[2],q=s[6],tt=s[10],Q=s[14],z=s[3],rt=s[7],ut=s[11],_t=s[15];return r[0]=o*I+a*T+c*U+l*z,r[4]=o*C+a*Y+c*q+l*rt,r[8]=o*j+a*K+c*tt+l*ut,r[12]=o*M+a*dt+c*Q+l*_t,r[1]=h*I+d*T+f*U+g*z,r[5]=h*C+d*Y+f*q+g*rt,r[9]=h*j+d*K+f*tt+g*ut,r[13]=h*M+d*dt+f*Q+g*_t,r[2]=x*I+y*T+p*U+u*z,r[6]=x*C+y*Y+p*q+u*rt,r[10]=x*j+y*K+p*tt+u*ut,r[14]=x*M+y*dt+p*Q+u*_t,r[3]=A*I+_*T+b*U+N*z,r[7]=A*C+_*Y+b*q+N*rt,r[11]=A*j+_*K+b*tt+N*ut,r[15]=A*M+_*dt+b*Q+N*_t,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],d=t[6],f=t[10],g=t[14],x=t[3],y=t[7],p=t[11],u=t[15];return x*(+r*c*d-s*l*d-r*a*f+n*l*f+s*a*g-n*c*g)+y*(+e*c*g-e*l*f+r*o*f-s*o*g+s*l*h-r*c*h)+p*(+e*l*d-e*a*g-r*o*d+n*o*g+r*a*h-n*l*h)+u*(-s*a*h-e*c*d+e*a*f+s*o*d-n*o*f+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],g=t[11],x=t[12],y=t[13],p=t[14],u=t[15],A=d*p*l-y*f*l+y*c*g-a*p*g-d*c*u+a*f*u,_=x*f*l-h*p*l-x*c*g+o*p*g+h*c*u-o*f*u,b=h*y*l-x*d*l+x*a*g-o*y*g-h*a*u+o*d*u,N=x*d*c-h*y*c-x*a*f+o*y*f+h*a*p-o*d*p,I=e*A+n*_+s*b+r*N;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/I;return t[0]=A*C,t[1]=(y*f*r-d*p*r-y*s*g+n*p*g+d*s*u-n*f*u)*C,t[2]=(a*p*r-y*c*r+y*s*l-n*p*l-a*s*u+n*c*u)*C,t[3]=(d*c*r-a*f*r-d*s*l+n*f*l+a*s*g-n*c*g)*C,t[4]=_*C,t[5]=(h*p*r-x*f*r+x*s*g-e*p*g-h*s*u+e*f*u)*C,t[6]=(x*c*r-o*p*r-x*s*l+e*p*l+o*s*u-e*c*u)*C,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*g+e*c*g)*C,t[8]=b*C,t[9]=(x*d*r-h*y*r-x*n*g+e*y*g+h*n*u-e*d*u)*C,t[10]=(o*y*r-x*a*r+x*n*l-e*y*l-o*n*u+e*a*u)*C,t[11]=(h*a*r-o*d*r-h*n*l+e*d*l+o*n*g-e*a*g)*C,t[12]=N*C,t[13]=(h*y*s-x*d*s+x*n*f-e*y*f-h*n*p+e*d*p)*C,t[14]=(x*a*s-o*y*s-x*n*c+e*y*c+o*n*p-e*a*p)*C,t[15]=(o*d*s-h*a*s+h*n*c-e*d*c-o*n*f+e*a*f)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,d=a+a,f=r*l,g=r*h,x=r*d,y=o*h,p=o*d,u=a*d,A=c*l,_=c*h,b=c*d,N=n.x,I=n.y,C=n.z;return s[0]=(1-(y+u))*N,s[1]=(g+b)*N,s[2]=(x-_)*N,s[3]=0,s[4]=(g-b)*I,s[5]=(1-(f+u))*I,s[6]=(p+A)*I,s[7]=0,s[8]=(x+_)*C,s[9]=(p-A)*C,s[10]=(1-(f+y))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Si.set(s[0],s[1],s[2]).length(),o=Si.set(s[4],s[5],s[6]).length(),a=Si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);let l=1/r,h=1/o,d=1/a;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=d,fn.elements[9]*=d,fn.elements[10]*=d,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Dn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),g,x;if(a===Dn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===dr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Dn){let c=this.elements,l=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*l,g=(n+s)*h,x,y;if(a===Dn)x=(o+r)*d,y=-2*d;else if(a===dr)x=r*d,y=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-g,c[2]=0,c[6]=0,c[10]=y,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Si=new G,fn=new be,Yh=new G(0,0,0),Zh=new G(1,1,1),Hn=new G,Fs=new G,je=new G,gc=new be,_c=new Jn,yr=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],g=s[10];switch(e){case"XYZ":this._y=Math.asin(Ue(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ue(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ue(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ue(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ue(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-Ue(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return gc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(gc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _c.setFromEuler(this),this.setFromQuaternion(_c,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};yr.DEFAULT_ORDER="XYZ";var vr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Jh=0,xc=new G,bi=new Jn,Rn=new be,Bs=new G,ss=new G,$h=new G,Kh=new Jn,yc=new G(1,0,0),vc=new G(0,1,0),Mc=new G(0,0,1),jh={type:"added"},Qh={type:"removed"},ze=class i extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jh++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new G,e=new yr,n=new Jn,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new be},normalMatrix:{value:new $t}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.multiply(bi),this}rotateOnWorldAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.premultiply(bi),this}rotateX(t){return this.rotateOnAxis(yc,t)}rotateY(t){return this.rotateOnAxis(vc,t)}rotateZ(t){return this.rotateOnAxis(Mc,t)}translateOnAxis(t,e){return xc.copy(t).applyQuaternion(this.quaternion),this.position.add(xc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(yc,t)}translateY(t){return this.translateOnAxis(vc,t)}translateZ(t){return this.translateOnAxis(Mc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Bs.copy(t):Bs.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(ss,Bs,this.up):Rn.lookAt(Bs,ss,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),bi.setFromRotationMatrix(Rn),this.quaternion.premultiply(bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(jh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qh)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,$h),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,Kh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),g=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ze.DEFAULT_UP=new G(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pn=new G,Cn=new G,ca=new G,Pn=new G,Ei=new G,wi=new G,Sc=new G,la=new G,ha=new G,ua=new G,zs=!1,Di=class i{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),Cn.subVectors(n,e),ca.subVectors(t,e);let o=pn.dot(pn),a=pn.dot(Cn),c=pn.dot(ca),l=Cn.dot(Cn),h=Cn.dot(ca),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,g=(l*c-a*h)*f,x=(o*h-a*c)*f;return r.set(1-g-x,x,g)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getUV(t,e,n,s,r,o,a,c){return zs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),zs=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pn.x),c.addScaledVector(o,Pn.y),c.addScaledVector(a,Pn.z),c)}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),Cn.subVectors(t,e),pn.cross(Cn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),pn.cross(Cn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return zs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),zs=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Ei.subVectors(s,n),wi.subVectors(r,n),la.subVectors(t,n);let c=Ei.dot(la),l=wi.dot(la);if(c<=0&&l<=0)return e.copy(n);ha.subVectors(t,s);let h=Ei.dot(ha),d=wi.dot(ha);if(h>=0&&d<=h)return e.copy(s);let f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ei,o);ua.subVectors(t,r);let g=Ei.dot(ua),x=wi.dot(ua);if(x>=0&&g<=x)return e.copy(r);let y=g*l-c*x;if(y<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(n).addScaledVector(wi,a);let p=h*x-g*d;if(p<=0&&d-h>=0&&g-x>=0)return Sc.subVectors(r,s),a=(d-h)/(d-h+(g-x)),e.copy(s).addScaledVector(Sc,a);let u=1/(p+y+f);return o=y*u,a=f*u,e.copy(n).addScaledVector(Ei,o).addScaledVector(wi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},vl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function da(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Kt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=we){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=So(t,1),e=Ue(e,0,1),n=Ue(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=da(o,r,t+1/3),this.g=da(o,r,t),this.b=da(o,r,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=we){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=we){let n=vl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zi(t.r),this.g=zi(t.g),this.b=zi(t.b),this}copyLinearToSRGB(t){return this.r=ta(t.r),this.g=ta(t.g),this.b=ta(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=we){return le.fromWorkingColorSpace(He.copy(this),t),Math.round(Ue(He.r*255,0,255))*65536+Math.round(Ue(He.g*255,0,255))*256+Math.round(Ue(He.b*255,0,255))}getHexString(t=we){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(He.copy(this),e);let n=He.r,s=He.g,r=He.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=we){le.fromWorkingColorSpace(He.copy(this),t);let e=He.r,n=He.g,s=He.b;return t!==we?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vn),this.setHSL(Vn.h+t,Vn.s+e,Vn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vn),t.getHSL(ks);let n=os(Vn.h,ks.h,e),s=os(Vn.s,ks.s,e),r=os(Vn.l,ks.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},He=new Kt;Kt.NAMES=vl;var tu=0,$n=class extends Zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=Bi,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wa,this.blendDst=Ta,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Kt(0,0,0),this.blendAlpha=0,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bi&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ta&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},qi=class extends $n{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Se=new G,Hs=new yt,Ye=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=lc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hs.fromBufferAttribute(this,e),Hs.applyMatrix3(t),this.setXY(e,Hs.x,Hs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ui(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lc&&(t.usage=this.usage),t}};var Mr=class extends Ye{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Sr=class extends Ye{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ze=class extends Ye{constructor(t,e,n){super(new Float32Array(t),e,n)}};var eu=0,nn=new be,fa=new ze,Ti=new G,Qe=new ci,rs=new ci,Le=new G,en=class i extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yl(t)?Sr:Mr)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,n){return nn.makeTranslation(t,e,n),this.applyMatrix4(nn),this}scale(t,e,n){return nn.makeScale(t,e,n),this.applyMatrix4(nn),this}lookAt(t){return fa.lookAt(t),fa.updateMatrix(),this.applyMatrix4(fa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ze(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new G,1/0);return}if(t){let n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];rs.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(Qe.min,rs.min),Qe.expandByPoint(Le),Le.addVectors(Qe.max,rs.max),Qe.expandByPoint(Le)):(Qe.expandByPoint(rs.min),Qe.expandByPoint(rs.max))}Qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Le.fromBufferAttribute(a,l),c&&(Ti.fromBufferAttribute(t,l),Le.add(Ti)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ye(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let T=0;T<a;T++)l[T]=new G,h[T]=new G;let d=new G,f=new G,g=new G,x=new yt,y=new yt,p=new yt,u=new G,A=new G;function _(T,Y,K){d.fromArray(s,T*3),f.fromArray(s,Y*3),g.fromArray(s,K*3),x.fromArray(o,T*2),y.fromArray(o,Y*2),p.fromArray(o,K*2),f.sub(d),g.sub(d),y.sub(x),p.sub(x);let dt=1/(y.x*p.y-p.x*y.y);isFinite(dt)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(g,-y.y).multiplyScalar(dt),A.copy(g).multiplyScalar(y.x).addScaledVector(f,-p.x).multiplyScalar(dt),l[T].add(u),l[Y].add(u),l[K].add(u),h[T].add(A),h[Y].add(A),h[K].add(A))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let T=0,Y=b.length;T<Y;++T){let K=b[T],dt=K.start,U=K.count;for(let q=dt,tt=dt+U;q<tt;q+=3)_(n[q+0],n[q+1],n[q+2])}let N=new G,I=new G,C=new G,j=new G;function M(T){C.fromArray(r,T*3),j.copy(C);let Y=l[T];N.copy(Y),N.sub(C.multiplyScalar(C.dot(Y))).normalize(),I.crossVectors(j,Y);let dt=I.dot(h[T])<0?-1:1;c[T*4]=N.x,c[T*4+1]=N.y,c[T*4+2]=N.z,c[T*4+3]=dt}for(let T=0,Y=b.length;T<Y;++T){let K=b[T],dt=K.start,U=K.count;for(let q=dt,tt=dt+U;q<tt;q+=3)M(n[q+0]),M(n[q+1]),M(n[q+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);let s=new G,r=new G,o=new G,a=new G,c=new G,l=new G,h=new G,d=new G;if(t)for(let f=0,g=t.count;f<g;f+=3){let x=t.getX(f+0),y=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,g=e.count;f<g;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,d=a.normalized,f=new l.constructor(c.length*h),g=0,x=0;for(let y=0,p=c.length;y<p;y++){a.isInterleavedBufferAttribute?g=c[y]*a.data.stride+a.offset:g=c[y]*h;for(let u=0;u<h;u++)f[x++]=l[g++]}return new Ye(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let f=l[h],g=t(f,n);c.push(g)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){let g=l[d];h.push(g.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let f=0,g=d.length;f<g;f++)h.push(d[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},bc=new be,ti=new xr,Vs=new Xi,Ec=new G,Ai=new G,Ri=new G,Ci=new G,pa=new G,Gs=new G,Ws=new yt,Xs=new yt,qs=new yt,wc=new G,Tc=new G,Ac=new G,Ys=new G,Zs=new G,Fe=class extends ze{constructor(t=new en,e=new qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Gs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(pa.fromBufferAttribute(d,t),o?Gs.addScaledVector(pa,h):Gs.addScaledVector(pa.sub(e),h))}e.add(Gs)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(r),ti.copy(t.ray).recast(t.near),!(Vs.containsPoint(ti.origin)===!1&&(ti.intersectSphere(Vs,Ec)===null||ti.origin.distanceToSquared(Ec)>(t.far-t.near)**2))&&(bc.copy(r).invert(),ti.copy(t.ray).applyMatrix4(bc),!(n.boundingBox!==null&&ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ti)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,y=f.length;x<y;x++){let p=f[x],u=o[p.materialIndex],A=Math.max(p.start,g.start),_=Math.min(a.count,Math.min(p.start+p.count,g.start+g.count));for(let b=A,N=_;b<N;b+=3){let I=a.getX(b),C=a.getX(b+1),j=a.getX(b+2);s=Js(this,u,t,n,l,h,d,I,C,j),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),y=Math.min(a.count,g.start+g.count);for(let p=x,u=y;p<u;p+=3){let A=a.getX(p),_=a.getX(p+1),b=a.getX(p+2);s=Js(this,o,t,n,l,h,d,A,_,b),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,y=f.length;x<y;x++){let p=f[x],u=o[p.materialIndex],A=Math.max(p.start,g.start),_=Math.min(c.count,Math.min(p.start+p.count,g.start+g.count));for(let b=A,N=_;b<N;b+=3){let I=b,C=b+1,j=b+2;s=Js(this,u,t,n,l,h,d,I,C,j),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),y=Math.min(c.count,g.start+g.count);for(let p=x,u=y;p<u;p+=3){let A=p,_=p+1,b=p+2;s=Js(this,o,t,n,l,h,d,A,_,b),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function nu(i,t,e,n,s,r,o,a){let c;if(t.side===$e?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Sn,a),c===null)return null;Zs.copy(a),Zs.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Zs);return l<e.near||l>e.far?null:{distance:l,point:Zs.clone(),object:i}}function Js(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Ai),i.getVertexPosition(c,Ri),i.getVertexPosition(l,Ci);let h=nu(i,t,e,n,Ai,Ri,Ci,Ys);if(h){s&&(Ws.fromBufferAttribute(s,a),Xs.fromBufferAttribute(s,c),qs.fromBufferAttribute(s,l),h.uv=Di.getInterpolation(Ys,Ai,Ri,Ci,Ws,Xs,qs,new yt)),r&&(Ws.fromBufferAttribute(r,a),Xs.fromBufferAttribute(r,c),qs.fromBufferAttribute(r,l),h.uv1=Di.getInterpolation(Ys,Ai,Ri,Ci,Ws,Xs,qs,new yt),h.uv2=h.uv1),o&&(wc.fromBufferAttribute(o,a),Tc.fromBufferAttribute(o,c),Ac.fromBufferAttribute(o,l),h.normal=Di.getInterpolation(Ys,Ai,Ri,Ci,wc,Tc,Ac,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new G,materialIndex:0};Di.getNormal(Ai,Ri,Ci,d.normal),h.face=d}return h}var ps=class i extends en{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],f=0,g=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ze(l,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(d,2));function x(y,p,u,A,_,b,N,I,C,j,M){let T=b/C,Y=N/j,K=b/2,dt=N/2,U=I/2,q=C+1,tt=j+1,Q=0,z=0,rt=new G;for(let ut=0;ut<tt;ut++){let _t=ut*Y-dt;for(let Mt=0;Mt<q;Mt++){let it=Mt*T-K;rt[y]=it*A,rt[p]=_t*_,rt[u]=U,l.push(rt.x,rt.y,rt.z),rt[y]=0,rt[p]=0,rt[u]=I>0?1:-1,h.push(rt.x,rt.y,rt.z),d.push(Mt/C),d.push(1-ut/j),Q+=1}}for(let ut=0;ut<j;ut++)for(let _t=0;_t<C;_t++){let Mt=f+_t+q*ut,it=f+_t+q*(ut+1),L=f+(_t+1)+q*(ut+1),P=f+(_t+1)+q*ut;c.push(Mt,it,P),c.push(it,L,P),z+=6}a.addGroup(g,z,M),g+=z,f+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Yi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Xe(i){let t={};for(let e=0;e<i.length;e++){let n=Yi(i[e]);for(let s in n)t[s]=n[s]}return t}function iu(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ml(i){return i.getRenderTarget()===null?i.outputColorSpace:le.workingColorSpace}var su={clone:Yi,merge:Xe},ru=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,au=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends $n{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ru,this.fragmentShader=au,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Yi(t.uniforms),this.uniformsGroups=iu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},br=class extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=Dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ve=class extends br{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Wi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wi*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(as*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Pi=-90,Ii=1,Na=class extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ve(Pi,Ii,t,e);s.layers=this.layers,this.add(s);let r=new Ve(Pi,Ii,t,e);r.layers=this.layers,this.add(r);let o=new Ve(Pi,Ii,t,e);o.layers=this.layers,this.add(o);let a=new Ve(Pi,Ii,t,e);a.layers=this.layers,this.add(a);let c=new Ve(Pi,Ii,t,e);c.layers=this.layers,this.add(c);let l=new Ve(Pi,Ii,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),g=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,f,g),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},Er=class extends on{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Hi,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Oa=class extends Fn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(cs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===oi?we:an),this.texture=new Er(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ps(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:Xn});r.uniforms.tEquirect.value=e;let o=new Fe(s,r),a=e.minFilter;return e.minFilter===ds&&(e.minFilter=sn),new Na(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},ma=new G,ou=new G,cu=new $t,Un=class{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=ma.subVectors(n,e).cross(ou.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(ma),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||cu.getNormalMatrix(t),s=this.coplanarPoint(ma).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ei=new Xi,$s=new G,ms=class{constructor(t=new Un,e=new Un,n=new Un,s=new Un,r=new Un,o=new Un){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],f=s[7],g=s[8],x=s[9],y=s[10],p=s[11],u=s[12],A=s[13],_=s[14],b=s[15];if(n[0].setComponents(c-r,f-l,p-g,b-u).normalize(),n[1].setComponents(c+r,f+l,p+g,b+u).normalize(),n[2].setComponents(c+o,f+h,p+x,b+A).normalize(),n[3].setComponents(c-o,f-h,p-x,b-A).normalize(),n[4].setComponents(c-a,f-d,p-y,b-_).normalize(),e===Dn)n[5].setComponents(c+a,f+d,p+y,b+_).normalize();else if(e===dr)n[5].setComponents(a,d,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(t){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if($s.x=s.normal.x>0?t.max.x:t.min.x,$s.y=s.normal.y>0?t.max.y:t.min.y,$s.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint($s)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Sl(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lu(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let d=l.array,f=l.usage,g=d.byteLength,x=i.createBuffer();i.bindBuffer(h,x),i.bufferData(h,d,f),l.onUploadCallback();let y;if(d instanceof Float32Array)y=i.FLOAT;else if(d instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)y=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else y=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)y=i.SHORT;else if(d instanceof Uint32Array)y=i.UNSIGNED_INT;else if(d instanceof Int32Array)y=i.INT;else if(d instanceof Int8Array)y=i.BYTE;else if(d instanceof Uint8Array)y=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)y=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:x,type:y,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:g}}function r(l,h,d){let f=h.array,g=h._updateRange,x=h.updateRanges;if(i.bindBuffer(d,l),g.count===-1&&x.length===0&&i.bufferSubData(d,0,f),x.length!==0){for(let y=0,p=x.length;y<p;y++){let u=x[y];e?i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}g.count!==-1&&(e?i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f,g.offset,g.count):i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let d=n.get(l);if(d===void 0)n.set(l,s(l,h));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,l,h),d.version=l.version}}return{get:o,remove:a,update:c}}var Zi=class i extends en{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=t/a,f=e/c,g=[],x=[],y=[],p=[];for(let u=0;u<h;u++){let A=u*f-o;for(let _=0;_<l;_++){let b=_*d-r;x.push(b,-A,0),y.push(0,0,1),p.push(_/a),p.push(1-u/c)}}for(let u=0;u<c;u++)for(let A=0;A<a;A++){let _=A+l*u,b=A+l*(u+1),N=A+1+l*(u+1),I=A+1+l*u;g.push(_,b,I),g.push(b,N,I)}this.setIndex(g),this.setAttribute("position",new Ze(x,3)),this.setAttribute("normal",new Ze(y,3)),this.setAttribute("uv",new Ze(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},hu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uu=`#ifdef USE_ALPHAHASH
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
#endif`,du=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,mu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gu=`#ifdef USE_AOMAP
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
#endif`,_u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xu=`#ifdef USE_BATCHING
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
#endif`,yu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,vu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Su=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bu=`#ifdef USE_IRIDESCENCE
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
#endif`,Eu=`#ifdef USE_BUMPMAP
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
#endif`,wu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Au=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ru=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Iu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Lu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Uu=`#define PI 3.141592653589793
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
} // validated`,Du=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Nu=`vec3 transformedNormal = objectNormal;
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
#endif`,Ou=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ku="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hu=`
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
}`,Vu=`#ifdef USE_ENVMAP
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
#endif`,Gu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wu=`#ifdef USE_ENVMAP
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
#endif`,Xu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qu=`#ifdef USE_ENVMAP
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
#endif`,Yu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ju=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ku=`#ifdef USE_GRADIENTMAP
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
}`,ju=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Qu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ed=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nd=`uniform bool receiveShadow;
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
#endif`,id=`#ifdef USE_ENVMAP
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
#endif`,sd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ad=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,od=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cd=`PhysicalMaterial material;
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
#endif`,ld=`struct PhysicalMaterial {
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
}`,hd=`
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
#endif`,ud=`#if defined( RE_IndirectDiffuse )
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
#endif`,dd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,md=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,gd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,_d=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vd=`#if defined( USE_POINTS_UV )
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
#endif`,Md=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ed=`#ifdef USE_MORPHNORMALS
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
#endif`,wd=`#ifdef USE_MORPHTARGETS
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
#endif`,Td=`#ifdef USE_MORPHTARGETS
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
#endif`,Ad=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Id=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ld=`#ifdef USE_NORMALMAP
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
#endif`,Ud=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Od=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zd=`float getShadowMask() {
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
}`,Jd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$d=`#ifdef USE_SKINNING
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
#endif`,Kd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jd=`#ifdef USE_SKINNING
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
#endif`,Qd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ef=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,sf=`#ifdef USE_TRANSMISSION
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
#endif`,rf=`#ifdef USE_TRANSMISSION
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
#endif`,af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,of=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,hf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,uf=`uniform sampler2D t2D;
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
}`,df=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ff=`#ifdef ENVMAP_TYPE_CUBE
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
}`,pf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gf=`#include <common>
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
}`,_f=`#if DEPTH_PACKING == 3200
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
}`,xf=`#define DISTANCE
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
}`,yf=`#define DISTANCE
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
}`,vf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sf=`uniform float scale;
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
}`,bf=`uniform vec3 diffuse;
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
}`,Ef=`#include <common>
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
}`,wf=`uniform vec3 diffuse;
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
}`,Tf=`#define LAMBERT
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
}`,Af=`#define LAMBERT
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
}`,Rf=`#define MATCAP
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
}`,Cf=`#define MATCAP
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
}`,Pf=`#define NORMAL
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
}`,If=`#define NORMAL
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
}`,Lf=`#define PHONG
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
}`,Uf=`#define PHONG
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
}`,Df=`#define STANDARD
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
}`,Nf=`#define STANDARD
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
}`,Of=`#define TOON
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
}`,Ff=`#define TOON
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
}`,Bf=`uniform float size;
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
}`,zf=`uniform vec3 diffuse;
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
}`,kf=`#include <common>
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
}`,Hf=`uniform vec3 color;
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
}`,Vf=`uniform float rotation;
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
}`,Gf=`uniform vec3 diffuse;
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
}`,te={alphahash_fragment:hu,alphahash_pars_fragment:uu,alphamap_fragment:du,alphamap_pars_fragment:fu,alphatest_fragment:pu,alphatest_pars_fragment:mu,aomap_fragment:gu,aomap_pars_fragment:_u,batching_pars_vertex:xu,batching_vertex:yu,begin_vertex:vu,beginnormal_vertex:Mu,bsdfs:Su,iridescence_fragment:bu,bumpmap_pars_fragment:Eu,clipping_planes_fragment:wu,clipping_planes_pars_fragment:Tu,clipping_planes_pars_vertex:Au,clipping_planes_vertex:Ru,color_fragment:Cu,color_pars_fragment:Pu,color_pars_vertex:Iu,color_vertex:Lu,common:Uu,cube_uv_reflection_fragment:Du,defaultnormal_vertex:Nu,displacementmap_pars_vertex:Ou,displacementmap_vertex:Fu,emissivemap_fragment:Bu,emissivemap_pars_fragment:zu,colorspace_fragment:ku,colorspace_pars_fragment:Hu,envmap_fragment:Vu,envmap_common_pars_fragment:Gu,envmap_pars_fragment:Wu,envmap_pars_vertex:Xu,envmap_physical_pars_fragment:id,envmap_vertex:qu,fog_vertex:Yu,fog_pars_vertex:Zu,fog_fragment:Ju,fog_pars_fragment:$u,gradientmap_pars_fragment:Ku,lightmap_fragment:ju,lightmap_pars_fragment:Qu,lights_lambert_fragment:td,lights_lambert_pars_fragment:ed,lights_pars_begin:nd,lights_toon_fragment:sd,lights_toon_pars_fragment:rd,lights_phong_fragment:ad,lights_phong_pars_fragment:od,lights_physical_fragment:cd,lights_physical_pars_fragment:ld,lights_fragment_begin:hd,lights_fragment_maps:ud,lights_fragment_end:dd,logdepthbuf_fragment:fd,logdepthbuf_pars_fragment:pd,logdepthbuf_pars_vertex:md,logdepthbuf_vertex:gd,map_fragment:_d,map_pars_fragment:xd,map_particle_fragment:yd,map_particle_pars_fragment:vd,metalnessmap_fragment:Md,metalnessmap_pars_fragment:Sd,morphcolor_vertex:bd,morphnormal_vertex:Ed,morphtarget_pars_vertex:wd,morphtarget_vertex:Td,normal_fragment_begin:Ad,normal_fragment_maps:Rd,normal_pars_fragment:Cd,normal_pars_vertex:Pd,normal_vertex:Id,normalmap_pars_fragment:Ld,clearcoat_normal_fragment_begin:Ud,clearcoat_normal_fragment_maps:Dd,clearcoat_pars_fragment:Nd,iridescence_pars_fragment:Od,opaque_fragment:Fd,packing:Bd,premultiplied_alpha_fragment:zd,project_vertex:kd,dithering_fragment:Hd,dithering_pars_fragment:Vd,roughnessmap_fragment:Gd,roughnessmap_pars_fragment:Wd,shadowmap_pars_fragment:Xd,shadowmap_pars_vertex:qd,shadowmap_vertex:Yd,shadowmask_pars_fragment:Zd,skinbase_vertex:Jd,skinning_pars_vertex:$d,skinning_vertex:Kd,skinnormal_vertex:jd,specularmap_fragment:Qd,specularmap_pars_fragment:tf,tonemapping_fragment:ef,tonemapping_pars_fragment:nf,transmission_fragment:sf,transmission_pars_fragment:rf,uv_pars_fragment:af,uv_pars_vertex:of,uv_vertex:cf,worldpos_vertex:lf,background_vert:hf,background_frag:uf,backgroundCube_vert:df,backgroundCube_frag:ff,cube_vert:pf,cube_frag:mf,depth_vert:gf,depth_frag:_f,distanceRGBA_vert:xf,distanceRGBA_frag:yf,equirect_vert:vf,equirect_frag:Mf,linedashed_vert:Sf,linedashed_frag:bf,meshbasic_vert:Ef,meshbasic_frag:wf,meshlambert_vert:Tf,meshlambert_frag:Af,meshmatcap_vert:Rf,meshmatcap_frag:Cf,meshnormal_vert:Pf,meshnormal_frag:If,meshphong_vert:Lf,meshphong_frag:Uf,meshphysical_vert:Df,meshphysical_frag:Nf,meshtoon_vert:Of,meshtoon_frag:Ff,points_vert:Bf,points_frag:zf,shadow_vert:kf,shadow_frag:Hf,sprite_vert:Vf,sprite_frag:Gf},Tt={common:{diffuse:{value:new Kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new Kt(16777215)},opacity:{value:1},center:{value:new yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},Mn={basic:{uniforms:Xe([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:te.meshbasic_vert,fragmentShader:te.meshbasic_frag},lambert:{uniforms:Xe([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:te.meshlambert_vert,fragmentShader:te.meshlambert_frag},phong:{uniforms:Xe([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Kt(0)},specular:{value:new Kt(1118481)},shininess:{value:30}}]),vertexShader:te.meshphong_vert,fragmentShader:te.meshphong_frag},standard:{uniforms:Xe([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag},toon:{uniforms:Xe([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:te.meshtoon_vert,fragmentShader:te.meshtoon_frag},matcap:{uniforms:Xe([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:te.meshmatcap_vert,fragmentShader:te.meshmatcap_frag},points:{uniforms:Xe([Tt.points,Tt.fog]),vertexShader:te.points_vert,fragmentShader:te.points_frag},dashed:{uniforms:Xe([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:te.linedashed_vert,fragmentShader:te.linedashed_frag},depth:{uniforms:Xe([Tt.common,Tt.displacementmap]),vertexShader:te.depth_vert,fragmentShader:te.depth_frag},normal:{uniforms:Xe([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:te.meshnormal_vert,fragmentShader:te.meshnormal_frag},sprite:{uniforms:Xe([Tt.sprite,Tt.fog]),vertexShader:te.sprite_vert,fragmentShader:te.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:te.background_vert,fragmentShader:te.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:te.backgroundCube_vert,fragmentShader:te.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:te.cube_vert,fragmentShader:te.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:te.equirect_vert,fragmentShader:te.equirect_frag},distanceRGBA:{uniforms:Xe([Tt.common,Tt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:te.distanceRGBA_vert,fragmentShader:te.distanceRGBA_frag},shadow:{uniforms:Xe([Tt.lights,Tt.fog,{color:{value:new Kt(0)},opacity:{value:1}}]),vertexShader:te.shadow_vert,fragmentShader:te.shadow_frag}};Mn.physical={uniforms:Xe([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new Kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new Kt(0)},specularColor:{value:new Kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:te.meshphysical_vert,fragmentShader:te.meshphysical_frag};var Ks={r:0,b:0,g:0};function Wf(i,t,e,n,s,r,o){let a=new Kt(0),c=r===!0?0:1,l,h,d=null,f=0,g=null;function x(p,u){let A=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?y(a,c):_&&_.isColor&&(y(_,1),A=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||A)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===kr)?(h===void 0&&(h=new Fe(new ps(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Yi(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,I,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=le.getTransfer(_.colorSpace)!==pe,(d!==_||f!==_.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Fe(new Zi(2,2),new _n({name:"BackgroundMaterial",uniforms:Yi(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,l.material.toneMapped=le.getTransfer(_.colorSpace)!==pe,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||g!==i.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function y(p,u){p.getRGB(Ks,Ml(i)),n.buffers.color.setClear(Ks.r,Ks.g,Ks.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),c=u,y(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,y(a,c)},render:x}}function Xf(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null),l=c,h=!1;function d(U,q,tt,Q,z){let rt=!1;if(o){let ut=y(Q,tt,q);l!==ut&&(l=ut,g(l.object)),rt=u(U,Q,tt,z),rt&&A(U,Q,tt,z)}else{let ut=q.wireframe===!0;(l.geometry!==Q.id||l.program!==tt.id||l.wireframe!==ut)&&(l.geometry=Q.id,l.program=tt.id,l.wireframe=ut,rt=!0)}z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(rt||h)&&(h=!1,j(U,q,tt,Q),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function g(U){return n.isWebGL2?i.bindVertexArray(U):r.bindVertexArrayOES(U)}function x(U){return n.isWebGL2?i.deleteVertexArray(U):r.deleteVertexArrayOES(U)}function y(U,q,tt){let Q=tt.wireframe===!0,z=a[U.id];z===void 0&&(z={},a[U.id]=z);let rt=z[q.id];rt===void 0&&(rt={},z[q.id]=rt);let ut=rt[Q];return ut===void 0&&(ut=p(f()),rt[Q]=ut),ut}function p(U){let q=[],tt=[],Q=[];for(let z=0;z<s;z++)q[z]=0,tt[z]=0,Q[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:q,enabledAttributes:tt,attributeDivisors:Q,object:U,attributes:{},index:null}}function u(U,q,tt,Q){let z=l.attributes,rt=q.attributes,ut=0,_t=tt.getAttributes();for(let Mt in _t)if(_t[Mt].location>=0){let L=z[Mt],P=rt[Mt];if(P===void 0&&(Mt==="instanceMatrix"&&U.instanceMatrix&&(P=U.instanceMatrix),Mt==="instanceColor"&&U.instanceColor&&(P=U.instanceColor)),L===void 0||L.attribute!==P||P&&L.data!==P.data)return!0;ut++}return l.attributesNum!==ut||l.index!==Q}function A(U,q,tt,Q){let z={},rt=q.attributes,ut=0,_t=tt.getAttributes();for(let Mt in _t)if(_t[Mt].location>=0){let L=rt[Mt];L===void 0&&(Mt==="instanceMatrix"&&U.instanceMatrix&&(L=U.instanceMatrix),Mt==="instanceColor"&&U.instanceColor&&(L=U.instanceColor));let P={};P.attribute=L,L&&L.data&&(P.data=L.data),z[Mt]=P,ut++}l.attributes=z,l.attributesNum=ut,l.index=Q}function _(){let U=l.newAttributes;for(let q=0,tt=U.length;q<tt;q++)U[q]=0}function b(U){N(U,0)}function N(U,q){let tt=l.newAttributes,Q=l.enabledAttributes,z=l.attributeDivisors;tt[U]=1,Q[U]===0&&(i.enableVertexAttribArray(U),Q[U]=1),z[U]!==q&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,q),z[U]=q)}function I(){let U=l.newAttributes,q=l.enabledAttributes;for(let tt=0,Q=q.length;tt<Q;tt++)q[tt]!==U[tt]&&(i.disableVertexAttribArray(tt),q[tt]=0)}function C(U,q,tt,Q,z,rt,ut){ut===!0?i.vertexAttribIPointer(U,q,tt,z,rt):i.vertexAttribPointer(U,q,tt,Q,z,rt)}function j(U,q,tt,Q){if(n.isWebGL2===!1&&(U.isInstancedMesh||Q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let z=Q.attributes,rt=tt.getAttributes(),ut=q.defaultAttributeValues;for(let _t in rt){let Mt=rt[_t];if(Mt.location>=0){let it=z[_t];if(it===void 0&&(_t==="instanceMatrix"&&U.instanceMatrix&&(it=U.instanceMatrix),_t==="instanceColor"&&U.instanceColor&&(it=U.instanceColor)),it!==void 0){let L=it.normalized,P=it.itemSize,w=e.get(it);if(w===void 0)continue;let S=w.buffer,$=w.type,ct=w.bytesPerElement,W=n.isWebGL2===!0&&($===i.INT||$===i.UNSIGNED_INT||it.gpuType===ll);if(it.isInterleavedBufferAttribute){let ft=it.data,R=ft.stride,et=it.offset;if(ft.isInstancedInterleavedBuffer){for(let O=0;O<Mt.locationSize;O++)N(Mt.location+O,ft.meshPerAttribute);U.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let O=0;O<Mt.locationSize;O++)b(Mt.location+O);i.bindBuffer(i.ARRAY_BUFFER,S);for(let O=0;O<Mt.locationSize;O++)C(Mt.location+O,P/Mt.locationSize,$,L,R*ct,(et+P/Mt.locationSize*O)*ct,W)}else{if(it.isInstancedBufferAttribute){for(let ft=0;ft<Mt.locationSize;ft++)N(Mt.location+ft,it.meshPerAttribute);U.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let ft=0;ft<Mt.locationSize;ft++)b(Mt.location+ft);i.bindBuffer(i.ARRAY_BUFFER,S);for(let ft=0;ft<Mt.locationSize;ft++)C(Mt.location+ft,P/Mt.locationSize,$,L,P*ct,P/Mt.locationSize*ft*ct,W)}}else if(ut!==void 0){let L=ut[_t];if(L!==void 0)switch(L.length){case 2:i.vertexAttrib2fv(Mt.location,L);break;case 3:i.vertexAttrib3fv(Mt.location,L);break;case 4:i.vertexAttrib4fv(Mt.location,L);break;default:i.vertexAttrib1fv(Mt.location,L)}}}}I()}function M(){K();for(let U in a){let q=a[U];for(let tt in q){let Q=q[tt];for(let z in Q)x(Q[z].object),delete Q[z];delete q[tt]}delete a[U]}}function T(U){if(a[U.id]===void 0)return;let q=a[U.id];for(let tt in q){let Q=q[tt];for(let z in Q)x(Q[z].object),delete Q[z];delete q[tt]}delete a[U.id]}function Y(U){for(let q in a){let tt=a[q];if(tt[U.id]===void 0)continue;let Q=tt[U.id];for(let z in Q)x(Q[z].object),delete Q[z];delete tt[U.id]}}function K(){dt(),h=!0,l!==c&&(l=c,g(l.object))}function dt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:K,resetDefaultState:dt,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:Y,initAttributes:_,enableAttribute:b,disableUnusedAttributes:I}}function qf(i,t,e,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,d){i.drawArrays(r,h,d),e.update(d,r,1)}function c(h,d,f){if(f===0)return;let g,x;if(s)g=i,x="drawArraysInstanced";else if(g=t.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",g===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[x](r,h,d,f),e.update(d,r,f)}function l(h,d,f){if(f===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<f;x++)this.render(h[x],d[x]);else{g.multiDrawArraysWEBGL(r,h,0,d,0,f);let x=0;for(let y=0;y<f;y++)x+=d[y];e.update(x,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Yf(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),y=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,b=o||t.has("OES_texture_float"),N=_&&b,I=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:x,maxAttributes:y,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:A,vertexTextures:_,floatFragmentTextures:b,floatVertexTextures:N,maxSamples:I}}function Zf(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Un,a=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let g=d.length!==0||f||n!==0||s;return s=f,n=d.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,g){let x=d.clippingPlanes,y=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||x===null||x.length===0||r&&!p)r?h(null):l();else{let A=r?0:n,_=A*4,b=u.clippingState||null;c.value=b,b=h(x,f,_,g);for(let N=0;N!==_;++N)b[N]=e[N];u.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,g,x){let y=d!==null?d.length:0,p=null;if(y!==0){if(p=c.value,x!==!0||p===null){let u=g+y*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,b=g;_!==y;++_,b+=4)o.copy(d[_]).applyMatrix4(A,a),o.normal.toArray(p,b),p[b+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,p}}function Jf(i){let t=new WeakMap;function e(o,a){return a===Aa?o.mapping=Hi:a===Ra&&(o.mapping=Vi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Aa||a===Ra)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Oa(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var wr=class extends br{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ni=4,Rc=[.125,.215,.35,.446,.526,.582],si=20,ga=new wr,Cc=new Kt,_a=null,xa=0,ya=0,ni=(1+Math.sqrt(5))/2,Li=1/ni,Pc=[new G(1,1,1),new G(-1,1,1),new G(1,1,-1),new G(-1,1,-1),new G(0,ni,Li),new G(0,ni,-Li),new G(Li,0,ni),new G(-Li,0,ni),new G(ni,Li,0),new G(-ni,Li,0)],Ji=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){_a=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(_a,xa,ya),t.scissorTest=!1,js(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Hi||t.mapping===Vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),_a=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:fs,format:gn,colorSpace:On,depthBuffer:!1},s=Ic(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ic(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$f(r)),this._blurMaterial=Kf(r,t,e)}return s}_compileMaterial(t){let e=new Fe(this._lodPlanes[0],t);this._renderer.compile(e,ga)}_sceneToCubeUV(t,e,n,s){let a=new Ve(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Cc),h.toneMapping=qn,h.autoClear=!1;let g=new qi({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),x=new Fe(new ps,g),y=!1,p=t.background;p?p.isColor&&(g.color.copy(p),t.background=null,y=!0):(g.color.copy(Cc),y=!0);for(let u=0;u<6;u++){let A=u%3;A===0?(a.up.set(0,c[u],0),a.lookAt(l[u],0,0)):A===1?(a.up.set(0,0,c[u]),a.lookAt(0,l[u],0)):(a.up.set(0,c[u],0),a.lookAt(0,0,l[u]));let _=this._cubeSize;js(s,A*_,u>2?_:0,_,_),h.setRenderTarget(s),y&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Hi||t.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lc());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;js(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ga)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Pc[(s-1)%Pc.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Fe(this._lodPlanes[s],l),f=l.uniforms,g=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*si-1),y=r/x,p=isFinite(r)?1+Math.floor(h*y):si;p>si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${si}`);let u=[],A=0;for(let C=0;C<si;++C){let j=C/y,M=Math.exp(-j*j/2);u.push(M),C===0?A+=M:C<p&&(A+=2*M)}for(let C=0;C<u.length;C++)u[C]=u[C]/A;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=x,f.mipInt.value=_-n;let b=this._sizeLods[s],N=3*b*(s>_-Ni?s-_+Ni:0),I=4*(this._cubeSize-b);js(e,N,I,3*b,2*b),c.setRenderTarget(e),c.render(d,ga)}};function $f(i){let t=[],e=[],n=[],s=i,r=i-Ni+1+Rc.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ni?c=Rc[o-i+Ni-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,x=6,y=3,p=2,u=1,A=new Float32Array(y*x*g),_=new Float32Array(p*x*g),b=new Float32Array(u*x*g);for(let I=0;I<g;I++){let C=I%3*2/3-1,j=I>2?0:-1,M=[C,j,0,C+2/3,j,0,C+2/3,j+1,0,C,j,0,C+2/3,j+1,0,C,j+1,0];A.set(M,y*x*I),_.set(f,p*x*I);let T=[I,I,I,I,I,I];b.set(T,u*x*I)}let N=new en;N.setAttribute("position",new Ye(A,y)),N.setAttribute("uv",new Ye(_,p)),N.setAttribute("faceIndex",new Ye(b,u)),t.push(N),s>Ni&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ic(i,t,e){let n=new Fn(i,t,e);return n.texture.mapping=kr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function js(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Kf(i,t,e){let n=new Float32Array(si),s=new G(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:bo(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Lc(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bo(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Uc(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function bo(){return`

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
	`}function jf(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===Aa||c===Ra,h=c===Hi||c===Vi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new Ji(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(l&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new Ji(i));let f=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Qf(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tp(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let x in f.attributes)t.remove(f.attributes[x]);for(let x in f.morphAttributes){let y=f.morphAttributes[x];for(let p=0,u=y.length;p<u;p++)t.remove(y[p])}f.removeEventListener("dispose",o),delete s[f.id];let g=r.get(f);g&&(t.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(d){let f=d.attributes;for(let x in f)t.update(f[x],i.ARRAY_BUFFER);let g=d.morphAttributes;for(let x in g){let y=g[x];for(let p=0,u=y.length;p<u;p++)t.update(y[p],i.ARRAY_BUFFER)}}function l(d){let f=[],g=d.index,x=d.attributes.position,y=0;if(g!==null){let A=g.array;y=g.version;for(let _=0,b=A.length;_<b;_+=3){let N=A[_+0],I=A[_+1],C=A[_+2];f.push(N,I,I,C,C,N)}}else if(x!==void 0){let A=x.array;y=x.version;for(let _=0,b=A.length/3-1;_<b;_+=3){let N=_+0,I=_+1,C=_+2;f.push(N,I,I,C,C,N)}}else return;let p=new(yl(f)?Sr:Mr)(f,1);p.version=y;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let g=d.index;g!==null&&f.version<g.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function ep(i,t,e,n){let s=n.isWebGL2,r;function o(g){r=g}let a,c;function l(g){a=g.type,c=g.bytesPerElement}function h(g,x){i.drawElements(r,x,a,g*c),e.update(x,r,1)}function d(g,x,y){if(y===0)return;let p,u;if(s)p=i,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,x,a,g*c,y),e.update(x,r,y)}function f(g,x,y){if(y===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<y;u++)this.render(g[u]/c,x[u]);else{p.multiDrawElementsWEBGL(r,x,0,a,g,0,y);let u=0;for(let A=0;A<y;A++)u+=x[A];e.update(u,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function np(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ip(i,t){return i[0]-t[0]}function sp(i,t){return Math.abs(t[1])-Math.abs(i[1])}function rp(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new De,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,d){let f=l.morphTargetInfluences;if(t.isWebGL2===!0){let g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=g!==void 0?g.length:0,y=r.get(h);if(y===void 0||y.count!==x){let U=function(){K.dispose(),r.delete(h),h.removeEventListener("dispose",U)};y!==void 0&&y.texture.dispose();let A=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,N=h.morphAttributes.position||[],I=h.morphAttributes.normal||[],C=h.morphAttributes.color||[],j=0;A===!0&&(j=1),_===!0&&(j=2),b===!0&&(j=3);let M=h.attributes.position.count*j,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let Y=new Float32Array(M*T*4*x),K=new _r(Y,M,T,x);K.type=Wn,K.needsUpdate=!0;let dt=j*4;for(let q=0;q<x;q++){let tt=N[q],Q=I[q],z=C[q],rt=M*T*4*q;for(let ut=0;ut<tt.count;ut++){let _t=ut*dt;A===!0&&(o.fromBufferAttribute(tt,ut),Y[rt+_t+0]=o.x,Y[rt+_t+1]=o.y,Y[rt+_t+2]=o.z,Y[rt+_t+3]=0),_===!0&&(o.fromBufferAttribute(Q,ut),Y[rt+_t+4]=o.x,Y[rt+_t+5]=o.y,Y[rt+_t+6]=o.z,Y[rt+_t+7]=0),b===!0&&(o.fromBufferAttribute(z,ut),Y[rt+_t+8]=o.x,Y[rt+_t+9]=o.y,Y[rt+_t+10]=o.z,Y[rt+_t+11]=z.itemSize===4?o.w:1)}}y={count:x,texture:K,size:new yt(M,T)},r.set(h,y),h.addEventListener("dispose",U)}let p=0;for(let A=0;A<f.length;A++)p+=f[A];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",y.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",y.size)}else{let g=f===void 0?0:f.length,x=n[h.id];if(x===void 0||x.length!==g){x=[];for(let _=0;_<g;_++)x[_]=[_,0];n[h.id]=x}for(let _=0;_<g;_++){let b=x[_];b[0]=_,b[1]=f[_]}x.sort(sp);for(let _=0;_<8;_++)_<g&&x[_][1]?(a[_][0]=x[_][0],a[_][1]=x[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(ip);let y=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let b=a[_],N=b[0],I=b[1];N!==Number.MAX_SAFE_INTEGER&&I?(y&&h.getAttribute("morphTarget"+_)!==y[N]&&h.setAttribute("morphTarget"+_,y[N]),p&&h.getAttribute("morphNormal"+_)!==p[N]&&h.setAttribute("morphNormal"+_,p[N]),s[_]=I,u+=I):(y&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let A=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",A),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function ap(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Tr=class extends on{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:ai,h!==ai&&h!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ai&&(n=Gn),n===void 0&&h===Gi&&(n=ri),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:qe,this.minFilter=c!==void 0?c:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},bl=new on,El=new Tr(1,1);El.compareFunction=xl;var wl=new _r,Tl=new Da,Al=new Er,Dc=[],Nc=[],Oc=new Float32Array(16),Fc=new Float32Array(9),Bc=new Float32Array(4);function ji(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Dc[s];if(r===void 0&&(r=new Float32Array(s),Dc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Te(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Vr(i,t){let e=Nc[t];e===void 0&&(e=new Int32Array(t),Nc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function op(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function cp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function lp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function hp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function up(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Bc.set(n),i.uniformMatrix2fv(this.addr,!1,Bc),Ae(e,n)}}function dp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Fc.set(n),i.uniformMatrix3fv(this.addr,!1,Fc),Ae(e,n)}}function fp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Oc.set(n),i.uniformMatrix4fv(this.addr,!1,Oc),Ae(e,n)}}function pp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function mp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function gp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function _p(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function xp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function yp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function vp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Mp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function Sp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?El:bl;e.setTexture2D(t||r,s)}function bp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Tl,s)}function Ep(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Al,s)}function wp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||wl,s)}function Tp(i){switch(i){case 5126:return op;case 35664:return cp;case 35665:return lp;case 35666:return hp;case 35674:return up;case 35675:return dp;case 35676:return fp;case 5124:case 35670:return pp;case 35667:case 35671:return mp;case 35668:case 35672:return gp;case 35669:case 35673:return _p;case 5125:return xp;case 36294:return yp;case 36295:return vp;case 36296:return Mp;case 35678:case 36198:case 36298:case 36306:case 35682:return Sp;case 35679:case 36299:case 36307:return bp;case 35680:case 36300:case 36308:case 36293:return Ep;case 36289:case 36303:case 36311:case 36292:return wp}}function Ap(i,t){i.uniform1fv(this.addr,t)}function Rp(i,t){let e=ji(t,this.size,2);i.uniform2fv(this.addr,e)}function Cp(i,t){let e=ji(t,this.size,3);i.uniform3fv(this.addr,e)}function Pp(i,t){let e=ji(t,this.size,4);i.uniform4fv(this.addr,e)}function Ip(i,t){let e=ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Lp(i,t){let e=ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Up(i,t){let e=ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Dp(i,t){i.uniform1iv(this.addr,t)}function Np(i,t){i.uniform2iv(this.addr,t)}function Op(i,t){i.uniform3iv(this.addr,t)}function Fp(i,t){i.uniform4iv(this.addr,t)}function Bp(i,t){i.uniform1uiv(this.addr,t)}function zp(i,t){i.uniform2uiv(this.addr,t)}function kp(i,t){i.uniform3uiv(this.addr,t)}function Hp(i,t){i.uniform4uiv(this.addr,t)}function Vp(i,t,e){let n=this.cache,s=t.length,r=Vr(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||bl,r[o])}function Gp(i,t,e){let n=this.cache,s=t.length,r=Vr(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Tl,r[o])}function Wp(i,t,e){let n=this.cache,s=t.length,r=Vr(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Al,r[o])}function Xp(i,t,e){let n=this.cache,s=t.length,r=Vr(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||wl,r[o])}function qp(i){switch(i){case 5126:return Ap;case 35664:return Rp;case 35665:return Cp;case 35666:return Pp;case 35674:return Ip;case 35675:return Lp;case 35676:return Up;case 5124:case 35670:return Dp;case 35667:case 35671:return Np;case 35668:case 35672:return Op;case 35669:case 35673:return Fp;case 5125:return Bp;case 36294:return zp;case 36295:return kp;case 36296:return Hp;case 35678:case 36198:case 36298:case 36306:case 35682:return Vp;case 35679:case 36299:case 36307:return Gp;case 35680:case 36300:case 36308:case 36293:return Wp;case 36289:case 36303:case 36311:case 36292:return Xp}}var Fa=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tp(e.type)}},Ba=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qp(e.type)}},za=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},va=/(\w+)(\])?(\[|\.)?/g;function zc(i,t){i.seq.push(t),i.map[t.id]=t}function Yp(i,t,e){let n=i.name,s=n.length;for(va.lastIndex=0;;){let r=va.exec(n),o=va.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){zc(e,l===void 0?new Fa(a,i,t):new Ba(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new za(a),zc(e,d)),e=d}}}var ki=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Yp(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function kc(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Zp=37297,Jp=0;function $p(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Kp(i){let t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(i),n;switch(t===e?n="":t===ur&&e===hr?n="LinearDisplayP3ToLinearSRGB":t===hr&&e===ur&&(n="LinearSRGBToLinearDisplayP3"),i){case On:case Hr:return[n,"LinearTransferOETF"];case we:case Mo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Hc(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+$p(i.getShaderSource(t),o)}else return s}function jp(i,t){let e=Kp(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Qp(i,t){let e;switch(t){case sh:e="Linear";break;case rh:e="Reinhard";break;case ah:e="OptimizedCineon";break;case yo:e="ACESFilmic";break;case ch:e="AgX";break;case oh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function tm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Oi).join(`
`)}function em(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Oi).join(`
`)}function nm(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function im(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Oi(i){return i!==""}function Vc(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var sm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ka(i){return i.replace(sm,am)}var rm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function am(i,t){let e=te[t];if(e===void 0){let n=rm.get(t);if(n!==void 0)e=te[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ka(e)}var om=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wc(i){return i.replace(om,cm)}function cm(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function lm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===al?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===xo?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ln&&(t="SHADOWMAP_TYPE_VSM"),t}function hm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Vi:t="ENVMAP_TYPE_CUBE";break;case kr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function um(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Vi:t="ENVMAP_MODE_REFRACTION";break}return t}function dm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ol:t="ENVMAP_BLENDING_MULTIPLY";break;case nh:t="ENVMAP_BLENDING_MIX";break;case ih:t="ENVMAP_BLENDING_ADD";break}return t}function fm(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function pm(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=lm(e),l=hm(e),h=um(e),d=dm(e),f=fm(e),g=e.isWebGL2?"":tm(e),x=em(e),y=nm(r),p=s.createProgram(),u,A,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Oi).join(`
`),u.length>0&&(u+=`
`),A=[g,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Oi).join(`
`),A.length>0&&(A+=`
`)):(u=[Xc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oi).join(`
`),A=[g,Xc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==qn?"#define TONE_MAPPING":"",e.toneMapping!==qn?te.tonemapping_pars_fragment:"",e.toneMapping!==qn?Qp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",te.colorspace_pars_fragment,jp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Oi).join(`
`)),o=ka(o),o=Vc(o,e),o=Gc(o,e),a=ka(a),a=Vc(a,e),a=Gc(a,e),o=Wc(o),a=Wc(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,u=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,A=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===hc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===hc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);let b=_+u+o,N=_+A+a,I=kc(s,s.VERTEX_SHADER,b),C=kc(s,s.FRAGMENT_SHADER,N);s.attachShader(p,I),s.attachShader(p,C),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function j(K){if(i.debug.checkShaderErrors){let dt=s.getProgramInfoLog(p).trim(),U=s.getShaderInfoLog(I).trim(),q=s.getShaderInfoLog(C).trim(),tt=!0,Q=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,I,C);else{let z=Hc(s,I,"vertex"),rt=Hc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+dt+`
`+z+`
`+rt)}else dt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",dt):(U===""||q==="")&&(Q=!1);Q&&(K.diagnostics={runnable:tt,programLog:dt,vertexShader:{log:U,prefix:u},fragmentShader:{log:q,prefix:A}})}s.deleteShader(I),s.deleteShader(C),M=new ki(s,p),T=im(s,p)}let M;this.getUniforms=function(){return M===void 0&&j(this),M};let T;this.getAttributes=function(){return T===void 0&&j(this),T};let Y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return Y===!1&&(Y=s.getProgramParameter(p,Zp)),Y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=I,this.fragmentShader=C,this}var mm=0,Ha=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Va(t),e.set(t,n)),n}},Va=class{constructor(t){this.id=mm++,this.code=t,this.usedTimes=0}};function gm(i,t,e,n,s,r,o){let a=new vr,c=new Ha,l=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,g=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return M===0?"uv":`uv${M}`}function p(M,T,Y,K,dt){let U=K.fog,q=dt.geometry,tt=M.isMeshStandardMaterial?K.environment:null,Q=(M.isMeshStandardMaterial?e:t).get(M.envMap||tt),z=Q&&Q.mapping===kr?Q.image.height:null,rt=x[M.type];M.precision!==null&&(g=s.getMaxPrecision(M.precision),g!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",g,"instead."));let ut=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,_t=ut!==void 0?ut.length:0,Mt=0;q.morphAttributes.position!==void 0&&(Mt=1),q.morphAttributes.normal!==void 0&&(Mt=2),q.morphAttributes.color!==void 0&&(Mt=3);let it,L,P,w;if(rt){let Re=Mn[rt];it=Re.vertexShader,L=Re.fragmentShader}else it=M.vertexShader,L=M.fragmentShader,c.update(M),P=c.getVertexShaderID(M),w=c.getFragmentShaderID(M);let S=i.getRenderTarget(),$=dt.isInstancedMesh===!0,ct=dt.isBatchedMesh===!0,W=!!M.map,ft=!!M.matcap,R=!!Q,et=!!M.aoMap,O=!!M.lightMap,X=!!M.bumpMap,H=!!M.normalMap,mt=!!M.displacementMap,D=!!M.emissiveMap,m=!!M.metalnessMap,v=!!M.roughnessMap,k=M.anisotropy>0,gt=M.clearcoat>0,xt=M.iridescence>0,ht=M.sheen>0,Ut=M.transmission>0,St=k&&!!M.anisotropyMap,Pt=gt&&!!M.clearcoatMap,Ot=gt&&!!M.clearcoatNormalMap,Xt=gt&&!!M.clearcoatRoughnessMap,pt=xt&&!!M.iridescenceMap,Ft=xt&&!!M.iridescenceThicknessMap,Wt=ht&&!!M.sheenColorMap,kt=ht&&!!M.sheenRoughnessMap,zt=!!M.specularMap,Dt=!!M.specularColorMap,Qt=!!M.specularIntensityMap,re=Ut&&!!M.transmissionMap,he=Ut&&!!M.thicknessMap,ee=!!M.gradientMap,Et=!!M.alphaMap,F=M.alphaTest>0,Rt=!!M.alphaHash,At=!!M.extensions,qt=!!q.attributes.uv1,Vt=!!q.attributes.uv2,ae=!!q.attributes.uv3,oe=qn;return M.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(oe=i.toneMapping),{isWebGL2:h,shaderID:rt,shaderType:M.type,shaderName:M.name,vertexShader:it,fragmentShader:L,defines:M.defines,customVertexShaderID:P,customFragmentShaderID:w,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:g,batching:ct,instancing:$,instancingColor:$&&dt.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:S===null?i.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:On,map:W,matcap:ft,envMap:R,envMapMode:R&&Q.mapping,envMapCubeUVHeight:z,aoMap:et,lightMap:O,bumpMap:X,normalMap:H,displacementMap:f&&mt,emissiveMap:D,normalMapObjectSpace:H&&M.normalMapType===vh,normalMapTangentSpace:H&&M.normalMapType===_l,metalnessMap:m,roughnessMap:v,anisotropy:k,anisotropyMap:St,clearcoat:gt,clearcoatMap:Pt,clearcoatNormalMap:Ot,clearcoatRoughnessMap:Xt,iridescence:xt,iridescenceMap:pt,iridescenceThicknessMap:Ft,sheen:ht,sheenColorMap:Wt,sheenRoughnessMap:kt,specularMap:zt,specularColorMap:Dt,specularIntensityMap:Qt,transmission:Ut,transmissionMap:re,thicknessMap:he,gradientMap:ee,opaque:M.transparent===!1&&M.blending===Bi,alphaMap:Et,alphaTest:F,alphaHash:Rt,combine:M.combine,mapUv:W&&y(M.map.channel),aoMapUv:et&&y(M.aoMap.channel),lightMapUv:O&&y(M.lightMap.channel),bumpMapUv:X&&y(M.bumpMap.channel),normalMapUv:H&&y(M.normalMap.channel),displacementMapUv:mt&&y(M.displacementMap.channel),emissiveMapUv:D&&y(M.emissiveMap.channel),metalnessMapUv:m&&y(M.metalnessMap.channel),roughnessMapUv:v&&y(M.roughnessMap.channel),anisotropyMapUv:St&&y(M.anisotropyMap.channel),clearcoatMapUv:Pt&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:Ot&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Xt&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:kt&&y(M.sheenRoughnessMap.channel),specularMapUv:zt&&y(M.specularMap.channel),specularColorMapUv:Dt&&y(M.specularColorMap.channel),specularIntensityMapUv:Qt&&y(M.specularIntensityMap.channel),transmissionMapUv:re&&y(M.transmissionMap.channel),thicknessMapUv:he&&y(M.thicknessMap.channel),alphaMapUv:Et&&y(M.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(H||k),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,vertexUv1s:qt,vertexUv2s:Vt,vertexUv3s:ae,pointsUvs:dt.isPoints===!0&&!!q.attributes.uv&&(W||Et),fog:!!U,useFog:M.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:dt.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Mt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&Y.length>0,shadowMapType:i.shadowMap.type,toneMapping:oe,useLegacyLights:i._useLegacyLights,decodeVideoTexture:W&&M.map.isVideoTexture===!0&&le.getTransfer(M.map.colorSpace)===pe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===rn,flipSided:M.side===$e,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:At&&M.extensions.derivatives===!0,extensionFragDepth:At&&M.extensions.fragDepth===!0,extensionDrawBuffers:At&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:At&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:At&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){let T=[];if(M.shaderID?T.push(M.shaderID):(T.push(M.customVertexShaderID),T.push(M.customFragmentShaderID)),M.defines!==void 0)for(let Y in M.defines)T.push(Y),T.push(M.defines[Y]);return M.isRawShaderMaterial===!1&&(A(T,M),_(T,M),T.push(i.outputColorSpace)),T.push(M.customProgramCacheKey),T.join()}function A(M,T){M.push(T.precision),M.push(T.outputColorSpace),M.push(T.envMapMode),M.push(T.envMapCubeUVHeight),M.push(T.mapUv),M.push(T.alphaMapUv),M.push(T.lightMapUv),M.push(T.aoMapUv),M.push(T.bumpMapUv),M.push(T.normalMapUv),M.push(T.displacementMapUv),M.push(T.emissiveMapUv),M.push(T.metalnessMapUv),M.push(T.roughnessMapUv),M.push(T.anisotropyMapUv),M.push(T.clearcoatMapUv),M.push(T.clearcoatNormalMapUv),M.push(T.clearcoatRoughnessMapUv),M.push(T.iridescenceMapUv),M.push(T.iridescenceThicknessMapUv),M.push(T.sheenColorMapUv),M.push(T.sheenRoughnessMapUv),M.push(T.specularMapUv),M.push(T.specularColorMapUv),M.push(T.specularIntensityMapUv),M.push(T.transmissionMapUv),M.push(T.thicknessMapUv),M.push(T.combine),M.push(T.fogExp2),M.push(T.sizeAttenuation),M.push(T.morphTargetsCount),M.push(T.morphAttributeCount),M.push(T.numDirLights),M.push(T.numPointLights),M.push(T.numSpotLights),M.push(T.numSpotLightMaps),M.push(T.numHemiLights),M.push(T.numRectAreaLights),M.push(T.numDirLightShadows),M.push(T.numPointLightShadows),M.push(T.numSpotLightShadows),M.push(T.numSpotLightShadowsWithMaps),M.push(T.numLightProbes),M.push(T.shadowMapType),M.push(T.toneMapping),M.push(T.numClippingPlanes),M.push(T.numClipIntersection),M.push(T.depthPacking)}function _(M,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),T.alphaHash&&a.enable(18),T.batching&&a.enable(19),M.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function b(M){let T=x[M.type],Y;if(T){let K=Mn[T];Y=su.clone(K.uniforms)}else Y=M.uniforms;return Y}function N(M,T){let Y;for(let K=0,dt=l.length;K<dt;K++){let U=l[K];if(U.cacheKey===T){Y=U,++Y.usedTimes;break}}return Y===void 0&&(Y=new pm(i,T,M,r),l.push(Y)),Y}function I(M){if(--M.usedTimes===0){let T=l.indexOf(M);l[T]=l[l.length-1],l.pop(),M.destroy()}}function C(M){c.remove(M)}function j(){c.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:b,acquireProgram:N,releaseProgram:I,releaseShaderCache:C,programs:l,dispose:j}}function _m(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function xm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function qc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Yc(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,g,x,y,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:g,groupOrder:x,renderOrder:d.renderOrder,z:y,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=g,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=y,u.group=p),t++,u}function a(d,f,g,x,y,p){let u=o(d,f,g,x,y,p);g.transmission>0?n.push(u):g.transparent===!0?s.push(u):e.push(u)}function c(d,f,g,x,y,p){let u=o(d,f,g,x,y,p);g.transmission>0?n.unshift(u):g.transparent===!0?s.unshift(u):e.unshift(u)}function l(d,f){e.length>1&&e.sort(d||xm),n.length>1&&n.sort(f||qc),s.length>1&&s.sort(f||qc)}function h(){for(let d=t,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function ym(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Yc,i.set(n,[o])):s>=r.length?(o=new Yc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function vm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new Kt};break;case"SpotLight":e={position:new G,direction:new G,color:new Kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new Kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new Kt,groundColor:new Kt};break;case"RectAreaLight":e={color:new Kt,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function Mm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Sm=0;function bm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Em(i,t){let e=new vm,n=Mm(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new G);let r=new G,o=new be,a=new be;function c(h,d){let f=0,g=0,x=0;for(let K=0;K<9;K++)s.probe[K].set(0,0,0);let y=0,p=0,u=0,A=0,_=0,b=0,N=0,I=0,C=0,j=0,M=0;h.sort(bm);let T=d===!0?Math.PI:1;for(let K=0,dt=h.length;K<dt;K++){let U=h[K],q=U.color,tt=U.intensity,Q=U.distance,z=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)f+=q.r*tt*T,g+=q.g*tt*T,x+=q.b*tt*T;else if(U.isLightProbe){for(let rt=0;rt<9;rt++)s.probe[rt].addScaledVector(U.sh.coefficients[rt],tt);M++}else if(U.isDirectionalLight){let rt=e.get(U);if(rt.color.copy(U.color).multiplyScalar(U.intensity*T),U.castShadow){let ut=U.shadow,_t=n.get(U);_t.shadowBias=ut.bias,_t.shadowNormalBias=ut.normalBias,_t.shadowRadius=ut.radius,_t.shadowMapSize=ut.mapSize,s.directionalShadow[y]=_t,s.directionalShadowMap[y]=z,s.directionalShadowMatrix[y]=U.shadow.matrix,b++}s.directional[y]=rt,y++}else if(U.isSpotLight){let rt=e.get(U);rt.position.setFromMatrixPosition(U.matrixWorld),rt.color.copy(q).multiplyScalar(tt*T),rt.distance=Q,rt.coneCos=Math.cos(U.angle),rt.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),rt.decay=U.decay,s.spot[u]=rt;let ut=U.shadow;if(U.map&&(s.spotLightMap[C]=U.map,C++,ut.updateMatrices(U),U.castShadow&&j++),s.spotLightMatrix[u]=ut.matrix,U.castShadow){let _t=n.get(U);_t.shadowBias=ut.bias,_t.shadowNormalBias=ut.normalBias,_t.shadowRadius=ut.radius,_t.shadowMapSize=ut.mapSize,s.spotShadow[u]=_t,s.spotShadowMap[u]=z,I++}u++}else if(U.isRectAreaLight){let rt=e.get(U);rt.color.copy(q).multiplyScalar(tt),rt.halfWidth.set(U.width*.5,0,0),rt.halfHeight.set(0,U.height*.5,0),s.rectArea[A]=rt,A++}else if(U.isPointLight){let rt=e.get(U);if(rt.color.copy(U.color).multiplyScalar(U.intensity*T),rt.distance=U.distance,rt.decay=U.decay,U.castShadow){let ut=U.shadow,_t=n.get(U);_t.shadowBias=ut.bias,_t.shadowNormalBias=ut.normalBias,_t.shadowRadius=ut.radius,_t.shadowMapSize=ut.mapSize,_t.shadowCameraNear=ut.camera.near,_t.shadowCameraFar=ut.camera.far,s.pointShadow[p]=_t,s.pointShadowMap[p]=z,s.pointShadowMatrix[p]=U.shadow.matrix,N++}s.point[p]=rt,p++}else if(U.isHemisphereLight){let rt=e.get(U);rt.skyColor.copy(U.color).multiplyScalar(tt*T),rt.groundColor.copy(U.groundColor).multiplyScalar(tt*T),s.hemi[_]=rt,_++}}A>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=g,s.ambient[2]=x;let Y=s.hash;(Y.directionalLength!==y||Y.pointLength!==p||Y.spotLength!==u||Y.rectAreaLength!==A||Y.hemiLength!==_||Y.numDirectionalShadows!==b||Y.numPointShadows!==N||Y.numSpotShadows!==I||Y.numSpotMaps!==C||Y.numLightProbes!==M)&&(s.directional.length=y,s.spot.length=u,s.rectArea.length=A,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=N,s.pointShadowMap.length=N,s.spotShadow.length=I,s.spotShadowMap.length=I,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=N,s.spotLightMatrix.length=I+C-j,s.spotLightMap.length=C,s.numSpotLightShadowsWithMaps=j,s.numLightProbes=M,Y.directionalLength=y,Y.pointLength=p,Y.spotLength=u,Y.rectAreaLength=A,Y.hemiLength=_,Y.numDirectionalShadows=b,Y.numPointShadows=N,Y.numSpotShadows=I,Y.numSpotMaps=C,Y.numLightProbes=M,s.version=Sm++)}function l(h,d){let f=0,g=0,x=0,y=0,p=0,u=d.matrixWorldInverse;for(let A=0,_=h.length;A<_;A++){let b=h[A];if(b.isDirectionalLight){let N=s.directional[f];N.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),N.direction.sub(r),N.direction.transformDirection(u),f++}else if(b.isSpotLight){let N=s.spot[x];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(u),N.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),N.direction.sub(r),N.direction.transformDirection(u),x++}else if(b.isRectAreaLight){let N=s.rectArea[y];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(u),a.identity(),o.copy(b.matrixWorld),o.premultiply(u),a.extractRotation(o),N.halfWidth.set(b.width*.5,0,0),N.halfHeight.set(0,b.height*.5,0),N.halfWidth.applyMatrix4(a),N.halfHeight.applyMatrix4(a),y++}else if(b.isPointLight){let N=s.point[g];N.position.setFromMatrixPosition(b.matrixWorld),N.position.applyMatrix4(u),g++}else if(b.isHemisphereLight){let N=s.hemi[p];N.direction.setFromMatrixPosition(b.matrixWorld),N.direction.transformDirection(u),p++}}}return{setup:c,setupView:l,state:s}}function Zc(i,t){let e=new Em(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){e.setup(n,d)}function l(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function wm(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),c;return a===void 0?(c=new Zc(i,t),e.set(r,[c])):o>=a.length?(c=new Zc(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var Ga=class extends $n{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Wa=class extends $n{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Tm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Am=`uniform sampler2D shadow_pass;
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
}`;function Rm(i,t,e){let n=new ms,s=new yt,r=new yt,o=new De,a=new Ga({depthPacking:yh}),c=new Wa,l={},h=e.maxTextureSize,d={[Sn]:$e,[$e]:Sn,[rn]:rn},f=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new yt},radius:{value:4}},vertexShader:Tm,fragmentShader:Am}),g=f.clone();g.defines.HORIZONTAL_PASS=1;let x=new en;x.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Fe(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=al;let u=this.type;this.render=function(I,C,j){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||I.length===0)return;let M=i.getRenderTarget(),T=i.getActiveCubeFace(),Y=i.getActiveMipmapLevel(),K=i.state;K.setBlending(Xn),K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);let dt=u!==Ln&&this.type===Ln,U=u===Ln&&this.type!==Ln;for(let q=0,tt=I.length;q<tt;q++){let Q=I[q],z=Q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let rt=z.getFrameExtents();if(s.multiply(rt),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/rt.x),s.x=r.x*rt.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/rt.y),s.y=r.y*rt.y,z.mapSize.y=r.y)),z.map===null||dt===!0||U===!0){let _t=this.type!==Ln?{minFilter:qe,magFilter:qe}:{};z.map!==null&&z.map.dispose(),z.map=new Fn(s.x,s.y,_t),z.map.texture.name=Q.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let ut=z.getViewportCount();for(let _t=0;_t<ut;_t++){let Mt=z.getViewport(_t);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),K.viewport(o),z.updateMatrices(Q,_t),n=z.getFrustum(),b(C,j,z.camera,Q,this.type)}z.isPointLightShadow!==!0&&this.type===Ln&&A(z,j),z.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(M,T,Y)};function A(I,C){let j=t.update(y);f.defines.VSM_SAMPLES!==I.blurSamples&&(f.defines.VSM_SAMPLES=I.blurSamples,g.defines.VSM_SAMPLES=I.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Fn(s.x,s.y)),f.uniforms.shadow_pass.value=I.map.texture,f.uniforms.resolution.value=I.mapSize,f.uniforms.radius.value=I.radius,i.setRenderTarget(I.mapPass),i.clear(),i.renderBufferDirect(C,null,j,f,y,null),g.uniforms.shadow_pass.value=I.mapPass.texture,g.uniforms.resolution.value=I.mapSize,g.uniforms.radius.value=I.radius,i.setRenderTarget(I.map),i.clear(),i.renderBufferDirect(C,null,j,g,y,null)}function _(I,C,j,M){let T=null,Y=j.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(Y!==void 0)T=Y;else if(T=j.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let K=T.uuid,dt=C.uuid,U=l[K];U===void 0&&(U={},l[K]=U);let q=U[dt];q===void 0&&(q=T.clone(),U[dt]=q,C.addEventListener("dispose",N)),T=q}if(T.visible=C.visible,T.wireframe=C.wireframe,M===Ln?T.side=C.shadowSide!==null?C.shadowSide:C.side:T.side=C.shadowSide!==null?C.shadowSide:d[C.side],T.alphaMap=C.alphaMap,T.alphaTest=C.alphaTest,T.map=C.map,T.clipShadows=C.clipShadows,T.clippingPlanes=C.clippingPlanes,T.clipIntersection=C.clipIntersection,T.displacementMap=C.displacementMap,T.displacementScale=C.displacementScale,T.displacementBias=C.displacementBias,T.wireframeLinewidth=C.wireframeLinewidth,T.linewidth=C.linewidth,j.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let K=i.properties.get(T);K.light=j}return T}function b(I,C,j,M,T){if(I.visible===!1)return;if(I.layers.test(C.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&T===Ln)&&(!I.frustumCulled||n.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,I.matrixWorld);let dt=t.update(I),U=I.material;if(Array.isArray(U)){let q=dt.groups;for(let tt=0,Q=q.length;tt<Q;tt++){let z=q[tt],rt=U[z.materialIndex];if(rt&&rt.visible){let ut=_(I,rt,M,T);I.onBeforeShadow(i,I,C,j,dt,ut,z),i.renderBufferDirect(j,null,dt,ut,I,z),I.onAfterShadow(i,I,C,j,dt,ut,z)}}}else if(U.visible){let q=_(I,U,M,T);I.onBeforeShadow(i,I,C,j,dt,q,null),i.renderBufferDirect(j,null,dt,q,I,null),I.onAfterShadow(i,I,C,j,dt,q,null)}}let K=I.children;for(let dt=0,U=K.length;dt<U;dt++)b(K[dt],C,j,M,T)}function N(I){I.target.removeEventListener("dispose",N);for(let j in l){let M=l[j],T=I.target.uuid;T in M&&(M[T].dispose(),delete M[T])}}}function Cm(i,t,e){let n=e.isWebGL2;function s(){let F=!1,Rt=new De,At=null,qt=new De(0,0,0,0);return{setMask:function(Vt){At!==Vt&&!F&&(i.colorMask(Vt,Vt,Vt,Vt),At=Vt)},setLocked:function(Vt){F=Vt},setClear:function(Vt,ae,oe,xe,Re){Re===!0&&(Vt*=xe,ae*=xe,oe*=xe),Rt.set(Vt,ae,oe,xe),qt.equals(Rt)===!1&&(i.clearColor(Vt,ae,oe,xe),qt.copy(Rt))},reset:function(){F=!1,At=null,qt.set(-1,0,0,0)}}}function r(){let F=!1,Rt=null,At=null,qt=null;return{setTest:function(Vt){Vt?ct(i.DEPTH_TEST):W(i.DEPTH_TEST)},setMask:function(Vt){Rt!==Vt&&!F&&(i.depthMask(Vt),Rt=Vt)},setFunc:function(Vt){if(At!==Vt){switch(Vt){case Jl:i.depthFunc(i.NEVER);break;case $l:i.depthFunc(i.ALWAYS);break;case Kl:i.depthFunc(i.LESS);break;case ar:i.depthFunc(i.LEQUAL);break;case jl:i.depthFunc(i.EQUAL);break;case Ql:i.depthFunc(i.GEQUAL);break;case th:i.depthFunc(i.GREATER);break;case eh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}At=Vt}},setLocked:function(Vt){F=Vt},setClear:function(Vt){qt!==Vt&&(i.clearDepth(Vt),qt=Vt)},reset:function(){F=!1,Rt=null,At=null,qt=null}}}function o(){let F=!1,Rt=null,At=null,qt=null,Vt=null,ae=null,oe=null,xe=null,Re=null;return{setTest:function(ce){F||(ce?ct(i.STENCIL_TEST):W(i.STENCIL_TEST))},setMask:function(ce){Rt!==ce&&!F&&(i.stencilMask(ce),Rt=ce)},setFunc:function(ce,Ne,Ke){(At!==ce||qt!==Ne||Vt!==Ke)&&(i.stencilFunc(ce,Ne,Ke),At=ce,qt=Ne,Vt=Ke)},setOp:function(ce,Ne,Ke){(ae!==ce||oe!==Ne||xe!==Ke)&&(i.stencilOp(ce,Ne,Ke),ae=ce,oe=Ne,xe=Ke)},setLocked:function(ce){F=ce},setClear:function(ce){Re!==ce&&(i.clearStencil(ce),Re=ce)},reset:function(){F=!1,Rt=null,At=null,qt=null,Vt=null,ae=null,oe=null,xe=null,Re=null}}}let a=new s,c=new r,l=new o,h=new WeakMap,d=new WeakMap,f={},g={},x=new WeakMap,y=[],p=null,u=!1,A=null,_=null,b=null,N=null,I=null,C=null,j=null,M=new Kt(0,0,0),T=0,Y=!1,K=null,dt=null,U=null,q=null,tt=null,Q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,rt=0,ut=i.getParameter(i.VERSION);ut.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(ut)[1]),z=rt>=1):ut.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(ut)[1]),z=rt>=2);let _t=null,Mt={},it=i.getParameter(i.SCISSOR_BOX),L=i.getParameter(i.VIEWPORT),P=new De().fromArray(it),w=new De().fromArray(L);function S(F,Rt,At,qt){let Vt=new Uint8Array(4),ae=i.createTexture();i.bindTexture(F,ae),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let oe=0;oe<At;oe++)n&&(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)?i.texImage3D(Rt,0,i.RGBA,1,1,qt,0,i.RGBA,i.UNSIGNED_BYTE,Vt):i.texImage2D(Rt+oe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Vt);return ae}let $={};$[i.TEXTURE_2D]=S(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=S(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&($[i.TEXTURE_2D_ARRAY]=S(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=S(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),ct(i.DEPTH_TEST),c.setFunc(ar),D(!1),m(Ro),ct(i.CULL_FACE),H(Xn);function ct(F){f[F]!==!0&&(i.enable(F),f[F]=!0)}function W(F){f[F]!==!1&&(i.disable(F),f[F]=!1)}function ft(F,Rt){return g[F]!==Rt?(i.bindFramebuffer(F,Rt),g[F]=Rt,n&&(F===i.DRAW_FRAMEBUFFER&&(g[i.FRAMEBUFFER]=Rt),F===i.FRAMEBUFFER&&(g[i.DRAW_FRAMEBUFFER]=Rt)),!0):!1}function R(F,Rt){let At=y,qt=!1;if(F)if(At=x.get(Rt),At===void 0&&(At=[],x.set(Rt,At)),F.isWebGLMultipleRenderTargets){let Vt=F.texture;if(At.length!==Vt.length||At[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,oe=Vt.length;ae<oe;ae++)At[ae]=i.COLOR_ATTACHMENT0+ae;At.length=Vt.length,qt=!0}}else At[0]!==i.COLOR_ATTACHMENT0&&(At[0]=i.COLOR_ATTACHMENT0,qt=!0);else At[0]!==i.BACK&&(At[0]=i.BACK,qt=!0);qt&&(e.isWebGL2?i.drawBuffers(At):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(At))}function et(F){return p!==F?(i.useProgram(F),p=F,!0):!1}let O={[ii]:i.FUNC_ADD,[Dl]:i.FUNC_SUBTRACT,[Nl]:i.FUNC_REVERSE_SUBTRACT};if(n)O[Io]=i.MIN,O[Lo]=i.MAX;else{let F=t.get("EXT_blend_minmax");F!==null&&(O[Io]=F.MIN_EXT,O[Lo]=F.MAX_EXT)}let X={[Ol]:i.ZERO,[Fl]:i.ONE,[Bl]:i.SRC_COLOR,[wa]:i.SRC_ALPHA,[Wl]:i.SRC_ALPHA_SATURATE,[Vl]:i.DST_COLOR,[kl]:i.DST_ALPHA,[zl]:i.ONE_MINUS_SRC_COLOR,[Ta]:i.ONE_MINUS_SRC_ALPHA,[Gl]:i.ONE_MINUS_DST_COLOR,[Hl]:i.ONE_MINUS_DST_ALPHA,[Xl]:i.CONSTANT_COLOR,[ql]:i.ONE_MINUS_CONSTANT_COLOR,[Yl]:i.CONSTANT_ALPHA,[Zl]:i.ONE_MINUS_CONSTANT_ALPHA};function H(F,Rt,At,qt,Vt,ae,oe,xe,Re,ce){if(F===Xn){u===!0&&(W(i.BLEND),u=!1);return}if(u===!1&&(ct(i.BLEND),u=!0),F!==Ul){if(F!==A||ce!==Y){if((_!==ii||I!==ii)&&(i.blendEquation(i.FUNC_ADD),_=ii,I=ii),ce)switch(F){case Bi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rr:i.blendFunc(i.ONE,i.ONE);break;case Co:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Po:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rr:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Co:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Po:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}b=null,N=null,C=null,j=null,M.set(0,0,0),T=0,A=F,Y=ce}return}Vt=Vt||Rt,ae=ae||At,oe=oe||qt,(Rt!==_||Vt!==I)&&(i.blendEquationSeparate(O[Rt],O[Vt]),_=Rt,I=Vt),(At!==b||qt!==N||ae!==C||oe!==j)&&(i.blendFuncSeparate(X[At],X[qt],X[ae],X[oe]),b=At,N=qt,C=ae,j=oe),(xe.equals(M)===!1||Re!==T)&&(i.blendColor(xe.r,xe.g,xe.b,Re),M.copy(xe),T=Re),A=F,Y=!1}function mt(F,Rt){F.side===rn?W(i.CULL_FACE):ct(i.CULL_FACE);let At=F.side===$e;Rt&&(At=!At),D(At),F.blending===Bi&&F.transparent===!1?H(Xn):H(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),c.setFunc(F.depthFunc),c.setTest(F.depthTest),c.setMask(F.depthWrite),a.setMask(F.colorWrite);let qt=F.stencilWrite;l.setTest(qt),qt&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),k(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):W(i.SAMPLE_ALPHA_TO_COVERAGE)}function D(F){K!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),K=F)}function m(F){F!==Il?(ct(i.CULL_FACE),F!==dt&&(F===Ro?i.cullFace(i.BACK):F===Ll?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):W(i.CULL_FACE),dt=F}function v(F){F!==U&&(z&&i.lineWidth(F),U=F)}function k(F,Rt,At){F?(ct(i.POLYGON_OFFSET_FILL),(q!==Rt||tt!==At)&&(i.polygonOffset(Rt,At),q=Rt,tt=At)):W(i.POLYGON_OFFSET_FILL)}function gt(F){F?ct(i.SCISSOR_TEST):W(i.SCISSOR_TEST)}function xt(F){F===void 0&&(F=i.TEXTURE0+Q-1),_t!==F&&(i.activeTexture(F),_t=F)}function ht(F,Rt,At){At===void 0&&(_t===null?At=i.TEXTURE0+Q-1:At=_t);let qt=Mt[At];qt===void 0&&(qt={type:void 0,texture:void 0},Mt[At]=qt),(qt.type!==F||qt.texture!==Rt)&&(_t!==At&&(i.activeTexture(At),_t=At),i.bindTexture(F,Rt||$[F]),qt.type=F,qt.texture=Rt)}function Ut(){let F=Mt[_t];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function St(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ot(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Xt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function pt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ft(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function kt(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Qt(F){P.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),P.copy(F))}function re(F){w.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),w.copy(F))}function he(F,Rt){let At=d.get(Rt);At===void 0&&(At=new WeakMap,d.set(Rt,At));let qt=At.get(F);qt===void 0&&(qt=i.getUniformBlockIndex(Rt,F.name),At.set(F,qt))}function ee(F,Rt){let qt=d.get(Rt).get(F);h.get(Rt)!==qt&&(i.uniformBlockBinding(Rt,qt,F.__bindingPointIndex),h.set(Rt,qt))}function Et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},_t=null,Mt={},g={},x=new WeakMap,y=[],p=null,u=!1,A=null,_=null,b=null,N=null,I=null,C=null,j=null,M=new Kt(0,0,0),T=0,Y=!1,K=null,dt=null,U=null,q=null,tt=null,P.set(0,0,i.canvas.width,i.canvas.height),w.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:ct,disable:W,bindFramebuffer:ft,drawBuffers:R,useProgram:et,setBlending:H,setMaterial:mt,setFlipSided:D,setCullFace:m,setLineWidth:v,setPolygonOffset:k,setScissorTest:gt,activeTexture:xt,bindTexture:ht,unbindTexture:Ut,compressedTexImage2D:St,compressedTexImage3D:Pt,texImage2D:zt,texImage3D:Dt,updateUBOMapping:he,uniformBlockBinding:ee,texStorage2D:Wt,texStorage3D:kt,texSubImage2D:Ot,texSubImage3D:Xt,compressedTexSubImage2D:pt,compressedTexSubImage3D:Ft,scissor:Qt,viewport:re,reset:Et}}function Pm(i,t,e,n,s,r,o){let a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(m,v){return g?new OffscreenCanvas(m,v):pr("canvas")}function y(m,v,k,gt){let xt=1;if((m.width>gt||m.height>gt)&&(xt=gt/Math.max(m.width,m.height)),xt<1||v===!0)if(typeof HTMLImageElement<"u"&&m instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&m instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&m instanceof ImageBitmap){let ht=v?fr:Math.floor,Ut=ht(xt*m.width),St=ht(xt*m.height);d===void 0&&(d=x(Ut,St));let Pt=k?x(Ut,St):d;return Pt.width=Ut,Pt.height=St,Pt.getContext("2d").drawImage(m,0,0,Ut,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+m.width+"x"+m.height+") to ("+Ut+"x"+St+")."),Pt}else return"data"in m&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+m.width+"x"+m.height+")."),m;return m}function p(m){return La(m.width)&&La(m.height)}function u(m){return a?!1:m.wrapS!==mn||m.wrapT!==mn||m.minFilter!==qe&&m.minFilter!==sn}function A(m,v){return m.generateMipmaps&&v&&m.minFilter!==qe&&m.minFilter!==sn}function _(m){i.generateMipmap(m)}function b(m,v,k,gt,xt=!1){if(a===!1)return v;if(m!==null){if(i[m]!==void 0)return i[m];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+m+"'")}let ht=v;if(v===i.RED&&(k===i.FLOAT&&(ht=i.R32F),k===i.HALF_FLOAT&&(ht=i.R16F),k===i.UNSIGNED_BYTE&&(ht=i.R8)),v===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(ht=i.R8UI),k===i.UNSIGNED_SHORT&&(ht=i.R16UI),k===i.UNSIGNED_INT&&(ht=i.R32UI),k===i.BYTE&&(ht=i.R8I),k===i.SHORT&&(ht=i.R16I),k===i.INT&&(ht=i.R32I)),v===i.RG&&(k===i.FLOAT&&(ht=i.RG32F),k===i.HALF_FLOAT&&(ht=i.RG16F),k===i.UNSIGNED_BYTE&&(ht=i.RG8)),v===i.RGBA){let Ut=xt?lr:le.getTransfer(gt);k===i.FLOAT&&(ht=i.RGBA32F),k===i.HALF_FLOAT&&(ht=i.RGBA16F),k===i.UNSIGNED_BYTE&&(ht=Ut===pe?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)}return(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function N(m,v,k){return A(m,k)===!0||m.isFramebufferTexture&&m.minFilter!==qe&&m.minFilter!==sn?Math.log2(Math.max(v.width,v.height))+1:m.mipmaps!==void 0&&m.mipmaps.length>0?m.mipmaps.length:m.isCompressedTexture&&Array.isArray(m.image)?v.mipmaps.length:1}function I(m){return m===qe||m===Uo||m===qr?i.NEAREST:i.LINEAR}function C(m){let v=m.target;v.removeEventListener("dispose",C),M(v),v.isVideoTexture&&h.delete(v)}function j(m){let v=m.target;v.removeEventListener("dispose",j),Y(v)}function M(m){let v=n.get(m);if(v.__webglInit===void 0)return;let k=m.source,gt=f.get(k);if(gt){let xt=gt[v.__cacheKey];xt.usedTimes--,xt.usedTimes===0&&T(m),Object.keys(gt).length===0&&f.delete(k)}n.remove(m)}function T(m){let v=n.get(m);i.deleteTexture(v.__webglTexture);let k=m.source,gt=f.get(k);delete gt[v.__cacheKey],o.memory.textures--}function Y(m){let v=m.texture,k=n.get(m),gt=n.get(v);if(gt.__webglTexture!==void 0&&(i.deleteTexture(gt.__webglTexture),o.memory.textures--),m.depthTexture&&m.depthTexture.dispose(),m.isWebGLCubeRenderTarget)for(let xt=0;xt<6;xt++){if(Array.isArray(k.__webglFramebuffer[xt]))for(let ht=0;ht<k.__webglFramebuffer[xt].length;ht++)i.deleteFramebuffer(k.__webglFramebuffer[xt][ht]);else i.deleteFramebuffer(k.__webglFramebuffer[xt]);k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer[xt])}else{if(Array.isArray(k.__webglFramebuffer))for(let xt=0;xt<k.__webglFramebuffer.length;xt++)i.deleteFramebuffer(k.__webglFramebuffer[xt]);else i.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&i.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let xt=0;xt<k.__webglColorRenderbuffer.length;xt++)k.__webglColorRenderbuffer[xt]&&i.deleteRenderbuffer(k.__webglColorRenderbuffer[xt]);k.__webglDepthRenderbuffer&&i.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(m.isWebGLMultipleRenderTargets)for(let xt=0,ht=v.length;xt<ht;xt++){let Ut=n.get(v[xt]);Ut.__webglTexture&&(i.deleteTexture(Ut.__webglTexture),o.memory.textures--),n.remove(v[xt])}n.remove(v),n.remove(m)}let K=0;function dt(){K=0}function U(){let m=K;return m>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+m+" texture units while this GPU supports only "+s.maxTextures),K+=1,m}function q(m){let v=[];return v.push(m.wrapS),v.push(m.wrapT),v.push(m.wrapR||0),v.push(m.magFilter),v.push(m.minFilter),v.push(m.anisotropy),v.push(m.internalFormat),v.push(m.format),v.push(m.type),v.push(m.generateMipmaps),v.push(m.premultiplyAlpha),v.push(m.flipY),v.push(m.unpackAlignment),v.push(m.colorSpace),v.join()}function tt(m,v){let k=n.get(m);if(m.isVideoTexture&&mt(m),m.isRenderTargetTexture===!1&&m.version>0&&k.__version!==m.version){let gt=m.image;if(gt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(gt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{P(k,m,v);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+v)}function Q(m,v){let k=n.get(m);if(m.version>0&&k.__version!==m.version){P(k,m,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+v)}function z(m,v){let k=n.get(m);if(m.version>0&&k.__version!==m.version){P(k,m,v);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+v)}function rt(m,v){let k=n.get(m);if(m.version>0&&k.__version!==m.version){w(k,m,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+v)}let ut={[Ca]:i.REPEAT,[mn]:i.CLAMP_TO_EDGE,[Pa]:i.MIRRORED_REPEAT},_t={[qe]:i.NEAREST,[Uo]:i.NEAREST_MIPMAP_NEAREST,[qr]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[lh]:i.LINEAR_MIPMAP_NEAREST,[ds]:i.LINEAR_MIPMAP_LINEAR},Mt={[Mh]:i.NEVER,[Ah]:i.ALWAYS,[Sh]:i.LESS,[xl]:i.LEQUAL,[bh]:i.EQUAL,[Th]:i.GEQUAL,[Eh]:i.GREATER,[wh]:i.NOTEQUAL};function it(m,v,k){if(k?(i.texParameteri(m,i.TEXTURE_WRAP_S,ut[v.wrapS]),i.texParameteri(m,i.TEXTURE_WRAP_T,ut[v.wrapT]),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,ut[v.wrapR]),i.texParameteri(m,i.TEXTURE_MAG_FILTER,_t[v.magFilter]),i.texParameteri(m,i.TEXTURE_MIN_FILTER,_t[v.minFilter])):(i.texParameteri(m,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(m,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(v.wrapS!==mn||v.wrapT!==mn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(m,i.TEXTURE_MAG_FILTER,I(v.magFilter)),i.texParameteri(m,i.TEXTURE_MIN_FILTER,I(v.minFilter)),v.minFilter!==qe&&v.minFilter!==sn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(i.texParameteri(m,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(m,i.TEXTURE_COMPARE_FUNC,Mt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let gt=t.get("EXT_texture_filter_anisotropic");if(v.magFilter===qe||v.minFilter!==qr&&v.minFilter!==ds||v.type===Wn&&t.has("OES_texture_float_linear")===!1||a===!1&&v.type===fs&&t.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(i.texParameterf(m,gt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function L(m,v){let k=!1;m.__webglInit===void 0&&(m.__webglInit=!0,v.addEventListener("dispose",C));let gt=v.source,xt=f.get(gt);xt===void 0&&(xt={},f.set(gt,xt));let ht=q(v);if(ht!==m.__cacheKey){xt[ht]===void 0&&(xt[ht]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),xt[ht].usedTimes++;let Ut=xt[m.__cacheKey];Ut!==void 0&&(xt[m.__cacheKey].usedTimes--,Ut.usedTimes===0&&T(v)),m.__cacheKey=ht,m.__webglTexture=xt[ht].texture}return k}function P(m,v,k){let gt=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(gt=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(gt=i.TEXTURE_3D);let xt=L(m,v),ht=v.source;e.bindTexture(gt,m.__webglTexture,i.TEXTURE0+k);let Ut=n.get(ht);if(ht.version!==Ut.__version||xt===!0){e.activeTexture(i.TEXTURE0+k);let St=le.getPrimaries(le.workingColorSpace),Pt=v.colorSpace===an?null:le.getPrimaries(v.colorSpace),Ot=v.colorSpace===an||St===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);let Xt=u(v)&&p(v.image)===!1,pt=y(v.image,Xt,!1,s.maxTextureSize);pt=D(v,pt);let Ft=p(pt)||a,Wt=r.convert(v.format,v.colorSpace),kt=r.convert(v.type),zt=b(v.internalFormat,Wt,kt,v.colorSpace,v.isVideoTexture);it(gt,v,Ft);let Dt,Qt=v.mipmaps,re=a&&v.isVideoTexture!==!0&&zt!==ml,he=Ut.__version===void 0||xt===!0,ee=N(v,pt,Ft);if(v.isDepthTexture)zt=i.DEPTH_COMPONENT,a?v.type===Wn?zt=i.DEPTH_COMPONENT32F:v.type===Gn?zt=i.DEPTH_COMPONENT24:v.type===ri?zt=i.DEPTH24_STENCIL8:zt=i.DEPTH_COMPONENT16:v.type===Wn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===ai&&zt===i.DEPTH_COMPONENT&&v.type!==vo&&v.type!==Gn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Gn,kt=r.convert(v.type)),v.format===Gi&&zt===i.DEPTH_COMPONENT&&(zt=i.DEPTH_STENCIL,v.type!==ri&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=ri,kt=r.convert(v.type))),he&&(re?e.texStorage2D(i.TEXTURE_2D,1,zt,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,zt,pt.width,pt.height,0,Wt,kt,null));else if(v.isDataTexture)if(Qt.length>0&&Ft){re&&he&&e.texStorage2D(i.TEXTURE_2D,ee,zt,Qt[0].width,Qt[0].height);for(let Et=0,F=Qt.length;Et<F;Et++)Dt=Qt[Et],re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Dt.width,Dt.height,Wt,kt,Dt.data):e.texImage2D(i.TEXTURE_2D,Et,zt,Dt.width,Dt.height,0,Wt,kt,Dt.data);v.generateMipmaps=!1}else re?(he&&e.texStorage2D(i.TEXTURE_2D,ee,zt,pt.width,pt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt.width,pt.height,Wt,kt,pt.data)):e.texImage2D(i.TEXTURE_2D,0,zt,pt.width,pt.height,0,Wt,kt,pt.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){re&&he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,zt,Qt[0].width,Qt[0].height,pt.depth);for(let Et=0,F=Qt.length;Et<F;Et++)Dt=Qt[Et],v.format!==gn?Wt!==null?re?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Et,0,0,0,Dt.width,Dt.height,pt.depth,Wt,Dt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Et,zt,Dt.width,Dt.height,pt.depth,0,Dt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage3D(i.TEXTURE_2D_ARRAY,Et,0,0,0,Dt.width,Dt.height,pt.depth,Wt,kt,Dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Et,zt,Dt.width,Dt.height,pt.depth,0,Wt,kt,Dt.data)}else{re&&he&&e.texStorage2D(i.TEXTURE_2D,ee,zt,Qt[0].width,Qt[0].height);for(let Et=0,F=Qt.length;Et<F;Et++)Dt=Qt[Et],v.format!==gn?Wt!==null?re?e.compressedTexSubImage2D(i.TEXTURE_2D,Et,0,0,Dt.width,Dt.height,Wt,Dt.data):e.compressedTexImage2D(i.TEXTURE_2D,Et,zt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Dt.width,Dt.height,Wt,kt,Dt.data):e.texImage2D(i.TEXTURE_2D,Et,zt,Dt.width,Dt.height,0,Wt,kt,Dt.data)}else if(v.isDataArrayTexture)re?(he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,zt,pt.width,pt.height,pt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,Wt,kt,pt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,pt.width,pt.height,pt.depth,0,Wt,kt,pt.data);else if(v.isData3DTexture)re?(he&&e.texStorage3D(i.TEXTURE_3D,ee,zt,pt.width,pt.height,pt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,Wt,kt,pt.data)):e.texImage3D(i.TEXTURE_3D,0,zt,pt.width,pt.height,pt.depth,0,Wt,kt,pt.data);else if(v.isFramebufferTexture){if(he)if(re)e.texStorage2D(i.TEXTURE_2D,ee,zt,pt.width,pt.height);else{let Et=pt.width,F=pt.height;for(let Rt=0;Rt<ee;Rt++)e.texImage2D(i.TEXTURE_2D,Rt,zt,Et,F,0,Wt,kt,null),Et>>=1,F>>=1}}else if(Qt.length>0&&Ft){re&&he&&e.texStorage2D(i.TEXTURE_2D,ee,zt,Qt[0].width,Qt[0].height);for(let Et=0,F=Qt.length;Et<F;Et++)Dt=Qt[Et],re?e.texSubImage2D(i.TEXTURE_2D,Et,0,0,Wt,kt,Dt):e.texImage2D(i.TEXTURE_2D,Et,zt,Wt,kt,Dt);v.generateMipmaps=!1}else re?(he&&e.texStorage2D(i.TEXTURE_2D,ee,zt,pt.width,pt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Wt,kt,pt)):e.texImage2D(i.TEXTURE_2D,0,zt,Wt,kt,pt);A(v,Ft)&&_(gt),Ut.__version=ht.version,v.onUpdate&&v.onUpdate(v)}m.__version=v.version}function w(m,v,k){if(v.image.length!==6)return;let gt=L(m,v),xt=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,m.__webglTexture,i.TEXTURE0+k);let ht=n.get(xt);if(xt.version!==ht.__version||gt===!0){e.activeTexture(i.TEXTURE0+k);let Ut=le.getPrimaries(le.workingColorSpace),St=v.colorSpace===an?null:le.getPrimaries(v.colorSpace),Pt=v.colorSpace===an||Ut===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let Ot=v.isCompressedTexture||v.image[0].isCompressedTexture,Xt=v.image[0]&&v.image[0].isDataTexture,pt=[];for(let Et=0;Et<6;Et++)!Ot&&!Xt?pt[Et]=y(v.image[Et],!1,!0,s.maxCubemapSize):pt[Et]=Xt?v.image[Et].image:v.image[Et],pt[Et]=D(v,pt[Et]);let Ft=pt[0],Wt=p(Ft)||a,kt=r.convert(v.format,v.colorSpace),zt=r.convert(v.type),Dt=b(v.internalFormat,kt,zt,v.colorSpace),Qt=a&&v.isVideoTexture!==!0,re=ht.__version===void 0||gt===!0,he=N(v,Ft,Wt);it(i.TEXTURE_CUBE_MAP,v,Wt);let ee;if(Ot){Qt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,he,Dt,Ft.width,Ft.height);for(let Et=0;Et<6;Et++){ee=pt[Et].mipmaps;for(let F=0;F<ee.length;F++){let Rt=ee[F];v.format!==gn?kt!==null?Qt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F,0,0,Rt.width,Rt.height,kt,Rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F,Dt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F,0,0,Rt.width,Rt.height,kt,zt,Rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F,Dt,Rt.width,Rt.height,0,kt,zt,Rt.data)}}}else{ee=v.mipmaps,Qt&&re&&(ee.length>0&&he++,e.texStorage2D(i.TEXTURE_CUBE_MAP,he,Dt,pt[0].width,pt[0].height));for(let Et=0;Et<6;Et++)if(Xt){Qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,pt[Et].width,pt[Et].height,kt,zt,pt[Et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Dt,pt[Et].width,pt[Et].height,0,kt,zt,pt[Et].data);for(let F=0;F<ee.length;F++){let At=ee[F].image[Et].image;Qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F+1,0,0,At.width,At.height,kt,zt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F+1,Dt,At.width,At.height,0,kt,zt,At.data)}}else{Qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,kt,zt,pt[Et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,Dt,kt,zt,pt[Et]);for(let F=0;F<ee.length;F++){let Rt=ee[F];Qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F+1,0,0,kt,zt,Rt.image[Et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,F+1,Dt,kt,zt,Rt.image[Et])}}}A(v,Wt)&&_(i.TEXTURE_CUBE_MAP),ht.__version=xt.version,v.onUpdate&&v.onUpdate(v)}m.__version=v.version}function S(m,v,k,gt,xt,ht){let Ut=r.convert(k.format,k.colorSpace),St=r.convert(k.type),Pt=b(k.internalFormat,Ut,St,k.colorSpace);if(!n.get(v).__hasExternalTextures){let Xt=Math.max(1,v.width>>ht),pt=Math.max(1,v.height>>ht);xt===i.TEXTURE_3D||xt===i.TEXTURE_2D_ARRAY?e.texImage3D(xt,ht,Pt,Xt,pt,v.depth,0,Ut,St,null):e.texImage2D(xt,ht,Pt,Xt,pt,0,Ut,St,null)}e.bindFramebuffer(i.FRAMEBUFFER,m),H(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,gt,xt,n.get(k).__webglTexture,0,X(v)):(xt===i.TEXTURE_2D||xt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&xt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,gt,xt,n.get(k).__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function $(m,v,k){if(i.bindRenderbuffer(i.RENDERBUFFER,m),v.depthBuffer&&!v.stencilBuffer){let gt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(k||H(v)){let xt=v.depthTexture;xt&&xt.isDepthTexture&&(xt.type===Wn?gt=i.DEPTH_COMPONENT32F:xt.type===Gn&&(gt=i.DEPTH_COMPONENT24));let ht=X(v);H(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,gt,v.width,v.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,gt,v.width,v.height)}else i.renderbufferStorage(i.RENDERBUFFER,gt,v.width,v.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,m)}else if(v.depthBuffer&&v.stencilBuffer){let gt=X(v);k&&H(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,i.DEPTH24_STENCIL8,v.width,v.height):H(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,i.DEPTH24_STENCIL8,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,m)}else{let gt=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let xt=0;xt<gt.length;xt++){let ht=gt[xt],Ut=r.convert(ht.format,ht.colorSpace),St=r.convert(ht.type),Pt=b(ht.internalFormat,Ut,St,ht.colorSpace),Ot=X(v);k&&H(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,Pt,v.width,v.height):H(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ot,Pt,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ct(m,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,m),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),tt(v.depthTexture,0);let gt=n.get(v.depthTexture).__webglTexture,xt=X(v);if(v.depthTexture.format===ai)H(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0,xt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,gt,0);else if(v.depthTexture.format===Gi)H(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0,xt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,gt,0);else throw new Error("Unknown depthTexture format")}function W(m){let v=n.get(m),k=m.isWebGLCubeRenderTarget===!0;if(m.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");ct(v.__webglFramebuffer,m)}else if(k){v.__webglDepthbuffer=[];for(let gt=0;gt<6;gt++)e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[gt]),v.__webglDepthbuffer[gt]=i.createRenderbuffer(),$(v.__webglDepthbuffer[gt],m,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=i.createRenderbuffer(),$(v.__webglDepthbuffer,m,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(m,v,k){let gt=n.get(m);v!==void 0&&S(gt.__webglFramebuffer,m,m.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&W(m)}function R(m){let v=m.texture,k=n.get(m),gt=n.get(v);m.addEventListener("dispose",j),m.isWebGLMultipleRenderTargets!==!0&&(gt.__webglTexture===void 0&&(gt.__webglTexture=i.createTexture()),gt.__version=v.version,o.memory.textures++);let xt=m.isWebGLCubeRenderTarget===!0,ht=m.isWebGLMultipleRenderTargets===!0,Ut=p(m)||a;if(xt){k.__webglFramebuffer=[];for(let St=0;St<6;St++)if(a&&v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[St]=[];for(let Pt=0;Pt<v.mipmaps.length;Pt++)k.__webglFramebuffer[St][Pt]=i.createFramebuffer()}else k.__webglFramebuffer[St]=i.createFramebuffer()}else{if(a&&v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let St=0;St<v.mipmaps.length;St++)k.__webglFramebuffer[St]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ht)if(s.drawBuffers){let St=m.texture;for(let Pt=0,Ot=St.length;Pt<Ot;Pt++){let Xt=n.get(St[Pt]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&m.samples>0&&H(m)===!1){let St=ht?v:[v];k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Pt=0;Pt<St.length;Pt++){let Ot=St[Pt];k.__webglColorRenderbuffer[Pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[Pt]);let Xt=r.convert(Ot.format,Ot.colorSpace),pt=r.convert(Ot.type),Ft=b(Ot.internalFormat,Xt,pt,Ot.colorSpace,m.isXRRenderTarget===!0),Wt=X(m);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,Ft,m.width,m.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,k.__webglColorRenderbuffer[Pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),m.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),$(k.__webglDepthRenderbuffer,m,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(xt){e.bindTexture(i.TEXTURE_CUBE_MAP,gt.__webglTexture),it(i.TEXTURE_CUBE_MAP,v,Ut);for(let St=0;St<6;St++)if(a&&v.mipmaps&&v.mipmaps.length>0)for(let Pt=0;Pt<v.mipmaps.length;Pt++)S(k.__webglFramebuffer[St][Pt],m,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,Pt);else S(k.__webglFramebuffer[St],m,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);A(v,Ut)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){let St=m.texture;for(let Pt=0,Ot=St.length;Pt<Ot;Pt++){let Xt=St[Pt],pt=n.get(Xt);e.bindTexture(i.TEXTURE_2D,pt.__webglTexture),it(i.TEXTURE_2D,Xt,Ut),S(k.__webglFramebuffer,m,Xt,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,0),A(Xt,Ut)&&_(i.TEXTURE_2D)}e.unbindTexture()}else{let St=i.TEXTURE_2D;if((m.isWebGL3DRenderTarget||m.isWebGLArrayRenderTarget)&&(a?St=m.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(St,gt.__webglTexture),it(St,v,Ut),a&&v.mipmaps&&v.mipmaps.length>0)for(let Pt=0;Pt<v.mipmaps.length;Pt++)S(k.__webglFramebuffer[Pt],m,v,i.COLOR_ATTACHMENT0,St,Pt);else S(k.__webglFramebuffer,m,v,i.COLOR_ATTACHMENT0,St,0);A(v,Ut)&&_(St),e.unbindTexture()}m.depthBuffer&&W(m)}function et(m){let v=p(m)||a,k=m.isWebGLMultipleRenderTargets===!0?m.texture:[m.texture];for(let gt=0,xt=k.length;gt<xt;gt++){let ht=k[gt];if(A(ht,v)){let Ut=m.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,St=n.get(ht).__webglTexture;e.bindTexture(Ut,St),_(Ut),e.unbindTexture()}}}function O(m){if(a&&m.samples>0&&H(m)===!1){let v=m.isWebGLMultipleRenderTargets?m.texture:[m.texture],k=m.width,gt=m.height,xt=i.COLOR_BUFFER_BIT,ht=[],Ut=m.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(m),Pt=m.isWebGLMultipleRenderTargets===!0;if(Pt)for(let Ot=0;Ot<v.length;Ot++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let Ot=0;Ot<v.length;Ot++){ht.push(i.COLOR_ATTACHMENT0+Ot),m.depthBuffer&&ht.push(Ut);let Xt=St.__ignoreDepthValues!==void 0?St.__ignoreDepthValues:!1;if(Xt===!1&&(m.depthBuffer&&(xt|=i.DEPTH_BUFFER_BIT),m.stencilBuffer&&(xt|=i.STENCIL_BUFFER_BIT)),Pt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[Ot]),Xt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ut]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ut])),Pt){let pt=n.get(v[Ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pt,0)}i.blitFramebuffer(0,0,k,gt,0,0,k,gt,xt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Pt)for(let Ot=0;Ot<v.length;Ot++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,St.__webglColorRenderbuffer[Ot]);let Xt=n.get(v[Ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,Xt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}}function X(m){return Math.min(s.maxSamples,m.samples)}function H(m){let v=n.get(m);return a&&m.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function mt(m){let v=o.render.frame;h.get(m)!==v&&(h.set(m,v),m.update())}function D(m,v){let k=m.colorSpace,gt=m.format,xt=m.type;return m.isCompressedTexture===!0||m.isVideoTexture===!0||m.format===Ia||k!==On&&k!==an&&(le.getTransfer(k)===pe?a===!1?t.has("EXT_sRGB")===!0&&gt===gn?(m.format=Ia,m.minFilter=sn,m.generateMipmaps=!1):v=mr.sRGBToLinear(v):(gt!==gn||xt!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}this.allocateTextureUnit=U,this.resetTextureUnits=dt,this.setTexture2D=tt,this.setTexture2DArray=Q,this.setTexture3D=z,this.setTextureCube=rt,this.rebindTextures=ft,this.setupRenderTarget=R,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=O,this.setupDepthRenderbuffer=W,this.setupFrameBufferTexture=S,this.useMultisampledRTT=H}function Im(i,t,e){let n=e.isWebGL2;function s(r,o=an){let a,c=le.getTransfer(o);if(r===Yn)return i.UNSIGNED_BYTE;if(r===hl)return i.UNSIGNED_SHORT_4_4_4_4;if(r===ul)return i.UNSIGNED_SHORT_5_5_5_1;if(r===hh)return i.BYTE;if(r===uh)return i.SHORT;if(r===vo)return i.UNSIGNED_SHORT;if(r===ll)return i.INT;if(r===Gn)return i.UNSIGNED_INT;if(r===Wn)return i.FLOAT;if(r===fs)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===dh)return i.ALPHA;if(r===gn)return i.RGBA;if(r===fh)return i.LUMINANCE;if(r===ph)return i.LUMINANCE_ALPHA;if(r===ai)return i.DEPTH_COMPONENT;if(r===Gi)return i.DEPTH_STENCIL;if(r===Ia)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===mh)return i.RED;if(r===dl)return i.RED_INTEGER;if(r===gh)return i.RG;if(r===fl)return i.RG_INTEGER;if(r===pl)return i.RGBA_INTEGER;if(r===Yr||r===Zr||r===Jr||r===$r)if(c===pe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Yr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Zr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Jr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===$r)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Yr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Zr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Jr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===$r)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Do||r===No||r===Oo||r===Fo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Do)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===No)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Oo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Fo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ml)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Bo||r===zo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Bo)return c===pe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===zo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ko||r===Ho||r===Vo||r===Go||r===Wo||r===Xo||r===qo||r===Yo||r===Zo||r===Jo||r===$o||r===Ko||r===jo||r===Qo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===ko)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ho)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Vo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Go)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Wo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Xo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===qo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Yo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Zo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Jo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===$o)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ko)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===jo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Qo)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Kr||r===tc||r===ec)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Kr)return c===pe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===tc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ec)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===_h||r===nc||r===ic||r===sc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Kr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===nc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ic)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===sc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ri?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Xa=class extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Nn=class extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}},Lm={type:"move"},ls=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let y of t.hand.values()){let p=e.getJointPose(y,n),u=this._getHandJoint(l,y);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),g=.02,x=.005;l.inputState.pinching&&f>g+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=g-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Lm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Nn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},qa=class extends Zn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,f=null,g=null,x=null,y=e.getContextAttributes(),p=null,u=null,A=[],_=[],b=new yt,N=null,I=new Ve;I.layers.enable(1),I.viewport=new De;let C=new Ve;C.layers.enable(2),C.viewport=new De;let j=[I,C],M=new Xa;M.layers.enable(1),M.layers.enable(2);let T=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(it){let L=A[it];return L===void 0&&(L=new ls,A[it]=L),L.getTargetRaySpace()},this.getControllerGrip=function(it){let L=A[it];return L===void 0&&(L=new ls,A[it]=L),L.getGripSpace()},this.getHand=function(it){let L=A[it];return L===void 0&&(L=new ls,A[it]=L),L.getHandSpace()};function K(it){let L=_.indexOf(it.inputSource);if(L===-1)return;let P=A[L];P!==void 0&&(P.update(it.inputSource,it.frame,l||o),P.dispatchEvent({type:it.type,data:it.inputSource}))}function dt(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",dt),s.removeEventListener("inputsourceschange",U);for(let it=0;it<A.length;it++){let L=_[it];L!==null&&(_[it]=null,A[it].disconnect(L))}T=null,Y=null,t.setRenderTarget(p),g=null,f=null,d=null,s=null,u=null,Mt.stop(),n.isPresenting=!1,t.setPixelRatio(N),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(it){r=it,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(it){a=it,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(it){l=it},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(it){if(s=it,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",dt),s.addEventListener("inputsourceschange",U),y.xrCompatible!==!0&&await e.makeXRCompatible(),N=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let L={antialias:s.renderState.layers===void 0?y.antialias:!0,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,e,L),s.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),u=new Fn(g.framebufferWidth,g.framebufferHeight,{format:gn,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil})}else{let L=null,P=null,w=null;y.depth&&(w=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,L=y.stencil?Gi:ai,P=y.stencil?ri:Gn);let S={colorFormat:e.RGBA8,depthFormat:w,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(S),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),u=new Fn(f.textureWidth,f.textureHeight,{format:gn,type:Yn,depthTexture:new Tr(f.textureWidth,f.textureHeight,P,void 0,void 0,void 0,void 0,void 0,void 0,L),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0});let $=t.properties.get(u);$.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Mt.setContext(s),Mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(it){for(let L=0;L<it.removed.length;L++){let P=it.removed[L],w=_.indexOf(P);w>=0&&(_[w]=null,A[w].disconnect(P))}for(let L=0;L<it.added.length;L++){let P=it.added[L],w=_.indexOf(P);if(w===-1){for(let $=0;$<A.length;$++)if($>=_.length){_.push(P),w=$;break}else if(_[$]===null){_[$]=P,w=$;break}if(w===-1)break}let S=A[w];S&&S.connect(P)}}let q=new G,tt=new G;function Q(it,L,P){q.setFromMatrixPosition(L.matrixWorld),tt.setFromMatrixPosition(P.matrixWorld);let w=q.distanceTo(tt),S=L.projectionMatrix.elements,$=P.projectionMatrix.elements,ct=S[14]/(S[10]-1),W=S[14]/(S[10]+1),ft=(S[9]+1)/S[5],R=(S[9]-1)/S[5],et=(S[8]-1)/S[0],O=($[8]+1)/$[0],X=ct*et,H=ct*O,mt=w/(-et+O),D=mt*-et;L.matrixWorld.decompose(it.position,it.quaternion,it.scale),it.translateX(D),it.translateZ(mt),it.matrixWorld.compose(it.position,it.quaternion,it.scale),it.matrixWorldInverse.copy(it.matrixWorld).invert();let m=ct+mt,v=W+mt,k=X-D,gt=H+(w-D),xt=ft*W/v*m,ht=R*W/v*m;it.projectionMatrix.makePerspective(k,gt,xt,ht,m,v),it.projectionMatrixInverse.copy(it.projectionMatrix).invert()}function z(it,L){L===null?it.matrixWorld.copy(it.matrix):it.matrixWorld.multiplyMatrices(L.matrixWorld,it.matrix),it.matrixWorldInverse.copy(it.matrixWorld).invert()}this.updateCamera=function(it){if(s===null)return;M.near=C.near=I.near=it.near,M.far=C.far=I.far=it.far,(T!==M.near||Y!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),T=M.near,Y=M.far);let L=it.parent,P=M.cameras;z(M,L);for(let w=0;w<P.length;w++)z(P[w],L);P.length===2?Q(M,I,C):M.projectionMatrix.copy(I.projectionMatrix),rt(it,M,L)};function rt(it,L,P){P===null?it.matrix.copy(L.matrixWorld):(it.matrix.copy(P.matrixWorld),it.matrix.invert(),it.matrix.multiply(L.matrixWorld)),it.matrix.decompose(it.position,it.quaternion,it.scale),it.updateMatrixWorld(!0),it.projectionMatrix.copy(L.projectionMatrix),it.projectionMatrixInverse.copy(L.projectionMatrixInverse),it.isPerspectiveCamera&&(it.fov=Wi*2*Math.atan(1/it.projectionMatrix.elements[5]),it.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&g===null))return c},this.setFoveation=function(it){c=it,f!==null&&(f.fixedFoveation=it),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=it)};let ut=null;function _t(it,L){if(h=L.getViewerPose(l||o),x=L,h!==null){let P=h.views;g!==null&&(t.setRenderTargetFramebuffer(u,g.framebuffer),t.setRenderTarget(u));let w=!1;P.length!==M.cameras.length&&(M.cameras.length=0,w=!0);for(let S=0;S<P.length;S++){let $=P[S],ct=null;if(g!==null)ct=g.getViewport($);else{let ft=d.getViewSubImage(f,$);ct=ft.viewport,S===0&&(t.setRenderTargetTextures(u,ft.colorTexture,f.ignoreDepthValues?void 0:ft.depthStencilTexture),t.setRenderTarget(u))}let W=j[S];W===void 0&&(W=new Ve,W.layers.enable(S),W.viewport=new De,j[S]=W),W.matrix.fromArray($.transform.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale),W.projectionMatrix.fromArray($.projectionMatrix),W.projectionMatrixInverse.copy(W.projectionMatrix).invert(),W.viewport.set(ct.x,ct.y,ct.width,ct.height),S===0&&(M.matrix.copy(W.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),w===!0&&M.cameras.push(W)}}for(let P=0;P<A.length;P++){let w=_[P],S=A[P];w!==null&&S!==void 0&&S.update(w,L,l||o)}ut&&ut(it,L),L.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:L}),x=null}let Mt=new Sl;Mt.setAnimationLoop(_t),this.setAnimationLoop=function(it){ut=it},this.dispose=function(){}}};function Um(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Ml(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,A,_,b){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&g(p,u,b)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),y(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?c(p,u,A,_):u.isSpriteMaterial?l(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===$e&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===$e&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let A=t.get(u).envMap;if(A&&(p.envMap.value=A,p.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function c(p,u,A,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*A,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function l(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function g(p,u,A){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===$e&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function y(p,u){let A=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Dm(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(A,_){let b=_.program;n.uniformBlockBinding(A,b)}function l(A,_){let b=s[A.id];b===void 0&&(x(A),b=h(A),s[A.id]=b,A.addEventListener("dispose",p));let N=_.program;n.updateUBOMapping(A,N);let I=t.render.frame;r[A.id]!==I&&(f(A),r[A.id]=I)}function h(A){let _=d();A.__bindingPointIndex=_;let b=i.createBuffer(),N=A.__size,I=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,N,I),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,b),b}function d(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){let _=s[A.id],b=A.uniforms,N=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let I=0,C=b.length;I<C;I++){let j=Array.isArray(b[I])?b[I]:[b[I]];for(let M=0,T=j.length;M<T;M++){let Y=j[M];if(g(Y,I,M,N)===!0){let K=Y.__offset,dt=Array.isArray(Y.value)?Y.value:[Y.value],U=0;for(let q=0;q<dt.length;q++){let tt=dt[q],Q=y(tt);typeof tt=="number"||typeof tt=="boolean"?(Y.__data[0]=tt,i.bufferSubData(i.UNIFORM_BUFFER,K+U,Y.__data)):tt.isMatrix3?(Y.__data[0]=tt.elements[0],Y.__data[1]=tt.elements[1],Y.__data[2]=tt.elements[2],Y.__data[3]=0,Y.__data[4]=tt.elements[3],Y.__data[5]=tt.elements[4],Y.__data[6]=tt.elements[5],Y.__data[7]=0,Y.__data[8]=tt.elements[6],Y.__data[9]=tt.elements[7],Y.__data[10]=tt.elements[8],Y.__data[11]=0):(tt.toArray(Y.__data,U),U+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,K,Y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(A,_,b,N){let I=A.value,C=_+"_"+b;if(N[C]===void 0)return typeof I=="number"||typeof I=="boolean"?N[C]=I:N[C]=I.clone(),!0;{let j=N[C];if(typeof I=="number"||typeof I=="boolean"){if(j!==I)return N[C]=I,!0}else if(j.equals(I)===!1)return j.copy(I),!0}return!1}function x(A){let _=A.uniforms,b=0,N=16;for(let C=0,j=_.length;C<j;C++){let M=Array.isArray(_[C])?_[C]:[_[C]];for(let T=0,Y=M.length;T<Y;T++){let K=M[T],dt=Array.isArray(K.value)?K.value:[K.value];for(let U=0,q=dt.length;U<q;U++){let tt=dt[U],Q=y(tt),z=b%N;z!==0&&N-z<Q.boundary&&(b+=N-z),K.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=b,b+=Q.storage}}}let I=b%N;return I>0&&(b+=N-I),A.__size=b,A.__cache={},this}function y(A){let _={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(_.boundary=4,_.storage=4):A.isVector2?(_.boundary=8,_.storage=8):A.isVector3||A.isColor?(_.boundary=16,_.storage=12):A.isVector4?(_.boundary=16,_.storage=16):A.isMatrix3?(_.boundary=48,_.storage=48):A.isMatrix4?(_.boundary=64,_.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),_}function p(A){let _=A.target;_.removeEventListener("dispose",p);let b=o.indexOf(_.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:c,update:l,dispose:u}}var gs=class{constructor(t={}){let{canvas:e=Vh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let g=new Uint32Array(4),x=new Int32Array(4),y=null,p=null,u=[],A=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=we,this._useLegacyLights=!1,this.toneMapping=qn,this.toneMappingExposure=1;let _=this,b=!1,N=0,I=0,C=null,j=-1,M=null,T=new De,Y=new De,K=null,dt=new Kt(0),U=0,q=e.width,tt=e.height,Q=1,z=null,rt=null,ut=new De(0,0,q,tt),_t=new De(0,0,q,tt),Mt=!1,it=new ms,L=!1,P=!1,w=null,S=new be,$=new yt,ct=new G,W={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ft(){return C===null?Q:1}let R=n;function et(E,Z){for(let st=0;st<E.length;st++){let at=E[st],nt=e.getContext(at,Z);if(nt!==null)return nt}return null}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",Et,!1),e.addEventListener("webglcontextrestored",F,!1),e.addEventListener("webglcontextcreationerror",Rt,!1),R===null){let Z=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&Z.shift(),R=et(Z,E),R===null)throw et(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&R instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),R.getShaderPrecisionFormat===void 0&&(R.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let O,X,H,mt,D,m,v,k,gt,xt,ht,Ut,St,Pt,Ot,Xt,pt,Ft,Wt,kt,zt,Dt,Qt,re;function he(){O=new Qf(R),X=new Yf(R,O,t),O.init(X),Dt=new Im(R,O,X),H=new Cm(R,O,X),mt=new np(R),D=new _m,m=new Pm(R,O,H,D,X,Dt,mt),v=new Jf(_),k=new jf(_),gt=new lu(R,X),Qt=new Xf(R,O,gt,X),xt=new tp(R,gt,mt,Qt),ht=new ap(R,xt,gt,mt),Wt=new rp(R,X,m),Xt=new Zf(D),Ut=new gm(_,v,k,O,X,Qt,Xt),St=new Um(_,D),Pt=new ym,Ot=new wm(O,X),Ft=new Wf(_,v,k,H,ht,f,c),pt=new Rm(_,ht,X),re=new Dm(R,mt,X,H),kt=new qf(R,O,mt,X),zt=new ep(R,O,mt,X),mt.programs=Ut.programs,_.capabilities=X,_.extensions=O,_.properties=D,_.renderLists=Pt,_.shadowMap=pt,_.state=H,_.info=mt}he();let ee=new qa(_,R);this.xr=ee,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let E=O.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=O.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(E){E!==void 0&&(Q=E,this.setSize(q,tt,!1))},this.getSize=function(E){return E.set(q,tt)},this.setSize=function(E,Z,st=!0){if(ee.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=E,tt=Z,e.width=Math.floor(E*Q),e.height=Math.floor(Z*Q),st===!0&&(e.style.width=E+"px",e.style.height=Z+"px"),this.setViewport(0,0,E,Z)},this.getDrawingBufferSize=function(E){return E.set(q*Q,tt*Q).floor()},this.setDrawingBufferSize=function(E,Z,st){q=E,tt=Z,Q=st,e.width=Math.floor(E*st),e.height=Math.floor(Z*st),this.setViewport(0,0,E,Z)},this.getCurrentViewport=function(E){return E.copy(T)},this.getViewport=function(E){return E.copy(ut)},this.setViewport=function(E,Z,st,at){E.isVector4?ut.set(E.x,E.y,E.z,E.w):ut.set(E,Z,st,at),H.viewport(T.copy(ut).multiplyScalar(Q).floor())},this.getScissor=function(E){return E.copy(_t)},this.setScissor=function(E,Z,st,at){E.isVector4?_t.set(E.x,E.y,E.z,E.w):_t.set(E,Z,st,at),H.scissor(Y.copy(_t).multiplyScalar(Q).floor())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(E){H.setScissorTest(Mt=E)},this.setOpaqueSort=function(E){z=E},this.setTransparentSort=function(E){rt=E},this.getClearColor=function(E){return E.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor.apply(Ft,arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha.apply(Ft,arguments)},this.clear=function(E=!0,Z=!0,st=!0){let at=0;if(E){let nt=!1;if(C!==null){let Lt=C.texture.format;nt=Lt===pl||Lt===fl||Lt===dl}if(nt){let Lt=C.texture.type,Bt=Lt===Yn||Lt===Gn||Lt===vo||Lt===ri||Lt===hl||Lt===ul,Ht=Ft.getClearColor(),Gt=Ft.getClearAlpha(),jt=Ht.r,Zt=Ht.g,Jt=Ht.b;Bt?(g[0]=jt,g[1]=Zt,g[2]=Jt,g[3]=Gt,R.clearBufferuiv(R.COLOR,0,g)):(x[0]=jt,x[1]=Zt,x[2]=Jt,x[3]=Gt,R.clearBufferiv(R.COLOR,0,x))}else at|=R.COLOR_BUFFER_BIT}Z&&(at|=R.DEPTH_BUFFER_BIT),st&&(at|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Et,!1),e.removeEventListener("webglcontextrestored",F,!1),e.removeEventListener("webglcontextcreationerror",Rt,!1),Pt.dispose(),Ot.dispose(),D.dispose(),v.dispose(),k.dispose(),ht.dispose(),Qt.dispose(),re.dispose(),Ut.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",Re),ee.removeEventListener("sessionend",ce),w&&(w.dispose(),w=null),Ne.stop()};function Et(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;let E=mt.autoReset,Z=pt.enabled,st=pt.autoUpdate,at=pt.needsUpdate,nt=pt.type;he(),mt.autoReset=E,pt.enabled=Z,pt.autoUpdate=st,pt.needsUpdate=at,pt.type=nt}function Rt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function At(E){let Z=E.target;Z.removeEventListener("dispose",At),qt(Z)}function qt(E){Vt(E),D.remove(E)}function Vt(E){let Z=D.get(E).programs;Z!==void 0&&(Z.forEach(function(st){Ut.releaseProgram(st)}),E.isShaderMaterial&&Ut.releaseShaderCache(E))}this.renderBufferDirect=function(E,Z,st,at,nt,Lt){Z===null&&(Z=W);let Bt=nt.isMesh&&nt.matrixWorld.determinant()<0,Ht=Ee(E,Z,st,at,nt);H.setMaterial(at,Bt);let Gt=st.index,jt=1;if(at.wireframe===!0){if(Gt=xt.getWireframeAttribute(st),Gt===void 0)return;jt=2}let Zt=st.drawRange,Jt=st.attributes.position,ue=Zt.start*jt,Ge=(Zt.start+Zt.count)*jt;Lt!==null&&(ue=Math.max(ue,Lt.start*jt),Ge=Math.min(Ge,(Lt.start+Lt.count)*jt)),Gt!==null?(ue=Math.max(ue,0),Ge=Math.min(Ge,Gt.count)):Jt!=null&&(ue=Math.max(ue,0),Ge=Math.min(Ge,Jt.count));let ye=Ge-ue;if(ye<0||ye===1/0)return;Qt.setup(nt,at,Ht,st,Gt);let un,de=kt;if(Gt!==null&&(un=gt.get(Gt),de=zt,de.setIndex(un)),nt.isMesh)at.wireframe===!0?(H.setLineWidth(at.wireframeLinewidth*ft()),de.setMode(R.LINES)):de.setMode(R.TRIANGLES);else if(nt.isLine){let ne=at.linewidth;ne===void 0&&(ne=1),H.setLineWidth(ne*ft()),nt.isLineSegments?de.setMode(R.LINES):nt.isLineLoop?de.setMode(R.LINE_LOOP):de.setMode(R.LINE_STRIP)}else nt.isPoints?de.setMode(R.POINTS):nt.isSprite&&de.setMode(R.TRIANGLES);if(nt.isBatchedMesh)de.renderMultiDraw(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount);else if(nt.isInstancedMesh)de.renderInstances(ue,ye,nt.count);else if(st.isInstancedBufferGeometry){let ne=st._maxInstanceCount!==void 0?st._maxInstanceCount:1/0,ts=Math.min(st.instanceCount,ne);de.renderInstances(ue,ye,ts)}else de.render(ue,ye)};function ae(E,Z,st){E.transparent===!0&&E.side===rn&&E.forceSinglePass===!1?(E.side=$e,E.needsUpdate=!0,mi(E,Z,st),E.side=Sn,E.needsUpdate=!0,mi(E,Z,st),E.side=rn):mi(E,Z,st)}this.compile=function(E,Z,st=null){st===null&&(st=E),p=Ot.get(st),p.init(),A.push(p),st.traverseVisible(function(nt){nt.isLight&&nt.layers.test(Z.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),E!==st&&E.traverseVisible(function(nt){nt.isLight&&nt.layers.test(Z.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),p.setupLights(_._useLegacyLights);let at=new Set;return E.traverse(function(nt){let Lt=nt.material;if(Lt)if(Array.isArray(Lt))for(let Bt=0;Bt<Lt.length;Bt++){let Ht=Lt[Bt];ae(Ht,st,nt),at.add(Ht)}else ae(Lt,st,nt),at.add(Lt)}),A.pop(),p=null,at},this.compileAsync=function(E,Z,st=null){let at=this.compile(E,Z,st);return new Promise(nt=>{function Lt(){if(at.forEach(function(Bt){D.get(Bt).currentProgram.isReady()&&at.delete(Bt)}),at.size===0){nt(E);return}setTimeout(Lt,10)}O.get("KHR_parallel_shader_compile")!==null?Lt():setTimeout(Lt,10)})};let oe=null;function xe(E){oe&&oe(E)}function Re(){Ne.stop()}function ce(){Ne.start()}let Ne=new Sl;Ne.setAnimationLoop(xe),typeof self<"u"&&Ne.setContext(self),this.setAnimationLoop=function(E){oe=E,ee.setAnimationLoop(E),E===null?Ne.stop():Ne.start()},ee.addEventListener("sessionstart",Re),ee.addEventListener("sessionend",ce),this.render=function(E,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(Z),Z=ee.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,Z,C),p=Ot.get(E,A.length),p.init(),A.push(p),S.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),it.setFromProjectionMatrix(S),P=this.localClippingEnabled,L=Xt.init(this.clippingPlanes,P),y=Pt.get(E,u.length),y.init(),u.push(y),Ke(E,Z,0,_.sortObjects),y.finish(),_.sortObjects===!0&&y.sort(z,rt),this.info.render.frame++,L===!0&&Xt.beginShadows();let st=p.state.shadowsArray;if(pt.render(st,E,Z),L===!0&&Xt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ft.render(y,E),p.setupLights(_._useLegacyLights),Z.isArrayCamera){let at=Z.cameras;for(let nt=0,Lt=at.length;nt<Lt;nt++){let Bt=at[nt];Ts(y,E,Bt,Bt.viewport)}}else Ts(y,E,Z);C!==null&&(m.updateMultisampleRenderTarget(C),m.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(_,E,Z),Qt.resetDefaultState(),j=-1,M=null,A.pop(),A.length>0?p=A[A.length-1]:p=null,u.pop(),u.length>0?y=u[u.length-1]:y=null};function Ke(E,Z,st,at){if(E.visible===!1)return;if(E.layers.test(Z.layers)){if(E.isGroup)st=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(Z);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||it.intersectsSprite(E)){at&&ct.setFromMatrixPosition(E.matrixWorld).applyMatrix4(S);let Bt=ht.update(E),Ht=E.material;Ht.visible&&y.push(E,Bt,Ht,st,ct.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||it.intersectsObject(E))){let Bt=ht.update(E),Ht=E.material;if(at&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ct.copy(E.boundingSphere.center)):(Bt.boundingSphere===null&&Bt.computeBoundingSphere(),ct.copy(Bt.boundingSphere.center)),ct.applyMatrix4(E.matrixWorld).applyMatrix4(S)),Array.isArray(Ht)){let Gt=Bt.groups;for(let jt=0,Zt=Gt.length;jt<Zt;jt++){let Jt=Gt[jt],ue=Ht[Jt.materialIndex];ue&&ue.visible&&y.push(E,Bt,ue,st,ct.z,Jt)}}else Ht.visible&&y.push(E,Bt,Ht,st,ct.z,null)}}let Lt=E.children;for(let Bt=0,Ht=Lt.length;Bt<Ht;Bt++)Ke(Lt[Bt],Z,st,at)}function Ts(E,Z,st,at){let nt=E.opaque,Lt=E.transmissive,Bt=E.transparent;p.setupLightsView(st),L===!0&&Xt.setGlobalState(_.clippingPlanes,st),Lt.length>0&&Xr(nt,Lt,Z,st),at&&H.viewport(T.copy(at)),nt.length>0&&pi(nt,Z,st),Lt.length>0&&pi(Lt,Z,st),Bt.length>0&&pi(Bt,Z,st),H.buffers.depth.setTest(!0),H.buffers.depth.setMask(!0),H.buffers.color.setMask(!0),H.setPolygonOffset(!1)}function Xr(E,Z,st,at){if((st.isScene===!0?st.overrideMaterial:null)!==null)return;let Lt=X.isWebGL2;w===null&&(w=new Fn(1,1,{generateMipmaps:!0,type:O.has("EXT_color_buffer_half_float")?fs:Yn,minFilter:ds,samples:Lt?4:0})),_.getDrawingBufferSize($),Lt?w.setSize($.x,$.y):w.setSize(fr($.x),fr($.y));let Bt=_.getRenderTarget();_.setRenderTarget(w),_.getClearColor(dt),U=_.getClearAlpha(),U<1&&_.setClearColor(16777215,.5),_.clear();let Ht=_.toneMapping;_.toneMapping=qn,pi(E,st,at),m.updateMultisampleRenderTarget(w),m.updateRenderTargetMipmap(w);let Gt=!1;for(let jt=0,Zt=Z.length;jt<Zt;jt++){let Jt=Z[jt],ue=Jt.object,Ge=Jt.geometry,ye=Jt.material,un=Jt.group;if(ye.side===rn&&ue.layers.test(at.layers)){let de=ye.side;ye.side=$e,ye.needsUpdate=!0,Qi(ue,st,at,Ge,ye,un),ye.side=de,ye.needsUpdate=!0,Gt=!0}}Gt===!0&&(m.updateMultisampleRenderTarget(w),m.updateRenderTargetMipmap(w)),_.setRenderTarget(Bt),_.setClearColor(dt,U),_.toneMapping=Ht}function pi(E,Z,st){let at=Z.isScene===!0?Z.overrideMaterial:null;for(let nt=0,Lt=E.length;nt<Lt;nt++){let Bt=E[nt],Ht=Bt.object,Gt=Bt.geometry,jt=at===null?Bt.material:at,Zt=Bt.group;Ht.layers.test(st.layers)&&Qi(Ht,Z,st,Gt,jt,Zt)}}function Qi(E,Z,st,at,nt,Lt){E.onBeforeRender(_,Z,st,at,nt,Lt),E.modelViewMatrix.multiplyMatrices(st.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),nt.onBeforeRender(_,Z,st,at,E,Lt),nt.transparent===!0&&nt.side===rn&&nt.forceSinglePass===!1?(nt.side=$e,nt.needsUpdate=!0,_.renderBufferDirect(st,Z,at,nt,E,Lt),nt.side=Sn,nt.needsUpdate=!0,_.renderBufferDirect(st,Z,at,nt,E,Lt),nt.side=rn):_.renderBufferDirect(st,Z,at,nt,E,Lt),E.onAfterRender(_,Z,st,at,nt,Lt)}function mi(E,Z,st){Z.isScene!==!0&&(Z=W);let at=D.get(E),nt=p.state.lights,Lt=p.state.shadowsArray,Bt=nt.state.version,Ht=Ut.getParameters(E,nt.state,Lt,Z,st),Gt=Ut.getProgramCacheKey(Ht),jt=at.programs;at.environment=E.isMeshStandardMaterial?Z.environment:null,at.fog=Z.fog,at.envMap=(E.isMeshStandardMaterial?k:v).get(E.envMap||at.environment),jt===void 0&&(E.addEventListener("dispose",At),jt=new Map,at.programs=jt);let Zt=jt.get(Gt);if(Zt!==void 0){if(at.currentProgram===Zt&&at.lightsStateVersion===Bt)return En(E,Ht),Zt}else Ht.uniforms=Ut.getUniforms(E),E.onBuild(st,Ht,_),E.onBeforeCompile(Ht,_),Zt=Ut.acquireProgram(Ht,Gt),jt.set(Gt,Zt),at.uniforms=Ht.uniforms;let Jt=at.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Jt.clippingPlanes=Xt.uniform),En(E,Ht),at.needsLights=Cs(E),at.lightsStateVersion=Bt,at.needsLights&&(Jt.ambientLightColor.value=nt.state.ambient,Jt.lightProbe.value=nt.state.probe,Jt.directionalLights.value=nt.state.directional,Jt.directionalLightShadows.value=nt.state.directionalShadow,Jt.spotLights.value=nt.state.spot,Jt.spotLightShadows.value=nt.state.spotShadow,Jt.rectAreaLights.value=nt.state.rectArea,Jt.ltc_1.value=nt.state.rectAreaLTC1,Jt.ltc_2.value=nt.state.rectAreaLTC2,Jt.pointLights.value=nt.state.point,Jt.pointLightShadows.value=nt.state.pointShadow,Jt.hemisphereLights.value=nt.state.hemi,Jt.directionalShadowMap.value=nt.state.directionalShadowMap,Jt.directionalShadowMatrix.value=nt.state.directionalShadowMatrix,Jt.spotShadowMap.value=nt.state.spotShadowMap,Jt.spotLightMatrix.value=nt.state.spotLightMatrix,Jt.spotLightMap.value=nt.state.spotLightMap,Jt.pointShadowMap.value=nt.state.pointShadowMap,Jt.pointShadowMatrix.value=nt.state.pointShadowMatrix),at.currentProgram=Zt,at.uniformsList=null,Zt}function As(E){if(E.uniformsList===null){let Z=E.currentProgram.getUniforms();E.uniformsList=ki.seqWithValue(Z.seq,E.uniforms)}return E.uniformsList}function En(E,Z){let st=D.get(E);st.outputColorSpace=Z.outputColorSpace,st.batching=Z.batching,st.instancing=Z.instancing,st.instancingColor=Z.instancingColor,st.skinning=Z.skinning,st.morphTargets=Z.morphTargets,st.morphNormals=Z.morphNormals,st.morphColors=Z.morphColors,st.morphTargetsCount=Z.morphTargetsCount,st.numClippingPlanes=Z.numClippingPlanes,st.numIntersection=Z.numClipIntersection,st.vertexAlphas=Z.vertexAlphas,st.vertexTangents=Z.vertexTangents,st.toneMapping=Z.toneMapping}function Ee(E,Z,st,at,nt){Z.isScene!==!0&&(Z=W),m.resetTextureUnits();let Lt=Z.fog,Bt=at.isMeshStandardMaterial?Z.environment:null,Ht=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:On,Gt=(at.isMeshStandardMaterial?k:v).get(at.envMap||Bt),jt=at.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,Zt=!!st.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),Jt=!!st.morphAttributes.position,ue=!!st.morphAttributes.normal,Ge=!!st.morphAttributes.color,ye=qn;at.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ye=_.toneMapping);let un=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,de=un!==void 0?un.length:0,ne=D.get(at),ts=p.state.lights;if(L===!0&&(P===!0||E!==M)){let B=E===M&&at.id===j;Xt.setState(at,E,B)}let fe=!1;at.version===ne.__version?(ne.needsLights&&ne.lightsStateVersion!==ts.state.version||ne.outputColorSpace!==Ht||nt.isBatchedMesh&&ne.batching===!1||!nt.isBatchedMesh&&ne.batching===!0||nt.isInstancedMesh&&ne.instancing===!1||!nt.isInstancedMesh&&ne.instancing===!0||nt.isSkinnedMesh&&ne.skinning===!1||!nt.isSkinnedMesh&&ne.skinning===!0||nt.isInstancedMesh&&ne.instancingColor===!0&&nt.instanceColor===null||nt.isInstancedMesh&&ne.instancingColor===!1&&nt.instanceColor!==null||ne.envMap!==Gt||at.fog===!0&&ne.fog!==Lt||ne.numClippingPlanes!==void 0&&(ne.numClippingPlanes!==Xt.numPlanes||ne.numIntersection!==Xt.numIntersection)||ne.vertexAlphas!==jt||ne.vertexTangents!==Zt||ne.morphTargets!==Jt||ne.morphNormals!==ue||ne.morphColors!==Ge||ne.toneMapping!==ye||X.isWebGL2===!0&&ne.morphTargetsCount!==de)&&(fe=!0):(fe=!0,ne.__version=at.version);let vn=ne.currentProgram;fe===!0&&(vn=mi(at,Z,nt));let Ps=!1,Kn=!1,es=!1,Ce=vn.getUniforms(),wn=ne.uniforms;if(H.useProgram(vn.program)&&(Ps=!0,Kn=!0,es=!0),at.id!==j&&(j=at.id,Kn=!0),Ps||M!==E){Ce.setValue(R,"projectionMatrix",E.projectionMatrix),Ce.setValue(R,"viewMatrix",E.matrixWorldInverse);let B=Ce.map.cameraPosition;B!==void 0&&B.setValue(R,ct.setFromMatrixPosition(E.matrixWorld)),X.logarithmicDepthBuffer&&Ce.setValue(R,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&Ce.setValue(R,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,Kn=!0,es=!0)}if(nt.isSkinnedMesh){Ce.setOptional(R,nt,"bindMatrix"),Ce.setOptional(R,nt,"bindMatrixInverse");let B=nt.skeleton;B&&(X.floatVertexTextures?(B.boneTexture===null&&B.computeBoneTexture(),Ce.setValue(R,"boneTexture",B.boneTexture,m)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}nt.isBatchedMesh&&(Ce.setOptional(R,nt,"batchingTexture"),Ce.setValue(R,"batchingTexture",nt._matricesTexture,m));let gi=st.morphAttributes;if((gi.position!==void 0||gi.normal!==void 0||gi.color!==void 0&&X.isWebGL2===!0)&&Wt.update(nt,st,vn),(Kn||ne.receiveShadow!==nt.receiveShadow)&&(ne.receiveShadow=nt.receiveShadow,Ce.setValue(R,"receiveShadow",nt.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(wn.envMap.value=Gt,wn.flipEnvMap.value=Gt.isCubeTexture&&Gt.isRenderTargetTexture===!1?-1:1),Kn&&(Ce.setValue(R,"toneMappingExposure",_.toneMappingExposure),ne.needsLights&&Rs(wn,es),Lt&&at.fog===!0&&St.refreshFogUniforms(wn,Lt),St.refreshMaterialUniforms(wn,at,Q,tt,w),ki.upload(R,As(ne),wn,m)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(ki.upload(R,As(ne),wn,m),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&Ce.setValue(R,"center",nt.center),Ce.setValue(R,"modelViewMatrix",nt.modelViewMatrix),Ce.setValue(R,"normalMatrix",nt.normalMatrix),Ce.setValue(R,"modelMatrix",nt.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){let B=at.uniformsGroups;for(let J=0,V=B.length;J<V;J++)if(X.isWebGL2){let ot=B[J];re.update(ot,vn),re.bind(ot,vn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return vn}function Rs(E,Z){E.ambientLightColor.needsUpdate=Z,E.lightProbe.needsUpdate=Z,E.directionalLights.needsUpdate=Z,E.directionalLightShadows.needsUpdate=Z,E.pointLights.needsUpdate=Z,E.pointLightShadows.needsUpdate=Z,E.spotLights.needsUpdate=Z,E.spotLightShadows.needsUpdate=Z,E.rectAreaLights.needsUpdate=Z,E.hemisphereLights.needsUpdate=Z}function Cs(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,Z,st){D.get(E.texture).__webglTexture=Z,D.get(E.depthTexture).__webglTexture=st;let at=D.get(E);at.__hasExternalTextures=!0,at.__hasExternalTextures&&(at.__autoAllocateDepthBuffer=st===void 0,at.__autoAllocateDepthBuffer||O.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),at.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,Z){let st=D.get(E);st.__webglFramebuffer=Z,st.__useDefaultFramebuffer=Z===void 0},this.setRenderTarget=function(E,Z=0,st=0){C=E,N=Z,I=st;let at=!0,nt=null,Lt=!1,Bt=!1;if(E){let Gt=D.get(E);Gt.__useDefaultFramebuffer!==void 0?(H.bindFramebuffer(R.FRAMEBUFFER,null),at=!1):Gt.__webglFramebuffer===void 0?m.setupRenderTarget(E):Gt.__hasExternalTextures&&m.rebindTextures(E,D.get(E.texture).__webglTexture,D.get(E.depthTexture).__webglTexture);let jt=E.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Bt=!0);let Zt=D.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Zt[Z])?nt=Zt[Z][st]:nt=Zt[Z],Lt=!0):X.isWebGL2&&E.samples>0&&m.useMultisampledRTT(E)===!1?nt=D.get(E).__webglMultisampledFramebuffer:Array.isArray(Zt)?nt=Zt[st]:nt=Zt,T.copy(E.viewport),Y.copy(E.scissor),K=E.scissorTest}else T.copy(ut).multiplyScalar(Q).floor(),Y.copy(_t).multiplyScalar(Q).floor(),K=Mt;if(H.bindFramebuffer(R.FRAMEBUFFER,nt)&&X.drawBuffers&&at&&H.drawBuffers(E,nt),H.viewport(T),H.scissor(Y),H.setScissorTest(K),Lt){let Gt=D.get(E.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Gt.__webglTexture,st)}else if(Bt){let Gt=D.get(E.texture),jt=Z||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Gt.__webglTexture,st||0,jt)}j=-1},this.readRenderTargetPixels=function(E,Z,st,at,nt,Lt,Bt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=D.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Bt!==void 0&&(Ht=Ht[Bt]),Ht){H.bindFramebuffer(R.FRAMEBUFFER,Ht);try{let Gt=E.texture,jt=Gt.format,Zt=Gt.type;if(jt!==gn&&Dt.convert(jt)!==R.getParameter(R.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Jt=Zt===fs&&(O.has("EXT_color_buffer_half_float")||X.isWebGL2&&O.has("EXT_color_buffer_float"));if(Zt!==Yn&&Dt.convert(Zt)!==R.getParameter(R.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Zt===Wn&&(X.isWebGL2||O.has("OES_texture_float")||O.has("WEBGL_color_buffer_float")))&&!Jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=E.width-at&&st>=0&&st<=E.height-nt&&R.readPixels(Z,st,at,nt,Dt.convert(jt),Dt.convert(Zt),Lt)}finally{let Gt=C!==null?D.get(C).__webglFramebuffer:null;H.bindFramebuffer(R.FRAMEBUFFER,Gt)}}},this.copyFramebufferToTexture=function(E,Z,st=0){let at=Math.pow(2,-st),nt=Math.floor(Z.image.width*at),Lt=Math.floor(Z.image.height*at);m.setTexture2D(Z,0),R.copyTexSubImage2D(R.TEXTURE_2D,st,0,0,E.x,E.y,nt,Lt),H.unbindTexture()},this.copyTextureToTexture=function(E,Z,st,at=0){let nt=Z.image.width,Lt=Z.image.height,Bt=Dt.convert(st.format),Ht=Dt.convert(st.type);m.setTexture2D(st,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,st.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,st.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,st.unpackAlignment),Z.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,at,E.x,E.y,nt,Lt,Bt,Ht,Z.image.data):Z.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,at,E.x,E.y,Z.mipmaps[0].width,Z.mipmaps[0].height,Bt,Z.mipmaps[0].data):R.texSubImage2D(R.TEXTURE_2D,at,E.x,E.y,Bt,Ht,Z.image),at===0&&st.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),H.unbindTexture()},this.copyTextureToTexture3D=function(E,Z,st,at,nt=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Lt=E.max.x-E.min.x+1,Bt=E.max.y-E.min.y+1,Ht=E.max.z-E.min.z+1,Gt=Dt.convert(at.format),jt=Dt.convert(at.type),Zt;if(at.isData3DTexture)m.setTexture3D(at,0),Zt=R.TEXTURE_3D;else if(at.isDataArrayTexture||at.isCompressedArrayTexture)m.setTexture2DArray(at,0),Zt=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,at.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,at.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,at.unpackAlignment);let Jt=R.getParameter(R.UNPACK_ROW_LENGTH),ue=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ge=R.getParameter(R.UNPACK_SKIP_PIXELS),ye=R.getParameter(R.UNPACK_SKIP_ROWS),un=R.getParameter(R.UNPACK_SKIP_IMAGES),de=st.isCompressedTexture?st.mipmaps[nt]:st.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,de.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,de.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,E.min.x),R.pixelStorei(R.UNPACK_SKIP_ROWS,E.min.y),R.pixelStorei(R.UNPACK_SKIP_IMAGES,E.min.z),st.isDataTexture||st.isData3DTexture?R.texSubImage3D(Zt,nt,Z.x,Z.y,Z.z,Lt,Bt,Ht,Gt,jt,de.data):st.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),R.compressedTexSubImage3D(Zt,nt,Z.x,Z.y,Z.z,Lt,Bt,Ht,Gt,de.data)):R.texSubImage3D(Zt,nt,Z.x,Z.y,Z.z,Lt,Bt,Ht,Gt,jt,de),R.pixelStorei(R.UNPACK_ROW_LENGTH,Jt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ue),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ge),R.pixelStorei(R.UNPACK_SKIP_ROWS,ye),R.pixelStorei(R.UNPACK_SKIP_IMAGES,un),nt===0&&at.generateMipmaps&&R.generateMipmap(Zt),H.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?m.setTextureCube(E,0):E.isData3DTexture?m.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?m.setTexture2DArray(E,0):m.setTexture2D(E,0),H.unbindTexture()},this.resetState=function(){N=0,I=0,C=null,H.reset(),Qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Mo?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Hr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===we?oi:gl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===oi?we:On}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Ya=class extends gs{};Ya.prototype.isWebGL1Renderer=!0;var Ar=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Kt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var _s=class extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var xs=class extends $n{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Jc=new be,Za=new xr,Qs=new Xi,tr=new G,Rr=class extends ze{constructor(t=new en,e=new xs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(s),Qs.radius+=r,t.ray.intersectsSphere(Qs)===!1)return;Jc.copy(s).invert(),Za.copy(t.ray).applyMatrix4(Jc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let x=f,y=g;x<y;x++){let p=l.getX(x);tr.fromBufferAttribute(d,p),$c(tr,p,c,s,t,e,this)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=f,y=g;x<y;x++)tr.fromBufferAttribute(d,x),$c(tr,x,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function $c(i,t,e,n,s,r,o){let a=Za.distanceSqToPoint(i);if(a<e){let c=new G;Za.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var Cr=class extends on{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},cn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,g=(o-h)/f;return(s+g)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new yt:new G);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new G,s=[],r=[],o=[],a=new G,c=new be;for(let g=0;g<=t;g++){let x=g/t;s[g]=this.getTangentAt(x,new G)}r[0]=new G,o[0]=new G;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let g=1;g<=t;g++){if(r[g]=r[g-1].clone(),o[g]=o[g-1].clone(),a.crossVectors(s[g-1],s[g]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(Ue(s[g-1].dot(s[g]),-1,1));r[g].applyMatrix4(c.makeRotationAxis(a,x))}o[g].crossVectors(s[g],r[g])}if(e===!0){let g=Math.acos(Ue(r[0].dot(r[t]),-1,1));g/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(g=-g);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],g*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},ys=class extends cn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){let n=e||new yt,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,g=l-this.aY;c=f*h-g*d+this.aX,l=f*d+g*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ja=class extends ys{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Eo(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,g=(a-o)/h-(c-o)/(h+d)+(c-a)/d;f*=h,g*=h,s(o,a,f,g)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var er=new G,Ma=new Eo,Sa=new Eo,ba=new Eo,$a=class extends cn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new G){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(er.subVectors(s[0],s[1]).add(s[0]),l=er);let d=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(er.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=er),this.curveType==="centripetal"||this.curveType==="chordal"){let g=this.curveType==="chordal"?.5:.25,x=Math.pow(l.distanceToSquared(d),g),y=Math.pow(d.distanceToSquared(f),g),p=Math.pow(f.distanceToSquared(h),g);y<1e-4&&(y=1),x<1e-4&&(x=y),p<1e-4&&(p=y),Ma.initNonuniformCatmullRom(l.x,d.x,f.x,h.x,x,y,p),Sa.initNonuniformCatmullRom(l.y,d.y,f.y,h.y,x,y,p),ba.initNonuniformCatmullRom(l.z,d.z,f.z,h.z,x,y,p)}else this.curveType==="catmullrom"&&(Ma.initCatmullRom(l.x,d.x,f.x,h.x,this.tension),Sa.initCatmullRom(l.y,d.y,f.y,h.y,this.tension),ba.initCatmullRom(l.z,d.z,f.z,h.z,this.tension));return n.set(Ma.calc(c),Sa.calc(c),ba.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new G().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Kc(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Nm(i,t){let e=1-i;return e*e*t}function Om(i,t){return 2*(1-i)*i*t}function Fm(i,t){return i*i*t}function hs(i,t,e,n){return Nm(i,t)+Om(i,e)+Fm(i,n)}function Bm(i,t){let e=1-i;return e*e*e*t}function zm(i,t){let e=1-i;return 3*e*e*i*t}function km(i,t){return 3*(1-i)*i*i*t}function Hm(i,t){return i*i*i*t}function us(i,t,e,n,s){return Bm(i,t)+zm(i,e)+km(i,n)+Hm(i,s)}var Pr=class extends cn{constructor(t=new yt,e=new yt,n=new yt,s=new yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new yt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(us(t,s.x,r.x,o.x,a.x),us(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ka=class extends cn{constructor(t=new G,e=new G,n=new G,s=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new G){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(us(t,s.x,r.x,o.x,a.x),us(t,s.y,r.y,o.y,a.y),us(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ir=class extends cn{constructor(t=new yt,e=new yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new yt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ja=class extends cn{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Lr=class extends cn{constructor(t=new yt,e=new yt,n=new yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new yt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(t,s.x,r.x,o.x),hs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Qa=class extends cn{constructor(t=new G,e=new G,n=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new G){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(t,s.x,r.x,o.x),hs(t,s.y,r.y,o.y),hs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ur=class extends cn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new yt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(Kc(a,c.x,l.x,h.x,d.x),Kc(a,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new yt().fromArray(s))}return this}},to=Object.freeze({__proto__:null,ArcCurve:Ja,CatmullRomCurve3:$a,CubicBezierCurve:Pr,CubicBezierCurve3:Ka,EllipseCurve:ys,LineCurve:Ir,LineCurve3:ja,QuadraticBezierCurve:Lr,QuadraticBezierCurve3:Qa,SplineCurve:Ur}),eo=class extends cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new to[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new to[s.type]().fromJSON(s))}return this}},ln=class extends eo{constructor(t){super(),this.type="Path",this.currentPoint=new yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ir(this.currentPoint.clone(),new yt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Lr(this.currentPoint.clone(),new yt(t,e),new yt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Pr(this.currentPoint.clone(),new yt(t,e),new yt(n,s),new yt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ur(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){let l=new ys(t,e,n,s,r,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var tn=class extends ln{constructor(t){super(t),this.uuid=fi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new ln().fromJSON(s))}return this}},Vm={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Rl(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,d,f,g;if(n&&(r=Ym(i,t,r,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let x=e;x<s;x+=e)d=i[x],f=i[x+1],d<a&&(a=d),f<c&&(c=f),d>l&&(l=d),f>h&&(h=f);g=Math.max(l-a,h-c),g=g!==0?32767/g:0}return vs(r,o,e,a,c,g,0),o}};function Rl(i,t,e,n,s){let r,o;if(s===sg(i,t,e,n)>0)for(r=t;r<e;r+=n)o=jc(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=jc(r,i[r],i[r+1],o);return o&&Gr(o,o.next)&&(Ss(o),o=o.next),o}function li(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Gr(e,e.next)||ge(e.prev,e,e.next)===0)){if(Ss(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function vs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&jm(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?Wm(i,n,s,r):Gm(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Ss(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Xm(li(i),t,e),vs(i,t,e,n,s,r,2)):o===2&&qm(i,t,e,n,s,r):vs(li(i),t,e,n,s,r,1);break}}}function Gm(i){let t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<c?a<l?a:l:c<l?c:l,f=s>r?s>o?s:o:r>o?r:o,g=a>c?a>l?a:l:c>l?c:l,x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=f&&x.y>=d&&x.y<=g&&Fi(s,a,r,c,o,l,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Wm(i,t,e,n){let s=i.prev,r=i,o=i.next;if(ge(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,f=o.y,g=a<c?a<l?a:l:c<l?c:l,x=h<d?h<f?h:f:d<f?d:f,y=a>c?a>l?a:l:c>l?c:l,p=h>d?h>f?h:f:d>f?d:f,u=no(g,x,t,e,n),A=no(y,p,t,e,n),_=i.prevZ,b=i.nextZ;for(;_&&_.z>=u&&b&&b.z<=A;){if(_.x>=g&&_.x<=y&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Fi(a,h,c,d,l,f,_.x,_.y)&&ge(_.prev,_,_.next)>=0||(_=_.prevZ,b.x>=g&&b.x<=y&&b.y>=x&&b.y<=p&&b!==s&&b!==o&&Fi(a,h,c,d,l,f,b.x,b.y)&&ge(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;_&&_.z>=u;){if(_.x>=g&&_.x<=y&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Fi(a,h,c,d,l,f,_.x,_.y)&&ge(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;b&&b.z<=A;){if(b.x>=g&&b.x<=y&&b.y>=x&&b.y<=p&&b!==s&&b!==o&&Fi(a,h,c,d,l,f,b.x,b.y)&&ge(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Xm(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Gr(s,r)&&Cl(s,n,n.next,r)&&Ms(s,r)&&Ms(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Ss(n),Ss(n.next),n=i=r),n=n.next}while(n!==i);return li(n)}function qm(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&eg(o,a)){let c=Pl(o,a);o=li(o,o.next),c=li(c,c.next),vs(o,t,e,n,s,r,0),vs(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Ym(i,t,e,n){let s=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Rl(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(tg(l));for(s.sort(Zm),r=0;r<s.length;r++)e=Jm(s[r],e);return e}function Zm(i,t){return i.x-t.x}function Jm(i,t){let e=$m(i,t);if(!e)return t;let n=Pl(e,i);return li(n,n.next),li(e,e.next)}function $m(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,d;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Fi(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(d=Math.abs(o-e.y)/(r-e.x),Ms(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&Km(s,e)))&&(s=e,h=d)),e=e.next;while(e!==a);return s}function Km(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function jm(i,t,e,n){let s=i;do s.z===0&&(s.z=no(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Qm(s)}function Qm(i){let t,e,n,s,r,o,a,c,l=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(o>1);return i}function no(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function tg(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Fi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function eg(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!ng(i,t)&&(Ms(i,t)&&Ms(t,i)&&ig(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||Gr(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Gr(i,t){return i.x===t.x&&i.y===t.y}function Cl(i,t,e,n){let s=ir(ge(i,t,e)),r=ir(ge(i,t,n)),o=ir(ge(e,n,i)),a=ir(ge(e,n,t));return!!(s!==r&&o!==a||s===0&&nr(i,e,t)||r===0&&nr(i,n,t)||o===0&&nr(e,i,n)||a===0&&nr(e,t,n))}function nr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ir(i){return i>0?1:i<0?-1:0}function ng(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Cl(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ms(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function ig(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Pl(i,t){let e=new io(i.i,i.x,i.y),n=new io(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function jc(i,t,e,n){let s=new io(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ss(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function io(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function sg(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Be=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Qc(t),tl(n,t);let o=t.length;e.forEach(Qc);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,tl(n,e[c]);let a=Vm.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Qc(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function tl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var hi=class i extends en{constructor(t=new tn([new yt(.5,.5),new yt(-.5,.5),new yt(-.5,-.5),new yt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new Ze(s,3)),this.setAttribute("uv",new Ze(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,g=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:g-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,u=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:rg,_,b=!1,N,I,C,j;u&&(_=u.getSpacedPoints(h),b=!0,f=!1,N=u.computeFrenetFrames(h,!1),I=new G,C=new G,j=new G),f||(p=0,g=0,x=0,y=0);let M=a.extractPoints(l),T=M.shape,Y=M.holes;if(!Be.isClockWise(T)){T=T.reverse();for(let R=0,et=Y.length;R<et;R++){let O=Y[R];Be.isClockWise(O)&&(Y[R]=O.reverse())}}let dt=Be.triangulateShape(T,Y),U=T;for(let R=0,et=Y.length;R<et;R++){let O=Y[R];T=T.concat(O)}function q(R,et,O){return et||console.error("THREE.ExtrudeGeometry: vec does not exist"),R.clone().addScaledVector(et,O)}let tt=T.length,Q=dt.length;function z(R,et,O){let X,H,mt,D=R.x-et.x,m=R.y-et.y,v=O.x-R.x,k=O.y-R.y,gt=D*D+m*m,xt=D*k-m*v;if(Math.abs(xt)>Number.EPSILON){let ht=Math.sqrt(gt),Ut=Math.sqrt(v*v+k*k),St=et.x-m/ht,Pt=et.y+D/ht,Ot=O.x-k/Ut,Xt=O.y+v/Ut,pt=((Ot-St)*k-(Xt-Pt)*v)/(D*k-m*v);X=St+D*pt-R.x,H=Pt+m*pt-R.y;let Ft=X*X+H*H;if(Ft<=2)return new yt(X,H);mt=Math.sqrt(Ft/2)}else{let ht=!1;D>Number.EPSILON?v>Number.EPSILON&&(ht=!0):D<-Number.EPSILON?v<-Number.EPSILON&&(ht=!0):Math.sign(m)===Math.sign(k)&&(ht=!0),ht?(X=-m,H=D,mt=Math.sqrt(gt)):(X=D,H=m,mt=Math.sqrt(gt/2))}return new yt(X/mt,H/mt)}let rt=[];for(let R=0,et=U.length,O=et-1,X=R+1;R<et;R++,O++,X++)O===et&&(O=0),X===et&&(X=0),rt[R]=z(U[R],U[O],U[X]);let ut=[],_t,Mt=rt.concat();for(let R=0,et=Y.length;R<et;R++){let O=Y[R];_t=[];for(let X=0,H=O.length,mt=H-1,D=X+1;X<H;X++,mt++,D++)mt===H&&(mt=0),D===H&&(D=0),_t[X]=z(O[X],O[mt],O[D]);ut.push(_t),Mt=Mt.concat(_t)}for(let R=0;R<p;R++){let et=R/p,O=g*Math.cos(et*Math.PI/2),X=x*Math.sin(et*Math.PI/2)+y;for(let H=0,mt=U.length;H<mt;H++){let D=q(U[H],rt[H],X);S(D.x,D.y,-O)}for(let H=0,mt=Y.length;H<mt;H++){let D=Y[H];_t=ut[H];for(let m=0,v=D.length;m<v;m++){let k=q(D[m],_t[m],X);S(k.x,k.y,-O)}}}let it=x+y;for(let R=0;R<tt;R++){let et=f?q(T[R],Mt[R],it):T[R];b?(C.copy(N.normals[0]).multiplyScalar(et.x),I.copy(N.binormals[0]).multiplyScalar(et.y),j.copy(_[0]).add(C).add(I),S(j.x,j.y,j.z)):S(et.x,et.y,0)}for(let R=1;R<=h;R++)for(let et=0;et<tt;et++){let O=f?q(T[et],Mt[et],it):T[et];b?(C.copy(N.normals[R]).multiplyScalar(O.x),I.copy(N.binormals[R]).multiplyScalar(O.y),j.copy(_[R]).add(C).add(I),S(j.x,j.y,j.z)):S(O.x,O.y,d/h*R)}for(let R=p-1;R>=0;R--){let et=R/p,O=g*Math.cos(et*Math.PI/2),X=x*Math.sin(et*Math.PI/2)+y;for(let H=0,mt=U.length;H<mt;H++){let D=q(U[H],rt[H],X);S(D.x,D.y,d+O)}for(let H=0,mt=Y.length;H<mt;H++){let D=Y[H];_t=ut[H];for(let m=0,v=D.length;m<v;m++){let k=q(D[m],_t[m],X);b?S(k.x,k.y+_[h-1].y,_[h-1].x+O):S(k.x,k.y,d+O)}}}L(),P();function L(){let R=s.length/3;if(f){let et=0,O=tt*et;for(let X=0;X<Q;X++){let H=dt[X];$(H[2]+O,H[1]+O,H[0]+O)}et=h+p*2,O=tt*et;for(let X=0;X<Q;X++){let H=dt[X];$(H[0]+O,H[1]+O,H[2]+O)}}else{for(let et=0;et<Q;et++){let O=dt[et];$(O[2],O[1],O[0])}for(let et=0;et<Q;et++){let O=dt[et];$(O[0]+tt*h,O[1]+tt*h,O[2]+tt*h)}}n.addGroup(R,s.length/3-R,0)}function P(){let R=s.length/3,et=0;w(U,et),et+=U.length;for(let O=0,X=Y.length;O<X;O++){let H=Y[O];w(H,et),et+=H.length}n.addGroup(R,s.length/3-R,1)}function w(R,et){let O=R.length;for(;--O>=0;){let X=O,H=O-1;H<0&&(H=R.length-1);for(let mt=0,D=h+p*2;mt<D;mt++){let m=tt*mt,v=tt*(mt+1),k=et+X+m,gt=et+H+m,xt=et+H+v,ht=et+X+v;ct(k,gt,xt,ht)}}}function S(R,et,O){c.push(R),c.push(et),c.push(O)}function $(R,et,O){W(R),W(et),W(O);let X=s.length/3,H=A.generateTopUV(n,s,X-3,X-2,X-1);ft(H[0]),ft(H[1]),ft(H[2])}function ct(R,et,O,X){W(R),W(et),W(X),W(et),W(O),W(X);let H=s.length/3,mt=A.generateSideWallUV(n,s,H-6,H-3,H-2,H-1);ft(mt[0]),ft(mt[1]),ft(mt[3]),ft(mt[1]),ft(mt[2]),ft(mt[3])}function W(R){s.push(c[R*3+0]),s.push(c[R*3+1]),s.push(c[R*3+2])}function ft(R){r.push(R.x),r.push(R.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return ag(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new to[s.type]().fromJSON(s)),new i(n,t.options)}},rg={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new yt(r,o),new yt(a,c),new yt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],f=t[s*3],g=t[s*3+1],x=t[s*3+2],y=t[r*3],p=t[r*3+1],u=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new yt(o,1-c),new yt(l,1-d),new yt(f,1-x),new yt(y,1-u)]:[new yt(a,1-c),new yt(h,1-d),new yt(g,1-x),new yt(p,1-u)]}};function ag(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var so=class extends $n{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_l,this.normalScale=new yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Dr=class extends so{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new yt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ue(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Kt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Kt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Kt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function sr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function og(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var $i=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ro=class extends $i{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rc,endingEnd:rc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ac:r=t,a=2*e-n;break;case oc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case ac:o=t,c=2*n-e;break;case oc:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,g=this._weightNext,x=(n-e)/(s-e),y=x*x,p=y*x,u=-f*p+2*f*y-f*x,A=(1+f)*p+(-1.5-2*f)*y+(-.5+f)*x+1,_=(-1-g)*p+(1.5+g)*y+.5*x,b=g*p-g*y;for(let N=0;N!==a;++N)r[N]=u*o[h+N]+A*o[l+N]+_*o[c+N]+b*o[d+N];return r}},ao=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*d+o[c+f]*h;return r}},oo=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},xn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=sr(e,this.TimeBufferType),this.values=sr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:sr(t.times,Array),values:sr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new oo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ao(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ro(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case or:e=this.InterpolantFactoryMethodDiscrete;break;case cr:e=this.InterpolantFactoryMethodLinear;break;case jr:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return or;case this.InterpolantFactoryMethodLinear:return cr;case this.InterpolantFactoryMethodSmooth:return jr}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&og(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===jr,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let d=a*n,f=d-n,g=d+n;for(let x=0;x!==n;++x){let y=e[d+x];if(y!==e[f+x]||y!==e[g+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let g=0;g!==n;++g)e[f+g]=e[d+g]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=cr;var ui=class extends xn{};ui.prototype.ValueTypeName="bool";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=or;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var co=class extends xn{};co.prototype.ValueTypeName="color";var lo=class extends xn{};lo.prototype.ValueTypeName="number";var ho=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)Jn.slerpFlat(r,0,o,l-a,o,l,c);return r}},bs=class extends xn{InterpolantFactoryMethodLinear(t){return new ho(this.times,this.values,this.getValueSize(),t)}};bs.prototype.ValueTypeName="quaternion";bs.prototype.DefaultInterpolation=cr;bs.prototype.InterpolantFactoryMethodSmooth=void 0;var di=class extends xn{};di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=or;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var uo=class extends xn{};uo.prototype.ValueTypeName="vector";var el={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},fo=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){let g=l[d],x=l[d+1];if(g.global&&(g.lastIndex=0),g.test(h))return x}return null}}},cg=new fo,Ki=class{constructor(t){this.manager=t!==void 0?t:cg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Ki.DEFAULT_MATERIAL_NAME="__DEFAULT";var In={},po=class extends Error{constructor(t,e){super(t),this.response=e}},Nr=class extends Ki{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=el.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(In[t]!==void 0){In[t].push({onLoad:e,onProgress:n,onError:s});return}In[t]=[],In[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=In[t],d=l.body.getReader(),f=l.headers.get("Content-Length")||l.headers.get("X-File-Size"),g=f?parseInt(f):0,x=g!==0,y=0,p=new ReadableStream({start(u){A();function A(){d.read().then(({done:_,value:b})=>{if(_)u.close();else{y+=b.byteLength;let N=new ProgressEvent("progress",{lengthComputable:x,loaded:y,total:g});for(let I=0,C=h.length;I<C;I++){let j=h[I];j.onProgress&&j.onProgress(N)}u.enqueue(b),A()}})}}});return new Response(p)}else throw new po(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),f=d&&d[1]?d[1].toLowerCase():void 0,g=new TextDecoder(f);return l.arrayBuffer().then(x=>g.decode(x))}}}).then(l=>{el.add(t,l);let h=In[t];delete In[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onLoad&&g.onLoad(l)}}).catch(l=>{let h=In[t];if(h===void 0)throw this.manager.itemError(t),l;delete In[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onError&&g.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Es=class extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}};var Ea=new be,nl=new G,il=new G,Or=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new yt(512,512),this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ms,this._frameExtents=new yt(1,1),this._viewportCount=1,this._viewports=[new De(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;nl.setFromMatrixPosition(t.matrixWorld),e.position.copy(nl),il.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(il),e.updateMatrixWorld(),Ea.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ea),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ea)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},mo=class extends Or{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Wi*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},Fr=class extends Es{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new mo}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var go=class extends Or{constructor(){super(new wr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ws=class extends Es{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new go}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Br=class extends Es{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var zr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=sl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=sl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function sl(){return(typeof performance>"u"?Date:performance).now()}var wo="\\[\\]\\.:\\/",lg=new RegExp("["+wo+"]","g"),To="[^"+wo+"]",hg="[^"+wo.replace("\\.","")+"]",ug=/((?:WC+[\/:])*)/.source.replace("WC",To),dg=/(WCOD+)?/.source.replace("WCOD",hg),fg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",To),pg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",To),mg=new RegExp("^"+ug+dg+fg+pg+"$"),gg=["material","materials","bones","map"],_o=class{constructor(t,e,n){let s=n||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(lg,"")}static parseTrackName(t){let e=mg.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);gg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=_o;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var vg=new Float32Array(1);var rl=new yt,hn=class{constructor(t=new yt(1/0,1/0),e=new yt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=rl.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,rl).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}};var bn=class{constructor(){this.type="ShapePath",this.color=new Kt,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new ln,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,s){return this.currentPath.quadraticCurveTo(t,e,n,s),this}bezierCurveTo(t,e,n,s,r,o){return this.currentPath.bezierCurveTo(t,e,n,s,r,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(u){let A=[];for(let _=0,b=u.length;_<b;_++){let N=u[_],I=new tn;I.curves=N.curves,A.push(I)}return A}function n(u,A){let _=A.length,b=!1;for(let N=_-1,I=0;I<_;N=I++){let C=A[N],j=A[I],M=j.x-C.x,T=j.y-C.y;if(Math.abs(T)>Number.EPSILON){if(T<0&&(C=A[I],M=-M,j=A[N],T=-T),u.y<C.y||u.y>j.y)continue;if(u.y===C.y){if(u.x===C.x)return!0}else{let Y=T*(u.x-C.x)-M*(u.y-C.y);if(Y===0)return!0;if(Y<0)continue;b=!b}}else{if(u.y!==C.y)continue;if(j.x<=u.x&&u.x<=C.x||C.x<=u.x&&u.x<=j.x)return!0}}return b}let s=Be.isClockWise,r=this.subPaths;if(r.length===0)return[];let o,a,c,l=[];if(r.length===1)return a=r[0],c=new tn,c.curves=a.curves,l.push(c),l;let h=!s(r[0].getPoints());h=t?!h:h;let d=[],f=[],g=[],x=0,y;f[x]=void 0,g[x]=[];for(let u=0,A=r.length;u<A;u++)a=r[u],y=a.getPoints(),o=s(y),o=t?!o:o,o?(!h&&f[x]&&x++,f[x]={s:new tn,p:y},f[x].s.curves=a.curves,h&&x++,g[x]=[]):g[x].push({h:a,p:y[0]});if(!f[0])return e(r);if(f.length>1){let u=!1,A=0;for(let _=0,b=f.length;_<b;_++)d[_]=[];for(let _=0,b=f.length;_<b;_++){let N=g[_];for(let I=0;I<N.length;I++){let C=N[I],j=!0;for(let M=0;M<f.length;M++)n(C.p,f[M].p)&&(_!==M&&A++,j?(j=!1,d[M].push(C)):u=!0);j&&d[_].push(C)}}A>0&&u===!1&&(g=d)}let p;for(let u=0,A=f.length;u<A;u++){c=f[u].s,l.push(c),p=g[u];for(let _=0,b=p.length;_<b;_++)c.holes.push(p[_].h)}return l}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var xg=we,Wr=class i extends Ki{constructor(t){super(t),this.defaultDPI=90,this.defaultUnit="px"}load(t,e,n,s){let r=this,o=new Nr(r.manager);o.setPath(r.path),o.setRequestHeader(r.requestHeader),o.setWithCredentials(r.withCredentials),o.load(t,function(a){try{e(r.parse(a))}catch(c){s?s(c):console.error(c),r.manager.itemError(t)}},n,s)}parse(t){let e=this;function n(L,P){if(L.nodeType!==1)return;let w=b(L),S=!1,$=null;switch(L.nodeName){case"svg":P=x(L,P);break;case"style":r(L);break;case"g":P=x(L,P);break;case"path":P=x(L,P),L.hasAttribute("d")&&($=s(L));break;case"rect":P=x(L,P),$=c(L);break;case"polygon":P=x(L,P),$=l(L);break;case"polyline":P=x(L,P),$=h(L);break;case"circle":P=x(L,P),$=d(L);break;case"ellipse":P=x(L,P),$=f(L);break;case"line":P=x(L,P),$=g(L);break;case"defs":S=!0;break;case"use":P=x(L,P);let ft=(L.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),R=L.viewportElement.getElementById(ft);R?n(R,P):console.warn("SVGLoader: 'use node' references non-existent node id: "+ft);break;default:}$&&(P.fill!==void 0&&P.fill!=="none"&&$.color.setStyle(P.fill,xg),I($,_t),K.push($),$.userData={node:L,style:P});let ct=L.childNodes;for(let W=0;W<ct.length;W++){let ft=ct[W];S&&ft.nodeName!=="style"&&ft.nodeName!=="defs"||n(ft,P)}w&&(U.pop(),U.length>0?_t.copy(U[U.length-1]):_t.identity())}function s(L){let P=new bn,w=new yt,S=new yt,$=new yt,ct=!0,W=!1,ft=L.getAttribute("d");if(ft===""||ft==="none")return null;let R=ft.match(/[a-df-z][^a-df-z]*/ig);for(let et=0,O=R.length;et<O;et++){let X=R[et],H=X.charAt(0),mt=X.slice(1).trim();ct===!0&&(W=!0,ct=!1);let D;switch(H){case"M":D=p(mt);for(let m=0,v=D.length;m<v;m+=2)w.x=D[m+0],w.y=D[m+1],S.x=w.x,S.y=w.y,m===0?P.moveTo(w.x,w.y):P.lineTo(w.x,w.y),m===0&&$.copy(w);break;case"H":D=p(mt);for(let m=0,v=D.length;m<v;m++)w.x=D[m],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"V":D=p(mt);for(let m=0,v=D.length;m<v;m++)w.y=D[m],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"L":D=p(mt);for(let m=0,v=D.length;m<v;m+=2)w.x=D[m+0],w.y=D[m+1],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"C":D=p(mt);for(let m=0,v=D.length;m<v;m+=6)P.bezierCurveTo(D[m+0],D[m+1],D[m+2],D[m+3],D[m+4],D[m+5]),S.x=D[m+2],S.y=D[m+3],w.x=D[m+4],w.y=D[m+5],m===0&&W===!0&&$.copy(w);break;case"S":D=p(mt);for(let m=0,v=D.length;m<v;m+=4)P.bezierCurveTo(y(w.x,S.x),y(w.y,S.y),D[m+0],D[m+1],D[m+2],D[m+3]),S.x=D[m+0],S.y=D[m+1],w.x=D[m+2],w.y=D[m+3],m===0&&W===!0&&$.copy(w);break;case"Q":D=p(mt);for(let m=0,v=D.length;m<v;m+=4)P.quadraticCurveTo(D[m+0],D[m+1],D[m+2],D[m+3]),S.x=D[m+0],S.y=D[m+1],w.x=D[m+2],w.y=D[m+3],m===0&&W===!0&&$.copy(w);break;case"T":D=p(mt);for(let m=0,v=D.length;m<v;m+=2){let k=y(w.x,S.x),gt=y(w.y,S.y);P.quadraticCurveTo(k,gt,D[m+0],D[m+1]),S.x=k,S.y=gt,w.x=D[m+0],w.y=D[m+1],m===0&&W===!0&&$.copy(w)}break;case"A":D=p(mt,[3,4],7);for(let m=0,v=D.length;m<v;m+=7){if(D[m+5]==w.x&&D[m+6]==w.y)continue;let k=w.clone();w.x=D[m+5],w.y=D[m+6],S.x=w.x,S.y=w.y,o(P,D[m],D[m+1],D[m+2],D[m+3],D[m+4],k,w),m===0&&W===!0&&$.copy(w)}break;case"m":D=p(mt);for(let m=0,v=D.length;m<v;m+=2)w.x+=D[m+0],w.y+=D[m+1],S.x=w.x,S.y=w.y,m===0?P.moveTo(w.x,w.y):P.lineTo(w.x,w.y),m===0&&$.copy(w);break;case"h":D=p(mt);for(let m=0,v=D.length;m<v;m++)w.x+=D[m],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"v":D=p(mt);for(let m=0,v=D.length;m<v;m++)w.y+=D[m],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"l":D=p(mt);for(let m=0,v=D.length;m<v;m+=2)w.x+=D[m+0],w.y+=D[m+1],S.x=w.x,S.y=w.y,P.lineTo(w.x,w.y),m===0&&W===!0&&$.copy(w);break;case"c":D=p(mt);for(let m=0,v=D.length;m<v;m+=6)P.bezierCurveTo(w.x+D[m+0],w.y+D[m+1],w.x+D[m+2],w.y+D[m+3],w.x+D[m+4],w.y+D[m+5]),S.x=w.x+D[m+2],S.y=w.y+D[m+3],w.x+=D[m+4],w.y+=D[m+5],m===0&&W===!0&&$.copy(w);break;case"s":D=p(mt);for(let m=0,v=D.length;m<v;m+=4)P.bezierCurveTo(y(w.x,S.x),y(w.y,S.y),w.x+D[m+0],w.y+D[m+1],w.x+D[m+2],w.y+D[m+3]),S.x=w.x+D[m+0],S.y=w.y+D[m+1],w.x+=D[m+2],w.y+=D[m+3],m===0&&W===!0&&$.copy(w);break;case"q":D=p(mt);for(let m=0,v=D.length;m<v;m+=4)P.quadraticCurveTo(w.x+D[m+0],w.y+D[m+1],w.x+D[m+2],w.y+D[m+3]),S.x=w.x+D[m+0],S.y=w.y+D[m+1],w.x+=D[m+2],w.y+=D[m+3],m===0&&W===!0&&$.copy(w);break;case"t":D=p(mt);for(let m=0,v=D.length;m<v;m+=2){let k=y(w.x,S.x),gt=y(w.y,S.y);P.quadraticCurveTo(k,gt,w.x+D[m+0],w.y+D[m+1]),S.x=k,S.y=gt,w.x=w.x+D[m+0],w.y=w.y+D[m+1],m===0&&W===!0&&$.copy(w)}break;case"a":D=p(mt,[3,4],7);for(let m=0,v=D.length;m<v;m+=7){if(D[m+5]==0&&D[m+6]==0)continue;let k=w.clone();w.x+=D[m+5],w.y+=D[m+6],S.x=w.x,S.y=w.y,o(P,D[m],D[m+1],D[m+2],D[m+3],D[m+4],k,w),m===0&&W===!0&&$.copy(w)}break;case"Z":case"z":P.currentPath.autoClose=!0,P.currentPath.curves.length>0&&(w.copy($),P.currentPath.currentPoint.copy(w),ct=!0);break;default:console.warn(X)}W=!1}return P}function r(L){if(!(!L.sheet||!L.sheet.cssRules||!L.sheet.cssRules.length))for(let P=0;P<L.sheet.cssRules.length;P++){let w=L.sheet.cssRules[P];if(w.type!==1)continue;let S=w.selectorText.split(/,/gm).filter(Boolean).map($=>$.trim());for(let $=0;$<S.length;$++){let ct=Object.fromEntries(Object.entries(w.style).filter(([,W])=>W!==""));dt[S[$]]=Object.assign(dt[S[$]]||{},ct)}}}function o(L,P,w,S,$,ct,W,ft){if(P==0||w==0){L.lineTo(ft.x,ft.y);return}S=S*Math.PI/180,P=Math.abs(P),w=Math.abs(w);let R=(W.x-ft.x)/2,et=(W.y-ft.y)/2,O=Math.cos(S)*R+Math.sin(S)*et,X=-Math.sin(S)*R+Math.cos(S)*et,H=P*P,mt=w*w,D=O*O,m=X*X,v=D/H+m/mt;if(v>1){let pt=Math.sqrt(v);P=pt*P,w=pt*w,H=P*P,mt=w*w}let k=H*m+mt*D,gt=(H*mt-k)/k,xt=Math.sqrt(Math.max(0,gt));$===ct&&(xt=-xt);let ht=xt*P*X/w,Ut=-xt*w*O/P,St=Math.cos(S)*ht-Math.sin(S)*Ut+(W.x+ft.x)/2,Pt=Math.sin(S)*ht+Math.cos(S)*Ut+(W.y+ft.y)/2,Ot=a(1,0,(O-ht)/P,(X-Ut)/w),Xt=a((O-ht)/P,(X-Ut)/w,(-O-ht)/P,(-X-Ut)/w)%(Math.PI*2);L.currentPath.absellipse(St,Pt,P,w,Ot,Ot+Xt,ct===0,S)}function a(L,P,w,S){let $=L*w+P*S,ct=Math.sqrt(L*L+P*P)*Math.sqrt(w*w+S*S),W=Math.acos(Math.max(-1,Math.min(1,$/ct)));return L*S-P*w<0&&(W=-W),W}function c(L){let P=_(L.getAttribute("x")||0),w=_(L.getAttribute("y")||0),S=_(L.getAttribute("rx")||L.getAttribute("ry")||0),$=_(L.getAttribute("ry")||L.getAttribute("rx")||0),ct=_(L.getAttribute("width")),W=_(L.getAttribute("height")),ft=1-.551915024494,R=new bn;return R.moveTo(P+S,w),R.lineTo(P+ct-S,w),(S!==0||$!==0)&&R.bezierCurveTo(P+ct-S*ft,w,P+ct,w+$*ft,P+ct,w+$),R.lineTo(P+ct,w+W-$),(S!==0||$!==0)&&R.bezierCurveTo(P+ct,w+W-$*ft,P+ct-S*ft,w+W,P+ct-S,w+W),R.lineTo(P+S,w+W),(S!==0||$!==0)&&R.bezierCurveTo(P+S*ft,w+W,P,w+W-$*ft,P,w+W-$),R.lineTo(P,w+$),(S!==0||$!==0)&&R.bezierCurveTo(P,w+$*ft,P+S*ft,w,P+S,w),R}function l(L){function P(ct,W,ft){let R=_(W),et=_(ft);$===0?S.moveTo(R,et):S.lineTo(R,et),$++}let w=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,S=new bn,$=0;return L.getAttribute("points").replace(w,P),S.currentPath.autoClose=!0,S}function h(L){function P(ct,W,ft){let R=_(W),et=_(ft);$===0?S.moveTo(R,et):S.lineTo(R,et),$++}let w=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,S=new bn,$=0;return L.getAttribute("points").replace(w,P),S.currentPath.autoClose=!1,S}function d(L){let P=_(L.getAttribute("cx")||0),w=_(L.getAttribute("cy")||0),S=_(L.getAttribute("r")||0),$=new ln;$.absarc(P,w,S,0,Math.PI*2);let ct=new bn;return ct.subPaths.push($),ct}function f(L){let P=_(L.getAttribute("cx")||0),w=_(L.getAttribute("cy")||0),S=_(L.getAttribute("rx")||0),$=_(L.getAttribute("ry")||0),ct=new ln;ct.absellipse(P,w,S,$,0,Math.PI*2);let W=new bn;return W.subPaths.push(ct),W}function g(L){let P=_(L.getAttribute("x1")||0),w=_(L.getAttribute("y1")||0),S=_(L.getAttribute("x2")||0),$=_(L.getAttribute("y2")||0),ct=new bn;return ct.moveTo(P,w),ct.lineTo(S,$),ct.currentPath.autoClose=!1,ct}function x(L,P){P=Object.assign({},P);let w={};if(L.hasAttribute("class")){let W=L.getAttribute("class").split(/\s/).filter(Boolean).map(ft=>ft.trim());for(let ft=0;ft<W.length;ft++)w=Object.assign(w,dt["."+W[ft]])}L.hasAttribute("id")&&(w=Object.assign(w,dt["#"+L.getAttribute("id")]));function S(W,ft,R){R===void 0&&(R=function(O){return O.startsWith("url")&&console.warn("SVGLoader: url access in attributes is not implemented."),O}),L.hasAttribute(W)&&(P[ft]=R(L.getAttribute(W))),w[W]&&(P[ft]=R(w[W])),L.style&&L.style[W]!==""&&(P[ft]=R(L.style[W]))}function $(W){return Math.max(0,Math.min(1,_(W)))}function ct(W){return Math.max(0,_(W))}return S("fill","fill"),S("fill-opacity","fillOpacity",$),S("fill-rule","fillRule"),S("opacity","opacity",$),S("stroke","stroke"),S("stroke-opacity","strokeOpacity",$),S("stroke-width","strokeWidth",ct),S("stroke-linejoin","strokeLineJoin"),S("stroke-linecap","strokeLineCap"),S("stroke-miterlimit","strokeMiterLimit",ct),S("visibility","visibility"),P}function y(L,P){return L-(P-L)}function p(L,P,w){if(typeof L!="string")throw new TypeError("Invalid input: "+typeof L);let S={SEPARATOR:/[ \t\r\n\,.\-+]/,WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},$=0,ct=1,W=2,ft=3,R=$,et=!0,O="",X="",H=[];function mt(k,gt,xt){let ht=new SyntaxError('Unexpected character "'+k+'" at index '+gt+".");throw ht.partial=xt,ht}function D(){O!==""&&(X===""?H.push(Number(O)):H.push(Number(O)*Math.pow(10,Number(X)))),O="",X=""}let m,v=L.length;for(let k=0;k<v;k++){if(m=L[k],Array.isArray(P)&&P.includes(H.length%w)&&S.FLAGS.test(m)){R=ct,O=m,D();continue}if(R===$){if(S.WHITESPACE.test(m))continue;if(S.DIGIT.test(m)||S.SIGN.test(m)){R=ct,O=m;continue}if(S.POINT.test(m)){R=W,O=m;continue}S.COMMA.test(m)&&(et&&mt(m,k,H),et=!0)}if(R===ct){if(S.DIGIT.test(m)){O+=m;continue}if(S.POINT.test(m)){O+=m,R=W;continue}if(S.EXP.test(m)){R=ft;continue}S.SIGN.test(m)&&O.length===1&&S.SIGN.test(O[0])&&mt(m,k,H)}if(R===W){if(S.DIGIT.test(m)){O+=m;continue}if(S.EXP.test(m)){R=ft;continue}S.POINT.test(m)&&O[O.length-1]==="."&&mt(m,k,H)}if(R===ft){if(S.DIGIT.test(m)){X+=m;continue}if(S.SIGN.test(m)){if(X===""){X+=m;continue}X.length===1&&S.SIGN.test(X)&&mt(m,k,H)}}S.WHITESPACE.test(m)?(D(),R=$,et=!1):S.COMMA.test(m)?(D(),R=$,et=!0):S.SIGN.test(m)?(D(),R=ct,O=m):S.POINT.test(m)?(D(),R=W,O=m):mt(m,k,H)}return D(),H}let u=["mm","cm","in","pt","pc","px"],A={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function _(L){let P="px";if(typeof L=="string"||L instanceof String)for(let S=0,$=u.length;S<$;S++){let ct=u[S];if(L.endsWith(ct)){P=ct,L=L.substring(0,L.length-ct.length);break}}let w;return P==="px"&&e.defaultUnit!=="px"?w=A.in[e.defaultUnit]/e.defaultDPI:(w=A[P][e.defaultUnit],w<0&&(w=A[P].in*e.defaultDPI)),w*parseFloat(L)}function b(L){if(!(L.hasAttribute("transform")||L.nodeName==="use"&&(L.hasAttribute("x")||L.hasAttribute("y"))))return null;let P=N(L);return U.length>0&&P.premultiply(U[U.length-1]),_t.copy(P),U.push(P),P}function N(L){let P=new $t,w=q;if(L.nodeName==="use"&&(L.hasAttribute("x")||L.hasAttribute("y"))){let S=_(L.getAttribute("x")),$=_(L.getAttribute("y"));P.translate(S,$)}if(L.hasAttribute("transform")){let S=L.getAttribute("transform").split(")");for(let $=S.length-1;$>=0;$--){let ct=S[$].trim();if(ct==="")continue;let W=ct.indexOf("("),ft=ct.length;if(W>0&&W<ft){let R=ct.slice(0,W),et=p(ct.slice(W+1));switch(w.identity(),R){case"translate":if(et.length>=1){let O=et[0],X=0;et.length>=2&&(X=et[1]),w.translate(O,X)}break;case"rotate":if(et.length>=1){let O=0,X=0,H=0;O=et[0]*Math.PI/180,et.length>=3&&(X=et[1],H=et[2]),tt.makeTranslation(-X,-H),Q.makeRotation(O),z.multiplyMatrices(Q,tt),tt.makeTranslation(X,H),w.multiplyMatrices(tt,z)}break;case"scale":if(et.length>=1){let O=et[0],X=O;et.length>=2&&(X=et[1]),w.scale(O,X)}break;case"skewX":et.length===1&&w.set(1,Math.tan(et[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":et.length===1&&w.set(1,0,0,Math.tan(et[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":et.length===6&&w.set(et[0],et[2],et[4],et[1],et[3],et[5],0,0,1);break}}P.premultiply(w)}}return P}function I(L,P){function w(W){ut.set(W.x,W.y,1).applyMatrix3(P),W.set(ut.x,ut.y)}function S(W){let ft=W.xRadius,R=W.yRadius,et=Math.cos(W.aRotation),O=Math.sin(W.aRotation),X=new G(ft*et,ft*O,0),H=new G(-R*O,R*et,0),mt=X.applyMatrix3(P),D=H.applyMatrix3(P),m=q.set(mt.x,D.x,0,mt.y,D.y,0,0,0,1),v=tt.copy(m).invert(),xt=Q.copy(v).transpose().multiply(v).elements,ht=Y(xt[0],xt[1],xt[4]),Ut=Math.sqrt(ht.rt1),St=Math.sqrt(ht.rt2);if(W.xRadius=1/Ut,W.yRadius=1/St,W.aRotation=Math.atan2(ht.sn,ht.cs),!((W.aEndAngle-W.aStartAngle)%(2*Math.PI)<Number.EPSILON)){let Ot=tt.set(Ut,0,0,0,St,0,0,0,1),Xt=Q.set(ht.cs,ht.sn,0,-ht.sn,ht.cs,0,0,0,1),pt=Ot.multiply(Xt).multiply(m),Ft=Wt=>{let{x:kt,y:zt}=new G(Math.cos(Wt),Math.sin(Wt),0).applyMatrix3(pt);return Math.atan2(zt,kt)};W.aStartAngle=Ft(W.aStartAngle),W.aEndAngle=Ft(W.aEndAngle),C(P)&&(W.aClockwise=!W.aClockwise)}}function $(W){let ft=M(P),R=T(P);W.xRadius*=ft,W.yRadius*=R;let et=ft>Number.EPSILON?Math.atan2(P.elements[1],P.elements[0]):Math.atan2(-P.elements[3],P.elements[4]);W.aRotation+=et,C(P)&&(W.aStartAngle*=-1,W.aEndAngle*=-1,W.aClockwise=!W.aClockwise)}let ct=L.subPaths;for(let W=0,ft=ct.length;W<ft;W++){let et=ct[W].curves;for(let O=0;O<et.length;O++){let X=et[O];X.isLineCurve?(w(X.v1),w(X.v2)):X.isCubicBezierCurve?(w(X.v0),w(X.v1),w(X.v2),w(X.v3)):X.isQuadraticBezierCurve?(w(X.v0),w(X.v1),w(X.v2)):X.isEllipseCurve&&(rt.set(X.aX,X.aY),w(rt),X.aX=rt.x,X.aY=rt.y,j(P)?S(X):$(X))}}}function C(L){let P=L.elements;return P[0]*P[4]-P[1]*P[3]<0}function j(L){let P=L.elements,w=P[0]*P[3]+P[1]*P[4];if(w===0)return!1;let S=M(L),$=T(L);return Math.abs(w/(S*$))>Number.EPSILON}function M(L){let P=L.elements;return Math.sqrt(P[0]*P[0]+P[1]*P[1])}function T(L){let P=L.elements;return Math.sqrt(P[3]*P[3]+P[4]*P[4])}function Y(L,P,w){let S,$,ct,W,ft,R=L+w,et=L-w,O=Math.sqrt(et*et+4*P*P);return R>0?(S=.5*(R+O),ft=1/S,$=L*ft*w-P*ft*P):R<0?$=.5*(R-O):(S=.5*O,$=-.5*O),et>0?ct=et+O:ct=et-O,Math.abs(ct)>2*Math.abs(P)?(ft=-2*P/ct,W=1/Math.sqrt(1+ft*ft),ct=ft*W):Math.abs(P)===0?(ct=1,W=0):(ft=-.5*ct/P,ct=1/Math.sqrt(1+ft*ft),W=ft*ct),et>0&&(ft=ct,ct=-W,W=ft),{rt1:S,rt2:$,cs:ct,sn:W}}let K=[],dt={},U=[],q=new $t,tt=new $t,Q=new $t,z=new $t,rt=new yt,ut=new G,_t=new $t,Mt=new DOMParser().parseFromString(t,"image/svg+xml");return n(Mt.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:K,xml:Mt.documentElement}}static createShapes(t){let n={ORIGIN:0,DESTINATION:1,BETWEEN:2,LEFT:3,RIGHT:4,BEHIND:5,BEYOND:6},s={loc:n.ORIGIN,t:0};function r(y,p,u,A){let _=y.x,b=p.x,N=u.x,I=A.x,C=y.y,j=p.y,M=u.y,T=A.y,Y=(I-N)*(C-M)-(T-M)*(_-N),K=(b-_)*(C-M)-(j-C)*(_-N),dt=(T-M)*(b-_)-(I-N)*(j-C),U=Y/dt,q=K/dt;if(dt===0&&Y!==0||U<=0||U>=1||q<0||q>1)return null;if(Y===0&&dt===0){for(let tt=0;tt<2;tt++)if(o(tt===0?u:A,y,p),s.loc==n.ORIGIN){let Q=tt===0?u:A;return{x:Q.x,y:Q.y,t:s.t}}else if(s.loc==n.BETWEEN){let Q=+(_+s.t*(b-_)).toPrecision(10),z=+(C+s.t*(j-C)).toPrecision(10);return{x:Q,y:z,t:s.t}}return null}else{for(let z=0;z<2;z++)if(o(z===0?u:A,y,p),s.loc==n.ORIGIN){let rt=z===0?u:A;return{x:rt.x,y:rt.y,t:s.t}}let tt=+(_+U*(b-_)).toPrecision(10),Q=+(C+U*(j-C)).toPrecision(10);return{x:tt,y:Q,t:U}}}function o(y,p,u){let A=u.x-p.x,_=u.y-p.y,b=y.x-p.x,N=y.y-p.y,I=A*N-b*_;if(y.x===p.x&&y.y===p.y){s.loc=n.ORIGIN,s.t=0;return}if(y.x===u.x&&y.y===u.y){s.loc=n.DESTINATION,s.t=1;return}if(I<-Number.EPSILON){s.loc=n.LEFT;return}if(I>Number.EPSILON){s.loc=n.RIGHT;return}if(A*b<0||_*N<0){s.loc=n.BEHIND;return}if(Math.sqrt(A*A+_*_)<Math.sqrt(b*b+N*N)){s.loc=n.BEYOND;return}let C;A!==0?C=b/A:C=N/_,s.loc=n.BETWEEN,s.t=C}function a(y,p){let u=[],A=[];for(let _=1;_<y.length;_++){let b=y[_-1],N=y[_];for(let I=1;I<p.length;I++){let C=p[I-1],j=p[I],M=r(b,N,C,j);M!==null&&u.find(T=>T.t<=M.t+Number.EPSILON&&T.t>=M.t-Number.EPSILON)===void 0&&(u.push(M),A.push(new yt(M.x,M.y)))}}return A}function c(y,p,u){let A=new yt;p.getCenter(A);let _=[];return u.forEach(b=>{b.boundingBox.containsPoint(A)&&a(y,b.points).forEach(I=>{_.push({identifier:b.identifier,isCW:b.isCW,point:I})})}),_.sort((b,N)=>b.point.x-N.point.x),_}function l(y,p,u,A,_){(_==null||_==="")&&(_="nonzero");let b=new yt;y.boundingBox.getCenter(b);let N=[new yt(u,b.y),new yt(A,b.y)],I=c(N,y.boundingBox,p);I.sort((K,dt)=>K.point.x-dt.point.x);let C=[],j=[];I.forEach(K=>{K.identifier===y.identifier?C.push(K):j.push(K)});let M=C[0].point.x,T=[],Y=0;for(;Y<j.length&&j[Y].point.x<M;)T.length>0&&T[T.length-1]===j[Y].identifier?T.pop():T.push(j[Y].identifier),Y++;if(T.push(y.identifier),_==="evenodd"){let K=T.length%2===0,dt=T[T.length-2];return{identifier:y.identifier,isHole:K,for:dt}}else if(_==="nonzero"){let K=!0,dt=null,U=null;for(let q=0;q<T.length;q++){let tt=T[q];K?(U=p[tt].isCW,K=!1,dt=tt):U!==p[tt].isCW&&(U=p[tt].isCW,K=!0)}return{identifier:y.identifier,isHole:K,for:dt}}else console.warn('fill-rule: "'+_+'" is currently not implemented.')}let h=999999999,d=-999999999,f=t.subPaths.map(y=>{let p=y.getPoints(),u=-999999999,A=999999999,_=-999999999,b=999999999;for(let N=0;N<p.length;N++){let I=p[N];I.y>u&&(u=I.y),I.y<A&&(A=I.y),I.x>_&&(_=I.x),I.x<b&&(b=I.x)}return d<=_&&(d=_+1),h>=b&&(h=b-1),{curves:y.curves,points:p,isCW:Be.isClockWise(p),identifier:-1,boundingBox:new hn(new yt(b,A),new yt(_,u))}});f=f.filter(y=>y.points.length>1);for(let y=0;y<f.length;y++)f[y].identifier=y;let g=f.map(y=>l(y,f,h,d,t.userData?t.userData.style.fillRule:void 0)),x=[];return f.forEach(y=>{if(!g[y.identifier].isHole){let u=new tn;u.curves=y.curves,g.filter(_=>_.isHole&&_.for===y.identifier).forEach(_=>{let b=f[_.identifier],N=new ln;N.curves=b.curves,u.holes.push(N)}),x.push(u)}}),x}static getStrokeStyle(t,e,n,s,r){return t=t!==void 0?t:1,e=e!==void 0?e:"#000",n=n!==void 0?n:"miter",s=s!==void 0?s:"butt",r=r!==void 0?r:4,{strokeColor:e,strokeWidth:t,strokeLineJoin:n,strokeLineCap:s,strokeMiterLimit:r}}static pointsToStroke(t,e,n,s){let r=[],o=[],a=[];if(i.pointsToStrokeWithBuffers(t,e,n,s,r,o,a)===0)return null;let c=new en;return c.setAttribute("position",new Ze(r,3)),c.setAttribute("normal",new Ze(o,3)),c.setAttribute("uv",new Ze(a,2)),c}static pointsToStrokeWithBuffers(t,e,n,s,r,o,a,c){let l=new yt,h=new yt,d=new yt,f=new yt,g=new yt,x=new yt,y=new yt,p=new yt,u=new yt,A=new yt,_=new yt,b=new yt,N=new yt,I=new yt,C=new yt,j=new yt,M=new yt;n=n!==void 0?n:12,s=s!==void 0?s:.001,c=c!==void 0?c:0,t=et(t);let T=t.length;if(T<2)return 0;let Y=t[0].equals(t[T-1]),K,dt=t[0],U,q=e.strokeWidth/2,tt=1/(T-1),Q=0,z,rt,ut,_t,Mt=!1,it=0,L=c*3,P=c*2;w(t[0],t[1],l).multiplyScalar(q),p.copy(t[0]).sub(l),u.copy(t[0]).add(l),A.copy(p),_.copy(u);for(let O=1;O<T;O++){K=t[O],O===T-1?Y?U=t[1]:U=void 0:U=t[O+1];let X=l;if(w(dt,K,X),d.copy(X).multiplyScalar(q),b.copy(K).sub(d),N.copy(K).add(d),z=Q+tt,rt=!1,U!==void 0){w(K,U,h),d.copy(h).multiplyScalar(q),I.copy(K).sub(d),C.copy(K).add(d),ut=!0,d.subVectors(U,dt),X.dot(d)<0&&(ut=!1),O===1&&(Mt=ut),d.subVectors(U,K),d.normalize();let H=Math.abs(X.dot(d));if(H>Number.EPSILON){let mt=q/H;d.multiplyScalar(-mt),f.subVectors(K,dt),g.copy(f).setLength(mt).add(d),j.copy(g).negate();let D=g.length(),m=f.length();f.divideScalar(m),x.subVectors(U,K);let v=x.length();switch(x.divideScalar(v),f.dot(j)<m&&x.dot(j)<v&&(rt=!0),M.copy(g).add(K),j.add(K),_t=!1,rt?ut?(C.copy(j),N.copy(j)):(I.copy(j),b.copy(j)):ct(),e.strokeLineJoin){case"bevel":W(ut,rt,z);break;case"round":ft(ut,rt),ut?$(K,b,I,z,0):$(K,C,N,z,1);break;case"miter":case"miter-clip":default:let k=q*e.strokeMiterLimit/D;if(k<1)if(e.strokeLineJoin!=="miter-clip"){W(ut,rt,z);break}else ft(ut,rt),ut?(x.subVectors(M,b).multiplyScalar(k).add(b),y.subVectors(M,I).multiplyScalar(k).add(I),S(b,z,0),S(x,z,0),S(K,z,.5),S(K,z,.5),S(x,z,0),S(y,z,0),S(K,z,.5),S(y,z,0),S(I,z,0)):(x.subVectors(M,N).multiplyScalar(k).add(N),y.subVectors(M,C).multiplyScalar(k).add(C),S(N,z,1),S(x,z,1),S(K,z,.5),S(K,z,.5),S(x,z,1),S(y,z,1),S(K,z,.5),S(y,z,1),S(C,z,1));else rt?(ut?(S(u,Q,1),S(p,Q,0),S(M,z,0),S(u,Q,1),S(M,z,0),S(j,z,1)):(S(u,Q,1),S(p,Q,0),S(M,z,1),S(p,Q,0),S(j,z,0),S(M,z,1)),ut?I.copy(M):C.copy(M)):ut?(S(b,z,0),S(M,z,0),S(K,z,.5),S(K,z,.5),S(M,z,0),S(I,z,0)):(S(N,z,1),S(M,z,1),S(K,z,.5),S(K,z,.5),S(M,z,1),S(C,z,1)),_t=!0;break}}else ct()}else ct();!Y&&O===T-1&&R(t[0],A,_,ut,!0,Q),Q=z,dt=K,p.copy(I),u.copy(C)}if(!Y)R(K,b,N,ut,!1,z);else if(rt&&r){let O=M,X=j;Mt!==ut&&(O=j,X=M),ut?(_t||Mt)&&(X.toArray(r,0),X.toArray(r,9),_t&&O.toArray(r,3)):(_t||!Mt)&&(X.toArray(r,3),X.toArray(r,9),_t&&O.toArray(r,0))}return it;function w(O,X,H){return H.subVectors(X,O),H.set(-H.y,H.x).normalize()}function S(O,X,H){r&&(r[L]=O.x,r[L+1]=O.y,r[L+2]=0,o&&(o[L]=0,o[L+1]=0,o[L+2]=1),L+=3,a&&(a[P]=X,a[P+1]=H,P+=2)),it+=3}function $(O,X,H,mt,D){l.copy(X).sub(O).normalize(),h.copy(H).sub(O).normalize();let m=Math.PI,v=l.dot(h);Math.abs(v)<1&&(m=Math.abs(Math.acos(v))),m/=n,d.copy(X);for(let k=0,gt=n-1;k<gt;k++)f.copy(d).rotateAround(O,m),S(d,mt,D),S(f,mt,D),S(O,mt,.5),d.copy(f);S(f,mt,D),S(H,mt,D),S(O,mt,.5)}function ct(){S(u,Q,1),S(p,Q,0),S(b,z,0),S(u,Q,1),S(b,z,1),S(N,z,0)}function W(O,X,H){X?O?(S(u,Q,1),S(p,Q,0),S(b,z,0),S(u,Q,1),S(b,z,0),S(j,z,1),S(b,H,0),S(I,H,0),S(j,H,.5)):(S(u,Q,1),S(p,Q,0),S(N,z,1),S(p,Q,0),S(j,z,0),S(N,z,1),S(N,H,1),S(j,H,0),S(C,H,1)):O?(S(b,H,0),S(I,H,0),S(K,H,.5)):(S(N,H,1),S(C,H,0),S(K,H,.5))}function ft(O,X){X&&(O?(S(u,Q,1),S(p,Q,0),S(b,z,0),S(u,Q,1),S(b,z,0),S(j,z,1),S(b,Q,0),S(K,z,.5),S(j,z,1),S(K,z,.5),S(I,Q,0),S(j,z,1)):(S(u,Q,1),S(p,Q,0),S(N,z,1),S(p,Q,0),S(j,z,0),S(N,z,1),S(N,Q,1),S(j,z,0),S(K,z,.5),S(K,z,.5),S(j,z,0),S(C,Q,1)))}function R(O,X,H,mt,D,m){switch(e.strokeLineCap){case"round":D?$(O,H,X,m,.5):$(O,X,H,m,.5);break;case"square":if(D)l.subVectors(X,O),h.set(l.y,-l.x),d.addVectors(l,h).add(O),f.subVectors(h,l).add(O),mt?(d.toArray(r,3),f.toArray(r,0),f.toArray(r,9)):(d.toArray(r,3),d.toArray(r,9),f.toArray(r,0));else{l.subVectors(H,O),h.set(l.y,-l.x),d.addVectors(l,h).add(O),f.subVectors(h,l).add(O);let v=r.length;mt?(d.toArray(r,v-3),f.toArray(r,v-6),f.toArray(r,v-12)):(f.toArray(r,v-6),d.toArray(r,v-3),f.toArray(r,v-12))}break;case"butt":default:break}}function et(O){let X=!1;for(let mt=1,D=O.length-1;mt<D;mt++)if(O[mt].distanceTo(O[mt+1])<s){X=!0;break}if(!X)return O;let H=[];H.push(O[0]);for(let mt=1,D=O.length-1;mt<D;mt++)O[mt].distanceTo(O[mt+1])>=s&&H.push(O[mt]);return H.push(O[O.length-1]),H}}};function yg({root:i,canvas:t,shape:e,palette:n,contactCard:s=null,fragments:r=4,onReady:o,autoplay:a=0,lateral:c=null,lift:l=0,scale:h=1,fit:d="window"}){let f=()=>d==="canvas"?{width:Math.max(1,t.clientWidth),height:Math.max(1,t.clientHeight)}:{width:window.innerWidth,height:window.innerHeight},g=performance.now(),x={shapes:[e],palette:n,fragments:r},y=!0,p=e,u=e,A=!1,_=[],b=(B,J,V,ot)=>{B.addEventListener(J,V,ot),_.push([B,J,V,ot])},N=3.1,I=.44,C={size:.042,thickness:.052},j=y?N:2.9,M=y?I:.5,T=y?C:{size:.028,thickness:.038},Y=.006,K,dt,U,q,tt=[],Q,z,rt=[],ut=[],_t=new zr,Mt=0,it=0,L=0,P=i.querySelector(".scroll-stage"),w=i.querySelector("[data-glass-after]"),S=s,$,ct,W=6,ft=16,R=30,et=.08,O=.06,X=0,H=0,mt=0,D=0,m=window.innerWidth/2,v=window.innerHeight/2,k=window.innerWidth/2,gt=window.innerHeight/2,xt,ht,St={...Object.fromEntries(x.palette.map((B,J)=>[`uC${J}`,{value:new Kt(B)}])),uTime:{value:0},uResolution:{value:new yt(window.innerWidth,window.innerHeight)},uMouse:{value:new yt(0,0)},uScroll:{value:0},uVelocity:{value:0}},Pt,Ot=450,Xt=[],pt=f(),Ft=(B=0,J=0)=>new yt(B,J),Wt=(B,J)=>B.x*J.y-B.y*J.x,kt=yn.lerp;function zt(){let B=document.createElement("canvas");B.width=16,B.height=16;let J=B.getContext("2d"),V=J.createRadialGradient(8,8,0,8,8,8);return V.addColorStop(0,"rgba(255, 255, 255, 1)"),V.addColorStop(.25,"rgba(255, 255, 255, 0.85)"),V.addColorStop(.6,"rgba(255, 255, 255, 0.3)"),V.addColorStop(1,"rgba(0, 0, 0, 0)"),J.fillStyle=V,J.fillRect(0,0,16,16),new Cr(B)}function Dt(){let B=new en,J=new Float32Array(Ot*3),V=new Float32Array(Ot*3);for(let lt=0;lt<Ot;lt++){let bt=(Math.random()-.5)*6.5,Ct=(Math.random()-.5)*5-.5,It=(Math.random()-.5)*6.5;J[lt*3]=bt,J[lt*3+1]=Ct,J[lt*3+2]=It,Math.random()<.6?(V[lt*3]=.82+Math.random()*.18,V[lt*3+1]=.9+Math.random()*.1,V[lt*3+2]=1):(V[lt*3]=.78+Math.random()*.12,V[lt*3+1]=.5+Math.random()*.15,V[lt*3+2]=1),Xt.push({speedX:(Math.random()-.5)*.4,speedY:.15+Math.random()*.3,speedZ:(Math.random()-.5)*.4,swaySpeed:.5+Math.random()*1.5,swayRadius:.05+Math.random()*.15,phase:Math.random()*Math.PI*2})}B.setAttribute("position",new Ye(J,3)),B.setAttribute("color",new Ye(V,3));let ot=new xs({size:.025,vertexColors:!0,transparent:!0,opacity:.4,blending:rr,depthWrite:!1,map:zt()});Pt=new Rr(B,ot),K.add(Pt)}function Qt(){let B=new _s;B.background=new Kt("#080b10");let J=[[2.8,8,-4,2,3,"#ffffff",2.6],[.65,7,3,1,2,"#dceeff",4],[5,.7,0,5,-1,"#ffffff",3.5],[.5,6,-2,0,-4,"#a78bfa",3],[1,5,3,-1,-3,"#ffc2e0",2.4],[4,.35,0,-3,3,"#92bbff",3],[.16,5,-3,0,2,"#ffffff",5],[.35,4,4,0,-2,"#ffb36b",2]];for(let[lt,bt,Ct,It,vt,wt,Yt]of J){let ie=new Fe(new Zi(lt,bt),new qi({color:new Kt(wt).multiplyScalar(Yt),side:rn}));ie.position.set(Ct,It,vt),ie.lookAt(0,0,0),B.add(ie)}let V=new Ji(U),ot=V.fromScene(B,.025,.1,100);K.environment=ot.texture,B.traverse(lt=>{lt.isMesh&&(lt.geometry.dispose(),lt.material.dispose())}),V.dispose()}function re(){let B=new Dr({color:"#fafcff",metalness:0,roughness:.025,transmission:1,thickness:.48,ior:1.46,attenuationColor:new Kt("#edf7ff"),attenuationDistance:8,clearcoat:.65,clearcoatRoughness:.018,iridescence:.6,iridescenceIOR:1.3,iridescenceThicknessRange:[100,420],envMapIntensity:1.1,side:rn});return B.onBeforeCompile=J=>{J.uniforms.uChromaticSpread={value:.018},J.fragmentShader=`uniform float uChromaticSpread;
`+J.fragmentShader;let V=te.transmission_fragment.replace(/vec4 transmitted = getIBLVolumeRefraction\([\s\S]*?\);/,`// Keep the front faces clear, with spectral accents on grazing edges.
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
                (transmittedRed.a + transmitted.a + transmittedBlue.a) / 3.0);`);J.fragmentShader=J.fragmentShader.replace("#include <transmission_fragment>",V)},B.customProgramCacheKey=()=>"apple-clear-glass-edge-dispersion-v1",B}function he(B,J=1e-4){let V=[];for(let lt of B)(!V.length||V[V.length-1].distanceTo(lt)>J)&&V.push(lt.clone());for(;V.length>1&&V[0].distanceTo(V[V.length-1])<=J;)V.pop();let ot=V.filter((lt,bt)=>{let Ct=V[(bt-1+V.length)%V.length],It=V[(bt+1)%V.length];return Math.abs(Wt(lt.clone().sub(Ct),It.clone().sub(lt)))>1e-7});return Be.isClockWise(ot)&&ot.reverse(),ot}function ee(B,J){let V=B.map(ot=>ot.clone());for(let{origin:ot,normal:lt}of J){let bt=[];for(let Ct=0;Ct<V.length;Ct++){let It=V[Ct],vt=V[(Ct+1)%V.length],wt=It.clone().sub(ot).dot(lt),Yt=vt.clone().sub(ot).dot(lt);wt>=0&&bt.push(It),wt>=0!=Yt>=0&&bt.push(It.clone().lerp(vt,wt/(wt-Yt)))}if(V=bt,!V.length)break}return he(V)}function Et(B,J,V){let ot=Ct=>Ft(Math.cos(yn.degToRad(Ct)),Math.sin(yn.degToRad(Ct))),lt=ot(J),bt=ot(V);return[{origin:B,normal:Ft(-lt.y,lt.x)},{origin:B,normal:Ft(bt.y,-bt.x)}]}function F(B){let J=new hn().setFromPoints(B).getCenter(Ft());return{contour:B.map(V=>V.clone().sub(J)),home:new G(J.x,J.y,0)}}function Rt(B,J,V){let ot=new tn(rt);if(V>.02)for(let bt of ut){let Ct=new hn().setFromPoints(bt).getCenter(Ft());ot.holes.push(new ln(bt.map(It=>It.clone().sub(Ct).multiplyScalar(V).add(Ct))))}let lt=new hi(ot,{depth:M,steps:1,bevelEnabled:!0,bevelSize:B,bevelThickness:J,bevelSegments:6,curveSegments:24});return lt.translate(0,0,-M/2),lt}function At(B,J,V,ot){let lt=new hi(new tn(B),{depth:J,steps:1,bevelEnabled:!0,bevelSize:V,bevelThickness:ot,bevelSegments:6,curveSegments:24});return lt.translate(0,0,-J/2),lt}function qt(B,J){let V=vt=>{let wt=vt.filter((se,Nt)=>Nt===0||se.distanceToSquared(vt[Nt-1])>1e-12);wt[0].distanceToSquared(wt[wt.length-1])<1e-12&&wt.pop(),Be.isClockWise(wt)&&wt.reverse();let Yt=[Ft(-10,-10),Ft(10,-10),Ft(10,10),Ft(-10,10)];for(let se=0;se<wt.length;se++){let Nt=wt[se],Me=wt[(se+1)%wt.length].clone().sub(Nt),Pe=[];for(let ve=0;ve<Yt.length;ve++){let Ie=Yt[ve],Oe=Yt[(ve+1)%Yt.length],_e=Wt(Me,Ie.clone().sub(Nt)),Je=Wt(Me,Oe.clone().sub(Nt));_e>=-1e-10&&Pe.push(Ie),_e>=0!=Je>=0&&Pe.push(Ie.clone().lerp(Oe,_e/(_e-Je)))}Yt=Pe}if(!Yt.length)throw new Error("Contour has no visibility kernel.");let ie=Yt.reduce((se,Nt)=>se.add(Nt),Ft()).multiplyScalar(1/Yt.length);return{contour:wt,center:ie}},ot=V(B),lt=V(J),bt=(vt,wt)=>(Math.atan2(vt.y-wt.y,vt.x-wt.x)+Math.PI*2)%(Math.PI*2),Ct=[...ot.contour.map(vt=>bt(vt,ot.center)),...lt.contour.map(vt=>bt(vt,lt.center)),...Array.from({length:32},(vt,wt)=>wt/32*Math.PI*2)].sort((vt,wt)=>vt-wt).filter((vt,wt,Yt)=>wt===0||vt-Yt[wt-1]>1e-8),It=({contour:vt,center:wt},Yt)=>{let ie=Ft(Math.cos(Yt),Math.sin(Yt)),se=1/0;for(let Nt=0;Nt<vt.length;Nt++){let Me=vt[Nt],Pe=vt[(Nt+1)%vt.length].clone().sub(Me),ve=Wt(ie,Pe);if(Math.abs(ve)<1e-12)continue;let Ie=Me.clone().sub(wt),Oe=Wt(Ie,Pe)/ve,_e=Wt(Ie,ie)/ve;Oe>=0&&_e>=-1e-8&&_e<=1+1e-8&&(se=Math.min(se,Oe))}if(!isFinite(se))throw new Error("Ray missed the contour.");return wt.clone().addScaledVector(ie,se)};return Ct.map(vt=>({source:It(ot,vt),target:It(lt,vt)}))}function Vt(B,J,V=160){let ot=vt=>{let wt=[0];for(let Nt=0;Nt<vt.length;Nt++)wt.push(wt[Nt]+vt[Nt].distanceTo(vt[(Nt+1)%vt.length]));let Yt=wt[vt.length],ie=[],se=0;for(let Nt=0;Nt<V;Nt++){let Me=Nt/V*Yt;for(;se<vt.length-1&&wt[se+1]<Me;)se++;let Pe=vt[se],ve=vt[(se+1)%vt.length],Ie=wt[se+1]-wt[se];ie.push(Pe.clone().lerp(ve,Ie>0?(Me-wt[se])/Ie:0))}return ie},lt=ot(B),bt=ot(J),Ct=0,It=1/0;for(let vt=0;vt<V;vt++){let wt=0;for(let Yt=0;Yt<V;Yt++)wt+=lt[Yt].distanceToSquared(bt[(Yt+vt)%V]);wt<It&&(It=wt,Ct=vt)}return lt.map((vt,wt)=>({source:vt,target:bt[(wt+Ct)%V]}))}function ae(B,J,V){try{return qt(B,J)}catch(ot){return console.warn(`[glass] radial morph unavailable for "${V}" (${ot.message}); using arc-length matching.`),Vt(B,J)}}function oe(B,J){let V=!1;for(let ot=0,lt=J.length-1;ot<J.length;lt=ot++){let bt=J[ot],Ct=J[lt];bt.y>B.y!=Ct.y>B.y&&B.x<(Ct.x-bt.x)*(B.y-bt.y)/(Ct.y-bt.y)+bt.x&&(V=!V)}return V}function xe(B){let V=new Wr().parse(B).paths.flatMap(It=>It.subPaths.map(vt=>he(vt.getPoints(6).map(wt=>Ft(wt.x,-wt.y))))).filter(It=>It.length>=3&&Math.abs(Be.area(It))>1e-9).sort((It,vt)=>Math.abs(Be.area(vt))-Math.abs(Be.area(It)));if(!V.length)throw new Error("This SVG has no closed contour.");let[ot,...lt]=V,bt=[],Ct=[];for(let It of lt){let vt=new hn().setFromPoints(It).getCenter(Ft());(oe(vt,ot)?bt:Ct).push(It)}return{outline:ot,holes:bt,extras:Ct}}function Re(B,J){let V=new hn().setFromPoints([B.outline,...B.holes,...B.extras].flat()),ot=V.getCenter(Ft()),lt=V.getSize(Ft()),bt=J/Math.max(lt.x,lt.y),Ct=It=>It.map(vt=>vt.clone().sub(ot).multiplyScalar(bt));return{outline:Ct(B.outline),holes:B.holes.map(Ct),extras:B.extras.map(Ct)}}function ce(B){let J=B.slice();Be.isClockWise(J)&&J.reverse();let V=new hn().setFromPoints(J).getSize(Ft()).length()*2+1,ot=[Ft(-V,-V),Ft(V,-V),Ft(V,V),Ft(-V,V)];for(let lt=0;lt<J.length;lt++){let bt=J[lt],Ct=J[(lt+1)%J.length].clone().sub(bt),It=[];for(let vt=0;vt<ot.length;vt++){let wt=ot[vt],Yt=ot[(vt+1)%ot.length],ie=Wt(Ct,wt.clone().sub(bt)),se=Wt(Ct,Yt.clone().sub(bt));ie>=-1e-10&&It.push(wt),ie>=0!=se>=0&&It.push(wt.clone().lerp(Yt,ie/(ie-se)))}if(ot=It,!ot.length)return[]}return ot}function Ne(B,J){if(J<=1)return[B];let V=new hn().setFromPoints(B).getCenter(Ft()),ot=360/J,lt=null;for(let bt=0;bt<ot-.001;bt+=5){let Ct=[],It=1/0;for(let vt=0;vt<J;vt++){let wt=ee(B,Et(V,bt+vt*ot,bt+(vt+1)*ot));if(wt.length<3){It=-1;break}let Yt=ce(wt),ie=Yt.length?Math.abs(Be.area(Yt))/Math.abs(Be.area(wt)):0;It=Math.min(It,ie),Ct.push(wt)}It>=0&&(!lt||It>lt.worst)&&(lt={worst:It,pieces:Ct})}if(!lt)throw new Error(`Could not split this shape into ${J} fragments.`);return lt.worst===0&&console.warn("[glass] a fragment has no visibility kernel; using arc-length morphing there."),lt.pieces}function Ke(B,J){let V=Math.max(1,J-B.extras.length),ot=B.extras.map(Ct=>Object.assign(Ct.slice(),{isExtra:!0})),lt=[...Ne(B.outline,V),...ot].slice(0,Math.max(1,J)),bt=Ct=>{let It=new hn().setFromPoints(Ct).getCenter(Ft());return(Math.atan2(It.y,It.x)+Math.PI*2)%(Math.PI*2)};return lt.sort((Ct,It)=>bt(Ct)-bt(It))}function Ts(){Qt(),q=new Nn,q.position.y=-.3,K.add(q);let B=re(),J=new Nn;J.rotation.set(-.08,.28,-.08),q.add(J);let V=Re(xe(p),N),ot=Re(xe(u),j);rt=ot.outline,ut=ot.holes;let lt=F(V.outline),bt=new tn(lt.contour),Ct=Ft(lt.home.x,lt.home.y);for(let Yt of V.holes)bt.holes.push(new ln(Yt.map(ie=>ie.clone().sub(Ct))));let It=new hi(bt,{depth:I,steps:1,bevelEnabled:!0,bevelSize:C.size,bevelThickness:C.thickness,bevelSegments:6,curveSegments:24});It.translate(0,0,-I/2),Q=new Fe(It,B),Q.position.copy(lt.home),J.add(Q),z=new Fe(Rt(Y,Y,0),B),z.userData.progress=-1,z.visible=!1,J.add(z);let vt=Ke(V,x.fragments),wt=Ke(ot,vt.length);vt.forEach((Yt,ie)=>{let se=!!Yt.isExtra,Nt=F(Yt),Me=F(wt[Math.min(ie,wt.length-1)]),Pe=At(Nt.contour,I,C.size,C.thickness),ve=new Fe(Pe,B);ve.position.copy(Nt.home),J.add(ve);let Ie=Ft(Nt.home.x,Nt.home.y);Ie.lengthSq()<1e-6&&Ie.set(Math.cos(ie),Math.sin(ie));let Oe=new G(Ie.x,Ie.y,0).normalize().multiplyScalar(1.15);Oe.z=(ie%2===0?1:-1)*.55;let _e=Math.sign(Oe.x)||1,Je=Math.sign(Oe.y)||1;tt.push({name:`fragment-${ie}`,mesh:ve,home:Nt.home,offset:Oe,twist:new G(Je*.12,_e*.18,-_e*Je*.09),targetHome:Me.home,correspondence:ae(Nt.contour,Me.contour,`fragment-${ie}`),originalGeometry:Pe,morphGeometry:null,isBody:!se,finalGeometry:se?At(Me.contour,M,T.size,T.thickness):null,targetContour:se?Me.contour:null,extraBevel:-1})})}function Xr(B,J,V){let ot=new tn,lt=-B/2,bt=-J/2;return ot.moveTo(lt+V,bt),ot.lineTo(lt+B-V,bt),ot.absarc(lt+B-V,bt+V,V,-Math.PI/2,0,!1),ot.lineTo(lt+B,bt+J-V),ot.absarc(lt+B-V,bt+J-V,V,0,Math.PI/2,!1),ot.lineTo(lt+V,bt+J),ot.absarc(lt+V,bt+J-V,V,Math.PI/2,Math.PI,!1),ot.lineTo(lt,bt+V),ot.absarc(lt+V,bt+V,V,Math.PI,Math.PI*1.5,!1),ot}function pi(){return 2*W*Math.tan(yn.degToRad(dt.fov/2))/pt.height}function Qi(B,J,V){let ot=ft*V,lt=Math.max(ot+.002,R*V),bt=Xr(B-2*ot,J-2*ot,lt-ot),Ct=new hi(bt,{depth:et,steps:1,bevelEnabled:!0,bevelSize:ot,bevelThickness:O,bevelSegments:10,curveSegments:18});return Ct.translate(0,0,-(et+O)),Ct}function mi(){S&&(ct=re(),ct.side=Sn,ct.color.set("#9ea6b8"),ct.roughness=.34,ct.thickness=.35,ct.attenuationColor.set("#2b1f2f"),ct.attenuationDistance=1.8,ct.clearcoat=1,ct.clearcoatRoughness=.14,ct.iridescence=.18,ct.envMapIntensity=.55,$=new Fe(Qi(1,1,1),ct),$.userData={w:0,h:0},$.visible=!1,dt.add($),i.classList.add("has-glass-card"))}function As(){if(!$||!S||($.visible=L>.001,!$.visible))return;let B=S.getBoundingClientRect(),J=pi(),V=B.width*J,ot=B.height*J;(Math.abs($.userData.w-V)>.003||Math.abs($.userData.h-ot)>.003)&&($.geometry.dispose(),$.geometry=Qi(V,ot,J),$.userData={w:V,h:ot});let lt=B.left+B.width/2-pt.width/2,bt=pt.height/2-(B.top+B.height/2);$.position.set(lt*J,bt*J,-W),$.rotation.set(-H*.02,X*.025,0)}function En(){let B=P?P.offsetTop+P.offsetHeight:document.documentElement.scrollHeight;return Math.max(1,B-window.innerHeight)}function Ee(B,J,V){let ot=yn.clamp((B-J)/(V-J),0,1);return ot*ot*ot*(ot*(ot*6-15)+10)}function Rs(B){let J=pt.width/pt.height,V=yn.clamp((1-J)/.2,0,1),ot=Cs(B),lt=Ee(B,.4,.54),bt=4.7-Math.sin(B*Math.PI)*.6+ot*2.6+lt*.9,Ct=8.9-Math.sin(B*Math.PI)*.4+ot*2+lt*.4,It=kt(bt,Ct,V),vt=1-Ee(B,.12,.24),wt=Ee(B,.12,.24)-Ee(B,.4,.5),Yt=Ee(B,.52,.62)-Ee(B,.74,.86),ie=Ee(B,.74,.86),se=(c??-1.5*vt+1.5*wt-1.8*Yt-1.4*ie)*(1-V),Nt=1-2*Ee(B,.16,.26)+2*Ee(B,.44,.54)-2*Ee(B,.72,.82),Me=2*It*Math.tan(yn.degToRad(dt.fov/2)),Pe=-.15+l+V*Nt*(Nt>0?.2:.19)*Me,ve=B*Math.PI*2,Ie=new G(Math.cos(ve),0,-Math.sin(ve)),Oe=new G(0,Pe,0).addScaledVector(Ie,se);return{radius:It,lookAt:Oe,portrait:V}}function Cs(B){return Ee(B,.12,.28)*(1-Ee(B,.4,.54))}function E(B,J,V){let ot=B.geometryCache||(B.geometryCache=new Map),lt=ot.get(J);if(lt?ot.delete(J):lt=V(),ot.set(J,lt),ot.size>24){let bt=ot.keys().next().value;ot.get(bt).dispose(),ot.delete(bt)}return lt}let Z=B=>Math.round(B*96)/96;function st(B){let J=Cs(B),V=Ee(B,.4,.54),ot=Z(V),lt=V>=1,bt=J<=0&&V<=0;if(Q&&(Q.visible=bt),z&&(z.visible=lt,lt)){let Ct=Z(Ee(B,.54,.56)),It=Z(Ee(B,.54,.6)),vt=`${Ct}:${It}`;vt!==z.userData.progress&&(z.geometryCache||z.geometry.dispose(),z.geometry=E(z,vt,()=>Rt(kt(Y,T.size,Ct),kt(Y,T.thickness,Ct),It)),z.userData.progress=vt)}for(let Ct of tt){let{mesh:It,home:vt,targetHome:wt,offset:Yt,twist:ie,correspondence:se}=Ct;if(It.visible=Ct.isBody?!lt&&!bt:!0,It.position.copy(vt).lerp(wt,V).addScaledVector(Yt,J),It.rotation.set(ie.x*J,ie.y*J,ie.z*J),!!It.visible)if(!Ct.isBody&&lt){let Nt=Z(Ee(B,.54,.56));It.geometry=Nt>=1?Ct.finalGeometry:E(Ct,`extra:${Nt}`,()=>At(Ct.targetContour,M,kt(Y,T.size,Nt),kt(Y,T.thickness,Nt)))}else V<=0?It.geometry=Ct.originalGeometry:It.geometry=E(Ct,`morph:${ot}`,()=>{let Nt=se.map(({source:Me,target:Pe})=>Me.clone().lerp(Pe,ot));return At(Nt,kt(I,M,ot),kt(C.size,Y,ot),kt(C.thickness,Y,ot))})}}function at(){let B=`
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
    `;xt=new _n({vertexShader:B,fragmentShader:J,uniforms:St,depthWrite:!1,depthTest:!1});let V=new Zi(30,30);ht=new Fe(V,xt),ht.position.set(0,0,-8),ht.renderOrder=-10,dt.add(ht)}function nt(){Object.assign(pt,f()),dt.aspect=pt.width/pt.height,dt.updateProjectionMatrix(),U.setSize(pt.width,pt.height,d!=="canvas"),U.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),St&&U.getDrawingBufferSize(St.uResolution.value)}b(window,"mousemove",B=>{m=B.clientX,v=B.clientY;let J=i.querySelector(".cursor-inner");J&&(J.style.left=`${m}px`,J.style.top=`${v}px`),mt=B.clientX/window.innerWidth*2-1,D=B.clientY/window.innerHeight*2-1,i.classList.remove("cursor-hidden")}),b(document,"mouseover",B=>{let J=B.target instanceof Element?B.target:null;i.classList.toggle("cursor-hover",!!(J&&J.closest("a, button"))),i.classList.toggle("cursor-text",!!(J&&J.closest("input, textarea")))}),b(document.documentElement,"mouseleave",()=>i.classList.add("cursor-hidden"));let Lt="";function Bt(){let B=i.querySelector(".cursor-label");if(!B)return;B.style.left=`${k}px`,B.style.top=`${gt}px`;let J=L>.02?"CONTACT":String(Math.round(Mt*100)).padStart(3,"0");J!==Lt&&(B.textContent=J,Lt=J)}b(window,"resize",()=>{nt(),ue.chapter=-1,Ht()});function Ht(){i.querySelectorAll(".slide-title").forEach(B=>{B.style.fontSize="";let J=[...B.querySelectorAll(".line-inner")];if(!J.length)return;let V=Math.max(...J.map(lt=>{let bt=document.createRange();return bt.selectNodeContents(lt),bt.getBoundingClientRect().width})),ot=B.clientWidth;if(V>ot&&ot>0){let lt=parseFloat(getComputedStyle(B).fontSize);B.style.fontSize=`${Math.floor(lt*ot/V*.985)}px`}})}let Gt=0,jt=0,Zt=performance.now();for(let B of["scroll","pointermove","pointerdown","keydown","resize"])b(window,B,()=>{Zt=performance.now()},{passive:!0});b(document,"visibilitychange",()=>{cancelAnimationFrame(Gt),Gt=0,!document.hidden&&!A&&(_t.getDelta(),jt=0,Zt=performance.now(),Gt=requestAnimationFrame(Jt))});function Jt(B=performance.now()){if(document.hidden||A)return;Gt=requestAnimationFrame(Jt);let V=Math.abs(yn.clamp(window.scrollY/En(),0,1)-Mt)>1e-4||Math.abs(L-it)>1e-4||B-Zt<1500?60:30;if(jt&&B-jt<1e3/V-1)return;jt=B;let ot=Math.min(_t.getDelta(),.1),lt=Nt=>1-Math.pow(1-Nt,ot*60),bt=En(),Ct=window.scrollY!==void 0?window.scrollY:window.pageYOffset!==void 0?window.pageYOffset:document.documentElement.scrollTop,It=a?(B-g)/1e3%a/a:yn.clamp(Ct/bt,0,1);L=w?yn.clamp((Ct-bt)/window.innerHeight,0,1):0,a?Mt=It:Mt+=(It-Mt)*lt(.025),it+=(L-it)*lt(.06),Math.abs(L-it)<.0015&&(it=L),X+=(mt-X)*lt(.05),H+=(D-H)*lt(.05),k+=(m-k)*lt(.2),gt+=(v-gt)*lt(.2);let vt=i.querySelector(".cursor-outer");if(vt&&(vt.style.left=`${k}px`,vt.style.top=`${gt}px`),Bt(),q){let Nt=Ee(it,0,.85);q.rotation.y=X*.25+Nt*1.35,q.rotation.x=H*.15-Nt*.35,q.rotation.z=Nt*.55,q.position.set(-Nt*3.4,-.3+Nt*4.8,-Nt*1.2),q.scale.setScalar(h*(1-Nt*.5))}if(Pt){let Nt=Pt.geometry.attributes.position.array,Me=_t.getElapsedTime(),Pe=Math.abs(It-Mt),ve=1+Pe*9,Ie=Pe*.8;for(let Oe=0;Oe<Ot;Oe++){let _e=Oe*3,Je=Xt[Oe];Nt[_e]+=Je.speedX*ot*ve,Nt[_e+1]+=Je.speedY*ot*ve,Nt[_e+2]+=Je.speedZ*ot*ve;let Ao=Je.swayRadius*(1+Ie*4);Nt[_e]+=Math.sin(Me*Je.swaySpeed+Je.phase)*Ao*ot,Nt[_e+2]+=Math.cos(Me*Je.swaySpeed+Je.phase)*Ao*ot,(Nt[_e+1]>3||Math.abs(Nt[_e])>3.5||Math.abs(Nt[_e+2])>3.5)&&(Nt[_e+1]=-2.5,Nt[_e]=(Math.random()-.5)*3,Nt[_e+2]=(Math.random()-.5)*3)}Pt.geometry.attributes.position.needsUpdate=!0}let wt=Rs(Mt),Yt=Mt*Math.PI*2,ie=.35+Math.sin(Mt*Math.PI)*.8,se=new G(wt.radius*Math.sin(Yt),ie,wt.radius*Math.cos(Yt));dt.position.lerp(se,lt(.025)),dt.lookAt(wt.lookAt),As(),St&&(St.uTime.value=_t.getElapsedTime(),St.uMouse.value.set(X,-H),St.uScroll.value=a?1-Math.abs(2*Mt-1):Mt+it*.22,St.uVelocity.value+=(Math.min(1,Math.abs(It-Mt)*14)-St.uVelocity.value)*lt(.06)),st(Mt),ts(Mt),Ge(Mt),es(),U.render(K,dt)}let ue={chapter:-1};function Ge(B){let J=L>.02?4:B<.2?0:B<.48?1:B<.76?2:3;if(J===ue.chapter)return;ue.chapter=J;let V=i.querySelector("[data-chapter]");V&&(V.textContent=String(J+1).padStart(2,"0")),i.querySelectorAll("[data-goto]").forEach((ot,lt)=>ot.classList.toggle("is-active",lt===J))}let ye=[[-.1,.15],[.26,.43],[.54,.71],[.82,1.05]],un=1500,de=400,ne=ye.map(()=>({active:!1,since:0,left:0}));function ts(B){let J=[...i.querySelectorAll("[data-slide]")];for(let vt=1;vt<=4;vt++){let wt=i.querySelector(`[data-dash="${vt}"]`);if(wt){let Yt=(vt-1)*.25,ie=vt*.25,se=(B-Yt)/(ie-Yt);se=Math.max(0,Math.min(1,se)),wt.style.height=`${se*100}%`}}let V=performance.now(),ot=!1,lt=L>.02,Ct=ye.map(([vt,wt])=>!ot&&!lt&&B>=vt&&B<=wt).indexOf(!0),It=ne.map((vt,wt)=>Ct===wt?(vt.active||(vt.since=V),vt.active=!0,vt.left=0,!0):vt.active&&Ct===-1&&!lt&&!ot&&(vt.left||(vt.left=V),V-vt.since<un||V-vt.left<de)?!0:(vt.active=!1,vt.left=0,!1));J.forEach((vt,wt)=>{vt&&vt.classList.toggle("active",It[wt])}),Ps(It[3])}let fe=!1,vn=!1;function Ps(B){let J=i.querySelectorAll(".figure-value");if(!J.length||B===vn)return;if(vn=B,!B){J.forEach(Ct=>{Ct.textContent=0 .toFixed(Number(Ct.dataset.decimals||0))});return}let V=performance.now(),ot=1400,lt=Symbol("figures");fe=lt;let bt=Ct=>{if(fe!==lt)return;let It=Math.min(1,(Ct-V)/ot),vt=1-Math.pow(1-It,4);J.forEach(wt=>{let Yt=Number(wt.dataset.count||0),ie=Number(wt.dataset.decimals||0);wt.textContent=(Yt*vt).toFixed(ie)}),It<1&&requestAnimationFrame(bt)};requestAnimationFrame(bt)}function Kn(){i.querySelectorAll("[data-goto]").forEach(B=>{b(B,"click",J=>{let V=B.getAttribute("data-goto"),ot=V==="after"&&w?w.getBoundingClientRect().top+window.scrollY:En()*Number(V);J.preventDefault(),window.scrollTo({top:ot,behavior:"smooth"})})})}function es(){w&&i.classList.toggle("contact-open",L>.02)}let Ce=window.__glassSite={snap(B){window.scrollTo({top:En()*B,behavior:"instant"}),Mt=B,it=L=0;let J=B*Math.PI*2,{radius:V}=Rs(B);dt&&dt.position.set(V*Math.sin(J),.35+Math.sin(B*Math.PI)*.8,V*Math.cos(J))},snapContact(B){window.scrollTo({top:En()+window.innerHeight*B,behavior:"instant"}),Mt=1,it=L=B,this.snap(1),window.scrollTo({top:En()+window.innerHeight*B,behavior:"instant"}),it=L=B},get scroll(){return Mt},get contact(){return it},get pieces(){return tt.map(B=>({name:B.name,points:B.correspondence.length}))}};function wn(){Ht(),K=new _s,K.background=new Kt("#000000"),K.fog=new Ar("#000000",.01),dt=new Ve(50,pt.width/pt.height,.1,100),dt.position.set(0,.2,3),K.add(dt),at(),U=new gs({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),U.setSize(pt.width,pt.height,d!=="canvas"),U.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),U.shadowMap.enabled=!0,U.shadowMap.type=xo,U.toneMapping=yo,U.toneMappingExposure=2.2;let B=new Br("#ffffff",.1);K.add(B);let J=new Fr("#ffffff",18);J.position.set(4,6,3),J.angle=Math.PI/4,J.penumbra=.9,J.castShadow=!0,J.shadow.mapSize.width=2048,J.shadow.mapSize.height=2048,J.shadow.camera.near=1,J.shadow.camera.far=15,J.shadow.bias=-.001,K.add(J);let V=new ws("#e3f2ff",10);V.position.set(-5,3,-4),K.add(V);let ot=new ws("#fff3e6",.8);ot.position.set(-2,-4,2),K.add(ot),Dt(),Ts(),mi(),nt(),$&&($.visible=!0,U.compile(K,dt),$.visible=!1),i.querySelector(".slide-title")?.getBoundingClientRect(),Jt(),Kn();let lt=()=>{A||(Ht(),i.classList.add("glass-ready"),o?.())};document.fonts&&document.fonts.ready?document.fonts.ready.then(lt,lt):lt()}function gi(){A=!0,cancelAnimationFrame(Gt);for(let[V,ot,lt,bt]of _)V.removeEventListener(ot,lt,bt);let B=new Set,J=V=>{V&&!B.has(V)&&(B.add(V),V.dispose())};for(let V of[z,...tt])V?.geometryCache?.forEach(J);for(let V of tt)J(V.originalGeometry),J(V.finalGeometry);K?.traverse(V=>{J(V.geometry),(Array.isArray(V.material)?V.material:[V.material]).forEach(ot=>{J(ot?.map),J(ot)})}),J(K?.environment),U?.dispose(),U?.forceContextLoss(),i.classList.remove("glass-ready","has-glass-card","contact-open","cursor-hover","cursor-text","cursor-hidden"),window.__glassSite===Ce&&delete window.__glassSite}try{wn()}catch(B){throw gi(),B}return gi}var wg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill-rule="evenodd" d="
M250 0H750A250 250 0 0 1 1000 250V750A250 250 0 0 1 750 1000H250A250 250 0 0 1 0 750V250A250 250 0 0 1 250 0Z
M343.75 250H546.875A156.25 156.25 0 0 1 637.5 534.375A162.5 162.5 0 0 1 562.5 750H343.75Z
M712.5 218.75A68.75 68.75 0 1 0 850 218.75A68.75 68.75 0 1 0 712.5 218.75Z"/></svg>`,Tg=["#387cd5","#6a6be8","#8b5cf6","#22d3ee","#2563c9"];function Ag(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return!1;try{let i=document.createElement("canvas").getContext("webgl2");return i?.getExtension("WEBGL_lose_context")?.loseContext(),!!i}catch{return!1}}export{Ag as glassAvailable,wg as glassMark,Tg as glassPalette,yg as startGlass};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
