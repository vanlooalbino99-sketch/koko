var Dl=0,Po=1,Nl=2;var ll=1,Mo=2,Pn=3,Mn=0,$e=1,an=2;var qn=0,Bi=1,ar=2,Io=3,Uo=4,Ol=5,si=100,Fl=101,Bl=102,Do=103,No=104,zl=200,kl=201,Hl=202,Vl=203,Aa=204,Ra=205,Gl=206,Wl=207,Xl=208,ql=209,Yl=210,Zl=211,Jl=212,$l=213,Kl=214,jl=0,Ql=1,th=2,or=3,eh=4,nh=5,ih=6,sh=7,hl=0,rh=1,ah=2,Yn=0,oh=1,ch=2,lh=3,So=4,hh=5,uh=6;var ul=300,Hi=301,Vi=302,Ca=303,Pa=304,Hr=306,Ia=1e3,mn=1001,Ua=1002,Xe=1003,Oo=1004;var Jr=1005;var rn=1006,dh=1007;var fs=1008;var Zn=1009,fh=1010,ph=1011,bo=1012,dl=1013,Wn=1014,Xn=1015,ps=1016,fl=1017,pl=1018,ai=1020,mh=1021,gn=1023,gh=1024,_h=1025,oi=1026,Gi=1027,xh=1028,ml=1029,yh=1030,gl=1031,_l=1033,$r=33776,Kr=33777,jr=33778,Qr=33779,Fo=35840,Bo=35841,zo=35842,ko=35843,xl=36196,Ho=37492,Vo=37496,Go=37808,Wo=37809,Xo=37810,qo=37811,Yo=37812,Zo=37813,Jo=37814,$o=37815,Ko=37816,jo=37817,Qo=37818,tc=37819,ec=37820,nc=37821,ta=36492,ic=36494,sc=36495,vh=36283,rc=36284,ac=36285,oc=36286;var cr=2300,lr=2301,ea=2302,cc=2400,lc=2401,hc=2402;var yl=3e3,ci=3001,Mh=3200,Sh=3201,vl=0,bh=1,on="",Ee="srgb",Nn="srgb-linear",Eo="display-p3",Vr="display-p3-linear",hr="linear",de="srgb",ur="rec709",dr="p3";var _i=7680;var uc=519,Eh=512,wh=513,Th=514,Ml=515,Lh=516,Ah=517,Rh=518,Ch=519,dc=35044;var fc="300 es",Da=1035,Un=2e3,fr=2001,Jn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pc=1234567,os=Math.PI/180,Wi=180/Math.PI;function pi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function wo(i,t){return(i%t+t)%t}function Ph(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ih(i,t,e){return i!==t?(e-i)/(t-i):0}function cs(i,t,e){return(1-e)*i+e*t}function Uh(i,t,e,n){return cs(i,t,1-Math.exp(-e*n))}function Dh(i,t=1){return t-Math.abs(wo(i,t*2)-t)}function Nh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Oh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Fh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Bh(i,t){return i+Math.random()*(t-i)}function zh(i){return i*(.5-Math.random())}function kh(i){i!==void 0&&(pc=i);let t=pc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Hh(i){return i*os}function Vh(i){return i*Wi}function Na(i){return(i&i-1)===0&&i!==0}function Gh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wh(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),g=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*d,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*x,c*g,a*l);break;case"YXY":i.set(c*g,a*h,c*x,a*l);break;case"ZYZ":i.set(c*x,c*g,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ui(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var yn={DEG2RAD:os,RAD2DEG:Wi,generateUUID:pi,clamp:Ie,euclideanModulo:wo,mapLinear:Ph,inverseLerp:Ih,lerp:cs,damp:Uh,pingpong:Dh,smoothstep:Nh,smootherstep:Oh,randInt:Fh,randFloat:Bh,randFloatSpread:zh,seededRandom:kh,degToRad:Hh,radToDeg:Vh,isPowerOfTwo:Na,ceilPowerOfTwo:Gh,floorPowerOfTwo:pr,setQuaternionFromProperEuler:Wh,normalize:Ge,denormalize:Ui},xt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Jt=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],g=n[5],x=n[8],y=s[0],p=s[3],u=s[6],A=s[1],_=s[4],T=s[7],D=s[2],P=s[5],C=s[8];return r[0]=o*y+a*A+c*D,r[3]=o*p+a*_+c*P,r[6]=o*u+a*T+c*C,r[1]=l*y+h*A+d*D,r[4]=l*p+h*_+d*P,r[7]=l*u+h*T+d*C,r[2]=f*y+g*A+x*D,r[5]=f*p+g*_+x*P,r[8]=f*u+g*T+x*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=h*o-a*l,f=a*c-h*r,g=l*r-o*c,x=e*d+n*f+s*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/x;return t[0]=d*y,t[1]=(s*l-h*n)*y,t[2]=(a*n-s*o)*y,t[3]=f*y,t[4]=(h*e-s*c)*y,t[5]=(s*r-a*e)*y,t[6]=g*y,t[7]=(n*c-l*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(na.makeScale(t,e)),this}rotate(t){return this.premultiply(na.makeRotation(-t)),this}translate(t,e){return this.premultiply(na.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},na=new Jt;function Sl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xh(){let i=mr("canvas");return i.style.display="block",i}var mc={};function ls(i){i in mc||(mc[i]=!0,console.warn(i))}var gc=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),_c=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Is={[Nn]:{transfer:hr,primaries:ur,toReference:i=>i,fromReference:i=>i},[Ee]:{transfer:de,primaries:ur,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Vr]:{transfer:hr,primaries:dr,toReference:i=>i.applyMatrix3(_c),fromReference:i=>i.applyMatrix3(gc)},[Eo]:{transfer:de,primaries:dr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(_c),fromReference:i=>i.applyMatrix3(gc).convertLinearToSRGB()}},qh=new Set([Nn,Vr]),le={enabled:!0,_workingColorSpace:Nn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!qh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Is[t].toReference,s=Is[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Is[i].primaries},getTransfer:function(i){return i===on?hr:Is[i].transfer}};function zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ia(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var xi,gr=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{xi===void 0&&(xi=mr("canvas")),xi.width=t.width,xi.height=t.height;let n=xi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=xi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=mr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=zi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zi(e[n]/255)*255):e[n]=zi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Yh=0,_r=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=pi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(sa(s[o].image)):r.push(sa(s[o]))}else r=sa(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function sa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Zh=0,cn=class i extends Jn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=mn,s=mn,r=rn,o=fs,a=gn,c=Zn,l=i.DEFAULT_ANISOTROPY,h=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=pi(),this.name="",this.source=new _r(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ci?Ee:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ul)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ia:t.x=t.x-Math.floor(t.x);break;case mn:t.x=t.x<0?0:1;break;case Ua:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ia:t.y=t.y-Math.floor(t.y);break;case mn:t.y=t.y<0?0:1;break;case Ua:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ee?ci:yl}set encoding(t){ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ci?Ee:on}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=ul;cn.DEFAULT_ANISOTROPY=1;var Ue=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],d=c[8],f=c[1],g=c[5],x=c[9],y=c[2],p=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-y)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+y)<.1&&Math.abs(x+p)<.1&&Math.abs(l+g+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,T=(g+1)/2,D=(u+1)/2,P=(h+f)/4,C=(d+y)/4,$=(x+p)/4;return _>T&&_>D?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=P/n,r=C/n):T>D?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=P/s,r=$/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=C/r,s=$/r),this.set(n,s,r,e),this}let A=Math.sqrt((p-x)*(p-x)+(d-y)*(d-y)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(p-x)/A,this.y=(d-y)/A,this.z=(f-h)/A,this.w=Math.acos((l+g+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Oa=class extends Jn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(ls("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ci?Ee:on),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new cn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new _r(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},On=class extends Oa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},xr=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fa=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var $n=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],g=r[o+1],x=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=g,t[e+2]=x,t[e+3]=y;return}if(d!==y||c!==f||l!==g||h!==x){let p=1-a,u=c*f+l*g+h*x+d*y,A=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let D=Math.sqrt(_),P=Math.atan2(D,u*A);p=Math.sin(p*P)/D,a=Math.sin(a*P)/D}let T=a*A;if(c=c*p+f*T,l=l*p+g*T,h=h*p+x*T,d=d*p+y*T,p===1-a){let D=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=D,l*=D,h*=D,d*=D}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],f=r[o+1],g=r[o+2],x=r[o+3];return t[e]=a*x+h*d+c*g-l*f,t[e+1]=c*x+h*f+l*d-a*g,t[e+2]=l*x+h*g+a*f-c*d,t[e+3]=h*x-a*d-c*f-l*g,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),f=c(n/2),g=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"YXZ":this._x=f*h*d+l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"ZXY":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d-f*g*x;break;case"ZYX":this._x=f*h*d-l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d+f*g*x;break;case"YZX":this._x=f*h*d+l*g*x,this._y=l*g*d+f*h*x,this._z=l*h*x-f*g*d,this._w=l*h*d-f*g*x;break;case"XZY":this._x=f*h*d-l*g*x,this._y=l*g*d-f*h*x,this._z=l*h*x+f*g*d,this._w=l*h*d+f*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-c)*g,this._y=(r-l)*g,this._z=(o-s)*g}else if(n>a&&n>d){let g=2*Math.sqrt(1+n-a-d);this._w=(h-c)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+l)/g}else if(a>d){let g=2*Math.sqrt(1+a-n-d);this._w=(r-l)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(c+h)/g}else{let g=2*Math.sqrt(1+d-n-a);this._w=(o-s)/g,this._x=(r+l)/g,this._y=(c+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let g=1-e;return this._w=g*o+e*this._w,this._x=g*n+e*this._x,this._y=g*s+e*this._y,this._z=g*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(xc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(xc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ra.copy(this).projectOnVector(t),this.sub(ra)}reflect(t){return this.sub(ra.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ra=new V,xc=new $n,li=class{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Us.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Us.copy(n.boundingBox)),Us.applyMatrix4(t.matrixWorld),this.union(Us)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(is),Ds.subVectors(this.max,is),yi.subVectors(t.a,is),vi.subVectors(t.b,is),Mi.subVectors(t.c,is),zn.subVectors(vi,yi),kn.subVectors(Mi,vi),Qn.subVectors(yi,Mi);let e=[0,-zn.z,zn.y,0,-kn.z,kn.y,0,-Qn.z,Qn.y,zn.z,0,-zn.x,kn.z,0,-kn.x,Qn.z,0,-Qn.x,-zn.y,zn.x,0,-kn.y,kn.x,0,-Qn.y,Qn.x,0];return!aa(e,yi,vi,Mi,Ds)||(e=[1,0,0,0,1,0,0,0,1],!aa(e,yi,vi,Mi,Ds))?!1:(Ns.crossVectors(zn,kn),e=[Ns.x,Ns.y,Ns.z],aa(e,yi,vi,Mi,Ds))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},wn=[new V,new V,new V,new V,new V,new V,new V,new V],dn=new V,Us=new li,yi=new V,vi=new V,Mi=new V,zn=new V,kn=new V,Qn=new V,is=new V,Ds=new V,Ns=new V,ti=new V;function aa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ti.fromArray(i,r);let a=s.x*Math.abs(ti.x)+s.y*Math.abs(ti.y)+s.z*Math.abs(ti.z),c=t.dot(ti),l=e.dot(ti),h=n.dot(ti);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Jh=new li,ss=new V,oa=new V,Xi=class{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Jh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ss.subVectors(t,this.center);let e=ss.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ss,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ss.copy(t.center).add(oa)),this.expandByPoint(ss.copy(t.center).sub(oa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Tn=new V,ca=new V,Os=new V,Hn=new V,la=new V,Fs=new V,ha=new V,yr=class{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Tn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Tn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Tn.copy(this.origin).addScaledVector(this.direction,e),Tn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ca.copy(t).add(e).multiplyScalar(.5),Os.copy(e).sub(t).normalize(),Hn.copy(this.origin).sub(ca);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Os),a=Hn.dot(this.direction),c=-Hn.dot(Os),l=Hn.lengthSq(),h=Math.abs(1-o*o),d,f,g,x;if(h>0)if(d=o*c-a,f=o*a-c,x=r*h,d>=0)if(f>=-x)if(f<=x){let y=1/h;d*=y,f*=y,g=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;else f<=-x?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l):f<=x?(d=0,f=Math.min(Math.max(-r,-c),r),g=f*(f+2*c)+l):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-c),r),g=-d*d+f*(f+2*c)+l);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ca).addScaledVector(Os,f),g}intersectSphere(t,e){Tn.subVectors(t.center,this.origin);let n=Tn.dot(this.direction),s=Tn.dot(Tn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,c=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,c=(t.min.z-f.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Tn)!==null}intersectTriangle(t,e,n,s,r){la.subVectors(e,t),Fs.subVectors(n,t),ha.crossVectors(la,Fs);let o=this.direction.dot(ha),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Hn.subVectors(this.origin,t);let c=a*this.direction.dot(Fs.crossVectors(Hn,Fs));if(c<0)return null;let l=a*this.direction.dot(la.cross(Hn));if(l<0||c+l>o)return null;let h=-a*Hn.dot(ha);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class i{constructor(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p)}set(t,e,n,s,r,o,a,c,l,h,d,f,g,x,y,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=f,u[3]=g,u[7]=x,u[11]=y,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Si.setFromMatrixColumn(t,0).length(),r=1/Si.setFromMatrixColumn(t,1).length(),o=1/Si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,g=o*d,x=a*h,y=a*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=g+x*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=x+g*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,g=c*d,x=l*h,y=l*d;e[0]=f+y*a,e[4]=x*a-g,e[8]=o*l,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=g*a-x,e[6]=y+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,g=c*d,x=l*h,y=l*d;e[0]=f-y*a,e[4]=-o*d,e[8]=x+g*a,e[1]=g+x*a,e[5]=o*h,e[9]=y-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,g=o*d,x=a*h,y=a*d;e[0]=c*h,e[4]=x*l-g,e[8]=f*l+y,e[1]=c*d,e[5]=y*l+f,e[9]=g*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,g=o*l,x=a*c,y=a*l;e[0]=c*h,e[4]=y-f*d,e[8]=x*d+g,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=g*d+x,e[10]=f-y*d}else if(t.order==="XZY"){let f=o*c,g=o*l,x=a*c,y=a*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=f*d+y,e[5]=o*h,e[9]=g*d-x,e[2]=x*d-g,e[6]=a*h,e[10]=y*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose($h,t,Kh)}lookAt(t,e,n){let s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),Vn.crossVectors(n,Qe),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),Vn.crossVectors(n,Qe)),Vn.normalize(),Bs.crossVectors(Qe,Vn),s[0]=Vn.x,s[4]=Bs.x,s[8]=Qe.x,s[1]=Vn.y,s[5]=Bs.y,s[9]=Qe.y,s[2]=Vn.z,s[6]=Bs.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],g=n[13],x=n[2],y=n[6],p=n[10],u=n[14],A=n[3],_=n[7],T=n[11],D=n[15],P=s[0],C=s[4],$=s[8],S=s[12],w=s[1],K=s[5],Q=s[9],_t=s[13],N=s[2],X=s[6],j=s[10],J=s[14],B=s[3],st=s[7],lt=s[11],ut=s[15];return r[0]=o*P+a*w+c*N+l*B,r[4]=o*C+a*K+c*X+l*st,r[8]=o*$+a*Q+c*j+l*lt,r[12]=o*S+a*_t+c*J+l*ut,r[1]=h*P+d*w+f*N+g*B,r[5]=h*C+d*K+f*X+g*st,r[9]=h*$+d*Q+f*j+g*lt,r[13]=h*S+d*_t+f*J+g*ut,r[2]=x*P+y*w+p*N+u*B,r[6]=x*C+y*K+p*X+u*st,r[10]=x*$+y*Q+p*j+u*lt,r[14]=x*S+y*_t+p*J+u*ut,r[3]=A*P+_*w+T*N+D*B,r[7]=A*C+_*K+T*X+D*st,r[11]=A*$+_*Q+T*j+D*lt,r[15]=A*S+_*_t+T*J+D*ut,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],d=t[6],f=t[10],g=t[14],x=t[3],y=t[7],p=t[11],u=t[15];return x*(+r*c*d-s*l*d-r*a*f+n*l*f+s*a*g-n*c*g)+y*(+e*c*g-e*l*f+r*o*f-s*o*g+s*l*h-r*c*h)+p*(+e*l*d-e*a*g-r*o*d+n*o*g+r*a*h-n*l*h)+u*(-s*a*h-e*c*d+e*a*f+s*o*d-n*o*f+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],g=t[11],x=t[12],y=t[13],p=t[14],u=t[15],A=d*p*l-y*f*l+y*c*g-a*p*g-d*c*u+a*f*u,_=x*f*l-h*p*l-x*c*g+o*p*g+h*c*u-o*f*u,T=h*y*l-x*d*l+x*a*g-o*y*g-h*a*u+o*d*u,D=x*d*c-h*y*c-x*a*f+o*y*f+h*a*p-o*d*p,P=e*A+n*_+s*T+r*D;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/P;return t[0]=A*C,t[1]=(y*f*r-d*p*r-y*s*g+n*p*g+d*s*u-n*f*u)*C,t[2]=(a*p*r-y*c*r+y*s*l-n*p*l-a*s*u+n*c*u)*C,t[3]=(d*c*r-a*f*r-d*s*l+n*f*l+a*s*g-n*c*g)*C,t[4]=_*C,t[5]=(h*p*r-x*f*r+x*s*g-e*p*g-h*s*u+e*f*u)*C,t[6]=(x*c*r-o*p*r-x*s*l+e*p*l+o*s*u-e*c*u)*C,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*g+e*c*g)*C,t[8]=T*C,t[9]=(x*d*r-h*y*r-x*n*g+e*y*g+h*n*u-e*d*u)*C,t[10]=(o*y*r-x*a*r+x*n*l-e*y*l-o*n*u+e*a*u)*C,t[11]=(h*a*r-o*d*r-h*n*l+e*d*l+o*n*g-e*a*g)*C,t[12]=D*C,t[13]=(h*y*s-x*d*s+x*n*f-e*y*f-h*n*p+e*d*p)*C,t[14]=(x*a*s-o*y*s-x*n*c+e*y*c+o*n*p-e*a*p)*C,t[15]=(o*d*s-h*a*s+h*n*c-e*d*c-o*n*f+e*a*f)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,d=a+a,f=r*l,g=r*h,x=r*d,y=o*h,p=o*d,u=a*d,A=c*l,_=c*h,T=c*d,D=n.x,P=n.y,C=n.z;return s[0]=(1-(y+u))*D,s[1]=(g+T)*D,s[2]=(x-_)*D,s[3]=0,s[4]=(g-T)*P,s[5]=(1-(f+u))*P,s[6]=(p+A)*P,s[7]=0,s[8]=(x+_)*C,s[9]=(p-A)*C,s[10]=(1-(f+y))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Si.set(s[0],s[1],s[2]).length(),o=Si.set(s[4],s[5],s[6]).length(),a=Si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);let l=1/r,h=1/o,d=1/a;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=d,fn.elements[9]*=d,fn.elements[10]*=d,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Un){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),g,x;if(a===Un)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===fr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Un){let c=this.elements,l=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*l,g=(n+s)*h,x,y;if(a===Un)x=(o+r)*d,y=-2*d;else if(a===fr)x=r*d,y=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-g,c[2]=0,c[6]=0,c[10]=y,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Si=new V,fn=new be,$h=new V(0,0,0),Kh=new V(1,1,1),Vn=new V,Bs=new V,Qe=new V,yc=new be,vc=new $n,vr=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],g=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ie(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ie(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return yc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vc.setFromEuler(this),this.setFromQuaternion(vc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};vr.DEFAULT_ORDER="XYZ";var Mr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},jh=0,Mc=new V,bi=new $n,Ln=new be,zs=new V,rs=new V,Qh=new V,tu=new $n,Sc=new V(1,0,0),bc=new V(0,1,0),Ec=new V(0,0,1),eu={type:"added"},nu={type:"removed"},ze=class i extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new V,e=new vr,n=new $n,s=new V(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new be},normalMatrix:{value:new Jt}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.multiply(bi),this}rotateOnWorldAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.premultiply(bi),this}rotateX(t){return this.rotateOnAxis(Sc,t)}rotateY(t){return this.rotateOnAxis(bc,t)}rotateZ(t){return this.rotateOnAxis(Ec,t)}translateOnAxis(t,e){return Mc.copy(t).applyQuaternion(this.quaternion),this.position.add(Mc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sc,t)}translateY(t){return this.translateOnAxis(bc,t)}translateZ(t){return this.translateOnAxis(Ec,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?zs.copy(t):zs.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(rs,zs,this.up):Ln.lookAt(zs,rs,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),bi.setFromRotationMatrix(Ln),this.quaternion.premultiply(bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(eu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(nu)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,t,Qh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,tu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),g=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ze.DEFAULT_UP=new V(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pn=new V,An=new V,ua=new V,Rn=new V,Ei=new V,wi=new V,wc=new V,da=new V,fa=new V,pa=new V,ks=!1,Di=class i{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),An.subVectors(n,e),ua.subVectors(t,e);let o=pn.dot(pn),a=pn.dot(An),c=pn.dot(ua),l=An.dot(An),h=An.dot(ua),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,g=(l*c-a*h)*f,x=(o*h-a*c)*f;return r.set(1-g-x,x,g)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getUV(t,e,n,s,r,o,a,c){return ks===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ks=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Rn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Rn.x),c.addScaledVector(o,Rn.y),c.addScaledVector(a,Rn.z),c)}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),An.subVectors(t,e),pn.cross(An).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),An.subVectors(this.a,this.b),pn.cross(An).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return ks===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ks=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Ei.subVectors(s,n),wi.subVectors(r,n),da.subVectors(t,n);let c=Ei.dot(da),l=wi.dot(da);if(c<=0&&l<=0)return e.copy(n);fa.subVectors(t,s);let h=Ei.dot(fa),d=wi.dot(fa);if(h>=0&&d<=h)return e.copy(s);let f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ei,o);pa.subVectors(t,r);let g=Ei.dot(pa),x=wi.dot(pa);if(x>=0&&g<=x)return e.copy(r);let y=g*l-c*x;if(y<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(n).addScaledVector(wi,a);let p=h*x-g*d;if(p<=0&&d-h>=0&&g-x>=0)return wc.subVectors(r,s),a=(d-h)/(d-h+(g-x)),e.copy(s).addScaledVector(wc,a);let u=1/(p+y+f);return o=y*u,a=f*u,e.copy(n).addScaledVector(Ei,o).addScaledVector(wi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},bl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Hs={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var $t=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ee){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=wo(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ma(o,r,t+1/3),this.g=ma(o,r,t),this.b=ma(o,r,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=Ee){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ee){let n=bl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zi(t.r),this.g=zi(t.g),this.b=zi(t.b),this}copyLinearToSRGB(t){return this.r=ia(t.r),this.g=ia(t.g),this.b=ia(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ee){return le.fromWorkingColorSpace(He.copy(this),t),Math.round(Ie(He.r*255,0,255))*65536+Math.round(Ie(He.g*255,0,255))*256+Math.round(Ie(He.b*255,0,255))}getHexString(t=Ee){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(He.copy(this),e);let n=He.r,s=He.g,r=He.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=Ee){le.fromWorkingColorSpace(He.copy(this),t);let e=He.r,n=He.g,s=He.b;return t!==Ee?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Gn),this.setHSL(Gn.h+t,Gn.s+e,Gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gn),t.getHSL(Hs);let n=cs(Gn.h,Hs.h,e),s=cs(Gn.s,Hs.s,e),r=cs(Gn.l,Hs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},He=new $t;$t.NAMES=bl;var iu=0,Kn=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=Bi,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ra,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=or,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bi&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ra&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==or&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},qi=class extends Kn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=hl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Se=new V,Vs=new xt,qe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=dc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Vs.fromBufferAttribute(this,e),Vs.applyMatrix3(t),this.setXY(e,Vs.x,Vs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ui(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==dc&&(t.usage=this.usage),t}};var Sr=class extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var br=class extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ye=class extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}};var su=0,sn=new be,ga=new ze,Ti=new V,tn=new li,as=new li,Pe=new V,nn=class i extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Sl(t)?br:Sr)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return ga.lookAt(t),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ye(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new V,1/0);return}if(t){let n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];as.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(tn.min,as.min),tn.expandByPoint(Pe),Pe.addVectors(tn.max,as.max),tn.expandByPoint(Pe)):(tn.expandByPoint(as.min),tn.expandByPoint(as.max))}tn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Pe.fromBufferAttribute(a,l),c&&(Ti.fromBufferAttribute(t,l),Pe.add(Ti)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let w=0;w<a;w++)l[w]=new V,h[w]=new V;let d=new V,f=new V,g=new V,x=new xt,y=new xt,p=new xt,u=new V,A=new V;function _(w,K,Q){d.fromArray(s,w*3),f.fromArray(s,K*3),g.fromArray(s,Q*3),x.fromArray(o,w*2),y.fromArray(o,K*2),p.fromArray(o,Q*2),f.sub(d),g.sub(d),y.sub(x),p.sub(x);let _t=1/(y.x*p.y-p.x*y.y);isFinite(_t)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(g,-y.y).multiplyScalar(_t),A.copy(g).multiplyScalar(y.x).addScaledVector(f,-p.x).multiplyScalar(_t),l[w].add(u),l[K].add(u),l[Q].add(u),h[w].add(A),h[K].add(A),h[Q].add(A))}let T=this.groups;T.length===0&&(T=[{start:0,count:n.length}]);for(let w=0,K=T.length;w<K;++w){let Q=T[w],_t=Q.start,N=Q.count;for(let X=_t,j=_t+N;X<j;X+=3)_(n[X+0],n[X+1],n[X+2])}let D=new V,P=new V,C=new V,$=new V;function S(w){C.fromArray(r,w*3),$.copy(C);let K=l[w];D.copy(K),D.sub(C.multiplyScalar(C.dot(K))).normalize(),P.crossVectors($,K);let _t=P.dot(h[w])<0?-1:1;c[w*4]=D.x,c[w*4+1]=D.y,c[w*4+2]=D.z,c[w*4+3]=_t}for(let w=0,K=T.length;w<K;++w){let Q=T[w],_t=Q.start,N=Q.count;for(let X=_t,j=_t+N;X<j;X+=3)S(n[X+0]),S(n[X+1]),S(n[X+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);let s=new V,r=new V,o=new V,a=new V,c=new V,l=new V,h=new V,d=new V;if(t)for(let f=0,g=t.count;f<g;f+=3){let x=t.getX(f+0),y=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,g=e.count;f<g;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,d=a.normalized,f=new l.constructor(c.length*h),g=0,x=0;for(let y=0,p=c.length;y<p;y++){a.isInterleavedBufferAttribute?g=c[y]*a.data.stride+a.offset:g=c[y]*h;for(let u=0;u<h;u++)f[x++]=l[g++]}return new qe(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let f=l[h],g=t(f,n);c.push(g)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){let g=l[d];h.push(g.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let f=0,g=d.length;f<g;f++)h.push(d[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tc=new be,ei=new yr,Gs=new Xi,Lc=new V,Li=new V,Ai=new V,Ri=new V,_a=new V,Ws=new V,Xs=new xt,qs=new xt,Ys=new xt,Ac=new V,Rc=new V,Cc=new V,Zs=new V,Js=new V,Fe=class extends ze{constructor(t=new nn,e=new qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Ws.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(_a.fromBufferAttribute(d,t),o?Ws.addScaledVector(_a,h):Ws.addScaledVector(_a.sub(e),h))}e.add(Ws)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Gs.copy(n.boundingSphere),Gs.applyMatrix4(r),ei.copy(t.ray).recast(t.near),!(Gs.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Gs,Lc)===null||ei.origin.distanceToSquared(Lc)>(t.far-t.near)**2))&&(Tc.copy(r).invert(),ei.copy(t.ray).applyMatrix4(Tc),!(n.boundingBox!==null&&ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ei)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,y=f.length;x<y;x++){let p=f[x],u=o[p.materialIndex],A=Math.max(p.start,g.start),_=Math.min(a.count,Math.min(p.start+p.count,g.start+g.count));for(let T=A,D=_;T<D;T+=3){let P=a.getX(T),C=a.getX(T+1),$=a.getX(T+2);s=$s(this,u,t,n,l,h,d,P,C,$),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),y=Math.min(a.count,g.start+g.count);for(let p=x,u=y;p<u;p+=3){let A=a.getX(p),_=a.getX(p+1),T=a.getX(p+2);s=$s(this,o,t,n,l,h,d,A,_,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,y=f.length;x<y;x++){let p=f[x],u=o[p.materialIndex],A=Math.max(p.start,g.start),_=Math.min(c.count,Math.min(p.start+p.count,g.start+g.count));for(let T=A,D=_;T<D;T+=3){let P=T,C=T+1,$=T+2;s=$s(this,u,t,n,l,h,d,P,C,$),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,g.start),y=Math.min(c.count,g.start+g.count);for(let p=x,u=y;p<u;p+=3){let A=p,_=p+1,T=p+2;s=$s(this,o,t,n,l,h,d,A,_,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function ru(i,t,e,n,s,r,o,a){let c;if(t.side===$e?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Mn,a),c===null)return null;Js.copy(a),Js.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Js);return l<e.near||l>e.far?null:{distance:l,point:Js.clone(),object:i}}function $s(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Li),i.getVertexPosition(c,Ai),i.getVertexPosition(l,Ri);let h=ru(i,t,e,n,Li,Ai,Ri,Zs);if(h){s&&(Xs.fromBufferAttribute(s,a),qs.fromBufferAttribute(s,c),Ys.fromBufferAttribute(s,l),h.uv=Di.getInterpolation(Zs,Li,Ai,Ri,Xs,qs,Ys,new xt)),r&&(Xs.fromBufferAttribute(r,a),qs.fromBufferAttribute(r,c),Ys.fromBufferAttribute(r,l),h.uv1=Di.getInterpolation(Zs,Li,Ai,Ri,Xs,qs,Ys,new xt),h.uv2=h.uv1),o&&(Ac.fromBufferAttribute(o,a),Rc.fromBufferAttribute(o,c),Cc.fromBufferAttribute(o,l),h.normal=Di.getInterpolation(Zs,Li,Ai,Ri,Ac,Rc,Cc,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new V,materialIndex:0};Di.getNormal(Li,Ai,Ri,d.normal),h.face=d}return h}var ms=class i extends nn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],f=0,g=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ye(l,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(d,2));function x(y,p,u,A,_,T,D,P,C,$,S){let w=T/C,K=D/$,Q=T/2,_t=D/2,N=P/2,X=C+1,j=$+1,J=0,B=0,st=new V;for(let lt=0;lt<j;lt++){let ut=lt*K-_t;for(let Mt=0;Mt<X;Mt++){let at=Mt*w-Q;st[y]=at*A,st[p]=ut*_,st[u]=N,l.push(st.x,st.y,st.z),st[y]=0,st[p]=0,st[u]=P>0?1:-1,h.push(st.x,st.y,st.z),d.push(Mt/C),d.push(1-lt/$),J+=1}}for(let lt=0;lt<$;lt++)for(let ut=0;ut<C;ut++){let Mt=f+ut+X*lt,at=f+ut+X*(lt+1),I=f+(ut+1)+X*(lt+1),R=f+(ut+1)+X*lt;c.push(Mt,at,R),c.push(at,I,R),B+=6}a.addGroup(g,B,S),g+=B,f+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Yi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function We(i){let t={};for(let e=0;e<i.length;e++){let n=Yi(i[e]);for(let s in n)t[s]=n[s]}return t}function au(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function El(i){return i.getRenderTarget()===null?i.outputColorSpace:le.workingColorSpace}var ou={clone:Yi,merge:We},cu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends Kn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cu,this.fragmentShader=lu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Yi(t.uniforms),this.uniformsGroups=au(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Er=class extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=Un}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ve=class extends Er{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Wi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(os*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wi*2*Math.atan(Math.tan(os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(os*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ci=-90,Pi=1,Ba=class extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ve(Ci,Pi,t,e);s.layers=this.layers,this.add(s);let r=new Ve(Ci,Pi,t,e);r.layers=this.layers,this.add(r);let o=new Ve(Ci,Pi,t,e);o.layers=this.layers,this.add(o);let a=new Ve(Ci,Pi,t,e);a.layers=this.layers,this.add(a);let c=new Ve(Ci,Pi,t,e);c.layers=this.layers,this.add(c);let l=new Ve(Ci,Pi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===fr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),g=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,f,g),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},wr=class extends cn{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Hi,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},za=class extends On{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(ls("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ci?Ee:on),this.texture=new wr(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ms(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:qn});r.uniforms.tEquirect.value=e;let o=new Fe(s,r),a=e.minFilter;return e.minFilter===fs&&(e.minFilter=rn),new Ba(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},xa=new V,hu=new V,uu=new Jt,In=class{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=xa.subVectors(n,e).cross(hu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(xa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||uu.getNormalMatrix(t),s=this.coplanarPoint(xa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ni=new Xi,Ks=new V,gs=class{constructor(t=new In,e=new In,n=new In,s=new In,r=new In,o=new In){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Un){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],f=s[7],g=s[8],x=s[9],y=s[10],p=s[11],u=s[12],A=s[13],_=s[14],T=s[15];if(n[0].setComponents(c-r,f-l,p-g,T-u).normalize(),n[1].setComponents(c+r,f+l,p+g,T+u).normalize(),n[2].setComponents(c+o,f+h,p+x,T+A).normalize(),n[3].setComponents(c-o,f-h,p-x,T-A).normalize(),n[4].setComponents(c-a,f-d,p-y,T-_).normalize(),e===Un)n[5].setComponents(c+a,f+d,p+y,T+_).normalize();else if(e===fr)n[5].setComponents(a,d,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ni.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ni.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ni)}intersectsSprite(t){return ni.center.set(0,0,0),ni.radius=.7071067811865476,ni.applyMatrix4(t.matrixWorld),this.intersectsSphere(ni)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Ks.x=s.normal.x>0?t.max.x:t.min.x,Ks.y=s.normal.y>0?t.max.y:t.min.y,Ks.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ks)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function wl(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function du(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let d=l.array,f=l.usage,g=d.byteLength,x=i.createBuffer();i.bindBuffer(h,x),i.bufferData(h,d,f),l.onUploadCallback();let y;if(d instanceof Float32Array)y=i.FLOAT;else if(d instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)y=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else y=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)y=i.SHORT;else if(d instanceof Uint32Array)y=i.UNSIGNED_INT;else if(d instanceof Int32Array)y=i.INT;else if(d instanceof Int8Array)y=i.BYTE;else if(d instanceof Uint8Array)y=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)y=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:x,type:y,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:g}}function r(l,h,d){let f=h.array,g=h._updateRange,x=h.updateRanges;if(i.bindBuffer(d,l),g.count===-1&&x.length===0&&i.bufferSubData(d,0,f),x.length!==0){for(let y=0,p=x.length;y<p;y++){let u=x[y];e?i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}g.count!==-1&&(e?i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f,g.offset,g.count):i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let d=n.get(l);if(d===void 0)n.set(l,s(l,h));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,l,h),d.version=l.version}}return{get:o,remove:a,update:c}}var Zi=class i extends nn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=t/a,f=e/c,g=[],x=[],y=[],p=[];for(let u=0;u<h;u++){let A=u*f-o;for(let _=0;_<l;_++){let T=_*d-r;x.push(T,-A,0),y.push(0,0,1),p.push(_/a),p.push(1-u/c)}}for(let u=0;u<c;u++)for(let A=0;A<a;A++){let _=A+l*u,T=A+l*(u+1),D=A+1+l*(u+1),P=A+1+l*u;g.push(_,T,P),g.push(T,D,P)}this.setIndex(g),this.setAttribute("position",new Ye(x,3)),this.setAttribute("normal",new Ye(y,3)),this.setAttribute("uv",new Ye(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},fu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pu=`#ifdef USE_ALPHAHASH
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
#endif`,mu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_u=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,xu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yu=`#ifdef USE_AOMAP
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
#endif`,vu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mu=`#ifdef USE_BATCHING
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
#endif`,Su=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,bu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Eu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tu=`#ifdef USE_IRIDESCENCE
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
#endif`,Lu=`#ifdef USE_BUMPMAP
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
#endif`,Au=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ru=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Iu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Uu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Du=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Nu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ou=`#define PI 3.141592653589793
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
} // validated`,Fu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bu=`vec3 transformedNormal = objectNormal;
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
#endif`,zu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ku=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wu=`
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
}`,Xu=`#ifdef USE_ENVMAP
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
#endif`,qu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yu=`#ifdef USE_ENVMAP
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
#endif`,Zu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ju=`#ifdef USE_ENVMAP
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
#endif`,$u=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ku=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ju=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,td=`#ifdef USE_GRADIENTMAP
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
}`,ed=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,nd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,id=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rd=`uniform bool receiveShadow;
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
#endif`,ad=`#ifdef USE_ENVMAP
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
#endif`,od=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ld=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ud=`PhysicalMaterial material;
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
#endif`,dd=`struct PhysicalMaterial {
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
}`,fd=`
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
#endif`,pd=`#if defined( RE_IndirectDiffuse )
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
#endif`,md=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_d=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,yd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,vd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bd=`#if defined( USE_POINTS_UV )
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
#endif`,Ed=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Td=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ld=`#ifdef USE_MORPHNORMALS
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
#endif`,Ad=`#ifdef USE_MORPHTARGETS
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
#endif`,Rd=`#ifdef USE_MORPHTARGETS
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
#endif`,Cd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Id=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ud=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Nd=`#ifdef USE_NORMALMAP
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
#endif`,Od=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$d=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Kd=`float getShadowMask() {
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
}`,jd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qd=`#ifdef USE_SKINNING
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
#endif`,tf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ef=`#ifdef USE_SKINNING
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
#endif`,nf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,af=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,of=`#ifdef USE_TRANSMISSION
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
#endif`,cf=`#ifdef USE_TRANSMISSION
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
#endif`,lf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,df=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ff=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pf=`uniform sampler2D t2D;
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
}`,mf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,_f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yf=`#include <common>
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
}`,vf=`#if DEPTH_PACKING == 3200
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
}`,Mf=`#define DISTANCE
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
}`,Sf=`#define DISTANCE
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
}`,bf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ef=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wf=`uniform float scale;
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
}`,Tf=`uniform vec3 diffuse;
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
}`,Lf=`#include <common>
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
}`,Af=`uniform vec3 diffuse;
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
}`,Rf=`#define LAMBERT
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
}`,Cf=`#define LAMBERT
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
}`,Pf=`#define MATCAP
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
}`,If=`#define MATCAP
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
}`,Uf=`#define NORMAL
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
}`,Df=`#define NORMAL
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
}`,Nf=`#define PHONG
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
}`,Of=`#define PHONG
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
}`,Ff=`#define STANDARD
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
}`,Bf=`#define STANDARD
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
}`,zf=`#define TOON
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
}`,kf=`#define TOON
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
}`,Hf=`uniform float size;
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
}`,Vf=`uniform vec3 diffuse;
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
}`,Gf=`#include <common>
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
}`,Wf=`uniform vec3 color;
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
}`,Xf=`uniform float rotation;
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
}`,qf=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:fu,alphahash_pars_fragment:pu,alphamap_fragment:mu,alphamap_pars_fragment:gu,alphatest_fragment:_u,alphatest_pars_fragment:xu,aomap_fragment:yu,aomap_pars_fragment:vu,batching_pars_vertex:Mu,batching_vertex:Su,begin_vertex:bu,beginnormal_vertex:Eu,bsdfs:wu,iridescence_fragment:Tu,bumpmap_pars_fragment:Lu,clipping_planes_fragment:Au,clipping_planes_pars_fragment:Ru,clipping_planes_pars_vertex:Cu,clipping_planes_vertex:Pu,color_fragment:Iu,color_pars_fragment:Uu,color_pars_vertex:Du,color_vertex:Nu,common:Ou,cube_uv_reflection_fragment:Fu,defaultnormal_vertex:Bu,displacementmap_pars_vertex:zu,displacementmap_vertex:ku,emissivemap_fragment:Hu,emissivemap_pars_fragment:Vu,colorspace_fragment:Gu,colorspace_pars_fragment:Wu,envmap_fragment:Xu,envmap_common_pars_fragment:qu,envmap_pars_fragment:Yu,envmap_pars_vertex:Zu,envmap_physical_pars_fragment:ad,envmap_vertex:Ju,fog_vertex:$u,fog_pars_vertex:Ku,fog_fragment:ju,fog_pars_fragment:Qu,gradientmap_pars_fragment:td,lightmap_fragment:ed,lightmap_pars_fragment:nd,lights_lambert_fragment:id,lights_lambert_pars_fragment:sd,lights_pars_begin:rd,lights_toon_fragment:od,lights_toon_pars_fragment:cd,lights_phong_fragment:ld,lights_phong_pars_fragment:hd,lights_physical_fragment:ud,lights_physical_pars_fragment:dd,lights_fragment_begin:fd,lights_fragment_maps:pd,lights_fragment_end:md,logdepthbuf_fragment:gd,logdepthbuf_pars_fragment:_d,logdepthbuf_pars_vertex:xd,logdepthbuf_vertex:yd,map_fragment:vd,map_pars_fragment:Md,map_particle_fragment:Sd,map_particle_pars_fragment:bd,metalnessmap_fragment:Ed,metalnessmap_pars_fragment:wd,morphcolor_vertex:Td,morphnormal_vertex:Ld,morphtarget_pars_vertex:Ad,morphtarget_vertex:Rd,normal_fragment_begin:Cd,normal_fragment_maps:Pd,normal_pars_fragment:Id,normal_pars_vertex:Ud,normal_vertex:Dd,normalmap_pars_fragment:Nd,clearcoat_normal_fragment_begin:Od,clearcoat_normal_fragment_maps:Fd,clearcoat_pars_fragment:Bd,iridescence_pars_fragment:zd,opaque_fragment:kd,packing:Hd,premultiplied_alpha_fragment:Vd,project_vertex:Gd,dithering_fragment:Wd,dithering_pars_fragment:Xd,roughnessmap_fragment:qd,roughnessmap_pars_fragment:Yd,shadowmap_pars_fragment:Zd,shadowmap_pars_vertex:Jd,shadowmap_vertex:$d,shadowmask_pars_fragment:Kd,skinbase_vertex:jd,skinning_pars_vertex:Qd,skinning_vertex:tf,skinnormal_vertex:ef,specularmap_fragment:nf,specularmap_pars_fragment:sf,tonemapping_fragment:rf,tonemapping_pars_fragment:af,transmission_fragment:of,transmission_pars_fragment:cf,uv_pars_fragment:lf,uv_pars_vertex:hf,uv_vertex:uf,worldpos_vertex:df,background_vert:ff,background_frag:pf,backgroundCube_vert:mf,backgroundCube_frag:gf,cube_vert:_f,cube_frag:xf,depth_vert:yf,depth_frag:vf,distanceRGBA_vert:Mf,distanceRGBA_frag:Sf,equirect_vert:bf,equirect_frag:Ef,linedashed_vert:wf,linedashed_frag:Tf,meshbasic_vert:Lf,meshbasic_frag:Af,meshlambert_vert:Rf,meshlambert_frag:Cf,meshmatcap_vert:Pf,meshmatcap_frag:If,meshnormal_vert:Uf,meshnormal_frag:Df,meshphong_vert:Nf,meshphong_frag:Of,meshphysical_vert:Ff,meshphysical_frag:Bf,meshtoon_vert:zf,meshtoon_frag:kf,points_vert:Hf,points_frag:Vf,shadow_vert:Gf,shadow_frag:Wf,sprite_vert:Xf,sprite_frag:qf},Tt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},vn={basic:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:We([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:We([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new $t(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:We([Tt.points,Tt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:We([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:We([Tt.common,Tt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:We([Tt.sprite,Tt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:We([Tt.common,Tt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:We([Tt.lights,Tt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};vn.physical={uniforms:We([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var js={r:0,b:0,g:0};function Yf(i,t,e,n,s,r,o){let a=new $t(0),c=r===!0?0:1,l,h,d=null,f=0,g=null;function x(p,u){let A=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?y(a,c):_&&_.isColor&&(y(_,1),A=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||A)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Hr)?(h===void 0&&(h=new Fe(new ms(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Yi(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=le.getTransfer(_.colorSpace)!==de,(d!==_||f!==_.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Fe(new Zi(2,2),new _n({name:"BackgroundMaterial",uniforms:Yi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,l.material.toneMapped=le.getTransfer(_.colorSpace)!==de,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||g!==i.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,g=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function y(p,u){p.getRGB(js,El(i)),n.buffers.color.setClear(js.r,js.g,js.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),c=u,y(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,y(a,c)},render:x}}function Zf(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null),l=c,h=!1;function d(N,X,j,J,B){let st=!1;if(o){let lt=y(J,j,X);l!==lt&&(l=lt,g(l.object)),st=u(N,J,j,B),st&&A(N,J,j,B)}else{let lt=X.wireframe===!0;(l.geometry!==J.id||l.program!==j.id||l.wireframe!==lt)&&(l.geometry=J.id,l.program=j.id,l.wireframe=lt,st=!0)}B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(st||h)&&(h=!1,$(N,X,j,J),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function g(N){return n.isWebGL2?i.bindVertexArray(N):r.bindVertexArrayOES(N)}function x(N){return n.isWebGL2?i.deleteVertexArray(N):r.deleteVertexArrayOES(N)}function y(N,X,j){let J=j.wireframe===!0,B=a[N.id];B===void 0&&(B={},a[N.id]=B);let st=B[X.id];st===void 0&&(st={},B[X.id]=st);let lt=st[J];return lt===void 0&&(lt=p(f()),st[J]=lt),lt}function p(N){let X=[],j=[],J=[];for(let B=0;B<s;B++)X[B]=0,j[B]=0,J[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:X,enabledAttributes:j,attributeDivisors:J,object:N,attributes:{},index:null}}function u(N,X,j,J){let B=l.attributes,st=X.attributes,lt=0,ut=j.getAttributes();for(let Mt in ut)if(ut[Mt].location>=0){let I=B[Mt],R=st[Mt];if(R===void 0&&(Mt==="instanceMatrix"&&N.instanceMatrix&&(R=N.instanceMatrix),Mt==="instanceColor"&&N.instanceColor&&(R=N.instanceColor)),I===void 0||I.attribute!==R||R&&I.data!==R.data)return!0;lt++}return l.attributesNum!==lt||l.index!==J}function A(N,X,j,J){let B={},st=X.attributes,lt=0,ut=j.getAttributes();for(let Mt in ut)if(ut[Mt].location>=0){let I=st[Mt];I===void 0&&(Mt==="instanceMatrix"&&N.instanceMatrix&&(I=N.instanceMatrix),Mt==="instanceColor"&&N.instanceColor&&(I=N.instanceColor));let R={};R.attribute=I,I&&I.data&&(R.data=I.data),B[Mt]=R,lt++}l.attributes=B,l.attributesNum=lt,l.index=J}function _(){let N=l.newAttributes;for(let X=0,j=N.length;X<j;X++)N[X]=0}function T(N){D(N,0)}function D(N,X){let j=l.newAttributes,J=l.enabledAttributes,B=l.attributeDivisors;j[N]=1,J[N]===0&&(i.enableVertexAttribArray(N),J[N]=1),B[N]!==X&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](N,X),B[N]=X)}function P(){let N=l.newAttributes,X=l.enabledAttributes;for(let j=0,J=X.length;j<J;j++)X[j]!==N[j]&&(i.disableVertexAttribArray(j),X[j]=0)}function C(N,X,j,J,B,st,lt){lt===!0?i.vertexAttribIPointer(N,X,j,B,st):i.vertexAttribPointer(N,X,j,J,B,st)}function $(N,X,j,J){if(n.isWebGL2===!1&&(N.isInstancedMesh||J.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let B=J.attributes,st=j.getAttributes(),lt=X.defaultAttributeValues;for(let ut in st){let Mt=st[ut];if(Mt.location>=0){let at=B[ut];if(at===void 0&&(ut==="instanceMatrix"&&N.instanceMatrix&&(at=N.instanceMatrix),ut==="instanceColor"&&N.instanceColor&&(at=N.instanceColor)),at!==void 0){let I=at.normalized,R=at.itemSize,E=e.get(at);if(E===void 0)continue;let M=E.buffer,tt=E.type,ft=E.bytesPerElement,H=n.isWebGL2===!0&&(tt===i.INT||tt===i.UNSIGNED_INT||at.gpuType===dl);if(at.isInterleavedBufferAttribute){let ot=at.data,L=ot.stride,nt=at.offset;if(ot.isInstancedInterleavedBuffer){for(let O=0;O<Mt.locationSize;O++)D(Mt.location+O,ot.meshPerAttribute);N.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let O=0;O<Mt.locationSize;O++)T(Mt.location+O);i.bindBuffer(i.ARRAY_BUFFER,M);for(let O=0;O<Mt.locationSize;O++)C(Mt.location+O,R/Mt.locationSize,tt,I,L*ft,(nt+R/Mt.locationSize*O)*ft,H)}else{if(at.isInstancedBufferAttribute){for(let ot=0;ot<Mt.locationSize;ot++)D(Mt.location+ot,at.meshPerAttribute);N.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let ot=0;ot<Mt.locationSize;ot++)T(Mt.location+ot);i.bindBuffer(i.ARRAY_BUFFER,M);for(let ot=0;ot<Mt.locationSize;ot++)C(Mt.location+ot,R/Mt.locationSize,tt,I,R*ft,R/Mt.locationSize*ot*ft,H)}}else if(lt!==void 0){let I=lt[ut];if(I!==void 0)switch(I.length){case 2:i.vertexAttrib2fv(Mt.location,I);break;case 3:i.vertexAttrib3fv(Mt.location,I);break;case 4:i.vertexAttrib4fv(Mt.location,I);break;default:i.vertexAttrib1fv(Mt.location,I)}}}}P()}function S(){Q();for(let N in a){let X=a[N];for(let j in X){let J=X[j];for(let B in J)x(J[B].object),delete J[B];delete X[j]}delete a[N]}}function w(N){if(a[N.id]===void 0)return;let X=a[N.id];for(let j in X){let J=X[j];for(let B in J)x(J[B].object),delete J[B];delete X[j]}delete a[N.id]}function K(N){for(let X in a){let j=a[X];if(j[N.id]===void 0)continue;let J=j[N.id];for(let B in J)x(J[B].object),delete J[B];delete j[N.id]}}function Q(){_t(),h=!0,l!==c&&(l=c,g(l.object))}function _t(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:Q,resetDefaultState:_t,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:K,initAttributes:_,enableAttribute:T,disableUnusedAttributes:P}}function Jf(i,t,e,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,d){i.drawArrays(r,h,d),e.update(d,r,1)}function c(h,d,f){if(f===0)return;let g,x;if(s)g=i,x="drawArraysInstanced";else if(g=t.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",g===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[x](r,h,d,f),e.update(d,r,f)}function l(h,d,f){if(f===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<f;x++)this.render(h[x],d[x]);else{g.multiDrawArraysWEBGL(r,h,0,d,0,f);let x=0;for(let y=0;y<f;y++)x+=d[y];e.update(x,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function $f(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),y=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,T=o||t.has("OES_texture_float"),D=_&&T,P=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:x,maxAttributes:y,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:A,vertexTextures:_,floatFragmentTextures:T,floatVertexTextures:D,maxSamples:P}}function Kf(i){let t=this,e=null,n=0,s=!1,r=!1,o=new In,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let g=d.length!==0||f||n!==0||s;return s=f,n=d.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,g){let x=d.clippingPlanes,y=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||x===null||x.length===0||r&&!p)r?h(null):l();else{let A=r?0:n,_=A*4,T=u.clippingState||null;c.value=T,T=h(x,f,_,g);for(let D=0;D!==_;++D)T[D]=e[D];u.clippingState=T,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,g,x){let y=d!==null?d.length:0,p=null;if(y!==0){if(p=c.value,x!==!0||p===null){let u=g+y*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,T=g;_!==y;++_,T+=4)o.copy(d[_]).applyMatrix4(A,a),o.normal.toArray(p,T),p[T+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,p}}function jf(i){let t=new WeakMap;function e(o,a){return a===Ca?o.mapping=Hi:a===Pa&&(o.mapping=Vi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ca||a===Pa)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new za(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Tr=class extends Er{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ni=4,Pc=[.125,.215,.35,.446,.526,.582],ri=20,ya=new Tr,Ic=new $t,va=null,Ma=0,Sa=0,ii=(1+Math.sqrt(5))/2,Ii=1/ii,Uc=[new V(1,1,1),new V(-1,1,1),new V(1,1,-1),new V(-1,1,-1),new V(0,ii,Ii),new V(0,ii,-Ii),new V(Ii,0,ii),new V(-Ii,0,ii),new V(ii,Ii,0),new V(-ii,Ii,0)],Ji=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){va=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(va,Ma,Sa),t.scissorTest=!1,Qs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Hi||t.mapping===Vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),va=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:ps,format:gn,colorSpace:Nn,depthBuffer:!1},s=Dc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dc(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Qf(r)),this._blurMaterial=tp(r,t,e)}return s}_compileMaterial(t){let e=new Fe(this._lodPlanes[0],t);this._renderer.compile(e,ya)}_sceneToCubeUV(t,e,n,s){let a=new Ve(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Ic),h.toneMapping=Yn,h.autoClear=!1;let g=new qi({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),x=new Fe(new ms,g),y=!1,p=t.background;p?p.isColor&&(g.color.copy(p),t.background=null,y=!0):(g.color.copy(Ic),y=!0);for(let u=0;u<6;u++){let A=u%3;A===0?(a.up.set(0,c[u],0),a.lookAt(l[u],0,0)):A===1?(a.up.set(0,0,c[u]),a.lookAt(0,l[u],0)):(a.up.set(0,c[u],0),a.lookAt(0,0,l[u]));let _=this._cubeSize;Qs(s,A*_,u>2?_:0,_,_),h.setRenderTarget(s),y&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Hi||t.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nc());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;Qs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ya)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Uc[(s-1)%Uc.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Fe(this._lodPlanes[s],l),f=l.uniforms,g=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*ri-1),y=r/x,p=isFinite(r)?1+Math.floor(h*y):ri;p>ri&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ri}`);let u=[],A=0;for(let C=0;C<ri;++C){let $=C/y,S=Math.exp(-$*$/2);u.push(S),C===0?A+=S:C<p&&(A+=2*S)}for(let C=0;C<u.length;C++)u[C]=u[C]/A;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=x,f.mipInt.value=_-n;let T=this._sizeLods[s],D=3*T*(s>_-Ni?s-_+Ni:0),P=4*(this._cubeSize-T);Qs(e,D,P,3*T,2*T),c.setRenderTarget(e),c.render(d,ya)}};function Qf(i){let t=[],e=[],n=[],s=i,r=i-Ni+1+Pc.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ni?c=Pc[o-i+Ni-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,x=6,y=3,p=2,u=1,A=new Float32Array(y*x*g),_=new Float32Array(p*x*g),T=new Float32Array(u*x*g);for(let P=0;P<g;P++){let C=P%3*2/3-1,$=P>2?0:-1,S=[C,$,0,C+2/3,$,0,C+2/3,$+1,0,C,$,0,C+2/3,$+1,0,C,$+1,0];A.set(S,y*x*P),_.set(f,p*x*P);let w=[P,P,P,P,P,P];T.set(w,u*x*P)}let D=new nn;D.setAttribute("position",new qe(A,y)),D.setAttribute("uv",new qe(_,p)),D.setAttribute("faceIndex",new qe(T,u)),t.push(D),s>Ni&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Dc(i,t,e){let n=new On(i,t,e);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Qs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function tp(i,t,e){let n=new Float32Array(ri),s=new V(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:To(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Nc(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:To(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Oc(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:To(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function To(){return`

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
	`}function ep(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===Ca||c===Pa,h=c===Hi||c===Vi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new Ji(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(l&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new Ji(i));let f=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function np(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ip(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let x in f.attributes)t.remove(f.attributes[x]);for(let x in f.morphAttributes){let y=f.morphAttributes[x];for(let p=0,u=y.length;p<u;p++)t.remove(y[p])}f.removeEventListener("dispose",o),delete s[f.id];let g=r.get(f);g&&(t.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(d){let f=d.attributes;for(let x in f)t.update(f[x],i.ARRAY_BUFFER);let g=d.morphAttributes;for(let x in g){let y=g[x];for(let p=0,u=y.length;p<u;p++)t.update(y[p],i.ARRAY_BUFFER)}}function l(d){let f=[],g=d.index,x=d.attributes.position,y=0;if(g!==null){let A=g.array;y=g.version;for(let _=0,T=A.length;_<T;_+=3){let D=A[_+0],P=A[_+1],C=A[_+2];f.push(D,P,P,C,C,D)}}else if(x!==void 0){let A=x.array;y=x.version;for(let _=0,T=A.length/3-1;_<T;_+=3){let D=_+0,P=_+1,C=_+2;f.push(D,P,P,C,C,D)}}else return;let p=new(Sl(f)?br:Sr)(f,1);p.version=y;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let g=d.index;g!==null&&f.version<g.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function sp(i,t,e,n){let s=n.isWebGL2,r;function o(g){r=g}let a,c;function l(g){a=g.type,c=g.bytesPerElement}function h(g,x){i.drawElements(r,x,a,g*c),e.update(x,r,1)}function d(g,x,y){if(y===0)return;let p,u;if(s)p=i,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,x,a,g*c,y),e.update(x,r,y)}function f(g,x,y){if(y===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<y;u++)this.render(g[u]/c,x[u]);else{p.multiDrawElementsWEBGL(r,x,0,a,g,0,y);let u=0;for(let A=0;A<y;A++)u+=x[A];e.update(u,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function rp(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ap(i,t){return i[0]-t[0]}function op(i,t){return Math.abs(t[1])-Math.abs(i[1])}function cp(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Ue,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,d){let f=l.morphTargetInfluences;if(t.isWebGL2===!0){let g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=g!==void 0?g.length:0,y=r.get(h);if(y===void 0||y.count!==x){let N=function(){Q.dispose(),r.delete(h),h.removeEventListener("dispose",N)};y!==void 0&&y.texture.dispose();let A=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,T=h.morphAttributes.color!==void 0,D=h.morphAttributes.position||[],P=h.morphAttributes.normal||[],C=h.morphAttributes.color||[],$=0;A===!0&&($=1),_===!0&&($=2),T===!0&&($=3);let S=h.attributes.position.count*$,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);let K=new Float32Array(S*w*4*x),Q=new xr(K,S,w,x);Q.type=Xn,Q.needsUpdate=!0;let _t=$*4;for(let X=0;X<x;X++){let j=D[X],J=P[X],B=C[X],st=S*w*4*X;for(let lt=0;lt<j.count;lt++){let ut=lt*_t;A===!0&&(o.fromBufferAttribute(j,lt),K[st+ut+0]=o.x,K[st+ut+1]=o.y,K[st+ut+2]=o.z,K[st+ut+3]=0),_===!0&&(o.fromBufferAttribute(J,lt),K[st+ut+4]=o.x,K[st+ut+5]=o.y,K[st+ut+6]=o.z,K[st+ut+7]=0),T===!0&&(o.fromBufferAttribute(B,lt),K[st+ut+8]=o.x,K[st+ut+9]=o.y,K[st+ut+10]=o.z,K[st+ut+11]=B.itemSize===4?o.w:1)}}y={count:x,texture:Q,size:new xt(S,w)},r.set(h,y),h.addEventListener("dispose",N)}let p=0;for(let A=0;A<f.length;A++)p+=f[A];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",y.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",y.size)}else{let g=f===void 0?0:f.length,x=n[h.id];if(x===void 0||x.length!==g){x=[];for(let _=0;_<g;_++)x[_]=[_,0];n[h.id]=x}for(let _=0;_<g;_++){let T=x[_];T[0]=_,T[1]=f[_]}x.sort(op);for(let _=0;_<8;_++)_<g&&x[_][1]?(a[_][0]=x[_][0],a[_][1]=x[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(ap);let y=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let T=a[_],D=T[0],P=T[1];D!==Number.MAX_SAFE_INTEGER&&P?(y&&h.getAttribute("morphTarget"+_)!==y[D]&&h.setAttribute("morphTarget"+_,y[D]),p&&h.getAttribute("morphNormal"+_)!==p[D]&&h.setAttribute("morphNormal"+_,p[D]),s[_]=P,u+=P):(y&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let A=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",A),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function lp(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Lr=class extends cn{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:oi,h!==oi&&h!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===oi&&(n=Wn),n===void 0&&h===Gi&&(n=ai),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Xe,this.minFilter=c!==void 0?c:Xe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Tl=new cn,Ll=new Lr(1,1);Ll.compareFunction=Ml;var Al=new xr,Rl=new Fa,Cl=new wr,Fc=[],Bc=[],zc=new Float32Array(16),kc=new Float32Array(9),Hc=new Float32Array(4);function ji(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Fc[s];if(r===void 0&&(r=new Float32Array(s),Fc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Te(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Gr(i,t){let e=Bc[t];e===void 0&&(e=new Int32Array(t),Bc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function hp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function up(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Te(e,t)}}function dp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Te(e,t)}}function fp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Te(e,t)}}function pp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(we(e,n))return;Hc.set(n),i.uniformMatrix2fv(this.addr,!1,Hc),Te(e,n)}}function mp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(we(e,n))return;kc.set(n),i.uniformMatrix3fv(this.addr,!1,kc),Te(e,n)}}function gp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(we(e,n))return;zc.set(n),i.uniformMatrix4fv(this.addr,!1,zc),Te(e,n)}}function _p(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function xp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Te(e,t)}}function yp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Te(e,t)}}function vp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Te(e,t)}}function Mp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Sp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Te(e,t)}}function bp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Te(e,t)}}function Ep(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Te(e,t)}}function wp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Ll:Tl;e.setTexture2D(t||r,s)}function Tp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Rl,s)}function Lp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Cl,s)}function Ap(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Al,s)}function Rp(i){switch(i){case 5126:return hp;case 35664:return up;case 35665:return dp;case 35666:return fp;case 35674:return pp;case 35675:return mp;case 35676:return gp;case 5124:case 35670:return _p;case 35667:case 35671:return xp;case 35668:case 35672:return yp;case 35669:case 35673:return vp;case 5125:return Mp;case 36294:return Sp;case 36295:return bp;case 36296:return Ep;case 35678:case 36198:case 36298:case 36306:case 35682:return wp;case 35679:case 36299:case 36307:return Tp;case 35680:case 36300:case 36308:case 36293:return Lp;case 36289:case 36303:case 36311:case 36292:return Ap}}function Cp(i,t){i.uniform1fv(this.addr,t)}function Pp(i,t){let e=ji(t,this.size,2);i.uniform2fv(this.addr,e)}function Ip(i,t){let e=ji(t,this.size,3);i.uniform3fv(this.addr,e)}function Up(i,t){let e=ji(t,this.size,4);i.uniform4fv(this.addr,e)}function Dp(i,t){let e=ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Np(i,t){let e=ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Op(i,t){let e=ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Fp(i,t){i.uniform1iv(this.addr,t)}function Bp(i,t){i.uniform2iv(this.addr,t)}function zp(i,t){i.uniform3iv(this.addr,t)}function kp(i,t){i.uniform4iv(this.addr,t)}function Hp(i,t){i.uniform1uiv(this.addr,t)}function Vp(i,t){i.uniform2uiv(this.addr,t)}function Gp(i,t){i.uniform3uiv(this.addr,t)}function Wp(i,t){i.uniform4uiv(this.addr,t)}function Xp(i,t,e){let n=this.cache,s=t.length,r=Gr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Tl,r[o])}function qp(i,t,e){let n=this.cache,s=t.length,r=Gr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Rl,r[o])}function Yp(i,t,e){let n=this.cache,s=t.length,r=Gr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Cl,r[o])}function Zp(i,t,e){let n=this.cache,s=t.length,r=Gr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Al,r[o])}function Jp(i){switch(i){case 5126:return Cp;case 35664:return Pp;case 35665:return Ip;case 35666:return Up;case 35674:return Dp;case 35675:return Np;case 35676:return Op;case 5124:case 35670:return Fp;case 35667:case 35671:return Bp;case 35668:case 35672:return zp;case 35669:case 35673:return kp;case 5125:return Hp;case 36294:return Vp;case 36295:return Gp;case 36296:return Wp;case 35678:case 36198:case 36298:case 36306:case 35682:return Xp;case 35679:case 36299:case 36307:return qp;case 35680:case 36300:case 36308:case 36293:return Yp;case 36289:case 36303:case 36311:case 36292:return Zp}}var ka=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Rp(e.type)}},Ha=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Jp(e.type)}},Va=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},ba=/(\w+)(\])?(\[|\.)?/g;function Vc(i,t){i.seq.push(t),i.map[t.id]=t}function $p(i,t,e){let n=i.name,s=n.length;for(ba.lastIndex=0;;){let r=ba.exec(n),o=ba.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Vc(e,l===void 0?new ka(a,i,t):new Ha(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Va(a),Vc(e,d)),e=d}}}var ki=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);$p(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Gc(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Kp=37297,jp=0;function Qp(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function tm(i){let t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(i),n;switch(t===e?n="":t===dr&&e===ur?n="LinearDisplayP3ToLinearSRGB":t===ur&&e===dr&&(n="LinearSRGBToLinearDisplayP3"),i){case Nn:case Vr:return[n,"LinearTransferOETF"];case Ee:case Eo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Wc(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Qp(i.getShaderSource(t),o)}else return s}function em(i,t){let e=tm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function nm(i,t){let e;switch(t){case oh:e="Linear";break;case ch:e="Reinhard";break;case lh:e="OptimizedCineon";break;case So:e="ACESFilmic";break;case uh:e="AgX";break;case hh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function im(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Oi).join(`
`)}function sm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Oi).join(`
`)}function rm(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function am(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Oi(i){return i!==""}function Xc(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var om=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ga(i){return i.replace(om,lm)}var cm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function lm(i,t){let e=jt[t];if(e===void 0){let n=cm.get(t);if(n!==void 0)e=jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ga(e)}var hm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yc(i){return i.replace(hm,um)}function um(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function dm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ll?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Mo?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Pn&&(t="SHADOWMAP_TYPE_VSM"),t}function fm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Vi:t="ENVMAP_TYPE_CUBE";break;case Hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Vi:t="ENVMAP_MODE_REFRACTION";break}return t}function mm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case hl:t="ENVMAP_BLENDING_MULTIPLY";break;case rh:t="ENVMAP_BLENDING_MIX";break;case ah:t="ENVMAP_BLENDING_ADD";break}return t}function gm(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function _m(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=dm(e),l=fm(e),h=pm(e),d=mm(e),f=gm(e),g=e.isWebGL2?"":im(e),x=sm(e),y=rm(r),p=s.createProgram(),u,A,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Oi).join(`
`),u.length>0&&(u+=`
`),A=[g,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Oi).join(`
`),A.length>0&&(A+=`
`)):(u=[Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oi).join(`
`),A=[g,Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?jt.tonemapping_pars_fragment:"",e.toneMapping!==Yn?nm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,em("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Oi).join(`
`)),o=Ga(o),o=Xc(o,e),o=qc(o,e),a=Ga(a),a=Xc(a,e),a=qc(a,e),o=Yc(o),a=Yc(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,u=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,A=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);let T=_+u+o,D=_+A+a,P=Gc(s,s.VERTEX_SHADER,T),C=Gc(s,s.FRAGMENT_SHADER,D);s.attachShader(p,P),s.attachShader(p,C),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function $(Q){if(i.debug.checkShaderErrors){let _t=s.getProgramInfoLog(p).trim(),N=s.getShaderInfoLog(P).trim(),X=s.getShaderInfoLog(C).trim(),j=!0,J=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,P,C);else{let B=Wc(s,P,"vertex"),st=Wc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+_t+`
`+B+`
`+st)}else _t!==""?console.warn("THREE.WebGLProgram: Program Info Log:",_t):(N===""||X==="")&&(J=!1);J&&(Q.diagnostics={runnable:j,programLog:_t,vertexShader:{log:N,prefix:u},fragmentShader:{log:X,prefix:A}})}s.deleteShader(P),s.deleteShader(C),S=new ki(s,p),w=am(s,p)}let S;this.getUniforms=function(){return S===void 0&&$(this),S};let w;this.getAttributes=function(){return w===void 0&&$(this),w};let K=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return K===!1&&(K=s.getProgramParameter(p,Kp)),K},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=P,this.fragmentShader=C,this}var xm=0,Wa=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xa(t),e.set(t,n)),n}},Xa=class{constructor(t){this.id=xm++,this.code=t,this.usedTimes=0}};function ym(i,t,e,n,s,r,o){let a=new Mr,c=new Wa,l=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,g=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(S){return S===0?"uv":`uv${S}`}function p(S,w,K,Q,_t){let N=Q.fog,X=_t.geometry,j=S.isMeshStandardMaterial?Q.environment:null,J=(S.isMeshStandardMaterial?e:t).get(S.envMap||j),B=J&&J.mapping===Hr?J.image.height:null,st=x[S.type];S.precision!==null&&(g=s.getMaxPrecision(S.precision),g!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));let lt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ut=lt!==void 0?lt.length:0,Mt=0;X.morphAttributes.position!==void 0&&(Mt=1),X.morphAttributes.normal!==void 0&&(Mt=2),X.morphAttributes.color!==void 0&&(Mt=3);let at,I,R,E;if(st){let De=vn[st];at=De.vertexShader,I=De.fragmentShader}else at=S.vertexShader,I=S.fragmentShader,c.update(S),R=c.getVertexShaderID(S),E=c.getFragmentShaderID(S);let M=i.getRenderTarget(),tt=_t.isInstancedMesh===!0,ft=_t.isBatchedMesh===!0,H=!!S.map,ot=!!S.matcap,L=!!J,nt=!!S.aoMap,O=!!S.lightMap,q=!!S.bumpMap,W=!!S.normalMap,pt=!!S.displacementMap,U=!!S.emissiveMap,m=!!S.metalnessMap,v=!!S.roughnessMap,z=S.anisotropy>0,mt=S.clearcoat>0,gt=S.iridescence>0,dt=S.sheen>0,It=S.transmission>0,St=z&&!!S.anisotropyMap,Ut=mt&&!!S.clearcoatMap,zt=mt&&!!S.clearcoatNormalMap,kt=mt&&!!S.clearcoatRoughnessMap,yt=gt&&!!S.iridescenceMap,ie=gt&&!!S.iridescenceThicknessMap,Kt=dt&&!!S.sheenColorMap,Ft=dt&&!!S.sheenRoughnessMap,Lt=!!S.specularMap,Dt=!!S.specularColorMap,Wt=!!S.specularIntensityMap,re=It&&!!S.transmissionMap,fe=It&&!!S.thicknessMap,ee=!!S.gradientMap,bt=!!S.alphaMap,F=S.alphaTest>0,At=!!S.alphaHash,Rt=!!S.extensions,Gt=!!X.attributes.uv1,Ht=!!X.attributes.uv2,ae=!!X.attributes.uv3,oe=Yn;return S.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(oe=i.toneMapping),{isWebGL2:h,shaderID:st,shaderType:S.type,shaderName:S.name,vertexShader:at,fragmentShader:I,defines:S.defines,customVertexShaderID:R,customFragmentShaderID:E,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:ft,instancing:tt,instancingColor:tt&&_t.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:M===null?i.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Nn,map:H,matcap:ot,envMap:L,envMapMode:L&&J.mapping,envMapCubeUVHeight:B,aoMap:nt,lightMap:O,bumpMap:q,normalMap:W,displacementMap:f&&pt,emissiveMap:U,normalMapObjectSpace:W&&S.normalMapType===bh,normalMapTangentSpace:W&&S.normalMapType===vl,metalnessMap:m,roughnessMap:v,anisotropy:z,anisotropyMap:St,clearcoat:mt,clearcoatMap:Ut,clearcoatNormalMap:zt,clearcoatRoughnessMap:kt,iridescence:gt,iridescenceMap:yt,iridescenceThicknessMap:ie,sheen:dt,sheenColorMap:Kt,sheenRoughnessMap:Ft,specularMap:Lt,specularColorMap:Dt,specularIntensityMap:Wt,transmission:It,transmissionMap:re,thicknessMap:fe,gradientMap:ee,opaque:S.transparent===!1&&S.blending===Bi,alphaMap:bt,alphaTest:F,alphaHash:At,combine:S.combine,mapUv:H&&y(S.map.channel),aoMapUv:nt&&y(S.aoMap.channel),lightMapUv:O&&y(S.lightMap.channel),bumpMapUv:q&&y(S.bumpMap.channel),normalMapUv:W&&y(S.normalMap.channel),displacementMapUv:pt&&y(S.displacementMap.channel),emissiveMapUv:U&&y(S.emissiveMap.channel),metalnessMapUv:m&&y(S.metalnessMap.channel),roughnessMapUv:v&&y(S.roughnessMap.channel),anisotropyMapUv:St&&y(S.anisotropyMap.channel),clearcoatMapUv:Ut&&y(S.clearcoatMap.channel),clearcoatNormalMapUv:zt&&y(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&y(S.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&y(S.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&y(S.iridescenceThicknessMap.channel),sheenColorMapUv:Kt&&y(S.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&y(S.sheenRoughnessMap.channel),specularMapUv:Lt&&y(S.specularMap.channel),specularColorMapUv:Dt&&y(S.specularColorMap.channel),specularIntensityMapUv:Wt&&y(S.specularIntensityMap.channel),transmissionMapUv:re&&y(S.transmissionMap.channel),thicknessMapUv:fe&&y(S.thicknessMap.channel),alphaMapUv:bt&&y(S.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(W||z),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,vertexUv1s:Gt,vertexUv2s:Ht,vertexUv3s:ae,pointsUvs:_t.isPoints===!0&&!!X.attributes.uv&&(H||bt),fog:!!N,useFog:S.fog===!0,fogExp2:N&&N.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:_t.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:Mt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&K.length>0,shadowMapType:i.shadowMap.type,toneMapping:oe,useLegacyLights:i._useLegacyLights,decodeVideoTexture:H&&S.map.isVideoTexture===!0&&le.getTransfer(S.map.colorSpace)===de,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===an,flipSided:S.side===$e,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:Rt&&S.extensions.derivatives===!0,extensionFragDepth:Rt&&S.extensions.fragDepth===!0,extensionDrawBuffers:Rt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:Rt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Rt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function u(S){let w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(let K in S.defines)w.push(K),w.push(S.defines[K]);return S.isRawShaderMaterial===!1&&(A(w,S),_(w,S),w.push(i.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function A(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function _(S,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),S.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function T(S){let w=x[S.type],K;if(w){let Q=vn[w];K=ou.clone(Q.uniforms)}else K=S.uniforms;return K}function D(S,w){let K;for(let Q=0,_t=l.length;Q<_t;Q++){let N=l[Q];if(N.cacheKey===w){K=N,++K.usedTimes;break}}return K===void 0&&(K=new _m(i,w,S,r),l.push(K)),K}function P(S){if(--S.usedTimes===0){let w=l.indexOf(S);l[w]=l[l.length-1],l.pop(),S.destroy()}}function C(S){c.remove(S)}function $(){c.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:T,acquireProgram:D,releaseProgram:P,releaseShaderCache:C,programs:l,dispose:$}}function vm(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Mm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Jc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function $c(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,g,x,y,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:g,groupOrder:x,renderOrder:d.renderOrder,z:y,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=g,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=y,u.group=p),t++,u}function a(d,f,g,x,y,p){let u=o(d,f,g,x,y,p);g.transmission>0?n.push(u):g.transparent===!0?s.push(u):e.push(u)}function c(d,f,g,x,y,p){let u=o(d,f,g,x,y,p);g.transmission>0?n.unshift(u):g.transparent===!0?s.unshift(u):e.unshift(u)}function l(d,f){e.length>1&&e.sort(d||Mm),n.length>1&&n.sort(f||Jc),s.length>1&&s.sort(f||Jc)}function h(){for(let d=t,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Sm(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new $c,i.set(n,[o])):s>=r.length?(o=new $c,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function bm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new $t};break;case"SpotLight":e={position:new V,direction:new V,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new V,halfWidth:new V,halfHeight:new V};break}return i[t.id]=e,e}}}function Em(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var wm=0;function Tm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Lm(i,t){let e=new bm,n=Em(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new V);let r=new V,o=new be,a=new be;function c(h,d){let f=0,g=0,x=0;for(let Q=0;Q<9;Q++)s.probe[Q].set(0,0,0);let y=0,p=0,u=0,A=0,_=0,T=0,D=0,P=0,C=0,$=0,S=0;h.sort(Tm);let w=d===!0?Math.PI:1;for(let Q=0,_t=h.length;Q<_t;Q++){let N=h[Q],X=N.color,j=N.intensity,J=N.distance,B=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)f+=X.r*j*w,g+=X.g*j*w,x+=X.b*j*w;else if(N.isLightProbe){for(let st=0;st<9;st++)s.probe[st].addScaledVector(N.sh.coefficients[st],j);S++}else if(N.isDirectionalLight){let st=e.get(N);if(st.color.copy(N.color).multiplyScalar(N.intensity*w),N.castShadow){let lt=N.shadow,ut=n.get(N);ut.shadowBias=lt.bias,ut.shadowNormalBias=lt.normalBias,ut.shadowRadius=lt.radius,ut.shadowMapSize=lt.mapSize,s.directionalShadow[y]=ut,s.directionalShadowMap[y]=B,s.directionalShadowMatrix[y]=N.shadow.matrix,T++}s.directional[y]=st,y++}else if(N.isSpotLight){let st=e.get(N);st.position.setFromMatrixPosition(N.matrixWorld),st.color.copy(X).multiplyScalar(j*w),st.distance=J,st.coneCos=Math.cos(N.angle),st.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),st.decay=N.decay,s.spot[u]=st;let lt=N.shadow;if(N.map&&(s.spotLightMap[C]=N.map,C++,lt.updateMatrices(N),N.castShadow&&$++),s.spotLightMatrix[u]=lt.matrix,N.castShadow){let ut=n.get(N);ut.shadowBias=lt.bias,ut.shadowNormalBias=lt.normalBias,ut.shadowRadius=lt.radius,ut.shadowMapSize=lt.mapSize,s.spotShadow[u]=ut,s.spotShadowMap[u]=B,P++}u++}else if(N.isRectAreaLight){let st=e.get(N);st.color.copy(X).multiplyScalar(j),st.halfWidth.set(N.width*.5,0,0),st.halfHeight.set(0,N.height*.5,0),s.rectArea[A]=st,A++}else if(N.isPointLight){let st=e.get(N);if(st.color.copy(N.color).multiplyScalar(N.intensity*w),st.distance=N.distance,st.decay=N.decay,N.castShadow){let lt=N.shadow,ut=n.get(N);ut.shadowBias=lt.bias,ut.shadowNormalBias=lt.normalBias,ut.shadowRadius=lt.radius,ut.shadowMapSize=lt.mapSize,ut.shadowCameraNear=lt.camera.near,ut.shadowCameraFar=lt.camera.far,s.pointShadow[p]=ut,s.pointShadowMap[p]=B,s.pointShadowMatrix[p]=N.shadow.matrix,D++}s.point[p]=st,p++}else if(N.isHemisphereLight){let st=e.get(N);st.skyColor.copy(N.color).multiplyScalar(j*w),st.groundColor.copy(N.groundColor).multiplyScalar(j*w),s.hemi[_]=st,_++}}A>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=g,s.ambient[2]=x;let K=s.hash;(K.directionalLength!==y||K.pointLength!==p||K.spotLength!==u||K.rectAreaLength!==A||K.hemiLength!==_||K.numDirectionalShadows!==T||K.numPointShadows!==D||K.numSpotShadows!==P||K.numSpotMaps!==C||K.numLightProbes!==S)&&(s.directional.length=y,s.spot.length=u,s.rectArea.length=A,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=T,s.directionalShadowMap.length=T,s.pointShadow.length=D,s.pointShadowMap.length=D,s.spotShadow.length=P,s.spotShadowMap.length=P,s.directionalShadowMatrix.length=T,s.pointShadowMatrix.length=D,s.spotLightMatrix.length=P+C-$,s.spotLightMap.length=C,s.numSpotLightShadowsWithMaps=$,s.numLightProbes=S,K.directionalLength=y,K.pointLength=p,K.spotLength=u,K.rectAreaLength=A,K.hemiLength=_,K.numDirectionalShadows=T,K.numPointShadows=D,K.numSpotShadows=P,K.numSpotMaps=C,K.numLightProbes=S,s.version=wm++)}function l(h,d){let f=0,g=0,x=0,y=0,p=0,u=d.matrixWorldInverse;for(let A=0,_=h.length;A<_;A++){let T=h[A];if(T.isDirectionalLight){let D=s.directional[f];D.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(r),D.direction.transformDirection(u),f++}else if(T.isSpotLight){let D=s.spot[x];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),D.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(r),D.direction.transformDirection(u),x++}else if(T.isRectAreaLight){let D=s.rectArea[y];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),a.identity(),o.copy(T.matrixWorld),o.premultiply(u),a.extractRotation(o),D.halfWidth.set(T.width*.5,0,0),D.halfHeight.set(0,T.height*.5,0),D.halfWidth.applyMatrix4(a),D.halfHeight.applyMatrix4(a),y++}else if(T.isPointLight){let D=s.point[g];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),g++}else if(T.isHemisphereLight){let D=s.hemi[p];D.direction.setFromMatrixPosition(T.matrixWorld),D.direction.transformDirection(u),p++}}}return{setup:c,setupView:l,state:s}}function Kc(i,t){let e=new Lm(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){e.setup(n,d)}function l(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Am(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),c;return a===void 0?(c=new Kc(i,t),e.set(r,[c])):o>=a.length?(c=new Kc(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var qa=class extends Kn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ya=class extends Kn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Rm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Cm=`uniform sampler2D shadow_pass;
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
}`;function Pm(i,t,e){let n=new gs,s=new xt,r=new xt,o=new Ue,a=new qa({depthPacking:Sh}),c=new Ya,l={},h=e.maxTextureSize,d={[Mn]:$e,[$e]:Mn,[an]:an},f=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:Rm,fragmentShader:Cm}),g=f.clone();g.defines.HORIZONTAL_PASS=1;let x=new nn;x.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Fe(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ll;let u=this.type;this.render=function(P,C,$){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||P.length===0)return;let S=i.getRenderTarget(),w=i.getActiveCubeFace(),K=i.getActiveMipmapLevel(),Q=i.state;Q.setBlending(qn),Q.buffers.color.setClear(1,1,1,1),Q.buffers.depth.setTest(!0),Q.setScissorTest(!1);let _t=u!==Pn&&this.type===Pn,N=u===Pn&&this.type!==Pn;for(let X=0,j=P.length;X<j;X++){let J=P[X],B=J.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);let st=B.getFrameExtents();if(s.multiply(st),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,B.mapSize.y=r.y)),B.map===null||_t===!0||N===!0){let ut=this.type!==Pn?{minFilter:Xe,magFilter:Xe}:{};B.map!==null&&B.map.dispose(),B.map=new On(s.x,s.y,ut),B.map.texture.name=J.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();let lt=B.getViewportCount();for(let ut=0;ut<lt;ut++){let Mt=B.getViewport(ut);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),Q.viewport(o),B.updateMatrices(J,ut),n=B.getFrustum(),T(C,$,B.camera,J,this.type)}B.isPointLightShadow!==!0&&this.type===Pn&&A(B,$),B.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(S,w,K)};function A(P,C){let $=t.update(y);f.defines.VSM_SAMPLES!==P.blurSamples&&(f.defines.VSM_SAMPLES=P.blurSamples,g.defines.VSM_SAMPLES=P.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=P.map.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(C,null,$,f,y,null),g.uniforms.shadow_pass.value=P.mapPass.texture,g.uniforms.resolution.value=P.mapSize,g.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(C,null,$,g,y,null)}function _(P,C,$,S){let w=null,K=$.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(K!==void 0)w=K;else if(w=$.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let Q=w.uuid,_t=C.uuid,N=l[Q];N===void 0&&(N={},l[Q]=N);let X=N[_t];X===void 0&&(X=w.clone(),N[_t]=X,C.addEventListener("dispose",D)),w=X}if(w.visible=C.visible,w.wireframe=C.wireframe,S===Pn?w.side=C.shadowSide!==null?C.shadowSide:C.side:w.side=C.shadowSide!==null?C.shadowSide:d[C.side],w.alphaMap=C.alphaMap,w.alphaTest=C.alphaTest,w.map=C.map,w.clipShadows=C.clipShadows,w.clippingPlanes=C.clippingPlanes,w.clipIntersection=C.clipIntersection,w.displacementMap=C.displacementMap,w.displacementScale=C.displacementScale,w.displacementBias=C.displacementBias,w.wireframeLinewidth=C.wireframeLinewidth,w.linewidth=C.linewidth,$.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let Q=i.properties.get(w);Q.light=$}return w}function T(P,C,$,S,w){if(P.visible===!1)return;if(P.layers.test(C.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&w===Pn)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,P.matrixWorld);let _t=t.update(P),N=P.material;if(Array.isArray(N)){let X=_t.groups;for(let j=0,J=X.length;j<J;j++){let B=X[j],st=N[B.materialIndex];if(st&&st.visible){let lt=_(P,st,S,w);P.onBeforeShadow(i,P,C,$,_t,lt,B),i.renderBufferDirect($,null,_t,lt,P,B),P.onAfterShadow(i,P,C,$,_t,lt,B)}}}else if(N.visible){let X=_(P,N,S,w);P.onBeforeShadow(i,P,C,$,_t,X,null),i.renderBufferDirect($,null,_t,X,P,null),P.onAfterShadow(i,P,C,$,_t,X,null)}}let Q=P.children;for(let _t=0,N=Q.length;_t<N;_t++)T(Q[_t],C,$,S,w)}function D(P){P.target.removeEventListener("dispose",D);for(let $ in l){let S=l[$],w=P.target.uuid;w in S&&(S[w].dispose(),delete S[w])}}}function Im(i,t,e){let n=e.isWebGL2;function s(){let F=!1,At=new Ue,Rt=null,Gt=new Ue(0,0,0,0);return{setMask:function(Ht){Rt!==Ht&&!F&&(i.colorMask(Ht,Ht,Ht,Ht),Rt=Ht)},setLocked:function(Ht){F=Ht},setClear:function(Ht,ae,oe,ve,De){De===!0&&(Ht*=ve,ae*=ve,oe*=ve),At.set(Ht,ae,oe,ve),Gt.equals(At)===!1&&(i.clearColor(Ht,ae,oe,ve),Gt.copy(At))},reset:function(){F=!1,Rt=null,Gt.set(-1,0,0,0)}}}function r(){let F=!1,At=null,Rt=null,Gt=null;return{setTest:function(Ht){Ht?ft(i.DEPTH_TEST):H(i.DEPTH_TEST)},setMask:function(Ht){At!==Ht&&!F&&(i.depthMask(Ht),At=Ht)},setFunc:function(Ht){if(Rt!==Ht){switch(Ht){case jl:i.depthFunc(i.NEVER);break;case Ql:i.depthFunc(i.ALWAYS);break;case th:i.depthFunc(i.LESS);break;case or:i.depthFunc(i.LEQUAL);break;case eh:i.depthFunc(i.EQUAL);break;case nh:i.depthFunc(i.GEQUAL);break;case ih:i.depthFunc(i.GREATER);break;case sh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Rt=Ht}},setLocked:function(Ht){F=Ht},setClear:function(Ht){Gt!==Ht&&(i.clearDepth(Ht),Gt=Ht)},reset:function(){F=!1,At=null,Rt=null,Gt=null}}}function o(){let F=!1,At=null,Rt=null,Gt=null,Ht=null,ae=null,oe=null,ve=null,De=null;return{setTest:function(ce){F||(ce?ft(i.STENCIL_TEST):H(i.STENCIL_TEST))},setMask:function(ce){At!==ce&&!F&&(i.stencilMask(ce),At=ce)},setFunc:function(ce,Le,Ke){(Rt!==ce||Gt!==Le||Ht!==Ke)&&(i.stencilFunc(ce,Le,Ke),Rt=ce,Gt=Le,Ht=Ke)},setOp:function(ce,Le,Ke){(ae!==ce||oe!==Le||ve!==Ke)&&(i.stencilOp(ce,Le,Ke),ae=ce,oe=Le,ve=Ke)},setLocked:function(ce){F=ce},setClear:function(ce){De!==ce&&(i.clearStencil(ce),De=ce)},reset:function(){F=!1,At=null,Rt=null,Gt=null,Ht=null,ae=null,oe=null,ve=null,De=null}}}let a=new s,c=new r,l=new o,h=new WeakMap,d=new WeakMap,f={},g={},x=new WeakMap,y=[],p=null,u=!1,A=null,_=null,T=null,D=null,P=null,C=null,$=null,S=new $t(0,0,0),w=0,K=!1,Q=null,_t=null,N=null,X=null,j=null,J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,st=0,lt=i.getParameter(i.VERSION);lt.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(lt)[1]),B=st>=1):lt.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(lt)[1]),B=st>=2);let ut=null,Mt={},at=i.getParameter(i.SCISSOR_BOX),I=i.getParameter(i.VIEWPORT),R=new Ue().fromArray(at),E=new Ue().fromArray(I);function M(F,At,Rt,Gt){let Ht=new Uint8Array(4),ae=i.createTexture();i.bindTexture(F,ae),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let oe=0;oe<Rt;oe++)n&&(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)?i.texImage3D(At,0,i.RGBA,1,1,Gt,0,i.RGBA,i.UNSIGNED_BYTE,Ht):i.texImage2D(At+oe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ht);return ae}let tt={};tt[i.TEXTURE_2D]=M(i.TEXTURE_2D,i.TEXTURE_2D,1),tt[i.TEXTURE_CUBE_MAP]=M(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(tt[i.TEXTURE_2D_ARRAY]=M(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),tt[i.TEXTURE_3D]=M(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),ft(i.DEPTH_TEST),c.setFunc(or),U(!1),m(Po),ft(i.CULL_FACE),W(qn);function ft(F){f[F]!==!0&&(i.enable(F),f[F]=!0)}function H(F){f[F]!==!1&&(i.disable(F),f[F]=!1)}function ot(F,At){return g[F]!==At?(i.bindFramebuffer(F,At),g[F]=At,n&&(F===i.DRAW_FRAMEBUFFER&&(g[i.FRAMEBUFFER]=At),F===i.FRAMEBUFFER&&(g[i.DRAW_FRAMEBUFFER]=At)),!0):!1}function L(F,At){let Rt=y,Gt=!1;if(F)if(Rt=x.get(At),Rt===void 0&&(Rt=[],x.set(At,Rt)),F.isWebGLMultipleRenderTargets){let Ht=F.texture;if(Rt.length!==Ht.length||Rt[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,oe=Ht.length;ae<oe;ae++)Rt[ae]=i.COLOR_ATTACHMENT0+ae;Rt.length=Ht.length,Gt=!0}}else Rt[0]!==i.COLOR_ATTACHMENT0&&(Rt[0]=i.COLOR_ATTACHMENT0,Gt=!0);else Rt[0]!==i.BACK&&(Rt[0]=i.BACK,Gt=!0);Gt&&(e.isWebGL2?i.drawBuffers(Rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Rt))}function nt(F){return p!==F?(i.useProgram(F),p=F,!0):!1}let O={[si]:i.FUNC_ADD,[Fl]:i.FUNC_SUBTRACT,[Bl]:i.FUNC_REVERSE_SUBTRACT};if(n)O[Do]=i.MIN,O[No]=i.MAX;else{let F=t.get("EXT_blend_minmax");F!==null&&(O[Do]=F.MIN_EXT,O[No]=F.MAX_EXT)}let q={[zl]:i.ZERO,[kl]:i.ONE,[Hl]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[Yl]:i.SRC_ALPHA_SATURATE,[Xl]:i.DST_COLOR,[Gl]:i.DST_ALPHA,[Vl]:i.ONE_MINUS_SRC_COLOR,[Ra]:i.ONE_MINUS_SRC_ALPHA,[ql]:i.ONE_MINUS_DST_COLOR,[Wl]:i.ONE_MINUS_DST_ALPHA,[Zl]:i.CONSTANT_COLOR,[Jl]:i.ONE_MINUS_CONSTANT_COLOR,[$l]:i.CONSTANT_ALPHA,[Kl]:i.ONE_MINUS_CONSTANT_ALPHA};function W(F,At,Rt,Gt,Ht,ae,oe,ve,De,ce){if(F===qn){u===!0&&(H(i.BLEND),u=!1);return}if(u===!1&&(ft(i.BLEND),u=!0),F!==Ol){if(F!==A||ce!==K){if((_!==si||P!==si)&&(i.blendEquation(i.FUNC_ADD),_=si,P=si),ce)switch(F){case Bi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ar:i.blendFunc(i.ONE,i.ONE);break;case Io:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Uo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ar:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Io:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Uo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}T=null,D=null,C=null,$=null,S.set(0,0,0),w=0,A=F,K=ce}return}Ht=Ht||At,ae=ae||Rt,oe=oe||Gt,(At!==_||Ht!==P)&&(i.blendEquationSeparate(O[At],O[Ht]),_=At,P=Ht),(Rt!==T||Gt!==D||ae!==C||oe!==$)&&(i.blendFuncSeparate(q[Rt],q[Gt],q[ae],q[oe]),T=Rt,D=Gt,C=ae,$=oe),(ve.equals(S)===!1||De!==w)&&(i.blendColor(ve.r,ve.g,ve.b,De),S.copy(ve),w=De),A=F,K=!1}function pt(F,At){F.side===an?H(i.CULL_FACE):ft(i.CULL_FACE);let Rt=F.side===$e;At&&(Rt=!Rt),U(Rt),F.blending===Bi&&F.transparent===!1?W(qn):W(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),c.setFunc(F.depthFunc),c.setTest(F.depthTest),c.setMask(F.depthWrite),a.setMask(F.colorWrite);let Gt=F.stencilWrite;l.setTest(Gt),Gt&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),z(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ft(i.SAMPLE_ALPHA_TO_COVERAGE):H(i.SAMPLE_ALPHA_TO_COVERAGE)}function U(F){Q!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),Q=F)}function m(F){F!==Dl?(ft(i.CULL_FACE),F!==_t&&(F===Po?i.cullFace(i.BACK):F===Nl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):H(i.CULL_FACE),_t=F}function v(F){F!==N&&(B&&i.lineWidth(F),N=F)}function z(F,At,Rt){F?(ft(i.POLYGON_OFFSET_FILL),(X!==At||j!==Rt)&&(i.polygonOffset(At,Rt),X=At,j=Rt)):H(i.POLYGON_OFFSET_FILL)}function mt(F){F?ft(i.SCISSOR_TEST):H(i.SCISSOR_TEST)}function gt(F){F===void 0&&(F=i.TEXTURE0+J-1),ut!==F&&(i.activeTexture(F),ut=F)}function dt(F,At,Rt){Rt===void 0&&(ut===null?Rt=i.TEXTURE0+J-1:Rt=ut);let Gt=Mt[Rt];Gt===void 0&&(Gt={type:void 0,texture:void 0},Mt[Rt]=Gt),(Gt.type!==F||Gt.texture!==At)&&(ut!==Rt&&(i.activeTexture(Rt),ut=Rt),i.bindTexture(F,At||tt[F]),Gt.type=F,Gt.texture=At)}function It(){let F=Mt[ut];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function St(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ut(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function kt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function yt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ie(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Kt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ft(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Lt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Wt(F){R.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),R.copy(F))}function re(F){E.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),E.copy(F))}function fe(F,At){let Rt=d.get(At);Rt===void 0&&(Rt=new WeakMap,d.set(At,Rt));let Gt=Rt.get(F);Gt===void 0&&(Gt=i.getUniformBlockIndex(At,F.name),Rt.set(F,Gt))}function ee(F,At){let Gt=d.get(At).get(F);h.get(At)!==Gt&&(i.uniformBlockBinding(At,Gt,F.__bindingPointIndex),h.set(At,Gt))}function bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ut=null,Mt={},g={},x=new WeakMap,y=[],p=null,u=!1,A=null,_=null,T=null,D=null,P=null,C=null,$=null,S=new $t(0,0,0),w=0,K=!1,Q=null,_t=null,N=null,X=null,j=null,R.set(0,0,i.canvas.width,i.canvas.height),E.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:ft,disable:H,bindFramebuffer:ot,drawBuffers:L,useProgram:nt,setBlending:W,setMaterial:pt,setFlipSided:U,setCullFace:m,setLineWidth:v,setPolygonOffset:z,setScissorTest:mt,activeTexture:gt,bindTexture:dt,unbindTexture:It,compressedTexImage2D:St,compressedTexImage3D:Ut,texImage2D:Lt,texImage3D:Dt,updateUBOMapping:fe,uniformBlockBinding:ee,texStorage2D:Kt,texStorage3D:Ft,texSubImage2D:zt,texSubImage3D:kt,compressedTexSubImage2D:yt,compressedTexSubImage3D:ie,scissor:Wt,viewport:re,reset:bt}}function Um(i,t,e,n,s,r,o){let a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(m,v){return g?new OffscreenCanvas(m,v):mr("canvas")}function y(m,v,z,mt){let gt=1;if((m.width>mt||m.height>mt)&&(gt=mt/Math.max(m.width,m.height)),gt<1||v===!0)if(typeof HTMLImageElement<"u"&&m instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&m instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&m instanceof ImageBitmap){let dt=v?pr:Math.floor,It=dt(gt*m.width),St=dt(gt*m.height);d===void 0&&(d=x(It,St));let Ut=z?x(It,St):d;return Ut.width=It,Ut.height=St,Ut.getContext("2d").drawImage(m,0,0,It,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+m.width+"x"+m.height+") to ("+It+"x"+St+")."),Ut}else return"data"in m&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+m.width+"x"+m.height+")."),m;return m}function p(m){return Na(m.width)&&Na(m.height)}function u(m){return a?!1:m.wrapS!==mn||m.wrapT!==mn||m.minFilter!==Xe&&m.minFilter!==rn}function A(m,v){return m.generateMipmaps&&v&&m.minFilter!==Xe&&m.minFilter!==rn}function _(m){i.generateMipmap(m)}function T(m,v,z,mt,gt=!1){if(a===!1)return v;if(m!==null){if(i[m]!==void 0)return i[m];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+m+"'")}let dt=v;if(v===i.RED&&(z===i.FLOAT&&(dt=i.R32F),z===i.HALF_FLOAT&&(dt=i.R16F),z===i.UNSIGNED_BYTE&&(dt=i.R8)),v===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(dt=i.R8UI),z===i.UNSIGNED_SHORT&&(dt=i.R16UI),z===i.UNSIGNED_INT&&(dt=i.R32UI),z===i.BYTE&&(dt=i.R8I),z===i.SHORT&&(dt=i.R16I),z===i.INT&&(dt=i.R32I)),v===i.RG&&(z===i.FLOAT&&(dt=i.RG32F),z===i.HALF_FLOAT&&(dt=i.RG16F),z===i.UNSIGNED_BYTE&&(dt=i.RG8)),v===i.RGBA){let It=gt?hr:le.getTransfer(mt);z===i.FLOAT&&(dt=i.RGBA32F),z===i.HALF_FLOAT&&(dt=i.RGBA16F),z===i.UNSIGNED_BYTE&&(dt=It===de?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(dt=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(dt=i.RGB5_A1)}return(dt===i.R16F||dt===i.R32F||dt===i.RG16F||dt===i.RG32F||dt===i.RGBA16F||dt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function D(m,v,z){return A(m,z)===!0||m.isFramebufferTexture&&m.minFilter!==Xe&&m.minFilter!==rn?Math.log2(Math.max(v.width,v.height))+1:m.mipmaps!==void 0&&m.mipmaps.length>0?m.mipmaps.length:m.isCompressedTexture&&Array.isArray(m.image)?v.mipmaps.length:1}function P(m){return m===Xe||m===Oo||m===Jr?i.NEAREST:i.LINEAR}function C(m){let v=m.target;v.removeEventListener("dispose",C),S(v),v.isVideoTexture&&h.delete(v)}function $(m){let v=m.target;v.removeEventListener("dispose",$),K(v)}function S(m){let v=n.get(m);if(v.__webglInit===void 0)return;let z=m.source,mt=f.get(z);if(mt){let gt=mt[v.__cacheKey];gt.usedTimes--,gt.usedTimes===0&&w(m),Object.keys(mt).length===0&&f.delete(z)}n.remove(m)}function w(m){let v=n.get(m);i.deleteTexture(v.__webglTexture);let z=m.source,mt=f.get(z);delete mt[v.__cacheKey],o.memory.textures--}function K(m){let v=m.texture,z=n.get(m),mt=n.get(v);if(mt.__webglTexture!==void 0&&(i.deleteTexture(mt.__webglTexture),o.memory.textures--),m.depthTexture&&m.depthTexture.dispose(),m.isWebGLCubeRenderTarget)for(let gt=0;gt<6;gt++){if(Array.isArray(z.__webglFramebuffer[gt]))for(let dt=0;dt<z.__webglFramebuffer[gt].length;dt++)i.deleteFramebuffer(z.__webglFramebuffer[gt][dt]);else i.deleteFramebuffer(z.__webglFramebuffer[gt]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[gt])}else{if(Array.isArray(z.__webglFramebuffer))for(let gt=0;gt<z.__webglFramebuffer.length;gt++)i.deleteFramebuffer(z.__webglFramebuffer[gt]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let gt=0;gt<z.__webglColorRenderbuffer.length;gt++)z.__webglColorRenderbuffer[gt]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[gt]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(m.isWebGLMultipleRenderTargets)for(let gt=0,dt=v.length;gt<dt;gt++){let It=n.get(v[gt]);It.__webglTexture&&(i.deleteTexture(It.__webglTexture),o.memory.textures--),n.remove(v[gt])}n.remove(v),n.remove(m)}let Q=0;function _t(){Q=0}function N(){let m=Q;return m>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+m+" texture units while this GPU supports only "+s.maxTextures),Q+=1,m}function X(m){let v=[];return v.push(m.wrapS),v.push(m.wrapT),v.push(m.wrapR||0),v.push(m.magFilter),v.push(m.minFilter),v.push(m.anisotropy),v.push(m.internalFormat),v.push(m.format),v.push(m.type),v.push(m.generateMipmaps),v.push(m.premultiplyAlpha),v.push(m.flipY),v.push(m.unpackAlignment),v.push(m.colorSpace),v.join()}function j(m,v){let z=n.get(m);if(m.isVideoTexture&&pt(m),m.isRenderTargetTexture===!1&&m.version>0&&z.__version!==m.version){let mt=m.image;if(mt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(mt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{R(z,m,v);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+v)}function J(m,v){let z=n.get(m);if(m.version>0&&z.__version!==m.version){R(z,m,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+v)}function B(m,v){let z=n.get(m);if(m.version>0&&z.__version!==m.version){R(z,m,v);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+v)}function st(m,v){let z=n.get(m);if(m.version>0&&z.__version!==m.version){E(z,m,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+v)}let lt={[Ia]:i.REPEAT,[mn]:i.CLAMP_TO_EDGE,[Ua]:i.MIRRORED_REPEAT},ut={[Xe]:i.NEAREST,[Oo]:i.NEAREST_MIPMAP_NEAREST,[Jr]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[dh]:i.LINEAR_MIPMAP_NEAREST,[fs]:i.LINEAR_MIPMAP_LINEAR},Mt={[Eh]:i.NEVER,[Ch]:i.ALWAYS,[wh]:i.LESS,[Ml]:i.LEQUAL,[Th]:i.EQUAL,[Rh]:i.GEQUAL,[Lh]:i.GREATER,[Ah]:i.NOTEQUAL};function at(m,v,z){if(z?(i.texParameteri(m,i.TEXTURE_WRAP_S,lt[v.wrapS]),i.texParameteri(m,i.TEXTURE_WRAP_T,lt[v.wrapT]),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,lt[v.wrapR]),i.texParameteri(m,i.TEXTURE_MAG_FILTER,ut[v.magFilter]),i.texParameteri(m,i.TEXTURE_MIN_FILTER,ut[v.minFilter])):(i.texParameteri(m,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(m,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(m===i.TEXTURE_3D||m===i.TEXTURE_2D_ARRAY)&&i.texParameteri(m,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(v.wrapS!==mn||v.wrapT!==mn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(m,i.TEXTURE_MAG_FILTER,P(v.magFilter)),i.texParameteri(m,i.TEXTURE_MIN_FILTER,P(v.minFilter)),v.minFilter!==Xe&&v.minFilter!==rn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(i.texParameteri(m,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(m,i.TEXTURE_COMPARE_FUNC,Mt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let mt=t.get("EXT_texture_filter_anisotropic");if(v.magFilter===Xe||v.minFilter!==Jr&&v.minFilter!==fs||v.type===Xn&&t.has("OES_texture_float_linear")===!1||a===!1&&v.type===ps&&t.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(i.texParameterf(m,mt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function I(m,v){let z=!1;m.__webglInit===void 0&&(m.__webglInit=!0,v.addEventListener("dispose",C));let mt=v.source,gt=f.get(mt);gt===void 0&&(gt={},f.set(mt,gt));let dt=X(v);if(dt!==m.__cacheKey){gt[dt]===void 0&&(gt[dt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),gt[dt].usedTimes++;let It=gt[m.__cacheKey];It!==void 0&&(gt[m.__cacheKey].usedTimes--,It.usedTimes===0&&w(v)),m.__cacheKey=dt,m.__webglTexture=gt[dt].texture}return z}function R(m,v,z){let mt=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(mt=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(mt=i.TEXTURE_3D);let gt=I(m,v),dt=v.source;e.bindTexture(mt,m.__webglTexture,i.TEXTURE0+z);let It=n.get(dt);if(dt.version!==It.__version||gt===!0){e.activeTexture(i.TEXTURE0+z);let St=le.getPrimaries(le.workingColorSpace),Ut=v.colorSpace===on?null:le.getPrimaries(v.colorSpace),zt=v.colorSpace===on||St===Ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let kt=u(v)&&p(v.image)===!1,yt=y(v.image,kt,!1,s.maxTextureSize);yt=U(v,yt);let ie=p(yt)||a,Kt=r.convert(v.format,v.colorSpace),Ft=r.convert(v.type),Lt=T(v.internalFormat,Kt,Ft,v.colorSpace,v.isVideoTexture);at(mt,v,ie);let Dt,Wt=v.mipmaps,re=a&&v.isVideoTexture!==!0&&Lt!==xl,fe=It.__version===void 0||gt===!0,ee=D(v,yt,ie);if(v.isDepthTexture)Lt=i.DEPTH_COMPONENT,a?v.type===Xn?Lt=i.DEPTH_COMPONENT32F:v.type===Wn?Lt=i.DEPTH_COMPONENT24:v.type===ai?Lt=i.DEPTH24_STENCIL8:Lt=i.DEPTH_COMPONENT16:v.type===Xn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===oi&&Lt===i.DEPTH_COMPONENT&&v.type!==bo&&v.type!==Wn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Wn,Ft=r.convert(v.type)),v.format===Gi&&Lt===i.DEPTH_COMPONENT&&(Lt=i.DEPTH_STENCIL,v.type!==ai&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=ai,Ft=r.convert(v.type))),fe&&(re?e.texStorage2D(i.TEXTURE_2D,1,Lt,yt.width,yt.height):e.texImage2D(i.TEXTURE_2D,0,Lt,yt.width,yt.height,0,Kt,Ft,null));else if(v.isDataTexture)if(Wt.length>0&&ie){re&&fe&&e.texStorage2D(i.TEXTURE_2D,ee,Lt,Wt[0].width,Wt[0].height);for(let bt=0,F=Wt.length;bt<F;bt++)Dt=Wt[bt],re?e.texSubImage2D(i.TEXTURE_2D,bt,0,0,Dt.width,Dt.height,Kt,Ft,Dt.data):e.texImage2D(i.TEXTURE_2D,bt,Lt,Dt.width,Dt.height,0,Kt,Ft,Dt.data);v.generateMipmaps=!1}else re?(fe&&e.texStorage2D(i.TEXTURE_2D,ee,Lt,yt.width,yt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt.width,yt.height,Kt,Ft,yt.data)):e.texImage2D(i.TEXTURE_2D,0,Lt,yt.width,yt.height,0,Kt,Ft,yt.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){re&&fe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,Lt,Wt[0].width,Wt[0].height,yt.depth);for(let bt=0,F=Wt.length;bt<F;bt++)Dt=Wt[bt],v.format!==gn?Kt!==null?re?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,bt,0,0,0,Dt.width,Dt.height,yt.depth,Kt,Dt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,bt,Lt,Dt.width,Dt.height,yt.depth,0,Dt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage3D(i.TEXTURE_2D_ARRAY,bt,0,0,0,Dt.width,Dt.height,yt.depth,Kt,Ft,Dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,bt,Lt,Dt.width,Dt.height,yt.depth,0,Kt,Ft,Dt.data)}else{re&&fe&&e.texStorage2D(i.TEXTURE_2D,ee,Lt,Wt[0].width,Wt[0].height);for(let bt=0,F=Wt.length;bt<F;bt++)Dt=Wt[bt],v.format!==gn?Kt!==null?re?e.compressedTexSubImage2D(i.TEXTURE_2D,bt,0,0,Dt.width,Dt.height,Kt,Dt.data):e.compressedTexImage2D(i.TEXTURE_2D,bt,Lt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?e.texSubImage2D(i.TEXTURE_2D,bt,0,0,Dt.width,Dt.height,Kt,Ft,Dt.data):e.texImage2D(i.TEXTURE_2D,bt,Lt,Dt.width,Dt.height,0,Kt,Ft,Dt.data)}else if(v.isDataArrayTexture)re?(fe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,Lt,yt.width,yt.height,yt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,yt.width,yt.height,yt.depth,Kt,Ft,yt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Lt,yt.width,yt.height,yt.depth,0,Kt,Ft,yt.data);else if(v.isData3DTexture)re?(fe&&e.texStorage3D(i.TEXTURE_3D,ee,Lt,yt.width,yt.height,yt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,yt.width,yt.height,yt.depth,Kt,Ft,yt.data)):e.texImage3D(i.TEXTURE_3D,0,Lt,yt.width,yt.height,yt.depth,0,Kt,Ft,yt.data);else if(v.isFramebufferTexture){if(fe)if(re)e.texStorage2D(i.TEXTURE_2D,ee,Lt,yt.width,yt.height);else{let bt=yt.width,F=yt.height;for(let At=0;At<ee;At++)e.texImage2D(i.TEXTURE_2D,At,Lt,bt,F,0,Kt,Ft,null),bt>>=1,F>>=1}}else if(Wt.length>0&&ie){re&&fe&&e.texStorage2D(i.TEXTURE_2D,ee,Lt,Wt[0].width,Wt[0].height);for(let bt=0,F=Wt.length;bt<F;bt++)Dt=Wt[bt],re?e.texSubImage2D(i.TEXTURE_2D,bt,0,0,Kt,Ft,Dt):e.texImage2D(i.TEXTURE_2D,bt,Lt,Kt,Ft,Dt);v.generateMipmaps=!1}else re?(fe&&e.texStorage2D(i.TEXTURE_2D,ee,Lt,yt.width,yt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Kt,Ft,yt)):e.texImage2D(i.TEXTURE_2D,0,Lt,Kt,Ft,yt);A(v,ie)&&_(mt),It.__version=dt.version,v.onUpdate&&v.onUpdate(v)}m.__version=v.version}function E(m,v,z){if(v.image.length!==6)return;let mt=I(m,v),gt=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,m.__webglTexture,i.TEXTURE0+z);let dt=n.get(gt);if(gt.version!==dt.__version||mt===!0){e.activeTexture(i.TEXTURE0+z);let It=le.getPrimaries(le.workingColorSpace),St=v.colorSpace===on?null:le.getPrimaries(v.colorSpace),Ut=v.colorSpace===on||It===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let zt=v.isCompressedTexture||v.image[0].isCompressedTexture,kt=v.image[0]&&v.image[0].isDataTexture,yt=[];for(let bt=0;bt<6;bt++)!zt&&!kt?yt[bt]=y(v.image[bt],!1,!0,s.maxCubemapSize):yt[bt]=kt?v.image[bt].image:v.image[bt],yt[bt]=U(v,yt[bt]);let ie=yt[0],Kt=p(ie)||a,Ft=r.convert(v.format,v.colorSpace),Lt=r.convert(v.type),Dt=T(v.internalFormat,Ft,Lt,v.colorSpace),Wt=a&&v.isVideoTexture!==!0,re=dt.__version===void 0||mt===!0,fe=D(v,ie,Kt);at(i.TEXTURE_CUBE_MAP,v,Kt);let ee;if(zt){Wt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Dt,ie.width,ie.height);for(let bt=0;bt<6;bt++){ee=yt[bt].mipmaps;for(let F=0;F<ee.length;F++){let At=ee[F];v.format!==gn?Ft!==null?Wt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F,0,0,At.width,At.height,Ft,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F,Dt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Wt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F,0,0,At.width,At.height,Ft,Lt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F,Dt,At.width,At.height,0,Ft,Lt,At.data)}}}else{ee=v.mipmaps,Wt&&re&&(ee.length>0&&fe++,e.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Dt,yt[0].width,yt[0].height));for(let bt=0;bt<6;bt++)if(kt){Wt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,yt[bt].width,yt[bt].height,Ft,Lt,yt[bt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,Dt,yt[bt].width,yt[bt].height,0,Ft,Lt,yt[bt].data);for(let F=0;F<ee.length;F++){let Rt=ee[F].image[bt].image;Wt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F+1,0,0,Rt.width,Rt.height,Ft,Lt,Rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F+1,Dt,Rt.width,Rt.height,0,Ft,Lt,Rt.data)}}else{Wt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,Ft,Lt,yt[bt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,Dt,Ft,Lt,yt[bt]);for(let F=0;F<ee.length;F++){let At=ee[F];Wt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F+1,0,0,Ft,Lt,At.image[bt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,F+1,Dt,Ft,Lt,At.image[bt])}}}A(v,Kt)&&_(i.TEXTURE_CUBE_MAP),dt.__version=gt.version,v.onUpdate&&v.onUpdate(v)}m.__version=v.version}function M(m,v,z,mt,gt,dt){let It=r.convert(z.format,z.colorSpace),St=r.convert(z.type),Ut=T(z.internalFormat,It,St,z.colorSpace);if(!n.get(v).__hasExternalTextures){let kt=Math.max(1,v.width>>dt),yt=Math.max(1,v.height>>dt);gt===i.TEXTURE_3D||gt===i.TEXTURE_2D_ARRAY?e.texImage3D(gt,dt,Ut,kt,yt,v.depth,0,It,St,null):e.texImage2D(gt,dt,Ut,kt,yt,0,It,St,null)}e.bindFramebuffer(i.FRAMEBUFFER,m),W(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,mt,gt,n.get(z).__webglTexture,0,q(v)):(gt===i.TEXTURE_2D||gt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&gt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,mt,gt,n.get(z).__webglTexture,dt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function tt(m,v,z){if(i.bindRenderbuffer(i.RENDERBUFFER,m),v.depthBuffer&&!v.stencilBuffer){let mt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||W(v)){let gt=v.depthTexture;gt&&gt.isDepthTexture&&(gt.type===Xn?mt=i.DEPTH_COMPONENT32F:gt.type===Wn&&(mt=i.DEPTH_COMPONENT24));let dt=q(v);W(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,mt,v.width,v.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,mt,v.width,v.height)}else i.renderbufferStorage(i.RENDERBUFFER,mt,v.width,v.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,m)}else if(v.depthBuffer&&v.stencilBuffer){let mt=q(v);z&&W(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,i.DEPTH24_STENCIL8,v.width,v.height):W(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt,i.DEPTH24_STENCIL8,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,m)}else{let mt=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let gt=0;gt<mt.length;gt++){let dt=mt[gt],It=r.convert(dt.format,dt.colorSpace),St=r.convert(dt.type),Ut=T(dt.internalFormat,It,St,dt.colorSpace),zt=q(v);z&&W(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,Ut,v.width,v.height):W(v)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,Ut,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Ut,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ft(m,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,m),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),j(v.depthTexture,0);let mt=n.get(v.depthTexture).__webglTexture,gt=q(v);if(v.depthTexture.format===oi)W(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,mt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,mt,0);else if(v.depthTexture.format===Gi)W(v)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,mt,0,gt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,mt,0);else throw new Error("Unknown depthTexture format")}function H(m){let v=n.get(m),z=m.isWebGLCubeRenderTarget===!0;if(m.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");ft(v.__webglFramebuffer,m)}else if(z){v.__webglDepthbuffer=[];for(let mt=0;mt<6;mt++)e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[mt]),v.__webglDepthbuffer[mt]=i.createRenderbuffer(),tt(v.__webglDepthbuffer[mt],m,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=i.createRenderbuffer(),tt(v.__webglDepthbuffer,m,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(m,v,z){let mt=n.get(m);v!==void 0&&M(mt.__webglFramebuffer,m,m.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&H(m)}function L(m){let v=m.texture,z=n.get(m),mt=n.get(v);m.addEventListener("dispose",$),m.isWebGLMultipleRenderTargets!==!0&&(mt.__webglTexture===void 0&&(mt.__webglTexture=i.createTexture()),mt.__version=v.version,o.memory.textures++);let gt=m.isWebGLCubeRenderTarget===!0,dt=m.isWebGLMultipleRenderTargets===!0,It=p(m)||a;if(gt){z.__webglFramebuffer=[];for(let St=0;St<6;St++)if(a&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[St]=[];for(let Ut=0;Ut<v.mipmaps.length;Ut++)z.__webglFramebuffer[St][Ut]=i.createFramebuffer()}else z.__webglFramebuffer[St]=i.createFramebuffer()}else{if(a&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let St=0;St<v.mipmaps.length;St++)z.__webglFramebuffer[St]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(dt)if(s.drawBuffers){let St=m.texture;for(let Ut=0,zt=St.length;Ut<zt;Ut++){let kt=n.get(St[Ut]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&m.samples>0&&W(m)===!1){let St=dt?v:[v];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Ut=0;Ut<St.length;Ut++){let zt=St[Ut];z.__webglColorRenderbuffer[Ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[Ut]);let kt=r.convert(zt.format,zt.colorSpace),yt=r.convert(zt.type),ie=T(zt.internalFormat,kt,yt,zt.colorSpace,m.isXRRenderTarget===!0),Kt=q(m);i.renderbufferStorageMultisample(i.RENDERBUFFER,Kt,ie,m.width,m.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,z.__webglColorRenderbuffer[Ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),m.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),tt(z.__webglDepthRenderbuffer,m,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(gt){e.bindTexture(i.TEXTURE_CUBE_MAP,mt.__webglTexture),at(i.TEXTURE_CUBE_MAP,v,It);for(let St=0;St<6;St++)if(a&&v.mipmaps&&v.mipmaps.length>0)for(let Ut=0;Ut<v.mipmaps.length;Ut++)M(z.__webglFramebuffer[St][Ut],m,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ut);else M(z.__webglFramebuffer[St],m,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);A(v,It)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){let St=m.texture;for(let Ut=0,zt=St.length;Ut<zt;Ut++){let kt=St[Ut],yt=n.get(kt);e.bindTexture(i.TEXTURE_2D,yt.__webglTexture),at(i.TEXTURE_2D,kt,It),M(z.__webglFramebuffer,m,kt,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,0),A(kt,It)&&_(i.TEXTURE_2D)}e.unbindTexture()}else{let St=i.TEXTURE_2D;if((m.isWebGL3DRenderTarget||m.isWebGLArrayRenderTarget)&&(a?St=m.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(St,mt.__webglTexture),at(St,v,It),a&&v.mipmaps&&v.mipmaps.length>0)for(let Ut=0;Ut<v.mipmaps.length;Ut++)M(z.__webglFramebuffer[Ut],m,v,i.COLOR_ATTACHMENT0,St,Ut);else M(z.__webglFramebuffer,m,v,i.COLOR_ATTACHMENT0,St,0);A(v,It)&&_(St),e.unbindTexture()}m.depthBuffer&&H(m)}function nt(m){let v=p(m)||a,z=m.isWebGLMultipleRenderTargets===!0?m.texture:[m.texture];for(let mt=0,gt=z.length;mt<gt;mt++){let dt=z[mt];if(A(dt,v)){let It=m.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,St=n.get(dt).__webglTexture;e.bindTexture(It,St),_(It),e.unbindTexture()}}}function O(m){if(a&&m.samples>0&&W(m)===!1){let v=m.isWebGLMultipleRenderTargets?m.texture:[m.texture],z=m.width,mt=m.height,gt=i.COLOR_BUFFER_BIT,dt=[],It=m.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(m),Ut=m.isWebGLMultipleRenderTargets===!0;if(Ut)for(let zt=0;zt<v.length;zt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let zt=0;zt<v.length;zt++){dt.push(i.COLOR_ATTACHMENT0+zt),m.depthBuffer&&dt.push(It);let kt=St.__ignoreDepthValues!==void 0?St.__ignoreDepthValues:!1;if(kt===!1&&(m.depthBuffer&&(gt|=i.DEPTH_BUFFER_BIT),m.stencilBuffer&&(gt|=i.STENCIL_BUFFER_BIT)),Ut&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[zt]),kt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[It]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[It])),Ut){let yt=n.get(v[zt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,yt,0)}i.blitFramebuffer(0,0,z,mt,0,0,z,mt,gt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,dt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ut)for(let zt=0;zt<v.length;zt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.RENDERBUFFER,St.__webglColorRenderbuffer[zt]);let kt=n.get(v[zt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.TEXTURE_2D,kt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}}function q(m){return Math.min(s.maxSamples,m.samples)}function W(m){let v=n.get(m);return a&&m.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function pt(m){let v=o.render.frame;h.get(m)!==v&&(h.set(m,v),m.update())}function U(m,v){let z=m.colorSpace,mt=m.format,gt=m.type;return m.isCompressedTexture===!0||m.isVideoTexture===!0||m.format===Da||z!==Nn&&z!==on&&(le.getTransfer(z)===de?a===!1?t.has("EXT_sRGB")===!0&&mt===gn?(m.format=Da,m.minFilter=rn,m.generateMipmaps=!1):v=gr.sRGBToLinear(v):(mt!==gn||gt!==Zn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}this.allocateTextureUnit=N,this.resetTextureUnits=_t,this.setTexture2D=j,this.setTexture2DArray=J,this.setTexture3D=B,this.setTextureCube=st,this.rebindTextures=ot,this.setupRenderTarget=L,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=O,this.setupDepthRenderbuffer=H,this.setupFrameBufferTexture=M,this.useMultisampledRTT=W}function Dm(i,t,e){let n=e.isWebGL2;function s(r,o=on){let a,c=le.getTransfer(o);if(r===Zn)return i.UNSIGNED_BYTE;if(r===fl)return i.UNSIGNED_SHORT_4_4_4_4;if(r===pl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===fh)return i.BYTE;if(r===ph)return i.SHORT;if(r===bo)return i.UNSIGNED_SHORT;if(r===dl)return i.INT;if(r===Wn)return i.UNSIGNED_INT;if(r===Xn)return i.FLOAT;if(r===ps)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===mh)return i.ALPHA;if(r===gn)return i.RGBA;if(r===gh)return i.LUMINANCE;if(r===_h)return i.LUMINANCE_ALPHA;if(r===oi)return i.DEPTH_COMPONENT;if(r===Gi)return i.DEPTH_STENCIL;if(r===Da)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===xh)return i.RED;if(r===ml)return i.RED_INTEGER;if(r===yh)return i.RG;if(r===gl)return i.RG_INTEGER;if(r===_l)return i.RGBA_INTEGER;if(r===$r||r===Kr||r===jr||r===Qr)if(c===de)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===$r)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Kr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===jr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Qr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===$r)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Kr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===jr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Qr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Fo||r===Bo||r===zo||r===ko)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Fo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Bo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===zo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ko)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===xl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ho||r===Vo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Ho)return c===de?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Vo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Go||r===Wo||r===Xo||r===qo||r===Yo||r===Zo||r===Jo||r===$o||r===Ko||r===jo||r===Qo||r===tc||r===ec||r===nc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Go)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Wo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Xo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===qo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Yo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Zo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Jo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===$o)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ko)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===jo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Qo)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===tc)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ec)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===nc)return c===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ta||r===ic||r===sc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ta)return c===de?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ic)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===sc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===vh||r===rc||r===ac||r===oc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ta)return a.COMPRESSED_RED_RGTC1_EXT;if(r===rc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ac)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===oc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ai?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Za=class extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Dn=class extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}},Nm={type:"move"},hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let y of t.hand.values()){let p=e.getJointPose(y,n),u=this._getHandJoint(l,y);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),g=.02,x=.005;l.inputState.pinching&&f>g+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=g-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Nm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Dn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Ja=class extends Jn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,f=null,g=null,x=null,y=e.getContextAttributes(),p=null,u=null,A=[],_=[],T=new xt,D=null,P=new Ve;P.layers.enable(1),P.viewport=new Ue;let C=new Ve;C.layers.enable(2),C.viewport=new Ue;let $=[P,C],S=new Za;S.layers.enable(1),S.layers.enable(2);let w=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(at){let I=A[at];return I===void 0&&(I=new hs,A[at]=I),I.getTargetRaySpace()},this.getControllerGrip=function(at){let I=A[at];return I===void 0&&(I=new hs,A[at]=I),I.getGripSpace()},this.getHand=function(at){let I=A[at];return I===void 0&&(I=new hs,A[at]=I),I.getHandSpace()};function Q(at){let I=_.indexOf(at.inputSource);if(I===-1)return;let R=A[I];R!==void 0&&(R.update(at.inputSource,at.frame,l||o),R.dispatchEvent({type:at.type,data:at.inputSource}))}function _t(){s.removeEventListener("select",Q),s.removeEventListener("selectstart",Q),s.removeEventListener("selectend",Q),s.removeEventListener("squeeze",Q),s.removeEventListener("squeezestart",Q),s.removeEventListener("squeezeend",Q),s.removeEventListener("end",_t),s.removeEventListener("inputsourceschange",N);for(let at=0;at<A.length;at++){let I=_[at];I!==null&&(_[at]=null,A[at].disconnect(I))}w=null,K=null,t.setRenderTarget(p),g=null,f=null,d=null,s=null,u=null,Mt.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(at){r=at,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(at){a=at,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(at){l=at},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(at){if(s=at,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",Q),s.addEventListener("selectstart",Q),s.addEventListener("selectend",Q),s.addEventListener("squeeze",Q),s.addEventListener("squeezestart",Q),s.addEventListener("squeezeend",Q),s.addEventListener("end",_t),s.addEventListener("inputsourceschange",N),y.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(T),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let I={antialias:s.renderState.layers===void 0?y.antialias:!0,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,e,I),s.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),u=new On(g.framebufferWidth,g.framebufferHeight,{format:gn,type:Zn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil})}else{let I=null,R=null,E=null;y.depth&&(E=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,I=y.stencil?Gi:oi,R=y.stencil?ai:Wn);let M={colorFormat:e.RGBA8,depthFormat:E,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(M),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),u=new On(f.textureWidth,f.textureHeight,{format:gn,type:Zn,depthTexture:new Lr(f.textureWidth,f.textureHeight,R,void 0,void 0,void 0,void 0,void 0,void 0,I),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0});let tt=t.properties.get(u);tt.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Mt.setContext(s),Mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function N(at){for(let I=0;I<at.removed.length;I++){let R=at.removed[I],E=_.indexOf(R);E>=0&&(_[E]=null,A[E].disconnect(R))}for(let I=0;I<at.added.length;I++){let R=at.added[I],E=_.indexOf(R);if(E===-1){for(let tt=0;tt<A.length;tt++)if(tt>=_.length){_.push(R),E=tt;break}else if(_[tt]===null){_[tt]=R,E=tt;break}if(E===-1)break}let M=A[E];M&&M.connect(R)}}let X=new V,j=new V;function J(at,I,R){X.setFromMatrixPosition(I.matrixWorld),j.setFromMatrixPosition(R.matrixWorld);let E=X.distanceTo(j),M=I.projectionMatrix.elements,tt=R.projectionMatrix.elements,ft=M[14]/(M[10]-1),H=M[14]/(M[10]+1),ot=(M[9]+1)/M[5],L=(M[9]-1)/M[5],nt=(M[8]-1)/M[0],O=(tt[8]+1)/tt[0],q=ft*nt,W=ft*O,pt=E/(-nt+O),U=pt*-nt;I.matrixWorld.decompose(at.position,at.quaternion,at.scale),at.translateX(U),at.translateZ(pt),at.matrixWorld.compose(at.position,at.quaternion,at.scale),at.matrixWorldInverse.copy(at.matrixWorld).invert();let m=ft+pt,v=H+pt,z=q-U,mt=W+(E-U),gt=ot*H/v*m,dt=L*H/v*m;at.projectionMatrix.makePerspective(z,mt,gt,dt,m,v),at.projectionMatrixInverse.copy(at.projectionMatrix).invert()}function B(at,I){I===null?at.matrixWorld.copy(at.matrix):at.matrixWorld.multiplyMatrices(I.matrixWorld,at.matrix),at.matrixWorldInverse.copy(at.matrixWorld).invert()}this.updateCamera=function(at){if(s===null)return;S.near=C.near=P.near=at.near,S.far=C.far=P.far=at.far,(w!==S.near||K!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),w=S.near,K=S.far);let I=at.parent,R=S.cameras;B(S,I);for(let E=0;E<R.length;E++)B(R[E],I);R.length===2?J(S,P,C):S.projectionMatrix.copy(P.projectionMatrix),st(at,S,I)};function st(at,I,R){R===null?at.matrix.copy(I.matrixWorld):(at.matrix.copy(R.matrixWorld),at.matrix.invert(),at.matrix.multiply(I.matrixWorld)),at.matrix.decompose(at.position,at.quaternion,at.scale),at.updateMatrixWorld(!0),at.projectionMatrix.copy(I.projectionMatrix),at.projectionMatrixInverse.copy(I.projectionMatrixInverse),at.isPerspectiveCamera&&(at.fov=Wi*2*Math.atan(1/at.projectionMatrix.elements[5]),at.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&g===null))return c},this.setFoveation=function(at){c=at,f!==null&&(f.fixedFoveation=at),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=at)};let lt=null;function ut(at,I){if(h=I.getViewerPose(l||o),x=I,h!==null){let R=h.views;g!==null&&(t.setRenderTargetFramebuffer(u,g.framebuffer),t.setRenderTarget(u));let E=!1;R.length!==S.cameras.length&&(S.cameras.length=0,E=!0);for(let M=0;M<R.length;M++){let tt=R[M],ft=null;if(g!==null)ft=g.getViewport(tt);else{let ot=d.getViewSubImage(f,tt);ft=ot.viewport,M===0&&(t.setRenderTargetTextures(u,ot.colorTexture,f.ignoreDepthValues?void 0:ot.depthStencilTexture),t.setRenderTarget(u))}let H=$[M];H===void 0&&(H=new Ve,H.layers.enable(M),H.viewport=new Ue,$[M]=H),H.matrix.fromArray(tt.transform.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale),H.projectionMatrix.fromArray(tt.projectionMatrix),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),H.viewport.set(ft.x,ft.y,ft.width,ft.height),M===0&&(S.matrix.copy(H.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),E===!0&&S.cameras.push(H)}}for(let R=0;R<A.length;R++){let E=_[R],M=A[R];E!==null&&M!==void 0&&M.update(E,I,l||o)}lt&&lt(at,I),I.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:I}),x=null}let Mt=new wl;Mt.setAnimationLoop(ut),this.setAnimationLoop=function(at){lt=at},this.dispose=function(){}}};function Om(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,El(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,A,_,T){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&g(p,u,T)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),y(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?c(p,u,A,_):u.isSpriteMaterial?l(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===$e&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===$e&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let A=t.get(u).envMap;if(A&&(p.envMap.value=A,p.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function c(p,u,A,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*A,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function l(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function g(p,u,A){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===$e&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function y(p,u){let A=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Fm(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(A,_){let T=_.program;n.uniformBlockBinding(A,T)}function l(A,_){let T=s[A.id];T===void 0&&(x(A),T=h(A),s[A.id]=T,A.addEventListener("dispose",p));let D=_.program;n.updateUBOMapping(A,D);let P=t.render.frame;r[A.id]!==P&&(f(A),r[A.id]=P)}function h(A){let _=d();A.__bindingPointIndex=_;let T=i.createBuffer(),D=A.__size,P=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,D,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,T),T}function d(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){let _=s[A.id],T=A.uniforms,D=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let P=0,C=T.length;P<C;P++){let $=Array.isArray(T[P])?T[P]:[T[P]];for(let S=0,w=$.length;S<w;S++){let K=$[S];if(g(K,P,S,D)===!0){let Q=K.__offset,_t=Array.isArray(K.value)?K.value:[K.value],N=0;for(let X=0;X<_t.length;X++){let j=_t[X],J=y(j);typeof j=="number"||typeof j=="boolean"?(K.__data[0]=j,i.bufferSubData(i.UNIFORM_BUFFER,Q+N,K.__data)):j.isMatrix3?(K.__data[0]=j.elements[0],K.__data[1]=j.elements[1],K.__data[2]=j.elements[2],K.__data[3]=0,K.__data[4]=j.elements[3],K.__data[5]=j.elements[4],K.__data[6]=j.elements[5],K.__data[7]=0,K.__data[8]=j.elements[6],K.__data[9]=j.elements[7],K.__data[10]=j.elements[8],K.__data[11]=0):(j.toArray(K.__data,N),N+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Q,K.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(A,_,T,D){let P=A.value,C=_+"_"+T;if(D[C]===void 0)return typeof P=="number"||typeof P=="boolean"?D[C]=P:D[C]=P.clone(),!0;{let $=D[C];if(typeof P=="number"||typeof P=="boolean"){if($!==P)return D[C]=P,!0}else if($.equals(P)===!1)return $.copy(P),!0}return!1}function x(A){let _=A.uniforms,T=0,D=16;for(let C=0,$=_.length;C<$;C++){let S=Array.isArray(_[C])?_[C]:[_[C]];for(let w=0,K=S.length;w<K;w++){let Q=S[w],_t=Array.isArray(Q.value)?Q.value:[Q.value];for(let N=0,X=_t.length;N<X;N++){let j=_t[N],J=y(j),B=T%D;B!==0&&D-B<J.boundary&&(T+=D-B),Q.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),Q.__offset=T,T+=J.storage}}}let P=T%D;return P>0&&(T+=D-P),A.__size=T,A.__cache={},this}function y(A){let _={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(_.boundary=4,_.storage=4):A.isVector2?(_.boundary=8,_.storage=8):A.isVector3||A.isColor?(_.boundary=16,_.storage=12):A.isVector4?(_.boundary=16,_.storage=16):A.isMatrix3?(_.boundary=48,_.storage=48):A.isMatrix4?(_.boundary=64,_.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),_}function p(A){let _=A.target;_.removeEventListener("dispose",p);let T=o.indexOf(_.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:c,update:l,dispose:u}}var _s=class{constructor(t={}){let{canvas:e=Xh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let g=new Uint32Array(4),x=new Int32Array(4),y=null,p=null,u=[],A=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ee,this._useLegacyLights=!1,this.toneMapping=Yn,this.toneMappingExposure=1;let _=this,T=!1,D=0,P=0,C=null,$=-1,S=null,w=new Ue,K=new Ue,Q=null,_t=new $t(0),N=0,X=e.width,j=e.height,J=1,B=null,st=null,lt=new Ue(0,0,X,j),ut=new Ue(0,0,X,j),Mt=!1,at=new gs,I=!1,R=!1,E=null,M=new be,tt=new xt,ft=new V,H={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ot(){return C===null?J:1}let L=n;function nt(b,Y){for(let it=0;it<b.length;it++){let rt=b[it],et=e.getContext(rt,Y);if(et!==null)return et}return null}try{let b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",bt,!1),e.addEventListener("webglcontextrestored",F,!1),e.addEventListener("webglcontextcreationerror",At,!1),L===null){let Y=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&Y.shift(),L=nt(Y,b),L===null)throw nt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&L instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),L.getShaderPrecisionFormat===void 0&&(L.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let O,q,W,pt,U,m,v,z,mt,gt,dt,It,St,Ut,zt,kt,yt,ie,Kt,Ft,Lt,Dt,Wt,re;function fe(){O=new np(L),q=new $f(L,O,t),O.init(q),Dt=new Dm(L,O,q),W=new Im(L,O,q),pt=new rp(L),U=new vm,m=new Um(L,O,W,U,q,Dt,pt),v=new jf(_),z=new ep(_),mt=new du(L,q),Wt=new Zf(L,O,mt,q),gt=new ip(L,mt,pt,Wt),dt=new lp(L,gt,mt,pt),Kt=new cp(L,q,m),kt=new Kf(U),It=new ym(_,v,z,O,q,Wt,kt),St=new Om(_,U),Ut=new Sm,zt=new Am(O,q),ie=new Yf(_,v,z,W,dt,f,c),yt=new Pm(_,dt,q),re=new Fm(L,pt,q,W),Ft=new Jf(L,O,pt,q),Lt=new sp(L,O,pt,q),pt.programs=It.programs,_.capabilities=q,_.extensions=O,_.properties=U,_.renderLists=Ut,_.shadowMap=yt,_.state=W,_.info=pt}fe();let ee=new Ja(_,L);this.xr=ee,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let b=O.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=O.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(b){b!==void 0&&(J=b,this.setSize(X,j,!1))},this.getSize=function(b){return b.set(X,j)},this.setSize=function(b,Y,it=!0){if(ee.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=b,j=Y,e.width=Math.floor(b*J),e.height=Math.floor(Y*J),it===!0&&(e.style.width=b+"px",e.style.height=Y+"px"),this.setViewport(0,0,b,Y)},this.getDrawingBufferSize=function(b){return b.set(X*J,j*J).floor()},this.setDrawingBufferSize=function(b,Y,it){X=b,j=Y,J=it,e.width=Math.floor(b*it),e.height=Math.floor(Y*it),this.setViewport(0,0,b,Y)},this.getCurrentViewport=function(b){return b.copy(w)},this.getViewport=function(b){return b.copy(lt)},this.setViewport=function(b,Y,it,rt){b.isVector4?lt.set(b.x,b.y,b.z,b.w):lt.set(b,Y,it,rt),W.viewport(w.copy(lt).multiplyScalar(J).floor())},this.getScissor=function(b){return b.copy(ut)},this.setScissor=function(b,Y,it,rt){b.isVector4?ut.set(b.x,b.y,b.z,b.w):ut.set(b,Y,it,rt),W.scissor(K.copy(ut).multiplyScalar(J).floor())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(b){W.setScissorTest(Mt=b)},this.setOpaqueSort=function(b){B=b},this.setTransparentSort=function(b){st=b},this.getClearColor=function(b){return b.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor.apply(ie,arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha.apply(ie,arguments)},this.clear=function(b=!0,Y=!0,it=!0){let rt=0;if(b){let et=!1;if(C!==null){let Nt=C.texture.format;et=Nt===_l||Nt===gl||Nt===ml}if(et){let Nt=C.texture.type,Bt=Nt===Zn||Nt===Wn||Nt===bo||Nt===ai||Nt===fl||Nt===pl,Vt=ie.getClearColor(),Xt=ie.getClearAlpha(),Qt=Vt.r,Zt=Vt.g,Yt=Vt.b;Bt?(g[0]=Qt,g[1]=Zt,g[2]=Yt,g[3]=Xt,L.clearBufferuiv(L.COLOR,0,g)):(x[0]=Qt,x[1]=Zt,x[2]=Yt,x[3]=Xt,L.clearBufferiv(L.COLOR,0,x))}else rt|=L.COLOR_BUFFER_BIT}Y&&(rt|=L.DEPTH_BUFFER_BIT),it&&(rt|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",bt,!1),e.removeEventListener("webglcontextrestored",F,!1),e.removeEventListener("webglcontextcreationerror",At,!1),Ut.dispose(),zt.dispose(),U.dispose(),v.dispose(),z.dispose(),dt.dispose(),Wt.dispose(),re.dispose(),It.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",De),ee.removeEventListener("sessionend",ce),E&&(E.dispose(),E=null),Le.stop()};function bt(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let b=pt.autoReset,Y=yt.enabled,it=yt.autoUpdate,rt=yt.needsUpdate,et=yt.type;fe(),pt.autoReset=b,yt.enabled=Y,yt.autoUpdate=it,yt.needsUpdate=rt,yt.type=et}function At(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Rt(b){let Y=b.target;Y.removeEventListener("dispose",Rt),Gt(Y)}function Gt(b){Ht(b),U.remove(b)}function Ht(b){let Y=U.get(b).programs;Y!==void 0&&(Y.forEach(function(it){It.releaseProgram(it)}),b.isShaderMaterial&&It.releaseShaderCache(b))}this.renderBufferDirect=function(b,Y,it,rt,et,Nt){Y===null&&(Y=H);let Bt=et.isMesh&&et.matrixWorld.determinant()<0,Vt=Yr(b,Y,it,rt,et);W.setMaterial(rt,Bt);let Xt=it.index,Qt=1;if(rt.wireframe===!0){if(Xt=gt.getWireframeAttribute(it),Xt===void 0)return;Qt=2}let Zt=it.drawRange,Yt=it.attributes.position,he=Zt.start*Qt,Ne=(Zt.start+Zt.count)*Qt;Nt!==null&&(he=Math.max(he,Nt.start*Qt),Ne=Math.min(Ne,(Nt.start+Nt.count)*Qt)),Xt!==null?(he=Math.max(he,0),Ne=Math.min(Ne,Xt.count)):Yt!=null&&(he=Math.max(he,0),Ne=Math.min(Ne,Yt.count));let _e=Ne-he;if(_e<0||_e===1/0)return;Wt.setup(et,rt,Vt,it,Xt);let je,ue=Ft;if(Xt!==null&&(je=mt.get(Xt),ue=Lt,ue.setIndex(je)),et.isMesh)rt.wireframe===!0?(W.setLineWidth(rt.wireframeLinewidth*ot()),ue.setMode(L.LINES)):ue.setMode(L.TRIANGLES);else if(et.isLine){let te=rt.linewidth;te===void 0&&(te=1),W.setLineWidth(te*ot()),et.isLineSegments?ue.setMode(L.LINES):et.isLineLoop?ue.setMode(L.LINE_LOOP):ue.setMode(L.LINE_STRIP)}else et.isPoints?ue.setMode(L.POINTS):et.isSprite&&ue.setMode(L.TRIANGLES);if(et.isBatchedMesh)ue.renderMultiDraw(et._multiDrawStarts,et._multiDrawCounts,et._multiDrawCount);else if(et.isInstancedMesh)ue.renderInstances(he,_e,et.count);else if(it.isInstancedBufferGeometry){let te=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,ts=Math.min(it.instanceCount,te);ue.renderInstances(he,_e,ts)}else ue.render(he,_e)};function ae(b,Y,it){b.transparent===!0&&b.side===an&&b.forceSinglePass===!1?(b.side=$e,b.needsUpdate=!0,mi(b,Y,it),b.side=Mn,b.needsUpdate=!0,mi(b,Y,it),b.side=an):mi(b,Y,it)}this.compile=function(b,Y,it=null){it===null&&(it=b),p=zt.get(it),p.init(),A.push(p),it.traverseVisible(function(et){et.isLight&&et.layers.test(Y.layers)&&(p.pushLight(et),et.castShadow&&p.pushShadow(et))}),b!==it&&b.traverseVisible(function(et){et.isLight&&et.layers.test(Y.layers)&&(p.pushLight(et),et.castShadow&&p.pushShadow(et))}),p.setupLights(_._useLegacyLights);let rt=new Set;return b.traverse(function(et){let Nt=et.material;if(Nt)if(Array.isArray(Nt))for(let Bt=0;Bt<Nt.length;Bt++){let Vt=Nt[Bt];ae(Vt,it,et),rt.add(Vt)}else ae(Nt,it,et),rt.add(Nt)}),A.pop(),p=null,rt},this.compileAsync=function(b,Y,it=null){let rt=this.compile(b,Y,it);return new Promise(et=>{function Nt(){if(rt.forEach(function(Bt){U.get(Bt).currentProgram.isReady()&&rt.delete(Bt)}),rt.size===0){et(b);return}setTimeout(Nt,10)}O.get("KHR_parallel_shader_compile")!==null?Nt():setTimeout(Nt,10)})};let oe=null;function ve(b){oe&&oe(b)}function De(){Le.stop()}function ce(){Le.start()}let Le=new wl;Le.setAnimationLoop(ve),typeof self<"u"&&Le.setContext(self),this.setAnimationLoop=function(b){oe=b,ee.setAnimationLoop(b),b===null?Le.stop():Le.start()},ee.addEventListener("sessionstart",De),ee.addEventListener("sessionend",ce),this.render=function(b,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(Y),Y=ee.getCamera()),b.isScene===!0&&b.onBeforeRender(_,b,Y,C),p=zt.get(b,A.length),p.init(),A.push(p),M.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),at.setFromProjectionMatrix(M),R=this.localClippingEnabled,I=kt.init(this.clippingPlanes,R),y=Ut.get(b,u.length),y.init(),u.push(y),Ke(b,Y,0,_.sortObjects),y.finish(),_.sortObjects===!0&&y.sort(B,st),this.info.render.frame++,I===!0&&kt.beginShadows();let it=p.state.shadowsArray;if(yt.render(it,b,Y),I===!0&&kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),ie.render(y,b),p.setupLights(_._useLegacyLights),Y.isArrayCamera){let rt=Y.cameras;for(let et=0,Nt=rt.length;et<Nt;et++){let Bt=rt[et];Ls(y,b,Bt,Bt.viewport)}}else Ls(y,b,Y);C!==null&&(m.updateMultisampleRenderTarget(C),m.updateRenderTargetMipmap(C)),b.isScene===!0&&b.onAfterRender(_,b,Y),Wt.resetDefaultState(),$=-1,S=null,A.pop(),A.length>0?p=A[A.length-1]:p=null,u.pop(),u.length>0?y=u[u.length-1]:y=null};function Ke(b,Y,it,rt){if(b.visible===!1)return;if(b.layers.test(Y.layers)){if(b.isGroup)it=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(Y);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||at.intersectsSprite(b)){rt&&ft.setFromMatrixPosition(b.matrixWorld).applyMatrix4(M);let Bt=dt.update(b),Vt=b.material;Vt.visible&&y.push(b,Bt,Vt,it,ft.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||at.intersectsObject(b))){let Bt=dt.update(b),Vt=b.material;if(rt&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ft.copy(b.boundingSphere.center)):(Bt.boundingSphere===null&&Bt.computeBoundingSphere(),ft.copy(Bt.boundingSphere.center)),ft.applyMatrix4(b.matrixWorld).applyMatrix4(M)),Array.isArray(Vt)){let Xt=Bt.groups;for(let Qt=0,Zt=Xt.length;Qt<Zt;Qt++){let Yt=Xt[Qt],he=Vt[Yt.materialIndex];he&&he.visible&&y.push(b,Bt,he,it,ft.z,Yt)}}else Vt.visible&&y.push(b,Bt,Vt,it,ft.z,null)}}let Nt=b.children;for(let Bt=0,Vt=Nt.length;Bt<Vt;Bt++)Ke(Nt[Bt],Y,it,rt)}function Ls(b,Y,it,rt){let et=b.opaque,Nt=b.transmissive,Bt=b.transparent;p.setupLightsView(it),I===!0&&kt.setGlobalState(_.clippingPlanes,it),Nt.length>0&&qr(et,Nt,Y,it),rt&&W.viewport(w.copy(rt)),et.length>0&&jn(et,Y,it),Nt.length>0&&jn(Nt,Y,it),Bt.length>0&&jn(Bt,Y,it),W.buffers.depth.setTest(!0),W.buffers.depth.setMask(!0),W.buffers.color.setMask(!0),W.setPolygonOffset(!1)}function qr(b,Y,it,rt){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;let Nt=q.isWebGL2;E===null&&(E=new On(1,1,{generateMipmaps:!0,type:O.has("EXT_color_buffer_half_float")?ps:Zn,minFilter:fs,samples:Nt?4:0})),_.getDrawingBufferSize(tt),Nt?E.setSize(tt.x,tt.y):E.setSize(pr(tt.x),pr(tt.y));let Bt=_.getRenderTarget();_.setRenderTarget(E),_.getClearColor(_t),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),_.clear();let Vt=_.toneMapping;_.toneMapping=Yn,jn(b,it,rt),m.updateMultisampleRenderTarget(E),m.updateRenderTargetMipmap(E);let Xt=!1;for(let Qt=0,Zt=Y.length;Qt<Zt;Qt++){let Yt=Y[Qt],he=Yt.object,Ne=Yt.geometry,_e=Yt.material,je=Yt.group;if(_e.side===an&&he.layers.test(rt.layers)){let ue=_e.side;_e.side=$e,_e.needsUpdate=!0,As(he,it,rt,Ne,_e,je),_e.side=ue,_e.needsUpdate=!0,Xt=!0}}Xt===!0&&(m.updateMultisampleRenderTarget(E),m.updateRenderTargetMipmap(E)),_.setRenderTarget(Bt),_.setClearColor(_t,N),_.toneMapping=Vt}function jn(b,Y,it){let rt=Y.isScene===!0?Y.overrideMaterial:null;for(let et=0,Nt=b.length;et<Nt;et++){let Bt=b[et],Vt=Bt.object,Xt=Bt.geometry,Qt=rt===null?Bt.material:rt,Zt=Bt.group;Vt.layers.test(it.layers)&&As(Vt,Y,it,Xt,Qt,Zt)}}function As(b,Y,it,rt,et,Nt){b.onBeforeRender(_,Y,it,rt,et,Nt),b.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),et.onBeforeRender(_,Y,it,rt,b,Nt),et.transparent===!0&&et.side===an&&et.forceSinglePass===!1?(et.side=$e,et.needsUpdate=!0,_.renderBufferDirect(it,Y,rt,et,b,Nt),et.side=Mn,et.needsUpdate=!0,_.renderBufferDirect(it,Y,rt,et,b,Nt),et.side=an):_.renderBufferDirect(it,Y,rt,et,b,Nt),b.onAfterRender(_,Y,it,rt,et,Nt)}function mi(b,Y,it){Y.isScene!==!0&&(Y=H);let rt=U.get(b),et=p.state.lights,Nt=p.state.shadowsArray,Bt=et.state.version,Vt=It.getParameters(b,et.state,Nt,Y,it),Xt=It.getProgramCacheKey(Vt),Qt=rt.programs;rt.environment=b.isMeshStandardMaterial?Y.environment:null,rt.fog=Y.fog,rt.envMap=(b.isMeshStandardMaterial?z:v).get(b.envMap||rt.environment),Qt===void 0&&(b.addEventListener("dispose",Rt),Qt=new Map,rt.programs=Qt);let Zt=Qt.get(Xt);if(Zt!==void 0){if(rt.currentProgram===Zt&&rt.lightsStateVersion===Bt)return Qi(b,Vt),Zt}else Vt.uniforms=It.getUniforms(b),b.onBuild(it,Vt,_),b.onBeforeCompile(Vt,_),Zt=It.acquireProgram(Vt,Xt),Qt.set(Xt,Zt),rt.uniforms=Vt.uniforms;let Yt=rt.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Yt.clippingPlanes=kt.uniform),Qi(b,Vt),rt.needsLights=Fn(b),rt.lightsStateVersion=Bt,rt.needsLights&&(Yt.ambientLightColor.value=et.state.ambient,Yt.lightProbe.value=et.state.probe,Yt.directionalLights.value=et.state.directional,Yt.directionalLightShadows.value=et.state.directionalShadow,Yt.spotLights.value=et.state.spot,Yt.spotLightShadows.value=et.state.spotShadow,Yt.rectAreaLights.value=et.state.rectArea,Yt.ltc_1.value=et.state.rectAreaLTC1,Yt.ltc_2.value=et.state.rectAreaLTC2,Yt.pointLights.value=et.state.point,Yt.pointLightShadows.value=et.state.pointShadow,Yt.hemisphereLights.value=et.state.hemi,Yt.directionalShadowMap.value=et.state.directionalShadowMap,Yt.directionalShadowMatrix.value=et.state.directionalShadowMatrix,Yt.spotShadowMap.value=et.state.spotShadowMap,Yt.spotLightMatrix.value=et.state.spotLightMatrix,Yt.spotLightMap.value=et.state.spotLightMap,Yt.pointShadowMap.value=et.state.pointShadowMap,Yt.pointShadowMatrix.value=et.state.pointShadowMatrix),rt.currentProgram=Zt,rt.uniformsList=null,Zt}function Rs(b){if(b.uniformsList===null){let Y=b.currentProgram.getUniforms();b.uniformsList=ki.seqWithValue(Y.seq,b.uniforms)}return b.uniformsList}function Qi(b,Y){let it=U.get(b);it.outputColorSpace=Y.outputColorSpace,it.batching=Y.batching,it.instancing=Y.instancing,it.instancingColor=Y.instancingColor,it.skinning=Y.skinning,it.morphTargets=Y.morphTargets,it.morphNormals=Y.morphNormals,it.morphColors=Y.morphColors,it.morphTargetsCount=Y.morphTargetsCount,it.numClippingPlanes=Y.numClippingPlanes,it.numIntersection=Y.numClipIntersection,it.vertexAlphas=Y.vertexAlphas,it.vertexTangents=Y.vertexTangents,it.toneMapping=Y.toneMapping}function Yr(b,Y,it,rt,et){Y.isScene!==!0&&(Y=H),m.resetTextureUnits();let Nt=Y.fog,Bt=rt.isMeshStandardMaterial?Y.environment:null,Vt=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Nn,Xt=(rt.isMeshStandardMaterial?z:v).get(rt.envMap||Bt),Qt=rt.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,Zt=!!it.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),Yt=!!it.morphAttributes.position,he=!!it.morphAttributes.normal,Ne=!!it.morphAttributes.color,_e=Yn;rt.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(_e=_.toneMapping);let je=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,ue=je!==void 0?je.length:0,te=U.get(rt),ts=p.state.lights;if(I===!0&&(R===!0||b!==S)){let Ze=b===S&&rt.id===$;kt.setState(rt,b,Ze)}let pe=!1;rt.version===te.__version?(te.needsLights&&te.lightsStateVersion!==ts.state.version||te.outputColorSpace!==Vt||et.isBatchedMesh&&te.batching===!1||!et.isBatchedMesh&&te.batching===!0||et.isInstancedMesh&&te.instancing===!1||!et.isInstancedMesh&&te.instancing===!0||et.isSkinnedMesh&&te.skinning===!1||!et.isSkinnedMesh&&te.skinning===!0||et.isInstancedMesh&&te.instancingColor===!0&&et.instanceColor===null||et.isInstancedMesh&&te.instancingColor===!1&&et.instanceColor!==null||te.envMap!==Xt||rt.fog===!0&&te.fog!==Nt||te.numClippingPlanes!==void 0&&(te.numClippingPlanes!==kt.numPlanes||te.numIntersection!==kt.numIntersection)||te.vertexAlphas!==Qt||te.vertexTangents!==Zt||te.morphTargets!==Yt||te.morphNormals!==he||te.morphColors!==Ne||te.toneMapping!==_e||q.isWebGL2===!0&&te.morphTargetsCount!==ue)&&(pe=!0):(pe=!0,te.__version=rt.version);let bn=te.currentProgram;pe===!0&&(bn=mi(rt,Y,et));let Cs=!1,Bn=!1,gi=!1,Ae=bn.getUniforms(),En=te.uniforms;if(W.useProgram(bn.program)&&(Cs=!0,Bn=!0,gi=!0),rt.id!==$&&($=rt.id,Bn=!0),Cs||S!==b){Ae.setValue(L,"projectionMatrix",b.projectionMatrix),Ae.setValue(L,"viewMatrix",b.matrixWorldInverse);let Ze=Ae.map.cameraPosition;Ze!==void 0&&Ze.setValue(L,ft.setFromMatrixPosition(b.matrixWorld)),q.logarithmicDepthBuffer&&Ae.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&Ae.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,Bn=!0,gi=!0)}if(et.isSkinnedMesh){Ae.setOptional(L,et,"bindMatrix"),Ae.setOptional(L,et,"bindMatrixInverse");let Ze=et.skeleton;Ze&&(q.floatVertexTextures?(Ze.boneTexture===null&&Ze.computeBoneTexture(),Ae.setValue(L,"boneTexture",Ze.boneTexture,m)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}et.isBatchedMesh&&(Ae.setOptional(L,et,"batchingTexture"),Ae.setValue(L,"batchingTexture",et._matricesTexture,m));let es=it.morphAttributes;if((es.position!==void 0||es.normal!==void 0||es.color!==void 0&&q.isWebGL2===!0)&&Kt.update(et,it,bn),(Bn||te.receiveShadow!==et.receiveShadow)&&(te.receiveShadow=et.receiveShadow,Ae.setValue(L,"receiveShadow",et.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(En.envMap.value=Xt,En.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Bn&&(Ae.setValue(L,"toneMappingExposure",_.toneMappingExposure),te.needsLights&&Zr(En,gi),Nt&&rt.fog===!0&&St.refreshFogUniforms(En,Nt),St.refreshMaterialUniforms(En,rt,J,j,E),ki.upload(L,Rs(te),En,m)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(ki.upload(L,Rs(te),En,m),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&Ae.setValue(L,"center",et.center),Ae.setValue(L,"modelViewMatrix",et.modelViewMatrix),Ae.setValue(L,"normalMatrix",et.normalMatrix),Ae.setValue(L,"modelMatrix",et.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){let Ze=rt.uniformsGroups;for(let ns=0,Ps=Ze.length;ns<Ps;ns++)if(q.isWebGL2){let k=Ze[ns];re.update(k,bn),re.bind(k,bn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return bn}function Zr(b,Y){b.ambientLightColor.needsUpdate=Y,b.lightProbe.needsUpdate=Y,b.directionalLights.needsUpdate=Y,b.directionalLightShadows.needsUpdate=Y,b.pointLights.needsUpdate=Y,b.pointLightShadows.needsUpdate=Y,b.spotLights.needsUpdate=Y,b.spotLightShadows.needsUpdate=Y,b.rectAreaLights.needsUpdate=Y,b.hemisphereLights.needsUpdate=Y}function Fn(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(b,Y,it){U.get(b.texture).__webglTexture=Y,U.get(b.depthTexture).__webglTexture=it;let rt=U.get(b);rt.__hasExternalTextures=!0,rt.__hasExternalTextures&&(rt.__autoAllocateDepthBuffer=it===void 0,rt.__autoAllocateDepthBuffer||O.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),rt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,Y){let it=U.get(b);it.__webglFramebuffer=Y,it.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(b,Y=0,it=0){C=b,D=Y,P=it;let rt=!0,et=null,Nt=!1,Bt=!1;if(b){let Xt=U.get(b);Xt.__useDefaultFramebuffer!==void 0?(W.bindFramebuffer(L.FRAMEBUFFER,null),rt=!1):Xt.__webglFramebuffer===void 0?m.setupRenderTarget(b):Xt.__hasExternalTextures&&m.rebindTextures(b,U.get(b.texture).__webglTexture,U.get(b.depthTexture).__webglTexture);let Qt=b.texture;(Qt.isData3DTexture||Qt.isDataArrayTexture||Qt.isCompressedArrayTexture)&&(Bt=!0);let Zt=U.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Zt[Y])?et=Zt[Y][it]:et=Zt[Y],Nt=!0):q.isWebGL2&&b.samples>0&&m.useMultisampledRTT(b)===!1?et=U.get(b).__webglMultisampledFramebuffer:Array.isArray(Zt)?et=Zt[it]:et=Zt,w.copy(b.viewport),K.copy(b.scissor),Q=b.scissorTest}else w.copy(lt).multiplyScalar(J).floor(),K.copy(ut).multiplyScalar(J).floor(),Q=Mt;if(W.bindFramebuffer(L.FRAMEBUFFER,et)&&q.drawBuffers&&rt&&W.drawBuffers(b,et),W.viewport(w),W.scissor(K),W.setScissorTest(Q),Nt){let Xt=U.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Xt.__webglTexture,it)}else if(Bt){let Xt=U.get(b.texture),Qt=Y||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Xt.__webglTexture,it||0,Qt)}$=-1},this.readRenderTargetPixels=function(b,Y,it,rt,et,Nt,Bt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Vt=U.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Bt!==void 0&&(Vt=Vt[Bt]),Vt){W.bindFramebuffer(L.FRAMEBUFFER,Vt);try{let Xt=b.texture,Qt=Xt.format,Zt=Xt.type;if(Qt!==gn&&Dt.convert(Qt)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Yt=Zt===ps&&(O.has("EXT_color_buffer_half_float")||q.isWebGL2&&O.has("EXT_color_buffer_float"));if(Zt!==Zn&&Dt.convert(Zt)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Zt===Xn&&(q.isWebGL2||O.has("OES_texture_float")||O.has("WEBGL_color_buffer_float")))&&!Yt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=b.width-rt&&it>=0&&it<=b.height-et&&L.readPixels(Y,it,rt,et,Dt.convert(Qt),Dt.convert(Zt),Nt)}finally{let Xt=C!==null?U.get(C).__webglFramebuffer:null;W.bindFramebuffer(L.FRAMEBUFFER,Xt)}}},this.copyFramebufferToTexture=function(b,Y,it=0){let rt=Math.pow(2,-it),et=Math.floor(Y.image.width*rt),Nt=Math.floor(Y.image.height*rt);m.setTexture2D(Y,0),L.copyTexSubImage2D(L.TEXTURE_2D,it,0,0,b.x,b.y,et,Nt),W.unbindTexture()},this.copyTextureToTexture=function(b,Y,it,rt=0){let et=Y.image.width,Nt=Y.image.height,Bt=Dt.convert(it.format),Vt=Dt.convert(it.type);m.setTexture2D(it,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,it.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,it.unpackAlignment),Y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,rt,b.x,b.y,et,Nt,Bt,Vt,Y.image.data):Y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,rt,b.x,b.y,Y.mipmaps[0].width,Y.mipmaps[0].height,Bt,Y.mipmaps[0].data):L.texSubImage2D(L.TEXTURE_2D,rt,b.x,b.y,Bt,Vt,Y.image),rt===0&&it.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),W.unbindTexture()},this.copyTextureToTexture3D=function(b,Y,it,rt,et=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Nt=b.max.x-b.min.x+1,Bt=b.max.y-b.min.y+1,Vt=b.max.z-b.min.z+1,Xt=Dt.convert(rt.format),Qt=Dt.convert(rt.type),Zt;if(rt.isData3DTexture)m.setTexture3D(rt,0),Zt=L.TEXTURE_3D;else if(rt.isDataArrayTexture||rt.isCompressedArrayTexture)m.setTexture2DArray(rt,0),Zt=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,rt.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,rt.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,rt.unpackAlignment);let Yt=L.getParameter(L.UNPACK_ROW_LENGTH),he=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ne=L.getParameter(L.UNPACK_SKIP_PIXELS),_e=L.getParameter(L.UNPACK_SKIP_ROWS),je=L.getParameter(L.UNPACK_SKIP_IMAGES),ue=it.isCompressedTexture?it.mipmaps[et]:it.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,ue.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ue.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,b.min.x),L.pixelStorei(L.UNPACK_SKIP_ROWS,b.min.y),L.pixelStorei(L.UNPACK_SKIP_IMAGES,b.min.z),it.isDataTexture||it.isData3DTexture?L.texSubImage3D(Zt,et,Y.x,Y.y,Y.z,Nt,Bt,Vt,Xt,Qt,ue.data):it.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),L.compressedTexSubImage3D(Zt,et,Y.x,Y.y,Y.z,Nt,Bt,Vt,Xt,ue.data)):L.texSubImage3D(Zt,et,Y.x,Y.y,Y.z,Nt,Bt,Vt,Xt,Qt,ue),L.pixelStorei(L.UNPACK_ROW_LENGTH,Yt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,he),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ne),L.pixelStorei(L.UNPACK_SKIP_ROWS,_e),L.pixelStorei(L.UNPACK_SKIP_IMAGES,je),et===0&&rt.generateMipmaps&&L.generateMipmap(Zt),W.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?m.setTextureCube(b,0):b.isData3DTexture?m.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?m.setTexture2DArray(b,0):m.setTexture2D(b,0),W.unbindTexture()},this.resetState=function(){D=0,P=0,C=null,W.reset(),Wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Eo?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Vr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ee?ci:yl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ci?Ee:Nn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},$a=class extends _s{};$a.prototype.isWebGL1Renderer=!0;var Ar=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new $t(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var xs=class extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var ys=class extends Kn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},jc=new be,Ka=new yr,tr=new Xi,er=new V,Rr=class extends ze{constructor(t=new nn,e=new ys){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(s),tr.radius+=r,t.ray.intersectsSphere(tr)===!1)return;jc.copy(s).invert(),Ka.copy(t.ray).applyMatrix4(jc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let x=f,y=g;x<y;x++){let p=l.getX(x);er.fromBufferAttribute(d,p),Qc(er,p,c,s,t,e,this)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=f,y=g;x<y;x++)er.fromBufferAttribute(d,x),Qc(er,x,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Qc(i,t,e,n,s,r,o){let a=Ka.distanceSqToPoint(i);if(a<e){let c=new V;Ka.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var Cr=class extends cn{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},ln=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,g=(o-h)/f;return(s+g)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new xt:new V);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new V,s=[],r=[],o=[],a=new V,c=new be;for(let g=0;g<=t;g++){let x=g/t;s[g]=this.getTangentAt(x,new V)}r[0]=new V,o[0]=new V;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let g=1;g<=t;g++){if(r[g]=r[g-1].clone(),o[g]=o[g-1].clone(),a.crossVectors(s[g-1],s[g]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(Ie(s[g-1].dot(s[g]),-1,1));r[g].applyMatrix4(c.makeRotationAxis(a,x))}o[g].crossVectors(s[g],r[g])}if(e===!0){let g=Math.acos(Ie(r[0].dot(r[t]),-1,1));g/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(g=-g);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],g*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},vs=class extends ln{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){let n=e||new xt,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,g=l-this.aY;c=f*h-g*d+this.aX,l=f*d+g*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ja=class extends vs{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Lo(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,g=(a-o)/h-(c-o)/(h+d)+(c-a)/d;f*=h,g*=h,s(o,a,f,g)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var nr=new V,Ea=new Lo,wa=new Lo,Ta=new Lo,Qa=class extends ln{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new V){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(nr.subVectors(s[0],s[1]).add(s[0]),l=nr);let d=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(nr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=nr),this.curveType==="centripetal"||this.curveType==="chordal"){let g=this.curveType==="chordal"?.5:.25,x=Math.pow(l.distanceToSquared(d),g),y=Math.pow(d.distanceToSquared(f),g),p=Math.pow(f.distanceToSquared(h),g);y<1e-4&&(y=1),x<1e-4&&(x=y),p<1e-4&&(p=y),Ea.initNonuniformCatmullRom(l.x,d.x,f.x,h.x,x,y,p),wa.initNonuniformCatmullRom(l.y,d.y,f.y,h.y,x,y,p),Ta.initNonuniformCatmullRom(l.z,d.z,f.z,h.z,x,y,p)}else this.curveType==="catmullrom"&&(Ea.initCatmullRom(l.x,d.x,f.x,h.x,this.tension),wa.initCatmullRom(l.y,d.y,f.y,h.y,this.tension),Ta.initCatmullRom(l.z,d.z,f.z,h.z,this.tension));return n.set(Ea.calc(c),wa.calc(c),Ta.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new V().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function tl(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Bm(i,t){let e=1-i;return e*e*t}function zm(i,t){return 2*(1-i)*i*t}function km(i,t){return i*i*t}function us(i,t,e,n){return Bm(i,t)+zm(i,e)+km(i,n)}function Hm(i,t){let e=1-i;return e*e*e*t}function Vm(i,t){let e=1-i;return 3*e*e*i*t}function Gm(i,t){return 3*(1-i)*i*i*t}function Wm(i,t){return i*i*i*t}function ds(i,t,e,n,s){return Hm(i,t)+Vm(i,e)+Gm(i,n)+Wm(i,s)}var Pr=class extends ln{constructor(t=new xt,e=new xt,n=new xt,s=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(t,s.x,r.x,o.x,a.x),ds(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},to=class extends ln{constructor(t=new V,e=new V,n=new V,s=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new V){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(t,s.x,r.x,o.x,a.x),ds(t,s.y,r.y,o.y,a.y),ds(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ir=class extends ln{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},eo=class extends ln{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ur=class extends ln{constructor(t=new xt,e=new xt,n=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(us(t,s.x,r.x,o.x),us(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},no=class extends ln{constructor(t=new V,e=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new V){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(us(t,s.x,r.x,o.x),us(t,s.y,r.y,o.y),us(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Dr=class extends ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(tl(a,c.x,l.x,h.x,d.x),tl(a,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new xt().fromArray(s))}return this}},io=Object.freeze({__proto__:null,ArcCurve:ja,CatmullRomCurve3:Qa,CubicBezierCurve:Pr,CubicBezierCurve3:to,EllipseCurve:vs,LineCurve:Ir,LineCurve3:eo,QuadraticBezierCurve:Ur,QuadraticBezierCurve3:no,SplineCurve:Dr}),so=class extends ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new io[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new io[s.type]().fromJSON(s))}return this}},hn=class extends so{constructor(t){super(),this.type="Path",this.currentPoint=new xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ir(this.currentPoint.clone(),new xt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Ur(this.currentPoint.clone(),new xt(t,e),new xt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Pr(this.currentPoint.clone(),new xt(t,e),new xt(n,s),new xt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Dr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){let l=new vs(t,e,n,s,r,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var en=class extends hn{constructor(t){super(t),this.uuid=pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new hn().fromJSON(s))}return this}},Xm={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Pl(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,d,f,g;if(n&&(r=$m(i,t,r,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let x=e;x<s;x+=e)d=i[x],f=i[x+1],d<a&&(a=d),f<c&&(c=f),d>l&&(l=d),f>h&&(h=f);g=Math.max(l-a,h-c),g=g!==0?32767/g:0}return Ms(r,o,e,a,c,g,0),o}};function Pl(i,t,e,n,s){let r,o;if(s===o0(i,t,e,n)>0)for(r=t;r<e;r+=n)o=el(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=el(r,i[r],i[r+1],o);return o&&Wr(o,o.next)&&(bs(o),o=o.next),o}function hi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Wr(e,e.next)||ge(e.prev,e,e.next)===0)){if(bs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ms(i,t,e,n,s,r,o){if(!i)return;!o&&r&&e0(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?Ym(i,n,s,r):qm(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),bs(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Zm(hi(i),t,e),Ms(i,t,e,n,s,r,2)):o===2&&Jm(i,t,e,n,s,r):Ms(hi(i),t,e,n,s,r,1);break}}}function qm(i){let t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<c?a<l?a:l:c<l?c:l,f=s>r?s>o?s:o:r>o?r:o,g=a>c?a>l?a:l:c>l?c:l,x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=f&&x.y>=d&&x.y<=g&&Fi(s,a,r,c,o,l,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Ym(i,t,e,n){let s=i.prev,r=i,o=i.next;if(ge(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,f=o.y,g=a<c?a<l?a:l:c<l?c:l,x=h<d?h<f?h:f:d<f?d:f,y=a>c?a>l?a:l:c>l?c:l,p=h>d?h>f?h:f:d>f?d:f,u=ro(g,x,t,e,n),A=ro(y,p,t,e,n),_=i.prevZ,T=i.nextZ;for(;_&&_.z>=u&&T&&T.z<=A;){if(_.x>=g&&_.x<=y&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Fi(a,h,c,d,l,f,_.x,_.y)&&ge(_.prev,_,_.next)>=0||(_=_.prevZ,T.x>=g&&T.x<=y&&T.y>=x&&T.y<=p&&T!==s&&T!==o&&Fi(a,h,c,d,l,f,T.x,T.y)&&ge(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;_&&_.z>=u;){if(_.x>=g&&_.x<=y&&_.y>=x&&_.y<=p&&_!==s&&_!==o&&Fi(a,h,c,d,l,f,_.x,_.y)&&ge(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;T&&T.z<=A;){if(T.x>=g&&T.x<=y&&T.y>=x&&T.y<=p&&T!==s&&T!==o&&Fi(a,h,c,d,l,f,T.x,T.y)&&ge(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function Zm(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Wr(s,r)&&Il(s,n,n.next,r)&&Ss(s,r)&&Ss(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),bs(n),bs(n.next),n=i=r),n=n.next}while(n!==i);return hi(n)}function Jm(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&s0(o,a)){let c=Ul(o,a);o=hi(o,o.next),c=hi(c,c.next),Ms(o,t,e,n,s,r,0),Ms(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function $m(i,t,e,n){let s=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Pl(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(i0(l));for(s.sort(Km),r=0;r<s.length;r++)e=jm(s[r],e);return e}function Km(i,t){return i.x-t.x}function jm(i,t){let e=Qm(i,t);if(!e)return t;let n=Ul(e,i);return hi(n,n.next),hi(e,e.next)}function Qm(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,d;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Fi(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(d=Math.abs(o-e.y)/(r-e.x),Ss(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&t0(s,e)))&&(s=e,h=d)),e=e.next;while(e!==a);return s}function t0(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function e0(i,t,e,n){let s=i;do s.z===0&&(s.z=ro(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,n0(s)}function n0(i){let t,e,n,s,r,o,a,c,l=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(o>1);return i}function ro(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function i0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Fi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function s0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!r0(i,t)&&(Ss(i,t)&&Ss(t,i)&&a0(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||Wr(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Wr(i,t){return i.x===t.x&&i.y===t.y}function Il(i,t,e,n){let s=sr(ge(i,t,e)),r=sr(ge(i,t,n)),o=sr(ge(e,n,i)),a=sr(ge(e,n,t));return!!(s!==r&&o!==a||s===0&&ir(i,e,t)||r===0&&ir(i,n,t)||o===0&&ir(e,i,n)||a===0&&ir(e,t,n))}function ir(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function sr(i){return i>0?1:i<0?-1:0}function r0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Il(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ss(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function a0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Ul(i,t){let e=new ao(i.i,i.x,i.y),n=new ao(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function el(i,t,e,n){let s=new ao(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ao(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function o0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Be=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];nl(t),il(n,t);let o=t.length;e.forEach(nl);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,il(n,e[c]);let a=Xm.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function nl(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function il(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var ui=class i extends nn{constructor(t=new en([new xt(.5,.5),new xt(-.5,.5),new xt(-.5,-.5),new xt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new Ye(s,3)),this.setAttribute("uv",new Ye(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,g=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:g-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,u=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:c0,_,T=!1,D,P,C,$;u&&(_=u.getSpacedPoints(h),T=!0,f=!1,D=u.computeFrenetFrames(h,!1),P=new V,C=new V,$=new V),f||(p=0,g=0,x=0,y=0);let S=a.extractPoints(l),w=S.shape,K=S.holes;if(!Be.isClockWise(w)){w=w.reverse();for(let L=0,nt=K.length;L<nt;L++){let O=K[L];Be.isClockWise(O)&&(K[L]=O.reverse())}}let _t=Be.triangulateShape(w,K),N=w;for(let L=0,nt=K.length;L<nt;L++){let O=K[L];w=w.concat(O)}function X(L,nt,O){return nt||console.error("THREE.ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(nt,O)}let j=w.length,J=_t.length;function B(L,nt,O){let q,W,pt,U=L.x-nt.x,m=L.y-nt.y,v=O.x-L.x,z=O.y-L.y,mt=U*U+m*m,gt=U*z-m*v;if(Math.abs(gt)>Number.EPSILON){let dt=Math.sqrt(mt),It=Math.sqrt(v*v+z*z),St=nt.x-m/dt,Ut=nt.y+U/dt,zt=O.x-z/It,kt=O.y+v/It,yt=((zt-St)*z-(kt-Ut)*v)/(U*z-m*v);q=St+U*yt-L.x,W=Ut+m*yt-L.y;let ie=q*q+W*W;if(ie<=2)return new xt(q,W);pt=Math.sqrt(ie/2)}else{let dt=!1;U>Number.EPSILON?v>Number.EPSILON&&(dt=!0):U<-Number.EPSILON?v<-Number.EPSILON&&(dt=!0):Math.sign(m)===Math.sign(z)&&(dt=!0),dt?(q=-m,W=U,pt=Math.sqrt(mt)):(q=U,W=m,pt=Math.sqrt(mt/2))}return new xt(q/pt,W/pt)}let st=[];for(let L=0,nt=N.length,O=nt-1,q=L+1;L<nt;L++,O++,q++)O===nt&&(O=0),q===nt&&(q=0),st[L]=B(N[L],N[O],N[q]);let lt=[],ut,Mt=st.concat();for(let L=0,nt=K.length;L<nt;L++){let O=K[L];ut=[];for(let q=0,W=O.length,pt=W-1,U=q+1;q<W;q++,pt++,U++)pt===W&&(pt=0),U===W&&(U=0),ut[q]=B(O[q],O[pt],O[U]);lt.push(ut),Mt=Mt.concat(ut)}for(let L=0;L<p;L++){let nt=L/p,O=g*Math.cos(nt*Math.PI/2),q=x*Math.sin(nt*Math.PI/2)+y;for(let W=0,pt=N.length;W<pt;W++){let U=X(N[W],st[W],q);M(U.x,U.y,-O)}for(let W=0,pt=K.length;W<pt;W++){let U=K[W];ut=lt[W];for(let m=0,v=U.length;m<v;m++){let z=X(U[m],ut[m],q);M(z.x,z.y,-O)}}}let at=x+y;for(let L=0;L<j;L++){let nt=f?X(w[L],Mt[L],at):w[L];T?(C.copy(D.normals[0]).multiplyScalar(nt.x),P.copy(D.binormals[0]).multiplyScalar(nt.y),$.copy(_[0]).add(C).add(P),M($.x,$.y,$.z)):M(nt.x,nt.y,0)}for(let L=1;L<=h;L++)for(let nt=0;nt<j;nt++){let O=f?X(w[nt],Mt[nt],at):w[nt];T?(C.copy(D.normals[L]).multiplyScalar(O.x),P.copy(D.binormals[L]).multiplyScalar(O.y),$.copy(_[L]).add(C).add(P),M($.x,$.y,$.z)):M(O.x,O.y,d/h*L)}for(let L=p-1;L>=0;L--){let nt=L/p,O=g*Math.cos(nt*Math.PI/2),q=x*Math.sin(nt*Math.PI/2)+y;for(let W=0,pt=N.length;W<pt;W++){let U=X(N[W],st[W],q);M(U.x,U.y,d+O)}for(let W=0,pt=K.length;W<pt;W++){let U=K[W];ut=lt[W];for(let m=0,v=U.length;m<v;m++){let z=X(U[m],ut[m],q);T?M(z.x,z.y+_[h-1].y,_[h-1].x+O):M(z.x,z.y,d+O)}}}I(),R();function I(){let L=s.length/3;if(f){let nt=0,O=j*nt;for(let q=0;q<J;q++){let W=_t[q];tt(W[2]+O,W[1]+O,W[0]+O)}nt=h+p*2,O=j*nt;for(let q=0;q<J;q++){let W=_t[q];tt(W[0]+O,W[1]+O,W[2]+O)}}else{for(let nt=0;nt<J;nt++){let O=_t[nt];tt(O[2],O[1],O[0])}for(let nt=0;nt<J;nt++){let O=_t[nt];tt(O[0]+j*h,O[1]+j*h,O[2]+j*h)}}n.addGroup(L,s.length/3-L,0)}function R(){let L=s.length/3,nt=0;E(N,nt),nt+=N.length;for(let O=0,q=K.length;O<q;O++){let W=K[O];E(W,nt),nt+=W.length}n.addGroup(L,s.length/3-L,1)}function E(L,nt){let O=L.length;for(;--O>=0;){let q=O,W=O-1;W<0&&(W=L.length-1);for(let pt=0,U=h+p*2;pt<U;pt++){let m=j*pt,v=j*(pt+1),z=nt+q+m,mt=nt+W+m,gt=nt+W+v,dt=nt+q+v;ft(z,mt,gt,dt)}}}function M(L,nt,O){c.push(L),c.push(nt),c.push(O)}function tt(L,nt,O){H(L),H(nt),H(O);let q=s.length/3,W=A.generateTopUV(n,s,q-3,q-2,q-1);ot(W[0]),ot(W[1]),ot(W[2])}function ft(L,nt,O,q){H(L),H(nt),H(q),H(nt),H(O),H(q);let W=s.length/3,pt=A.generateSideWallUV(n,s,W-6,W-3,W-2,W-1);ot(pt[0]),ot(pt[1]),ot(pt[3]),ot(pt[1]),ot(pt[2]),ot(pt[3])}function H(L){s.push(c[L*3+0]),s.push(c[L*3+1]),s.push(c[L*3+2])}function ot(L){r.push(L.x),r.push(L.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return l0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new io[s.type]().fromJSON(s)),new i(n,t.options)}},c0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new xt(r,o),new xt(a,c),new xt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],f=t[s*3],g=t[s*3+1],x=t[s*3+2],y=t[r*3],p=t[r*3+1],u=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new xt(o,1-c),new xt(l,1-d),new xt(f,1-x),new xt(y,1-u)]:[new xt(a,1-c),new xt(h,1-d),new xt(g,1-x),new xt(p,1-u)]}};function l0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var oo=class extends Kn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vl,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Nr=class extends oo{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ie(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function rr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function h0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var $i=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},co=class extends $i{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:cc,endingEnd:cc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case lc:r=t,a=2*e-n;break;case hc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case lc:o=t,c=2*n-e;break;case hc:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,g=this._weightNext,x=(n-e)/(s-e),y=x*x,p=y*x,u=-f*p+2*f*y-f*x,A=(1+f)*p+(-1.5-2*f)*y+(-.5+f)*x+1,_=(-1-g)*p+(1.5+g)*y+.5*x,T=g*p-g*y;for(let D=0;D!==a;++D)r[D]=u*o[h+D]+A*o[l+D]+_*o[c+D]+T*o[d+D];return r}},lo=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*d+o[c+f]*h;return r}},ho=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},xn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=rr(e,this.TimeBufferType),this.values=rr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:rr(t.times,Array),values:rr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ho(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new lo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new co(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case cr:e=this.InterpolantFactoryMethodDiscrete;break;case lr:e=this.InterpolantFactoryMethodLinear;break;case ea:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return cr;case this.InterpolantFactoryMethodLinear:return lr;case this.InterpolantFactoryMethodSmooth:return ea}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&h0(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ea,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let d=a*n,f=d-n,g=d+n;for(let x=0;x!==n;++x){let y=e[d+x];if(y!==e[f+x]||y!==e[g+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let g=0;g!==n;++g)e[f+g]=e[d+g]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=lr;var di=class extends xn{};di.prototype.ValueTypeName="bool";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=cr;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var uo=class extends xn{};uo.prototype.ValueTypeName="color";var fo=class extends xn{};fo.prototype.ValueTypeName="number";var po=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)$n.slerpFlat(r,0,o,l-a,o,l,c);return r}},Es=class extends xn{InterpolantFactoryMethodLinear(t){return new po(this.times,this.values,this.getValueSize(),t)}};Es.prototype.ValueTypeName="quaternion";Es.prototype.DefaultInterpolation=lr;Es.prototype.InterpolantFactoryMethodSmooth=void 0;var fi=class extends xn{};fi.prototype.ValueTypeName="string";fi.prototype.ValueBufferType=Array;fi.prototype.DefaultInterpolation=cr;fi.prototype.InterpolantFactoryMethodLinear=void 0;fi.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends xn{};mo.prototype.ValueTypeName="vector";var sl={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},go=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){let g=l[d],x=l[d+1];if(g.global&&(g.lastIndex=0),g.test(h))return x}return null}}},u0=new go,Ki=class{constructor(t){this.manager=t!==void 0?t:u0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Ki.DEFAULT_MATERIAL_NAME="__DEFAULT";var Cn={},_o=class extends Error{constructor(t,e){super(t),this.response=e}},Or=class extends Ki{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=sl.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Cn[t]!==void 0){Cn[t].push({onLoad:e,onProgress:n,onError:s});return}Cn[t]=[],Cn[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=Cn[t],d=l.body.getReader(),f=l.headers.get("Content-Length")||l.headers.get("X-File-Size"),g=f?parseInt(f):0,x=g!==0,y=0,p=new ReadableStream({start(u){A();function A(){d.read().then(({done:_,value:T})=>{if(_)u.close();else{y+=T.byteLength;let D=new ProgressEvent("progress",{lengthComputable:x,loaded:y,total:g});for(let P=0,C=h.length;P<C;P++){let $=h[P];$.onProgress&&$.onProgress(D)}u.enqueue(T),A()}})}}});return new Response(p)}else throw new _o(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),f=d&&d[1]?d[1].toLowerCase():void 0,g=new TextDecoder(f);return l.arrayBuffer().then(x=>g.decode(x))}}}).then(l=>{sl.add(t,l);let h=Cn[t];delete Cn[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onLoad&&g.onLoad(l)}}).catch(l=>{let h=Cn[t];if(h===void 0)throw this.manager.itemError(t),l;delete Cn[t];for(let d=0,f=h.length;d<f;d++){let g=h[d];g.onError&&g.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var ws=class extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}};var La=new be,rl=new V,al=new V,Fr=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gs,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;rl.setFromMatrixPosition(t.matrixWorld),e.position.copy(rl),al.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(al),e.updateMatrixWorld(),La.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(La),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(La)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},xo=class extends Fr{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Wi*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},Br=class extends ws{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new xo}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var yo=class extends Fr{constructor(){super(new Tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ts=class extends ws{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new yo}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},zr=class extends ws{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var kr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ol(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=ol();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function ol(){return(typeof performance>"u"?Date:performance).now()}var Ao="\\[\\]\\.:\\/",d0=new RegExp("["+Ao+"]","g"),Ro="[^"+Ao+"]",f0="[^"+Ao.replace("\\.","")+"]",p0=/((?:WC+[\/:])*)/.source.replace("WC",Ro),m0=/(WCOD+)?/.source.replace("WCOD",f0),g0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ro),_0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ro),x0=new RegExp("^"+p0+m0+g0+_0+"$"),y0=["material","materials","bones","map"],vo=class{constructor(t,e,n){let s=n||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(d0,"")}static parseTrackName(t){let e=x0.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);y0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=vo;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var b0=new Float32Array(1);var cl=new xt,un=class{constructor(t=new xt(1/0,1/0),e=new xt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=cl.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,cl).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}};var Sn=class{constructor(){this.type="ShapePath",this.color=new $t,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new hn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,s){return this.currentPath.quadraticCurveTo(t,e,n,s),this}bezierCurveTo(t,e,n,s,r,o){return this.currentPath.bezierCurveTo(t,e,n,s,r,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(u){let A=[];for(let _=0,T=u.length;_<T;_++){let D=u[_],P=new en;P.curves=D.curves,A.push(P)}return A}function n(u,A){let _=A.length,T=!1;for(let D=_-1,P=0;P<_;D=P++){let C=A[D],$=A[P],S=$.x-C.x,w=$.y-C.y;if(Math.abs(w)>Number.EPSILON){if(w<0&&(C=A[P],S=-S,$=A[D],w=-w),u.y<C.y||u.y>$.y)continue;if(u.y===C.y){if(u.x===C.x)return!0}else{let K=w*(u.x-C.x)-S*(u.y-C.y);if(K===0)return!0;if(K<0)continue;T=!T}}else{if(u.y!==C.y)continue;if($.x<=u.x&&u.x<=C.x||C.x<=u.x&&u.x<=$.x)return!0}}return T}let s=Be.isClockWise,r=this.subPaths;if(r.length===0)return[];let o,a,c,l=[];if(r.length===1)return a=r[0],c=new en,c.curves=a.curves,l.push(c),l;let h=!s(r[0].getPoints());h=t?!h:h;let d=[],f=[],g=[],x=0,y;f[x]=void 0,g[x]=[];for(let u=0,A=r.length;u<A;u++)a=r[u],y=a.getPoints(),o=s(y),o=t?!o:o,o?(!h&&f[x]&&x++,f[x]={s:new en,p:y},f[x].s.curves=a.curves,h&&x++,g[x]=[]):g[x].push({h:a,p:y[0]});if(!f[0])return e(r);if(f.length>1){let u=!1,A=0;for(let _=0,T=f.length;_<T;_++)d[_]=[];for(let _=0,T=f.length;_<T;_++){let D=g[_];for(let P=0;P<D.length;P++){let C=D[P],$=!0;for(let S=0;S<f.length;S++)n(C.p,f[S].p)&&(_!==S&&A++,$?($=!1,d[S].push(C)):u=!0);$&&d[_].push(C)}}A>0&&u===!1&&(g=d)}let p;for(let u=0,A=f.length;u<A;u++){c=f[u].s,l.push(c),p=g[u];for(let _=0,T=p.length;_<T;_++)c.holes.push(p[_].h)}return l}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var M0=Ee,Xr=class i extends Ki{constructor(t){super(t),this.defaultDPI=90,this.defaultUnit="px"}load(t,e,n,s){let r=this,o=new Or(r.manager);o.setPath(r.path),o.setRequestHeader(r.requestHeader),o.setWithCredentials(r.withCredentials),o.load(t,function(a){try{e(r.parse(a))}catch(c){s?s(c):console.error(c),r.manager.itemError(t)}},n,s)}parse(t){let e=this;function n(I,R){if(I.nodeType!==1)return;let E=T(I),M=!1,tt=null;switch(I.nodeName){case"svg":R=x(I,R);break;case"style":r(I);break;case"g":R=x(I,R);break;case"path":R=x(I,R),I.hasAttribute("d")&&(tt=s(I));break;case"rect":R=x(I,R),tt=c(I);break;case"polygon":R=x(I,R),tt=l(I);break;case"polyline":R=x(I,R),tt=h(I);break;case"circle":R=x(I,R),tt=d(I);break;case"ellipse":R=x(I,R),tt=f(I);break;case"line":R=x(I,R),tt=g(I);break;case"defs":M=!0;break;case"use":R=x(I,R);let ot=(I.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),L=I.viewportElement.getElementById(ot);L?n(L,R):console.warn("SVGLoader: 'use node' references non-existent node id: "+ot);break;default:}tt&&(R.fill!==void 0&&R.fill!=="none"&&tt.color.setStyle(R.fill,M0),P(tt,ut),Q.push(tt),tt.userData={node:I,style:R});let ft=I.childNodes;for(let H=0;H<ft.length;H++){let ot=ft[H];M&&ot.nodeName!=="style"&&ot.nodeName!=="defs"||n(ot,R)}E&&(N.pop(),N.length>0?ut.copy(N[N.length-1]):ut.identity())}function s(I){let R=new Sn,E=new xt,M=new xt,tt=new xt,ft=!0,H=!1,ot=I.getAttribute("d");if(ot===""||ot==="none")return null;let L=ot.match(/[a-df-z][^a-df-z]*/ig);for(let nt=0,O=L.length;nt<O;nt++){let q=L[nt],W=q.charAt(0),pt=q.slice(1).trim();ft===!0&&(H=!0,ft=!1);let U;switch(W){case"M":U=p(pt);for(let m=0,v=U.length;m<v;m+=2)E.x=U[m+0],E.y=U[m+1],M.x=E.x,M.y=E.y,m===0?R.moveTo(E.x,E.y):R.lineTo(E.x,E.y),m===0&&tt.copy(E);break;case"H":U=p(pt);for(let m=0,v=U.length;m<v;m++)E.x=U[m],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"V":U=p(pt);for(let m=0,v=U.length;m<v;m++)E.y=U[m],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"L":U=p(pt);for(let m=0,v=U.length;m<v;m+=2)E.x=U[m+0],E.y=U[m+1],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"C":U=p(pt);for(let m=0,v=U.length;m<v;m+=6)R.bezierCurveTo(U[m+0],U[m+1],U[m+2],U[m+3],U[m+4],U[m+5]),M.x=U[m+2],M.y=U[m+3],E.x=U[m+4],E.y=U[m+5],m===0&&H===!0&&tt.copy(E);break;case"S":U=p(pt);for(let m=0,v=U.length;m<v;m+=4)R.bezierCurveTo(y(E.x,M.x),y(E.y,M.y),U[m+0],U[m+1],U[m+2],U[m+3]),M.x=U[m+0],M.y=U[m+1],E.x=U[m+2],E.y=U[m+3],m===0&&H===!0&&tt.copy(E);break;case"Q":U=p(pt);for(let m=0,v=U.length;m<v;m+=4)R.quadraticCurveTo(U[m+0],U[m+1],U[m+2],U[m+3]),M.x=U[m+0],M.y=U[m+1],E.x=U[m+2],E.y=U[m+3],m===0&&H===!0&&tt.copy(E);break;case"T":U=p(pt);for(let m=0,v=U.length;m<v;m+=2){let z=y(E.x,M.x),mt=y(E.y,M.y);R.quadraticCurveTo(z,mt,U[m+0],U[m+1]),M.x=z,M.y=mt,E.x=U[m+0],E.y=U[m+1],m===0&&H===!0&&tt.copy(E)}break;case"A":U=p(pt,[3,4],7);for(let m=0,v=U.length;m<v;m+=7){if(U[m+5]==E.x&&U[m+6]==E.y)continue;let z=E.clone();E.x=U[m+5],E.y=U[m+6],M.x=E.x,M.y=E.y,o(R,U[m],U[m+1],U[m+2],U[m+3],U[m+4],z,E),m===0&&H===!0&&tt.copy(E)}break;case"m":U=p(pt);for(let m=0,v=U.length;m<v;m+=2)E.x+=U[m+0],E.y+=U[m+1],M.x=E.x,M.y=E.y,m===0?R.moveTo(E.x,E.y):R.lineTo(E.x,E.y),m===0&&tt.copy(E);break;case"h":U=p(pt);for(let m=0,v=U.length;m<v;m++)E.x+=U[m],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"v":U=p(pt);for(let m=0,v=U.length;m<v;m++)E.y+=U[m],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"l":U=p(pt);for(let m=0,v=U.length;m<v;m+=2)E.x+=U[m+0],E.y+=U[m+1],M.x=E.x,M.y=E.y,R.lineTo(E.x,E.y),m===0&&H===!0&&tt.copy(E);break;case"c":U=p(pt);for(let m=0,v=U.length;m<v;m+=6)R.bezierCurveTo(E.x+U[m+0],E.y+U[m+1],E.x+U[m+2],E.y+U[m+3],E.x+U[m+4],E.y+U[m+5]),M.x=E.x+U[m+2],M.y=E.y+U[m+3],E.x+=U[m+4],E.y+=U[m+5],m===0&&H===!0&&tt.copy(E);break;case"s":U=p(pt);for(let m=0,v=U.length;m<v;m+=4)R.bezierCurveTo(y(E.x,M.x),y(E.y,M.y),E.x+U[m+0],E.y+U[m+1],E.x+U[m+2],E.y+U[m+3]),M.x=E.x+U[m+0],M.y=E.y+U[m+1],E.x+=U[m+2],E.y+=U[m+3],m===0&&H===!0&&tt.copy(E);break;case"q":U=p(pt);for(let m=0,v=U.length;m<v;m+=4)R.quadraticCurveTo(E.x+U[m+0],E.y+U[m+1],E.x+U[m+2],E.y+U[m+3]),M.x=E.x+U[m+0],M.y=E.y+U[m+1],E.x+=U[m+2],E.y+=U[m+3],m===0&&H===!0&&tt.copy(E);break;case"t":U=p(pt);for(let m=0,v=U.length;m<v;m+=2){let z=y(E.x,M.x),mt=y(E.y,M.y);R.quadraticCurveTo(z,mt,E.x+U[m+0],E.y+U[m+1]),M.x=z,M.y=mt,E.x=E.x+U[m+0],E.y=E.y+U[m+1],m===0&&H===!0&&tt.copy(E)}break;case"a":U=p(pt,[3,4],7);for(let m=0,v=U.length;m<v;m+=7){if(U[m+5]==0&&U[m+6]==0)continue;let z=E.clone();E.x+=U[m+5],E.y+=U[m+6],M.x=E.x,M.y=E.y,o(R,U[m],U[m+1],U[m+2],U[m+3],U[m+4],z,E),m===0&&H===!0&&tt.copy(E)}break;case"Z":case"z":R.currentPath.autoClose=!0,R.currentPath.curves.length>0&&(E.copy(tt),R.currentPath.currentPoint.copy(E),ft=!0);break;default:console.warn(q)}H=!1}return R}function r(I){if(!(!I.sheet||!I.sheet.cssRules||!I.sheet.cssRules.length))for(let R=0;R<I.sheet.cssRules.length;R++){let E=I.sheet.cssRules[R];if(E.type!==1)continue;let M=E.selectorText.split(/,/gm).filter(Boolean).map(tt=>tt.trim());for(let tt=0;tt<M.length;tt++){let ft=Object.fromEntries(Object.entries(E.style).filter(([,H])=>H!==""));_t[M[tt]]=Object.assign(_t[M[tt]]||{},ft)}}}function o(I,R,E,M,tt,ft,H,ot){if(R==0||E==0){I.lineTo(ot.x,ot.y);return}M=M*Math.PI/180,R=Math.abs(R),E=Math.abs(E);let L=(H.x-ot.x)/2,nt=(H.y-ot.y)/2,O=Math.cos(M)*L+Math.sin(M)*nt,q=-Math.sin(M)*L+Math.cos(M)*nt,W=R*R,pt=E*E,U=O*O,m=q*q,v=U/W+m/pt;if(v>1){let yt=Math.sqrt(v);R=yt*R,E=yt*E,W=R*R,pt=E*E}let z=W*m+pt*U,mt=(W*pt-z)/z,gt=Math.sqrt(Math.max(0,mt));tt===ft&&(gt=-gt);let dt=gt*R*q/E,It=-gt*E*O/R,St=Math.cos(M)*dt-Math.sin(M)*It+(H.x+ot.x)/2,Ut=Math.sin(M)*dt+Math.cos(M)*It+(H.y+ot.y)/2,zt=a(1,0,(O-dt)/R,(q-It)/E),kt=a((O-dt)/R,(q-It)/E,(-O-dt)/R,(-q-It)/E)%(Math.PI*2);I.currentPath.absellipse(St,Ut,R,E,zt,zt+kt,ft===0,M)}function a(I,R,E,M){let tt=I*E+R*M,ft=Math.sqrt(I*I+R*R)*Math.sqrt(E*E+M*M),H=Math.acos(Math.max(-1,Math.min(1,tt/ft)));return I*M-R*E<0&&(H=-H),H}function c(I){let R=_(I.getAttribute("x")||0),E=_(I.getAttribute("y")||0),M=_(I.getAttribute("rx")||I.getAttribute("ry")||0),tt=_(I.getAttribute("ry")||I.getAttribute("rx")||0),ft=_(I.getAttribute("width")),H=_(I.getAttribute("height")),ot=1-.551915024494,L=new Sn;return L.moveTo(R+M,E),L.lineTo(R+ft-M,E),(M!==0||tt!==0)&&L.bezierCurveTo(R+ft-M*ot,E,R+ft,E+tt*ot,R+ft,E+tt),L.lineTo(R+ft,E+H-tt),(M!==0||tt!==0)&&L.bezierCurveTo(R+ft,E+H-tt*ot,R+ft-M*ot,E+H,R+ft-M,E+H),L.lineTo(R+M,E+H),(M!==0||tt!==0)&&L.bezierCurveTo(R+M*ot,E+H,R,E+H-tt*ot,R,E+H-tt),L.lineTo(R,E+tt),(M!==0||tt!==0)&&L.bezierCurveTo(R,E+tt*ot,R+M*ot,E,R+M,E),L}function l(I){function R(ft,H,ot){let L=_(H),nt=_(ot);tt===0?M.moveTo(L,nt):M.lineTo(L,nt),tt++}let E=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,M=new Sn,tt=0;return I.getAttribute("points").replace(E,R),M.currentPath.autoClose=!0,M}function h(I){function R(ft,H,ot){let L=_(H),nt=_(ot);tt===0?M.moveTo(L,nt):M.lineTo(L,nt),tt++}let E=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,M=new Sn,tt=0;return I.getAttribute("points").replace(E,R),M.currentPath.autoClose=!1,M}function d(I){let R=_(I.getAttribute("cx")||0),E=_(I.getAttribute("cy")||0),M=_(I.getAttribute("r")||0),tt=new hn;tt.absarc(R,E,M,0,Math.PI*2);let ft=new Sn;return ft.subPaths.push(tt),ft}function f(I){let R=_(I.getAttribute("cx")||0),E=_(I.getAttribute("cy")||0),M=_(I.getAttribute("rx")||0),tt=_(I.getAttribute("ry")||0),ft=new hn;ft.absellipse(R,E,M,tt,0,Math.PI*2);let H=new Sn;return H.subPaths.push(ft),H}function g(I){let R=_(I.getAttribute("x1")||0),E=_(I.getAttribute("y1")||0),M=_(I.getAttribute("x2")||0),tt=_(I.getAttribute("y2")||0),ft=new Sn;return ft.moveTo(R,E),ft.lineTo(M,tt),ft.currentPath.autoClose=!1,ft}function x(I,R){R=Object.assign({},R);let E={};if(I.hasAttribute("class")){let H=I.getAttribute("class").split(/\s/).filter(Boolean).map(ot=>ot.trim());for(let ot=0;ot<H.length;ot++)E=Object.assign(E,_t["."+H[ot]])}I.hasAttribute("id")&&(E=Object.assign(E,_t["#"+I.getAttribute("id")]));function M(H,ot,L){L===void 0&&(L=function(O){return O.startsWith("url")&&console.warn("SVGLoader: url access in attributes is not implemented."),O}),I.hasAttribute(H)&&(R[ot]=L(I.getAttribute(H))),E[H]&&(R[ot]=L(E[H])),I.style&&I.style[H]!==""&&(R[ot]=L(I.style[H]))}function tt(H){return Math.max(0,Math.min(1,_(H)))}function ft(H){return Math.max(0,_(H))}return M("fill","fill"),M("fill-opacity","fillOpacity",tt),M("fill-rule","fillRule"),M("opacity","opacity",tt),M("stroke","stroke"),M("stroke-opacity","strokeOpacity",tt),M("stroke-width","strokeWidth",ft),M("stroke-linejoin","strokeLineJoin"),M("stroke-linecap","strokeLineCap"),M("stroke-miterlimit","strokeMiterLimit",ft),M("visibility","visibility"),R}function y(I,R){return I-(R-I)}function p(I,R,E){if(typeof I!="string")throw new TypeError("Invalid input: "+typeof I);let M={SEPARATOR:/[ \t\r\n\,.\-+]/,WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},tt=0,ft=1,H=2,ot=3,L=tt,nt=!0,O="",q="",W=[];function pt(z,mt,gt){let dt=new SyntaxError('Unexpected character "'+z+'" at index '+mt+".");throw dt.partial=gt,dt}function U(){O!==""&&(q===""?W.push(Number(O)):W.push(Number(O)*Math.pow(10,Number(q)))),O="",q=""}let m,v=I.length;for(let z=0;z<v;z++){if(m=I[z],Array.isArray(R)&&R.includes(W.length%E)&&M.FLAGS.test(m)){L=ft,O=m,U();continue}if(L===tt){if(M.WHITESPACE.test(m))continue;if(M.DIGIT.test(m)||M.SIGN.test(m)){L=ft,O=m;continue}if(M.POINT.test(m)){L=H,O=m;continue}M.COMMA.test(m)&&(nt&&pt(m,z,W),nt=!0)}if(L===ft){if(M.DIGIT.test(m)){O+=m;continue}if(M.POINT.test(m)){O+=m,L=H;continue}if(M.EXP.test(m)){L=ot;continue}M.SIGN.test(m)&&O.length===1&&M.SIGN.test(O[0])&&pt(m,z,W)}if(L===H){if(M.DIGIT.test(m)){O+=m;continue}if(M.EXP.test(m)){L=ot;continue}M.POINT.test(m)&&O[O.length-1]==="."&&pt(m,z,W)}if(L===ot){if(M.DIGIT.test(m)){q+=m;continue}if(M.SIGN.test(m)){if(q===""){q+=m;continue}q.length===1&&M.SIGN.test(q)&&pt(m,z,W)}}M.WHITESPACE.test(m)?(U(),L=tt,nt=!1):M.COMMA.test(m)?(U(),L=tt,nt=!0):M.SIGN.test(m)?(U(),L=ft,O=m):M.POINT.test(m)?(U(),L=H,O=m):pt(m,z,W)}return U(),W}let u=["mm","cm","in","pt","pc","px"],A={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function _(I){let R="px";if(typeof I=="string"||I instanceof String)for(let M=0,tt=u.length;M<tt;M++){let ft=u[M];if(I.endsWith(ft)){R=ft,I=I.substring(0,I.length-ft.length);break}}let E;return R==="px"&&e.defaultUnit!=="px"?E=A.in[e.defaultUnit]/e.defaultDPI:(E=A[R][e.defaultUnit],E<0&&(E=A[R].in*e.defaultDPI)),E*parseFloat(I)}function T(I){if(!(I.hasAttribute("transform")||I.nodeName==="use"&&(I.hasAttribute("x")||I.hasAttribute("y"))))return null;let R=D(I);return N.length>0&&R.premultiply(N[N.length-1]),ut.copy(R),N.push(R),R}function D(I){let R=new Jt,E=X;if(I.nodeName==="use"&&(I.hasAttribute("x")||I.hasAttribute("y"))){let M=_(I.getAttribute("x")),tt=_(I.getAttribute("y"));R.translate(M,tt)}if(I.hasAttribute("transform")){let M=I.getAttribute("transform").split(")");for(let tt=M.length-1;tt>=0;tt--){let ft=M[tt].trim();if(ft==="")continue;let H=ft.indexOf("("),ot=ft.length;if(H>0&&H<ot){let L=ft.slice(0,H),nt=p(ft.slice(H+1));switch(E.identity(),L){case"translate":if(nt.length>=1){let O=nt[0],q=0;nt.length>=2&&(q=nt[1]),E.translate(O,q)}break;case"rotate":if(nt.length>=1){let O=0,q=0,W=0;O=nt[0]*Math.PI/180,nt.length>=3&&(q=nt[1],W=nt[2]),j.makeTranslation(-q,-W),J.makeRotation(O),B.multiplyMatrices(J,j),j.makeTranslation(q,W),E.multiplyMatrices(j,B)}break;case"scale":if(nt.length>=1){let O=nt[0],q=O;nt.length>=2&&(q=nt[1]),E.scale(O,q)}break;case"skewX":nt.length===1&&E.set(1,Math.tan(nt[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":nt.length===1&&E.set(1,0,0,Math.tan(nt[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":nt.length===6&&E.set(nt[0],nt[2],nt[4],nt[1],nt[3],nt[5],0,0,1);break}}R.premultiply(E)}}return R}function P(I,R){function E(H){lt.set(H.x,H.y,1).applyMatrix3(R),H.set(lt.x,lt.y)}function M(H){let ot=H.xRadius,L=H.yRadius,nt=Math.cos(H.aRotation),O=Math.sin(H.aRotation),q=new V(ot*nt,ot*O,0),W=new V(-L*O,L*nt,0),pt=q.applyMatrix3(R),U=W.applyMatrix3(R),m=X.set(pt.x,U.x,0,pt.y,U.y,0,0,0,1),v=j.copy(m).invert(),gt=J.copy(v).transpose().multiply(v).elements,dt=K(gt[0],gt[1],gt[4]),It=Math.sqrt(dt.rt1),St=Math.sqrt(dt.rt2);if(H.xRadius=1/It,H.yRadius=1/St,H.aRotation=Math.atan2(dt.sn,dt.cs),!((H.aEndAngle-H.aStartAngle)%(2*Math.PI)<Number.EPSILON)){let zt=j.set(It,0,0,0,St,0,0,0,1),kt=J.set(dt.cs,dt.sn,0,-dt.sn,dt.cs,0,0,0,1),yt=zt.multiply(kt).multiply(m),ie=Kt=>{let{x:Ft,y:Lt}=new V(Math.cos(Kt),Math.sin(Kt),0).applyMatrix3(yt);return Math.atan2(Lt,Ft)};H.aStartAngle=ie(H.aStartAngle),H.aEndAngle=ie(H.aEndAngle),C(R)&&(H.aClockwise=!H.aClockwise)}}function tt(H){let ot=S(R),L=w(R);H.xRadius*=ot,H.yRadius*=L;let nt=ot>Number.EPSILON?Math.atan2(R.elements[1],R.elements[0]):Math.atan2(-R.elements[3],R.elements[4]);H.aRotation+=nt,C(R)&&(H.aStartAngle*=-1,H.aEndAngle*=-1,H.aClockwise=!H.aClockwise)}let ft=I.subPaths;for(let H=0,ot=ft.length;H<ot;H++){let nt=ft[H].curves;for(let O=0;O<nt.length;O++){let q=nt[O];q.isLineCurve?(E(q.v1),E(q.v2)):q.isCubicBezierCurve?(E(q.v0),E(q.v1),E(q.v2),E(q.v3)):q.isQuadraticBezierCurve?(E(q.v0),E(q.v1),E(q.v2)):q.isEllipseCurve&&(st.set(q.aX,q.aY),E(st),q.aX=st.x,q.aY=st.y,$(R)?M(q):tt(q))}}}function C(I){let R=I.elements;return R[0]*R[4]-R[1]*R[3]<0}function $(I){let R=I.elements,E=R[0]*R[3]+R[1]*R[4];if(E===0)return!1;let M=S(I),tt=w(I);return Math.abs(E/(M*tt))>Number.EPSILON}function S(I){let R=I.elements;return Math.sqrt(R[0]*R[0]+R[1]*R[1])}function w(I){let R=I.elements;return Math.sqrt(R[3]*R[3]+R[4]*R[4])}function K(I,R,E){let M,tt,ft,H,ot,L=I+E,nt=I-E,O=Math.sqrt(nt*nt+4*R*R);return L>0?(M=.5*(L+O),ot=1/M,tt=I*ot*E-R*ot*R):L<0?tt=.5*(L-O):(M=.5*O,tt=-.5*O),nt>0?ft=nt+O:ft=nt-O,Math.abs(ft)>2*Math.abs(R)?(ot=-2*R/ft,H=1/Math.sqrt(1+ot*ot),ft=ot*H):Math.abs(R)===0?(ft=1,H=0):(ot=-.5*ft/R,ft=1/Math.sqrt(1+ot*ot),H=ot*ft),nt>0&&(ot=ft,ft=-H,H=ot),{rt1:M,rt2:tt,cs:ft,sn:H}}let Q=[],_t={},N=[],X=new Jt,j=new Jt,J=new Jt,B=new Jt,st=new xt,lt=new V,ut=new Jt,Mt=new DOMParser().parseFromString(t,"image/svg+xml");return n(Mt.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:Q,xml:Mt.documentElement}}static createShapes(t){let n={ORIGIN:0,DESTINATION:1,BETWEEN:2,LEFT:3,RIGHT:4,BEHIND:5,BEYOND:6},s={loc:n.ORIGIN,t:0};function r(y,p,u,A){let _=y.x,T=p.x,D=u.x,P=A.x,C=y.y,$=p.y,S=u.y,w=A.y,K=(P-D)*(C-S)-(w-S)*(_-D),Q=(T-_)*(C-S)-($-C)*(_-D),_t=(w-S)*(T-_)-(P-D)*($-C),N=K/_t,X=Q/_t;if(_t===0&&K!==0||N<=0||N>=1||X<0||X>1)return null;if(K===0&&_t===0){for(let j=0;j<2;j++)if(o(j===0?u:A,y,p),s.loc==n.ORIGIN){let J=j===0?u:A;return{x:J.x,y:J.y,t:s.t}}else if(s.loc==n.BETWEEN){let J=+(_+s.t*(T-_)).toPrecision(10),B=+(C+s.t*($-C)).toPrecision(10);return{x:J,y:B,t:s.t}}return null}else{for(let B=0;B<2;B++)if(o(B===0?u:A,y,p),s.loc==n.ORIGIN){let st=B===0?u:A;return{x:st.x,y:st.y,t:s.t}}let j=+(_+N*(T-_)).toPrecision(10),J=+(C+N*($-C)).toPrecision(10);return{x:j,y:J,t:N}}}function o(y,p,u){let A=u.x-p.x,_=u.y-p.y,T=y.x-p.x,D=y.y-p.y,P=A*D-T*_;if(y.x===p.x&&y.y===p.y){s.loc=n.ORIGIN,s.t=0;return}if(y.x===u.x&&y.y===u.y){s.loc=n.DESTINATION,s.t=1;return}if(P<-Number.EPSILON){s.loc=n.LEFT;return}if(P>Number.EPSILON){s.loc=n.RIGHT;return}if(A*T<0||_*D<0){s.loc=n.BEHIND;return}if(Math.sqrt(A*A+_*_)<Math.sqrt(T*T+D*D)){s.loc=n.BEYOND;return}let C;A!==0?C=T/A:C=D/_,s.loc=n.BETWEEN,s.t=C}function a(y,p){let u=[],A=[];for(let _=1;_<y.length;_++){let T=y[_-1],D=y[_];for(let P=1;P<p.length;P++){let C=p[P-1],$=p[P],S=r(T,D,C,$);S!==null&&u.find(w=>w.t<=S.t+Number.EPSILON&&w.t>=S.t-Number.EPSILON)===void 0&&(u.push(S),A.push(new xt(S.x,S.y)))}}return A}function c(y,p,u){let A=new xt;p.getCenter(A);let _=[];return u.forEach(T=>{T.boundingBox.containsPoint(A)&&a(y,T.points).forEach(P=>{_.push({identifier:T.identifier,isCW:T.isCW,point:P})})}),_.sort((T,D)=>T.point.x-D.point.x),_}function l(y,p,u,A,_){(_==null||_==="")&&(_="nonzero");let T=new xt;y.boundingBox.getCenter(T);let D=[new xt(u,T.y),new xt(A,T.y)],P=c(D,y.boundingBox,p);P.sort((Q,_t)=>Q.point.x-_t.point.x);let C=[],$=[];P.forEach(Q=>{Q.identifier===y.identifier?C.push(Q):$.push(Q)});let S=C[0].point.x,w=[],K=0;for(;K<$.length&&$[K].point.x<S;)w.length>0&&w[w.length-1]===$[K].identifier?w.pop():w.push($[K].identifier),K++;if(w.push(y.identifier),_==="evenodd"){let Q=w.length%2===0,_t=w[w.length-2];return{identifier:y.identifier,isHole:Q,for:_t}}else if(_==="nonzero"){let Q=!0,_t=null,N=null;for(let X=0;X<w.length;X++){let j=w[X];Q?(N=p[j].isCW,Q=!1,_t=j):N!==p[j].isCW&&(N=p[j].isCW,Q=!0)}return{identifier:y.identifier,isHole:Q,for:_t}}else console.warn('fill-rule: "'+_+'" is currently not implemented.')}let h=999999999,d=-999999999,f=t.subPaths.map(y=>{let p=y.getPoints(),u=-999999999,A=999999999,_=-999999999,T=999999999;for(let D=0;D<p.length;D++){let P=p[D];P.y>u&&(u=P.y),P.y<A&&(A=P.y),P.x>_&&(_=P.x),P.x<T&&(T=P.x)}return d<=_&&(d=_+1),h>=T&&(h=T-1),{curves:y.curves,points:p,isCW:Be.isClockWise(p),identifier:-1,boundingBox:new un(new xt(T,A),new xt(_,u))}});f=f.filter(y=>y.points.length>1);for(let y=0;y<f.length;y++)f[y].identifier=y;let g=f.map(y=>l(y,f,h,d,t.userData?t.userData.style.fillRule:void 0)),x=[];return f.forEach(y=>{if(!g[y.identifier].isHole){let u=new en;u.curves=y.curves,g.filter(_=>_.isHole&&_.for===y.identifier).forEach(_=>{let T=f[_.identifier],D=new hn;D.curves=T.curves,u.holes.push(D)}),x.push(u)}}),x}static getStrokeStyle(t,e,n,s,r){return t=t!==void 0?t:1,e=e!==void 0?e:"#000",n=n!==void 0?n:"miter",s=s!==void 0?s:"butt",r=r!==void 0?r:4,{strokeColor:e,strokeWidth:t,strokeLineJoin:n,strokeLineCap:s,strokeMiterLimit:r}}static pointsToStroke(t,e,n,s){let r=[],o=[],a=[];if(i.pointsToStrokeWithBuffers(t,e,n,s,r,o,a)===0)return null;let c=new nn;return c.setAttribute("position",new Ye(r,3)),c.setAttribute("normal",new Ye(o,3)),c.setAttribute("uv",new Ye(a,2)),c}static pointsToStrokeWithBuffers(t,e,n,s,r,o,a,c){let l=new xt,h=new xt,d=new xt,f=new xt,g=new xt,x=new xt,y=new xt,p=new xt,u=new xt,A=new xt,_=new xt,T=new xt,D=new xt,P=new xt,C=new xt,$=new xt,S=new xt;n=n!==void 0?n:12,s=s!==void 0?s:.001,c=c!==void 0?c:0,t=nt(t);let w=t.length;if(w<2)return 0;let K=t[0].equals(t[w-1]),Q,_t=t[0],N,X=e.strokeWidth/2,j=1/(w-1),J=0,B,st,lt,ut,Mt=!1,at=0,I=c*3,R=c*2;E(t[0],t[1],l).multiplyScalar(X),p.copy(t[0]).sub(l),u.copy(t[0]).add(l),A.copy(p),_.copy(u);for(let O=1;O<w;O++){Q=t[O],O===w-1?K?N=t[1]:N=void 0:N=t[O+1];let q=l;if(E(_t,Q,q),d.copy(q).multiplyScalar(X),T.copy(Q).sub(d),D.copy(Q).add(d),B=J+j,st=!1,N!==void 0){E(Q,N,h),d.copy(h).multiplyScalar(X),P.copy(Q).sub(d),C.copy(Q).add(d),lt=!0,d.subVectors(N,_t),q.dot(d)<0&&(lt=!1),O===1&&(Mt=lt),d.subVectors(N,Q),d.normalize();let W=Math.abs(q.dot(d));if(W>Number.EPSILON){let pt=X/W;d.multiplyScalar(-pt),f.subVectors(Q,_t),g.copy(f).setLength(pt).add(d),$.copy(g).negate();let U=g.length(),m=f.length();f.divideScalar(m),x.subVectors(N,Q);let v=x.length();switch(x.divideScalar(v),f.dot($)<m&&x.dot($)<v&&(st=!0),S.copy(g).add(Q),$.add(Q),ut=!1,st?lt?(C.copy($),D.copy($)):(P.copy($),T.copy($)):ft(),e.strokeLineJoin){case"bevel":H(lt,st,B);break;case"round":ot(lt,st),lt?tt(Q,T,P,B,0):tt(Q,C,D,B,1);break;case"miter":case"miter-clip":default:let z=X*e.strokeMiterLimit/U;if(z<1)if(e.strokeLineJoin!=="miter-clip"){H(lt,st,B);break}else ot(lt,st),lt?(x.subVectors(S,T).multiplyScalar(z).add(T),y.subVectors(S,P).multiplyScalar(z).add(P),M(T,B,0),M(x,B,0),M(Q,B,.5),M(Q,B,.5),M(x,B,0),M(y,B,0),M(Q,B,.5),M(y,B,0),M(P,B,0)):(x.subVectors(S,D).multiplyScalar(z).add(D),y.subVectors(S,C).multiplyScalar(z).add(C),M(D,B,1),M(x,B,1),M(Q,B,.5),M(Q,B,.5),M(x,B,1),M(y,B,1),M(Q,B,.5),M(y,B,1),M(C,B,1));else st?(lt?(M(u,J,1),M(p,J,0),M(S,B,0),M(u,J,1),M(S,B,0),M($,B,1)):(M(u,J,1),M(p,J,0),M(S,B,1),M(p,J,0),M($,B,0),M(S,B,1)),lt?P.copy(S):C.copy(S)):lt?(M(T,B,0),M(S,B,0),M(Q,B,.5),M(Q,B,.5),M(S,B,0),M(P,B,0)):(M(D,B,1),M(S,B,1),M(Q,B,.5),M(Q,B,.5),M(S,B,1),M(C,B,1)),ut=!0;break}}else ft()}else ft();!K&&O===w-1&&L(t[0],A,_,lt,!0,J),J=B,_t=Q,p.copy(P),u.copy(C)}if(!K)L(Q,T,D,lt,!1,B);else if(st&&r){let O=S,q=$;Mt!==lt&&(O=$,q=S),lt?(ut||Mt)&&(q.toArray(r,0),q.toArray(r,9),ut&&O.toArray(r,3)):(ut||!Mt)&&(q.toArray(r,3),q.toArray(r,9),ut&&O.toArray(r,0))}return at;function E(O,q,W){return W.subVectors(q,O),W.set(-W.y,W.x).normalize()}function M(O,q,W){r&&(r[I]=O.x,r[I+1]=O.y,r[I+2]=0,o&&(o[I]=0,o[I+1]=0,o[I+2]=1),I+=3,a&&(a[R]=q,a[R+1]=W,R+=2)),at+=3}function tt(O,q,W,pt,U){l.copy(q).sub(O).normalize(),h.copy(W).sub(O).normalize();let m=Math.PI,v=l.dot(h);Math.abs(v)<1&&(m=Math.abs(Math.acos(v))),m/=n,d.copy(q);for(let z=0,mt=n-1;z<mt;z++)f.copy(d).rotateAround(O,m),M(d,pt,U),M(f,pt,U),M(O,pt,.5),d.copy(f);M(f,pt,U),M(W,pt,U),M(O,pt,.5)}function ft(){M(u,J,1),M(p,J,0),M(T,B,0),M(u,J,1),M(T,B,1),M(D,B,0)}function H(O,q,W){q?O?(M(u,J,1),M(p,J,0),M(T,B,0),M(u,J,1),M(T,B,0),M($,B,1),M(T,W,0),M(P,W,0),M($,W,.5)):(M(u,J,1),M(p,J,0),M(D,B,1),M(p,J,0),M($,B,0),M(D,B,1),M(D,W,1),M($,W,0),M(C,W,1)):O?(M(T,W,0),M(P,W,0),M(Q,W,.5)):(M(D,W,1),M(C,W,0),M(Q,W,.5))}function ot(O,q){q&&(O?(M(u,J,1),M(p,J,0),M(T,B,0),M(u,J,1),M(T,B,0),M($,B,1),M(T,J,0),M(Q,B,.5),M($,B,1),M(Q,B,.5),M(P,J,0),M($,B,1)):(M(u,J,1),M(p,J,0),M(D,B,1),M(p,J,0),M($,B,0),M(D,B,1),M(D,J,1),M($,B,0),M(Q,B,.5),M(Q,B,.5),M($,B,0),M(C,J,1)))}function L(O,q,W,pt,U,m){switch(e.strokeLineCap){case"round":U?tt(O,W,q,m,.5):tt(O,q,W,m,.5);break;case"square":if(U)l.subVectors(q,O),h.set(l.y,-l.x),d.addVectors(l,h).add(O),f.subVectors(h,l).add(O),pt?(d.toArray(r,3),f.toArray(r,0),f.toArray(r,9)):(d.toArray(r,3),d.toArray(r,9),f.toArray(r,0));else{l.subVectors(W,O),h.set(l.y,-l.x),d.addVectors(l,h).add(O),f.subVectors(h,l).add(O);let v=r.length;pt?(d.toArray(r,v-3),f.toArray(r,v-6),f.toArray(r,v-12)):(f.toArray(r,v-6),d.toArray(r,v-3),f.toArray(r,v-12))}break;case"butt":default:break}}function nt(O){let q=!1;for(let pt=1,U=O.length-1;pt<U;pt++)if(O[pt].distanceTo(O[pt+1])<s){q=!0;break}if(!q)return O;let W=[];W.push(O[0]);for(let pt=1,U=O.length-1;pt<U;pt++)O[pt].distanceTo(O[pt+1])>=s&&W.push(O[pt]);return W.push(O[O.length-1]),W}}};function S0({root:i,canvas:t,shape:e,palette:n,contactCard:s=null,fragments:r=4,onReady:o,autoplay:a=0,lateral:c=null,lift:l=0,scale:h=1,fit:d="window",pixelRatio:f=1.5,fps:g=0,object:x=!0}){let y=()=>d==="canvas"?{width:Math.max(1,t.clientWidth),height:Math.max(1,t.clientHeight)}:{width:window.innerWidth,height:window.innerHeight},p=performance.now(),u={shapes:[e],palette:n,fragments:r},A=!0,_=e,T=e,D=!1,P=[],C=(k,Z,G,ct)=>{k.addEventListener(Z,G,ct),P.push([k,Z,G,ct])},$=3.1,S=.44,w={size:.042,thickness:.052},K=A?$:2.9,Q=A?S:.5,_t=A?w:{size:.028,thickness:.038},N=.006,X,j,J,B,st=[],lt,ut,Mt=[],at=[],I=new kr,R=0,E=0,M=0,tt=i.querySelector(".scroll-stage"),ft=i.querySelector("[data-glass-after]"),H=s,ot,L,nt=6,O=16,q=30,W=.08,pt=.06,U=0,m=0,v=0,z=0,mt=window.innerWidth/2,gt=window.innerHeight/2,dt=window.innerWidth/2,It=window.innerHeight/2,St,Ut,kt={...Object.fromEntries(u.palette.map((k,Z)=>[`uC${Z}`,{value:new $t(k)}])),uTime:{value:0},uResolution:{value:new xt(window.innerWidth,window.innerHeight)},uMouse:{value:new xt(0,0)},uScroll:{value:0},uVelocity:{value:0}},yt,ie=450,Kt=[],Ft=y(),Lt=(k=0,Z=0)=>new xt(k,Z),Dt=(k,Z)=>k.x*Z.y-k.y*Z.x,Wt=yn.lerp;function re(){let k=document.createElement("canvas");k.width=16,k.height=16;let Z=k.getContext("2d"),G=Z.createRadialGradient(8,8,0,8,8,8);return G.addColorStop(0,"rgba(255, 255, 255, 1)"),G.addColorStop(.25,"rgba(255, 255, 255, 0.85)"),G.addColorStop(.6,"rgba(255, 255, 255, 0.3)"),G.addColorStop(1,"rgba(0, 0, 0, 0)"),Z.fillStyle=G,Z.fillRect(0,0,16,16),new Cr(k)}function fe(){let k=new nn,Z=new Float32Array(ie*3),G=new Float32Array(ie*3);for(let ht=0;ht<ie;ht++){let Et=(Math.random()-.5)*6.5,Ct=(Math.random()-.5)*5-.5,Pt=(Math.random()-.5)*6.5;Z[ht*3]=Et,Z[ht*3+1]=Ct,Z[ht*3+2]=Pt,Math.random()<.6?(G[ht*3]=.82+Math.random()*.18,G[ht*3+1]=.9+Math.random()*.1,G[ht*3+2]=1):(G[ht*3]=.78+Math.random()*.12,G[ht*3+1]=.5+Math.random()*.15,G[ht*3+2]=1),Kt.push({speedX:(Math.random()-.5)*.4,speedY:.15+Math.random()*.3,speedZ:(Math.random()-.5)*.4,swaySpeed:.5+Math.random()*1.5,swayRadius:.05+Math.random()*.15,phase:Math.random()*Math.PI*2})}k.setAttribute("position",new qe(Z,3)),k.setAttribute("color",new qe(G,3));let ct=new ys({size:.025,vertexColors:!0,transparent:!0,opacity:.4,blending:ar,depthWrite:!1,map:re()});yt=new Rr(k,ct),X.add(yt)}function ee(){let k=new xs;k.background=new $t("#080b10");let Z=[[2.8,8,-4,2,3,"#ffffff",2.6],[.65,7,3,1,2,"#dceeff",4],[5,.7,0,5,-1,"#ffffff",3.5],[.5,6,-2,0,-4,"#a78bfa",3],[1,5,3,-1,-3,"#ffc2e0",2.4],[4,.35,0,-3,3,"#92bbff",3],[.16,5,-3,0,2,"#ffffff",5],[.35,4,4,0,-2,"#ffb36b",2]];for(let[ht,Et,Ct,Pt,vt,wt,qt]of Z){let ne=new Fe(new Zi(ht,Et),new qi({color:new $t(wt).multiplyScalar(qt),side:an}));ne.position.set(Ct,Pt,vt),ne.lookAt(0,0,0),k.add(ne)}let G=new Ji(J),ct=G.fromScene(k,.025,.1,100);X.environment=ct.texture,k.traverse(ht=>{ht.isMesh&&(ht.geometry.dispose(),ht.material.dispose())}),G.dispose()}function bt(){let k=new Nr({color:"#fafcff",metalness:0,roughness:.025,transmission:1,thickness:.48,ior:1.46,attenuationColor:new $t("#edf7ff"),attenuationDistance:8,clearcoat:.65,clearcoatRoughness:.018,iridescence:.6,iridescenceIOR:1.3,iridescenceThicknessRange:[100,420],envMapIntensity:1.1,side:an});return k.onBeforeCompile=Z=>{Z.uniforms.uChromaticSpread={value:.018},Z.fragmentShader=`uniform float uChromaticSpread;
`+Z.fragmentShader;let G=jt.transmission_fragment.replace(/vec4 transmitted = getIBLVolumeRefraction\([\s\S]*?\);/,`// Keep the front faces clear, with spectral accents on grazing edges.
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
                (transmittedRed.a + transmitted.a + transmittedBlue.a) / 3.0);`);Z.fragmentShader=Z.fragmentShader.replace("#include <transmission_fragment>",G)},k.customProgramCacheKey=()=>"apple-clear-glass-edge-dispersion-v1",k}function F(k,Z=1e-4){let G=[];for(let ht of k)(!G.length||G[G.length-1].distanceTo(ht)>Z)&&G.push(ht.clone());for(;G.length>1&&G[0].distanceTo(G[G.length-1])<=Z;)G.pop();let ct=G.filter((ht,Et)=>{let Ct=G[(Et-1+G.length)%G.length],Pt=G[(Et+1)%G.length];return Math.abs(Dt(ht.clone().sub(Ct),Pt.clone().sub(ht)))>1e-7});return Be.isClockWise(ct)&&ct.reverse(),ct}function At(k,Z){let G=k.map(ct=>ct.clone());for(let{origin:ct,normal:ht}of Z){let Et=[];for(let Ct=0;Ct<G.length;Ct++){let Pt=G[Ct],vt=G[(Ct+1)%G.length],wt=Pt.clone().sub(ct).dot(ht),qt=vt.clone().sub(ct).dot(ht);wt>=0&&Et.push(Pt),wt>=0!=qt>=0&&Et.push(Pt.clone().lerp(vt,wt/(wt-qt)))}if(G=Et,!G.length)break}return F(G)}function Rt(k,Z,G){let ct=Ct=>Lt(Math.cos(yn.degToRad(Ct)),Math.sin(yn.degToRad(Ct))),ht=ct(Z),Et=ct(G);return[{origin:k,normal:Lt(-ht.y,ht.x)},{origin:k,normal:Lt(Et.y,-Et.x)}]}function Gt(k){let Z=new un().setFromPoints(k).getCenter(Lt());return{contour:k.map(G=>G.clone().sub(Z)),home:new V(Z.x,Z.y,0)}}function Ht(k,Z,G){let ct=new en(Mt);if(G>.02)for(let Et of at){let Ct=new un().setFromPoints(Et).getCenter(Lt());ct.holes.push(new hn(Et.map(Pt=>Pt.clone().sub(Ct).multiplyScalar(G).add(Ct))))}let ht=new ui(ct,{depth:Q,steps:1,bevelEnabled:!0,bevelSize:k,bevelThickness:Z,bevelSegments:6,curveSegments:24});return ht.translate(0,0,-Q/2),ht}function ae(k,Z,G,ct){let ht=new ui(new en(k),{depth:Z,steps:1,bevelEnabled:!0,bevelSize:G,bevelThickness:ct,bevelSegments:6,curveSegments:24});return ht.translate(0,0,-Z/2),ht}function oe(k,Z){let G=vt=>{let wt=vt.filter((se,Ot)=>Ot===0||se.distanceToSquared(vt[Ot-1])>1e-12);wt[0].distanceToSquared(wt[wt.length-1])<1e-12&&wt.pop(),Be.isClockWise(wt)&&wt.reverse();let qt=[Lt(-10,-10),Lt(10,-10),Lt(10,10),Lt(-10,10)];for(let se=0;se<wt.length;se++){let Ot=wt[se],Me=wt[(se+1)%wt.length].clone().sub(Ot),Re=[];for(let ye=0;ye<qt.length;ye++){let Ce=qt[ye],Oe=qt[(ye+1)%qt.length],xe=Dt(Me,Ce.clone().sub(Ot)),Je=Dt(Me,Oe.clone().sub(Ot));xe>=-1e-10&&Re.push(Ce),xe>=0!=Je>=0&&Re.push(Ce.clone().lerp(Oe,xe/(xe-Je)))}qt=Re}if(!qt.length)throw new Error("Contour has no visibility kernel.");let ne=qt.reduce((se,Ot)=>se.add(Ot),Lt()).multiplyScalar(1/qt.length);return{contour:wt,center:ne}},ct=G(k),ht=G(Z),Et=(vt,wt)=>(Math.atan2(vt.y-wt.y,vt.x-wt.x)+Math.PI*2)%(Math.PI*2),Ct=[...ct.contour.map(vt=>Et(vt,ct.center)),...ht.contour.map(vt=>Et(vt,ht.center)),...Array.from({length:32},(vt,wt)=>wt/32*Math.PI*2)].sort((vt,wt)=>vt-wt).filter((vt,wt,qt)=>wt===0||vt-qt[wt-1]>1e-8),Pt=({contour:vt,center:wt},qt)=>{let ne=Lt(Math.cos(qt),Math.sin(qt)),se=1/0;for(let Ot=0;Ot<vt.length;Ot++){let Me=vt[Ot],Re=vt[(Ot+1)%vt.length].clone().sub(Me),ye=Dt(ne,Re);if(Math.abs(ye)<1e-12)continue;let Ce=Me.clone().sub(wt),Oe=Dt(Ce,Re)/ye,xe=Dt(Ce,ne)/ye;Oe>=0&&xe>=-1e-8&&xe<=1+1e-8&&(se=Math.min(se,Oe))}if(!isFinite(se))throw new Error("Ray missed the contour.");return wt.clone().addScaledVector(ne,se)};return Ct.map(vt=>({source:Pt(ct,vt),target:Pt(ht,vt)}))}function ve(k,Z,G=160){let ct=vt=>{let wt=[0];for(let Ot=0;Ot<vt.length;Ot++)wt.push(wt[Ot]+vt[Ot].distanceTo(vt[(Ot+1)%vt.length]));let qt=wt[vt.length],ne=[],se=0;for(let Ot=0;Ot<G;Ot++){let Me=Ot/G*qt;for(;se<vt.length-1&&wt[se+1]<Me;)se++;let Re=vt[se],ye=vt[(se+1)%vt.length],Ce=wt[se+1]-wt[se];ne.push(Re.clone().lerp(ye,Ce>0?(Me-wt[se])/Ce:0))}return ne},ht=ct(k),Et=ct(Z),Ct=0,Pt=1/0;for(let vt=0;vt<G;vt++){let wt=0;for(let qt=0;qt<G;qt++)wt+=ht[qt].distanceToSquared(Et[(qt+vt)%G]);wt<Pt&&(Pt=wt,Ct=vt)}return ht.map((vt,wt)=>({source:vt,target:Et[(wt+Ct)%G]}))}function De(k,Z,G){try{return oe(k,Z)}catch(ct){return console.warn(`[glass] radial morph unavailable for "${G}" (${ct.message}); using arc-length matching.`),ve(k,Z)}}function ce(k,Z){let G=!1;for(let ct=0,ht=Z.length-1;ct<Z.length;ht=ct++){let Et=Z[ct],Ct=Z[ht];Et.y>k.y!=Ct.y>k.y&&k.x<(Ct.x-Et.x)*(k.y-Et.y)/(Ct.y-Et.y)+Et.x&&(G=!G)}return G}function Le(k){let G=new Xr().parse(k).paths.flatMap(Pt=>Pt.subPaths.map(vt=>F(vt.getPoints(6).map(wt=>Lt(wt.x,-wt.y))))).filter(Pt=>Pt.length>=3&&Math.abs(Be.area(Pt))>1e-9).sort((Pt,vt)=>Math.abs(Be.area(vt))-Math.abs(Be.area(Pt)));if(!G.length)throw new Error("This SVG has no closed contour.");let[ct,...ht]=G,Et=[],Ct=[];for(let Pt of ht){let vt=new un().setFromPoints(Pt).getCenter(Lt());(ce(vt,ct)?Et:Ct).push(Pt)}return{outline:ct,holes:Et,extras:Ct}}function Ke(k,Z){let G=new un().setFromPoints([k.outline,...k.holes,...k.extras].flat()),ct=G.getCenter(Lt()),ht=G.getSize(Lt()),Et=Z/Math.max(ht.x,ht.y),Ct=Pt=>Pt.map(vt=>vt.clone().sub(ct).multiplyScalar(Et));return{outline:Ct(k.outline),holes:k.holes.map(Ct),extras:k.extras.map(Ct)}}function Ls(k){let Z=k.slice();Be.isClockWise(Z)&&Z.reverse();let G=new un().setFromPoints(Z).getSize(Lt()).length()*2+1,ct=[Lt(-G,-G),Lt(G,-G),Lt(G,G),Lt(-G,G)];for(let ht=0;ht<Z.length;ht++){let Et=Z[ht],Ct=Z[(ht+1)%Z.length].clone().sub(Et),Pt=[];for(let vt=0;vt<ct.length;vt++){let wt=ct[vt],qt=ct[(vt+1)%ct.length],ne=Dt(Ct,wt.clone().sub(Et)),se=Dt(Ct,qt.clone().sub(Et));ne>=-1e-10&&Pt.push(wt),ne>=0!=se>=0&&Pt.push(wt.clone().lerp(qt,ne/(ne-se)))}if(ct=Pt,!ct.length)return[]}return ct}function qr(k,Z){if(Z<=1)return[k];let G=new un().setFromPoints(k).getCenter(Lt()),ct=360/Z,ht=null;for(let Et=0;Et<ct-.001;Et+=5){let Ct=[],Pt=1/0;for(let vt=0;vt<Z;vt++){let wt=At(k,Rt(G,Et+vt*ct,Et+(vt+1)*ct));if(wt.length<3){Pt=-1;break}let qt=Ls(wt),ne=qt.length?Math.abs(Be.area(qt))/Math.abs(Be.area(wt)):0;Pt=Math.min(Pt,ne),Ct.push(wt)}Pt>=0&&(!ht||Pt>ht.worst)&&(ht={worst:Pt,pieces:Ct})}if(!ht)throw new Error(`Could not split this shape into ${Z} fragments.`);return ht.worst===0&&console.warn("[glass] a fragment has no visibility kernel; using arc-length morphing there."),ht.pieces}function jn(k,Z){let G=Math.max(1,Z-k.extras.length),ct=k.extras.map(Ct=>Object.assign(Ct.slice(),{isExtra:!0})),ht=[...qr(k.outline,G),...ct].slice(0,Math.max(1,Z)),Et=Ct=>{let Pt=new un().setFromPoints(Ct).getCenter(Lt());return(Math.atan2(Pt.y,Pt.x)+Math.PI*2)%(Math.PI*2)};return ht.sort((Ct,Pt)=>Et(Ct)-Et(Pt))}function As(){ee(),B=new Dn,B.position.y=-.3,B.visible=x,X.add(B);let k=bt(),Z=new Dn;Z.rotation.set(-.08,.28,-.08),B.add(Z);let G=Ke(Le(_),$),ct=Ke(Le(T),K);Mt=ct.outline,at=ct.holes;let ht=Gt(G.outline),Et=new en(ht.contour),Ct=Lt(ht.home.x,ht.home.y);for(let qt of G.holes)Et.holes.push(new hn(qt.map(ne=>ne.clone().sub(Ct))));let Pt=new ui(Et,{depth:S,steps:1,bevelEnabled:!0,bevelSize:w.size,bevelThickness:w.thickness,bevelSegments:6,curveSegments:24});Pt.translate(0,0,-S/2),lt=new Fe(Pt,k),lt.position.copy(ht.home),Z.add(lt),ut=new Fe(Ht(N,N,0),k),ut.userData.progress=-1,ut.visible=!1,Z.add(ut);let vt=jn(G,u.fragments),wt=jn(ct,vt.length);vt.forEach((qt,ne)=>{let se=!!qt.isExtra,Ot=Gt(qt),Me=Gt(wt[Math.min(ne,wt.length-1)]),Re=ae(Ot.contour,S,w.size,w.thickness),ye=new Fe(Re,k);ye.position.copy(Ot.home),Z.add(ye);let Ce=Lt(Ot.home.x,Ot.home.y);Ce.lengthSq()<1e-6&&Ce.set(Math.cos(ne),Math.sin(ne));let Oe=new V(Ce.x,Ce.y,0).normalize().multiplyScalar(1.15);Oe.z=(ne%2===0?1:-1)*.55;let xe=Math.sign(Oe.x)||1,Je=Math.sign(Oe.y)||1;st.push({name:`fragment-${ne}`,mesh:ye,home:Ot.home,offset:Oe,twist:new V(Je*.12,xe*.18,-xe*Je*.09),targetHome:Me.home,correspondence:De(Ot.contour,Me.contour,`fragment-${ne}`),originalGeometry:Re,morphGeometry:null,isBody:!se,finalGeometry:se?ae(Me.contour,Q,_t.size,_t.thickness):null,targetContour:se?Me.contour:null,extraBevel:-1})})}function mi(k,Z,G){let ct=new en,ht=-k/2,Et=-Z/2;return ct.moveTo(ht+G,Et),ct.lineTo(ht+k-G,Et),ct.absarc(ht+k-G,Et+G,G,-Math.PI/2,0,!1),ct.lineTo(ht+k,Et+Z-G),ct.absarc(ht+k-G,Et+Z-G,G,0,Math.PI/2,!1),ct.lineTo(ht+G,Et+Z),ct.absarc(ht+G,Et+Z-G,G,Math.PI/2,Math.PI,!1),ct.lineTo(ht,Et+G),ct.absarc(ht+G,Et+G,G,Math.PI,Math.PI*1.5,!1),ct}function Rs(){return 2*nt*Math.tan(yn.degToRad(j.fov/2))/Ft.height}function Qi(k,Z,G){let ct=O*G,ht=Math.max(ct+.002,q*G),Et=mi(k-2*ct,Z-2*ct,ht-ct),Ct=new ui(Et,{depth:W,steps:1,bevelEnabled:!0,bevelSize:ct,bevelThickness:pt,bevelSegments:10,curveSegments:18});return Ct.translate(0,0,-(W+pt)),Ct}function Yr(){H&&(L=bt(),L.side=Mn,L.color.set("#9ea6b8"),L.roughness=.34,L.thickness=.35,L.attenuationColor.set("#2b1f2f"),L.attenuationDistance=1.8,L.clearcoat=1,L.clearcoatRoughness=.14,L.iridescence=.18,L.envMapIntensity=.55,ot=new Fe(Qi(1,1,1),L),ot.userData={w:0,h:0},ot.visible=!1,j.add(ot),i.classList.add("has-glass-card"))}function Zr(){if(!ot||!H||(ot.visible=M>.001,!ot.visible))return;let k=H.getBoundingClientRect(),Z=Rs(),G=k.width*Z,ct=k.height*Z;(Math.abs(ot.userData.w-G)>.003||Math.abs(ot.userData.h-ct)>.003)&&(ot.geometry.dispose(),ot.geometry=Qi(G,ct,Z),ot.userData={w:G,h:ct});let ht=k.left+k.width/2-Ft.width/2,Et=Ft.height/2-(k.top+k.height/2);ot.position.set(ht*Z,Et*Z,-nt),ot.rotation.set(-m*.02,U*.025,0)}function Fn(){let k=tt?tt.offsetTop+tt.offsetHeight:document.documentElement.scrollHeight;return Math.max(1,k-window.innerHeight)}function b(k,Z,G){let ct=yn.clamp((k-Z)/(G-Z),0,1);return ct*ct*ct*(ct*(ct*6-15)+10)}function Y(k){let Z=Ft.width/Ft.height,G=yn.clamp((1-Z)/.2,0,1),ct=it(k),ht=b(k,.4,.54),Et=4.7-Math.sin(k*Math.PI)*.6+ct*2.6+ht*.9,Ct=8.9-Math.sin(k*Math.PI)*.4+ct*2+ht*.4,Pt=Wt(Et,Ct,G),vt=1-b(k,.12,.24),wt=b(k,.12,.24)-b(k,.4,.5),qt=b(k,.52,.62)-b(k,.74,.86),ne=b(k,.74,.86),se=(c??-1.5*vt+1.5*wt-1.8*qt-1.4*ne)*(1-G),Ot=1-2*b(k,.16,.26)+2*b(k,.44,.54)-2*b(k,.72,.82),Me=2*Pt*Math.tan(yn.degToRad(j.fov/2)),Re=-.15+l+G*Ot*(Ot>0?.2:.19)*Me,ye=k*Math.PI*2,Ce=new V(Math.cos(ye),0,-Math.sin(ye)),Oe=new V(0,Re,0).addScaledVector(Ce,se);return{radius:Pt,lookAt:Oe,portrait:G}}function it(k){return b(k,.12,.28)*(1-b(k,.4,.54))}function rt(k,Z,G){let ct=k.geometryCache||(k.geometryCache=new Map),ht=ct.get(Z);if(ht?ct.delete(Z):ht=G(),ct.set(Z,ht),ct.size>24){let Et=ct.keys().next().value;ct.get(Et).dispose(),ct.delete(Et)}return ht}let et=k=>Math.round(k*96)/96;function Nt(k){let Z=it(k),G=b(k,.4,.54),ct=et(G),ht=G>=1,Et=Z<=0&&G<=0;if(lt&&(lt.visible=Et),ut&&(ut.visible=ht,ht)){let Ct=et(b(k,.54,.56)),Pt=et(b(k,.54,.6)),vt=`${Ct}:${Pt}`;vt!==ut.userData.progress&&(ut.geometryCache||ut.geometry.dispose(),ut.geometry=rt(ut,vt,()=>Ht(Wt(N,_t.size,Ct),Wt(N,_t.thickness,Ct),Pt)),ut.userData.progress=vt)}for(let Ct of st){let{mesh:Pt,home:vt,targetHome:wt,offset:qt,twist:ne,correspondence:se}=Ct;if(Pt.visible=Ct.isBody?!ht&&!Et:!0,Pt.position.copy(vt).lerp(wt,G).addScaledVector(qt,Z),Pt.rotation.set(ne.x*Z,ne.y*Z,ne.z*Z),!!Pt.visible)if(!Ct.isBody&&ht){let Ot=et(b(k,.54,.56));Pt.geometry=Ot>=1?Ct.finalGeometry:rt(Ct,`extra:${Ot}`,()=>ae(Ct.targetContour,Q,Wt(N,_t.size,Ot),Wt(N,_t.thickness,Ot)))}else G<=0?Pt.geometry=Ct.originalGeometry:Pt.geometry=rt(Ct,`morph:${ct}`,()=>{let Ot=se.map(({source:Me,target:Re})=>Me.clone().lerp(Re,ct));return ae(Ot,Wt(S,Q,ct),Wt(w.size,N,ct),Wt(w.thickness,N,ct))})}}function Bt(){let k=`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,Z=`
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
    `;St=new _n({vertexShader:k,fragmentShader:Z,uniforms:kt,depthWrite:!1,depthTest:!1});let G=new Zi(30,30);Ut=new Fe(G,St),Ut.position.set(0,0,-8),Ut.renderOrder=-10,j.add(Ut)}function Vt(){Object.assign(Ft,y()),j.aspect=Ft.width/Ft.height,j.updateProjectionMatrix(),J.setSize(Ft.width,Ft.height,d!=="canvas"),J.setPixelRatio(Math.min(window.devicePixelRatio,f)),kt&&J.getDrawingBufferSize(kt.uResolution.value)}C(window,"mousemove",k=>{mt=k.clientX,gt=k.clientY;let Z=i.querySelector(".cursor-inner");Z&&(Z.style.left=`${mt}px`,Z.style.top=`${gt}px`),v=k.clientX/window.innerWidth*2-1,z=k.clientY/window.innerHeight*2-1,i.classList.remove("cursor-hidden")}),C(document,"mouseover",k=>{let Z=k.target instanceof Element?k.target:null;i.classList.toggle("cursor-hover",!!(Z&&Z.closest("a, button"))),i.classList.toggle("cursor-text",!!(Z&&Z.closest("input, textarea")))}),C(document.documentElement,"mouseleave",()=>i.classList.add("cursor-hidden"));let Xt="";function Qt(){let k=i.querySelector(".cursor-label");if(!k)return;k.style.left=`${dt}px`,k.style.top=`${It}px`;let Z=M>.02?"CONTACT":String(Math.round(R*100)).padStart(3,"0");Z!==Xt&&(k.textContent=Z,Xt=Z)}C(window,"resize",()=>{Vt(),je.chapter=-1,Zt()});function Zt(){i.querySelectorAll(".slide-title").forEach(k=>{k.style.fontSize="";let Z=[...k.querySelectorAll(".line-inner")];if(!Z.length)return;let G=Math.max(...Z.map(ht=>{let Et=document.createRange();return Et.selectNodeContents(ht),Et.getBoundingClientRect().width})),ct=k.clientWidth;if(G>ct&&ct>0){let ht=parseFloat(getComputedStyle(k).fontSize);k.style.fontSize=`${Math.floor(ht*ct/G*.985)}px`}})}let Yt=0,he=0,Ne=performance.now();for(let k of["scroll","pointermove","pointerdown","keydown","resize"])C(window,k,()=>{Ne=performance.now()},{passive:!0});C(document,"visibilitychange",()=>{cancelAnimationFrame(Yt),Yt=0,!document.hidden&&!D&&(I.getDelta(),he=0,Ne=performance.now(),Yt=requestAnimationFrame(_e))});function _e(k=performance.now()){if(document.hidden||D)return;Yt=requestAnimationFrame(_e);let Z=Math.abs(yn.clamp(window.scrollY/Fn(),0,1)-R)>1e-4||Math.abs(M-E)>1e-4,G=g||(Z||k-Ne<1500?60:30);if(he&&k-he<1e3/G-1)return;he=k;let ct=Math.min(I.getDelta(),.1),ht=Ot=>1-Math.pow(1-Ot,ct*60),Et=Fn(),Ct=window.scrollY!==void 0?window.scrollY:window.pageYOffset!==void 0?window.pageYOffset:document.documentElement.scrollTop,Pt=a?(k-p)/1e3%a/a:yn.clamp(Ct/Et,0,1);M=ft?yn.clamp((Ct-Et)/window.innerHeight,0,1):0,a?R=Pt:R+=(Pt-R)*ht(.025),E+=(M-E)*ht(.06),Math.abs(M-E)<.0015&&(E=M),U+=(v-U)*ht(.05),m+=(z-m)*ht(.05),dt+=(mt-dt)*ht(.2),It+=(gt-It)*ht(.2);let vt=i.querySelector(".cursor-outer");if(vt&&(vt.style.left=`${dt}px`,vt.style.top=`${It}px`),Qt(),B){let Ot=b(E,0,.85);B.rotation.y=U*.25+Ot*1.35,B.rotation.x=m*.15-Ot*.35,B.rotation.z=Ot*.55,B.position.set(-Ot*3.4,-.3+Ot*4.8,-Ot*1.2),B.scale.setScalar(h*(1-Ot*.5))}if(yt){let Ot=yt.geometry.attributes.position.array,Me=I.getElapsedTime(),Re=Math.abs(Pt-R),ye=1+Re*9,Ce=Re*.8;for(let Oe=0;Oe<ie;Oe++){let xe=Oe*3,Je=Kt[Oe];Ot[xe]+=Je.speedX*ct*ye,Ot[xe+1]+=Je.speedY*ct*ye,Ot[xe+2]+=Je.speedZ*ct*ye;let Co=Je.swayRadius*(1+Ce*4);Ot[xe]+=Math.sin(Me*Je.swaySpeed+Je.phase)*Co*ct,Ot[xe+2]+=Math.cos(Me*Je.swaySpeed+Je.phase)*Co*ct,(Ot[xe+1]>3||Math.abs(Ot[xe])>3.5||Math.abs(Ot[xe+2])>3.5)&&(Ot[xe+1]=-2.5,Ot[xe]=(Math.random()-.5)*3,Ot[xe+2]=(Math.random()-.5)*3)}yt.geometry.attributes.position.needsUpdate=!0}let wt=Y(R),qt=R*Math.PI*2,ne=.35+Math.sin(R*Math.PI)*.8,se=new V(wt.radius*Math.sin(qt),ne,wt.radius*Math.cos(qt));j.position.lerp(se,ht(.025)),j.lookAt(wt.lookAt),Zr(),kt&&(kt.uTime.value=I.getElapsedTime(),kt.uMouse.value.set(U,-m),kt.uScroll.value=a?1-Math.abs(2*R-1):R+E*.22,kt.uVelocity.value+=(Math.min(1,Math.abs(Pt-R)*14)-kt.uVelocity.value)*ht(.06)),Nt(R),Cs(R),ue(R),es(),J.render(X,j)}let je={chapter:-1};function ue(k){let Z=M>.02?4:k<.2?0:k<.48?1:k<.76?2:3;if(Z===je.chapter)return;je.chapter=Z;let G=i.querySelector("[data-chapter]");G&&(G.textContent=String(Z+1).padStart(2,"0")),i.querySelectorAll("[data-goto]").forEach((ct,ht)=>ct.classList.toggle("is-active",ht===Z))}let te=[[-.1,.15],[.26,.43],[.54,.71],[.82,1.05]],ts=1500,pe=400,bn=te.map(()=>({active:!1,since:0,left:0}));function Cs(k){let Z=[...i.querySelectorAll("[data-slide]")];for(let vt=1;vt<=4;vt++){let wt=i.querySelector(`[data-dash="${vt}"]`);if(wt){let qt=(vt-1)*.25,ne=vt*.25,se=(k-qt)/(ne-qt);se=Math.max(0,Math.min(1,se)),wt.style.height=`${se*100}%`}}let G=performance.now(),ct=!1,ht=M>.02,Ct=te.map(([vt,wt])=>!ct&&!ht&&k>=vt&&k<=wt).indexOf(!0),Pt=bn.map((vt,wt)=>Ct===wt?(vt.active||(vt.since=G),vt.active=!0,vt.left=0,!0):vt.active&&Ct===-1&&!ht&&!ct&&(vt.left||(vt.left=G),G-vt.since<ts||G-vt.left<pe)?!0:(vt.active=!1,vt.left=0,!1));Z.forEach((vt,wt)=>{vt&&vt.classList.toggle("active",Pt[wt])}),Ae(Pt[3])}let Bn=!1,gi=!1;function Ae(k){let Z=i.querySelectorAll(".figure-value");if(!Z.length||k===gi)return;if(gi=k,!k){Z.forEach(Ct=>{Ct.textContent=0 .toFixed(Number(Ct.dataset.decimals||0))});return}let G=performance.now(),ct=1400,ht=Symbol("figures");Bn=ht;let Et=Ct=>{if(Bn!==ht)return;let Pt=Math.min(1,(Ct-G)/ct),vt=1-Math.pow(1-Pt,4);Z.forEach(wt=>{let qt=Number(wt.dataset.count||0),ne=Number(wt.dataset.decimals||0);wt.textContent=(qt*vt).toFixed(ne)}),Pt<1&&requestAnimationFrame(Et)};requestAnimationFrame(Et)}function En(){i.querySelectorAll("[data-goto]").forEach(k=>{C(k,"click",Z=>{let G=k.getAttribute("data-goto"),ct=G==="after"&&ft?ft.getBoundingClientRect().top+window.scrollY:Fn()*Number(G);Z.preventDefault(),window.scrollTo({top:ct,behavior:"smooth"})})})}function es(){ft&&i.classList.toggle("contact-open",M>.02)}let Ze=window.__glassSite={snap(k){window.scrollTo({top:Fn()*k,behavior:"instant"}),R=k,E=M=0;let Z=k*Math.PI*2,{radius:G}=Y(k);j&&j.position.set(G*Math.sin(Z),.35+Math.sin(k*Math.PI)*.8,G*Math.cos(Z))},snapContact(k){window.scrollTo({top:Fn()+window.innerHeight*k,behavior:"instant"}),R=1,E=M=k,this.snap(1),window.scrollTo({top:Fn()+window.innerHeight*k,behavior:"instant"}),E=M=k},get scroll(){return R},get contact(){return E},get pieces(){return st.map(k=>({name:k.name,points:k.correspondence.length}))}};function ns(){Zt(),X=new xs,X.background=new $t("#000000"),X.fog=new Ar("#000000",.01),j=new Ve(50,Ft.width/Ft.height,.1,100),j.position.set(0,.2,3),X.add(j),Bt(),J=new _s({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),J.setSize(Ft.width,Ft.height,d!=="canvas"),J.setPixelRatio(Math.min(window.devicePixelRatio,f)),J.shadowMap.enabled=!0,J.shadowMap.type=Mo,J.toneMapping=So,J.toneMappingExposure=2.2;let k=new zr("#ffffff",.1);X.add(k);let Z=new Br("#ffffff",18);Z.position.set(4,6,3),Z.angle=Math.PI/4,Z.penumbra=.9,Z.castShadow=!0,Z.shadow.mapSize.width=2048,Z.shadow.mapSize.height=2048,Z.shadow.camera.near=1,Z.shadow.camera.far=15,Z.shadow.bias=-.001,X.add(Z);let G=new Ts("#e3f2ff",10);G.position.set(-5,3,-4),X.add(G);let ct=new Ts("#fff3e6",.8);ct.position.set(-2,-4,2),X.add(ct),fe(),As(),Yr(),Vt(),ot&&(ot.visible=!0,J.compile(X,j),ot.visible=!1),i.querySelector(".slide-title")?.getBoundingClientRect(),_e(),En();let ht=()=>{D||(Zt(),i.classList.add("glass-ready"),o?.())};document.fonts&&document.fonts.ready?document.fonts.ready.then(ht,ht):ht()}function Ps(){D=!0,cancelAnimationFrame(Yt);for(let[G,ct,ht,Et]of P)G.removeEventListener(ct,ht,Et);let k=new Set,Z=G=>{G&&!k.has(G)&&(k.add(G),G.dispose())};for(let G of[ut,...st])G?.geometryCache?.forEach(Z);for(let G of st)Z(G.originalGeometry),Z(G.finalGeometry);X?.traverse(G=>{Z(G.geometry),(Array.isArray(G.material)?G.material:[G.material]).forEach(ct=>{Z(ct?.map),Z(ct)})}),Z(X?.environment),J?.dispose(),J?.forceContextLoss(),i.classList.remove("glass-ready","has-glass-card","contact-open","cursor-hover","cursor-text","cursor-hidden"),window.__glassSite===Ze&&delete window.__glassSite}try{ns()}catch(k){throw Ps(),k}return Ps}var A0=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill-rule="evenodd" d="
M250 0H750A250 250 0 0 1 1000 250V750A250 250 0 0 1 750 1000H250A250 250 0 0 1 0 750V250A250 250 0 0 1 250 0Z
M343.75 250H546.875A156.25 156.25 0 0 1 637.5 534.375A162.5 162.5 0 0 1 562.5 750H343.75Z
M712.5 218.75A68.75 68.75 0 1 0 850 218.75A68.75 68.75 0 1 0 712.5 218.75Z"/></svg>`,R0={growth:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M873.5 293.4 L706.5 126.5 L705.1 125.1 L703.5 123.9 L701.9 122.9 L700.2 122.0 L698.4 121.3 L696.5 120.7 L694.6 120.3 L692.7 120.1 L690.8 120.0 L688.9 120.1 L686.9 120.3 L685.1 120.7 L683.2 121.3 L681.4 122.0 L679.7 122.9 L678.0 123.9 L676.5 125.1 L675.0 126.5 L508.1 293.4 L507.1 294.5 L506.1 295.7 L505.3 296.9 L504.5 298.1 L503.9 299.4 L503.3 300.7 L502.8 302.1 L502.3 303.4 L502.0 304.8 L501.8 306.3 L501.6 307.7 L501.6 309.1 L501.6 310.6 L501.8 312.0 L502.0 313.5 L502.3 314.9 L502.8 316.3 L503.3 317.7 L503.9 319.1 L504.6 320.4 L505.4 321.6 L506.2 322.8 L507.2 323.9 L508.1 325.0 L509.2 325.9 L510.3 326.9 L511.5 327.7 L512.7 328.5 L514.0 329.1 L515.3 329.7 L516.6 330.2 L518.0 330.7 L519.4 331.0 L520.9 331.3 L522.4 331.4 L523.8 331.4 L597.0 331.4 L597.0 857.7 L597.1 859.7 L597.3 861.7 L597.8 863.6 L598.4 865.5 L599.1 867.3 L600.0 868.9 L601.1 870.5 L602.2 872.1 L603.5 873.5 L604.9 874.7 L606.4 875.9 L608.0 876.9 L609.7 877.8 L611.5 878.6 L613.3 879.2 L615.2 879.6 L617.2 879.9 L619.2 880.0 L762.3 880.0 L764.4 879.9 L766.3 879.6 L768.3 879.2 L770.1 878.6 L771.9 877.8 L773.6 876.9 L775.2 875.9 L776.7 874.7 L778.1 873.5 L779.4 872.1 L780.5 870.5 L781.6 868.9 L782.5 867.3 L783.2 865.5 L783.8 863.6 L784.2 861.7 L784.5 859.7 L784.6 857.7 L784.6 331.4 L857.7 331.4 L859.2 331.4 L860.7 331.3 L862.1 331.0 L863.6 330.7 L865.0 330.2 L866.3 329.7 L867.6 329.1 L868.9 328.5 L870.1 327.7 L871.3 326.9 L872.4 325.9 L873.4 325.0 L874.4 323.9 L875.4 322.8 L876.2 321.6 L877.0 320.4 L877.7 319.1 L878.3 317.7 L878.8 316.3 L879.3 314.9 L879.6 313.5 L879.8 312.0 L880.0 310.6 L880.0 309.1 L879.9 307.7 L879.8 306.3 L879.6 304.8 L879.2 303.4 L878.8 302.1 L878.3 300.7 L877.7 299.4 L877.1 298.1 L876.3 296.9 L875.4 295.7 L874.5 294.5 Z M523.8 430.0 L380.8 430.0 L378.7 430.1 L376.8 430.4 L374.8 430.8 L373.0 431.4 L371.2 432.2 L369.5 433.1 L367.9 434.1 L366.4 435.2 L365.0 436.5 L363.7 437.9 L362.6 439.4 L361.5 441.0 L360.6 442.7 L359.9 444.5 L359.3 446.4 L358.8 448.3 L358.6 450.2 L358.5 452.3 L358.5 857.7 L358.6 859.7 L358.8 861.7 L359.3 863.6 L359.9 865.5 L360.6 867.3 L361.5 868.9 L362.6 870.5 L363.7 872.1 L365.0 873.5 L366.4 874.7 L367.9 875.9 L369.5 876.9 L371.2 877.8 L373.0 878.6 L374.8 879.2 L376.8 879.6 L378.7 879.9 L380.8 880.0 L523.8 880.0 L525.9 879.9 L527.9 879.6 L529.8 879.2 L531.6 878.6 L533.4 877.8 L535.1 876.9 L536.7 875.9 L538.2 874.7 L539.6 873.5 L540.9 872.1 L542.0 870.5 L543.1 868.9 L544.0 867.3 L544.7 865.5 L545.3 863.6 L545.8 861.7 L546.0 859.7 L546.1 857.7 L546.1 452.3 L546.0 450.2 L545.8 448.3 L545.3 446.4 L544.7 444.5 L544.0 442.7 L543.1 441.0 L542.0 439.4 L540.9 437.9 L539.6 436.5 L538.2 435.2 L536.7 434.1 L535.1 433.1 L533.4 432.2 L531.6 431.4 L529.8 430.8 L527.9 430.4 L525.9 430.1 Z M285.4 620.8 L142.3 620.8 L140.2 620.9 L138.3 621.2 L136.3 621.6 L134.5 622.2 L132.7 622.9 L131.0 623.8 L129.4 624.9 L127.9 626.0 L126.5 627.3 L125.2 628.7 L124.1 630.2 L123.0 631.8 L122.1 633.5 L121.4 635.3 L120.8 637.1 L120.4 639.1 L120.1 641.0 L120.0 643.1 L120.0 857.7 L120.1 859.7 L120.4 861.7 L120.8 863.6 L121.4 865.5 L122.1 867.3 L123.0 868.9 L124.1 870.5 L125.2 872.1 L126.5 873.5 L127.9 874.7 L129.4 875.9 L131.0 876.9 L132.7 877.8 L134.5 878.6 L136.3 879.2 L138.3 879.6 L140.2 879.9 L142.3 880.0 L285.4 880.0 L287.4 879.9 L289.4 879.6 L291.3 879.2 L293.1 878.6 L294.9 877.8 L296.6 876.9 L298.2 875.9 L299.7 874.7 L301.1 873.5 L302.4 872.1 L303.6 870.5 L304.6 868.9 L305.5 867.3 L306.2 865.5 L306.8 863.6 L307.3 861.7 L307.5 859.7 L307.6 857.7 L307.6 643.1 L307.5 641.0 L307.3 639.1 L306.8 637.1 L306.2 635.3 L305.5 633.5 L304.6 631.8 L303.6 630.2 L302.4 628.7 L301.1 627.3 L299.7 626.0 L298.2 624.9 L296.6 623.8 L294.9 622.9 L293.1 622.2 L291.3 621.6 L289.4 621.2 L287.4 620.9 Z"/></svg>',spark:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M501.9 160.5 L502.9 170.4 L504.1 180.2 L505.6 189.9 L507.3 199.5 L509.2 209.0 L511.3 218.4 L513.7 227.6 L516.2 236.8 L519.0 245.8 L521.9 254.7 L525.1 263.5 L528.4 272.2 L532.0 280.8 L535.7 289.2 L539.7 297.5 L543.8 305.6 L548.1 313.7 L552.6 321.6 L557.3 329.3 L562.2 336.9 L567.3 344.4 L572.5 351.7 L577.9 358.9 L583.5 365.9 L589.2 372.8 L595.2 379.5 L601.2 386.1 L607.5 392.5 L613.9 398.8 L620.5 404.8 L627.2 410.8 L634.1 416.5 L641.1 422.1 L648.3 427.5 L655.6 432.7 L663.1 437.8 L670.7 442.7 L678.4 447.4 L686.3 451.9 L694.4 456.2 L702.5 460.3 L710.8 464.3 L719.2 468.0 L727.8 471.6 L736.5 474.9 L745.3 478.1 L754.2 481.0 L763.2 483.8 L772.4 486.3 L781.6 488.7 L791.0 490.8 L800.5 492.7 L810.1 494.4 L819.8 495.9 L829.6 497.1 L839.5 498.1 L849.5 499.0 L855.0 499.2 L859.2 499.4 L862.3 499.6 L864.1 499.8 L864.7 500.0 L864.1 500.2 L862.3 500.4 L859.2 500.6 L855.0 500.8 L849.5 501.0 L839.5 501.9 L829.6 502.9 L819.8 504.1 L810.1 505.6 L800.5 507.3 L791.0 509.2 L781.6 511.3 L772.4 513.7 L763.2 516.2 L754.2 519.0 L745.3 521.9 L736.5 525.1 L727.8 528.4 L719.2 532.0 L710.8 535.7 L702.5 539.7 L694.4 543.8 L686.3 548.1 L678.4 552.6 L670.7 557.3 L663.1 562.2 L655.6 567.3 L648.3 572.5 L641.1 577.9 L634.1 583.5 L627.2 589.2 L620.5 595.2 L613.9 601.2 L607.5 607.5 L601.2 613.9 L595.2 620.5 L589.2 627.2 L583.5 634.1 L577.9 641.1 L572.5 648.3 L567.3 655.6 L562.2 663.1 L557.3 670.7 L552.6 678.4 L548.1 686.3 L543.8 694.4 L539.7 702.5 L535.7 710.8 L532.0 719.2 L528.4 727.8 L525.1 736.5 L521.9 745.3 L519.0 754.2 L516.2 763.2 L513.7 772.4 L511.3 781.6 L509.2 791.0 L507.3 800.5 L505.6 810.1 L504.1 819.8 L502.9 829.6 L501.9 839.5 L501.0 849.5 L500.8 855.0 L500.6 859.2 L500.4 862.3 L500.2 864.1 L500.0 864.7 L499.8 864.1 L499.6 862.3 L499.4 859.2 L499.2 855.0 L499.0 849.5 L498.1 839.5 L497.1 829.6 L495.9 819.8 L494.4 810.1 L492.7 800.5 L490.8 791.0 L488.7 781.6 L486.3 772.4 L483.8 763.2 L481.0 754.2 L478.1 745.3 L474.9 736.5 L471.6 727.8 L468.0 719.2 L464.3 710.8 L460.3 702.5 L456.2 694.4 L451.9 686.3 L447.4 678.4 L442.7 670.7 L437.8 663.1 L432.7 655.6 L427.5 648.3 L422.1 641.1 L416.5 634.1 L410.8 627.2 L404.8 620.5 L398.8 613.9 L392.5 607.5 L386.1 601.2 L379.5 595.2 L372.8 589.2 L365.9 583.5 L358.9 577.9 L351.7 572.5 L344.4 567.3 L336.9 562.2 L329.3 557.3 L321.6 552.6 L313.7 548.1 L305.6 543.8 L297.5 539.7 L289.2 535.7 L280.8 532.0 L272.2 528.4 L263.5 525.1 L254.7 521.9 L245.8 519.0 L236.8 516.2 L227.6 513.7 L218.4 511.3 L209.0 509.2 L199.5 507.3 L189.9 505.6 L180.2 504.1 L170.4 502.9 L160.5 501.9 L150.5 501.0 L145.0 500.8 L140.8 500.6 L137.7 500.4 L135.9 500.2 L135.3 500.0 L135.9 499.8 L137.7 499.6 L140.8 499.4 L145.0 499.2 L150.5 499.0 L160.5 498.1 L170.4 497.1 L180.2 495.9 L189.9 494.4 L199.5 492.7 L209.0 490.8 L218.4 488.7 L227.6 486.3 L236.8 483.8 L245.8 481.0 L254.7 478.1 L263.5 474.9 L272.2 471.6 L280.8 468.0 L289.2 464.3 L297.5 460.3 L305.6 456.2 L313.7 451.9 L321.6 447.4 L329.3 442.7 L336.9 437.8 L344.4 432.7 L351.7 427.5 L358.9 422.1 L365.9 416.5 L372.8 410.8 L379.5 404.8 L386.1 398.8 L392.5 392.5 L398.8 386.1 L404.8 379.5 L410.8 372.8 L416.5 365.9 L422.1 358.9 L427.5 351.7 L432.7 344.4 L437.8 336.9 L442.7 329.3 L447.4 321.6 L451.9 313.7 L456.2 305.6 L460.3 297.5 L464.3 289.2 L468.0 280.8 L471.6 272.2 L474.9 263.5 L478.1 254.7 L481.0 245.8 L483.8 236.8 L486.3 227.6 L488.7 218.4 L490.8 209.0 L492.7 199.5 L494.4 189.9 L495.9 180.2 L497.1 170.4 L498.1 160.5 L499.0 150.5 L499.2 145.0 L499.4 140.8 L499.6 137.7 L499.8 135.9 L500.0 135.3 L500.2 135.9 L500.4 137.7 L500.6 140.8 L500.8 145.0 L501.0 150.5 Z"/></svg>',prism:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M401.3 291.0 L403.4 287.5 L405.6 284.1 L407.9 280.8 L410.3 277.6 L412.9 274.5 L415.6 271.4 L418.3 268.5 L421.2 265.6 L424.2 262.9 L427.2 260.2 L430.4 257.7 L433.6 255.3 L437.0 253.0 L440.4 250.8 L443.9 248.8 L447.4 246.8 L451.1 245.0 L454.7 243.4 L458.5 241.8 L462.3 240.4 L466.1 239.2 L470.0 238.0 L473.9 237.0 L477.9 236.2 L481.9 235.5 L485.9 234.9 L489.9 234.4 L493.9 234.2 L498.0 234.0 L502.0 234.0 L506.1 234.2 L510.1 234.4 L514.1 234.9 L518.1 235.5 L522.1 236.2 L526.1 237.0 L530.0 238.0 L533.9 239.2 L537.7 240.4 L541.5 241.8 L545.3 243.4 L548.9 245.0 L552.6 246.8 L556.1 248.8 L559.6 250.8 L563.0 253.0 L566.4 255.3 L569.6 257.7 L572.8 260.2 L575.8 262.9 L578.8 265.6 L581.7 268.5 L584.4 271.4 L587.1 274.5 L589.7 277.6 L592.1 280.8 L594.4 284.1 L596.6 287.5 L598.7 291.0 L730.4 519.0 L732.3 522.5 L734.2 526.1 L735.9 529.8 L737.4 533.5 L738.9 537.3 L740.2 541.2 L741.3 545.0 L742.4 548.9 L743.3 552.9 L744.0 556.9 L744.6 560.9 L745.1 564.9 L745.4 568.9 L745.6 573.0 L745.6 577.0 L745.5 581.1 L745.3 585.1 L744.9 589.1 L744.3 593.1 L743.7 597.1 L742.8 601.1 L741.9 605.0 L740.8 608.9 L739.5 612.8 L738.2 616.6 L736.7 620.3 L735.0 624.0 L733.3 627.7 L731.4 631.2 L729.3 634.7 L727.2 638.2 L724.9 641.5 L722.5 644.8 L720.0 648.0 L717.4 651.1 L714.7 654.1 L711.9 657.0 L709.0 659.8 L705.9 662.5 L702.8 665.0 L699.6 667.5 L696.3 669.9 L693.0 672.1 L689.5 674.2 L686.0 676.2 L682.4 678.1 L678.7 679.8 L675.0 681.4 L671.3 682.9 L667.4 684.2 L663.6 685.4 L659.7 686.5 L655.7 687.4 L651.8 688.2 L647.8 688.9 L643.8 689.4 L639.7 689.7 L635.7 689.9 L631.6 690.0 L368.4 690.0 L364.3 689.9 L360.3 689.7 L356.2 689.4 L352.2 688.9 L348.2 688.2 L344.3 687.4 L340.3 686.5 L336.4 685.4 L332.6 684.2 L328.7 682.9 L325.0 681.4 L321.3 679.8 L317.6 678.1 L314.0 676.2 L310.5 674.2 L307.0 672.1 L303.7 669.9 L300.4 667.5 L297.2 665.0 L294.1 662.5 L291.0 659.8 L288.1 657.0 L285.3 654.1 L282.6 651.1 L280.0 648.0 L277.5 644.8 L275.1 641.5 L272.8 638.2 L270.7 634.7 L268.6 631.2 L266.7 627.7 L265.0 624.0 L263.3 620.3 L261.8 616.6 L260.5 612.8 L259.2 608.9 L258.1 605.0 L257.2 601.1 L256.3 597.1 L255.7 593.1 L255.1 589.1 L254.7 585.1 L254.5 581.1 L254.4 577.0 L254.4 573.0 L254.6 568.9 L254.9 564.9 L255.4 560.9 L256.0 556.9 L256.7 552.9 L257.6 548.9 L258.7 545.0 L259.8 541.2 L261.1 537.3 L262.6 533.5 L264.1 529.8 L265.8 526.1 L267.7 522.5 L269.6 519.0 Z"/></svg>',"star-soft":'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M871.9 439.2 L705.4 601.6 L744.7 830.8 L744.9 832.5 L745.1 834.2 L745.1 835.9 L745.0 837.5 L744.8 839.1 L744.5 840.8 L744.2 842.3 L743.7 843.9 L743.1 845.4 L742.5 846.9 L741.7 848.4 L740.9 849.8 L739.9 851.1 L738.9 852.4 L737.8 853.7 L736.7 854.9 L735.4 856.0 L734.1 857.0 L733.3 857.5 L732.5 858.1 L731.7 858.6 L730.9 859.0 L730.0 859.4 L729.2 859.8 L728.3 860.2 L727.4 860.5 L726.5 860.8 L725.7 861.1 L724.8 861.3 L723.9 861.5 L722.9 861.7 L722.0 861.8 L721.1 862.0 L720.2 862.0 L719.3 862.1 L718.4 862.1 L717.6 862.1 L716.9 862.1 L716.2 862.0 L715.5 862.0 L714.8 861.9 L714.1 861.8 L713.4 861.6 L712.7 861.5 L712.0 861.3 L711.3 861.2 L710.6 861.0 L709.9 860.7 L709.3 860.5 L708.6 860.2 L707.9 860.0 L707.2 859.7 L706.6 859.4 L705.9 859.0 L500.0 750.8 L294.1 859.0 L292.6 859.7 L291.0 860.4 L289.5 860.9 L287.9 861.4 L286.3 861.7 L284.6 861.9 L283.0 862.1 L281.4 862.1 L279.7 862.0 L278.1 861.9 L276.5 861.6 L274.9 861.2 L273.3 860.8 L271.8 860.2 L270.3 859.5 L268.8 858.8 L267.3 857.9 L266.0 857.0 L264.6 855.9 L263.4 854.8 L262.2 853.6 L261.1 852.4 L260.1 851.1 L259.2 849.8 L258.3 848.4 L257.6 846.9 L256.9 845.4 L256.3 843.9 L255.9 842.3 L255.5 840.7 L255.2 839.1 L255.0 837.5 L254.9 835.8 L255.0 834.2 L255.1 832.5 L255.3 830.8 L294.6 601.5 L128.1 439.2 L126.9 438.0 L125.8 436.7 L124.8 435.4 L123.9 434.0 L123.1 432.6 L122.4 431.1 L121.8 429.6 L121.2 428.0 L120.8 426.5 L120.4 424.9 L120.2 423.3 L120.0 421.6 L120.0 420.0 L120.1 418.3 L120.2 416.7 L120.5 415.1 L120.8 413.4 L121.3 411.8 L121.9 410.2 L122.6 408.7 L123.3 407.2 L124.1 405.8 L125.1 404.4 L126.1 403.1 L127.2 401.9 L128.3 400.7 L129.5 399.6 L130.8 398.6 L132.1 397.7 L133.5 396.8 L135.0 396.1 L136.5 395.4 L138.0 394.8 L139.6 394.3 L141.3 393.9 L142.9 393.6 L373.1 360.2 L476.0 151.6 L477.7 148.7 L479.7 146.2 L482.1 144.0 L484.7 142.1 L487.5 140.6 L490.5 139.4 L493.6 138.6 L496.8 138.1 L500.0 137.9 L503.2 138.1 L506.4 138.6 L509.5 139.4 L512.5 140.6 L515.3 142.1 L517.9 144.0 L520.3 146.2 L522.3 148.7 L524.0 151.6 L626.9 360.2 L857.1 393.6 L858.7 393.9 L860.4 394.3 L862.0 394.8 L863.5 395.4 L865.0 396.1 L866.5 396.8 L867.9 397.7 L869.2 398.6 L870.5 399.6 L871.7 400.7 L872.8 401.9 L873.9 403.1 L874.9 404.4 L875.9 405.8 L876.7 407.2 L877.4 408.7 L878.1 410.2 L878.7 411.8 L879.2 413.4 L879.5 415.1 L879.8 416.7 L879.9 418.4 L880.0 420.0 L880.0 421.6 L879.8 423.3 L879.6 424.9 L879.2 426.5 L878.8 428.0 L878.2 429.6 L877.6 431.1 L876.9 432.6 L876.1 434.0 L875.2 435.4 L874.2 436.7 L873.1 438.0 Z"/></svg>',bloom:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M880.0 500.0 L879.5 510.8 L878.2 521.6 L875.9 532.3 L872.7 542.8 L868.6 553.0 L863.7 562.9 L858.0 572.5 L851.4 581.7 L844.1 590.4 L836.0 598.7 L827.3 606.3 L817.9 613.4 L807.9 619.9 L797.3 625.6 L786.2 630.7 L774.6 635.0 L762.6 638.6 L750.2 641.3 L737.3 643.1 L723.9 643.9 L709.9 643.5 L693.7 640.7 L701.4 655.3 L706.1 668.5 L709.4 681.5 L711.7 694.3 L712.9 706.9 L713.3 719.5 L712.8 731.8 L711.4 743.9 L709.1 755.8 L706.1 767.3 L702.3 778.4 L697.7 789.1 L692.3 799.3 L686.3 809.0 L679.6 818.0 L672.3 826.5 L664.3 834.2 L655.8 841.2 L646.9 847.5 L637.4 853.0 L627.6 857.6 L617.4 861.4 L607.0 864.3 L596.3 866.3 L585.4 867.5 L574.5 867.7 L563.5 867.0 L552.5 865.4 L541.6 862.9 L530.9 859.5 L520.3 855.2 L510.0 850.1 L500.0 844.1 L490.4 837.4 L481.1 829.8 L472.4 821.6 L464.1 812.6 L456.4 802.9 L449.4 792.6 L442.9 781.6 L437.2 769.9 L432.3 757.5 L428.4 744.0 L426.0 727.7 L414.5 739.5 L403.4 748.1 L392.1 755.2 L380.7 761.3 L369.0 766.5 L357.2 770.7 L345.3 774.0 L333.3 776.4 L321.4 777.9 L309.5 778.6 L297.7 778.4 L286.1 777.3 L274.8 775.4 L263.7 772.7 L253.0 769.1 L242.7 764.7 L232.9 759.6 L223.6 753.7 L214.9 747.1 L206.8 739.8 L199.3 731.9 L192.6 723.4 L186.6 714.3 L181.3 704.8 L176.9 694.8 L173.3 684.5 L170.6 673.8 L168.7 662.9 L167.8 651.7 L167.7 640.4 L168.5 629.1 L170.2 617.7 L172.7 606.3 L176.2 595.1 L180.5 584.0 L185.6 573.1 L191.6 562.5 L198.4 552.2 L206.1 542.3 L214.6 532.7 L223.9 523.7 L234.2 515.2 L245.8 507.3 L260.6 500.0 L245.8 492.7 L234.2 484.8 L223.9 476.3 L214.6 467.3 L206.1 457.7 L198.4 447.8 L191.6 437.5 L185.6 426.9 L180.5 416.0 L176.2 404.9 L172.7 393.7 L170.2 382.3 L168.5 370.9 L167.7 359.6 L167.8 348.3 L168.7 337.1 L170.6 326.2 L173.3 315.5 L176.9 305.2 L181.3 295.2 L186.6 285.7 L192.6 276.6 L199.3 268.1 L206.8 260.2 L214.9 252.9 L223.6 246.3 L232.9 240.4 L242.7 235.3 L253.0 230.9 L263.7 227.3 L274.8 224.6 L286.1 222.7 L297.7 221.6 L309.5 221.4 L321.4 222.1 L333.3 223.6 L345.3 226.0 L357.2 229.3 L369.0 233.5 L380.7 238.7 L392.1 244.8 L403.4 251.9 L414.5 260.5 L426.0 272.3 L428.4 256.0 L432.3 242.5 L437.2 230.1 L442.9 218.4 L449.4 207.4 L456.4 197.1 L464.1 187.4 L472.4 178.4 L481.1 170.2 L490.4 162.6 L500.0 155.9 L510.0 149.9 L520.3 144.8 L530.9 140.5 L541.6 137.1 L552.5 134.6 L563.5 133.0 L574.5 132.3 L585.4 132.5 L596.3 133.7 L607.0 135.7 L617.4 138.6 L627.6 142.4 L637.4 147.0 L646.9 152.5 L655.8 158.8 L664.3 165.8 L672.3 173.5 L679.6 182.0 L686.3 191.0 L692.3 200.7 L697.7 210.9 L702.3 221.6 L706.1 232.7 L709.1 244.2 L711.4 256.1 L712.8 268.2 L713.3 280.5 L712.9 293.1 L711.7 305.7 L709.4 318.5 L706.1 331.5 L701.4 344.7 L693.7 359.3 L709.9 356.5 L723.9 356.1 L737.3 356.9 L750.2 358.7 L762.6 361.4 L774.6 365.0 L786.2 369.3 L797.3 374.4 L807.9 380.1 L817.9 386.6 L827.3 393.7 L836.0 401.3 L844.1 409.6 L851.4 418.3 L858.0 427.5 L863.7 437.1 L868.6 447.0 L872.7 457.2 L875.9 467.7 L878.2 478.4 L879.5 489.2 Z"/></svg>',squircle:'<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M857.2 500.0 L857.1 587.4 L856.7 618.1 L856.1 640.8 L855.3 659.4 L854.2 675.5 L852.9 689.8 L851.3 702.6 L849.5 714.4 L847.4 725.2 L845.1 735.3 L842.5 744.6 L839.7 753.4 L836.6 761.6 L833.3 769.4 L829.7 776.6 L825.8 783.5 L821.6 790.0 L817.1 796.1 L812.3 801.8 L807.2 807.2 L801.8 812.3 L796.1 817.1 L790.0 821.6 L783.5 825.8 L776.6 829.7 L769.4 833.3 L761.6 836.6 L753.4 839.7 L744.6 842.5 L735.3 845.1 L725.2 847.4 L714.4 849.5 L702.6 851.3 L689.8 852.9 L675.5 854.2 L659.4 855.3 L640.8 856.1 L618.1 856.7 L587.4 857.1 L500.0 857.2 L412.6 857.1 L381.9 856.7 L359.2 856.1 L340.6 855.3 L324.5 854.2 L310.2 852.9 L297.4 851.3 L285.6 849.5 L274.8 847.4 L264.7 845.1 L255.4 842.5 L246.6 839.7 L238.4 836.6 L230.6 833.3 L223.4 829.7 L216.5 825.8 L210.0 821.6 L203.9 817.1 L198.2 812.3 L192.8 807.2 L187.7 801.8 L182.9 796.1 L178.4 790.0 L174.2 783.5 L170.3 776.6 L166.7 769.4 L163.4 761.6 L160.3 753.4 L157.5 744.6 L154.9 735.3 L152.6 725.2 L150.5 714.4 L148.7 702.6 L147.1 689.8 L145.8 675.5 L144.7 659.4 L143.9 640.8 L143.3 618.1 L142.9 587.4 L142.8 500.0 L142.9 412.6 L143.3 381.9 L143.9 359.2 L144.7 340.6 L145.8 324.5 L147.1 310.2 L148.7 297.4 L150.5 285.6 L152.6 274.8 L154.9 264.7 L157.5 255.4 L160.3 246.6 L163.4 238.4 L166.7 230.6 L170.3 223.4 L174.2 216.5 L178.4 210.0 L182.9 203.9 L187.7 198.2 L192.8 192.8 L198.2 187.7 L203.9 182.9 L210.0 178.4 L216.5 174.2 L223.4 170.3 L230.6 166.7 L238.4 163.4 L246.6 160.3 L255.4 157.5 L264.7 154.9 L274.8 152.6 L285.6 150.5 L297.4 148.7 L310.2 147.1 L324.5 145.8 L340.6 144.7 L359.2 143.9 L381.9 143.3 L412.6 142.9 L500.0 142.8 L587.4 142.9 L618.1 143.3 L640.8 143.9 L659.4 144.7 L675.5 145.8 L689.8 147.1 L702.6 148.7 L714.4 150.5 L725.2 152.6 L735.3 154.9 L744.6 157.5 L753.4 160.3 L761.6 163.4 L769.4 166.7 L776.6 170.3 L783.5 174.2 L790.0 178.4 L796.1 182.9 L801.8 187.7 L807.2 192.8 L812.3 198.2 L817.1 203.9 L821.6 210.0 L825.8 216.5 L829.7 223.4 L833.3 230.6 L836.6 238.4 L839.7 246.6 L842.5 255.4 L845.1 264.7 L847.4 274.8 L849.5 285.6 L851.3 297.4 L852.9 310.2 L854.2 324.5 L855.3 340.6 L856.1 359.2 L856.7 381.9 L857.1 412.6 Z"/></svg>'},C0=["#387cd5","#6a6be8","#8b5cf6","#22d3ee","#2563c9"],P0=["#4f8cdb","#7c5cff","#b45cf0","#3aa7ff","#2a4fd6"];function I0(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return!1;try{let i=document.createElement("canvas").getContext("webgl2");return i?.getExtension("WEBGL_lose_context")?.loseContext(),!!i}catch{return!1}}export{I0 as glassAvailable,A0 as glassMark,C0 as glassPalette,R0 as glassShapes,P0 as sitePalette,S0 as startGlass};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
