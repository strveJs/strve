import { state } from './init';
import {
	getType,
	checkVnode,
	isComplexType,
	isXlink,
	isSameObject,
	isVnode,
	xlinkNS,
	setStyleProp,
	addEvent,
	removeEvent,
	createNode,
	useFragmentNode,
} from './util';

export interface vnodeType {
	tag: string;
	props: any;
	children: any[];
	el?: HTMLElement;
}

interface lifetimesType {
	connectedCallback: Function;
	disconnectedCallback: Function;
	adoptedCallback: Function;
	attributeChangedCallback: Function;
}

interface customElementType {
	id: string;
	template: Function;
	styles: Array<string>;
	immediateProps: Boolean;
	attributeChanged: Array<string>;
	lifetimes: lifetimesType;
}

interface setDataOptionsType {
	status: string;
	name: Function | string;
	customElement: customElementType;
}

const _com_: any = Object.create(null);
const _components: WeakMap<object, any> = new WeakMap();
const flag: Array<string> = ['$key', '$name', '$props'];
let componentName: string = '';
export const domInfo: any = Object.create(null);
export let propsData: any = reactive(Object.create(null));

interface proxyConfType {
	[propName: string]: any;
}

function reactive<T extends proxyConfType>(target: object = {}): any {
	if (typeof target !== 'object' || target === null) {
		return target;
	}

	const proxyConf = {
		get(target: T, key: string, receiver: any): any {
			const ownKeys = Reflect.ownKeys(target);
			if (ownKeys.includes(key)) {
				const result = Reflect.get(target, key, receiver);
				return reactive(result);
			}
		},
		set(target: T, key: string, val: any, receiver: any): boolean {
			if (val === target[key]) {
				return true;
			}

			const ownKeys = Reflect.ownKeys(target);
			if (ownKeys.includes(key) || Object.keys(_com_).includes(key)) {
				const result = Reflect.set(target, key, val, receiver);
				return result;
			}
		},
		deleteProperty(target: T, key: string): boolean {
			const result = Reflect.deleteProperty(target, key);
			return result;
		},
	};

	const observed = new Proxy(target, proxyConf);
	return observed;
}

export function mount(
	vnode: vnodeType,
	container: HTMLElement | Node,
	anchor?: Node
): void {
	if (vnode.tag) {
		const el: any = createNode(vnode.tag);

		if (vnode.props) {
			addEvent(el, vnode.props);

			if (vnode.props.hasOwnProperty(flag[0])) {
				vnode.el = el;
				if (getType(vnode.props[flag[0]]) === 'string') {
					domInfo[vnode.props[flag[0]]] = el;
				}
			}

			if (vnode.props.hasOwnProperty(flag[1])) {
				_com_[vnode.props[flag[1]]] = Object.create(null);
				_components.set(_com_[vnode.props[flag[1]]], vnode.children[0]);
			}

			if (
				vnode.props.hasOwnProperty(flag[1]) &&
				vnode.props.hasOwnProperty(flag[2])
			) {
				propsData[vnode.props[flag[1]]] = vnode.props[flag[2]];
			}

			for (const key in vnode.props) {
				if (vnode.props.hasOwnProperty(key)) {
					if (getType(vnode.props[key]) !== 'function') {
						if (isXlink(key)) {
							el.setAttributeNS(xlinkNS, key, vnode.props[key]);
						} else {
							if (!flag.includes(key)) {
								el.setAttribute(key, vnode.props[key]);
							}
						}
					}
					if (getType(vnode.props[key]) === 'object') {
						setStyleProp(el, vnode.props[key]);
					}
				}
			}
		}

		if (vnode.children) {
			updateChildrenNode(vnode.children, el, mountChildren);

			function mountChildren() {
				if (getType(vnode.children[0]) === 'array') {
					vnode.children[0].forEach((child: vnodeType) => {
						if (isVnode(child)) {
							mount(child, el);
						}
					});
				} else {
					if (getType(vnode.children) === 'array') {
						vnode.children.forEach((child: vnodeType) => {
							if (isVnode(child)) {
								mount(child, el);
							}
						});
					}
				}
			}
		}
		if (anchor) {
			container.insertBefore(el, anchor);
		} else {
			container.appendChild(el);
		}
	}
}

