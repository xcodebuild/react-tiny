export function createDiv(): HTMLElement {
	const div: HTMLElement = document.createElement('div');
	document.body.appendChild(div);
	return div;
}
