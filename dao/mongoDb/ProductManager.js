const Product = require('../models/Product');

class ProductManager {
    async getAll({ page = 1, limit = 10, category, sort }) {
        const query = category ? { category } : {};
        const options = {
            page,
            limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}, 
            select: 'title description code price status stock category', 
        };
        
        try {
            const products = await Product.paginate(query, options);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Could not fetch products');
        }
    }

    async getById(id) {
        if (!id) throw new Error('Product ID is required');
        
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Product not found');
            return product;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            throw new Error('Could not fetch product');
        }
    }

    async create(productData) {
        const { title, description, code, price, status, stock, category, thumbnails } = productData;
        
        if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number') {
            throw new Error('All product fields are required');
        }
        
        try {
            const existingProduct = await Product.findOne({ code });
            if (existingProduct) throw new Error('Product with this code already exists');
            
            const newProduct = new Product({ title, description, code, price, status, stock, category, thumbnails });
            return await newProduct.save();
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Could not create product');
        }
    }

    async update(id, updateData) {
        if (!id) throw new Error('Product ID is required');
        
        const { title, description, price, status, stock, category, thumbnails } = updateData;
        if (updateData.code) throw new Error("Cannot update product code");

        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { title, description, price, status, stock, category, thumbnails },
                { new: true, runValidators: true }
            );
            if (!updatedProduct) throw new Error('Product not found');
            return updatedProduct;
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);
            throw new Error('Could not update product');
        }
    }

    async delete(id) {
        if (!id) throw new Error('Product ID is required');
        
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) throw new Error('Product not found or already deleted');
            return deletedProduct;
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            throw new Error('Could not delete product');
        }
    }
}

module.exports = ProductManager;