function patch(n1: vnodeType, n2: vnodeType, status?: string): void {
	const oldProps: any = n1.props || {};

	if (oldProps.hasOwnProperty(flag[0]) && n1.tag !== n2.tag) {
		const parent = n1.el.parentNode;
		const anchor = n1.el.nextSibling;
		parent.removeChild(n1.el);
		mount(n2, parent, anchor);
	} else {
		let el: any = null;
		if (oldProps.hasOwnProperty(flag[0])) {
			const newProps = n2.props || {};
			el = n2.el = n1.el;

			for (const key in newProps) {
				let [newValue, oldValue] = [newProps[key], oldProps[key]];
				if (newValue !== oldValue) {
					if (newValue !== null) {
						if (getType(newValue) !== 'function' && !flag.includes(key)) {
							el[key] && (el[key] = newValue); // property

							if (isXlink(key)) {
								el.setAttributeNS(xlinkNS, key, newValue);
							} else {
								el.setAttribute(key, newValue);
							}

							if (getType(newValue) === 'object') {
								setStyleProp(el, newValue);
							}
						} else {
							if (key.startsWith('on')) {
								const name =
									key.split('on')[1][0].toLowerCase() +
									key.split('on')[1].substring(1);
								el.addEventListener(name, newValue, false);
							}
						}
					} else {
						removeEvent(el, key, oldProps);
					}
				}
			}

			for (const key in oldProps) {
				if (!(key in newProps)) {
					removeEvent(el, key, oldProps);
				}
			}
		}

		const oc: any = n1.children[0];
		const nc: any = n2.children[0];
		const ocs: any[] = n1.children;
		const ncs: any[] = n2.children;

		if (!isSameObject(ocs, ncs)) {
			updateChildrenNode(ncs, el, patchChildren);

			function patchChildren() {
				if (getType(oc) !== 'array' && getType(nc) === 'array') {
					el.innerHTML = '';
					nc.forEach((c: vnodeType) => mount(c, el));
				} else if (getType(oc) === 'array' && getType(nc) === 'array') {
					patchNode(oc, nc, el, status);
				} else {
					patchNode(ocs, ncs, el, status);
				}
			}
		}
	}
}

function patchNode(o: any[], n: any[], el: HTMLElement, status: string): void {
	if (status === 'useFirstKey') {
		for (let i = 1; i <= Math.max(o.length, n.length); i++) {
			if (!o[o.length - i]) {
				mount(n[n.length - i], o[o.length - 1].el.parentNode, o[0].el);
			} else if (!n[n.length - i]) {
				el.removeChild(o[o.length - i].el);
			} else {
				patch(o[o.length - i], n[n.length - i], status);
			}
		}
	} else {
		for (let i = 0; i < Math.min(o.length, n.length); i++) {
			patch(o[i], n[i], status);
		}
		if (n.length > o.length) {
			n.slice(o.length).forEach((c: vnodeType) => mount(c, el));
		} else if (o.length > n.length) {
			o.slice(n.length).forEach((c: vnodeType) => {
				el.removeChild(c.el);
			});
		}
	}
}

function updateChildrenNode(
	childNode: any[],
	el: HTMLElement,
	setChildrenNode: Function
): void {
	if (childNode.length === 1 && !isComplexType(childNode[0])) {
		el && updateTextNode(childNode, el);
	} else if (childNode.length > 1 && !checkVnode(childNode)) {
		el && updateTextNode(childNode.join().replace(/,/g, ''), el);
	} else if (
		isComplexType(childNode[0]) &&
		!childNode[0].tag &&
		!checkVnode(childNode[0])
	) {
		el && updateTextNode(childNode[0], el);
	} else {
		setChildrenNode();
	}
}

function updateTextNode(val: any, el: HTMLElement): void {
	if (isComplexType(val)) {
		if (
			getType(val) === 'function' ||
			getType(val) === 'regexp' ||
			getType(val) === 'array'
		) {
			el.textContent = String(val);
		} else {
			el.textContent = JSON.stringify(val, null, 2);
		}
	} else {
		el.textContent = val ? val.toString() : String(val);
	}
}

let mountHook: Function | null = null;
export function onMounted(fn: Function): void {
	mountHook = fn;
}

let unMountedHook: Function | null = null;
export function onUnmounted(fn: Function): void {
	unMountedHook = fn;
}

let nextTickHook: Function | null = null;
export function nextTick(fn: Function): void {
	nextTickHook = fn;
}

export function mountNode(
	dom: vnodeType,
	selector?: Node,
	status?: string,
	name?: string
): void {
	if (!state.isMounted) {
		const _template: vnodeType = useFragmentNode(dom);
		mount(_template, selector);
		state.oldTree = _template;
		state.isMounted = true;
		mountHook && mountHook();
	} else {
		const newTree: vnodeType = useFragmentNode(dom);
		patch(state.oldTree, newTree, status);
		state.oldTree = newTree;

		if (name) {
			_components.set(_com_[name], dom);
		}
	}
}

