const socket = io();

socket.on('productList', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(p => `<li id="product-${p.io}">${p.title} - $${p.price} <button onclick="deleteProduct(${p.id})">Eliminar</button></li>`).join('');
});

socket.on('productAdded', (product) => {
    const productList = document.getElementById('product-list');
    const newProduct = document.createElement('li');
    newProduct.id = `product-${product.id}`;
    newProduct.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    productList.appendChild(newProduct);
});

socket.on('productDeleted', (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();
    }
});

document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        status: true,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: []
    };
    
    socket.emit('createProduct', productData);
    e.target.reset();
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
};