const Cart = require('../models/carts');
const Product = require('../models/products');
class CartManager {
  async getAll() {
    try {
      return await Cart.find().populate('products.product');
    } catch (error) {
      console.error('Error fetching carts:', error);
      throw new Error('Could not fetch carts');
    }
}

  async getById(id) {
    if (!id) throw new Error('Cart ID is required');
    try {
       const cart = await Cart.findById(id).populate('products.product');
       if (!cart) throw new Error('Cart not found');
          return cart;
    } catch (error) {
        console.error(`Error fetching cart with ID ${id}:`, error);
        throw new Error('Could not fetch cart');
    }
}

   async create() {
    try {
        const newCart = new Cart({ products: [] });
        return await newCart.save();
    } catch (error) {
        console.error('Error creating new cart:', error);
        throw new Error('Could not create cart');
    }
}

   async addProductToCart(cartId, productId) {
    if (!cartId || !productId) throw new Error('Cart ID and Product ID are required');

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');

        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');

        const existingProduct = cart.products.find(item => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        return await cart.save();
    } catch (error) {
        console.error(`Error adding product ${productId} to cart ${cartId}:`, error);
        throw new Error('Could not add product to cart');
    }
}

   async removeProductFromCart(cartId, productId) {
    if (!cartId || !productId) throw new Error('Cart ID and Product ID are required');

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');

        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        return await cart.save();
    } catch (error) {
        console.error(`Error removing product ${productId} from cart ${cartId}:`, error);
        throw new Error('Could not remove product from cart');
    }
}

   async deleteCart(cartId) {
    if (!cartId) throw new Error('Cart ID is required');
        
    try {
            const deletedCart = await Cart.findByIdAndDelete(cartId);
            if (!deletedCart) throw new Error('Cart not found or already deleted');
            return deletedCart;
        } catch (error) {
            console.error(`Error deleting cart with ID ${cartId}:`, error);
            throw new Error('Could not delete cart');
        }
    }
}

module.exports = CartManager;