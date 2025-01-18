import fs from 'fs'

class managerProducts {
    getProducts = async () => {
        try {
            const productsList = await fs.promises.readFile('src/db/products.json', 'utf-8');
            const productsConverted = JSON.parse(productsList);
            return productsConverted;
        } catch (error) {
            return [];
        }
    }

    saveProducts = async (products) => {
        try {
            const parsedProducts = JSON.stringify(products, null, 2);
            await fs.promises.writeFile('src/db/products.json', parsedProducts, 'utf-8');
            return true;
        } catch (error) {
            console.log({error});
            return false;
        }
    }

    getSingleProductsById = async (pId) => {
        const products = await this.getProducts();
        const product = products.find(p => p.id === pId);
        return product;
    }
}

export default managerProducts;