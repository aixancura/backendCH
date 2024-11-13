const express = require('express');
const ProductManager = require('../managers/productManager');
const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(Number(req.params.pid));
    if (!product) return res.status(404).json({ message:'Not found'});
    res.json(product);
});

router.post('/', async (req, res) =>{
    const {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category){
        return res.status(400).json({ message: 'Missing required fields'})
    }
    
    const newProduct = productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || [],

    });

    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) =>{
    const updatedProduct = await productManager.updateProduct(Number(req.params.pid), req.body);
    if (!updatedProduct) return res.status(404).json({message: 'Not found'});
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) =>{
    await productManager.deleteProduct(Number(req.params.pid));
    res.status(204).end();
});

module.exports = router;