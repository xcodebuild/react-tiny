export default {
	render(element: string, container: Element) {
		const textNode: Text = document.createTextNode(element);
		container.appendChild(textNode);
	}
}