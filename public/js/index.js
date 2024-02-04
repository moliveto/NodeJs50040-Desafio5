const socket = io();
const catalogoElement = document.querySelector('#catalogo');

const renderProducts = products => {
    const html = products.map((product, index) => {
        return (
            `
            <tr class="align-middle">
                <td class="">${product.title}</td>
                <td class="text-end">${product.price}</td>
                <td class="text-center"><img src="${product.thumbnail}" alt="${product.title}"></td>
            </tr>
            `
        )
    }).join(" ");
    catalogoElement.innerHTML = html;
}

socket.on('products', products => {
    console.log(products);
    renderProducts(products);
});

function addProduct(e) {
    const producto = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        thumbnail: document.querySelector('#thumbnail').value
    };
    socket.emit('addProduct', producto);
    return false;
}