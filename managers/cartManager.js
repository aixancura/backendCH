const fs = require('fs');
const path = require('path');

class CartManager{
    constructor(){
        this.path = path.join(__dirname, '../data/carts.json');
    }

    async getAllCarts(){
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id){
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === Number(id));
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = {
            id: Date.now().toString(),
            products: []
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }
    
    async addProductToCart(cartId, productId){
        const carts = await this.getAllCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const productI = cart.products.findIndex(p => p.product === productId);
        if (productI === -1){
            cart.products.push({product: productId, quantity: 1});
        } else {
            cart.products[productI].quantity += 1;
        }
        
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;