export function setData(
	callback: Function,
	options: setDataOptionsType
): Promise<void> {
	if (getType(callback) === 'function' && getType(Promise) !== 'undefined') {
		return Promise.resolve()
			.then(() => {
				callback();
			})
			.then(() => {
				if (options && options.status === 'useRouter') {
					unMountedHook && unMountedHook();
					state._el.innerHTML = '';
					unMountedHook = null;
					mount((state.oldTree = state._template()), state._el);
					mountHook && mountHook();
				} else if (options && options.name === 'useCustomElement') {
					const oldTree = _components.get(
						_com_[options.customElement.id]
					).template;
					const props = _components.get(_com_[options.customElement.id]).props;

					const newTree = useFragmentNode(
						options.customElement.template(props)
					);
					patch(oldTree, newTree, options.status);
				} else if (options && typeof options.name === 'function') {
					const name: string = options.name.name;
					const _component: vnodeType = options.name();

					if (componentName !== name) {
						componentName = name;
						state.oldTree = useFragmentNode(_components.get(_com_[name]));
					}

					mountNode(_component, null, options.status, name);
				} else {
					const status: string | null =
						options && options.status ? options.status : null;
					mountNode(state._template(), null, status);
				}
				nextTickHook && nextTickHook();
			})
			.catch((err) => console.error(err));
	}
}

export function defineCustomElement(options: customElementType, tag: string) {
	class customElement extends HTMLElement {
		shadow: ShadowRoot;
		props: any | null;
		isComMounted: Boolean;
		comOldTree: vnodeType;
		static get observedAttributes() {
			if (options.attributeChanged && options.attributeChanged.length > 0) {
				return options.attributeChanged;
			}
		}
		constructor() {
			super();
			this.shadow = null;
			this.props = Object.create(null);
			this.isComMounted = false;
			this.comOldTree = Object.create(null);

			if (options.template && options.id) {
				const t = document.createElement('template');
				t.setAttribute('id', options.id);
				const content = t.content.cloneNode(true);

				if (options.styles && Array.isArray(options.styles)) {
					const s = document.createElement('style');
					s.textContent = options.styles.join('');
					content.appendChild(s);
				}

				this.shadow = this.attachShadow({ mode: 'open' });
				this.shadow.appendChild(content);

				if (!options.attributeChanged) {
					const tem = useFragmentNode(options.template());
					mount(tem, this.shadow);
					_com_[options.id] = Object.create(null);
					_components.set(_com_[options.id], {
						template: tem,
						props: null,
					});
				}
			}
		}

		// Called when the custom element is first connected to the document DOM.
		connectedCallback() {
			const arg = arguments;
			options.lifetimes &&
				typeof options.lifetimes.connectedCallback === 'function' &&
				options.lifetimes.connectedCallback(arg);
		}

		// Called when a custom element is disconnected from the document DOM.
		disconnectedCallback() {
			const arg = arguments;
			options.lifetimes &&
				typeof options.lifetimes.disconnectedCallback === 'function' &&
				options.lifetimes.disconnectedCallback(arg);
		}

		// Called when a custom element is moved to a new document.
		adoptedCallback() {
			const arg = arguments;
			options.lifetimes &&
				typeof options.lifetimes.adoptedCallback === 'function' &&
				options.lifetimes.adoptedCallback(arg);
		}

		// Called when an attribute of a custom element is added, removed, or changed.
		attributeChangedCallback() {
			const arg = arguments;

			if (options.attributeChanged && options.attributeChanged.length > 0) {
				this.props[arg[0]] = arg[2];
				const tem = useFragmentNode(options.template(this.props));
				if (!this.isComMounted) {
					mount(tem, this.shadow);
					_com_[options.id] = Object.create(null);
					_components.set(_com_[options.id], {
						template: tem,
						props: this.props,
					});
					this.comOldTree = tem;
					this.isComMounted = true;
				} else {
					patch(this.comOldTree, tem);
					_components.set(_com_[options.id], {
						template: tem,
						props: this.props,
					});
					this.comOldTree = tem;
				}
			}

			if (options.immediateProps) {
				options.lifetimes &&
					typeof options.lifetimes.attributeChangedCallback === 'function' &&
					options.lifetimes.attributeChangedCallback(arg);
			}
		}
	}

	if (typeof tag === 'string' && tag.indexOf('-') !== -1) {
		customElements.define(tag, customElement);
	} else {
		console.warn(
			`[Strve warn]: [${tag}]>> please name the string with "-" as a custom element. `
		);
	}
}
