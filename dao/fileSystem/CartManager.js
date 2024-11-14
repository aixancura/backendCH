const fs = require('fs');
const path = './data/carts.json';

class CartManager {
    constructor() {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify([]));
        }
    }

    async _readFile() {
        const data = await fs.promises.readFile(path, 'utf-8');
        return JSON.parse(data);
    }

    async _writeFile(data) {
        await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this._readFile();
        
        // Genera un ID único
        const newId = carts.length ? Math.max(carts.map(c => c.id)) + 1 : 1;
        const newCart = { id: newId, products: [] };
        
        carts.push(newCart);
        await this._writeFile(carts);

        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readFile();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this._readFile();
        const cart = carts.find(cart => cart.id === cartId);
        
        if (!cart) throw new Error('Cart not found');

        const existingProduct = cart.products.find(p => p.product === productId);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        
        await this._writeFile(carts);

        return cart;
    }
}

module.exports = CartManager;
