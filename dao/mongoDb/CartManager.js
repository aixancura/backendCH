const Cart = require('../models/carts');
const Product = require('../models/products');

class CartManager {
    async getAll() {
        return await Cart.find().populate('products.product');
    }

    async getById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async create() {
        const newCart = new Cart({products: []});
        return await newCart.save();
    }

    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Not found');

        const existingProduct = cart.products.find(item => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        }else {
            cart.products.push({product: productId, quantity: 1});
        }
        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Not found');

        cart.products.filter(item => item.product.toString() !== productId);

        return await cart.save();
    }

    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId);
    }
}

module.exports = CartManager;