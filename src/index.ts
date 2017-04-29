declare global {
  namespace JSX {
    type Element = TReactElement | string | number | null;
    interface IntrinsicElements { [elemName: string]: any; } 
  }
}

export function render(
	element: JSX.Element, 
	container: HTMLElement
): void {
	const wrapper = document.createElement('span');
	if (typeof element === 'string') {
		wrapper.innerText = element;
	}
	container.appendChild(wrapper);
}

class TReactElement {
	type: string | Function;
	props: Object;
	constructor(
		type: string | Function,
		attrs: Object | null,
		children: Array<JSX.Element> | null,
	) {
		this.type = type;
	}
}

export function h(
	type: string | Function | null, 
	attrs: Object | null, 
	...children: Array<JSX.Element>,
): JSX.Element {
	if (type === null) return null;
	return new TReactElement(type, attrs, children);
}