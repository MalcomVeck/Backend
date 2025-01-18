import fs from 'fs/promises';

class ManagerCart {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al leer los carritos:', error);
            return [];
        }
    }

    async writeCarts(carts) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
            return true;
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
            return false;
        }
    }

    async createCart() {
        const cartId = Math.floor(Math.random() * 100000);
        const newCart = { id: cartId, products: [] };
        const carts = await this.readCarts();
        carts.push(newCart);
        await this.writeCarts(carts);
        return newCart;
    }

    async getCartById(cartId) {
        const carts = await this.readCarts();
        return carts.find(c => c.id === Number(cartId));
    }

    async deleteCart(cartId) {
        const carts = await this.readCarts();
        const index = carts.findIndex(c => c.id === Number(cartId));
        if (index === -1) return false;
        carts.splice(index, 1);
        await this.writeCarts(carts);
        return true;
    }

    async addProductToCart(cartId, product) {
        const carts = await this.readCarts();
        const cart = carts.find(c => c.id === Number(cartId));
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ id: product.id, quantity: 1 });
        }

        await this.writeCarts(carts);
        return cart;
    }
}

export default ManagerCart;