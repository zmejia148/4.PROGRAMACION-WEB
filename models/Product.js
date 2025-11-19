class Product {
    constructor(id, name, description, price, imageUrl, categoryId, stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.stock = stock;
    }
}

module.exports = Product;
