const express = require('express');
const router = express.Router();
const productManager = require('../managers/productManager');

router.get('/', (req, res) => {
    res.render('index'); 
});

router.get('/products', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('index', {products});
});

router.get('/realTimeProducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', {products});
});

module.exports = router;
