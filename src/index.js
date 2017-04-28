export default {
	render(container, element) {
		const textNode = document.createTextNode(element);
		container.appendChild(textNode);
	}
}