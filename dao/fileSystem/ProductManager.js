const fs = require('fs');
const path = './data/products.json';

class ProductManager {
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

    async getAll() {
        return await this._readFile();
    }

    async getById(id) {
        const products = await this._readFile();
        return products.find(product => product.id === id);
    }

    async create(productData) {
        const products = await this._readFile();
        
        // Genera un ID único
        const newId = products.length ? Math.max(products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...productData };
        
        products.push(newProduct);
        await this._writeFile(products);

        return newProduct;
    }

    async update(id, updateData) {
        const products = await this._readFile();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) throw new Error('Product not found');
        
        // Mantiene el id actual y actualiza el resto de campos
        products[index] = { ...products[index], ...updateData, id };
        await this._writeFile(products);

        return products[index];
    }

    async delete(id) {
        let products = await this._readFile();
        const initialLength = products.length;

        products = products.filter(product => product.id !== id);

        if (products.length === initialLength) throw new Error('Product not found');
        
        await this._writeFile(products);

        return { message: `Product with id ${id} deleted` };
    }
}

module.exports = ProductManager;