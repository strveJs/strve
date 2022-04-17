// Version:3.1.0
import { mountNode } from './diff.js';
import { getType, isToTextType, checkVnode } from './util.js';
export const version = '3.1.0';
export const state = {
	_el: null,
	_template: null,
	oldTree: null,
	isMounted: false,
	observer: null,
};
function useOtherNode(template) {
	for (let index = 0; index < template.length; index++) {
		const element = template[index];
		if (getType(element) === 'array') {
			useOtherNode(element);
		}
		if (element === '') {
			template.splice(index, 1, {
				tag: 'comment',
				children: [],
				props: null,
			});
		} else if (isToTextType(getType(element))) {
			template.splice(index, 1, {
				tag: 'textnode',
				children: [element],
				props: null,
			});
		} else if (element.children && checkVnode(element.children)) {
			useOtherNode(element.children);
		}
	}
	return template;
}
export function useTemplate(template) {
	if (getType(template) === 'array') {
		return useOtherNode(template);
	} else if (checkVnode(template) && getType(template) === 'object') {
		template.children = useOtherNode(template.children);
		return template;
	} else {
		return {
			tag: 'textnode',
			children: [template],
			props: null,
		};
	}
}
function normalizeContainer(container) {
	if (typeof container === 'string') {
		const res = document.querySelector(container);
		if (!res) {
			console.warn(
				`[Strve warn]: Failed to mount app: mount target selector "${container}" returned null.`
			);
		}
		return res;
	} else if (
		window.ShadowRoot &&
		container instanceof window.ShadowRoot &&
		container.mode === 'closed'
	) {
		console.warn(
			`[Strve warn]: mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs.`
		);
		return null;
	} else if (container instanceof HTMLElement) {
		return container;
	} else {
		return null;
	}
}
export function createApp(template) {
	const app = {
		mount(el) {
			if (normalizeContainer(el)) {
				state._el = normalizeContainer(el);
				state._template = template;
				const tem = useTemplate(template());
				state._el && mountNode(tem, state._el);
			} else {
				console.warn('[Strve warn]: There must be a mount element node.');
			}
		},
	};
	return app;
}
