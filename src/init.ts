// Version:4.2.0

import { mountNode, vnodeType } from './diff.js';
import { getType, isToTextType, checkVnode } from './util.js';

interface StateType {
	_el: HTMLElement | null;
	_template: Function | null;
	oldTree: any | null;
	isMounted: boolean;
	observer: MutationObserver | null;
}

export const version: string = '4.2.0';

export const state: StateType = {
	_el: null,
	_template: null,
	oldTree: null,
	isMounted: false,
	observer: null,
};

function useOtherNode(template: any): vnodeType {
	for (let index: number = 0; index < template.length; index++) {
		const element: any = template[index];

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

export function useTemplate(template: any): vnodeType {
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

function normalizeContainer(
	container: HTMLElement | String
): null | HTMLElement {
	if (typeof container === 'string') {
		const res: HTMLElement = document.querySelector(container);
		if (!res) {
			let elem = null;
			if (container.startsWith('#')) {
				elem = document.createElement('div');
				elem.setAttribute('id', container.substring(1, container.length));
			} else if (container.startsWith('.')) {
				elem = document.createElement('div');
				elem.setAttribute('class', container.substring(1, container.length));
			} else {
				`[Strve warn]: Failed to mount app: mount target selector "${container}" returned null.`;
			}

			document.body.insertAdjacentElement('afterbegin', elem);

			return elem;
		}
		return res;
	} else if (container instanceof HTMLElement) {
		return container;
	} else if (
		window.ShadowRoot &&
		container instanceof window.ShadowRoot &&
		container.mode === 'closed'
	) {
		console.warn(
			`[Strve warn]: mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs.`
		);
		return null;
	} else {
		return null;
	}
}

export function createApp(template: Function): {
	mount(el: HTMLElement | String): void;
} {
	const app = {
		mount(el: HTMLElement | String) {
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
