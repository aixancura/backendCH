const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/', async (req, res) => {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    if (!cart) return res.status(404).json({ message:'Not found'});
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart =await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
    if (!updatedcart) return res.status(404).json({ message:'Not found'});
    res.json(updatedCart);
});

module.exports = router;