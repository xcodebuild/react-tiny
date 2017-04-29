export function render(element: string, container: HTMLElement) {
	const wrapper = document.createElement('span');
	wrapper.innerText = element;
	container.appendChild(wrapper);
}