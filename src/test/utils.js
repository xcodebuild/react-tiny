export function createContainer(name) {
    const container = document.createElement('div');
    container.setAttribute('id', 'test-container-' + name);
    container.append = (con = document.body) => {
        con.appendChild(container);
        return container.childNodes[0];
    };
    return container;
}