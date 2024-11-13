const fs = require('fs');
const path = require('path');

class ProductManager{
    constructor(){
        this.filePath = path
    }

    async _readFile(){
      try {
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return[];
      }
    };

    async _writeFile(data) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async getAllProducts(){
        return await this._readFile();

    }

    async getProductById(id){
        const products = await this.getAllProducts();
        return products.find((product) => product.id === Number(id));
    }
    
    async addProduct({title, description, code, price, status, stock, category, thumbnails}){
        const products = await this.getAllProducts();
        const newId = products.length > 0 ? products[products.length -1].id + 1 : 1;
        const newProduct ={
            id: newId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        products.push(newProduct);
        await this._writeFile(products);
        return newProduct;
    }

    async updateProduct(id, updateD) {
        const products = await this.getAllProducts();
        const productI = products.findIndex((product) => product.id === Number(id));
        if (productI === -1){
            return null
        }

        products[productI] = { ...products[productI], ...updateD};
        await this._writeFile(products);
        return products[productI];
    }

    async deleteProduct(id){
        const products = await this.getAllProducts();
        const newProducts = products.filter((product) => product.id !== Number(id));
        await this._writeFile(newProducts);
    }
}

module.exports = ProductManager;