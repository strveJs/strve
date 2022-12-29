import { state } from './init';
import { vnodeType } from './diff';
interface namespaceMapType {
	[key: string]: string;
}

interface HTMLElementElType {
	[style: string]: any;
}

interface fragmentType {
	tag: string;
	props: null;
	children: any;
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS =
	'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
	'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' +
	'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
	'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' +
	'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
	'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
	'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
	'option,output,progress,select,textarea,details,dialog,menu,' +
	'summary,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS =
	'svg,animate,circle,clippath,cursor,image,defs,desc,ellipse,filter,font-face' +
	'foreignobject,g,glyph,line,marker,mask,missing-glyph,path,pattern,' +
	'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view,' +
	'feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feFlood,feGaussianBlur,' +
	'feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight,' +
	'linearGradient,stop,radialGradient,' +
	'animateTransform,animateMotion';

const isHTMLTag: (val: string) => boolean = /*#__PURE__*/ makeMap(HTML_TAGS);

const isSVG: (val: string) => boolean = /*#__PURE__*/ makeMap(SVG_TAGS);

export function isXlink(name: string): boolean {
	return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
}

export function isComplexType(v: any): boolean {
	const typeData = ['object', 'array', 'function', 'regexp', 'date', 'math'];
	return typeData.indexOf(getType(v)) !== -1;
}

export function getType(v: any): string {
	return Object.prototype.toString
		.call(v)
		.match(/\[object (.+?)\]/)[1]
		.toLowerCase();
}

// Object and array is not supported,But you can use JSON.stringify() to convert it to string type
export const isToTextType: (val: string) => boolean = makeMap(
	'function,regexp,date,math,undefined,null,boolean,string,number,symbol,bigInt'
);

function makeMap(str: string): (val: string) => boolean {
	const map: any = Object.create(null);
	const list: string[] = str.split(',');
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return function (val: string) {
		return map[val];
	};
}

export function isVnode(vnodes: vnodeType): boolean {
	if (
		vnodes.hasOwnProperty('tag') &&
		vnodes.hasOwnProperty('props') &&
		vnodes.hasOwnProperty('children')
	) {
		return true;
	}
}

export function checkVnode(vnodes: any): boolean {
	if (getType(vnodes) === 'array') {
		for (let index = 0; index < vnodes.length; index++) {
			if (isVnode(vnodes[index])) {
				return true;
			}
		}
	} else if (getType(vnodes) === 'object') {
		return isVnode(vnodes);
	}
}
const isComplexDataType: (obj: any) => boolean = (obj: any) =>
	(typeof obj === 'object' || typeof obj === 'function') && obj !== null;

export function isSameObject(obj1: any, obj2: any): boolean {
	if (!isComplexDataType(obj1) || !isComplexDataType(obj2)) {
		return obj1 === obj2;
	}

	if (obj1 === obj2) {
		return true;
	}

	const obj1Keys = Object.keys(obj1);
	const obj2Keys = Object.keys(obj2);

	if (obj1Keys.length !== obj2Keys.length) {
		return false;
	}

	for (const key in obj1) {
		const res = isSameObject(obj1[key], obj2[key]);
		if (!res) {
			return false;
		}
	}

	return true;
}

const namespaceMap: namespaceMapType = {
	svg: 'http://www.w3.org/2000/svg',
	math: 'http://www.w3.org/1998/Math/MathML',
};

export const xlinkNS: string = 'http://www.w3.org/1999/xlink';

function getXlinkProp(name: string): string {
	return isXlink(name) ? name.slice(6, name.length) : '';
}

function getTagNamespace(tag: string): string {
	if (isSVG(tag)) {
		return 'svg';
	}

	if (tag === 'math') {
		return 'math';
	}
}

function createElementNS(namespace: string, tagName: string): Element {
	return document.createElementNS(namespaceMap[namespace], tagName);
}

export function setStyleProp(el: HTMLElementElType, prototype: any): void {
	for (let i in prototype) {
		el.style[i] = prototype[i];
	}
}

export function addEvent(el: HTMLElement, props: any): void {
	for (let index = 0; index < Object.keys(props).length; index++) {
		const element = Object.keys(props)[index].toString();
		if (element.startsWith('on')) {
			const name =
				element.split('on')[1][0].toLowerCase() +
				element.split('on')[1].substring(1);
			el.addEventListener(name, props[element]);
		} else if (element.startsWith('@')) {
			const name = element.split('@')[1];
			el.addEventListener(name, props[element]);
		}
	}
}

export function removeEvent(el: HTMLElement, key: string, oldProps: any): void {
	if (isXlink(key)) {
		el.removeAttributeNS(xlinkNS, getXlinkProp(key));
	} else {
		el.removeAttribute(key);
	}

	if (key.startsWith('on')) {
		const name =
			key.split('on')[1][0].toLowerCase() + key.split('on')[1].substring(1);
		el.removeEventListener(name, oldProps[key]);
	} else if (key.startsWith('@')) {
		const name = key.split('@')[1];
		el.removeEventListener(name, oldProps[key]);
	}
}

export function createNode(tag: string): Element | DocumentFragment | Comment {
	// Html
	if (isHTMLTag(tag)) {
		return document.createElement(tag);
	}
	// Svg
	else if (isSVG(tag)) {
		return createElementNS(getTagNamespace(tag), tag);
	}
	// Fragment
	else if (tag === 'fragment' || tag === 'component') {
		return document.createDocumentFragment();
	}
	// Comment
	else if (tag === 'comment' || tag === 'null') {
		return document.createComment(tag);
	}
	// Web-components
	else if (tag.indexOf('-') !== -1) {
		return document.createElement(tag);
	}
	// Default
	else {
		return document.createElement(tag);
	}
}

function setFragmentNode(dom: any): vnodeType {
	const fragment: fragmentType = {
		tag: 'fragment',
		props: null,
		children: dom,
	};
	return fragment;
}

export function useFragmentNode(dom: vnodeType): vnodeType {
	return !dom.tag ? setFragmentNode(dom) : dom;
}
